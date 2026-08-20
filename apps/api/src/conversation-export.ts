import { eq } from "drizzle-orm";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getDevaiosHome, nowIso } from "@devaios/shared-kernel";
import { loadArchiveRetention, rotateArchives, type ArchiveRotationResult } from "./archive-retention.js";
import { decryptArchive, encryptArchive, isEncryptedArchive, type EncryptedArchiveEnvelope } from "./archive-crypto.js";
import {
  isSignedArchive,
  signArchivePayload,
  unwrapSignedArchive,
  verifySignedArchive,
  type SignedArchiveEnvelope,
} from "./archive-signing.js";
import { db } from "./db/client.js";
import { conversations, messages, workspaces } from "./db/schema.js";
import type { BackupConversation } from "./backup.js";

export type WorkspaceConversationExport = {
  exportedAt: string;
  workspaceId: string;
  workspaceSlug: string;
  conversations: BackupConversation[];
};

export type MultiWorkspaceArchive = {
  version: 1;
  exportedAt: string;
  workspaces: WorkspaceConversationExport[];
};

export async function exportWorkspaceConversations(
  workspaceId: string,
  workspaceSlug: string,
): Promise<WorkspaceConversationExport> {
  const convRows = await db
    .select()
    .from(conversations)
    .where(eq(conversations.workspaceId, workspaceId));

  const exported: BackupConversation[] = [];
  for (const conv of convRows) {
    const msgRows = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conv.id));
    exported.push({
      id: conv.id,
      workspaceId: conv.workspaceId,
      title: conv.title,
      createdAt: conv.createdAt.toISOString(),
      updatedAt: conv.updatedAt.toISOString(),
      messages: msgRows.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        meta: m.meta,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  }

  return {
    exportedAt: nowIso(),
    workspaceId,
    workspaceSlug,
    conversations: exported.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  };
}

export async function writeConversationExportFile(
  data: WorkspaceConversationExport,
  home = getDevaiosHome(),
): Promise<string> {
  const dir = join(home, "exports");
  await mkdir(dir, { recursive: true });
  const stamp = nowIso().replace(/[:.]/g, "-");
  const path = join(dir, `conversations-${data.workspaceSlug}-${stamp}.json`);
  await writeFile(path, JSON.stringify(data, null, 2) + "\n", "utf8");
  return path;
}

export async function exportAllWorkspacesArchive(): Promise<MultiWorkspaceArchive> {
  const wsRows = await db.select().from(workspaces);
  const exports: WorkspaceConversationExport[] = [];
  for (const ws of wsRows) {
    exports.push(await exportWorkspaceConversations(ws.id, ws.slug));
  }
  return {
    version: 1,
    exportedAt: nowIso(),
    workspaces: exports,
  };
}

export type WriteArchiveOptions = {
  encrypt?: boolean;
  sign?: boolean;
  passphrase?: string;
};

export type WriteArchiveResult = {
  path: string;
  encrypted: boolean;
  signed: boolean;
  rotation: ArchiveRotationResult;
};

export async function writeArchiveFile(
  archive: MultiWorkspaceArchive,
  home = getDevaiosHome(),
  options?: WriteArchiveOptions,
): Promise<WriteArchiveResult> {
  const dir = join(home, "exports");
  await mkdir(dir, { recursive: true });
  const stamp = nowIso().replace(/[:.]/g, "-");

  let payload: MultiWorkspaceArchive | EncryptedArchiveEnvelope | SignedArchiveEnvelope = archive;
  let encrypted = false;
  let signed = false;

  if (options?.encrypt) {
    const passphrase =
      options.passphrase ?? process.env.DEVAIO_ARCHIVE_PASSPHRASE ?? process.env.DEVAIO_BACKUP_PASSPHRASE ?? "devaios-archive-dev";
    payload = encryptArchive(archive, passphrase);
    encrypted = true;
  }

  if (options?.sign) {
    payload = await signArchivePayload(payload, home);
    signed = true;
    const path = join(
      dir,
      encrypted ? `conversations-archive-${stamp}.signed.enc.json` : `conversations-archive-${stamp}.signed.json`,
    );
    await writeFile(path, JSON.stringify(payload, null, 2) + "\n", "utf8");
    const policy = await loadArchiveRetention(home);
    const rotation = await rotateArchives(home, policy);
    return { path, encrypted, signed, rotation };
  }

  if (encrypted) {
    const path = join(dir, `conversations-archive-${stamp}.enc.json`);
    await writeFile(path, JSON.stringify(payload, null, 2) + "\n", "utf8");
    const policy = await loadArchiveRetention(home);
    const rotation = await rotateArchives(home, policy);
    return { path, encrypted: true, signed: false, rotation };
  }

  const path = join(dir, `conversations-archive-${stamp}.json`);
  await writeFile(path, JSON.stringify(archive, null, 2) + "\n", "utf8");
  const policy = await loadArchiveRetention(home);
  const rotation = await rotateArchives(home, policy);
  return { path, encrypted: false, signed: false, rotation };
}

export async function readArchiveFile(path: string, passphrase?: string): Promise<MultiWorkspaceArchive> {
  let raw = JSON.parse(await readFile(path, "utf8")) as unknown;

  if (isSignedArchive(raw)) {
    if (!verifySignedArchive(raw)) throw new Error("archive_signature_invalid");
    raw = unwrapSignedArchive(raw);
  }

  if (isEncryptedArchive(raw)) {
    const key = passphrase ?? process.env.DEVAIO_ARCHIVE_PASSPHRASE ?? process.env.DEVAIO_BACKUP_PASSPHRASE;
    if (!key) throw new Error("archive_passphrase_required");
    return decryptArchive(raw, key);
  }
  return raw as MultiWorkspaceArchive;
}

export { isSignedArchive, verifySignedArchive } from "./archive-signing.js";
export type { SignedArchiveEnvelope } from "./archive-signing.js";

export async function readConversationExportFile(path: string): Promise<WorkspaceConversationExport> {
  return JSON.parse(await readFile(path, "utf8")) as WorkspaceConversationExport;
}
