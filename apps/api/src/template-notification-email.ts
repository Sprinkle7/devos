import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getDevaiosHome, nowIso } from "@devaios/shared-kernel";
import type { TemplateRunNotification } from "./template-run-notifications.js";
import { sendSmtpMessage } from "./template-notification-smtp.js";

export type TemplateNotificationEmailConfig = {
  enabled: boolean;
  from: string | null;
  to: string | null;
  smtpHost: string | null;
  smtpPort: number | null;
  useOutbox: boolean;
  sendViaSmtp: boolean;
  smtpSecure: boolean;
  smtpUser: string | null;
  smtpPass: string | null;
};

export type EmailOutboxEntry = {
  id: string;
  createdAt: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  smtpHost: string | null;
  smtpPort: number | null;
};

export type EmailDeliveryLogEntry = {
  id: string;
  createdAt: string;
  channel: "outbox" | "smtp";
  status: "written" | "sent" | "failed" | "skipped";
  from: string;
  to: string;
  subject: string;
  smtpHost: string | null;
  smtpPort: number | null;
  outboxPath?: string | null;
  error?: string | null;
  notificationCount: number;
};

type EmailFile = {
  version: 1;
  config: TemplateNotificationEmailConfig;
};

type DeliveryLogFile = {
  version: 1;
  entries: EmailDeliveryLogEntry[];
};

function emailConfigPath(home = getDevaiosHome()) {
  return join(home, "template-notification-email.json");
}

function outboxDir(home = getDevaiosHome()) {
  return join(home, "email-outbox");
}

function deliveryLogPath(home = getDevaiosHome()) {
  return join(home, "email-delivery-log.json");
}

async function loadFile(home = getDevaiosHome()): Promise<EmailFile> {
  await mkdir(home, { recursive: true });
  try {
    return JSON.parse(await readFile(emailConfigPath(home), "utf8")) as EmailFile;
  } catch {
    return {
      version: 1,
      config: {
        enabled: false,
        from: null,
        to: null,
        smtpHost: null,
        smtpPort: null,
        useOutbox: true,
        sendViaSmtp: false,
        smtpSecure: false,
        smtpUser: null,
        smtpPass: null,
      },
    };
  }
}

async function saveFile(file: EmailFile, home = getDevaiosHome()): Promise<void> {
  await writeFile(emailConfigPath(home), JSON.stringify(file, null, 2) + "\n", "utf8");
}

async function loadDeliveryLog(home = getDevaiosHome()): Promise<DeliveryLogFile> {
  await mkdir(home, { recursive: true });
  try {
    return JSON.parse(await readFile(deliveryLogPath(home), "utf8")) as DeliveryLogFile;
  } catch {
    return { version: 1, entries: [] };
  }
}

async function saveDeliveryLog(file: DeliveryLogFile, home = getDevaiosHome()): Promise<void> {
  await writeFile(deliveryLogPath(home), JSON.stringify(file, null, 2) + "\n", "utf8");
}

async function loadRotationHistory(home = getDevaiosHome()): Promise<RotationHistoryFile> {
  await mkdir(home, { recursive: true });
  try {
    return JSON.parse(await readFile(rotationHistoryPath(home), "utf8")) as RotationHistoryFile;
  } catch {
    return { version: 1, entries: [] };
  }
}

async function saveRotationHistory(file: RotationHistoryFile, home = getDevaiosHome()): Promise<void> {
  await writeFile(rotationHistoryPath(home), JSON.stringify(file, null, 2) + "\n", "utf8");
}

async function appendRotationHistory(
  entry: EmailDeliveryRotationHistoryEntry,
  home = getDevaiosHome(),
): Promise<void> {
  const policy = await loadEmailDeliveryRetention(home);
  const file = await loadRotationHistory(home);
  file.entries.unshift(entry);
  const cutoff = Date.now() - policy.rotationHistoryMaxAgeDays * 86_400_000;
  file.entries = file.entries
    .filter((e) => Date.parse(e.rotatedAt) >= cutoff)
    .slice(0, policy.rotationHistoryMaxCount);
  await saveRotationHistory(file, home);
}

