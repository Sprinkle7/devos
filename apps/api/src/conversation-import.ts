import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { readFile } from "node:fs/promises";
import { db } from "./db/client.js";
import { conversations, messages, workspaces } from "./db/schema.js";
import type { BackupConversation } from "./backup.js";
import type { WorkspaceConversationExport } from "./conversation-export.js";
import { readArchiveFile } from "./conversation-export.js";
import { normalizeConversationTitle } from "./conversation-merge.js";

export type ImportResult = {
  importedConversations: number;
  importedMessages: number;
  skippedConversations: number;
  replacedConversations?: number;
  mergedByTitle?: number;
};

export type ArchiveImportWorkspaceResult = ImportResult & {
  slug: string;
  targetSlug: string;
  found: boolean;
  remapped: boolean;
};

export type ArchiveImportResult = {
  workspaces: ArchiveImportWorkspaceResult[];
};

export type ImportOptions = {
  dedupeByTitle?: boolean;
  slugMap?: Record<string, string>;
  workspaceSlugs?: string[];
  conversationIds?: string[];
  conflictPolicy?: "skip" | "replace";
};

export type ArchiveConversationPreview = {
  id: string;
  title: string;
  messageCount: number;
  selected: boolean;
  conflict: "insert" | "skip" | "replace";
};

export type ArchiveImportPreviewResult = {
  path: string;
  totalWorkspaces: number;
  selectedWorkspaces: number;
  conflictPolicy: "skip" | "replace";
  totals: {
    conversations: number;
    wouldInsert: number;
    wouldSkip: number;
    wouldReplace: number;
  };
  workspaces: Array<{
    slug: string;
    targetSlug: string;
    remapped: boolean;
    found: boolean;
    conversationCount: number;
    selected: boolean;
    conflicts: {
      wouldInsert: number;
      wouldSkip: number;
      wouldReplace: number;
    };
    conversations: ArchiveConversationPreview[];
  }>;
};

async function previewConversationRows(
  workspaceId: string,
  convs: BackupConversation[],
  conflictPolicy: "skip" | "replace",
  idFilter?: Set<string>,
): Promise<ArchiveConversationPreview[]> {
  const rows: ArchiveConversationPreview[] = [];
  for (const conv of convs) {
    const selected = !idFilter || idFilter.has(conv.id);
    const existing = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(and(eq(conversations.id, conv.id), eq(conversations.workspaceId, workspaceId)))
      .limit(1);
    let conflict: ArchiveConversationPreview["conflict"] = "insert";
    if (existing.length) conflict = conflictPolicy === "replace" ? "replace" : "skip";
    rows.push({
      id: conv.id,
      title: conv.title,
      messageCount: conv.messages?.length ?? 0,
      selected,
      conflict,
    });
  }
  return rows;
}

async function countImportConflicts(
  workspaceId: string,
  convs: BackupConversation[],
  conflictPolicy: "skip" | "replace",
): Promise<{ wouldInsert: number; wouldSkip: number; wouldReplace: number }> {
  let wouldInsert = 0;
  let wouldSkip = 0;
  let wouldReplace = 0;

  for (const conv of convs) {
    const existing = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(and(eq(conversations.id, conv.id), eq(conversations.workspaceId, workspaceId)))
      .limit(1);
    if (existing.length) {
      if (conflictPolicy === "replace") wouldReplace += 1;
      else wouldSkip += 1;
    } else {
      wouldInsert += 1;
    }
  }

  return { wouldInsert, wouldSkip, wouldReplace };
}

async function findConversationByTitle(workspaceId: string, title: string) {
  const rows = await db
    .select()
    .from(conversations)
    .where(eq(conversations.workspaceId, workspaceId));
  const key = normalizeConversationTitle(title);
  return rows.find((r) => normalizeConversationTitle(r.title) === key) ?? null;
}

export async function importConversationExport(
  workspaceId: string,
  data: WorkspaceConversationExport | { conversations: BackupConversation[] },
  options: ImportOptions = {},
): Promise<ImportResult> {
  const convFilter = options.conversationIds?.length ? new Set(options.conversationIds) : null;
  const convs = ("conversations" in data ? data.conversations : []).filter(
    (c) => !convFilter || convFilter.has(c.id),
  );
  let importedConversations = 0;
  let importedMessages = 0;
  let skippedConversations = 0;
  let replacedConversations = 0;
  let mergedByTitle = 0;
  const policy = options.conflictPolicy ?? "skip";

  for (const conv of convs) {
    const existing = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conv.id))
      .limit(1);

    if (existing.length) {
      if (policy === "replace") {
        await db.delete(messages).where(eq(messages.conversationId, conv.id));
        await db
          .update(conversations)
          .set({
            title: conv.title,
            updatedAt: new Date(conv.updatedAt),
          })
          .where(eq(conversations.id, conv.id));
        for (const msg of conv.messages ?? []) {
          await db.insert(messages).values({
            id: randomUUID(),
            conversationId: conv.id,
            role: msg.role,
            content: msg.content,
            meta: msg.meta as Record<string, unknown> | null,
            createdAt: new Date(msg.createdAt),
          });
          importedMessages += 1;
        }
        replacedConversations += 1;
      } else {
        skippedConversations += 1;
      }
      continue;
    }

    let targetConvId: string;
    if (options.dedupeByTitle) {
      const match = await findConversationByTitle(workspaceId, conv.title);
      if (match) {
        targetConvId = match.id;
        mergedByTitle += 1;
      } else {
        targetConvId = randomUUID();
        await db.insert(conversations).values({
          id: targetConvId,
          workspaceId,
          title: conv.title,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
        });
        importedConversations += 1;
      }
    } else {
      targetConvId = randomUUID();
      await db.insert(conversations).values({
        id: targetConvId,
        workspaceId,
        title: conv.title,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
      });
      importedConversations += 1;
    }

    for (const msg of conv.messages ?? []) {
      await db.insert(messages).values({
        id: randomUUID(),
        conversationId: targetConvId,
        role: msg.role,
        content: msg.content,
        meta: msg.meta as Record<string, unknown> | null,
        createdAt: new Date(msg.createdAt),
      });
      importedMessages += 1;
    }

    if (options.dedupeByTitle) {
      await db
        .update(conversations)
        .set({ updatedAt: new Date(conv.updatedAt) })
        .where(and(eq(conversations.id, targetConvId), eq(conversations.workspaceId, workspaceId)));
    }
  }

  return { importedConversations, importedMessages, skippedConversations, replacedConversations, mergedByTitle };
}

