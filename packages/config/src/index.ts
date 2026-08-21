import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getDevaiosHome } from "@devaios/shared-kernel";

export type DevaiosConfig = {
  home: string;
  databaseUrl: string;
  apiPort: number;
  host: string;
  defaultContextBudget: number;
};

const defaults = (): Omit<DevaiosConfig, "home" | "databaseUrl"> => ({
  apiPort: 8787,
  host: "127.0.0.1",
  defaultContextBudget: 4000,
});

export async function loadConfig(env: NodeJS.ProcessEnv = process.env): Promise<DevaiosConfig> {
  const home = getDevaiosHome(env.DEVAIO_HOME);
  await mkdir(home, { recursive: true });
  const path = join(home, "config.json");
  let file: Partial<DevaiosConfig> = {};
  try {
    file = JSON.parse(await readFile(path, "utf8")) as Partial<DevaiosConfig>;
  } catch {
    await writeFile(
      path,
      JSON.stringify(
        {
          apiPort: defaults().apiPort,
          host: defaults().host,
          defaultContextBudget: defaults().defaultContextBudget,
        },
        null,
        2,
      ) + "\n",
      "utf8",
    );
  }

  const base = defaults();
  return {
    home,
    databaseUrl: env.DATABASE_URL ?? "postgresql://ad@localhost:5432/devaios",
    apiPort: Number(env.API_PORT ?? file.apiPort ?? base.apiPort),
    host: env.HOST ?? file.host ?? base.host,
    defaultContextBudget: Number(
      env.DEFAULT_CONTEXT_BUDGET ?? file.defaultContextBudget ?? base.defaultContextBudget,
    ),
  };
}

export async function saveConfigPatch(
  patch: Partial<Pick<DevaiosConfig, "apiPort" | "host" | "defaultContextBudget">>,
  env: NodeJS.ProcessEnv = process.env,
): Promise<DevaiosConfig> {
  const cfg = await loadConfig(env);
  const next = {
    apiPort: patch.apiPort ?? cfg.apiPort,
    host: patch.host ?? cfg.host,
    defaultContextBudget: patch.defaultContextBudget ?? cfg.defaultContextBudget,
  };
  const path = join(cfg.home, "config.json");
  await writeFile(path, JSON.stringify(next, null, 2) + "\n", "utf8");
  return loadConfig(env);
}
