import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { getDevaiosHome, nowIso } from "@devaios/shared-kernel";
import type { TemplateRunRecord, TemplateDryRunDetail } from "./job-template-runner.js";
import { dispatchTemplateNotificationWebhook } from "./template-notification-webhook.js";
import { dispatchTemplateNotificationEmail } from "./template-notification-email.js";

export type TemplateRunNotification = {
  id: string;
  workspaceSlug: string;
  templateId: string;
  kind: string;
  status: "ok" | "error";
  message: string;
  path?: string | null;
  dryRunSummary?: string | null;
  dryRunDetail?: TemplateDryRunDetail | null;
  createdAt: string;
  read: boolean;
};

type NotificationsFile = {
  version: 1;
  notifications: TemplateRunNotification[];
};

function notificationsPath(home = getDevaiosHome()) {
  return join(home, "template-run-notifications.json");
}

async function loadFile(home = getDevaiosHome()): Promise<NotificationsFile> {
  await mkdir(home, { recursive: true });
  try {
    return JSON.parse(await readFile(notificationsPath(home), "utf8")) as NotificationsFile;
  } catch {
    return { version: 1, notifications: [] };
  }
}

async function saveFile(file: NotificationsFile, home = getDevaiosHome()): Promise<void> {
  await writeFile(notificationsPath(home), JSON.stringify(file, null, 2) + "\n", "utf8");
}

export async function pushTemplateRunNotifications(
  records: TemplateRunRecord[],
  home = getDevaiosHome(),
): Promise<TemplateRunNotification[]> {
  if (!records.length) return [];
  const file = await loadFile(home);
  const created: TemplateRunNotification[] = [];

  for (const record of records) {
    const status: TemplateRunNotification["status"] = record.lastError ? "error" : "ok";
    created.push({
      id: randomUUID(),
      workspaceSlug: record.workspaceSlug,
      templateId: record.templateId,
      kind: record.kind,
      status,
      message:
        status === "ok" ?
          record.dryRunSummary ?
            `Template ${record.templateId} completed (${record.dryRunSummary})`
          : `Template ${record.templateId} completed`
        : `Template ${record.templateId} failed: ${record.lastError?.slice(0, 120)}`,
      path: record.lastPath ?? null,
      dryRunSummary: record.dryRunSummary ?? null,
      dryRunDetail: record.dryRunDetail ?? null,
      createdAt: record.lastRunAt || nowIso(),
      read: false,
    });
  }

  file.notifications.unshift(...created);
  file.notifications = file.notifications.slice(0, 500);
  await saveFile(file, home);
  void dispatchTemplateNotificationWebhook(created, home);
  void dispatchTemplateNotificationEmail(created, home);
  return created;
}

