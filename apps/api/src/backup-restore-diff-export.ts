import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getDevaiosHome, nowIso } from "@devaios/shared-kernel";
import type { RestorePreview } from "./backup-restore-preview.js";

export async function writeRestoreDiffExport(
  preview: RestorePreview,
  meta: {
    path: string;
    selectedSlugs?: string[] | null;
    selectedDiffIds?: string[] | null;
    conflictPolicy: string;
  },
  home = getDevaiosHome(),
): Promise<string> {
  const dir = join(home, "exports");
  await mkdir(dir, { recursive: true });
  const stamp = nowIso().replace(/[:.]/g, "-");
  const outPath = join(dir, `restore-diff-${stamp}.json`);
  await writeFile(
    outPath,
    JSON.stringify(
      {
        exportedAt: nowIso(),
        backupPath: meta.path,
        selectedSlugs: meta.selectedSlugs ?? null,
        selectedDiffIds: meta.selectedDiffIds ?? null,
        conflictPolicy: meta.conflictPolicy,
        preview,
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );
  return outPath;
}
