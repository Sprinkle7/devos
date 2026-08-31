import { useState } from "react";

const API = "/api";

type McpToolsPanelProps = {
  workspaceSlug: string;
};

type ToolId =
  | "devaios_workspace_context"
  | "devaios_memory_search"
  | "devaios_graphify_query"
  | "devaios_cognitive_snapshot"
  | "devaios_agent_ask";

const TOOLS: { id: ToolId; label: string; blurb: string }[] = [
  { id: "devaios_workspace_context", label: "Workspace context", blurb: "Projects + workspace metadata" },
  { id: "devaios_memory_search", label: "Memory search", blurb: "Brain memories for this workspace" },
  { id: "devaios_graphify_query", label: "Graphify query", blurb: "Knowledge graph lookup" },
  { id: "devaios_cognitive_snapshot", label: "Cognitive snapshot", blurb: "Active cognitive domains" },
  { id: "devaios_agent_ask", label: "Agent ask", blurb: "Short hub agent ping (no stream)" },
];

async function runTool(id: ToolId, workspaceSlug: string): Promise<unknown> {
  switch (id) {
    case "devaios_workspace_context": {
      const [ws, proj] = await Promise.all([
        fetch(`${API}/workspaces`).then((r) => r.json()),
        fetch(`${API}/workspaces/${encodeURIComponent(workspaceSlug)}/projects`).then((r) => r.json()),
      ]);
      return { tool: id, workspaceSlug, workspaces: ws, projects: proj };
    }
    case "devaios_memory_search": {
      const res = await fetch(`${API}/workspaces/${encodeURIComponent(workspaceSlug)}/memories`);
      return { tool: id, ...(await res.json()) };
    }
    case "devaios_graphify_query": {
      const res = await fetch(`${API}/graphify/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "How does the hub agent relate to MCP?" }),
      });
      return { tool: id, ...(await res.json()) };
    }
    case "devaios_cognitive_snapshot": {
      const q = new URLSearchParams({
        message: "hub MCP tools quick test",
        workspaceSlug,
      });
      const res = await fetch(`${API}/cognitive/snapshot?${q}`);
      return { tool: id, ...(await res.json()) };
    }
    case "devaios_agent_ask": {
      const res = await fetch(`${API}/agent/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceSlug,
          message: "Reply in one short sentence confirming DEVAIOS hub agent is reachable.",
          useTools: false,
          maxToolRounds: 0,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      return { tool: id, ...(await res.json()) };
    }
  }
}

export function McpToolsPanel({ workspaceSlug }: McpToolsPanelProps) {
  const [loading, setLoading] = useState<ToolId | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onRun(id: ToolId) {
    setLoading(id);
    setError(null);
    try {
      const result = await runTool(id, workspaceSlug);
      setOutput(JSON.stringify(result, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setOutput(null);
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="panel conn-card mcp-tools-panel">
      <h2>🧪 Test DEVAIOS MCP tools</h2>
      <p className="panel-sub">
        Same endpoints Cursor calls via <code>@devaios/mcp-server</code> — verify before wiring your IDE.
      </p>
      <ul className="mcp-tool-grid">
        {TOOLS.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              className="mcp-tool-btn"
              disabled={loading !== null}
              onClick={() => void onRun(t.id)}
            >
              <strong>{t.label}</strong>
              <span>{loading === t.id ? "Running…" : t.blurb}</span>
            </button>
          </li>
        ))}
      </ul>
      {error ? <p className="error">{error}</p> : null}
      {output ? <pre className="code-block mcp-tool-out">{output}</pre> : null}
    </section>
  );
}
