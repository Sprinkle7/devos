import { eq } from "drizzle-orm";
import type { BackupBundle } from "./backup.js";
import { db } from "./db/client.js";
import { approvalRequests, jobs, projects, workspaces } from "./db/schema.js";

export type RestorePreviewOptions = {
  restoreMcp?: boolean;
  restoreProviders?: boolean;
  restoreApprovals?: boolean;
  restoreJobs?: boolean;
  workspaceSlugs?: string[];
  conflictPolicy?: "skip" | "replace";
};

export type RestoreDiffRow = {
  id: string;
  section: "workspaces" | "projects" | "mcp" | "providers" | "approvals" | "jobs";
  action: "insert" | "skip" | "replace";
  label: string;
};

function diffId(section: RestoreDiffRow["section"], key: string): string {
  return `${section}:${key}`;
}

export type RestorePreview = {
  bundleVersion: number;
  createdAt: string;
  conflictPolicy: "skip" | "replace";
  workspaces: { total: number; insert: number; skip: number; replace: number; slugs: string[] };
  projects: { total: number; insert: number; skip: number; replace: number };
  mcpServers: number;
  providers: number;
  approvals: { total: number; insert: number; skip: number; replace: number };
  jobs: { total: number; insert: number; skip: number; replace: number };
  actions: string[];
  diff: RestoreDiffRow[];
};

