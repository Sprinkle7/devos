import type { HubStatus } from "../hub/types";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

type StatusBarProps = {
  status: HubStatus | null;
  onRefresh?: () => void;
  workspaces?: Array<{ slug: string; name: string }>;
  selectedSlug?: string;
  onSelectWorkspace?: (slug: string) => void;
};

function pillClass(ok: boolean | undefined, active?: boolean) {
  if (active) return "status-pill live";
  if (ok === undefined) return "status-pill unknown";
  return ok ? "status-pill ok" : "status-pill fail";
}

export function StatusBar({ status, onRefresh, workspaces, selectedSlug, onSelectWorkspace }: StatusBarProps) {
  if (!status) {
    return (
      <div className="status-bar">
        <span className="status-pill unknown">Connecting to hub…</span>
      </div>
    );
  }

  const mcpLabel =
    status.mcp.status === "connected"
      ? "Cursor MCP live"
      : status.mcp.status === "ready"
        ? "MCP ready (waiting for Cursor)"
        : "MCP not built";

  const pending = status.governance?.pendingApprovals ?? 0;

  return (
    <div className="status-bar">
      {workspaces && selectedSlug && onSelectWorkspace ? (
        <WorkspaceSwitcher workspaces={workspaces} selectedSlug={selectedSlug} onSelect={onSelectWorkspace} />
      ) : null}
      <span className={pillClass(status.api.ok)}>API {status.api.ok ? "up" : "down"}</span>
      <span className={pillClass(status.chat?.ready)} title={status.chat?.hint}>
        Chat {status.chat?.ready ? "ready" : "offline"}
      </span>
      <span className={pillClass(status.providers.ollama.ok)}>Ollama</span>
      <span className={pillClass(status.providers.anthropic.ok || status.providers.anthropic.keySet)}>
        Claude API
      </span>
      <span className={pillClass(status.mcp.bridgeBuilt, status.mcp.connectedRecently)}>{mcpLabel}</span>
      <span className={pillClass(status.cognitive.ok)}>
        Cognitive {status.cognitive.modulesActive}/{status.cognitive.totalSystems}
      </span>
      {pending > 0 ? (
        <span className="status-pill warn" title="Destructive MCP tools awaiting approval">
          Approvals {pending}
        </span>
      ) : null}
      {onRefresh ? (
        <button type="button" className="status-refresh" onClick={onRefresh} title="Refresh status">
          ↻
        </button>
      ) : null}
    </div>
  );
}
