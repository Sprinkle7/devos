import type { BackupBundle } from "./backup.js";

export function filterBackupByWorkspaces(bundle: BackupBundle, workspaceSlugs: string[]): BackupBundle {
  if (!workspaceSlugs.length) return bundle;

  const slugSet = new Set(workspaceSlugs);
  const workspaces = (bundle.workspaces ?? []).filter((w) => slugSet.has(w.slug));
  const wsIds = new Set(workspaces.map((w) => w.id));

  return {
    ...bundle,
    workspaces,
    projects: (bundle.projects ?? []).filter((p) => wsIds.has(p.workspaceId)),
    approvals: (bundle.approvals ?? []).filter((a) => wsIds.has(a.workspaceId)),
    conversations: (bundle.conversations ?? []).filter((c) => wsIds.has(c.workspaceId)),
    jobs: (bundle.jobs ?? []).filter((j) => {
      const payload = j.payload as Record<string, unknown> | null;
      if (!payload) return false;
      const wsId = payload.workspaceId;
      if (typeof wsId === "string" && wsIds.has(wsId)) return true;
      const slug = payload.workspaceSlug ?? payload.slug;
      return typeof slug === "string" && slugSet.has(slug);
    }),
  };
}
