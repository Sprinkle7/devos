import { readdir, readFile, stat, unlink, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { getDevaiosHome } from "@devaios/shared-kernel";

export type ArchiveRetentionPolicy = {
  maxCount: number;
  maxAgeDays: number;
};

export type ArchiveRotationResult = {
  deleted: string[];
  kept: number;
};

const defaultPolicy = (): ArchiveRetentionPolicy => ({
  maxCount: 10,
  maxAgeDays: 90,
});

function retentionPath(home = getDevaiosHome()) {
  return join(home, "archive-retention.json");
}

export async function loadArchiveRetention(home = getDevaiosHome()): Promise<ArchiveRetentionPolicy> {
  await mkdir(home, { recursive: true });
  try {
    const raw = JSON.parse(await readFile(retentionPath(home), "utf8")) as Partial<ArchiveRetentionPolicy>;
    return { ...defaultPolicy(), ...raw };
  } catch {
    return defaultPolicy();
  }
}

export async function saveArchiveRetention(
  patch: Partial<ArchiveRetentionPolicy>,
  home = getDevaiosHome(),
): Promise<ArchiveRetentionPolicy> {
  const current = await loadArchiveRetention(home);
  const next = { ...current, ...patch };
  await writeFile(retentionPath(home), JSON.stringify(next, null, 2) + "\n", "utf8");
  return next;
}

async function listArchiveFiles(home = getDevaiosHome()) {
  const dir = join(home, "exports");
  let names: string[] = [];
  try {
    names = await readdir(dir);
  } catch {
    return [] as Array<{ path: string; mtimeMs: number }>;
  }
  const files: Array<{ path: string; mtimeMs: number }> = [];
  for (const name of names) {
    if (!name.startsWith("conversations-archive-") || !name.endsWith(".json")) continue;
    const path = join(dir, name);
    const s = await stat(path);
    if (s.isFile()) files.push({ path, mtimeMs: s.mtimeMs });
  }
  files.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return files;
}

export async function rotateArchives(
  home = getDevaiosHome(),
  policy = defaultPolicy(),
): Promise<ArchiveRotationResult> {
  const files = await listArchiveFiles(home);
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