export async function rotateEmailDeliveryRotationHistory(
  home = getDevaiosHome(),
  policyPatch?: Partial<EmailDeliveryRetentionPolicy>,
): Promise<{ deleted: number; kept: number }> {
  const policy = { ...(await loadEmailDeliveryRetention(home)), ...policyPatch };
  const file = await loadRotationHistory(home);
  const cutoff = Date.now() - policy.rotationHistoryMaxAgeDays * 86_400_000;
  const kept = file.entries.filter((e) => Date.parse(e.rotatedAt) >= cutoff).slice(0, policy.rotationHistoryMaxCount);
  const deleted = file.entries.length - kept.length;
  file.entries = kept;
  await saveRotationHistory(file, home);
  return { deleted, kept: kept.length };
}

async function appendEmailDeliveryLog(
  entry: Omit<EmailDeliveryLogEntry, "id" | "createdAt">,
  home = getDevaiosHome(),
): Promise<EmailDeliveryLogEntry> {
  const file = await loadDeliveryLog(home);
  const row: EmailDeliveryLogEntry = {
    id: nowIso().replace(/[:.]/g, "-"),
    createdAt: nowIso(),
    ...entry,
  };
  file.entries.unshift(row);
  file.entries = file.entries.slice(0, 500);
  await saveDeliveryLog(file, home);
  return row;
}

export async function loadTemplateNotificationEmail(
  home = getDevaiosHome(),
): Promise<TemplateNotificationEmailConfig> {
  const file = await loadFile(home);
  return {
    enabled: file.config.enabled,
    from: file.config.from,
    to: file.config.to,
    smtpHost: file.config.smtpHost,
    smtpPort: file.config.smtpPort,
    useOutbox: file.config.useOutbox !== false,
    sendViaSmtp: file.config.sendViaSmtp ?? false,
    smtpSecure: file.config.smtpSecure ?? false,
    smtpUser: file.config.smtpUser ?? null,
    smtpPass: file.config.smtpPass ?? null,
  };
}

export async function saveTemplateNotificationEmail(
  config: TemplateNotificationEmailConfig,
  home = getDevaiosHome(),
): Promise<TemplateNotificationEmailConfig> {
  const file = await loadFile(home);
  file.config = config;
  await saveFile(file, home);
  return file.config;
}

function buildEmailBody(notifications: TemplateRunNotification[]): { subject: string; body: string } {
  const subject = `DEVAIOS template runs (${notifications.length})`;
  const lines = notifications.map(
    (n) =>
      `[${n.status}] ${n.workspaceSlug}/${n.templateId} (${n.kind}) — ${n.message}${n.path ? ` → ${n.path}` : ""}`,
  );
  return { subject, body: lines.join("\n") };
}

export async function listEmailOutbox(home = getDevaiosHome(), limit = 20): Promise<EmailOutboxEntry[]> {
  const dir = outboxDir(home);
  await mkdir(dir, { recursive: true });
  const files = (await readdir(dir)).filter((f) => f.endsWith(".json")).sort().reverse();
  const rows: EmailOutboxEntry[] = [];
  for (const file of files.slice(0, limit)) {
    rows.push(JSON.parse(await readFile(join(dir, file), "utf8")) as EmailOutboxEntry);
  }
  return rows;
}

export async function listEmailDeliveryLog(
  home = getDevaiosHome(),
  limit = 50,
  filters: EmailDeliveryLogFilters = {},
): Promise<EmailDeliveryLogEntry[]> {
  const file = await loadDeliveryLog(home);
  let rows = file.entries;
  if (filters.channel) rows = rows.filter((e) => e.channel === filters.channel);
  if (filters.status) rows = rows.filter((e) => e.status === filters.status);
  return rows.slice(0, limit);
}

export type EmailDeliveryLogFilters = {
  channel?: EmailDeliveryLogEntry["channel"];
  status?: EmailDeliveryLogEntry["status"];
};

export type EmailDeliveryRetentionPolicy = {
  maxCount: number;
  maxAgeDays: number;
  rotateIntervalHours: number;
  rotationHistoryMaxCount: number;
  rotationHistoryMaxAgeDays: number;
  lastRotatedAt?: string | null;
};

function deliveryRetentionPath(home = getDevaiosHome()) {
  return join(home, "email-delivery-retention.json");
}

function rotationHistoryPath(home = getDevaiosHome()) {
  return join(home, "email-delivery-rotation-history.json");
}

