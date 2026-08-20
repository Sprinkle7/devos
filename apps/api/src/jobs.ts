import { eq } from "drizzle-orm";
import type { McpHost } from "@devaios/mcp-host";
import { graphifyBuildAsync } from "@devaios/mcp-host";
import type { ProviderRegistry } from "@devaios/providers";
import { nowIso } from "@devaios/shared-kernel";
import type { BackupExportOptions } from "./backup-export.js";
import { runBackupExport } from "./backup-export.js";
import { db } from "./db/client.js";
import { jobs } from "./db/schema.js";
import { log } from "./log.js";

export type JobRow = typeof jobs.$inferSelect;

export async function getJob(id: string): Promise<JobRow | null> {
  const [row] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return row ?? null;
}

export async function enqueueGraphifyBuild(
  cwd: string,
  mode: "build" | "update" = "update",
): Promise<JobRow> {
  const [row] = await db
    .insert(jobs)
    .values({
      kind: "graphify-build",
      status: "queued",
      payload: { cwd, mode },
    })
    .returning();

  setImmediate(() => {
    void runGraphifyJob(row.id, cwd, mode);
  });

  return row;
}

export async function enqueueBackupExport(
  home: string,
  mcpHost: McpHost,
  providers: ProviderRegistry,
  options: BackupExportOptions = {},
): Promise<JobRow> {
  const [row] = await db
    .insert(jobs)
    .values({
      kind: "backup-export",
      status: "queued",
      payload: options as Record<string, unknown>,
    })
    .returning();

  setImmediate(() => {
    void runBackupExportJob(row.id, home, mcpHost, providers, options);
  });

  return row;
}

export async function enqueueArchiveExport(run: () => Promise<{ path: string }>): Promise<JobRow> {
  const [row] = await db
    .insert(jobs)
    .values({
      kind: "archive-export",
      status: "queued",
      payload: {},
    })
    .returning();

  setImmediate(() => {
    void runArchiveExportJob(row.id, run);
  });

  return row;
}

async function runArchiveExportJob(id: string, run: () => Promise<{ path: string }>): Promise<void> {
  await db
    .update(jobs)
    .set({ status: "running", result: { progress: "exporting" }, updatedAt: new Date() })
    .where(eq(jobs.id, id));

  try {
    const result = await run();
    await db
      .update(jobs)
      .set({
        status: "completed",
        result: result as unknown as Record<string, unknown>,
        updatedAt: new Date(),
        completedAt: new Date(),
      })
      .where(eq(jobs.id, id));
    log("info", "job.completed", { id, kind: "archive-export", path: result.path });
  } catch (err) {
    await db
      .update(jobs)
      .set({
        status: "failed",
        error: String(err),
        updatedAt: new Date(),
        completedAt: new Date(),
      })
      .where(eq(jobs.id, id));
    log("error", "job.failed", { id, kind: "archive-export", err: String(err) });
  }
}

async function runBackupExportJob(
  id: string,
  home: string,
  mcpHost: McpHost,
  providers: ProviderRegistry,
  options: BackupExportOptions,
): Promise<void> {
  await db
    .update(jobs)
    .set({ status: "running", result: { progress: "exporting" }, updatedAt: new Date() })
    .where(eq(jobs.id, id));

  try {
    const result = await runBackupExport(home, mcpHost, providers, options);
    await db
      .update(jobs)
      .set({
        status: "completed",
        result: result as unknown as Record<string, unknown>,
        updatedAt: new Date(),
        completedAt: new Date(),
      })
      .where(eq(jobs.id, id));
    log("info", "job.completed", { id, kind: "backup-export", path: result.path });
  } catch (err) {
    await db
      .update(jobs)
      .set({
        status: "failed",
        error: String(err),
        updatedAt: new Date(),
        completedAt: new Date(),
      })
      .where(eq(jobs.id, id));
    log("error", "job.failed", { id, kind: "backup-export", err: String(err) });
  }
}

async function runGraphifyJob(id: string, cwd: string, mode: "build" | "update"): Promise<void> {
  await db
    .update(jobs)
    .set({
      status: "running",
      result: { progress: "spawned", phase: "graphify" },
      updatedAt: new Date(),
    })
    .where(eq(jobs.id, id));

  const started = graphifyBuildAsync(cwd, mode, async (result) => {
    if (result.ok) {
      await db
        .update(jobs)
        .set({
          status: "completed",
          result: result as unknown as Record<string, unknown>,
          updatedAt: new Date(),
          completedAt: new Date(),
        })
        .where(eq(jobs.id, id));
      log("info", "job.completed", { id, kind: "graphify-build", durationMs: result.durationMs });
    } else {
      await db
        .update(jobs)
        .set({
          status: "failed",
          error: result.reason,
          result: result as unknown as Record<string, unknown>,
          updatedAt: new Date(),
          completedAt: new Date(),
        })
        .where(eq(jobs.id, id));
      log("error", "job.failed", { id, kind: "graphify-build", reason: result.reason });
    }
  });

  if (!started.ok) {
    await db
      .update(jobs)
      .set({
        status: "failed",
        error: started.reason,
        updatedAt: new Date(),
        completedAt: new Date(),
      })
      .where(eq(jobs.id, id));
  }
}

export function mapJob(row: JobRow) {
  return {
    id: row.id,
    kind: row.kind,
    status: row.status,
    payload: row.payload,
    result: row.result,
    error: row.error,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    completedAt: row.completedAt?.toISOString() ?? null,
  };
}

export function deriveConversationTitle(message: string, reply?: string): string {
  const raw = message.trim().replace(/\s+/g, " ");
  if (raw.length <= 72) return raw;
  const words = raw.split(" ").slice(0, 10).join(" ");
  if (words.length <= 72) return words;
  if (reply) {
    const snippet = reply.replace(/\s+/g, " ").trim().slice(0, 40);
    if (snippet) return `${words.slice(0, 40)}… · ${snippet}`;
  }
  return `${raw.slice(0, 69)}…`;
}

export { nowIso };
