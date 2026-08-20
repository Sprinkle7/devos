import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getDevaiosHome } from "@devaios/shared-kernel";
import { log } from "./log.js";

export type ArchiveExportSchedule = {
  enabled: boolean;
  intervalMinutes: number;
  lastRunAt?: string | null;
  lastPath?: string | null;
};

const defaultSchedule = (): ArchiveExportSchedule => ({
  enabled: false,
  intervalMinutes: 10080,
  lastRunAt: null,
  lastPath: null,
});

function schedulePath(home = getDevaiosHome()) {
  return join(home, "archive-export-schedule.json");
}

export async function loadArchiveExportSchedule(home = getDevaiosHome()): Promise<ArchiveExportSchedule> {
  await mkdir(home, { recursive: true });
  try {
    const raw = JSON.parse(await readFile(schedulePath(home), "utf8")) as Partial<ArchiveExportSchedule>;
    return { ...defaultSchedule(), ...raw };
  } catch {
    return defaultSchedule();
  }
}

export async function saveArchiveExportSchedule(
  patch: Partial<ArchiveExportSchedule>,
  home = getDevaiosHome(),
): Promise<ArchiveExportSchedule> {
  const current = await loadArchiveExportSchedule(home);
  const next = { ...current, ...patch };
  await writeFile(schedulePath(home), JSON.stringify(next, null, 2) + "\n", "utf8");
  return next;
}

export function startArchiveExportScheduler(
  tick: () => Promise<{ path: string } | null>,
  home = getDevaiosHome(),
): () => void {
  let timer: ReturnType<typeof setInterval> | null = null;
  let running = false;

  const runTick = async () => {
    if (running) return;
    const schedule = await loadArchiveExportSchedule(home);
    if (!schedule.enabled) return;
    running = true;
    try {
      const result = await tick();
      if (result?.path) {
        await saveArchiveExportSchedule(
          { lastRunAt: new Date().toISOString(), lastPath: result.path },
          home,
        );
        log("info", "archive.schedule.completed", { path: result.path });
      }
    } catch (err) {
      log("error", "archive.schedule.failed", { err: String(err) });
    } finally {
      running = false;
    }
  };

  const arm = async () => {
    if (timer) clearInterval(timer);
    const schedule = await loadArchiveExportSchedule(home);
    if (!schedule.enabled || schedule.intervalMinutes < 1) return;
    timer = setInterval(() => {
      void runTick();
    }, schedule.intervalMinutes * 60_000);
    log("info", "archive.schedule.armed", { intervalMinutes: schedule.intervalMinutes });
  };

  void arm();

  return () => {
    if (timer) clearInterval(timer);
  };
}
