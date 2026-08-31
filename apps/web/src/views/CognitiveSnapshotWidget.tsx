import type { CognitiveSnapshot } from "../hub/types";

type CognitiveSnapshotWidgetProps = {
  snapshot: CognitiveSnapshot | null;
  loading?: boolean;
  onRefresh?: () => void;
};

export function CognitiveSnapshotWidget({ snapshot, loading, onRefresh }: CognitiveSnapshotWidgetProps) {
  return (
    <section className="panel cognitive-snapshot">
      <div className="row" style={{ justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <h2 style={{ margin: 0 }}>Cognitive snapshot</h2>
        {onRefresh ? (
          <button type="button" onClick={onRefresh} disabled={loading}>
            {loading ? "Analyzing…" : "Refresh"}
          </button>
        ) : null}
      </div>
      {!snapshot && !loading ? (
        <p className="muted">Send a chat message or refresh to see active cognitive domains.</p>
      ) : null}
      {loading ? <p className="muted">Running domain router…</p> : null}
      {snapshot ? (
        <>
          <p className="muted">{snapshot.summary}</p>
          <div className="chip-row">
            {snapshot.domains.map((d) => (
              <span key={d} className="chip">
                {d}
              </span>
            ))}
          </div>
          <ul className="metric-bars">
            {snapshot.topMetrics.slice(0, 5).map((m) => (
              <li key={`${m.domain}-${m.milestone}-${m.name}`}>
                <span className="metric-label" title={`M${m.milestone} · ${m.domain}`}>
                  {m.name}
                </span>
                <div className="metric-track">
                  <div className="metric-fill" style={{ width: `${Math.round(m.value * 100)}%` }} />
                </div>
                <span className="metric-value">{m.value.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}
