import { sql } from "drizzle-orm";
import { db } from "./db/client.js";

export type ConversationSearchHit = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  matchSource?: "title" | "message";
};

/**
 * Search conversations by title (ILIKE) or message body (Postgres FTS).
 */
export async function searchConversations(
  workspaceId: string,
  query: string,
): Promise<ConversationSearchHit[]> {
  const q = query.trim();
  if (!q) return [];

  const pattern = `%${q.replace(/[%_\\]/g, "")}%`;
  const ftsQuery = q.replace(/[^\w\s-]/g, " ").trim();
  if (!ftsQuery) return [];

  const result = await db.execute(sql`
    SELECT
      c.id,
      c.title,
      c.created_at,
      c.updated_at,
      CASE
        WHEN c.title ILIKE ${pattern} THEN 'title'
        ELSE 'message'
      END AS match_source
    FROM conversations c
    WHERE c.workspace_id = ${workspaceId}
      AND (
        c.title ILIKE ${pattern}
        OR EXISTS (
          SELECT 1 FROM messages m
          WHERE m.conversation_id = c.id
            AND to_tsvector('english', coalesce(m.content, ''))
                @@ plainto_tsquery('english', ${ftsQuery})
        )
      )
    ORDER BY c.updated_at DESC
  `);

  const rows = [...result] as Array<{
    id: string;
    title: string;
    created_at: Date;
    updated_at: Date;
    match_source: "title" | "message";
  }>;

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    createdAt: r.created_at instanceof Date ? r.created_at : new Date(String(r.created_at)),
    updatedAt: r.updated_at instanceof Date ? r.updated_at : new Date(String(r.updated_at)),
    matchSource: r.match_source,
  }));
}
