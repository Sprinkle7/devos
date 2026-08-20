import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getDevaiosHome } from "@devaios/shared-kernel";

export type JobTemplateKind = "backup" | "archive_export" | "batch_restore";

export type JobTemplate = {
  id: string;
  kind: JobTemplateKind;
  label: string;
  intervalMinutes: number;
  encrypt?: boolean;
  sign?: boolean;
  enabled: boolean;
  windowStartHour?: number | null;
  windowEndHour?: number | null;
  passphrase?: string | null;
  conflictPolicy?: "skip" | "replace";
  dryRunBeforeApply?: boolean;
};

export function isTemplateInWindow(template: JobTemplate, date = new Date()): boolean {
  const start = template.windowStartHour;
  const end = template.windowEndHour;
  if (start == null && end == null) return true;
  if (start == null || end == null) return true;

  const hour = date.getHours();
  if (start <= end) return hour >= start && hour <= end;
  return hour >= start || hour <= end;
}

export type WorkspaceJobTemplates = {
  workspaceSlug: string;
  templates: JobTemplate[];
  updatedAt: string;
};

type JobTemplatesFile = {
  version: 1;
  workspaces: Record<string, WorkspaceJobTemplates>;
};

function templatesPath(home = getDevaiosHome()) {
  return join(home, "job-templates.json");
}

async function loadFile(home = getDevaiosHome()): Promise<JobTemplatesFile> {
  await mkdir(home, { recursive: true });
  try {
    return JSON.parse(await readFile(templatesPath(home), "utf8")) as JobTemplatesFile;
  } catch {
    return { version: 1, workspaces: {} };
  }
}

async function saveFile(file: JobTemplatesFile, home = getDevaiosHome()): Promise<void> {
  await writeFile(templatesPath(home), JSON.stringify(file, null, 2) + "\n", "utf8");
}

export async function listWorkspaceJobTemplates(
  workspaceSlug: string,
  home = getDevaiosHome(),
): Promise<JobTemplate[]> {
  const file = await loadFile(home);
  return file.workspaces[workspaceSlug]?.templates ?? [];
}

export async function saveWorkspaceJobTemplates(
  workspaceSlug: string,
  templates: JobTemplate[],
  home = getDevaiosHome(),
): Promise<WorkspaceJobTemplates> {
  const file = await loadFile(home);
  const row: WorkspaceJobTemplates = {
    workspaceSlug,
    templates,
    updatedAt: new Date().toISOString(),
  };
  file.workspaces[workspaceSlug] = row;
  await saveFile(file, home);
  return row;
}

export async function cloneWorkspaceJobTemplates(
  sourceSlug: string,
  targetSlug: string,
  home = getDevaiosHome(),
): Promise<{ cloned: number; templates: JobTemplate[] }> {
  const source = await listWorkspaceJobTemplates(sourceSlug, home);
  if (!source.length) return { cloned: 0, templates: [] };

  const cloned = source.map((t) => ({
    ...t,
    id: `${t.id}-clone-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  }));
  await saveWorkspaceJobTemplates(targetSlug, cloned, home);
  return { cloned: cloned.length, templates: cloned };
}

export function defaultJobTemplates(): JobTemplate[] {
  return [
    {
      id: "tpl-backup-daily",
      kind: "backup",
      label: "Daily signed backup",
      intervalMinutes: 1440,
      encrypt: true,
      sign: true,
      enabled: false,
    },
    {
      id: "tpl-archive-weekly",
      kind: "archive_export",
      label: "Weekly archive export",
      intervalMinutes: 10080,
      encrypt: false,
      sign: true,
      enabled: false,
    },
    {
      id: "tpl-batch-restore-weekly",
      kind: "batch_restore",
      label: "Weekly batch scoped restore",
      intervalMinutes: 10080,
      enabled: false,
      conflictPolicy: "skip",
      dryRunBeforeApply: true,
    },
  ];
}
