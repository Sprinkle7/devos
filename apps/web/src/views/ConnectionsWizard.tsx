import type { HubStatus } from "../hub/types";
import { McpToolsPanel } from "./McpToolsPanel";

type OllamaModel = { name: string; size?: number };

type ConnectionsWizardProps = {
  hubStatus: HubStatus | null;
  ollamaOk: boolean;
  ollamaEnabled: boolean;
  ollamaModels: OllamaModel[];
  ollamaError?: string;
  onProbeOllama: () => void;
  onEnableOllama: () => void;
  anthropicKeySet: boolean;
  anthropicEnabled: boolean;
  onSaveAnthropicKey: (key: string) => void;
  onEnableAnthropic: () => void;
  onProbeProviders: () => void;
  probeOut: string | null;
  bridgeConfig: string | null;
  onLoadBridge: () => void;
  onCopyBridge: () => void;
  onRefreshStatus: () => void;
  onTestMcpBridge: () => void;
  mcpTestOut: string | null;
  copyOut: string | null;
  workspaceSlug: string;
};

function StatusLight({ ok, label, detail }: { ok: boolean; label: string; detail?: string }) {
  return (
    <div className={`conn-status ${ok ? "ok" : "fail"}`}>
      <span className="conn-dot" />
      <div>
        <strong>{label}</strong>
        {detail ? <span className="muted"> — {detail}</span> : null}
      </div>
    </div>
  );
}