export type EmailDeliveryRotationHistoryEntry = {
  rotatedAt: string;
  deleted: number;
  kept: number;
  trigger: "manual" | "tick" | "repair";
};

type RotationHistoryFile = {
  version: 1;
  entries: EmailDeliveryRotationHistoryEntry[];
};

const defaultDeliveryRetention = (): EmailDeliveryRetentionPolicy => ({
  maxCount: 200,
  maxAgeDays: 30,
  rotateIntervalHours: 24,
  rotationHistoryMaxCount: 100,
  rotationHistoryMaxAgeDays: 90,
  lastRotatedAt: null,
});

export async function loadEmailDeliveryRetention(
  home = getDevaiosHome(),
): Promise<EmailDeliveryRetentionPolicy> {
  await mkdir(home, { recursive: true });
  try {
    const raw = JSON.parse(await readFile(deliveryRetentionPath(home), "utf8")) as Partial<EmailDeliveryRetentionPolicy>;
    return { ...defaultDeliveryRetention(), ...raw };
  } catch {
    return defaultDeliveryRetention();
  }
}

export async function saveEmailDeliveryRetention(
  patch: Partial<EmailDeliveryRetentionPolicy>,
  home = getDevaiosHome(),
): Promise<EmailDeliveryRetentionPolicy> {
  const current = await loadEmailDeliveryRetention(home);
  const next = { ...current, ...patch };
  await writeFile(deliveryRetentionPath(home), JSON.stringify(next, null, 2) + "\n", "utf8");
  return next;
}

export async function rotateEmailDeliveryLog(
  home = getDevaiosHome(),
  policy?: Partial<EmailDeliveryRetentionPolicy>,
  options?: { trigger?: "manual" | "tick" },
): Promise<{ deleted: number; kept: number; policy: EmailDeliveryRetentionPolicy }> {
  const resolved = { ...(await loadEmailDeliveryRetention(home)), ...policy };
  const file = await loadDeliveryLog(home);
  const cutoff = Date.now() - resolved.maxAgeDays * 86_400_000;
  const keptByAge = file.entries.filter((e) => Date.parse(e.createdAt) >= cutoff);
  const kept = keptByAge.slice(0, resolved.maxCount);
  const deleted = file.entries.length - kept.length;
  file.entries = kept;
  await saveDeliveryLog(file, home);
  const rotatedAt = nowIso();
  await saveEmailDeliveryRetention({ lastRotatedAt: rotatedAt }, home);
  await appendRotationHistory(
    { rotatedAt, deleted, kept: kept.length, trigger: options?.trigger ?? "manual" },
    home,
  );
  return { deleted, kept: kept.length, policy: { ...resolved, lastRotatedAt: rotatedAt } };
}

export async function listEmailDeliveryRotationHistory(
  home = getDevaiosHome(),
  limit = 20,
): Promise<EmailDeliveryRotationHistoryEntry[]> {
  const file = await loadRotationHistory(home);
  return file.entries.slice(0, limit);
}

export async function exportEmailDeliveryRotationHistoryCsv(
  home = getDevaiosHome(),
  limit = 500,
): Promise<{ path: string; count: number }> {
  const entries = await listEmailDeliveryRotationHistory(home, limit);
  const dir = join(home, "exports");
  await mkdir(dir, { recursive: true });
  const stamp = nowIso().replace(/[:.]/g, "-");
  const path = join(dir, `email-rotation-history-${stamp}.csv`);
  const lines = [
    "rotatedAt,deleted,kept,trigger",
    ...entries.map((e) => `${e.rotatedAt},${e.deleted},${e.kept},${e.trigger}`),
  ];
  await writeFile(path, lines.join("\n") + "\n", "utf8");
  return { path, count: entries.length };
}

