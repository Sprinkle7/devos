import { readBackupBundle } from "./backup.js";
import { applyBackupRestore } from "./backup-restore-apply.js";
import { previewBackupRestore } from "./backup-restore-preview.js";
import { inferScopedRestoreOptions, resolveScopedRestoreBundle } from "./backup-restore-scoped.js";
import { findLatestScopedBackupPath, listLatestScopedBackupPaths } from "./workspace-backup-batch.js";

export type BatchScopedRestoreOptions = {
  autoDetectScoped?: boolean;
  scopedOnly?: boolean;
  conflictPolicy?: "skip" | "replace";
  restoreApprovals?: boolean;
  restoreJobs?: boolean;
  passphrase?: string;
};

export async function restoreLatestScopedBackup(
  workspaceSlug: string,
  home: string,
  options: BatchScopedRestoreOptions = {},
) {
  const path = await findLatestScopedBackupPath(workspaceSlug, home);
  if (!path) {
    return { workspaceSlug, ok: false as const, error: "backup_not_found" as const, path: null };
  }

  try {
    const bundle = await readBackupBundle(path, options.passphrase);
    const inferred = inferScopedRestoreOptions(path, {
      scopedOnly: options.scopedOnly,
      autoDetectScoped: options.autoDetectScoped ?? true,
      workspaceSlugs: [workspaceSlug],
    });
    const resolved = resolveScopedRestoreBundle(bundle, {
      scopedOnly: inferred.scopedOnly,
      workspaceSlugs: inferred.workspaceSlugs,
    });
    const applied = await applyBackupRestore(resolved.bundle, {
      restoreApprovals: options.restoreApprovals ?? true,
      restoreJobs: options.restoreJobs ?? false,
      conflictPolicy: options.conflictPolicy ?? "skip",
    });
    return { workspaceSlug, ok: true as const, path, applied, autoDetected: inferred.autoDetected };
  } catch (err) {
    return { workspaceSlug, ok: false as const, path, error: String(err) };
  }
}

export async function batchRestoreLatestScopedBackups(
  workspaceSlugs: string[],
  home: string,
  options: BatchScopedRestoreOptions = {},
) {
  const planned = await listLatestScopedBackupPaths(workspaceSlugs, home);
  const results = [];
  for (const row of planned) {
    if (!row.path) {
      results.push({ workspaceSlug: row.workspaceSlug, ok: false, error: "backup_not_found" });
      continue;
    }
    results.push(await restoreLatestScopedBackup(row.workspaceSlug, home, options));
  }
  return results;
}

export async function previewLatestScopedBackup(
  workspaceSlug: string,
  home: string,
  options: BatchScopedRestoreOptions = {},
) {
  const path = await findLatestScopedBackupPath(workspaceSlug, home);
  if (!path) {
    return { workspaceSlug, ok: false as const, error: "backup_not_found" as const, path: null };
  }

  try {
    const bundle = await readBackupBundle(path, options.passphrase);
    const inferred = inferScopedRestoreOptions(path, {
      scopedOnly: options.scopedOnly,
      autoDetectScoped: options.autoDetectScoped ?? true,
      workspaceSlugs: [workspaceSlug],
    });
    const resolved = resolveScopedRestoreBundle(bundle, {
      scopedOnly: inferred.scopedOnly,
      workspaceSlugs: inferred.workspaceSlugs,
    });
    const preview = await previewBackupRestore(resolved.bundle, {
      restoreApprovals: options.restoreApprovals ?? true,
      restoreJobs: options.restoreJobs ?? false,
      conflictPolicy: options.conflictPolicy ?? "skip",
      workspaceSlugs: inferred.workspaceSlugs,
    });
    return {
      workspaceSlug,
      ok: true as const,
      path,
      preview,
      autoDetected: inferred.autoDetected,
      conflictPolicy: options.conflictPolicy ?? "skip",
    };
  } catch (err) {
    return { workspaceSlug, ok: false as const, path, error: String(err) };
  }
}

export async function batchPreviewLatestScopedBackups(
  workspaceSlugs: string[],
  home: string,
  options: BatchScopedRestoreOptions = {},
) {
  const planned = await listLatestScopedBackupPaths(workspaceSlugs, home);
  const results = [];
  for (const row of planned) {
    if (!row.path) {
      results.push({ workspaceSlug: row.workspaceSlug, ok: false, error: "backup_not_found" });
      continue;
    }
    results.push(await previewLatestScopedBackup(row.workspaceSlug, home, options));
  }
  return results;
}
