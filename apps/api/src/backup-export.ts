import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { McpHost } from "@devaios/mcp-host";
import type { ProviderRegistry } from "@devaios/providers";
import { nowIso } from "@devaios/shared-kernel";
import { writeBackupBundle, type BackupBundle } from "./backup.js";
import { loadBackupRetention, rotateBackups } from "./backup-retention.js";
import { db } from "./db/client.js";
import { approvalRequests, jobs, projects, workspaces } from "./db/schema.js";

export type BackupExportOptions = {
  encrypt?: boolean;
  sign?: boolean;
  passphrase?: string;
};

export async function buildBackupBundle(
  home: string,
  mcpHost: McpHost,
  providers: ProviderRegistry,
): Promise<BackupBundle> {
  const wsRows = await db.select().from(workspaces);
  const projectRows = await db.select().from(projects);
  const approvalRows = await db.select().from(approvalRequests);
  const jobRows = await db.select().from(jobs);
  let configFile: Record<string, unknown> = {};
  try {
    configFile = JSON.parse(await readFile(join(home, "config.json"), "utf8")) as Record<string, unknown>;
  } catch {
    /* empty */
  }

  return {
    version: 3,
    createdAt: nowIso(),
    workspaces: wsRows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      rootPath: r.rootPath,
    })),
    projects: projectRows.map((r) => ({
      id: r.id,
      workspaceId: r.workspaceId,
      slug: r.slug,
      name: r.name,
      repoPath: r.repoPath,
    })),
    mcpServers: await mcpHost.list(),
    config: configFile,
    providers: await providers.list(),
    approvals: approvalRows.map((r) => ({
      id: r.id,
      workspaceId: r.workspaceId,
      status: r.status,
      server: r.server,
      tool: r.tool,
      arguments: r.arguments,
      reason: r.reason,
      createdAt: r.createdAt.toISOString(),
      resolvedAt: r.resolvedAt?.toISOString() ?? null,
    })),
    jobs: jobRows.slice(0, 200).map((r) => ({
      id: r.id,
      kind: r.kind,
      status: r.status,
      payload: r.payload,
      result: r.result,
      error: r.error,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      completedAt: r.completedAt?.toISOString() ?? null,
    })),
  };
}

export async function runBackupExport(
  home: string,
  mcpHost: McpHost,
  providers: ProviderRegistry,
  options: BackupExportOptions = {},
) {
  const bundle = await buildBackupBundle(home, mcpHost, providers);
  const result = await writeBackupBundle(bundle, home, options);
  const policy = await loadBackupRetention(home);
  const rotation = await rotateBackups(home, policy);
  return { ...result, rotation };
}
