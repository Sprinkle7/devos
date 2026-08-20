# Local Web Client (Primary UI)

Status: Draft  
Decision: [FOUNDER-DECISIONS.md](decisions/FOUNDER-DECISIONS.md) D-02

## Decision

DEVAIOS ships **local web first**: a browser UI served from / talking to local DEVAIOS services on the same machine (or Docker network).

Native desktop (Electron/Tauri) is a **later** packaging option, not the primary architecture.

## Why

- Faster iteration on UI
- Easier debugging
- Same UI works in Docker-hosted demos
- Avoids early desktop packaging cost
- Still feels like a “hub” via localhost + optional pinned browser app

## Shape

```text
Browser (local web)
    ↓ HTTP/WS
apps/web  (UI)
    ↓
apps/api or runtime services
    ↓
packages/* (workspace, brain, governance, CCE, plugins)
    ↓
durable volumes / SQLite|Postgres
```

Suggested defaults (final stack TBD in TECH-STACK):

- UI: modern React app in `apps/web`
- API: local HTTP server
- Bind: `127.0.0.1` by default (not public internet)
- Auth: single-user local first; optional login later

## UX surfaces (docs inventory)

- Workspace / project switcher
- Brain / memory / graph query
- Context inspector (CCE packs)
- Plugin manager
- Governance approvals / HITL inbox
- Install / health / backup

## Security baseline

- Default listen on localhost only
- Explicit opt-in to LAN bind
- Secrets never returned to browser in plaintext listings without reveal action
- CSRF/origin checks for mutating routes even on localhost

## Acceptance

- [ ] `pnpm dev` (or compose) opens hub in browser
- [ ] Core flows work without a desktop wrapper
- [ ] Docker profile serves the same web UI with retained volumes
