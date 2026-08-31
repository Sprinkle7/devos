import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const API_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = path.resolve(API_DIR, "..", "..");

let lastMcpActivityAt: string | null = null;
let lastMcpTool: string | null = null;

export function recordMcpActivity(tool?: string) {
  lastMcpActivityAt = new Date().toISOString();
  if (tool) lastMcpTool = tool;
}

export function getMcpActivity() {
  return { lastSeenAt: lastMcpActivityAt, lastTool: lastMcpTool };
}

export function isMcpConnectedRecently(withinMs = 120_000): boolean {
  if (!lastMcpActivityAt) return false;
  return Date.now() - new Date(lastMcpActivityAt).getTime() < withinMs;
}

export function resolveRepoRoot(): string {
  return process.env.DEVAIOS_REPO_ROOT ?? REPO_ROOT;
}

export function resolveMcpLauncherScript(): string {
  if (process.env.DEVAIOS_MCP_LAUNCHER) return process.env.DEVAIOS_MCP_LAUNCHER;
  return path.join(resolveRepoRoot(), "scripts", "devaios-mcp.mjs");
}

export function resolveMcpServerEntry(): string {
  if (process.env.DEVAIOS_MCP_SERVER_PATH) return process.env.DEVAIOS_MCP_SERVER_PATH;
  return path.join(resolveRepoRoot(), "packages", "mcp-server", "dist", "index.js");
}

export async function mcpBridgePaths(): Promise<{
  repoRoot: string;
  launcher: string;
  entry: string;
  launcherExists: boolean;
  entryExists: boolean;
}> {
  const launcher = resolveMcpLauncherScript();
  const entry = resolveMcpServerEntry();
  const launcherExists = await access(launcher).then(() => true).catch(() => false);
  const entryExists = await access(entry).then(() => true).catch(() => false);
  return {
    repoRoot: resolveRepoRoot(),
    launcher,
    entry,
    launcherExists,
    entryExists,
  };
}

export function buildCursorMcpConfig(input: {
  apiUrl: string;
  workspace: string;
  launcherPath: string;
}) {
  return {
    mcpServers: {
      devaios: {
        command: "node",
        args: [input.launcherPath],
        env: {
          DEVAIOS_API_URL: input.apiUrl,
          DEVAIOS_WORKSPACE: input.workspace,
        },
      },
    },
  };
}
