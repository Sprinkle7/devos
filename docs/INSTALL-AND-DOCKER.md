# Install & Docker Requirements

Status: Draft  
Related: `planning/02-one-click-and-docker.md`, `LOCAL-WEB.md`, `TECH-STACK.md`, Sprint 1 install/backup tasks  
Decision: local web first + Postgres + pnpm ([FOUNDER-DECISIONS.md](decisions/FOUNDER-DECISIONS.md))

## Goal

A new user (or future-you on a new machine) can get DEVAIOS running with minimal friction via **`pnpm`**, open the **local web hub** in a browser, use **PostgreSQL** as durable system of record, and survive restarts/redeploys.

## Must-have flows

### A. Guided local install (macOS first) — default path

1. Install Node + enable **pnpm**
2. Clone repo → `pnpm install`
3. Start Postgres (`docker compose up -d postgres` or local Postgres)
4. Copy `.env.example` → `.env` with `DATABASE_URL`
5. `pnpm dev` → API + local web on localhost
6. First-run wizard in browser: create workspace, connect AI provider (optional skip), register MCP servers (e.g. Graphify), verify CCE pack smoke test

### B. One-click / scripted install

- Prefer repo-local:

```bash
pnpm install
pnpm dev
```

- Optional helper:

```bash
./scripts/bootstrap.sh   # installs deps, checks Postgres, prints URLs
```

Requirements:

- Idempotent (safe to re-run)
- Prints next steps
- Fails with actionable errors

### C. Docker deploy with retained state

Compose must run **Postgres** and may optionally run API/web. Mount persistent volumes for:

| Data | Why |
|------|-----|
| Postgres data | system of record |
| Workspace files | projects, caches |
| Memory / graph extras | Brain + Graphify state beyond PG |
| Secrets store | API keys (encrypted) |
| MCP config/state | server registrations |
| Logs / audit exports | debugging + governance |
| Backups | export bundles |

Hard rule: **ephemeral container filesystem is never the source of truth**.

### D. Upgrade / reinstall

- Upgrade must not wipe Postgres volume
- Migration scripts versioned (SQL / ORM migrations)
- Rollback notes for breaking migrations

## Acceptance criteria

- [ ] Fresh macOS path: `pnpm install` + Postgres + `pnpm dev` reaches hub UI
- [ ] Docker/Postgres down/up preserves workspaces and memory
- [ ] Backup export/import works across machines
- [ ] Missing dependency (pnpm/Node/Postgres) is diagnosed before silent failure
- [ ] Offline/airgap path documented (even if limited)

## Open decisions

1. Which data directory convention? (`~/.devaios` vs XDG)
2. Rootless containers required?
3. Include Ollama in default compose profile or optional profile? (OmniRoute optional only)
4. ORM for Postgres access (Drizzle / Prisma / Kysely) — Milestone 01
