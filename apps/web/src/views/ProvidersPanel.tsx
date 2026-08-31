type ProvidersPanelProps = {
  failoverOrder: string[];
  failoverDragIdx: number | null;
  onDragStart: (idx: number) => void;
  onDragEnd: () => void;
  onDrop: (idx: number) => void;
  onSaveFailover: () => void;
  onProbeFailover: () => void;
  autoDisableProviders: boolean;
  onAutoDisableChange: (v: boolean) => void;
  failoverProbeOut: string | null;
  providerCooldownOut: string | null;
  cooldownMinutes: string;
  onCooldownMinutesChange: (v: string) => void;
  onSaveCooldownMinutes: () => void;
  providerList: Array<{ id: string; name: string; kind: string; enabled: boolean }>;
  onToggleProvider: (id: string, enabled: boolean) => void;
  secretsBackend: string;
  keychainAvailable: boolean;
  secretName: string;
  secretValue: string;
  onSecretNameChange: (v: string) => void;
  onSecretValueChange: (v: string) => void;
  onSetSecret: (e: React.FormEvent) => void;
  secretNames: Array<{ name: string; updatedAt: string }>;
};

export function ProvidersPanel({
  failoverOrder,
  failoverDragIdx,
  onDragStart,
  onDragEnd,
  onDrop,
  onSaveFailover,
  onProbeFailover,
  autoDisableProviders,
  onAutoDisableChange,
  failoverProbeOut,
  providerCooldownOut,
  cooldownMinutes,
  onCooldownMinutesChange,
  onSaveCooldownMinutes,
  providerList,
  onToggleProvider,
  secretsBackend,
  keychainAvailable,
  secretName,
  secretValue,
  onSecretNameChange,
  onSecretValueChange,
  onSetSecret,
  secretNames,
}: ProvidersPanelProps) {
  return (
    <div className="providers-layout">
      <section className="panel">
        <h2>Failover chain</h2>
        <p className="panel-sub">Drag to set priority: Ollama first, Claude API second, etc.</p>
        <ul className="failover-list" onDragOver={(e) => e.preventDefault()}>
          {failoverOrder.map((kind, idx) => (
            <li
              key={kind}
              className={`failover-chip${failoverDragIdx === idx ? " dragging" : ""}`}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragEnd={onDragEnd}
              onDrop={() => onDrop(idx)}
              onDragOver={(e) => e.preventDefault()}
            >
              {idx + 1}. {kind}
            </li>
          ))}
        </ul>
        <div className="row">
          <button type="button" onClick={onSaveFailover}>
            Save order
          </button>
          <button type="button" className="primary" onClick={onProbeFailover}>
            Probe all
          </button>
        </div>
        <label className="toggle-chip">
          <input type="checkbox" checked={autoDisableProviders} onChange={(e) => onAutoDisableChange(e.target.checked)} />
          Auto-disable failed providers
        </label>
        {failoverProbeOut ? <p className="muted success-text">{failoverProbeOut}</p> : null}
        {providerCooldownOut ? <p className="muted">{providerCooldownOut}</p> : null}
        <ul className="list">
          {providerList.map((p) => (
            <li key={p.id}>
              {p.name} ({p.kind}) {p.enabled ? "· on" : "· off"}
              <button type="button" style={{ marginLeft: "0.5rem" }} onClick={() => onToggleProvider(p.id, !p.enabled)}>
                {p.enabled ? "Disable" : "Enable"}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Secrets vault</h2>
        <p className="muted">
          Backend: {secretsBackend}
          {keychainAvailable ? " · Keychain available" : ""}
        </p>
        <form className="form-inline" onSubmit={onSetSecret}>
          <input value={secretName} onChange={(e) => onSecretNameChange(e.target.value)} placeholder="name" />
          <input
            value={secretValue}
            onChange={(e) => onSecretValueChange(e.target.value)}
            placeholder="value"
            type="password"
          />
          <button className="primary" type="submit">
            Store
          </button>
        </form>
        <ul className="model-pills">
          {secretNames.map((s) => (
            <li key={s.name}>{s.name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
