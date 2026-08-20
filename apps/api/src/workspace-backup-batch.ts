import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { getDevaiosHome } from "@devaios/shared-kernel";
import { detectScopedSlugFromBackupPath } from "./backup-restore-scoped.js";

export async function findLatestScopedBackupPath(
  workspaceSlug: string,
  home = getDevaiosHome(),
): Promise<string | null> {
  const dir = join(home, "backups");
  const prefix = `workspace-${workspaceSlug}-`;
  let files: string[];
  try {
    files = await readdir(dir);
  } catch {
    return null;
  }

  let best: { path: string; mtime: number } | null = null;
  for (const file of files) {
    if (!file.startsWith(prefix) || !file.endsWith(".json")) continue;
    const path = join(dir, file);
    const info = await stat(path);
    if (!best || info.mtimeMs > best.mtime) {
      best = { path, mtime: info.mtimeMs };
    }
  }
  return best?.path ?? null;
}

export async function listLatestScopedBackupPaths(
  workspaceSlugs: string[],
  home = getDevaiosHome(),
): Promise<Array<{ workspaceSlug: string; path: string | null; detectedSlug: string | null }>> {
  const rows = [];
  for (const slug of workspaceSlugs) {
    const path = await findLatestScopedBackupPath(slug, home);
    rows.push({
      workspaceSlug: slug,
      path,
      detectedSlug: path ? detectScopedSlugFromBackupPath(path) : null,
    });
  }
  return rows;
}