export async function checkEmailDeliveryRotationIntegrity(home = getDevaiosHome()) {
  const metrics = await getEmailDeliveryLogMetrics(home);
  const history = await loadRotationHistory(home);
  const latest = history.entries[0] ?? null;
  if (!metrics.lastRotatedAt && !latest) {
    return {
      ok: true,
      entryCount: metrics.entryCount,
      historyCount: history.entries.length,
      lastRotatedAt: metrics.lastRotatedAt,
      latestHistory: latest,
      mismatch: null,
    };
  }
  let ok = true;
  let mismatch: string | null = null;
  if (metrics.lastRotatedAt && latest) {
    if (latest.rotatedAt !== metrics.lastRotatedAt) {
      ok = false;
      mismatch = "last_rotated_at_mismatch";
    }
    if (latest.kept !== metrics.entryCount) {
      ok = false;
      mismatch = mismatch ? `${mismatch},kept_count_mismatch` : "kept_count_mismatch";
    }
  } else if (metrics.lastRotatedAt && !latest) {
    ok = false;
    mismatch = "missing_history_entry";
  } else if (!metrics.lastRotatedAt && latest) {
    ok = false;
    mismatch = "orphan_history_entry";
  }
  return {
    ok,
    entryCount: metrics.entryCount,
    historyCount: history.entries.length,
    lastRotatedAt: metrics.lastRotatedAt,
    latestHistory: latest,
    mismatch,
  };
}

export async function repairEmailDeliveryRotationIntegrity(home = getDevaiosHome()) {
  const before = await checkEmailDeliveryRotationIntegrity(home);
  if (before.ok) {
    await appendRotationRepairAudit(
      {
        repairedAt: nowIso(),
        repaired: false,
        ok: true,
        beforeMismatch: null,
        entryCount: before.entryCount,
      },
      home,
    );
    return { repaired: false, ok: true, before, after: before };
  }

  const metrics = await getEmailDeliveryLogMetrics(home);
  const rotatedAt = metrics.lastRotatedAt ?? nowIso();
  if (!metrics.lastRotatedAt) {
    await saveEmailDeliveryRetention({ lastRotatedAt: rotatedAt }, home);
  }

  const history = await loadRotationHistory(home);
  if (history.entries[0]) {
    history.entries[0].rotatedAt = rotatedAt;
    history.entries[0].kept = metrics.entryCount;
    history.entries[0].trigger = "repair";
    await saveRotationHistory(history, home);
  } else {
    await appendRotationHistory(
      { rotatedAt, deleted: 0, kept: metrics.entryCount, trigger: "repair" },
      home,
    );
  }

  const after = await checkEmailDeliveryRotationIntegrity(home);
  await appendRotationRepairAudit(
    {
      repairedAt: nowIso(),
      repaired: !before.ok,
      ok: after.ok,
      beforeMismatch: before.mismatch,
      entryCount: after.entryCount,
    },
    home,
  );
  return { repaired: !before.ok, ok: after.ok, before, after };
}

type RotationRepairAuditEntry = {
  repairedAt: string;
  repaired: boolean;
  ok: boolean;
  beforeMismatch: string | null;
  entryCount: number;
};

type RotationRepairAuditFile = {
  version: 1;
  entries: RotationRepairAuditEntry[];
};

function rotationRepairAuditPath(home = getDevaiosHome()) {
  return join(home, "email-rotation-repair-audit.json");
}

function rotationRepairAuditRetentionPath(home = getDevaiosHome()) {
  return join(home, "email-rotation-repair-audit-retention.json");
}

export type RotationRepairAuditRetentionPolicy = {
  maxCount: number;
  maxAgeDays: number;
};

export const ROTATION_REPAIR_AUDIT_RETENTION_DEFAULTS: RotationRepairAuditRetentionPolicy = {
  maxCount: 200,
  maxAgeDays: 365,
};

const defaultRotationRepairAuditRetention = (): RotationRepairAuditRetentionPolicy => ({
  ...ROTATION_REPAIR_AUDIT_RETENTION_DEFAULTS,
});

export async function loadRotationRepairAuditRetention(
  home = getDevaiosHome(),
): Promise<RotationRepairAuditRetentionPolicy> {
  await mkdir(home, { recursive: true });
  try {
    const raw = JSON.parse(
      await readFile(rotationRepairAuditRetentionPath(home), "utf8"),
    ) as Partial<RotationRepairAuditRetentionPolicy>;
    return { ...defaultRotationRepairAuditRetention(), ...raw };
  } catch {
    return defaultRotationRepairAuditRetention();
  }
}

