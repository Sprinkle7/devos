import { randomUUID } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { access } from "node:fs/promises";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { McpServerRegistration, McpToolInfo } from "@devaios/shared-kernel";
import { getDevaiosHome, nowIso } from "@devaios/shared-kernel";
import { assessToolRisk } from "./governance.js";

export type RegisterMcpServerInput = {
  name: string;
  command: string;
  args?: string[];
  enabled?: boolean;
};

export type McpProbeResult = {
  ok: boolean;
  name: string;
  exitCode: number | null;
  timedOut: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
};

export type ListToolsResult = {
  ok: boolean;
  name: string;
  tools: McpToolInfo[];
  error?: string;
  durationMs: number;
};

export type CallToolResult = {
  ok: boolean;
  name: string;
  toolName: string;
  content: unknown;
  isError?: boolean;
  error?: string;
  blocked?: boolean;
  requiresApproval?: boolean;
  governance?: { risk: string; reason?: string };
  durationMs: number;
};

export type CallToolOptions = {
  timeoutMs?: number;
  approveDestructive?: boolean;
  toolDescription?: string;
};

function echoServerPath(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  return join(here, "echo-server.js");
}

/**
 * MCP Host (Milestone 03): registrations, probe, and real stdio listTools sessions.
 */
export class McpHost {
  private readonly storePath: string;

  constructor(home = getDevaiosHome()) {
    this.storePath = join(home, "mcp", "servers.json");
  }

  getStorePath(): string {
    return this.storePath;
  }

  getEchoServerCommand(): { command: string; args: string[] } {
    return { command: process.execPath, args: [echoServerPath()] };
  }

  private async ensure(): Promise<void> {
    await mkdir(dirname(this.storePath), { recursive: true });
    try {
      await readFile(this.storePath, "utf8");
    } catch {
      await writeFile(this.storePath, "[]\n", "utf8");
    }
  }

  private async readAll(): Promise<McpServerRegistration[]> {
    await this.ensure();
    return JSON.parse(await readFile(this.storePath, "utf8")) as McpServerRegistration[];
  }

  private async writeAll(servers: McpServerRegistration[]): Promise<void> {
    await this.ensure();
    await writeFile(this.storePath, JSON.stringify(servers, null, 2) + "\n", "utf8");
  }

  async list(): Promise<McpServerRegistration[]> {
    return this.readAll();
  }

  async get(nameOrId: string): Promise<McpServerRegistration | undefined> {
    const all = await this.readAll();
    return all.find((s) => s.name === nameOrId || s.id === nameOrId);
  }

  async register(input: RegisterMcpServerInput): Promise<McpServerRegistration> {
    const servers = await this.readAll();
    const existing = servers.find((s) => s.name === input.name);
    if (existing) {
      existing.command = input.command;
      existing.args = input.args ?? [];
      existing.enabled = input.enabled ?? true;
      await this.writeAll(servers);
      return existing;
    }
    const row: McpServerRegistration = {
      id: randomUUID(),
      name: input.name,
      command: input.command,
      args: input.args ?? [],
      enabled: input.enabled ?? true,
      createdAt: nowIso(),
    };
    servers.push(row);
    await this.writeAll(servers);
    return row;
  }

  async ensureEchoRegistered(): Promise<McpServerRegistration> {
    const echo = this.getEchoServerCommand();
    return this.register({
      name: "devaios-echo",
      command: echo.command,
      args: echo.args,
      enabled: true,
    });
  }

  async setEnabled(nameOrId: string, enabled: boolean): Promise<McpServerRegistration | null> {
    const servers = await this.readAll();
    const row = servers.find((s) => s.name === nameOrId || s.id === nameOrId);
    if (!row) return null;
    row.enabled = enabled;
    await this.writeAll(servers);
    return row;
  }

  async remove(nameOrId: string): Promise<boolean> {
    const servers = await this.readAll();
    const next = servers.filter((s) => s.name !== nameOrId && s.id !== nameOrId);
    if (next.length === servers.length) return false;
    await this.writeAll(next);
    return true;
  }

  async replaceAll(servers: McpServerRegistration[]): Promise<void> {
    await this.writeAll(servers);
  }

