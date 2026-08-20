import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomUUID, createHash } from "node:crypto";
import { join } from "node:path";
import { getDevaiosHome, nowIso } from "@devaios/shared-kernel";
import type { TemplateRunNotification } from "./template-run-notifications.js";

export type TemplateNotificationWebhookConfig = {
  enabled: boolean;
  url: string | null;
  maxRetries: number;
};

export type WebhookDeadLetterEntry = {
  id: string;
  failedAt: string;
  url: string;
  attempts: number;
  lastStatus?: number;
  lastError?: string;
  payload: { notifications: TemplateRunNotification[]; sentAt: string };
};

type WebhookFile = {
  version: 1;
  config: TemplateNotificationWebhookConfig;
};

type DeadLetterFile = {
  version: 1;
  entries: WebhookDeadLetterEntry[];
};

function webhookPath(home = getDevaiosHome()) {
  return join(home, "template-notification-webhook.json");
}

function deadLetterPath(home = getDevaiosHome()) {
  return join(home, "template-webhook-dead-letter.json");
}

function deadLetterHashIndexPath(home = getDevaiosHome()) {
  return join(home, "template-webhook-dead-letter-hashes.json");
}

type DeadLetterHashIndexFile = {
  version: 1;
  hashes: string[];
};

type HashTickCheckMetrics = {
  lastCheckedAt: string | null;
  lastOk: boolean | null;
  lastRebuilt: boolean | null;
  checkCount: number;
};

type HashTickCheckMetricsFile = {
  version: 1;
  metrics: HashTickCheckMetrics;
};

function hashTickCheckMetricsPath(home = getDevaiosHome()) {
  return join(home, "template-webhook-hash-tick-metrics.json");
}

async function loadHashTickCheckMetrics(home = getDevaiosHome()): Promise<HashTickCheckMetrics> {
  await mkdir(home, { recursive: true });
  try {
    const file = JSON.parse(await readFile(hashTickCheckMetricsPath(home), "utf8")) as HashTickCheckMetricsFile;
    return file.metrics;
  } catch {
    return { lastCheckedAt: null, lastOk: null, lastRebuilt: null, checkCount: 0 };
  }
}

async function saveHashTickCheckMetrics(metrics: HashTickCheckMetrics, home = getDevaiosHome()) {
  await writeFile(
    hashTickCheckMetricsPath(home),
    JSON.stringify({ version: 1, metrics } satisfies HashTickCheckMetricsFile, null, 2) + "\n",
    "utf8",
  );
}

