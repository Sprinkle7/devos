import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getDevaiosHome, nowIso } from "@devaios/shared-kernel";
import type { McpServerRegistration } from "@devaios/shared-kernel";
import {
  isSignedBackup,
  signBackupPayload,
  verifySignedBackup,
} from "./backup-signing.js";

export type { SignedBackupEnvelope } from "./backup-signing.js";
export { verifySignedBackup, isSignedBackup } from "./backup-signing.js";

export type BackupApproval = {
  id: string;
  workspaceId: string;
  status: string;
  server: string;
  tool: string;
  arguments: unknown;
  reason: string | null;
  createdAt: string;
  resolvedAt: string | null;
};

export type BackupJob = {
  id: string;
  kind: string;
  status: string;
  payload: unknown;
  result: unknown;
  error: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export type BackupConversation = {
  id: string;
  workspaceId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Array<{
    id: string;
    role: string;
    content: string;
    meta: unknown;
    createdAt: string;
  }>;
};

export type BackupBundle = {
  version: 2 | 3 | 4;
  createdAt: string;
  workspaces: Array<{
    id: string;
    slug: string;
    name: string;
    rootPath: string | null;
  }>;
  projects: Array<{
    id: string;
    workspaceId: string;
    slug: string;
    name: string;
    repoPath: string | null;
  }>;
  mcpServers: McpServerRegistration[];
  config: Record<string, unknown>;
  providers: unknown[];
  approvals?: BackupApproval[];
  jobs?: BackupJob[];
  conversations?: BackupConversation[];
};

export type EncryptedBackupEnvelope = {
  version: 3;
  encrypted: true;
  algorithm: "aes-256-gcm";
  iv: string;
  tag: string;
  salt: string;
  ciphertext: string;
  createdAt: string;
};

function deriveKey(passphrase: string, salt: Buffer): Buffer {
  return scryptSync(passphrase, salt, 32);
}

export function encryptBackupBundle(
  bundle: BackupBundle,
  passphrase: string,
): EncryptedBackupEnvelope {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = deriveKey(passphrase, salt);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const plaintext = JSON.stringify({ ...bundle, version: 3 });
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    version: 3,
    encrypted: true,
    algorithm: "aes-256-gcm",
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    salt: salt.toString("base64"),
    ciphertext: enc.toString("base64"),
    createdAt: nowIso(),
  };
}

export function decryptBackupEnvelope(
  envelope: EncryptedBackupEnvelope,
  passphrase: string,
): BackupBundle {
  const key = deriveKey(passphrase, Buffer.from(envelope.salt, "base64"));
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(envelope.iv, "base64"));
  decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));
  const dec = Buffer.concat([
    decipher.update(Buffer.from(envelope.ciphertext, "base64")),
    decipher.final(),
  ]);
  return JSON.parse(dec.toString("utf8")) as BackupBundle;
}

export function isEncryptedBackup(raw: unknown): raw is EncryptedBackupEnvelope {
  return (
    typeof raw === "object" &&
    raw !== null &&
    (raw as EncryptedBackupEnvelope).encrypted === true &&
    (raw as EncryptedBackupEnvelope).version === 3
  );
}

export async function writeBackupBundle(
  bundle: BackupBundle,
  home = getDevaiosHome(),
  options?: { encrypt?: boolean; passphrase?: string; sign?: boolean },
): Promise<{ path: string; encrypted: boolean; signed: boolean; version: number }> {
  const dir = join(home, "backups");
  await mkdir(dir, { recursive: true });
  const stamp = nowIso().replace(/[:.]/g, "-");

  let payload: BackupBundle | EncryptedBackupEnvelope = { ...bundle, version: 3 };

  if (options?.encrypt) {
    const passphrase = options.passphrase ?? process.env.DEVAIO_BACKUP_PASSPHRASE ?? "devaios-backup-dev";
    payload = encryptBackupBundle(bundle, passphrase);
  }

  if (options?.sign) {
    const signed = await signBackupPayload(payload, home);
    const path = join(dir, `devaios-backup-${stamp}.signed.json`);
    await writeFile(path, JSON.stringify(signed, null, 2) + "\n", "utf8");
    return { path, encrypted: Boolean(options.encrypt), signed: true, version: 4 };
  }

  if (options?.encrypt) {
    const path = join(dir, `devaios-backup-${stamp}.enc.json`);
    await writeFile(path, JSON.stringify(payload, null, 2) + "\n", "utf8");
    return { path, encrypted: true, signed: false, version: 3 };
  }

  const path = join(dir, `devaios-backup-${stamp}.json`);
  await writeFile(path, JSON.stringify(bundle, null, 2) + "\n", "utf8");
  return { path, encrypted: false, signed: false, version: bundle.version ?? 2 };
}

export async function readBackupBundle(path: string, passphrase?: string): Promise<BackupBundle> {
  let raw = JSON.parse(await readFile(path, "utf8")) as unknown;

  if (isSignedBackup(raw)) {
    if (!verifySignedBackup(raw)) throw new Error("backup_signature_invalid");
    raw = raw.payload;
  }

  if (isEncryptedBackup(raw)) {
    const key = passphrase ?? process.env.DEVAIO_BACKUP_PASSPHRASE;
    if (!key) throw new Error("backup_passphrase_required");
    return decryptBackupEnvelope(raw, key);
  }
  return raw as BackupBundle;
}
