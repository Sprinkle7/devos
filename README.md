# DEVAIOS

Personal AI developer operating system / central hub.

**Stack (frozen):** local web · PostgreSQL · MCP-first · pnpm · first-party context compression · Drizzle · `~/.devaios`

Current implementation: **Milestone 96** (pulse hover polite, legend atomic off paused, restore polite, dedupe hidden atomic restore).

## Quick start

```bash
# 1) Dependencies
pnpm install

# 2) Postgres DB (local Homebrew already works on this machine)
#    createdb devaios   # if needed
#    OR: docker compose up -d postgres
#        and set DATABASE_URL=postgresql://devaios:devaios@localhost:5432/devaios

cp .env.example .env   # optional; defaults match local Homebrew user auth

# 3) Build workspace packages + run API + web
pnpm dev
```

- Web: http://127.0.0.1:5173  
- API: http://127.0.0.1:8787/health  

```bash
pnpm run doctor      # environment check
pnpm run bootstrap   # doctor + setup hints
```

## Monorepo layout

```text
apps/web                 Local web hub (Vite + React)
apps/api                 HTTP API (Hono + Drizzle + Postgres)
apps/cli                 doctor / bootstrap
packages/shared-kernel   Shared types + ~/.devaios helpers
packages/config          Env + config.json loader
packages/context-compression   CCE v0
packages/secrets            Encrypted local secrets bag
packages/mcp-host        MCP registration + probe + listTools
packages/providers       AI provider registry stub
docs/                    Requirements & architecture (docs-first)
```