export async function saveRotationRepairAuditRetention(
  patch: Partial<RotationRepairAuditRetentionPolicy>,
  home = getDevaiosHome(),
): Promise<{
  policy: RotationRepairAuditRetentionPolicy;
  previous: RotationRepairAuditRetentionPolicy;
  changed: { maxCount: boolean; maxAgeDays: boolean };
}> {
  const previous = await loadRotationRepairAuditRetention(home);
  const policy = { ...previous, ...patch };
  await writeFile(rotationRepairAuditRetentionPath(home), JSON.stringify(policy, null, 2) + "\n", "utf8");
  return {
    policy,
    previous,
    changed: {
      maxCount: policy.maxCount !== previous.maxCount,
      maxAgeDays: policy.maxAgeDays !== previous.maxAgeDays,
    },
  };
}

export async function resetRotationRepairAuditRetention(home = getDevaiosHome()) {
  const previous = await loadRotationRepairAuditRetention(home);
  const policy = defaultRotationRepairAuditRetention();
  await writeFile(rotationRepairAuditRetentionPath(home), JSON.stringify(policy, null, 2) + "\n", "utf8");
  return {
    policy,
    previous,
    changed: {
      maxCount: policy.maxCount !== previous.maxCount,
      maxAgeDays: policy.maxAgeDays !== previous.maxAgeDays,
    },
  };
}

async function trimRotationRepairAudit(file: RotationRepairAuditFile, home = getDevaiosHome()) {
  const policy = await loadRotationRepairAuditRetention(home);
  const cutoff = Date.now() - policy.maxAgeDays * 86_400_000;
  file.entries = file.entries
    .filter((e) => Date.parse(e.repairedAt) >= cutoff)
    .slice(0, policy.maxCount);
}

export async function rotateRotationRepairAudit(
  home = getDevaiosHome(),
  policyPatch?: Partial<RotationRepairAuditRetentionPolicy>,
): Promise<{ deleted: number; kept: number; policy: RotationRepairAuditRetentionPolicy }> {
  const policy = { ...(await loadRotationRepairAuditRetention(home)), ...policyPatch };
  await saveRotationRepairAuditRetention(policy, home);
  let file: RotationRepairAuditFile;
  try {
    file = JSON.parse(await readFile(rotationRepairAuditPath(home), "utf8")) as RotationRepairAuditFile;
  } catch {
    return { deleted: 0, kept: 0, policy };
  }
  const before = file.entries.length;
  await trimRotationRepairAudit(file, home);
  await writeFile(rotationRepairAuditPath(home), JSON.stringify(file, null, 2) + "\n", "utf8");
  return { deleted: before - file.entries.length, kept: file.entries.length, policy };
}

async function appendRotationRepairAudit(entry: RotationRepairAuditEntry, home = getDevaiosHome()) {
  await mkdir(home, { recursive: true });
  let file: RotationRepairAuditFile;
  try {
    file = JSON.parse(await readFile(rotationRepairAuditPath(home), "utf8")) as RotationRepairAuditFile;
  } catch {
    file = { version: 1, entries: [] };
  }
  file.entries.unshift(entry);
  await trimRotationRepairAudit(file, home);
  await writeFile(rotationRepairAuditPath(home), JSON.stringify(file, null, 2) + "\n", "utf8");
}

export async function listRotationRepairAudit(home = getDevaiosHome(), limit = 20) {
  await mkdir(home, { recursive: true });
  try {
    const file = JSON.parse(await readFile(rotationRepairAuditPath(home), "utf8")) as RotationRepairAuditFile;
    return file.entries.slice(0, limit);
  } catch {
    return [];
  }
}

export async function exportRotationRepairAuditCsv(home = getDevaiosHome(), limit = 500) {
  const entries = await listRotationRepairAudit(home, limit);
  const dir = join(home, "exports");
  await mkdir(dir, { recursive: true });
  const stamp = nowIso().replace(/[:.]/g, "-");
  const path = join(dir, `email-rotation-repair-audit-${stamp}.csv`);
  const lines = [
    "repairedAt,repaired,ok,beforeMismatch,entryCount",
    ...entries.map(
      (e) =>
        `${e.repairedAt},${e.repaired},${e.ok},${e.beforeMismatch ?? ""},${e.entryCount}`,
    ),
  ];
  await writeFile(path, lines.join("\n") + "\n", "utf8");
  return { path, count: entries.length };
}

