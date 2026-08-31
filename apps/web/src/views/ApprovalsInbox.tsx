type ApprovalRow = {
  id: string;
  server: string;
  tool: string;
  reason?: string | null;
};

type ApprovalsInboxProps = {
  workspaceSlug: string;
  approvals: ApprovalRow[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRefresh: () => void;
};

export function ApprovalsInbox({
  workspaceSlug,
  approvals,
  onApprove,
  onReject,
  onRefresh,
}: ApprovalsInboxProps) {
  if (!approvals.length) return null;

  return (
    <section className="panel side-card approvals-inbox">
      <header className="chat-history-header">
        <h3>Pending approvals</h3>
        <button type="button" className="ghost tiny-btn" onClick={onRefresh}>
          Refresh
        </button>
      </header>
      <p className="panel-sub muted tiny">
        Destructive MCP tools for <strong>{workspaceSlug}</strong> need your OK before the agent can continue.
      </p>
      <ul className="approval-list">
        {approvals.map((a) => (
          <li key={a.id} className="approval-item">
            <div>
              <strong>
                {a.server}/{a.tool}
              </strong>
              <span className="muted">{a.reason ?? "destructive tool"}</span>
            </div>
            <div className="row">
              <button type="button" className="primary tiny-btn" onClick={() => onApprove(a.id)}>
                Approve
              </button>
              <button type="button" className="ghost tiny-btn" onClick={() => onReject(a.id)}>
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
