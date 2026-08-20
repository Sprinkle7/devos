import { randomUUID } from "node:crypto";
import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "./db/client.js";
import { conversations, messages } from "./db/schema.js";

export function normalizeConversationTitle(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, " ");
}

export type MergeDuplicatesResult = {
  mergedGroups: number;
  removedConversations: number;
  movedMessages: number;
};

export async function mergeDuplicateConversationsByTitle(
  workspaceId: string,
): Promise<MergeDuplicatesResult> {
  const rows = await db
    .select()
    .from(conversations)
    .where(eq(conversations.workspaceId, workspaceId))
    .orderBy(asc(conversations.createdAt));

  const groups = new Map<string, typeof rows>();
  for (const row of rows) {
    const key = normalizeConversationTitle(row.title);
    const bucket = groups.get(key) ?? [];
    bucket.push(row);
    groups.set(key, bucket);
  }

  let mergedGroups = 0;
  let removedConversations = 0;
  let movedMessages = 0;

  for (const group of groups.values()) {
    if (group.length < 2) continue;
    mergedGroups += 1;
    const [keeper, ...dupes] = group;
    const dupeIds = dupes.map((d) => d.id);

    const dupeMessages = await db
      .select()
      .from(messages)
      .where(inArray(messages.conversationId, dupeIds))
      .orderBy(asc(messages.createdAt));

    for (const msg of dupeMessages) {
      await db.insert(messages).values({
        id: randomUUID(),
        conversationId: keeper.id,
        role: msg.role,
        content: msg.content,
        meta: msg.meta,
        createdAt: msg.createdAt,
      });
      movedMessages += 1;
    }

    await db.delete(messages).where(inArray(messages.conversationId, dupeIds));
    await db
      .delete(conversations)
      .where(and(eq(conversations.workspaceId, workspaceId), inArray(conversations.id, dupeIds)));

    const latestUpdated = dupes.reduce(
      (max, d) => (d.updatedAt > max ? d.updatedAt : max),
      keeper.updatedAt,
    );
    await db
      .update(conversations)
      .set({ updatedAt: latestUpdated })
      .where(eq(conversations.id, keeper.id));

    removedConversations += dupes.length;
  }

  return { mergedGroups, removedConversations, movedMessages };
}
