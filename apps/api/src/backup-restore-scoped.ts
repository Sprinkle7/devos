import type { BackupBundle } from "./backup.js";
import { basename } from "node:path";
import { filterBackupByWorkspaces } from "./backup-restore-selective.js";

export function detectScopedSlugFromBackupPath(path: string): string | null {
  const base = basename(path);
  const match = base.match(/^workspace-([a-z0-9]+(?:-[a-z0-9]+)*?)-/);
  return match?.[1] ?? null;
}

export function inferScopedRestoreOptions(
  backupPath: string,
  options: { scopedOnly?: boolean; autoDetectScoped?: boolean; workspaceSlugs?: string[] },
): { scopedOnly: boolean; workspaceSlugs?: string[]; autoDetected: boolean; detectedSlug: string | null } {
  const detected = detectScopedSlugFromBackupPath(backupPath);
  if (options.scopedOnly) {
    return {
      scopedOnly: true,
      workspaceSlugs: options.workspaceSlugs,
      autoDetected: false,
      detectedSlug: detected,
    };
  }
  if (options.autoDetectScoped !== false && detected) {
    return {
      scopedOnly: true,
      workspaceSlugs: options.workspaceSlugs?.length ? options.workspaceSlugs : [detected],
      autoDetected: true,
      detectedSlug: detected,
    };
  }
  return {
    scopedOnly: false,
    workspaceSlugs: options.workspaceSlugs,
    autoDetected: false,
    detectedSlug: detected,
  };
}

export function isScopedBackup(bundle: BackupBundle): boolean {
  return bundle.config?.scoped === true;
}

export function resolveScopedRestoreBundle(
  bundle: BackupBundle,
  options: { scopedOnly?: boolean; workspaceSlugs?: string[] },
): { bundle: BackupBundle; workspaceSlugs?: string[] } {
  if (options.scopedOnly) {
    if (!isScopedBackup(bundle)) {
      throw new Error("backup_not_scoped");
    }

    const slug = typeof bundle.config?.workspaceSlug === "string" ? bundle.config.workspaceSlug : null;
    if (!slug) throw new Error("backup_scoped_slug_missing");

    const slugs = options.workspaceSlugs?.length ? options.workspaceSlugs : [slug];
    if (options.workspaceSlugs?.length && !options.workspaceSlugs.includes(slug)) {
      throw new Error("backup_scoped_slug_mismatch");
    }

    return {
      bundle: filterBackupByWorkspaces(bundle, slugs),
      workspaceSlugs: slugs,
    };
  }

  if (options.workspaceSlugs?.length) {
    return {
      bundle: filterBackupByWorkspaces(bundle, options.workspaceSlugs),
      workspaceSlugs: options.workspaceSlugs,
    };
  }

  return { bundle, workspaceSlugs: options.workspaceSlugs };
}
