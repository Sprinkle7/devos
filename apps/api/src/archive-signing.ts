import { sign, verify } from "node:crypto";
import type { EncryptedArchiveEnvelope } from "./archive-crypto.js";
import { getOrCreateSigningKey } from "./backup-signing.js";
import type { MultiWorkspaceArchive } from "./conversation-export.js";
import { getDevaiosHome } from "@devaios/shared-kernel";

export type SignedArchiveEnvelope = {
  version: 2;
  signed: true;
  algorithm: "ed25519";
  publicKey: string;
  signature: string;
  payload: MultiWorkspaceArchive | EncryptedArchiveEnvelope;
  signedAt: string;
};

function canonicalPayload(payload: MultiWorkspaceArchive | EncryptedArchiveEnvelope): string {
  return JSON.stringify(payload);
}

export async function signArchivePayload(
  payload: MultiWorkspaceArchive | EncryptedArchiveEnvelope,
  home = getDevaiosHome(),
): Promise<SignedArchiveEnvelope> {
  const keys = await getOrCreateSigningKey(home);
  const data = Buffer.from(canonicalPayload(payload));
  const signature = sign(null, data, keys.privateKey).toString("base64");
  return {
    version: 2,
    signed: true,
    algorithm: "ed25519",
    publicKey: keys.publicKey,
    signature,
    payload,
    signedAt: new Date().toISOString(),
  };
}

export function verifySignedArchive(envelope: SignedArchiveEnvelope): boolean {
  try {
    const data = Buffer.from(canonicalPayload(envelope.payload));
    return verify(null, data, envelope.publicKey, Buffer.from(envelope.signature, "base64"));
  } catch {
    return false;
  }
}

export function isSignedArchive(raw: unknown): raw is SignedArchiveEnvelope {
  return (
    typeof raw === "object" &&
    raw !== null &&
    (raw as SignedArchiveEnvelope).signed === true &&
    (raw as SignedArchiveEnvelope).version === 2 &&
    (raw as SignedArchiveEnvelope).algorithm === "ed25519"
  );
}

export function unwrapSignedArchive(
  envelope: SignedArchiveEnvelope,
): MultiWorkspaceArchive | EncryptedArchiveEnvelope {
  return envelope.payload;
}
