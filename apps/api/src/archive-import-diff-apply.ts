import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { getDevaiosHome, nowIso } from "@devaios/shared-kernel";
import type { ArchiveImportDiffRow } from "./archive-import-diff-export.js";
import {
  importConversationArchive,
  previewConversationArchiveImport,
  type ArchiveImportPreviewResult,
  type ArchiveImportResult,
} from "./conversation-import.js";

export type ArchiveImportDiffFile = {
  exportedAt: string;
  archivePath: string;
  workspaceSlugs?: string[] | null;
  conversationIds?: string[] | null;
  conflictPolicy: string;
  diff: ArchiveImportDiffRow[];
};

export async function readArchiveImportDiffFile(path: string): Promise<ArchiveImportDiffFile> {
  const raw = JSON.parse(await readFile(path, "utf8")) as ArchiveImportDiffFile;
  if (!raw.archivePath || !Array.isArray(raw.diff)) {
    throw new Error("archive_diff_invalid");
  }
  return raw;
}

function selectDiffRows(
  file: ArchiveImportDiffFile,
  options: { diffIds?: string[]; selectedOnly?: boolean },
): ArchiveImportDiffRow[] {
  const idFilter = options.diffIds?.length ? new Set(options.diffIds) : null;
  const selectedOnly = options.selectedOnly !== false;
  let rows = file.diff;
  if (selectedOnly) rows = rows.filter((r) => r.selected);
  if (idFilter) rows = rows.filter((r) => idFilter.has(r.id));
  return rows;
}

export async function previewArchiveImportFromDiffFile(
  diffPath: string,
  options: {
    diffIds?: string[];
    selectedOnly?: boolean;
    slugMap?: Record<string, string>;
    passphrase?: string;
  } = {},
): Promise<
  ArchiveImportPreviewResult & {
    diffPath: string;
    selectedDiffIds: string[];
    diffRows: Array<{
      id: string;
      workspaceSlug: string;
      conversationId: string;
      title: string;
      action: ArchiveImportDiffRow["action"];
      selected: boolean;
    }>;
    archivePath: string;
  }
> {
  const file = await readArchiveImportDiffFile(diffPath);
  const rows = selectDiffRows(file, options);
  const conversationIds = [...new Set(rows.map((r) => r.conversationId))];
  const workspaceSlugs = [...new Set(rows.map((r) => r.workspaceSlug))];
  const preview = await previewConversationArchiveImport(
    file.archivePath,
    {
      slugMap: options.slugMap,
      workspaceSlugs: workspaceSlugs.length ? workspaceSlugs : undefined,
      conversationIds: conversationIds.length ? conversationIds : undefined,
      conflictPolicy: file.conflictPolicy === "replace" ? "replace" : "skip",
    },
    options.passphrase,
  );
  return {
    ...preview,
    diffPath,
    selectedDiffIds: rows.map((r) => r.id),
    diffRows: rows.map((r) => ({
      id: r.id,
      workspaceSlug: r.workspaceSlug,
      conversationId: r.conversationId,
      title: r.title,
      action: r.action,
      selected: r.selected,
    })),
    archivePath: file.archivePath,
  };
}

export async function importArchiveFromDiffFile(
  diffPath: string,
  options: {
    diffIds?: string[];
    selectedOnly?: boolean;
    dedupeByTitle?: boolean;
    slugMap?: Record<string, string>;
    passphrase?: string;
  } = {},
): Promise<ArchiveImportResult & { archivePath: string; importedDiffIds: string[] }> {
  const file = await readArchiveImportDiffFile(diffPath);
  const rows = selectDiffRows(file, options);

  const conversationIds = [...new Set(rows.map((r) => r.conversationId))];
  const workspaceSlugs = [...new Set(rows.map((r) => r.workspaceSlug))];

  const result = await importConversationArchive(
    file.archivePath,
    {
      dedupeByTitle: options.dedupeByTitle,
      slugMap: options.slugMap,
      workspaceSlugs: workspaceSlugs.length ? workspaceSlugs : undefined,
      conversationIds: conversationIds.length ? conversationIds : undefined,
      conflictPolicy: file.conflictPolicy === "replace" ? "replace" : "skip",
    },
    options.passphrase,
  );

  return {
    ...result,
    archivePath: file.archivePath,
    importedDiffIds: rows.map((r) => r.id),
  };
}

export async function saveArchiveImportDiffSelection(
  diffPath: string,
  diffIds: string[],
): Promise<{ diffPath: string; selectedCount: number; total: number }> {
  const file = await readArchiveImportDiffFile(diffPath);
  const idSet = new Set(diffIds);
  file.diff = file.diff.map((row) => ({
    ...row,
    selected: idSet.has(row.id),
  }));
  await writeFile(diffPath, JSON.stringify(file, null, 2) + "\n", "utf8");
  return { diffPath, selectedCount: diffIds.length, total: file.diff.length };
}

