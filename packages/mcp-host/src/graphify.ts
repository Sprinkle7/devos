import { spawn } from "node:child_process";
import { spawnSync } from "node:child_process";

export type GraphifyQueryResult =
  | { ok: true; method: "cli"; query: string; output: string; durationMs: number }
  | { ok: false; reason: string; query: string };

export type GraphifyBuildResult =
  | { ok: true; method: "cli"; command: string; output: string; durationMs: number }
  | { ok: false; reason: string; command?: string };

function graphifyBin(): string | null {
  const which = spawnSync("which", ["graphify"], { encoding: "utf8" });
  if (which.status !== 0 || !which.stdout.trim()) return null;
  return which.stdout.trim();
}

/**
 * Proxy a Graphify query via CLI when available.
 */
export function graphifyQuery(query: string, cwd?: string): GraphifyQueryResult {
  const bin = graphifyBin();
  if (!bin) {
    return {
      ok: false,
      query,
      reason: "graphify not found on PATH",
    };
  }
  const started = Date.now();
  const run = spawnSync(bin, ["query", query], {
    encoding: "utf8",
    cwd,
    timeout: 60_000,
    maxBuffer: 2_000_000,
  });
  if (run.error) {
    return { ok: false, query, reason: String(run.error) };
  }
  const output = `${run.stdout ?? ""}${run.stderr ?? ""}`.trim();
  if (run.status !== 0 && !output) {
    return { ok: false, query, reason: `graphify exited ${run.status}` };
  }
  return {
    ok: true,
    method: "cli",
    query,
    output: output.slice(0, 50_000),
    durationMs: Date.now() - started,
  };
}

/**
 * Build or update a Graphify graph for a directory (blocking).
 */
export function graphifyBuild(cwd: string, mode: "build" | "update" = "update"): GraphifyBuildResult {
  const bin = graphifyBin();
  if (!bin) {
    return { ok: false, reason: "graphify not found on PATH" };
  }
  const args = mode === "build" ? ["."] : ["update", "."];
  const command = `${bin} ${args.join(" ")}`;
  const started = Date.now();
  const run = spawnSync(bin, args, {
    encoding: "utf8",
    cwd,
    timeout: 180_000,
    maxBuffer: 4_000_000,
  });
  if (run.error) {
    return { ok: false, reason: String(run.error), command };
  }
  const output = `${run.stdout ?? ""}${run.stderr ?? ""}`.trim();
  if (run.status !== 0) {
    return {
      ok: false,
      reason: output || `graphify exited ${run.status}`,
      command,
    };
  }
  return {
    ok: true,
    method: "cli",
    command,
    output: output.slice(0, 80_000),
    durationMs: Date.now() - started,
  };
}

export type GraphifyBuildAsyncResult =
  | { ok: true; command: string; pid: number }
  | { ok: false; reason: string };

/**
 * Start a Graphify build/update in the background (non-blocking spawn).
 */
export function graphifyBuildAsync(
  cwd: string,
  mode: "build" | "update" = "update",
  onComplete?: (result: GraphifyBuildResult) => void,
): GraphifyBuildAsyncResult {
  const bin = graphifyBin();
  if (!bin) {
    return { ok: false, reason: "graphify not found on PATH" };
  }
  const args = mode === "build" ? ["."] : ["update", "."];
  const command = `${bin} ${args.join(" ")}`;
  const started = Date.now();
  const child = spawn(bin, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (d: Buffer) => {
    stdout += d.toString("utf8");
  });
  child.stderr.on("data", (d: Buffer) => {
    stderr += d.toString("utf8");
  });
  child.on("close", (code) => {
    const output = `${stdout}${stderr}`.trim();
    const result: GraphifyBuildResult =
      code === 0
        ? {
            ok: true,
            method: "cli",
            command,
            output: output.slice(0, 80_000),
            durationMs: Date.now() - started,
          }
        : {
            ok: false,
            reason: output || `graphify exited ${code}`,
            command,
          };
    onComplete?.(result);
  });
  child.on("error", (err) => {
    onComplete?.({ ok: false, reason: String(err), command });
  });
  return { ok: true, command, pid: child.pid ?? 0 };
}
