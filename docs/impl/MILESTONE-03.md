# Milestone 03 — MCP Sessions, Secrets, Memory, Graphify Helper

Status: **Complete** (2026-08-06)  
Depends on: Milestone 02  
API version: **0.3.0**

## Delivered

1. MCP `listTools` via `@modelcontextprotocol/sdk` stdio client
2. Built-in `devaios-echo` MCP fixture (`echo` + `ping` tools)
3. `packages/secrets` — AES-256-GCM secret bag under `~/.devaios/secrets`
4. `memories` table + workspace-scoped Brain v0 API
5. Graphify registration helper (`which graphify` / `~/.devaios/bin/graphify`)
6. Hub UI: List tools, Register echo, Register Graphify, Secrets, Memories

## Acceptance

- [x] `listTools` against echo server returns tools (`echo`, `ping`)
- [x] Secret set/get works; list returns names
- [x] Memory create/list scoped to workspace
- [x] Graphify helper registers when installed (or 404 reason when missing)
- [x] `pnpm dev` boots

## Run

```bash
pnpm install
pnpm dev
# http://127.0.0.1:5173
```

## Next (Milestone 04 candidates)

- MCP `callTool` from hub + tool result in CCE packs
- OS keychain-backed secrets option
- Memory → CCE pin integration
- Graphify query proxy endpoint
- Agent chat v0 using providers + tools
