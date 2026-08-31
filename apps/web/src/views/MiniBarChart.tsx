type MiniBarChartProps = {
  items: Array<{ label: string; value: number; ok?: boolean }>;
  max?: number;
};

export function MiniBarChart({ items, max = 1 }: MiniBarChartProps) {
  return (
    <div className="mini-chart" role="img" aria-label="Metric chart">
      {items.map((item) => {
        const pct = Math.max(4, Math.round((item.value / max) * 100));
        return (
          <div key={item.label} className="mini-chart-row">
            <span className="mini-chart-label">{item.label}</span>
            <div className="mini-chart-track">
              <div
                className={`mini-chart-fill ${item.ok === false ? "warn" : ""}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="mini-chart-value">{typeof item.value === "number" && item.value <= 1 ? item.value.toFixed(2) : item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

type SparklineProps = {
  values: number[];
  label?: string;
};

export function Sparkline({ values, label }: SparklineProps) {
  if (!values.length) return null;
  const max = Math.max(...values, 0.01);
  const points = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * 100;
      const y = 100 - (v / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg className="sparkline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      {label ? <title>{label}</title> : null}
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}
