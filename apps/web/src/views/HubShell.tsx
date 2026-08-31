import { HUB_TABS, TAB_META, type HubTab, type UiMode } from "../hub/types";

type HubShellProps = {
  tab: HubTab;
  uiMode: UiMode;
  onTab: (tab: HubTab) => void;
  onUiMode: (mode: UiMode) => void;
  pendingApprovals?: number;
};

export function HubShell({ tab, uiMode, onTab, onUiMode, pendingApprovals = 0 }: HubShellProps) {
  const visibleTabs = uiMode === "advanced" ? HUB_TABS : HUB_TABS.filter((t) => t.id !== "advanced");
  const meta = TAB_META[tab];

  return (
    <header className="hub-header">
      <nav className="hub-nav" aria-label="DEVAIOS hub">
        <div className="hub-tabs" role="tablist">
          {visibleTabs.map((t) => {
            const m = TAB_META[t.id];
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={`hub-tab ${tab === t.id ? "active" : ""}`}
                title={t.hint}
                onClick={() => onTab(t.id)}
              >
                <span className="hub-tab-icon" aria-hidden>
                  {m.icon}
                </span>
                {m.title}
                {t.id === "chat" && pendingApprovals > 0 ? (
                  <span className="hub-tab-badge" aria-label={`${pendingApprovals} pending approvals`}>
                    {pendingApprovals}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        <div className="hub-mode">
          {uiMode === "simple" ? (
            <button type="button" className="hub-mode-toggle ghost" onClick={() => onUiMode("advanced")}>
              Power mode
            </button>
          ) : (
            <button type="button" className="hub-mode-toggle ghost" onClick={() => onUiMode("simple")}>
              Simple mode
            </button>
          )}
        </div>
      </nav>
      <p className="tab-blurb">{meta.blurb}</p>
    </header>
  );
}
