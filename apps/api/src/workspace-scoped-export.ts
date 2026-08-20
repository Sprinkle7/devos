import { eq } from "drizzle-orm";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getDevaiosHome, nowIso } from "@devaios/shared-kernel";
import { signBackupPayload } from "./backup-signing.js";
import { encryptBackupBundle, type BackupBundle } from "./backup.js";
import {
  exportWorkspaceConversations,
  writeArchiveFile,
  type MultiWorkspaceArchive,
} from "./conversation-export.js";
import { db } from "./db/client.js";
import { approvalRequests, memories, projects, workspaces } from "./db/schema.js";

export type WorkspaceScopedExportOptions = {
  encrypt?: boolean;
  sign?: boolean;
  passphrase?: string;
};

export async function exportWorkspaceScopedBackup(
  workspaceSlug: string,
  home = getDevaiosHome(),
  options: WorkspaceScopedExportOptions = {},
): Promise<{ path: string; signed: boolean }> {
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, workspaceSlug)).limit(1);
  if (!ws) throw new Error("workspace_not_found");

  const wsProjects = await db.select().from(projects).where(eq(projects.workspaceId, ws.id));
  const wsMemories = await db.select().from(memories).where(eq(memories.workspaceId, ws.id));
  const wsApprovals = await db.select().from(approvalRequests).where(eq(approvalRequests.workspaceId, ws.id));
  const convExport = await exportWorkspaceConversations(ws.id, ws.slug);

  const bundle: BackupBundle = {
    version: 3,
    createdAt: nowIso(),
    workspaces: [{ id: ws.id, slug: ws.slug, name: ws.name, rootPath: ws.rootPath }],
    projects: wsProjects.map((p) => ({
      id: p.id,
      workspaceId: p.workspaceId,
      slug: p.slug,
      name: p.name,
      repoPath: p.repoPath,
    })),
    mcpServers: [],
    config: { scoped: true, workspaceSlug },
    providers: [],
    approvals: wsApprovals.map((a) => ({
      id: a.id,
      workspaceId: a.workspaceId,
      status: a.status,
      server: a.server,
      tool: a.tool,
      arguments: a.arguments,
      reason: a.reason,
      createdAt: a.createdAt.toISOString(),
      resolvedAt: a.resolvedAt?.toISOString() ?? null,
    })),
    conversations: convExport.conversations,
  };

  const dir = join(home, "backups");
  await mkdir(dir, { recursive: true });
  const stamp = nowIso().replace(/[:.]/g, "-");
  let payload: BackupBundle | Awaited<ReturnType<typeof signBackupPayload>>["payload"] = {
    ...bundle,
    config: { ...bundle.config, memories: wsMemories.length },
  };

  if (options.encrypt) {
    const passphrase =
      options.passphrase ?? process.env.DEVAIO_BACKUP_PASSPHRASE ?? "devaios-backup-dev";
    payload = encryptBackupBundle(payload as BackupBundle, passphrase);
  }

  if (options.sign) {
    const signed = await signBackupPayload(payload, home);
    const path = join(
      dir,
      options.encrypt ?
        `workspace-${workspaceSlug}-${stamp}.signed.enc.json`
      : `workspace-${workspaceSlug}-${stamp}.signed.json`,
    );
    await writeFile(path, JSON.stringify(signed, null, 2) + "\n", "utf8");
    return { path, signed: true };
  }

  if (options.encrypt) {
    const path = join(dir, `workspace-${workspaceSlug}-${stamp}.enc.json`);
    await writeFile(path, JSON.stringify(payload, null, 2) + "\n", "utf8");
    return { path, signed: false };
  }

  const path = join(dir, `workspace-${workspaceSlug}-${stamp}.json`);
  await writeFile(path, JSON.stringify(payload, null, 2) + "\n", "utf8");
  return { path, signed: false };
}

export async function exportWorkspaceScopedArchive(
  workspaceSlug: string,
  home = getDevaiosHome(),
  options: WorkspaceScopedExportOptions = {},
): Promise<{ path: string; signed: boolean; encrypted: boolean }> {
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, workspaceSlug)).limit(1);
  if (!ws) throw new Error("workspace_not_found");

  const wsExport = await exportWorkspaceConversations(ws.id, ws.slug);
  const archive: MultiWorkspaceArchive = {
    version: 1,
    exportedAt: nowIso(),
    workspaces: [wsExport],
  };
  const result = await writeArchiveFile(archive, home, options);
  return { path: result.path, signed: result.signed, encrypted: result.encrypted };
}
