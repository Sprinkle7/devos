import type { FormEvent } from "react";
import { GraphifyResults } from "./GraphifyResults";

type Workspace = { id: string; slug: string; name: string };
type Project = { id: string; slug: string; name: string };
type Memory = { id: string; kind: string; title: string; content?: string };

type WorkspaceViewProps = {
  workspaces: Workspace[];
  selectedSlug: string;
  onSelectWorkspace: (slug: string) => void;
  name: string;
  slug: string;
  onNameChange: (v: string) => void;
  onSlugChange: (v: string) => void;
  onCreateWorkspace: (e: FormEvent) => void;
  projects: Project[];
  projectName: string;
  projectSlug: string;
  onProjectNameChange: (v: string) => void;
  onProjectSlugChange: (v: string) => void;
  onCreateProject: (e: FormEvent) => void;
  graphQuery: string;
  onGraphQueryChange: (v: string) => void;
  onGraphifyQuery: (e: FormEvent) => void;
  onGraphifyBuild: () => void;
  graphOut: string | null;
  graphAvailable?: boolean;
  graphNodes?: number;
  onOpenGraph?: () => void;
  memoryList: Memory[];
  memoryTitle: string;
  memoryContent: string;
  onMemoryTitleChange: (v: string) => void;
  onMemoryContentChange: (v: string) => void;
  onAddMemory: (e: FormEvent) => void;
  onDeleteMemory: (id: string) => void;
};

export function WorkspaceView({
  workspaces,
  selectedSlug,
  onSelectWorkspace,
  name,
  slug,
  onNameChange,
  onSlugChange,
  onCreateWorkspace,
  projects,
  projectName,
  projectSlug,
  onProjectNameChange,
  onProjectSlugChange,
  onCreateProject,
  graphQuery,
  onGraphQueryChange,
  onGraphifyQuery,
  onGraphifyBuild,
  graphOut,
  graphAvailable,
  graphNodes,
  onOpenGraph,
  memoryList,
  memoryTitle,
  memoryContent,
  onMemoryTitleChange,
  onMemoryContentChange,
  onAddMemory,
  onDeleteMemory,
}: WorkspaceViewProps) {
  return (
    <div className="workspace-layout">
      <aside className="panel workspace-sidebar card-glow">
        <h2>Workspaces</h2>
        <p className="panel-sub">Project context for chat, MCP, and memories.</p>
        <form className="form-inline" onSubmit={onCreateWorkspace}>
          <input value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="Name" />
          <input value={slug} onChange={(e) => onSlugChange(e.target.value)} placeholder="slug" />
          <button className="primary" type="submit">
            +
          </button>
        </form>
        <ul className="workspace-list">
          {workspaces.map((w) => (
            <li key={w.id}>
              <button
                type="button"
                className={`workspace-pick ${selectedSlug === w.slug ? "active" : ""}`}
                onClick={() => onSelectWorkspace(w.slug)}
              >
                <strong>{w.slug}</strong>
                <span>{w.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="workspace-main">
        <section className="panel">
          <h2>Projects · {selectedSlug}</h2>
          <form className="form-inline" onSubmit={onCreateProject}>
            <input value={projectName} onChange={(e) => onProjectNameChange(e.target.value)} placeholder="Project name" />
            <input value={projectSlug} onChange={(e) => onProjectSlugChange(e.target.value)} placeholder="slug" />
            <button className="primary" type="submit">
              Add
            </button>
          </form>
          <ul className="model-pills">
            {projects.length === 0 ? <li className="muted-pill">No projects yet</li> : null}
            {projects.map((p) => (
              <li key={p.id}>
                {p.slug} — {p.name}
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2>Brain memories</h2>
          <form className="form" onSubmit={onAddMemory}>
            <input value={memoryTitle} onChange={(e) => onMemoryTitleChange(e.target.value)} placeholder="Title" />
            <textarea
              value={memoryContent}
              onChange={(e) => onMemoryContentChange(e.target.value)}
              placeholder="What should the agent remember about this workspace?"
              rows={2}
            />
            <button className="primary" type="submit">
              Save memory
            </button>
          </form>
          <ul className="memory-list">
            {memoryList.length === 0 ? <li className="muted">No memories — add notes the agent can recall in chat.</li> : null}
            {memoryList.map((m) => (
              <li key={m.id} className="memory-item">
                <div className="memory-body">
                  <div>
                    <span className="chip">{m.kind}</span> {m.title}
                  </div>
                  {m.content ? <p className="memory-preview">{m.content.slice(0, 160)}{m.content.length > 160 ? "…" : ""}</p> : null}
                </div>
                <button type="button" className="ghost tiny-btn" onClick={() => onDeleteMemory(m.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2>Graphify</h2>
          <p className="panel-sub">Query the codebase knowledge graph for this repo.</p>
          <div className="row" style={{ marginBottom: "0.5rem" }}>
            {graphAvailable ? (
              <a
                className="primary link-btn"
                href="/api/graphify/graph"
                target="_blank"
                rel="noreferrer"
                onClick={() => onOpenGraph?.()}
              >
                Open interactive graph
                {graphNodes ? ` (${graphNodes.toLocaleString()} nodes)` : ""}
              </a>
            ) : (
              <span className="muted">Build the graph to open the interactive viewer.</span>
            )}
          </div>
          <form className="form-inline" onSubmit={onGraphifyQuery}>
            <input value={graphQuery} onChange={(e) => onGraphQueryChange(e.target.value)} placeholder="How does X relate to Y?" />
            <button className="primary" type="submit">
              Query
            </button>
            <button type="button" className="ghost" onClick={onGraphifyBuild}>
              Rebuild
            </button>
          </form>
          {graphOut ? <GraphifyResults raw={graphOut} /> : null}
        </section>
      </div>
    </div>
  );
}
