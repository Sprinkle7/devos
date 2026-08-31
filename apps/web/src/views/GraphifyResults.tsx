type GraphifyPayload = {
  ok?: boolean;
  reason?: string;
  query?: string;
  output?: string;
  durationMs?: number;
};

function parseGraphOut(raw: string | null): GraphifyPayload | null {
  if (!raw?.trim()) return null;
  try {
    return JSON.parse(raw) as GraphifyPayload;
  } catch {
    return { ok: true, output: raw };
  }
}

function formatLine(line: string): { kind: "node" | "edge" | "meta" | "text"; text: string } {
  const t = line.trim();
  if (t.startsWith("NODE ")) return { kind: "node", text: line };
  if (t.startsWith("EDGE ") || t.includes(" → ")) return { kind: "edge", text: line };
  if (t.startsWith("[!]") || t.startsWith("[graphify]")) return { kind: "meta", text: line };
  return { kind: "text", text: line };
}

type GraphifyResultsProps = {
  raw: string | null;
};

export function GraphifyResults({ raw }: GraphifyResultsProps) {
  const parsed = parseGraphOut(raw);
  if (!parsed) return null;

  if (parsed.ok === false) {
    return (
      <div className="graphify-results fail">
        <p className="error">{parsed.reason ?? "Graphify query failed"}</p>
      </div>
    );
  }

  const lines = (parsed.output ?? "").split("\n").filter(Boolean);
  if (!lines.length) {
    return <p className="muted">No graph results — try a different query.</p>;
  }

  return (
    <div className="graphify-results">
      <div className="graphify-meta">
        {parsed.query ? <span>Query: {parsed.query}</span> : null}
        {parsed.durationMs != null ? <span>{parsed.durationMs}ms</span> : null}
      </div>
      <pre className="graphify-output">
        {lines.map((line, i) => {
          const { kind, text } = formatLine(line);
          return (
            <span key={i} className={`graphify-line ${kind}`}>
              {text}
              {"\n"}
            </span>
          );
        })}
      </pre>
    </div>
  );
}
