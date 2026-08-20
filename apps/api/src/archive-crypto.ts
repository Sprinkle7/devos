import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { nowIso } from "@devaios/shared-kernel";
import type { MultiWorkspaceArchive } from "./conversation-export.js";

export type EncryptedArchiveEnvelope = {
  version: 2;
  encrypted: true;
  algorithm: "aes-256-gcm";
  iv: string;
  tag: string;
  salt: string;
  ciphertext: string;
  exportedAt: string;
};

function deriveKey(passphrase: string, salt: Buffer): Buffer {
  return scryptSync(passphrase, salt, 32);
}

export function encryptArchive(
  archive: MultiWorkspaceArchive,
  passphrase: string,
): EncryptedArchiveEnvelope {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = deriveKey(passphrase, salt);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const plaintext = JSON.stringify(archive);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    version: 2,
    encrypted: true,
    algorithm: "aes-256-gcm",
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    salt: salt.toString("base64"),
    ciphertext: enc.toString("base64"),
    exportedAt: nowIso(),
  };
}

export function decryptArchive(
  envelope: EncryptedArchiveEnvelope,
  passphrase: string,
): MultiWorkspaceArchive {
  const key = deriveKey(passphrase, Buffer.from(envelope.salt, "base64"));
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(envelope.iv, "base64"));
  decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));
  const dec = Buffer.concat([
    decipher.update(Buffer.from(envelope.ciphertext, "base64")),
    decipher.final(),
  ]);
  return JSON.parse(dec.toString("utf8")) as MultiWorkspaceArchive;
}

export function isEncryptedArchive(raw: unknown): raw is EncryptedArchiveEnvelope {
  return (
    typeof raw === "object" &&
    raw !== null &&
    (raw as EncryptedArchiveEnvelope).encrypted === true &&
    (raw as EncryptedArchiveEnvelope).version === 2
  );
}
