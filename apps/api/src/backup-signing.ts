import { generateKeyPairSync, sign, verify } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getDevaiosHome } from "@devaios/shared-kernel";
import type { BackupBundle, EncryptedBackupEnvelope } from "./backup.js";

export type SignedBackupEnvelope = {
  version: 4;
  signed: true;
  algorithm: "ed25519";
  publicKey: string;
  signature: string;
  payload: BackupBundle | EncryptedBackupEnvelope;
  signedAt: string;
};

type SigningKeyFile = {
  version: 1;
  publicKey: string;
  privateKey: string;
};

function canonicalPayload(payload: BackupBundle | EncryptedBackupEnvelope): string {
  return JSON.stringify(payload);
}

export async function getOrCreateSigningKey(home = getDevaiosHome()): Promise<SigningKeyFile> {
  // shared by backup + archive signing (same key file)
  const dir = join(home, "keys");
  await mkdir(dir, { recursive: true });
  const path = join(dir, "backup-signing.json");
  try {
    return JSON.parse(await readFile(path, "utf8")) as SigningKeyFile;
  } catch {
    const { publicKey, privateKey } = generateKeyPairSync("ed25519", {
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    const file: SigningKeyFile = { version: 1, publicKey, privateKey };
    await writeFile(path, JSON.stringify(file, null, 2) + "\n", { encoding: "utf8", mode: 0o600 });
    return file;
  }
}

export async function signBackupPayload(
  payload: BackupBundle | EncryptedBackupEnvelope,
  home = getDevaiosHome(),
): Promise<SignedBackupEnvelope> {
  const keys = await getOrCreateSigningKey(home);
  const data = Buffer.from(canonicalPayload(payload));
  const signature = sign(null, data, keys.privateKey).toString("base64");
  return {
    version: 4,
    signed: true,
    algorithm: "ed25519",
    publicKey: keys.publicKey,
    signature,
    payload,
    signedAt: new Date().toISOString(),
  };
}

export function verifySignedBackup(envelope: SignedBackupEnvelope): boolean {
  try {
    const data = Buffer.from(canonicalPayload(envelope.payload));
    return verify(null, data, envelope.publicKey, Buffer.from(envelope.signature, "base64"));
  } catch {
    return false;
  }
}

export function isSignedBackup(raw: unknown): raw is SignedBackupEnvelope {
  return (
    typeof raw === "object" &&
    raw !== null &&
    (raw as SignedBackupEnvelope).signed === true &&
    (raw as SignedBackupEnvelope).version === 4
  );
}

export function unwrapSignedBackup(envelope: SignedBackupEnvelope): BackupBundle | EncryptedBackupEnvelope {
  return envelope.payload;
}
