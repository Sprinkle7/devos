type WorkspaceSwitcherProps = {
  workspaces: Array<{ slug: string; name: string }>;
  selectedSlug: string;
  onSelect: (slug: string) => void;
};

export function WorkspaceSwitcher({ workspaces, selectedSlug, onSelect }: WorkspaceSwitcherProps) {
  if (!workspaces.length) return null;

  return (
    <label className="workspace-switcher">
      <span className="workspace-switcher-label">Workspace</span>
      <select value={selectedSlug} onChange={(e) => onSelect(e.target.value)} aria-label="Active workspace">
        {workspaces.map((w) => (
          <option key={w.slug} value={w.slug}>
            {w.slug} — {w.name}
          </option>
        ))}
      </select>
    </label>
  );
}