export async function importConversationExportFromFile(
  workspaceId: string,
  path: string,
  options: ImportOptions = {},
): Promise<ImportResult> {
  const data = JSON.parse(await readFile(path, "utf8")) as WorkspaceConversationExport;
  return importConversationExport(workspaceId, data, options);
}

export async function previewConversationArchiveImport(
  path: string,
  options: ImportOptions = {},
  passphrase?: string,
): Promise<ArchiveImportPreviewResult> {
  const archive = await readArchiveFile(path, passphrase);
  const slugFilter = options.workspaceSlugs?.length ? new Set(options.workspaceSlugs) : null;
  const convFilter = options.conversationIds?.length ? new Set(options.conversationIds) : null;
  const conflictPolicy = options.conflictPolicy ?? "skip";
  const rows: ArchiveImportPreviewResult["workspaces"] = [];
  const totals = { conversations: 0, wouldInsert: 0, wouldSkip: 0, wouldReplace: 0 };

  for (const wsExport of archive.workspaces ?? []) {
    const selected = !slugFilter || slugFilter.has(wsExport.workspaceSlug);
    const targetSlug = options.slugMap?.[wsExport.workspaceSlug] ?? wsExport.workspaceSlug;
    const remapped = targetSlug !== wsExport.workspaceSlug;
    const [ws] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.slug, targetSlug))
      .limit(1);

    let conflicts = { wouldInsert: 0, wouldSkip: 0, wouldReplace: 0 };
    let conversationRows: ArchiveConversationPreview[] = [];
    if (ws && selected) {
      const filteredConvs = (wsExport.conversations ?? []).filter(
        (c) => !convFilter || convFilter.has(c.id),
      );
      conversationRows = await previewConversationRows(ws.id, filteredConvs, conflictPolicy, convFilter ?? undefined);
      conflicts = await countImportConflicts(ws.id, filteredConvs, conflictPolicy);
      totals.conversations += wsExport.conversations?.length ?? 0;
      totals.wouldInsert += conflicts.wouldInsert;
      totals.wouldSkip += conflicts.wouldSkip;
      totals.wouldReplace += conflicts.wouldReplace;
    }

    rows.push({
      slug: wsExport.workspaceSlug,
      targetSlug,
      remapped,
      found: Boolean(ws),
      conversationCount: wsExport.conversations?.length ?? 0,
      selected,
      conflicts,
      conversations: conversationRows,
    });
  }

  return {
    path,
    totalWorkspaces: rows.length,
    selectedWorkspaces: rows.filter((w) => w.selected).length,
    conflictPolicy,
    totals,
    workspaces: rows,
  };
}

export async function importConversationArchive(
  path: string,
  options: ImportOptions = {},
  passphrase?: string,
): Promise<ArchiveImportResult> {
  const archive = await readArchiveFile(path, passphrase);
  const slugFilter = options.workspaceSlugs?.length ? new Set(options.workspaceSlugs) : null;
  const results: ArchiveImportWorkspaceResult[] = [];

  for (const wsExport of archive.workspaces ?? []) {
    if (slugFilter && !slugFilter.has(wsExport.workspaceSlug)) continue;
    const targetSlug = options.slugMap?.[wsExport.workspaceSlug] ?? wsExport.workspaceSlug;
    const remapped = targetSlug !== wsExport.workspaceSlug;
    const [ws] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.slug, targetSlug))
      .limit(1);
    if (!ws) {
      results.push({
        slug: wsExport.workspaceSlug,
        targetSlug,
        remapped,
        found: false,
        importedConversations: 0,
        importedMessages: 0,
        skippedConversations: 0,
        mergedByTitle: 0,
      });
      continue;
    }
    const filteredConvs = (wsExport.conversations ?? []).filter(
      (c) => !options.conversationIds?.length || options.conversationIds.includes(c.id),
    );
    const imported = await importConversationExport(
      ws.id,
      { ...wsExport, conversations: filteredConvs },
      options,
    );
    results.push({ slug: wsExport.workspaceSlug, targetSlug, remapped, found: true, ...imported });
  }

  return { workspaces: results };
}