export async function previewBackupRestore(
  bundle: BackupBundle,
  options: RestorePreviewOptions = {},
): Promise<RestorePreview> {
  const opts = {
    restoreMcp: options.restoreMcp ?? true,
    restoreProviders: options.restoreProviders ?? true,
    restoreApprovals: options.restoreApprovals ?? true,
    restoreJobs: options.restoreJobs ?? false,
  };
  const policy = options.conflictPolicy ?? "skip";

  const wsList = bundle.workspaces ?? [];
  const diff: RestoreDiffRow[] = [];
  let wsInsert = 0;
  let wsSkip = 0;
  let wsReplace = 0;
  for (const ws of wsList) {
    const existing = await db.select().from(workspaces).where(eq(workspaces.slug, ws.slug)).limit(1);
    if (existing.length) {
      if (policy === "replace") {
        wsReplace += 1;
        diff.push({ id: diffId("workspaces", ws.slug), section: "workspaces", action: "replace", label: ws.slug });
      } else {
        wsSkip += 1;
        diff.push({ id: diffId("workspaces", ws.slug), section: "workspaces", action: "skip", label: ws.slug });
      }
    } else {
      wsInsert += 1;
      diff.push({ id: diffId("workspaces", ws.slug), section: "workspaces", action: "insert", label: ws.slug });
    }
  }

  const projList = bundle.projects ?? [];
  let projInsert = 0;
  let projSkip = 0;
  let projReplace = 0;
  for (const p of projList) {
    const existing = await db.select().from(projects).where(eq(projects.id, p.id)).limit(1);
    if (existing.length) {
      if (policy === "replace") {
        projReplace += 1;
        diff.push({ id: diffId("projects", p.slug), section: "projects", action: "replace", label: p.slug });
      } else {
        projSkip += 1;
        diff.push({ id: diffId("projects", p.slug), section: "projects", action: "skip", label: `${p.slug} (exists)` });
      }
      continue;
    }
    const wsOk = await db.select().from(workspaces).where(eq(workspaces.id, p.workspaceId)).limit(1);
    if (wsOk.length || wsList.some((w) => w.id === p.workspaceId)) {
      projInsert += 1;
      diff.push({ id: diffId("projects", p.slug), section: "projects", action: "insert", label: p.slug });
    } else {
      projSkip += 1;
      diff.push({ id: diffId("projects", p.slug), section: "projects", action: "skip", label: `${p.slug} (orphan workspace)` });
    }
  }

  let apprInsert = 0;
  let apprSkip = 0;
  let apprReplace = 0;
  const apprList = bundle.approvals ?? [];
  if (opts.restoreApprovals) {
    for (const a of apprList) {
      const existing = await db
        .select()
        .from(approvalRequests)
        .where(eq(approvalRequests.id, a.id))
        .limit(1);
      if (existing.length) {
        if (policy === "replace") {
          apprReplace += 1;
          diff.push({ id: diffId("approvals", a.id), section: "approvals", action: "replace", label: `${a.server}/${a.tool}` });
        } else {
          apprSkip += 1;
          diff.push({ id: diffId("approvals", a.id), section: "approvals", action: "skip", label: `${a.server}/${a.tool}` });
        }
        continue;
      }
      const wsOk = await db.select().from(workspaces).where(eq(workspaces.id, a.workspaceId)).limit(1);
      if (wsOk.length || wsList.some((w) => w.id === a.workspaceId)) {
        apprInsert += 1;
        diff.push({ id: diffId("approvals", a.id), section: "approvals", action: "insert", label: `${a.server}/${a.tool}` });
      } else {
        apprSkip += 1;
        diff.push({ id: diffId("approvals", a.id), section: "approvals", action: "skip", label: `${a.server}/${a.tool} (orphan)` });
      }
    }
  }

  let jobInsert = 0;
  let jobSkip = 0;
  let jobReplace = 0;
  const jobList = bundle.jobs ?? [];
  if (opts.restoreJobs) {
    for (const j of jobList) {
      const existing = await db.select().from(jobs).where(eq(jobs.id, j.id)).limit(1);
      if (existing.length) {
        if (policy === "replace") {
          jobReplace += 1;
          diff.push({ id: diffId("jobs", j.id), section: "jobs", action: "replace", label: j.kind });
        } else {
          jobSkip += 1;
          diff.push({ id: diffId("jobs", j.id), section: "jobs", action: "skip", label: j.kind });
        }
      } else {
        jobInsert += 1;
        diff.push({ id: diffId("jobs", j.id), section: "jobs", action: "insert", label: j.kind });
      }
    }
  }

  const actions: string[] = [];
  if (opts.restoreMcp && (bundle.mcpServers?.length ?? 0) > 0 && !options.workspaceSlugs?.length) {
    actions.push(`replace ${bundle.mcpServers?.length ?? 0} MCP server registrations`);
    diff.push({
      id: diffId("mcp", "all"),
      section: "mcp",
      action: "replace",
      label: `${bundle.mcpServers?.length ?? 0} servers`,
    });
  }
  if (opts.restoreProviders && (bundle.providers?.length ?? 0) > 0 && !options.workspaceSlugs?.length) {
    actions.push(`overwrite providers.json (${bundle.providers?.length ?? 0} entries)`);
    diff.push({
      id: diffId("providers", "all"),
      section: "providers",
      action: "replace",
      label: `${bundle.providers?.length ?? 0} providers`,
    });
  }
  if (wsInsert) actions.push(`insert ${wsInsert} workspace(s)`);
  if (wsReplace) actions.push(`replace ${wsReplace} workspace(s)`);
  if (projInsert) actions.push(`insert ${projInsert} project(s)`);
  if (projReplace) actions.push(`replace ${projReplace} project(s)`);
  if (opts.restoreApprovals && apprInsert) actions.push(`insert ${apprInsert} approval(s)`);
  if (opts.restoreApprovals && apprReplace) actions.push(`replace ${apprReplace} approval(s)`);
  if (opts.restoreJobs && jobInsert) actions.push(`insert ${jobInsert} job(s)`);
  if (opts.restoreJobs && jobReplace) actions.push(`replace ${jobReplace} job(s)`);
  if (!actions.length) actions.push("no changes (all entities already present or empty bundle)");

  return {
    bundleVersion: bundle.version ?? 1,
    createdAt: bundle.createdAt,
    conflictPolicy: policy,
    workspaces: {
      total: wsList.length,
      insert: wsInsert,
      skip: wsSkip,
      replace: wsReplace,
      slugs: wsList.map((w) => w.slug),
    },
    projects: { total: projList.length, insert: projInsert, skip: projSkip, replace: projReplace },
    mcpServers: bundle.mcpServers?.length ?? 0,
    providers: bundle.providers?.length ?? 0,
    approvals: { total: apprList.length, insert: apprInsert, skip: apprSkip, replace: apprReplace },
    jobs: { total: jobList.length, insert: jobInsert, skip: jobSkip, replace: jobReplace },
    actions,
    diff,
  };
}
