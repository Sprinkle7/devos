import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getDevaiosHome } from "@devaios/shared-kernel";

export type ProviderCooldownEntry = {
  providerId: string;
  disabledAt: string;
  retryAt: string;
  reason?: string;
};

export type ProviderCooldownState = {
  version: 1;
  cooldownMinutes: number;
  entries: Record<string, ProviderCooldownEntry>;
};

const DEFAULT_COOLDOWN_MINUTES = 15;

function cooldownPath(home = getDevaiosHome()) {
  return join(home, "providers", "cooldown.json");
}

function defaultState(): ProviderCooldownState {
  return { version: 1, cooldownMinutes: DEFAULT_COOLDOWN_MINUTES, entries: {} };
}

export async function loadProviderCooldown(home = getDevaiosHome()): Promise<ProviderCooldownState> {
  await mkdir(join(home, "providers"), { recursive: true });
  try {
    const raw = JSON.parse(await readFile(cooldownPath(home), "utf8")) as Partial<ProviderCooldownState>;
    return { ...defaultState(), ...raw, entries: raw.entries ?? {} };
  } catch {
    return defaultState();
  }
}

export async function saveProviderCooldown(
  state: ProviderCooldownState,
  home = getDevaiosHome(),
): Promise<void> {
  await mkdir(join(home, "providers"), { recursive: true });
  await writeFile(cooldownPath(home), JSON.stringify(state, null, 2) + "\n", "utf8");
}

export async function recordProviderDisable(
  providerId: string,
  reason?: string,
  home = getDevaiosHome(),
): Promise<ProviderCooldownEntry> {
  const state = await loadProviderCooldown(home);
  const disabledAt = new Date();
  const retryAt = new Date(disabledAt.getTime() + state.cooldownMinutes * 60_000);
  const entry: ProviderCooldownEntry = {
    providerId,
    disabledAt: disabledAt.toISOString(),
    retryAt: retryAt.toISOString(),
    reason,
  };
  state.entries[providerId] = entry;
  await saveProviderCooldown(state, home);
  return entry;
}

export async function clearProviderCooldown(providerId: string, home = getDevaiosHome()): Promise<void> {
  const state = await loadProviderCooldown(home);
  delete state.entries[providerId];
  await saveProviderCooldown(state, home);
}

export async function getProviderCooldown(
  providerId: string,
  home = getDevaiosHome(),
): Promise<ProviderCooldownEntry | null> {
  const state = await loadProviderCooldown(home);
  const entry = state.entries[providerId];
  if (!entry) return null;
  if (new Date(entry.retryAt).getTime() <= Date.now()) {
    delete state.entries[providerId];
    await saveProviderCooldown(state, home);
    return null;
  }
  return entry;
}

export async function saveProviderCooldownMinutes(
  cooldownMinutes: number,
  home = getDevaiosHome(),
): Promise<ProviderCooldownState> {
  const state = await loadProviderCooldown(home);
  state.cooldownMinutes = Math.max(1, Math.min(10_080, cooldownMinutes));
  await saveProviderCooldown(state, home);
  return state;
}

export async function canEnableProvider(
  providerId: string,
  home = getDevaiosHome(),
): Promise<{ allowed: boolean; retryAt?: string; reason?: string }> {
  const entry = await getProviderCooldown(providerId, home);
  if (!entry) return { allowed: true };
  return { allowed: false, retryAt: entry.retryAt, reason: entry.reason };
}