export async function listTemplateRunNotifications(
  home = getDevaiosHome(),
  options?: { workspaceSlug?: string; unreadOnly?: boolean },
): Promise<TemplateRunNotification[]> {
  const file = await loadFile(home);
  let rows = file.notifications;
  if (options?.workspaceSlug) {
    rows = rows.filter((n) => n.workspaceSlug === options.workspaceSlug);
  }
  if (options?.unreadOnly) {
    rows = rows.filter((n) => !n.read);
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function markTemplateRunNotificationsRead(
  home = getDevaiosHome(),
  options?: { ids?: string[]; workspaceSlug?: string; all?: boolean },
): Promise<{ marked: number }> {
  const file = await loadFile(home);
  let marked = 0;

  for (const row of file.notifications) {
    const matchId = options?.ids?.length ? options.ids.includes(row.id) : false;
    const matchWorkspace =
      options?.all && options.workspaceSlug ? row.workspaceSlug === options.workspaceSlug : false;
    const matchAll = options?.all && !options.workspaceSlug;

    if (matchId || matchWorkspace || matchAll) {
      if (!row.read) {
        row.read = true;
        marked += 1;
      }
    }
  }

  await saveFile(file, home);
  return { marked };
}

export type DryRunExportPresetRange = "24h" | "7d" | "30d";

export const DRY_RUN_EXPORT_DEFAULT_LIMIT = 50;
export const DRY_RUN_EXPORT_LIMIT_PRESETS = [25, 50, 100] as const;

function resolveDryRunPresetRange(preset: DryRunExportPresetRange) {
  const untilMs = Date.now();
  const windowMs = preset === "24h" ? 86_400_000 : preset === "7d" ? 7 * 86_400_000 : 30 * 86_400_000;
  return {
    since: new Date(untilMs - windowMs).toISOString(),
    until: new Date(untilMs).toISOString(),
  };
}

function filterDryRunExportRows(
  notifications: TemplateRunNotification[],
  options?: {
    ids?: string[];
    workspaceSlug?: string;
    templateId?: string;
    since?: string;
    until?: string;
    presetRange?: DryRunExportPresetRange;
  },
  limit?: number,
) {
  const idFilter = options?.ids?.length ? new Set(options.ids) : null;
  const preset = options?.presetRange ? resolveDryRunPresetRange(options.presetRange) : null;
  const sinceMs =
    preset ? Date.parse(preset.since)
    : options?.since ? Date.parse(options.since)
    : null;
  const untilMs =
    preset ? Date.parse(preset.until)
    : options?.until ? Date.parse(options.until)
    : null;
  let rows = notifications.filter((n) => n.dryRunDetail);
  if (idFilter) rows = rows.filter((n) => idFilter.has(n.id));
  if (options?.workspaceSlug) rows = rows.filter((n) => n.workspaceSlug === options.workspaceSlug);
  if (options?.templateId) rows = rows.filter((n) => n.templateId === options.templateId);
  if (sinceMs != null && !Number.isNaN(sinceMs)) {
    rows = rows.filter((n) => Date.parse(n.createdAt) >= sinceMs);
  }
  if (untilMs != null && !Number.isNaN(untilMs)) {
    rows = rows.filter((n) => Date.parse(n.createdAt) <= untilMs);
  }
  if (limit != null) rows = rows.slice(0, limit);
  return rows;
}

export async function exportTemplateRunDryRunDetails(
  home = getDevaiosHome(),
  options?: {
    ids?: string[];
    limit?: number;
    workspaceSlug?: string;
    templateId?: string;
    since?: string;
    until?: string;
    presetRange?: DryRunExportPresetRange;
  },
): Promise<{
  path: string;
  count: number;
  matchCount: number;
  exportLimit: number;
  truncated: boolean;
  filters: {
    workspaceSlug: string | null;
    templateId: string | null;
    presetRange: DryRunExportPresetRange | null;
    since: string | null;
    until: string | null;
  };
}> {
  const file = await loadFile(home);
  const rows = filterDryRunExportRows(file.notifications, options, options?.limit ?? DRY_RUN_EXPORT_DEFAULT_LIMIT);
  const preset = options?.presetRange ? resolveDryRunPresetRange(options.presetRange) : null;
  const dir = join(home, "exports");
  await mkdir(dir, { recursive: true });
  const stamp = nowIso().replace(/[:.]/g, "-");
  const path = join(dir, `template-dry-run-${stamp}.json`);
  const payload = {
    exportedAt: nowIso(),
    count: rows.length,
    entries: rows.map((n) => ({
      id: n.id,
      workspaceSlug: n.workspaceSlug,
      templateId: n.templateId,
      kind: n.kind,
      status: n.status,
      createdAt: n.createdAt,
      dryRunSummary: n.dryRunSummary ?? null,
      dryRunDetail: n.dryRunDetail ?? null,
    })),
  };
  await writeFile(path, JSON.stringify(payload, null, 2) + "\n", "utf8");
  const allMatches = filterDryRunExportRows(file.notifications, options);
  const exportLimit = options?.limit ?? DRY_RUN_EXPORT_DEFAULT_LIMIT;
  return {
    path,
    count: rows.length,
    matchCount: allMatches.length,
    exportLimit,
    truncated: allMatches.length > rows.length,
    filters: {
      workspaceSlug: options?.workspaceSlug ?? null,
      templateId: options?.templateId ?? null,
      presetRange: options?.presetRange ?? null,
      since: preset?.since ?? options?.since ?? null,
      until: preset?.until ?? options?.until ?? null,
    },
  };
}

export async function previewTemplateRunDryRunExportFilters(
  home = getDevaiosHome(),
  options?: {
    workspaceSlug?: string;
    templateId?: string;
    since?: string;
    until?: string;
    presetRange?: DryRunExportPresetRange;
    limit?: number;
  },
) {
  const file = await loadFile(home);
  const exportLimit = options?.limit ?? DRY_RUN_EXPORT_DEFAULT_LIMIT;
  const allMatches = filterDryRunExportRows(file.notifications, options);
  const matchCount = allMatches.length;
  const exportCount = Math.min(matchCount, exportLimit);
  const preset = options?.presetRange ? resolveDryRunPresetRange(options.presetRange) : null;
  const badgeParts: string[] = [];
  if (options?.presetRange) badgeParts.push(options.presetRange);
  else if (options?.since || options?.until) badgeParts.push("custom");
  if (options?.workspaceSlug) badgeParts.push(options.workspaceSlug);
  if (options?.templateId) badgeParts.push(options.templateId);
  return {
    badgeParts,
    badge: badgeParts.length ? badgeParts.join(" · ") : null,
    matchCount,
    exportLimit,
    exportCount,
    truncated: matchCount > exportCount,
    limitPresets: [...DRY_RUN_EXPORT_LIMIT_PRESETS],
    filters: {
      workspaceSlug: options?.workspaceSlug ?? null,
      templateId: options?.templateId ?? null,
      presetRange: options?.presetRange ?? null,
      since: preset?.since ?? options?.since ?? null,
      until: preset?.until ?? options?.until ?? null,
    },
  };
}
