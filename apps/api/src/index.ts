import { serve } from "@hono/node-server";
import { mkdir } from "node:fs/promises";
import { sql } from "drizzle-orm";
import { loadConfig } from "@devaios/config";
import { app, createArchiveExportRunner, createBackupExportRunner, createJobTemplateRunners } from "./app.js";
import { loadArchiveExportSchedule, startArchiveExportScheduler } from "./archive-export-scheduler.js";
import { loadBackupSchedule, startBackupScheduler } from "./backup-scheduler.js";
import { startJobTemplateRunner } from "./job-template-runner.js";
import { attachJobWebSocket } from "./job-ws.js";
import { db, pgClient } from "./db/client.js";
import { workspaces } from "./db/schema.js";
import { log } from "./log.js";

async function ensureSchema() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS workspaces (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      slug text NOT NULL UNIQUE,
      name text NOT NULL,
      root_path text,
      created_at timestamptz DEFAULT now() NOT NULL,
      updated_at timestamptz DEFAULT now() NOT NULL
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS projects (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
      slug text NOT NULL,
      name text NOT NULL,
      repo_path text,
      created_at timestamptz DEFAULT now() NOT NULL,
      updated_at timestamptz DEFAULT now() NOT NULL
    )
  `);
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS projects_workspace_slug_uidx
    ON projects (workspace_id, slug)
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS memories (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
      kind text NOT NULL,
      title text NOT NULL,
      content text NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL,
      updated_at timestamptz DEFAULT now() NOT NULL
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS conversations (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
      title text NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL,
      updated_at timestamptz DEFAULT now() NOT NULL
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS messages (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      role text NOT NULL,
      content text NOT NULL,
      meta jsonb,
      created_at timestamptz DEFAULT now() NOT NULL
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS approval_requests (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
      status text NOT NULL,
      server text NOT NULL,
      tool text NOT NULL,
      arguments jsonb,
      reason text,
      created_at timestamptz DEFAULT now() NOT NULL,
      resolved_at timestamptz
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS jobs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      kind text NOT NULL,
      status text NOT NULL,
      payload jsonb,
      result jsonb,
      error text,
      created_at timestamptz DEFAULT now() NOT NULL,
      updated_at timestamptz DEFAULT now() NOT NULL,
      completed_at timestamptz
    )
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS messages_content_fts_idx
    ON messages USING gin (to_tsvector('english', coalesce(content, '')))
  `);
}

async function main() {
  const cfg = await loadConfig();
  await mkdir(cfg.home, { recursive: true });
  await ensureSchema();
  log("info", "api.start", { host: cfg.host, port: cfg.apiPort, home: cfg.home });
  const runBackup = createBackupExportRunner();
  startBackupScheduler(async () => {
    const schedule = await loadBackupSchedule(cfg.home);
    if (!schedule.enabled) return null;
    return runBackup({ encrypt: schedule.encrypt, sign: schedule.sign });
  }, cfg.home);
  const runArchive = createArchiveExportRunner();
  startArchiveExportScheduler(async () => {
    const schedule = await loadArchiveExportSchedule(cfg.home);
    if (!schedule.enabled) return null;
    return runArchive();
  }, cfg.home);
  startJobTemplateRunner(async () => {
    const rows = await db.select({ slug: workspaces.slug }).from(workspaces);
    return rows.map((r) => r.slug);
  }, createJobTemplateRunners(), cfg.home);
  const server = serve({ fetch: app.fetch, port: cfg.apiPort, hostname: cfg.host });
  attachJobWebSocket(server as import("node:http").Server);
}

main().catch(async (err) => {
  log("error", "api.failed", { err: String(err) });
  await pgClient.end({ timeout: 5 });
  process.exit(1);
});