export type ArchiveImportDiffMergePlan = {
  sourcePaths: string[];
  archivePath: string;
  archivePaths: string[];
  archivePathWarnings?: string[];
  conflictPolicy: string;
  diff: ArchiveImportDiffRow[];
  totals: {
    rows: number;
    selected: number;
    insert: number;
    skip: number;
    replace: number;
  };
};

export function planArchiveImportDiffMerge(
  files: ArchiveImportDiffFile[],
  sourcePaths: string[],
  options?: { allowMixedArchives?: boolean },
): ArchiveImportDiffMergePlan {
  const archivePaths = [...new Set(files.map((f) => f.archivePath))];
  if (archivePaths.length > 1 && !options?.allowMixedArchives) {
    throw new Error(`archive_diff_merge_archive_conflict:${archivePaths.join("|")}`);
  }
  const rowMap = new Map<string, ArchiveImportDiffRow>();
  for (const file of files) {
    for (const row of file.diff) rowMap.set(row.id, row);
  }
  const diff = [...rowMap.values()];
  const totals = {
    rows: diff.length,
    selected: diff.filter((r) => r.selected).length,
    insert: diff.filter((r) => r.action === "insert").length,
    skip: diff.filter((r) => r.action === "skip").length,
    replace: diff.filter((r) => r.action === "replace").length,
  };
  return {
    sourcePaths,
    archivePath: files[0].archivePath,
    archivePaths,
    archivePathWarnings: archivePaths.length > 1 ? archivePaths : undefined,
    conflictPolicy: files[0].conflictPolicy,
    diff,
    totals,
  };
}

export async function previewArchiveImportDiffMerge(
  diffPaths: string[],
  options?: {
    allowMixedArchives?: boolean;
    rowLimit?: number;
    actionFilter?: ArchiveImportDiffRow["action"];
    actionFilters?: ArchiveImportDiffRow["action"][];
  },
): Promise<ArchiveImportDiffMergePlan & { diffRows: ArchiveImportDiffRow[] }> {
  if (diffPaths.length < 2) throw new Error("archive_diff_merge_requires_two");
  const files = await Promise.all(diffPaths.map((p) => readArchiveImportDiffFile(p)));
  const plan = planArchiveImportDiffMerge(files, diffPaths, options);
  let rows = plan.diff;
  const filters =
    options?.actionFilters?.length ?
      options.actionFilters
    : options?.actionFilter ?
      [options.actionFilter]
    : null;
  if (filters?.length) {
    const set = new Set(filters);
    rows = rows.filter((r) => set.has(r.action));
  }
  const limit = options?.rowLimit ?? rows.length;
  return { ...plan, diffRows: rows.slice(0, limit) };
}

export async function mergeArchiveImportDiffFiles(
  diffPaths: string[],
  home = getDevaiosHome(),
  options?: { allowMixedArchives?: boolean; selectedDiffIds?: string[] },
): Promise<{
  path: string;
  mergedCount: number;
  sourcePaths: string[];
  archivePathWarnings?: string[];
}> {
  if (diffPaths.length < 2) throw new Error("archive_diff_merge_requires_two");
  const files = await Promise.all(diffPaths.map((p) => readArchiveImportDiffFile(p)));
  const plan = planArchiveImportDiffMerge(files, diffPaths, options);
  let diff = plan.diff;
  if (options?.selectedDiffIds?.length) {
    const idSet = new Set(options.selectedDiffIds);
    diff = diff.filter((r) => idSet.has(r.id)).map((r) => ({ ...r, selected: true }));
    if (!diff.length) throw new Error("archive_diff_merge_no_selection");
  }
  const dir = join(home, "exports");
  await mkdir(dir, { recursive: true });
  const stamp = nowIso().replace(/[:.]/g, "-");
  const path = join(dir, `archive-import-diff-merged-${stamp}.json`);
  const merged: ArchiveImportDiffFile = {
    exportedAt: nowIso(),
    archivePath: plan.archivePath,
    workspaceSlugs: [...new Set(files.flatMap((f) => f.workspaceSlugs ?? []))],
    conversationIds: null,
    conflictPolicy: plan.conflictPolicy,
    diff,
  };
  await writeFile(path, JSON.stringify(merged, null, 2) + "\n", "utf8");
  return {
    path,
    mergedCount: diff.length,
    sourcePaths: diffPaths,
    archivePathWarnings: plan.archivePathWarnings,
  };
}