  async probe(nameOrId: string, timeoutMs = 2500): Promise<McpProbeResult> {
    const server = await this.get(nameOrId);
    if (!server) {
      return {
        ok: false,
        name: nameOrId,
        exitCode: null,
        timedOut: false,
        stdout: "",
        stderr: "server_not_found",
        durationMs: 0,
      };
    }
    const started = Date.now();
    return new Promise((resolve) => {
      const child = spawn(server.command, server.args ?? [], {
        stdio: ["ignore", "pipe", "pipe"],
      });
      let stdout = "";
      let stderr = "";
      let settled = false;
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        child.kill("SIGTERM");
        resolve({
          ok: true,
          name: server.name,
          exitCode: null,
          timedOut: true,
          stdout: stdout.slice(0, 2000),
          stderr: stderr.slice(0, 2000),
          durationMs: Date.now() - started,
        });
      }, timeoutMs);

      child.stdout.on("data", (d: Buffer) => {
        stdout += d.toString("utf8");
      });
      child.stderr.on("data", (d: Buffer) => {
        stderr += d.toString("utf8");
      });
      child.on("error", (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve({
          ok: false,
          name: server.name,
          exitCode: null,
          timedOut: false,
          stdout: "",
          stderr: String(err),
          durationMs: Date.now() - started,
        });
      });
      child.on("close", (code) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve({
          ok: code === 0 || code === null,
          name: server.name,
          exitCode: code,
          timedOut: false,
          stdout: stdout.slice(0, 2000),
          stderr: stderr.slice(0, 2000),
          durationMs: Date.now() - started,
        });
      });
    });
  }

  async listTools(nameOrId: string, timeoutMs = 12_000): Promise<ListToolsResult> {
    const server = await this.get(nameOrId);
    if (!server) {
      return { ok: false, name: nameOrId, tools: [], error: "server_not_found", durationMs: 0 };
    }
    if (!server.enabled) {
      return { ok: false, name: server.name, tools: [], error: "server_disabled", durationMs: 0 };
    }
    const started = Date.now();
    const transport = new StdioClientTransport({
      command: server.command,
      args: server.args ?? [],
    });
    const client = new Client({ name: "devaios-mcp-host", version: "0.4.0" });
    const timer = setTimeout(() => {
      void client.close().catch(() => undefined);
    }, timeoutMs);
    try {
      await client.connect(transport);
      const result = await client.listTools();
      const tools: McpToolInfo[] = (result.tools ?? []).map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
      }));
      await client.close();
      clearTimeout(timer);
      return {
        ok: true,
        name: server.name,
        tools,
        durationMs: Date.now() - started,
      };
    } catch (err) {
      clearTimeout(timer);
      try {
        await client.close();
      } catch {
        /* ignore */
      }
      return {
        ok: false,
        name: server.name,
        tools: [],
        error: String(err),
        durationMs: Date.now() - started,
      };
    }
  }

  async callTool(
    nameOrId: string,
    toolName: string,
    args: Record<string, unknown> = {},
    options: CallToolOptions = {},
  ): Promise<CallToolResult> {
    const timeoutMs = options.timeoutMs ?? 20_000;
    const server = await this.get(nameOrId);
    if (!server) {
      return {
        ok: false,
        name: nameOrId,
        toolName,
        content: null,
        error: "server_not_found",
        durationMs: 0,
      };
    }
    if (!server.enabled) {
      return {
        ok: false,
        name: server.name,
        toolName,
        content: null,
        error: "server_disabled",
        durationMs: 0,
      };
    }

    const risk = assessToolRisk(toolName, options.toolDescription);
    if (risk.requiresApproval && !options.approveDestructive) {
      return {
        ok: false,
        name: server.name,
        toolName,
        content: null,
        blocked: true,
        requiresApproval: true,
        governance: { risk: risk.risk, reason: risk.reason },
        error: "governance_blocked",
        durationMs: 0,
      };
    }

    const started = Date.now();
    const transport = new StdioClientTransport({
      command: server.command,
      args: server.args ?? [],
    });
    const client = new Client({ name: "devaios-mcp-host", version: "0.4.0" });
    const timer = setTimeout(() => {
      void client.close().catch(() => undefined);
    }, timeoutMs);
    try {
      await client.connect(transport);
      const result = await client.callTool({ name: toolName, arguments: args });
      await client.close();
      clearTimeout(timer);
      return {
        ok: !result.isError,
        name: server.name,
        toolName,
        content: result.content,
        isError: Boolean(result.isError),
        durationMs: Date.now() - started,
      };
    } catch (err) {
      clearTimeout(timer);
      try {
        await client.close();
      } catch {
        /* ignore */
      }
      return {
        ok: false,
        name: server.name,
        toolName,
        content: null,
        error: String(err),
        durationMs: Date.now() - started,
      };
    }
  }
}

export type GraphifyRegisterResult =
  | { ok: true; server: McpServerRegistration; method: string }
  | { ok: false; reason: string };

/**
 * Best-effort Graphify MCP registration. Does not require Graphify to be installed
 * for the hub to boot; reports not-found when unavailable.
 */
export async function registerGraphifyHelper(host: McpHost): Promise<GraphifyRegisterResult> {
  const which = spawnSync("which", ["graphify"], { encoding: "utf8" });
  if (which.status === 0 && which.stdout.trim()) {
    const command = which.stdout.trim();
    const server = await host.register({
      name: "graphify",
      command,
      args: ["mcp"],
      enabled: true,
    });
    return { ok: true, server, method: "which-graphify" };
  }

  // Optional: local wrapper script path under home
  const local = join(getDevaiosHome(), "bin", "graphify");
  try {
    await access(local);
    const server = await host.register({
      name: "graphify",
      command: local,
      args: ["mcp"],
      enabled: true,
    });
    return { ok: true, server, method: "home-bin" };
  } catch {
    /* continue */
  }

  return {
    ok: false,
    reason:
      "graphify not found on PATH or ~/.devaios/bin/graphify. Install Graphify, then retry. Hub does not require it to boot.",
  };
}

export { graphifyQuery, graphifyBuild, graphifyBuildAsync } from "./graphify.js";
export type { GraphifyQueryResult, GraphifyBuildResult, GraphifyBuildAsyncResult } from "./graphify.js";
export { assessToolRisk } from "./governance.js";
export type { GovernanceAssessment, ToolRisk } from "./governance.js";
