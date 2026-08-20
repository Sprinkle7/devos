#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { access, mkdir } from "node:fs/promises";
import { getDevaiosHome } from "@devaios/shared-kernel";

const cmd = process.argv[2] ?? "help";

async function doctor() {
  const home = getDevaiosHome(process.env.DEVAIO_HOME);
  await mkdir(home, { recursive: true });
  console.log(`DEVAIO_HOME=${home}`);

  const node = process.version;
  console.log(`node=${node}`);

  const pnpm = spawnSync("pnpm", ["-v"], { encoding: "utf8" });
  console.log(`pnpm=${pnpm.stdout.trim() || "missing"}`);

  const url = process.env.DATABASE_URL ?? "postgresql://ad@localhost:5432/devaios";
  console.log(`DATABASE_URL=${url}`);

  const psql = spawnSync("psql", [url, "-c", "SELECT 1"], { encoding: "utf8" });
  if (psql.status === 0) {
    console.log("postgres=ok");
  } else {
    console.log("postgres=FAIL");
    console.log(psql.stderr || psql.stdout);
  }

  try {
    await access("package.json");
    console.log("repo=ok");
  } catch {
    console.log("repo=missing package.json (run from repo root)");
  }
}

async function bootstrap() {
  await doctor();
  console.log("\nNext:");
  console.log("  1. cp .env.example .env   # if needed");
  console.log("  2. pnpm install");
  console.log("  3. Ensure Postgres DB `devaios` exists (local) OR: docker compose up -d postgres");
  console.log("  4. pnpm dev");
  console.log("  5. Open http://127.0.0.1:5173");
}

function help() {
  console.log(`devaios <command>

Commands:
  doctor     Check node/pnpm/postgres/home
  bootstrap  Doctor + print setup steps
  help       Show this help
`);
}

async function main() {
  if (cmd === "doctor") await doctor();
  else if (cmd === "bootstrap") await bootstrap();
  else help();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