export async function getHashTickCheckMetrics(home = getDevaiosHome()) {
  return loadHashTickCheckMetrics(home);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function loadFile(home = getDevaiosHome()): Promise<WebhookFile> {
  await mkdir(home, { recursive: true });
  try {
    const file = JSON.parse(await readFile(webhookPath(home), "utf8")) as WebhookFile;
    return {
      version: 1,
      config: {
        enabled: file.config.enabled,
        url: file.config.url,
        maxRetries: file.config.maxRetries ?? 3,
      },
    };
  } catch {
    return { version: 1, config: { enabled: false, url: null, maxRetries: 3 } };
  }
}

async function saveFile(file: WebhookFile, home = getDevaiosHome()): Promise<void> {
  await writeFile(webhookPath(home), JSON.stringify(file, null, 2) + "\n", "utf8");
}

async function loadDeadLetter(home = getDevaiosHome()): Promise<DeadLetterFile> {
  await mkdir(home, { recursive: true });
  try {
    return JSON.parse(await readFile(deadLetterPath(home), "utf8")) as DeadLetterFile;
  } catch {
    return { version: 1, entries: [] };
  }
}

async function saveDeadLetter(file: DeadLetterFile, home = getDevaiosHome()): Promise<void> {
  await writeFile(deadLetterPath(home), JSON.stringify(file, null, 2) + "\n", "utf8");
  await syncDeadLetterHashIndex(file.entries, home);
}

function deadLetterPayloadHash(entry: Pick<WebhookDeadLetterEntry, "payload">): string {
  return createHash("sha256").update(JSON.stringify(entry.payload)).digest("hex").slice(0, 16);
}

async function syncDeadLetterHashIndex(
  entries: WebhookDeadLetterEntry[],
  home = getDevaiosHome(),
): Promise<Set<string>> {
  const hashes = [...new Set(entries.map((e) => deadLetterPayloadHash(e)))].slice(0, 500);
  await writeFile(
    deadLetterHashIndexPath(home),
    JSON.stringify({ version: 1, hashes } satisfies DeadLetterHashIndexFile, null, 2) + "\n",
    "utf8",
  );
  return new Set(hashes);
}

async function loadDeadLetterHashIndex(home = getDevaiosHome()): Promise<Set<string>> {
  await mkdir(home, { recursive: true });
  try {
    const file = JSON.parse(await readFile(deadLetterHashIndexPath(home), "utf8")) as DeadLetterHashIndexFile;
    return new Set(file.hashes);
  } catch {
    const dead = await loadDeadLetter(home);
    return syncDeadLetterHashIndex(dead.entries, home);
  }
}

export async function getDeadLetterHashIndexStats(home = getDevaiosHome()) {
  const hashes = await loadDeadLetterHashIndex(home);
  return { hashCount: hashes.size };
}

export async function rebuildDeadLetterHashIndex(home = getDevaiosHome()) {
  const dead = await loadDeadLetter(home);
  const hashes = await syncDeadLetterHashIndex(dead.entries, home);
  return { hashCount: hashes.size, entryCount: dead.entries.length };
}

export async function checkDeadLetterHashIndexIntegrity(
  home = getDevaiosHome(),
  options?: { autoRebuild?: boolean },
) {
  const dead = await loadDeadLetter(home);
  const entryHashes = new Set(dead.entries.map((e) => deadLetterPayloadHash(e)));
  const indexHashes = await loadDeadLetterHashIndex(home);
  let missingInIndex = 0;
  let orphanInIndex = 0;
  for (const hash of entryHashes) {
    if (!indexHashes.has(hash)) missingInIndex += 1;
  }
  for (const hash of indexHashes) {
    if (!entryHashes.has(hash)) orphanInIndex += 1;
  }
  const ok = missingInIndex === 0 && orphanInIndex === 0;
  if (ok || !options?.autoRebuild) {
    return {
      ok,
      hashCount: indexHashes.size,
      entryCount: dead.entries.length,
      missingInIndex,
      orphanInIndex,
      rebuilt: false,
    };
  }
  const rebuilt = await rebuildDeadLetterHashIndex(home);
  return {
    ok: true,
    hashCount: rebuilt.hashCount,
    entryCount: rebuilt.entryCount,
    missingInIndex: 0,
    orphanInIndex: 0,
    rebuilt: true,
  };
}

export async function maybeCheckDeadLetterHashIndexOnTick(home = getDevaiosHome()) {
  const result = await checkDeadLetterHashIndexIntegrity(home, { autoRebuild: true });
  const current = await loadHashTickCheckMetrics(home);
  await saveHashTickCheckMetrics(
    {
      lastCheckedAt: nowIso(),
      lastOk: result.ok,
      lastRebuilt: result.rebuilt ?? false,
      checkCount: current.checkCount + 1,
    },
    home,
  );
  return { checked: true, ok: result.ok, rebuilt: result.rebuilt ?? false };
}

export async function loadTemplateNotificationWebhook(
  home = getDevaiosHome(),
): Promise<TemplateNotificationWebhookConfig> {
  const file = await loadFile(home);
  return file.config;
}

export async function saveTemplateNotificationWebhook(
  config: TemplateNotificationWebhookConfig,
  home = getDevaiosHome(),
): Promise<TemplateNotificationWebhookConfig> {
  const file = await loadFile(home);
  file.config = {
    enabled: config.enabled,
    url: config.url,
    maxRetries: config.maxRetries ?? 3,
  };
  await saveFile(file, home);
  return file.config;
}

export async function listWebhookDeadLetters(
  home = getDevaiosHome(),
  limit = 50,
): Promise<WebhookDeadLetterEntry[]> {
  const file = await loadDeadLetter(home);
  return file.entries.slice(0, limit);
}

async function postWebhookPayload(
  url: string,
  payload: WebhookDeadLetterEntry["payload"],
): Promise<{ ok: boolean; status?: number; error?: string }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { ok: true, status: res.status };
    return { ok: false, status: res.status, error: `http_${res.status}` };
  } catch (err) {
    return { ok: false, status: 0, error: String(err) };
  }
}