export async function maybeRotateEmailDeliveryLogOnTick(
  home = getDevaiosHome(),
): Promise<{ rotated: boolean; deleted?: number; kept?: number }> {
  const policy = await loadEmailDeliveryRetention(home);
  const intervalMs = policy.rotateIntervalHours * 3_600_000;
  const last = policy.lastRotatedAt ? Date.parse(policy.lastRotatedAt) : 0;
  if (last && Date.now() - last < intervalMs) return { rotated: false };
  const result = await rotateEmailDeliveryLog(home, undefined, { trigger: "tick" });
  return { rotated: true, deleted: result.deleted, kept: result.kept };
}

export async function getEmailDeliveryLogMetrics(home = getDevaiosHome()) {
  const policy = await loadEmailDeliveryRetention(home);
  const file = await loadDeliveryLog(home);
  const lastMs = policy.lastRotatedAt ? Date.parse(policy.lastRotatedAt) : 0;
  const nextRotateAt =
    lastMs ?
      new Date(lastMs + policy.rotateIntervalHours * 3_600_000).toISOString()
    : null;
  return {
    entryCount: file.entries.length,
    lastRotatedAt: policy.lastRotatedAt ?? null,
    rotateIntervalHours: policy.rotateIntervalHours,
    nextRotateAt,
    maxCount: policy.maxCount,
    maxAgeDays: policy.maxAgeDays,
    rotationHistoryCount: (await loadRotationHistory(home)).entries.length,
    rotationHistoryMaxCount: policy.rotationHistoryMaxCount,
    rotationHistoryMaxAgeDays: policy.rotationHistoryMaxAgeDays,
  };
}

export async function dispatchTemplateNotificationEmail(
  notifications: TemplateRunNotification[],
  home = getDevaiosHome(),
): Promise<{ dispatched: boolean; outboxPath?: string; smtpSent?: boolean; smtpError?: string }> {
  if (!notifications.length) return { dispatched: false };
  const config = await loadTemplateNotificationEmail(home);
  if (!config.enabled || !config.from || !config.to) return { dispatched: false };

  const { subject, body } = buildEmailBody(notifications);
  const entry: EmailOutboxEntry = {
    id: nowIso().replace(/[:.]/g, "-"),
    createdAt: nowIso(),
    from: config.from,
    to: config.to,
    subject,
    body,
    smtpHost: config.smtpHost,
    smtpPort: config.smtpPort,
  };

  let outboxPath: string | undefined;
  if (config.useOutbox !== false) {
    const dir = outboxDir(home);
    await mkdir(dir, { recursive: true });
    outboxPath = join(dir, `template-${entry.id}.json`);
    await writeFile(outboxPath, JSON.stringify(entry, null, 2) + "\n", "utf8");
    await appendEmailDeliveryLog(
      {
        channel: "outbox",
        status: "written",
        from: config.from,
        to: config.to,
        subject,
        smtpHost: config.smtpHost,
        smtpPort: config.smtpPort,
        outboxPath,
        notificationCount: notifications.length,
      },
      home,
    );
  }

  if (config.sendViaSmtp && config.smtpHost && config.smtpPort) {
    const smtp = await sendSmtpMessage({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure || config.smtpPort === 465,
      from: config.from,
      to: config.to,
      subject,
      body,
      user: config.smtpUser,
      pass: config.smtpPass ?? process.env.DEVAIO_SMTP_PASS ?? null,
    });
    await appendEmailDeliveryLog(
      {
        channel: "smtp",
        status: smtp.ok ? "sent" : "failed",
        from: config.from,
        to: config.to,
        subject,
        smtpHost: config.smtpHost,
        smtpPort: config.smtpPort,
        outboxPath: outboxPath ?? null,
        error: smtp.error ?? null,
        notificationCount: notifications.length,
      },
      home,
    );
    return {
      dispatched: true,
      outboxPath,
      smtpSent: smtp.ok,
      smtpError: smtp.error,
    };
  }

  if (!outboxPath) {
    await appendEmailDeliveryLog(
      {
        channel: "outbox",
        status: "skipped",
        from: config.from,
        to: config.to,
        subject,
        smtpHost: config.smtpHost,
        smtpPort: config.smtpPort,
        error: "outbox_disabled",
        notificationCount: notifications.length,
      },
      home,
    );
  }

  return { dispatched: Boolean(outboxPath), outboxPath };
}
