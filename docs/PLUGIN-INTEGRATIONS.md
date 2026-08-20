# Plugin & Tool Integrations

Status: Draft  
Decisions: [`decisions/FOUNDER-DECISIONS.md`](decisions/FOUNDER-DECISIONS.md)

## Purpose

DEVAIOS is an orchestrator. Integrations are first-class, not afterthoughts.

## MVP integration list

| Integration | Role in hub | MVP depth |
|-------------|-------------|-----------|
| **Graphify** | Knowledge graph over repos/docs; query/explain architecture | Must — prefer MCP server |
| **Context Compression (first-party)** | Token/context packing for model calls | Must — core (`CONTEXT-COMPRESSION.md`) |
| **MCP host (core)** | Loads/permits MCP servers and tools | Must — D-06 |
| **Headroom** | Legacy/optional token compression | Optional adapter only — **not required** |
| **Ponytail** | Legacy/optional token compression | Optional adapter only — **not required** |
| **Claude Desktop** | External AI client; MCP/config bridge | Must — connect/configure, don’t replace |
| **Cursor** | Primary coding IDE; project/agent bridge | Must — open project, pass context where possible |
| **Ollama** | Local models | Should — optional provider |
| **OmniRoute** | Optional AI gateway/router | Could — optional profile, not required for hub boot |
| **Git / GitHub** | Repo identity, PRs, history | Must — basic attach + status |
| **Docker / Postgres** | Durability + DB | Must — Postgres system of record; Compose for PG |

## Why not depend on Headroom / Ponytail

They were considered for token compression. Founder decision: build **DEVAIOS Context Compression Engine** so the hub does not rely on those tools. Keep a thin adapter interface in case we want to benchmark or interoperate later.

## Plugin requirements

1. **Discover** — list installed/available plugins
2. **Enable/disable** per workspace
3. **Permissions** — filesystem, network, secrets, repo write
4. **Health** — plugin status in hub UI
5. **Config** — per-plugin settings stored in workspace
6. **Failure isolation** — one bad plugin must not crash hub

## Suggested architecture (docs-level)

```text
Local Web Hub  (pnpm dev)
  └── API / Runtime
        ├── MCP Host (first-class)
        │     ├── graphify (MCP)
        │     ├── claude-desktop bridge
        │     ├── cursor bridge
        │     └── optional compression adapters
        ├── context-compression (core)
        ├── providers (ollama, cloud LLMs, optional omniroute)
        └── PostgreSQL + filesystem volumes
```

## Acceptance criteria (MVP)

- [ ] Can enable Graphify for a workspace and run a knowledge query from the hub
- [ ] CCE packs context under a token budget without Headroom/Ponytail installed
- [ ] Can point hub at a Cursor project/workspace path
- [ ] Can register Claude Desktop MCP config for hub tools (or document exact bridge)
- [ ] Plugin permission prompt exists for write/network
- [ ] Disabled plugin does not load at startup
