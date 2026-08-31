type CheckItem = {
  id: string;
  label: string;
  ok: boolean;
  optional?: boolean;
  detail?: string;
};

type SetupChecklistProps = {
  items: CheckItem[];
};

export function SetupChecklist({ items }: SetupChecklistProps) {
  const required = items.filter((i) => !i.optional);
  const done = required.filter((i) => i.ok).length;

  return (
    <section className="panel setup-checklist">
      <h2>Setup checklist</h2>
      <p className="muted">
        {done}/{required.length} required steps complete
      </p>
      <ul className="checklist">
        {items.map((item) => (
          <li key={item.id} className={item.ok ? "ok" : item.optional ? "optional" : "pending"}>
            <span className={`check-dot ${item.ok ? "ok" : ""}`} aria-hidden />
            <span>
              {item.label}
              {item.optional ? " (optional)" : ""}
              {item.detail ? <span className="muted"> — {item.detail}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
