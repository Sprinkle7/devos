import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getDevaiosHome, nowIso } from "@devaios/shared-kernel";
import { log } from "./log.js";
import type { JobTemplate } from "./job-templates.js";
import { listWorkspaceJobTemplates, isTemplateInWindow } from "./job-templates.js";
import { pushTemplateRunNotifications } from "./template-run-notifications.js";
import { maybeRotateEmailDeliveryLogOnTick } from "./template-notification-email.js";
import { maybeCheckDeadLetterHashIndexOnTick } from "./template-notification-webhook.js";

export type TemplateDryRunDetail = {
  backupPath?: string | null;
  workspaces: { total: number; insert: number; skip: number; replace: number };
  projects: { total: number; insert: number; skip: number; replace: number };
};

export type TemplateRunRecord = {
  workspaceSlug: string;
  templateId: string;
  kind: JobTemplate["kind"];
  lastRunAt: string;
  lastPath?: string | null;
  lastError?: string | null;
  dryRunSummary?: string | null;
  dryRunDetail?: TemplateDryRunDetail | null;
};

type TemplateRunStateFile = {
  version: 1;
  runs: Record<string, TemplateRunRecord>;
};

function runStatePath(home = getDevaiosHome()) {
  return join(home, "job-template-runs.json");
}

function runKey(workspaceSlug: string, templateId: string) {
  return `${workspaceSlug}:${templateId}`;
}

async function loadRunState(home = getDevaiosHome()): Promise<TemplateRunStateFile> {
  await mkdir(home, { recursive: true });
  try {
    return JSON.parse(await readFile(runStatePath(home), "utf8")) as TemplateRunStateFile;
  } catch {
    return { version: 1, runs: {} };
  }
}

async function saveRunState(state: TemplateRunStateFile, home = getDevaiosHome()): Promise<void> {
  await writeFile(runStatePath(home), JSON.stringify(state, null, 2) + "\n", "utf8");
}

export async function listTemplateRunState(
  home = getDevaiosHome(),
  workspaceSlug?: string,
): Promise<TemplateRunRecord[]> {
  const state = await loadRunState(home);
  const rows = Object.values(state.runs);
  if (!workspaceSlug) return rows.sort((a, b) => b.lastRunAt.localeCompare(a.lastRunAt));
  return rows
    .filter((r) => r.workspaceSlug === workspaceSlug)
    .sort((a, b) => b.lastRunAt.localeCompare(a.lastRunAt));
}

function isDue(record: TemplateRunRecord | undefined, intervalMinutes: number): boolean {
  if (!record?.lastRunAt) return true;
  const elapsed = Date.now() - new Date(record.lastRunAt).getTime();
  return elapsed >= intervalMinutes * 60_000;
}

export type TemplateExecuteResult = {
  path?: string;
  dryRunSummary?: string;
  dryRunDetail?: TemplateDryRunDetail;
} | null;

export type TemplateRunners = {
  backup: (template: JobTemplate, workspaceSlug: string) => Promise<TemplateExecuteResult>;
  archive_export: (template: JobTemplate, workspaceSlug: string) => Promise<TemplateExecuteResult>;
  batch_restore: (template: JobTemplate, workspaceSlug: string) => Promise<TemplateExecuteResult>;
};

export async function runWorkspaceJobTemplates(
  workspaceSlug: string,
  runners: TemplateRunners,
  home = getDevaiosHome(),
  options?: { force?: boolean },
): Promise<{ executed: TemplateRunRecord[]; skipped: string[] }> {
  const templates = await listWorkspaceJobTemplates(workspaceSlug, home);
  const state = await loadRunState(home);
  const executed: TemplateRunRecord[] = [];
  const skipped: string[] = [];

  for (const template of templates) {
    if (!template.enabled) {
      skipped.push(`${template.id}:disabled`);
      continue;
    }
    if (!isTemplateInWindow(template)) {
      skipped.push(`${template.id}:outside_window`);
      continue;
    }
    const key = runKey(workspaceSlug, template.id);
    const prev = state.runs[key];
    if (!options?.force && !isDue(prev, template.intervalMinutes)) {
      skipped.push(`${template.id}:not_due`);
      continue;
    }

    const record: TemplateRunRecord = {
      workspaceSlug,
      templateId: template.id,
      kind: template.kind,
      lastRunAt: nowIso(),
    };

    try {
      const result =
        template.kind === "backup" ?
          await runners.backup(template, workspaceSlug)
        : template.kind === "archive_export" ?
          await runners.archive_export(template, workspaceSlug)
        : await runners.batch_restore(template, workspaceSlug);
      record.lastPath = result?.path ?? null;
      record.dryRunSummary = result?.dryRunSummary ?? null;
      record.dryRunDetail = result?.dryRunDetail ?? null;
      state.runs[key] = record;
      executed.push(record);
      log("info", "job_template.executed", { workspaceSlug, templateId: template.id, kind: template.kind });
    } catch (err) {
      record.lastError = String(err);
      state.runs[key] = record;
      executed.push(record);
      log("error", "job_template.failed", { workspaceSlug, templateId: template.id, err: String(err) });
    }
  }

  await saveRunState(state, home);
  if (executed.length) {
    await pushTemplateRunNotifications(executed, home);
  }
  return { executed, skipped };
}

export async function runAllDueJobTemplates(
  workspaceSlugs: string[],
  runners: TemplateRunners,
  home = getDevaiosHome(),
): Promise<{ executed: TemplateRunRecord[]; skipped: string[] }> {
  const allExecuted: TemplateRunRecord[] = [];
  const allSkipped: string[] = [];
  for (const slug of workspaceSlugs) {
    const result = await runWorkspaceJobTemplates(slug, runners, home);
    allExecuted.push(...result.executed);
    allSkipped.push(...result.skipped.map((s) => `${slug}:${s}`));
  }
  return { executed: allExecuted, skipped: allSkipped };
}

export function startJobTemplateRunner(
  workspaceSlugs: () => Promise<string[]>,
  runners: TemplateRunners,
  home = getDevaiosHome(),
): () => void {
  let timer: ReturnType<typeof setInterval> | null = null;
  let running = false;

  const tick = async () => {
    if (running) return;
    running = true;
    try {
      const slugs = await workspaceSlugs();
      await maybeRotateEmailDeliveryLogOnTick(home);
      await maybeCheckDeadLetterHashIndexOnTick(home);
      await runAllDueJobTemplates(slugs, runners, home);
    } catch (err) {
      log("error", "job_template.runner.failed", { err: String(err) });
    } finally {
      running = false;
    }
  };

  timer = setInterval(() => {
    void tick();
  }, 60_000);
  log("info", "job_template.runner.started", { intervalSec: 60 });

  return () => {
    if (timer) clearInterval(timer);
  };
}
