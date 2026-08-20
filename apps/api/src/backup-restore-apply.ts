import { eq } from "drizzle-orm";
import type { BackupBundle } from "./backup.js";
import { db } from "./db/client.js";
import { approvalRequests, jobs, projects, workspaces } from "./db/schema.js";

export type RestoreConflictPolicy = "skip" | "replace";

export type ApplyRestoreOptions = {
  restoreMcp?: boolean;
  restoreProviders?: boolean;
  restoreApprovals?: boolean;
  restoreJobs?: boolean;
  conflictPolicy?: RestoreConflictPolicy;
};

export type ApplyRestoreResult = {
  workspacesInserted: number;
  workspacesReplaced: number;
  projectsInserted: number;
  projectsReplaced: number;
  approvalsInserted: number;
  approvalsReplaced: number;
  jobsInserted: number;
  jobsReplaced: number;
};

export async function applyBackupRestore(
  bundle: BackupBundle,
  options: ApplyRestoreOptions = {},
): Promise<ApplyRestoreResult> {
  const policy = options.conflictPolicy ?? "skip";
  const result: ApplyRestoreResult = {
    workspacesInserted: 0,
    workspacesReplaced: 0,
    projectsInserted: 0,
    projectsReplaced: 0,
    approvalsInserted: 0,
    approvalsReplaced: 0,
    jobsInserted: 0,
    jobsReplaced: 0,
  };

  for (const ws of bundle.workspaces ?? []) {
    const existing = await db.select().from(workspaces).where(eq(workspaces.slug, ws.slug)).limit(1);
    if (existing.length) {
      if (policy === "replace") {
        await db
          .update(workspaces)
          .set({ name: ws.name, rootPath: ws.rootPath })
          .where(eq(workspaces.slug, ws.slug));
        result.workspacesReplaced += 1;
      }
      continue;
    }
    await db.insert(workspaces).values({
      id: ws.id,
      slug: ws.slug,
      name: ws.name,
      rootPath: ws.rootPath,
    });
    result.workspacesInserted += 1;
  }

  for (const p of bundle.projects ?? []) {
    const existing = await db.select().from(projects).where(eq(projects.id, p.id)).limit(1);
    if (existing.length) {
      if (policy === "replace") {
        await db
          .update(projects)
          .set({
            workspaceId: p.workspaceId,
            slug: p.slug,
            name: p.name,
            repoPath: p.repoPath,
          })
          .where(eq(projects.id, p.id));
        result.projectsReplaced += 1;
      }
      continue;
    }
    const wsOk = await db.select().from(workspaces).where(eq(workspaces.id, p.workspaceId)).limit(1);
    if (wsOk.length) {
      await db.insert(projects).values({
        id: p.id,
        workspaceId: p.workspaceId,
        slug: p.slug,
        name: p.name,
        repoPath: p.repoPath,
      });
      result.projectsInserted += 1;
    }
  }

  if (options.restoreApprovals !== false) {
    for (const a of bundle.approvals ?? []) {
      const existing = await db
        .select()
        .from(approvalRequests)
        .where(eq(approvalRequests.id, a.id))
        .limit(1);
      if (existing.length) {
        if (policy === "replace") {
          await db
            .update(approvalRequests)
            .set({
              workspaceId: a.workspaceId,
              status: a.status,
              server: a.server,
              tool: a.tool,
              arguments: a.arguments as Record<string, unknown>,
              reason: a.reason,
              resolvedAt: a.resolvedAt ? new Date(a.resolvedAt) : null,
            })
            .where(eq(approvalRequests.id, a.id));
          result.approvalsReplaced += 1;
        }
        continue;
      }
      const wsOk = await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.id, a.workspaceId))
        .limit(1);
      if (wsOk.length) {
        await db.insert(approvalRequests).values({
          id: a.id,
          workspaceId: a.workspaceId,
          status: a.status,
          server: a.server,
          tool: a.tool,
          arguments: a.arguments as Record<string, unknown>,
          reason: a.reason,
          createdAt: new Date(a.createdAt),
          resolvedAt: a.resolvedAt ? new Date(a.resolvedAt) : null,
        });
        result.approvalsInserted += 1;
      }
    }
  }

  if (options.restoreJobs) {
    for (const j of bundle.jobs ?? []) {
      const existing = await db.select().from(jobs).where(eq(jobs.id, j.id)).limit(1);
      if (existing.length) {
        if (policy === "replace") {
          await db
            .update(jobs)
            .set({
              kind: j.kind,
              status: j.status,
              payload: j.payload as Record<string, unknown>,
              result: j.result as Record<string, unknown>,
              error: j.error,
              updatedAt: new Date(j.updatedAt),
              completedAt: j.completedAt ? new Date(j.completedAt) : null,
            })
            .where(eq(jobs.id, j.id));
          result.jobsReplaced += 1;
        }
        continue;
      }
      await db.insert(jobs).values({
        id: j.id,
        kind: j.kind,
        status: j.status,
        payload: j.payload as Record<string, unknown>,
        result: j.result as Record<string, unknown>,
        error: j.error,
        createdAt: new Date(j.createdAt),
        updatedAt: new Date(j.updatedAt),
        completedAt: j.completedAt ? new Date(j.completedAt) : null,
      });
      result.jobsInserted += 1;
    }
  }

  return result;
}
