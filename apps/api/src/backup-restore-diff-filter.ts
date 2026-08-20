import type { BackupBundle } from "./backup.js";
import type { RestoreDiffRow } from "./backup-restore-preview.js";

export function filterBundleBySelectedDiff(
  bundle: BackupBundle,
  diff: RestoreDiffRow[],
  selectedDiffIds: string[],
): BackupBundle {
  if (!selectedDiffIds.length) return bundle;

  const selected = new Set(selectedDiffIds);
  const rows = diff.filter((r) => r.id && selected.has(r.id));

  const wsSlugs = new Set(
    rows.filter((r) => r.section === "workspaces").map((r) => r.label),
  );
  const projectSlugs = new Set(
    rows
      .filter((r) => r.section === "projects")
      .map((r) => r.label.replace(/ \(exists\)$/, "").replace(/ \(orphan workspace\)$/, "")),
  );
  const approvalIds = new Set(
    rows.filter((r) => r.section === "approvals").map((r) => r.id!.replace(/^approvals:/, "")),
  );
  const jobIds = new Set(
    rows.filter((r) => r.section === "jobs").map((r) => r.id!.replace(/^jobs:/, "")),
  );
  const includeMcp = rows.some((r) => r.section === "mcp");
  const includeProviders = rows.some((r) => r.section === "providers");

  const workspaces = (bundle.workspaces ?? []).filter((w) => wsSlugs.has(w.slug));
  const wsIds = new Set(workspaces.map((w) => w.id));

  return {
    ...bundle,
    workspaces,
    projects: (bundle.projects ?? []).filter(
      (p) => projectSlugs.has(p.slug) && wsIds.has(p.workspaceId),
    ),
    approvals: (bundle.approvals ?? []).filter(
      (a) => approvalIds.has(a.id) && wsIds.has(a.workspaceId),
    ),
    jobs: (bundle.jobs ?? []).filter((j) => jobIds.has(j.id)),
    mcpServers: includeMcp ? (bundle.mcpServers ?? []) : [],
    providers: includeProviders ? (bundle.providers ?? []) : [],
  };
}
