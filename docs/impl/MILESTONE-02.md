# Milestone 02 — Workspace Depth + MCP + Backup

Status: **Complete** (2026-08-06)  
Depends on: Milestone 01 complete

## Goal

Deepen Sprint 1 foundations: projects under workspaces, real config home, stronger MCP host controls, backup/restore, provider stub, and hub UI for them.

## Delivered

1. `packages/config` — env + `~/.devaios/config.json`
2. `projects` table + nested CRUD under workspaces
3. MCP host: list / register / enable-disable / remove / **probe** (spawn)
4. Backup export + restore (`~/.devaios/backups/*.json`)
5. `packages/providers` stub registry (ollama/anthropic/openai)
6. Local web panels for projects, MCP, providers, backup
7. Structured JSON request logs on API

## Acceptance

- [x] Create project under a workspace; list persists in Postgres
- [x] MCP server can be registered, probed, disabled, removed
- [x] Backup export writes bundle under `~/.devaios/backups`
- [x] Restore reloads MCP registry from bundle
- [x] Web hub exposes projects / MCP / backup actions
- [x] `pnpm dev` still boots API + web (API v0.2.0)

## Run

```bash
pnpm install
pnpm dev
# http://127.0.0.1:5173
```

## Next (Milestone 03 candidates)

- Real MCP JSON-RPC session / listTools via SDK
- Secrets manager (encrypted)
- Memory / Brain v0 rows
- Graphify MCP adapter registration helper
- Workspace rootPath attach + repo scan
