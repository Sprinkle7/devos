import { and, eq } from "drizzle-orm";
import { db } from "./db/client.js";
import { approvalRequests } from "./db/schema.js";

export type ApprovalRow = typeof approvalRequests.$inferSelect;

export async function createApprovalRequest(input: {
  workspaceId: string;
  server: string;
  tool: string;
  arguments?: Record<string, unknown>;
  reason?: string;
}): Promise<ApprovalRow> {
  const [row] = await db
    .insert(approvalRequests)
    .values({
      workspaceId: input.workspaceId,
      status: "pending",
      server: input.server,
      tool: input.tool,
      arguments: input.arguments ?? {},
      reason: input.reason ?? null,
    })
    .returning();
  return row;
}

export async function listApprovalRequests(
  workspaceId: string,
  status?: string,
): Promise<ApprovalRow[]> {
  if (status) {
    return db
      .select()
      .from(approvalRequests)
      .where(and(eq(approvalRequests.workspaceId, workspaceId), eq(approvalRequests.status, status)));
  }
  return db.select().from(approvalRequests).where(eq(approvalRequests.workspaceId, workspaceId));
}

export async function resolveApprovalRequest(
  id: string,
  workspaceId: string,
  status: "approved" | "rejected",
): Promise<ApprovalRow | null> {
  const [row] = await db
    .select()
    .from(approvalRequests)
    .where(eq(approvalRequests.id, id))
    .limit(1);
  if (!row || row.workspaceId !== workspaceId) return null;
  const [updated] = await db
    .update(approvalRequests)
    .set({ status, resolvedAt: new Date() })
    .where(eq(approvalRequests.id, id))
    .returning();
  return updated ?? null;
}

export async function isToolApproved(
  workspaceId: string,
  server: string,
  tool: string,
): Promise<boolean> {
  const rows = await listApprovalRequests(workspaceId, "approved");
  return rows.some((r) => r.server === server && r.tool === tool);
}
