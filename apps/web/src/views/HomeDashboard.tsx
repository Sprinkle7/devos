import type { HubStatus, HubTab } from "../hub/types";
import { MiniBarChart, Sparkline } from "./MiniBarChart";

type HomeDashboardProps = {
  status: HubStatus | null;
  onGo: (tab: HubTab) => void;
  onRefresh: () => void;
  graphAvailable?: boolean;
  graphNodes?: number;
};

export function HomeDashboard({ status, onGo, onRefresh, graphAvailable, graphNodes }: HomeDashboardProps) {
  const probes = status?.providers.probes ?? [];
  const latencySpark = probes.filter((p) => p.latencyMs).map((p) => 1 / Math.max(p.latencyMs ?? 1, 1));
  const pendingApprovals = status?.governance?.pendingApprovals ?? 0;

  return (
    <div className="home-layout">
      {status?.mcp.connectedRecently && status.chat && !status.chat.ready ? (
        <section className="panel offline-banner card-glow">
          <strong>Cursor MCP is live — hub chat still needs an LLM</strong>
          <p>{status.chat.hint ?? "Open Connect to enable Ollama or add an API key."}</p>
          <button type="button" className="primary" onClick={() => onGo("connections")}>
            Fix on Connect tab
          </button>
        </section>
      ) : null}
      {pendingApprovals > 0 ? (
        <section className="panel alert-banner card-glow">
          <strong>{pendingApprovals} pending MCP approval{pendingApprovals === 1 ? "" : "s"}</strong>
          <p className="panel-sub">
            Destructive tools are waiting in the Chat sidebar for workspace <strong>{status?.workspace}</strong>.
          </p>
          <button type="button" className="primary" onClick={() => onGo("chat")}>
            Review approvals
          </button>
        </section>
      ) : null}
      <section className="hero panel card-glow">
        <p className="hero-kicker">Developer AI operating system</p>
        <h2 className="hero-title">One hub for Ollama, Claude, Cursor &amp; project memory</h2>
        <p className="hero-body">
          DEVAIOS orchestrates your local models and IDE agents — it does not replace them. Chat here, connect Cursor via
          MCP, and let 205 cognitive modules enrich context in the background.
        </p>
        <div className="hero-actions">
          <button type="button" className="primary" onClick={() => onGo("chat")}>
            Open chat
          </button>
          <button type="button" className="ghost" onClick={() => onGo("connections")}>
            Connect Cursor
          </button>
          {graphAvailable ? (
            <a className="ghost link-btn" href="/api/graphify/graph" target="_blank" rel="noreferrer">
              Open graph{graphNodes ? ` (${graphNodes.toLocaleString()} nodes)` : ""}
            </a>
          ) : null}
          <button type="button" className="ghost" onClick={onRefresh}>
            Refresh status
          </button>
        </div>
      </section>

      <div className="stat-grid">
        <article className={`stat-card ${status?.api.ok ? "ok" : "fail"}`}>
          <span className="stat-icon">⚡</span>
          <h3>API</h3>
          <p>{status?.api.ok ? `v${status.api.version}` : "Unreachable"}</p>
        </article>
        <article className={`stat-card ${status?.chat?.ready ? "ok" : "fail"}`}>
          <span className="stat-icon">💬</span>
          <h3>Hub chat</h3>
          <p>{status?.chat?.ready ? "Model ready" : "No LLM enabled"}</p>
        </article>
        <article className={`stat-card ${status?.providers.ollama.ok ? "ok" : "warn"}`}>
          <span className="stat-icon">🦙</span>
          <h3>Ollama</h3>
          <p>{status?.providers.ollama.ok ? `${status.providers.ollama.latencyMs ?? "?"}ms` : "Start Ollama"}</p>
        </article>
        <article className={`stat-card ${status?.mcp.connectedRecently ? "ok" : status?.mcp.bridgeBuilt ? "warn" : "fail"}`}>
          <span className="stat-icon">🔗</span>
          <h3>Cursor MCP</h3>
          <p>
            {status?.mcp.connectedRecently
              ? "Connected now"
              : status?.mcp.bridgeBuilt
                ? "Ready — open Cursor"
                : "Build mcp-server"}
          </p>
          {status?.mcp.lastSeenAt ? (
            <p className="muted tiny">Last seen {new Date(status.mcp.lastSeenAt).toLocaleTimeString()}</p>
          ) : null}
        </article>
        <article className={`stat-card ${status?.cognitive.ok ? "ok" : "warn"}`}>
          <span className="stat-icon">🧠</span>
          <h3>Cognitive</h3>
          <p>
            {status?.cognitive.modulesActive ?? 0} modules · {status?.cognitive.totalSystems ?? 205} built
          </p>
        </article>
      </div>

      {status?.workspaceStats ? (
        <section className="panel chart-panel workspace-stats">
          <h3>Workspace · {status.workspace}</h3>
          <div className="stat-grid compact">
            <article className="stat-card ok">
              <h3>{status.workspaceStats.conversations}</h3>
              <p>Conversations</p>
            </article>
            <article className="stat-card ok">
              <h3>{status.workspaceStats.memories}</h3>
              <p>Memories</p>
            </article>
            <article className="stat-card ok">
              <h3>{status.workspaceStats.projects}</h3>
              <p>Projects</p>
            </article>
          </div>
          <div className="hero-actions" style={{ marginTop: "0.75rem" }}>
            <button type="button" className="ghost" onClick={() => onGo("chat")}>
              Open chat
            </button>
            <button type="button" className="ghost" onClick={() => onGo("workspace")}>
              Manage workspace
            </button>
          </div>
        </section>
      ) : null}

      {probes.length ? (
        <section className="panel chart-panel">
          <h3>Provider latency</h3>
          <div className="chart-split">
            <MiniBarChart
              items={probes.map((p) => ({
                label: p.kind,
                value: p.ok ? 1 - Math.min((p.latencyMs ?? 2000) / 2000, 1) : 0,
                ok: p.ok,
              }))}
            />
            {latencySpark.length > 1 ? (
              <div className="spark-wrap">
                <Sparkline values={latencySpark} label="Provider responsiveness" />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {status?.cognitive.domains.length ? (
        <section className="panel chart-panel">
          <h3>Active cognitive domains</h3>
          <div className="chip-row">
            {status.cognitive.domains.map((d) => (
              <span key={d} className="chip accent">
                {d}
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