export function ConnectionsWizard({
  hubStatus,
  ollamaOk,
  ollamaEnabled,
  ollamaModels,
  ollamaError,
  onProbeOllama,
  onEnableOllama,
  anthropicKeySet,
  anthropicEnabled,
  onSaveAnthropicKey,
  onEnableAnthropic,
  onProbeProviders,
  probeOut,
  bridgeConfig,
  onLoadBridge,
  onCopyBridge,
  onRefreshStatus,
  onTestMcpBridge,
  mcpTestOut,
  copyOut,
  workspaceSlug,
}: ConnectionsWizardProps) {
  const mcp = hubStatus?.mcp;
  const chatReady = hubStatus?.chat?.ready ?? false;

  return (
    <div className="connections-layout">
      {mcp?.connectedRecently && !chatReady ? (
        <div className="info-banner subscription-banner chat-mcp-banner">
          <strong>Cursor MCP is connected — hub chat still needs an LLM.</strong>
          <br />
          MCP gives your IDE agent DEVAIOS memory and tools. Workspace chat below requires Ollama running locally or an
          API key (Anthropic/OpenAI) enabled on this page.
        </div>
      ) : null}

      <section className="panel conn-card card-glow">
        <h2>🦙 Ollama (local, free)</h2>
        <p className="panel-sub">Default chat provider. Runs on your machine — no API credits.</p>
        <StatusLight
          ok={ollamaOk && ollamaEnabled}
          label={ollamaOk ? (ollamaEnabled ? "Online & enabled" : "Online — enable below") : "Offline"}
          detail={ollamaModels[0]?.name ?? "127.0.0.1:11434"}
        />
        {ollamaError ? <p className="error">{ollamaError}</p> : null}
        <div className="row">
          <button type="button" className="primary" onClick={onProbeOllama}>
            Probe models
          </button>
          {ollamaOk && !ollamaEnabled ? (
            <button type="button" onClick={onEnableOllama}>
              Enable Ollama provider
            </button>
          ) : null}
        </div>
        {ollamaModels.length ? (
          <ul className="model-pills">
            {ollamaModels.slice(0, 6).map((m) => (
              <li key={m.name}>{m.name}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">
            Install Ollama from <a href="https://ollama.com">ollama.com</a>, run <code>ollama serve</code>, then{" "}
            <code>ollama pull llama3.2</code> and probe again.
          </p>
        )}
      </section>

      <section className="panel conn-card">
        <h2>Claude Pro / Max subscription</h2>
        <div className="info-banner subscription-banner">
          <strong>Subscription ≠ API key.</strong> Your Claude Pro/Max plan does <em>not</em> apply to the Anthropic
          API — those are separate pay-as-you-go credits.
          <br />
          <br />
          To use your <strong>subscription</strong> with DEVAIOS: connect <strong>Claude Desktop</strong> or{" "}
          <strong>Cursor</strong> via the MCP bridge below. The IDE app uses your subscription; DEVAIOS supplies
          workspace memory and tools through MCP.
        </div>
      </section>

      <section className="panel conn-card">
        <h2>🔑 Claude API (optional)</h2>
        <p className="panel-sub">For hub chat only — billed separately from Pro subscription.</p>
        <div className="wizard-track">
          <div className={`wizard-step ${anthropicKeySet ? "done" : ""}`}>1. API key</div>
          <div className={`wizard-step ${anthropicEnabled ? "done" : ""}`}>2. Enable</div>
          <div className={`wizard-step ${probeOut ? "done" : ""}`}>3. Probe</div>
        </div>
        <form
          className="form-inline"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const key = String(fd.get("anthropicKey") ?? "").trim();
            if (key) onSaveAnthropicKey(key);
          }}
        >
          <input name="anthropicKey" type="password" placeholder="ANTHROPIC_API_KEY" autoComplete="off" />
          <button className="primary" type="submit">
            Save
          </button>
        </form>
        <div className="row">
          <button type="button" onClick={onEnableAnthropic} disabled={!anthropicKeySet}>
            Enable provider
          </button>
          <button type="button" onClick={onProbeProviders}>
            Test failover
          </button>
        </div>
        {probeOut ? <p className="muted success-text">{probeOut}</p> : null}
      </section>

      <section className="panel conn-card card-glow mcp-card">
        <h2>🔗 Cursor / Claude Desktop MCP</h2>
        <p className="panel-sub">Lets your IDE agent read DEVAIOS memories, graphify, and cognitive context.</p>

        <div className={`mcp-live-banner ${mcp?.connectedRecently ? "live" : mcp?.bridgeBuilt ? "ready" : "off"}`}>
          {mcp?.connectedRecently ? (
            <>
              <strong>● Connected</strong>
              <span className="muted">
                Cursor MCP active{mcp.lastTool ? ` · last: ${mcp.lastTool}` : ""}
                {mcp.lastSeenAt ? ` · ${new Date(mcp.lastSeenAt).toLocaleTimeString()}` : ""}
              </span>
            </>
          ) : mcp?.bridgeBuilt ? (
            <>
              <strong>◐ Waiting for Cursor</strong>
              <span className="muted">Config ready — enable devaios in Cursor Settings → MCP, then use a tool</span>
            </>
          ) : (
            <>
              <strong>○ Not built</strong>
              <span className="muted">Run pnpm --filter @devaios/mcp-server build</span>
            </>
          )}
        </div>

        <div className="row">
          <button type="button" className="primary" onClick={onLoadBridge}>
            Generate config
          </button>
          <button type="button" onClick={onCopyBridge} disabled={!bridgeConfig}>
            Copy to clipboard
          </button>
          <button type="button" className="ghost" onClick={onRefreshStatus}>
            Refresh status
          </button>
          <button type="button" className="ghost" onClick={onTestMcpBridge}>
            Test from hub
          </button>
        </div>
        {mcpTestOut ? <p className="muted success-text">{mcpTestOut}</p> : null}
        {copyOut ? <p className="muted success-text">{copyOut}</p> : null}
        {bridgeConfig ? (
          <pre className="code-block">{bridgeConfig}</pre>
        ) : (
          <p className="muted">Paste into <code>.cursor/mcp.json</code> or Cursor Settings → MCP.</p>
        )}
      </section>

      <McpToolsPanel workspaceSlug={workspaceSlug} />
    </div>
  );
}