export async function replayWebhookDeadLetters(
  home = getDevaiosHome(),
  options?: { ids?: string[]; all?: boolean; limit?: number },
): Promise<{ replayed: number; succeeded: number; failed: number; removedIds: string[] }> {
  const file = await loadDeadLetter(home);
  let targets = file.entries;
  if (options?.ids?.length) {
    const idSet = new Set(options.ids);
    targets = targets.filter((e) => idSet.has(e.id));
  } else if (!options?.all) {
    targets = targets.slice(0, options?.limit ?? 10);
  }

  const removedIds: string[] = [];
  let succeeded = 0;
  let failed = 0;

  for (const entry of targets) {
    const result = await postWebhookPayload(entry.url, entry.payload);
    if (result.ok) {
      succeeded += 1;
      removedIds.push(entry.id);
    } else {
      failed += 1;
      entry.attempts += 1;
      entry.lastStatus = result.status;
      entry.lastError = result.error;
      entry.failedAt = nowIso();
    }
  }

  if (removedIds.length) {
    file.entries = file.entries.filter((e) => !removedIds.includes(e.id));
    await saveDeadLetter(file, home);
  } else if (failed) {
    await saveDeadLetter(file, home);
  }

  return { replayed: targets.length, succeeded, failed, removedIds };
}

export async function deleteWebhookDeadLetters(
  home = getDevaiosHome(),
  options?: { ids?: string[]; all?: boolean },
): Promise<{ deleted: number; removedIds: string[] }> {
  const file = await loadDeadLetter(home);
  let removedIds: string[] = [];
  if (options?.all) {
    removedIds = file.entries.map((e) => e.id);
    file.entries = [];
  } else if (options?.ids?.length) {
    const idSet = new Set(options.ids);
    removedIds = file.entries.filter((e) => idSet.has(e.id)).map((e) => e.id);
    file.entries = file.entries.filter((e) => !idSet.has(e.id));
  }
  if (removedIds.length) await saveDeadLetter(file, home);
  return { deleted: removedIds.length, removedIds };
}

export async function exportWebhookDeadLetters(
  home = getDevaiosHome(),
  options?: { ids?: string[]; limit?: number },
): Promise<{ path: string; count: number }> {
  const file = await loadDeadLetter(home);
  let entries = file.entries;
  if (options?.ids?.length) {
    const idSet = new Set(options.ids);
    entries = entries.filter((e) => idSet.has(e.id));
  } else if (options?.limit) {
    entries = entries.slice(0, options.limit);
  }
  const dir = join(home, "exports");
  await mkdir(dir, { recursive: true });
  const stamp = nowIso().replace(/[:.]/g, "-");
  const path = join(dir, `webhook-dead-letter-${stamp}.json`);
  await writeFile(
    path,
    JSON.stringify({ exportedAt: nowIso(), count: entries.length, entries }, null, 2) + "\n",
    "utf8",
  );
  return { path, count: entries.length };
}

type WebhookDeadLetterExportFile = {
  exportedAt?: string;
  count?: number;
  entries: WebhookDeadLetterEntry[];
};

