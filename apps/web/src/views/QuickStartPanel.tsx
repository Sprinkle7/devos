type QuickStartPanelProps = {
  chatReady: boolean;
  chatTestOk: boolean;
  chatHint?: string;
  mcpBridgeBuilt: boolean;
  mcpConnected: boolean;
  graphAvailable: boolean;
  onQuickChat: () => void;
  onGoConnections: () => void;
  onGoChat: () => void;
  onCopyMcp?: () => void;
};

export function QuickStartPanel({
  chatReady,
  chatTestOk,
  chatHint,
  mcpBridgeBuilt,
  mcpConnected,
  graphAvailable,
  onQuickChat,
  onGoConnections,
  onGoChat,
  onCopyMcp,
}: QuickStartPanelProps) {
  const steps = [
    {
      id: "chat-model",
      label: chatReady ? "Chat model ready" : "Enable chat model (Ollama or API key)",
      ok: chatReady,
      action: onGoConnections,
      actionLabel: "Connect",
      showAction: !chatReady,
      detail: chatHint,
    },
    {
      id: "chat-test",
      label: "Run hub chat quick test",
      ok: chatTestOk,
      action: onQuickChat,
      actionLabel: "Quick test",
      showAction: chatReady && !chatTestOk,
    },
    {
      id: "mcp",
      label: "Connect Cursor MCP (optional for IDE)",
      ok: mcpConnected,
      action: mcpBridgeBuilt && onCopyMcp ? onCopyMcp : onGoConnections,
      actionLabel: mcpBridgeBuilt ? "Copy config" : "Setup",
      showAction: !mcpConnected,
      optional: true,
    },
  ];

  return (
    <section className="panel quick-start card-glow">
      <h2>Quick start</h2>
      <p className="panel-sub">Three steps to verify DEVAIOS is working end-to-end.</p>
      <ol className="quick-start-steps">
        {steps.map((s, i) => (
          <li key={s.id} className={s.ok ? "done" : ""}>
            <span className="step-num">{i + 1}</span>
            <div className="step-body">
              <strong>{s.label}</strong>
              {"optional" in s && s.optional ? <span className="muted"> (optional)</span> : null}
              {s.ok ? <span className="muted">Done</span> : null}
              {"detail" in s && s.detail && !s.ok ? (
                <p className="muted tiny">{s.detail}</p>
              ) : null}
            </div>
            {!s.showAction ? null : (
              <button type="button" className="ghost tiny-btn" onClick={s.action}>
                {s.actionLabel}
              </button>
            )}
          </li>
        ))}
      </ol>
      <div className="row" style={{ marginTop: "0.75rem" }}>
        <button type="button" className="primary" onClick={onGoChat}>
          Open chat
        </button>
        {graphAvailable ? (
          <a className="ghost link-btn" href="/api/graphify/graph" target="_blank" rel="noreferrer">
            Open graph
          </a>
        ) : null}
      </div>
    </section>
  );
}
