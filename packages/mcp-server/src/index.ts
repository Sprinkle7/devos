#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = (process.env.DEVAIOS_API_URL ?? "http://127.0.0.1:8787").replace(/\/$/, "");
const DEFAULT_WORKSPACE = process.env.DEVAIOS_WORKSPACE ?? "demo";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "X-Devaios-Source": "mcp-server",
      ...(init?.headers ?? {}),
    },
    ...init,
  });
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json() as Promise<T>;
}

function textResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: typeof data === "string" ? data : JSON.stringify(data, null, 2) }],
  };
}

const server = new McpServer({
  name: "devaios",
  version: "0.1.0",
});

server.tool(
  "devaios_workspace_context",
  "Workspace, projects, and repo context from DEVAIOS hub",
  {
    workspaceSlug: z.string().optional().describe("Workspace slug (default from DEVAIOS_WORKSPACE env)"),
  },
  async ({ workspaceSlug }) => {
    const slug = workspaceSlug ?? DEFAULT_WORKSPACE;
    const [workspaces, projects] = await Promise.all([
      api<{ workspaces: Array<{ slug: string; name: string; id: string }> }>("/workspaces"),
      api<{ projects: unknown[] }>(`/workspaces/${encodeURIComponent(slug)}/projects`).catch(() => ({
        projects: [],
      })),
    ]);
    const ws = workspaces.workspaces.find((w) => w.slug === slug);
    return textResult({ workspace: ws ?? { slug }, projects: projects.projects });
  },
);

server.tool(
  "devaios_memory_search",
  "Search brain memories for a DEVAIOS workspace",
  {
    workspaceSlug: z.string().optional(),
    query: z.string().optional().describe("Optional substring filter on title/content"),
  },
  async ({ workspaceSlug, query }) => {
    const slug = workspaceSlug ?? DEFAULT_WORKSPACE;
    const data = await api<{ memories: Array<{ kind: string; title: string; content: string }> }>(
      `/workspaces/${encodeURIComponent(slug)}/memories`,
    );
    let memories = data.memories;
    if (query?.trim()) {
      const q = query.toLowerCase();
      memories = memories.filter(
        (m) => m.title.toLowerCase().includes(q) || m.content.toLowerCase().includes(q) || m.kind.toLowerCase().includes(q),
      );
    }
    return textResult({ workspaceSlug: slug, count: memories.length, memories: memories.slice(0, 20) });
  },
);

server.tool(
  "devaios_graphify_query",
  "Query the DEVAIOS graphify knowledge graph",
  { query: z.string().min(1), cwd: z.string().optional() },
  async ({ query, cwd }) => {
    const result = await api<unknown>("/graphify/query", {
      method: "POST",
      body: JSON.stringify({ query, cwd: cwd ?? process.cwd() }),
    });
    return textResult(result);
  },
);

server.tool(
  "devaios_cognitive_snapshot",
  "Background cognitive domain snapshot from DEVAIOS cognitive runtime",
  {
    message: z.string().min(1),
    workspaceSlug: z.string().optional(),
  },
  async ({ message, workspaceSlug }) => {
    const slug = workspaceSlug ?? DEFAULT_WORKSPACE;
    const result = await api<unknown>(
      `/cognitive/snapshot?${new URLSearchParams({ message, workspaceSlug: slug }).toString()}`,
    );
    return textResult(result);
  },
);

server.tool(
  "devaios_agent_ask",
  "Delegate a question to the DEVAIOS hub agent",
  {
    message: z.string().min(1),
    workspaceSlug: z.string().optional(),
    useTools: z.boolean().optional(),
  },
  async ({ message, workspaceSlug, useTools }) => {
    const slug = workspaceSlug ?? DEFAULT_WORKSPACE;
    const result = await api<unknown>("/agent/chat", {
      method: "POST",
      body: JSON.stringify({ workspaceSlug: slug, message, useTools: useTools ?? true, maxToolRounds: 2 }),
    });
    return textResult(result);
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
