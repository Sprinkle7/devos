import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getDevaiosHome } from "@devaios/shared-kernel";
import { log } from "./log.js";

export type BackupSchedule = {
  enabled: boolean;
  intervalMinutes: number;
  encrypt: boolean;
  sign: boolean;
  lastRunAt?: string | null;
  lastPath?: string | null;
};

const defaultSchedule = (): BackupSchedule => ({
  enabled: false,
  intervalMinutes: 1440,
  encrypt: false,
  sign: false,
  lastRunAt: null,
  lastPath: null,
});

function schedulePath(home = getDevaiosHome()) {
  return join(home, "backup-schedule.json");
}

export async function loadBackupSchedule(home = getDevaiosHome()): Promise<BackupSchedule> {
  await mkdir(home, { recursive: true });
  try {
    const raw = JSON.parse(await readFile(schedulePath(home), "utf8")) as Partial<BackupSchedule>;
    return { ...defaultSchedule(), ...raw };
  } catch {
    return defaultSchedule();
  }
}

export async function saveBackupSchedule(
  patch: Partial<BackupSchedule>,
  home = getDevaiosHome(),
): Promise<BackupSchedule> {
  const current = await loadBackupSchedule(home);
  const next = { ...current, ...patch };
  await writeFile(schedulePath(home), JSON.stringify(next, null, 2) + "\n", "utf8");
  return next;
}

export function startBackupScheduler(
  tick: () => Promise<{ path: string } | null>,
  home = getDevaiosHome(),
): () => void {
  let timer: ReturnType<typeof setInterval> | null = null;
  let running = false;

  const runTick = async () => {
    if (running) return;
    const schedule = await loadBackupSchedule(home);
    if (!schedule.enabled) return;
    running = true;
    try {
      const result = await tick();
      if (result?.path) {
        await saveBackupSchedule(
          { lastRunAt: new Date().toISOString(), lastPath: result.path },
          home,
        );
        log("info", "backup.schedule.completed", { path: result.path });
      }
    } catch (err) {
      log("error", "backup.schedule.failed", { err: String(err) });
    } finally {
      running = false;
    }
  };

  const arm = async () => {
    if (timer) clearInterval(timer);
    const schedule = await loadBackupSchedule(home);
    if (!schedule.enabled || schedule.intervalMinutes < 1) return;
    const ms = schedule.intervalMinutes * 60_000;
    timer = setInterval(() => {
      void runTick();
    }, ms);
    log("info", "backup.schedule.armed", { intervalMinutes: schedule.intervalMinutes });
  };

  void arm();

  return () => {
    if (timer) clearInterval(timer);
  };
}
