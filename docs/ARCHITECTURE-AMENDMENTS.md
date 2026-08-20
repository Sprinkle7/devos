# Architecture Amendments (Post-Foundation)

Status: Active  
Applies on top of: `03-ARCHITECTURE.md`, `04-SYSTEM-BLUEPRINT.md`, `core/00-CORE-RUNTIME.md`, sprint specs  
Source: `decisions/FOUNDER-DECISIONS.md`

## A1 — Local web replaces desktop-first

Sprint 2 / older docs that specify a desktop application as the primary shell are amended:

- Primary UX = **local web** (`apps/web`) on localhost
- Desktop wrappers are optional later packaging
- Acceptance criteria that say “open desktop app” → “open hub in browser via `pnpm dev`”

## A2 — PostgreSQL is system of record

- Default DB = **Postgres**
- Local/dev: Docker Compose service `postgres` (or local Postgres)
- Do not design core schema around SQLite; optional embedded caches are fine
- Volumes: Postgres data directory is mandatory durable state

## A3 — MCP-first plugin host

- Core Runtime plugin loading prefers **MCP servers/tools**
- Graphify, Claude Desktop bridges, Cursor tools, and future plugins should expose MCP where possible
- Custom in-process plugin API is an escape hatch only
- Permission model still applies (see `SECURITY-BASELINE.md`)

## A4 — First-party context compression

- CCE is a core package (`packages/context-compression`)
- Brain + agent runtime call CCE before model invocations
- Headroom/Ponytail are optional MCP/adapters, not required

## A5 — Default developer path is pnpm

```bash
pnpm install
# ensure Postgres is up (compose or local)
pnpm dev
```

Docker Compose remains the documented way to run Postgres (+ optional full stack) with retained volumes.

## A6 — Package layout preference

Prefer:

```text
apps/web
apps/api
apps/cli
packages/mcp-host
packages/context-compression
packages/governance
…
```

over desktop-centric app folders as the primary tree.
