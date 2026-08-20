# TECH-STACK

Status: Frozen (core choices) — 2026-08-05  
Related: `LOCAL-WEB.md`, `INSTALL-AND-DOCKER.md`, `decisions/FOUNDER-DECISIONS.md`

## Principles

1. Local-first, localhost by default
2. One monorepo managed with **pnpm**
3. Strong TypeScript types across UI + API
4. Durable state in **PostgreSQL** + filesystem volumes
5. Swap AI providers behind adapters
6. **MCP-first** plugin/tool surface

## Frozen stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Monorepo | **pnpm** workspaces (Turborepo optional later) | D-07 |
| Local web UI | React + Vite in `apps/web` | D-02 |
| API / runtime | Node (TypeScript) in `apps/api` | Same language as UI |
| Realtime | WebSocket for agent/HITL events | Approvals, plan progress |
| Primary DB | **PostgreSQL** | D-05 — local via Docker Compose or local Postgres |
| Object/files | Local filesystem under `~/.devaios` (or XDG) | Workspaces, packs, backups, plugin data |
| Graph | Graphify integration + DB/fs as needed | Adapter over MCP where possible |
| Plugins | **MCP-first host** | D-06 — custom API only for gaps |
| Context compression | First-party CCE package | D-04 |
| Auth | Single local profile first | Org auth later |
| Default run | `pnpm install && pnpm dev` | Serves web + API; Postgres required/up |
| Docker | Compose for Postgres (+ optional full stack) | Durability companion, not only path |
| Testing | Vitest + Playwright | See `TESTING-STRATEGY.md` |

## Package map (target)

```text
apps/
  web/                 # local web hub
  api/                 # HTTP + WS API
  cli/                 # bootstrap, backup, doctor
packages/
  shared-kernel/
  config/
  workspace/
  brain/
  context-compression/
  mcp-host/            # MCP-first plugin runtime
  governance/
  providers/
```

## Explicit non-choices for v1 shell

- Electron/Tauri as required runtime
- SQLite as default system of record
- Kubernetes as required deploy target
- Mandatory cloud control plane
- Mandatory OmniRoute
- Headroom/Ponytail as required dependencies

## Milestone 01 defaults (frozen for first slice)

1. UI: minimal custom CSS (no component library yet)
2. MCP host: first-party stub in `packages/mcp-host` (register/list; SDK later)
3. Graphify: optional MCP registration only in M01
4. ORM: **Drizzle**
5. Data dir: **`~/.devaios`**
