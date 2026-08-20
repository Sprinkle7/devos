import { readdir, readFile, stat, unlink, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { getDevaiosHome } from "@devaios/shared-kernel";

export type BackupRetentionPolicy = {
  maxCount: number;
  maxAgeDays: number;
};

export type BackupRotationResult = {
  deleted: string[];
  kept: number;
};

const defaultPolicy = (): BackupRetentionPolicy => ({
  maxCount: 20,
  maxAgeDays: 30,
});

function retentionPath(home = getDevaiosHome()) {
  return join(home, "backup-retention.json");
}

export async function loadBackupRetention(home = getDevaiosHome()): Promise<BackupRetentionPolicy> {
  await mkdir(home, { recursive: true });
  try {
    const raw = JSON.parse(await readFile(retentionPath(home), "utf8")) as Partial<BackupRetentionPolicy>;
    return { ...defaultPolicy(), ...raw };
  } catch {
    return defaultPolicy();
  }
}

export async function saveBackupRetention(
  patch: Partial<BackupRetentionPolicy>,
  home = getDevaiosHome(),
): Promise<BackupRetentionPolicy> {
  const current = await loadBackupRetention(home);
  const next = { ...current, ...patch };
  await writeFile(retentionPath(home), JSON.stringify(next, null, 2) + "\n", "utf8");
  return next;
}

async function listBackupFiles(home = getDevaiosHome()) {
  const dir = join(home, "backups");
  let names: string[] = [];
  try {
    names = await readdir(dir);
  } catch {
    return [] as Array<{ path: string; mtimeMs: number }>;
  }
  const files: Array<{ path: string; mtimeMs: number }> = [];
  for (const name of names) {
    if (!name.startsWith("devaios-backup-") || !name.endsWith(".json")) continue;
    const path = join(dir, name);
    const s = await stat(path);
    if (s.isFile()) files.push({ path, mtimeMs: s.mtimeMs });
  }
  files.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return files;
}

export async function rotateBackups(
  home = getDevaiosHome(),
  policy = defaultPolicy(),
): Promise<BackupRotationResult> {
  const files = await listBackupFiles(home);
  const toDelete = new Set<string>();
  const now = Date.now();

  if (policy.maxAgeDays > 0) {
    const maxAgeMs = policy.maxAgeDays * 86_400_000;
    for (const f of files) {
      if (now - f.mtimeMs > maxAgeMs) toDelete.add(f.path);
    }
  }

  if (policy.maxCount > 0) {
    const survivors = files.filter((f) => !toDelete.has(f.path));
    for (const f of survivors.slice(policy.maxCount)) {
      toDelete.add(f.path);
    }
  }

  const deleted: string[] = [];
  for (const path of toDelete) {
    await unlink(path);
    deleted.push(path);
  }

  return { deleted, kept: files.length - deleted.length };
}
