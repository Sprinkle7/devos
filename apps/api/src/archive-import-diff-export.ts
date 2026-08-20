import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getDevaiosHome, nowIso } from "@devaios/shared-kernel";
import type { ArchiveImportPreviewResult } from "./conversation-import.js";

export type ArchiveImportDiffRow = {
  id: string;
  workspaceSlug: string;
  conversationId: string;
  title: string;
  action: "insert" | "skip" | "replace";
  selected: boolean;
};

export function buildArchiveImportDiff(
  preview: ArchiveImportPreviewResult,
  selectedDiffIds?: string[] | null,
): ArchiveImportDiffRow[] {
  const selectedSet =
    selectedDiffIds?.length ? new Set(selectedDiffIds) : null;
  const rows: ArchiveImportDiffRow[] = [];
  for (const ws of preview.workspaces) {
    if (!ws.selected) continue;
    for (const conv of ws.conversations ?? []) {
      const id = `${ws.slug}:${conv.id}`;
      rows.push({
        id,
        workspaceSlug: ws.slug,
        conversationId: conv.id,
        title: conv.title,
        action: conv.conflict,
        selected: selectedSet ? selectedSet.has(id) : conv.selected,
      });
    }
  }
  return rows;
}

export async function writeArchiveImportDiffExport(
  preview: ArchiveImportPreviewResult,
  meta: {
    path: string;
    workspaceSlugs?: string[] | null;
    conversationIds?: string[] | null;
    conflictPolicy: string;
    selectedDiffIds?: string[] | null;
  },
  home = getDevaiosHome(),
): Promise<string> {
  const dir = join(home, "exports");
  await mkdir(dir, { recursive: true });
  const stamp = nowIso().replace(/[:.]/g, "-");
  const outPath = join(dir, `archive-import-diff-${stamp}.json`);
  const diff = buildArchiveImportDiff(preview, meta.selectedDiffIds);

  await writeFile(
    outPath,
    JSON.stringify(
      {
        exportedAt: nowIso(),
        archivePath: meta.path,
        workspaceSlugs: meta.workspaceSlugs ?? null,
        conversationIds: meta.conversationIds ?? null,
        conflictPolicy: meta.conflictPolicy,
        preview,
        diff,
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );
  return outPath;
}
