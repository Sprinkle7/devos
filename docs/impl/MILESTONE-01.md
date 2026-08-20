# Milestone 01 — First Implementation Slice

Status: **Complete** (2026-08-06)  
UI: local web  
DB: PostgreSQL  
ORM: Drizzle  
Plugins: MCP-first  
Data dir: `~/.devaios`  
DX: pnpm

## Goal

Stand up the smallest real DEVAIOS hub that boots locally and persists state.

## Scope

1. pnpm monorepo skeleton (`apps/web`, `apps/api`, `apps/cli`, `packages/*` stubs)
2. Local web shell + health page
3. Postgres connection + initial schema (workspaces table)
4. Config + workspace create/list API
5. Context Compression v0 (budget pack + manifest)
6. MCP host stub (list/register server)
7. `docker compose` for Postgres volume
8. Doctor/bootstrap via pnpm scripts / CLI

## Out of scope

- Desktop wrapper
- Multi-tenant / billing / CRM
- Full Sprint 41 autonomy loop
- Speculative AGI sprints
- Marketplace

## Acceptance

- [x] `pnpm install && pnpm dev` serves local web on localhost
- [x] Postgres required/up; workspace create persists after restart
- [x] `context.pack` returns manifest under budget
- [x] MCP host can register at least a stub server
- [x] Compose Postgres volume path documented (`docker-compose.yml`); local Homebrew Postgres used for M01 verify
- [x] Root README explains run path

## Doc prerequisites

- [x] Core TECH-STACK frozen
- [x] Foundation merge done
- [x] DOCS-COMPLETE founder sign-off

## Run

```bash
pnpm install
pnpm dev
# http://127.0.0.1:5173  ·  http://127.0.0.1:8787/health
```
