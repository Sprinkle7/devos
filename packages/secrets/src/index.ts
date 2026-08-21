import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { getDevaiosHome, nowIso } from "@devaios/shared-kernel";
import { keychainAvailable, keychainGet, keychainRemove, keychainSet } from "./keychain.js";

export type SecretsBackend = "file" | "keychain";

type SecretRecord = {
  name: string;
  ciphertext: string;
  iv: string;
  tag: string;
  salt: string;
  updatedAt: string;
};

type StoreFile = {
  version: 1;
  backend?: SecretsBackend;
  secrets: SecretRecord[];
  keychainNames?: Array<{ name: string; updatedAt: string }>;
};

function masterKey(passphrase: string, salt: Buffer): Buffer {
  return scryptSync(passphrase, salt, 32);
}

function resolveBackend(env: NodeJS.ProcessEnv = process.env): SecretsBackend {
  const raw = env.DEVAIO_SECRETS_BACKEND?.toLowerCase();
  if (raw === "keychain" && keychainAvailable()) return "keychain";
  return "file";
}

/**
 * Local secrets store with optional macOS Keychain backend (Milestone 06).
 * Passphrase from DEVAIO_SECRETS_KEY or default local-dev key (file backend only).
 */
export class SecretsStore {
  private readonly storePath: string;
  private readonly passphrase: string;
  private readonly backend: SecretsBackend;

  constructor(
    home = getDevaiosHome(),
    passphrase = process.env.DEVAIO_SECRETS_KEY ?? "devaios-local-dev-key",
    backend = resolveBackend(),
  ) {
    this.storePath = join(home, "secrets", "secrets.json");
    this.passphrase = passphrase;
    this.backend = backend;
  }

  getBackend(): SecretsBackend {
    return this.backend;
  }

  isKeychainAvailable(): boolean {
    return keychainAvailable();
  }

  private async ensure(): Promise<StoreFile> {
    await mkdir(dirname(this.storePath), { recursive: true });
    try {
      const file = JSON.parse(await readFile(this.storePath, "utf8")) as StoreFile;
      if (!file.keychainNames) file.keychainNames = [];
      return file;
    } catch {
      const empty: StoreFile = {
        version: 1,
        backend: this.backend,
        secrets: [],
        keychainNames: [],
      };
      await writeFile(this.storePath, JSON.stringify(empty, null, 2) + "\n", "utf8");
      return empty;
    }
  }

  private async save(file: StoreFile): Promise<void> {
    file.backend = this.backend;
    await writeFile(this.storePath, JSON.stringify(file, null, 2) + "\n", "utf8");
  }

  async listNames(): Promise<Array<{ name: string; updatedAt: string }>> {
    const file = await this.ensure();
    if (this.backend === "keychain") {
      return (file.keychainNames ?? []).map((s) => ({ name: s.name, updatedAt: s.updatedAt }));
    }
    return file.secrets.map((s) => ({ name: s.name, updatedAt: s.updatedAt }));
  }

  async set(name: string, value: string): Promise<void> {
    if (this.backend === "keychain") {
      const result = keychainSet(name, value);
      if (!result.ok) throw new Error(result.error ?? "keychain_set_failed");
      const file = await this.ensure();
      const idx = (file.keychainNames ?? []).findIndex((s) => s.name === name);
      const row = { name, updatedAt: nowIso() };
      if (idx >= 0) file.keychainNames![idx] = row;
      else file.keychainNames!.push(row);
      await this.save(file);
      return;
    }

    const file = await this.ensure();
    const salt = randomBytes(16);
    const iv = randomBytes(12);
    const key = masterKey(this.passphrase, salt);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const enc = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    const row: SecretRecord = {
      name,
      ciphertext: enc.toString("base64"),
      iv: iv.toString("base64"),
      tag: tag.toString("base64"),
      salt: salt.toString("base64"),
      updatedAt: nowIso(),
    };
    const idx = file.secrets.findIndex((s) => s.name === name);
    if (idx >= 0) file.secrets[idx] = row;
    else file.secrets.push(row);
    await this.save(file);
  }

  async get(name: string): Promise<string | null> {
    if (this.backend === "keychain") return keychainGet(name);
    const file = await this.ensure();
    const row = file.secrets.find((s) => s.name === name);
    if (!row) return null;
    const key = masterKey(this.passphrase, Buffer.from(row.salt, "base64"));
    const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(row.iv, "base64"));
    decipher.setAuthTag(Buffer.from(row.tag, "base64"));
    const dec = Buffer.concat([
      decipher.update(Buffer.from(row.ciphertext, "base64")),
      decipher.final(),
    ]);
    return dec.toString("utf8");
  }

  async remove(name: string): Promise<boolean> {
    if (this.backend === "keychain") {
      const ok = keychainRemove(name);
      if (!ok) return false;
      const file = await this.ensure();
      file.keychainNames = (file.keychainNames ?? []).filter((s) => s.name !== name);
      await this.save(file);
      return true;
    }
    const file = await this.ensure();
    const next = file.secrets.filter((s) => s.name !== name);
    if (next.length === file.secrets.length) return false;
    file.secrets = next;
    await this.save(file);
    return true;
  }
}

export { keychainAvailable };