export async function importWebhookDeadLettersFromFile(
  exportPath: string,
  home = getDevaiosHome(),
  options?: { merge?: boolean },
): Promise<{
  imported: number;
  total: number;
  importedIds: string[];
  skippedDuplicateIds: number;
  skippedDuplicateHashes: number;
}> {
  const raw = JSON.parse(await readFile(exportPath, "utf8")) as WebhookDeadLetterExportFile;
  if (!Array.isArray(raw.entries)) throw new Error("dead_letter_export_invalid");
  const file = options?.merge === false ? { version: 1 as const, entries: [] as WebhookDeadLetterEntry[] } : await loadDeadLetter(home);
  const existingIds = new Set(file.entries.map((e) => e.id));
  const existingHashes = file.entries.length ? await loadDeadLetterHashIndex(home) : new Set<string>();
  const importedIds: string[] = [];
  let skippedDuplicateIds = 0;
  let skippedDuplicateHashes = 0;
  for (const entry of raw.entries) {
    if (!entry.id || !entry.url || !entry.payload) continue;
    if (existingIds.has(entry.id)) {
      skippedDuplicateIds += 1;
      continue;
    }
    const hash = deadLetterPayloadHash(entry);
    if (existingHashes.has(hash)) {
      skippedDuplicateHashes += 1;
      continue;
    }
    file.entries.push(entry);
    existingIds.add(entry.id);
    existingHashes.add(hash);
    importedIds.push(entry.id);
  }
  file.entries = file.entries.slice(0, 200);
  await saveDeadLetter(file, home);
  return {
    imported: importedIds.length,
    total: file.entries.length,
    importedIds,
    skippedDuplicateIds,
    skippedDuplicateHashes,
  };
}

export async function importAndReplayWebhookDeadLettersFromFile(
  exportPath: string,
  home = getDevaiosHome(),
): Promise<{
  imported: number;
  total: number;
  replayed: number;
  succeeded: number;
  failed: number;
  removedIds: string[];
}> {
  const imported = await importWebhookDeadLettersFromFile(exportPath, home, { merge: true });
  const replay =
    imported.importedIds.length ?
      await replayWebhookDeadLetters(home, { ids: imported.importedIds })
    : { replayed: 0, succeeded: 0, failed: 0, removedIds: [] as string[] };
  return {
    imported: imported.imported,
    total: imported.total,
    ...replay,
  };
}

async function appendDeadLetter(
  entry: Omit<WebhookDeadLetterEntry, "id" | "failedAt">,
  home = getDevaiosHome(),
): Promise<void> {
  const file = await loadDeadLetter(home);
  file.entries.unshift({
    id: randomUUID(),
    failedAt: nowIso(),
    ...entry,
  });
  file.entries = file.entries.slice(0, 200);
  await saveDeadLetter(file, home);
}

export async function dispatchTemplateNotificationWebhook(
  notifications: TemplateRunNotification[],
  home = getDevaiosHome(),
): Promise<{ dispatched: boolean; status?: number; attempts?: number; deadLetter?: boolean }> {
  if (!notifications.length) return { dispatched: false };
  const config = await loadTemplateNotificationWebhook(home);
  if (!config.enabled || !config.url) return { dispatched: false };

  const payload = { notifications, sentAt: nowIso() };
  const maxRetries = Math.max(1, config.maxRetries ?? 3);
  let lastStatus: number | undefined;
  let lastError: string | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(config.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      lastStatus = res.status;
      if (res.ok) {
        return { dispatched: true, status: res.status, attempts: attempt };
      }
      lastError = `http_${res.status}`;
    } catch (err) {
      lastError = String(err);
      lastStatus = 0;
    }
    if (attempt < maxRetries) await sleep(250 * attempt);
  }

  await appendDeadLetter(
    {
      url: config.url,
      attempts: maxRetries,
      lastStatus,
      lastError,
      payload,
    },
    home,
  );
  return { dispatched: true, status: lastStatus, attempts: maxRetries, deadLetter: true };
}
