import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "./db/client.js";
import { approvalRequests, jobs, memories, projects, workspaces } from "./db/schema.js";
import { exportWorkspaceConversations } from "./conversation-export.js";
import { importConversationExport, type ImportResult } from "./conversation-import.js";
import { cloneWorkspaceJobTemplates } from "./job-templates.js";

export type WorkspaceCloneOptions = {
  includeApprovals?: boolean;
  includeJobs?: boolean;
  includeScheduleTemplates?: boolean;
};

export type WorkspaceCloneResult = {
  sourceSlug: string;
  targetSlug: string;
  targetWorkspaceId: string;
  conversationCount: number;
  projectsCloned: number;
  memoriesCloned: number;
  approvalsCloned: number;
  jobsCloned: number;
  scheduleTemplatesCloned: number;
  imported: ImportResult;
};

export async function cloneWorkspaceFull(
  sourceSlug: string,
  targetSlug: string,
  targetName?: string,
  options: WorkspaceCloneOptions = {},
): Promise<WorkspaceCloneResult> {
  const opts = {
    includeApprovals: options.includeApprovals ?? true,
    includeJobs: options.includeJobs ?? false,
    includeScheduleTemplates: options.includeScheduleTemplates ?? false,
  };
  const [source] = await db.select().from(workspaces).where(eq(workspaces.slug, sourceSlug)).limit(1);
  if (!source) throw new Error("source_not_found");

  const [existingTarget] = await db.select().from(workspaces).where(eq(workspaces.slug, targetSlug)).limit(1);
  if (existingTarget) throw new Error("target_slug_taken");

  const [target] = await db
    .insert(workspaces)
    .values({
      name: targetName ?? `${source.name} (clone)`,
      slug: targetSlug,
      rootPath: source.rootPath,
    })
    .returning();

  const sourceProjects = await db.select().from(projects).where(eq(projects.workspaceId, source.id));
  let projectsCloned = 0;
  for (const project of sourceProjects) {
    const clash = await db
      .select()
      .from(projects)
      .where(and(eq(projects.workspaceId, target.id), eq(projects.slug, project.slug)))
      .limit(1);
    if (clash.length) continue;
    await db.insert(projects).values({
      id: randomUUID(),
      workspaceId: target.id,
      slug: project.slug,
      name: project.name,
      repoPath: project.repoPath,
    });
    projectsCloned += 1;
  }

  const sourceMemories = await db.select().from(memories).where(eq(memories.workspaceId, source.id));
  let memoriesCloned = 0;
  for (const mem of sourceMemories) {
    await db.insert(memories).values({
      id: randomUUID(),
      workspaceId: target.id,
      kind: mem.kind,
      title: mem.title,
      content: mem.content,
    });
    memoriesCloned += 1;
  }

  const exportData = await exportWorkspaceConversations(source.id, source.slug);
  exportData.workspaceId = target.id;
  exportData.workspaceSlug = target.slug;
  exportData.conversations = exportData.conversations.map((conv) => ({
    ...conv,
    id: randomUUID(),
    workspaceId: target.id,
    messages: (conv.messages ?? []).map((msg) => ({
      ...msg,
      id: randomUUID(),
    })),
  }));

  const imported = await importConversationExport(target.id, exportData);

  let approvalsCloned = 0;
  if (opts.includeApprovals) {
    const sourceApprovals = await db
      .select()
      .from(approvalRequests)
      .where(eq(approvalRequests.workspaceId, source.id));
    for (const appr of sourceApprovals) {
      await db.insert(approvalRequests).values({
        id: randomUUID(),
        workspaceId: target.id,
        status: appr.status,
        server: appr.server,
        tool: appr.tool,
        arguments: appr.arguments,
        reason: appr.reason,
        createdAt: appr.createdAt,
        resolvedAt: appr.resolvedAt,
      });
      approvalsCloned += 1;
    }
  }

  let jobsCloned = 0;
  if (opts.includeJobs) {
    const allJobs = await db.select().from(jobs);
    const related = allJobs.filter((j) => {
      const payload = j.payload as Record<string, unknown> | null;
      if (!payload) return false;
      return payload.workspaceId === source.id || payload.workspaceSlug === source.slug;
    });
    for (const job of related) {
      const existing = await db.select().from(jobs).where(eq(jobs.id, job.id)).limit(1);
      if (existing.length) continue;
      await db.insert(jobs).values({
        id: randomUUID(),
        kind: job.kind,
        status: job.status,
        payload: {
          ...(job.payload as Record<string, unknown>),
          workspaceId: target.id,
          workspaceSlug: target.slug,
          clonedFromJobId: job.id,
        },
        result: job.result,
        error: job.error,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
        completedAt: job.completedAt,
      });
      jobsCloned += 1;
    }
  }

  let scheduleTemplatesCloned = 0;
  if (opts.includeScheduleTemplates) {
    const tpl = await cloneWorkspaceJobTemplates(source.slug, target.slug);
    scheduleTemplatesCloned = tpl.cloned;
  }

  return {
    sourceSlug,
    targetSlug: target.slug,
    targetWorkspaceId: target.id,
    conversationCount: exportData.conversations.length,
    projectsCloned,
    memoriesCloned,
    approvalsCloned,
    jobsCloned,
    scheduleTemplatesCloned,
    imported,
  };
}

/** @deprecated use cloneWorkspaceFull */
export const cloneWorkspaceConversations = cloneWorkspaceFull;
