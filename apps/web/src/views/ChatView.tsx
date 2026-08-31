import type { ChatResult, ChatToolEvent, CognitiveSnapshot, HubStatus } from "../hub/types";
import { ApprovalsInbox } from "./ApprovalsInbox";
import { CognitiveSnapshotWidget } from "./CognitiveSnapshotWidget";

type ChatMessage = { role: string; content: string };

export type ConversationRow = {
  id: string;
  title: string;
  updatedAt?: string;
  matchSource?: string;
};

type ApprovalRow = {
  id: string;
  server: string;
  tool: string;
  reason?: string | null;
};

type ChatViewProps = {
  workspaceSlug: string;
  message: string;
  onMessageChange: (v: string) => void;
  onSend: () => void;
  onQuickTest: () => void;
  loading: boolean;
  useTools: boolean;
  onUseToolsChange: (v: boolean) => void;
  result: ChatResult | null;
  error: string | null;
  messages: ChatMessage[];
  cognitive: CognitiveSnapshot | null;
  cognitiveLoading: boolean;
  onRefreshCognitive: () => void;
  providerLabel?: string;
  hubStatus: HubStatus | null;
  chatModel: string;
  onChatModelChange: (model: string) => void;
  ollamaModels: Array<{ name: string }>;
  conversations: ConversationRow[];
  selectedConversationId: string | null;
  convSearch: string;
  onConvSearchChange: (v: string) => void;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation?: (id: string) => void;
  streamText?: string;
  toolEvents?: ChatToolEvent[];
  approvals: ApprovalRow[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRefreshApprovals: () => void;
};

export function ChatView({
  workspaceSlug,
  message,
  onMessageChange,
  onSend,
  onQuickTest,
  loading,
  useTools,
  onUseToolsChange,
  result,
  error,
  messages,
  cognitive,
  cognitiveLoading,
  onRefreshCognitive,
  providerLabel,
  hubStatus,
  chatModel,
  onChatModelChange,
  ollamaModels,
  conversations,
  selectedConversationId,
  convSearch,
  onConvSearchChange,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  streamText,
  toolEvents = [],
  approvals,
  onApprove,
  onReject,
  onRefreshApprovals,
}: ChatViewProps) {
  return (
    <div className="chat-layout">
      <aside className="panel chat-history card-glow">
        <header className="chat-history-header">
          <h3>History</h3>
          <button type="button" className="ghost tiny-btn" onClick={onNewConversation}>
            New
          </button>
        </header>
        <input
          className="conv-search"
          value={convSearch}
          onChange={(e) => onConvSearchChange(e.target.value)}
          placeholder="Search conversations…"
        />
        <ul className="conv-list">
          {conversations.length === 0 ? (
            <li className="muted conv-empty">No conversations yet</li>
          ) : null}
          {conversations.map((c) => (
            <li key={c.id}>
              <div className={`conv-row ${selectedConversationId === c.id ? "active" : ""}`}>
                <button
                  type="button"
                  className="conv-pick"
                  onClick={() => onSelectConversation(c.id)}
                >
                  <strong>{c.title || "Untitled"}</strong>
                  <span>
                    {c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : c.id.slice(0, 8)}
                    {c.matchSource ? ` · ${c.matchSource}` : ""}
                  </span>
                </button>
                {onDeleteConversation ? (
                  <button
                    type="button"
                    className="ghost tiny-btn conv-delete"
                    title="Delete conversation"
                    onClick={() => onDeleteConversation(c.id)}
                  >
                    ×
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <section className="panel chat-main card-glow">
        <header className="panel-header">
          <div>
            <h2>Workspace chat</h2>
            <p className="panel-sub">
              Ask anything about <strong>{workspaceSlug}</strong>. Failover picks the first healthy provider.
            </p>
          </div>
          {providerLabel ? <span className="provider-badge">{providerLabel}</span> : null}
        </header>

        {hubStatus && hubStatus.chat && !hubStatus.chat.ready ? (
          <div className="offline-banner">
            <strong>Chat model not ready</strong>
            <p>{hubStatus.chat.hint ?? "Enable a provider on the Connect tab."}</p>
            <p className="muted">
              MCP {hubStatus.mcp.connectedRecently ? "is connected" : "is idle"} — that powers IDE tools, not hub chat.
            </p>
          </div>
        ) : null}

        {hubStatus ? (
          <div className="provider-strip">
            <span className={hubStatus.providers.ollama.ok ? "prov ok" : "prov fail"}>
              Ollama {hubStatus.providers.ollama.ok ? "online" : "offline"}
            </span>
            <span
              className={
                hubStatus.providers.anthropic.ok || hubStatus.providers.anthropic.keySet ? "prov ok" : "prov warn"
              }
            >
              Claude API {hubStatus.providers.anthropic.keySet ? "key set" : "no key"}
            </span>
            <span className={hubStatus.mcp.connectedRecently ? "prov ok" : "prov warn"}>
              MCP {hubStatus.mcp.connectedRecently ? "live" : "idle"}
            </span>
          </div>
        ) : null}

        <div className="chat-thread" aria-live="polite">
          {messages.length === 0 && !result ? (
            <div className="chat-empty">
              <p>No messages yet — try a quick test below.</p>
            </div>
          ) : null}
          {messages.map((m, i) => (
            <article key={i} className={`chat-bubble ${m.role}`}>
              <span className="chat-role">{m.role}</span>
              <p>{m.content}</p>
            </article>
          ))}
          {result && !streamText && !messages.some((m) => m.role === "assistant" && m.content === result.reply) ? (
            <article className={`chat-bubble assistant fresh${result.offline ? " offline-reply" : ""}`}>
              <span className="chat-role">assistant · {result.offline ? "offline" : result.provider}</span>
              <p>{result.reply}</p>
            </article>
          ) : null}
          {streamText ? (
            <article className="chat-bubble assistant fresh streaming">
              <span className="chat-role">assistant · streaming</span>
              <p>{streamText}</p>
            </article>
          ) : null}
          {loading && !streamText ? <div className="chat-loading">Thinking…</div> : null}
        </div>

        {toolEvents.length ? (
          <div className="tool-trace">
            {toolEvents.map((ev) => (
              <span
                key={ev.id}
                className={`tool-chip ${ev.kind}${ev.ok === false ? " fail" : ev.kind === "result" && ev.ok ? " ok" : ""}`}
              >
                {ev.kind === "call" ? "→" : ev.ok ? "✓" : "✗"} {ev.server}/{ev.tool}
              </span>
            ))}
          </div>
        ) : null}

        {error ? <p className="error banner-error">{error}</p> : null}

        <form
          className="chat-composer"
          onSubmit={(e) => {
            e.preventDefault();
            onSend();
          }}
        >
          <textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                if (!loading && message.trim()) onSend();
              }
            }}
            placeholder="Type a message… (⌘/Ctrl+Enter to send)"
            rows={3}
            disabled={loading}
          />
          <div className="composer-actions">
            <label className="toggle-chip">
              <input type="checkbox" checked={useTools} onChange={(e) => onUseToolsChange(e.target.checked)} />
              MCP tools
            </label>
            {ollamaModels.length ? (
              <label className="model-pick">
                Model{" "}
                <select value={chatModel} onChange={(e) => onChatModelChange(e.target.value)} disabled={loading}>
                  <option value="">Auto (failover)</option>
                  {ollamaModels.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <div className="composer-buttons">
              <button type="button" className="ghost" onClick={onQuickTest} disabled={loading}>
                Quick test
              </button>
              <button type="submit" className="primary send-btn" disabled={loading || !message.trim()}>
                {loading ? "Sending…" : "Send"}
              </button>
            </div>
          </div>
        </form>
      </section>

      <aside className="chat-side">
        <ApprovalsInbox
          workspaceSlug={workspaceSlug}
          approvals={approvals}
          onApprove={onApprove}
          onReject={onReject}
          onRefresh={onRefreshApprovals}
        />

        <CognitiveSnapshotWidget
          snapshot={cognitive}
          loading={cognitiveLoading}
          onRefresh={onRefreshCognitive}
        />

        <section className="panel side-card hint-card">
          <h3>Human-in-the-loop</h3>
          <ol className="hint-steps">
            <li>Destructive MCP tools appear in <strong>Pending approvals</strong> until you approve.</li>
            <li>Re-send your message after approving so the agent can continue.</li>
            <li>Pick an Ollama model or leave <strong>Auto</strong> for failover.</li>
          </ol>
        </section>
      </aside>
    </div>
  );
}
