import { spawnSync } from "node:child_process";
import { platform } from "node:os";

const SERVICE = "devaios";

function serviceFor(name: string): string {
  return `${SERVICE}/${name}`;
}

export function keychainAvailable(): boolean {
  return platform() === "darwin";
}

export function keychainSet(name: string, value: string): { ok: boolean; error?: string } {
  if (!keychainAvailable()) return { ok: false, error: "keychain_unavailable" };
  const svc = serviceFor(name);
  spawnSync("security", ["delete-generic-password", "-a", SERVICE, "-s", svc], {
    encoding: "utf8",
  });
  const res = spawnSync(
    "security",
    ["add-generic-password", "-a", SERVICE, "-s", svc, "-w", value, "-U"],
    { encoding: "utf8" },
  );
  if (res.status !== 0) {
    return { ok: false, error: (res.stderr || res.stdout || "keychain_write_failed").trim() };
  }
  return { ok: true };
}

export function keychainGet(name: string): string | null {
  if (!keychainAvailable()) return null;
  const res = spawnSync(
    "security",
    ["find-generic-password", "-a", SERVICE, "-s", serviceFor(name), "-w"],
    { encoding: "utf8" },
  );
  if (res.status !== 0) return null;
  return (res.stdout || "").trim() || null;
}

export function keychainRemove(name: string): boolean {
  if (!keychainAvailable()) return false;
  const res = spawnSync(
    "security",
    ["delete-generic-password", "-a", SERVICE, "-s", serviceFor(name)],
    { encoding: "utf8" },
  );
  return res.status === 0;
}
