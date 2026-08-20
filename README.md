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

## Docs

- Index: [`docs/README.md`](docs/README.md)
- Gate: [`docs/DOCS-COMPLETE.md`](docs/DOCS-COMPLETE.md)
- Milestone 01: [`docs/impl/MILESTONE-01.md`](docs/impl/MILESTONE-01.md)
- Milestone 02: [`docs/impl/MILESTONE-02.md`](docs/impl/MILESTONE-02.md)
- Milestone 03: [`docs/impl/MILESTONE-03.md`](docs/impl/MILESTONE-03.md)
- Milestone 04: [`docs/impl/MILESTONE-04.md`](docs/impl/MILESTONE-04.md)
- Milestone 05: [`docs/impl/MILESTONE-05.md`](docs/impl/MILESTONE-05.md)
- Milestone 06: [`docs/impl/MILESTONE-06.md`](docs/impl/MILESTONE-06.md)
- Milestone 07: [`docs/impl/MILESTONE-07.md`](docs/impl/MILESTONE-07.md)
- Milestone 08: [`docs/impl/MILESTONE-08.md`](docs/impl/MILESTONE-08.md)
- Milestone 09: [`docs/impl/MILESTONE-09.md`](docs/impl/MILESTONE-09.md)
- Milestone 10: [`docs/impl/MILESTONE-10.md`](docs/impl/MILESTONE-10.md)
- Milestone 11: [`docs/impl/MILESTONE-11.md`](docs/impl/MILESTONE-11.md)
- Milestone 12: [`docs/impl/MILESTONE-12.md`](docs/impl/MILESTONE-12.md)
- Milestone 13: [`docs/impl/MILESTONE-13.md`](docs/impl/MILESTONE-13.md)
- Milestone 14: [`docs/impl/MILESTONE-14.md`](docs/impl/MILESTONE-14.md)
- Milestone 15: [`docs/impl/MILESTONE-15.md`](docs/impl/MILESTONE-15.md)
- Milestone 16: [`docs/impl/MILESTONE-16.md`](docs/impl/MILESTONE-16.md)
- Milestone 17: [`docs/impl/MILESTONE-17.md`](docs/impl/MILESTONE-17.md)
- Milestone 18: [`docs/impl/MILESTONE-18.md`](docs/impl/MILESTONE-18.md)
- Milestone 19: [`docs/impl/MILESTONE-19.md`](docs/impl/MILESTONE-19.md)
- Milestone 20: [`docs/impl/MILESTONE-20.md`](docs/impl/MILESTONE-20.md)
- Milestone 21: [`docs/impl/MILESTONE-21.md`](docs/impl/MILESTONE-21.md)
- Milestone 22: [`docs/impl/MILESTONE-22.md`](docs/impl/MILESTONE-22.md)
- Milestone 23: [`docs/impl/MILESTONE-23.md`](docs/impl/MILESTONE-23.md)
- Milestone 24: [`docs/impl/MILESTONE-24.md`](docs/impl/MILESTONE-24.md)
- Milestone 25: [`docs/impl/MILESTONE-25.md`](docs/impl/MILESTONE-25.md)
- Milestone 26: [`docs/impl/MILESTONE-26.md`](docs/impl/MILESTONE-26.md)
- Milestone 27: [`docs/impl/MILESTONE-27.md`](docs/impl/MILESTONE-27.md)
- Milestone 28: [`docs/impl/MILESTONE-28.md`](docs/impl/MILESTONE-28.md)
- Milestone 29: [`docs/impl/MILESTONE-29.md`](docs/impl/MILESTONE-29.md)
- Milestone 30: [`docs/impl/MILESTONE-30.md`](docs/impl/MILESTONE-30.md)
- Milestone 31: [`docs/impl/MILESTONE-31.md`](docs/impl/MILESTONE-31.md)
- Milestone 32: [`docs/impl/MILESTONE-32.md`](docs/impl/MILESTONE-32.md)
- Milestone 33: [`docs/impl/MILESTONE-33.md`](docs/impl/MILESTONE-33.md)
- Milestone 34: [`docs/impl/MILESTONE-34.md`](docs/impl/MILESTONE-34.md)
- Milestone 35: [`docs/impl/MILESTONE-35.md`](docs/impl/MILESTONE-35.md)
- Milestone 36: [`docs/impl/MILESTONE-36.md`](docs/impl/MILESTONE-36.md)
- Milestone 37: [`docs/impl/MILESTONE-37.md`](docs/impl/MILESTONE-37.md)
- Milestone 38: [`docs/impl/MILESTONE-38.md`](docs/impl/MILESTONE-38.md)
- Milestone 39: [`docs/impl/MILESTONE-39.md`](docs/impl/MILESTONE-39.md)
- Milestone 40: [`docs/impl/MILESTONE-40.md`](docs/impl/MILESTONE-40.md)
- Milestone 41: [`docs/impl/MILESTONE-41.md`](docs/impl/MILESTONE-41.md)
- Milestone 42: [`docs/impl/MILESTONE-42.md`](docs/impl/MILESTONE-42.md)
- Milestone 43: [`docs/impl/MILESTONE-43.md`](docs/impl/MILESTONE-43.md)
- Milestone 44: [`docs/impl/MILESTONE-44.md`](docs/impl/MILESTONE-44.md)
- Milestone 45: [`docs/impl/MILESTONE-45.md`](docs/impl/MILESTONE-45.md)
- Milestone 46: [`docs/impl/MILESTONE-46.md`](docs/impl/MILESTONE-46.md)
- Milestone 47: [`docs/impl/MILESTONE-47.md`](docs/impl/MILESTONE-47.md)
- Milestone 48: [`docs/impl/MILESTONE-48.md`](docs/impl/MILESTONE-48.md)
- Milestone 49: [`docs/impl/MILESTONE-49.md`](docs/impl/MILESTONE-49.md)
- Milestone 50: [`docs/impl/MILESTONE-50.md`](docs/impl/MILESTONE-50.md)
- Milestone 51: [`docs/impl/MILESTONE-51.md`](docs/impl/MILESTONE-51.md)
- Milestone 52: [`docs/impl/MILESTONE-52.md`](docs/impl/MILESTONE-52.md)
- Milestone 53: [`docs/impl/MILESTONE-53.md`](docs/impl/MILESTONE-53.md)
- Milestone 54: [`docs/impl/MILESTONE-54.md`](docs/impl/MILESTONE-54.md)
- Milestone 55: [`docs/impl/MILESTONE-55.md`](docs/impl/MILESTONE-55.md)
- Milestone 56: [`docs/impl/MILESTONE-56.md`](docs/impl/MILESTONE-56.md)
- Milestone 57: [`docs/impl/MILESTONE-57.md`](docs/impl/MILESTONE-57.md)
- Milestone 58: [`docs/impl/MILESTONE-58.md`](docs/impl/MILESTONE-58.md)
- Milestone 59: [`docs/impl/MILESTONE-59.md`](docs/impl/MILESTONE-59.md)
- Milestone 60: [`docs/impl/MILESTONE-60.md`](docs/impl/MILESTONE-60.md)
- Milestone 61: [`docs/impl/MILESTONE-61.md`](docs/impl/MILESTONE-61.md)
- Milestone 62: [`docs/impl/MILESTONE-62.md`](docs/impl/MILESTONE-62.md)
- Milestone 63: [`docs/impl/MILESTONE-63.md`](docs/impl/MILESTONE-63.md)
- Milestone 64: [`docs/impl/MILESTONE-64.md`](docs/impl/MILESTONE-64.md)
- Milestone 65: [`docs/impl/MILESTONE-65.md`](docs/impl/MILESTONE-65.md)
- Milestone 66: [`docs/impl/MILESTONE-66.md`](docs/impl/MILESTONE-66.md)
- Milestone 67: [`docs/impl/MILESTONE-67.md`](docs/impl/MILESTONE-67.md)
- Milestone 68: [`docs/impl/MILESTONE-68.md`](docs/impl/MILESTONE-68.md)
- Milestone 69: [`docs/impl/MILESTONE-69.md`](docs/impl/MILESTONE-69.md)
- Milestone 70: [`docs/impl/MILESTONE-70.md`](docs/impl/MILESTONE-70.md)
- Milestone 71: [`docs/impl/MILESTONE-71.md`](docs/impl/MILESTONE-71.md)
- Milestone 72: [`docs/impl/MILESTONE-72.md`](docs/impl/MILESTONE-72.md)
- Milestone 73: [`docs/impl/MILESTONE-73.md`](docs/impl/MILESTONE-73.md)
- Milestone 74: [`docs/impl/MILESTONE-74.md`](docs/impl/MILESTONE-74.md)
- Milestone 75: [`docs/impl/MILESTONE-75.md`](docs/impl/MILESTONE-75.md)
- Milestone 76: [`docs/impl/MILESTONE-76.md`](docs/impl/MILESTONE-76.md)
- Milestone 77: [`docs/impl/MILESTONE-77.md`](docs/impl/MILESTONE-77.md)
- Milestone 78: [`docs/impl/MILESTONE-78.md`](docs/impl/MILESTONE-78.md)
- Milestone 79: [`docs/impl/MILESTONE-79.md`](docs/impl/MILESTONE-79.md)
- Milestone 80: [`docs/impl/MILESTONE-80.md`](docs/impl/MILESTONE-80.md)
- Milestone 81: [`docs/impl/MILESTONE-81.md`](docs/impl/MILESTONE-81.md)
- Milestone 82: [`docs/impl/MILESTONE-82.md`](docs/impl/MILESTONE-82.md)
- Milestone 83: [`docs/impl/MILESTONE-83.md`](docs/impl/MILESTONE-83.md)
- Milestone 84: [`docs/impl/MILESTONE-84.md`](docs/impl/MILESTONE-84.md)
- Milestone 85: [`docs/impl/MILESTONE-85.md`](docs/impl/MILESTONE-85.md)
- Milestone 86: [`docs/impl/MILESTONE-86.md`](docs/impl/MILESTONE-86.md)
- Milestone 87: [`docs/impl/MILESTONE-87.md`](docs/impl/MILESTONE-87.md)
- Milestone 88: [`docs/impl/MILESTONE-88.md`](docs/impl/MILESTONE-88.md)
- Milestone 89: [`docs/impl/MILESTONE-89.md`](docs/impl/MILESTONE-89.md)
- Milestone 90: [`docs/impl/MILESTONE-90.md`](docs/impl/MILESTONE-90.md)
- Milestone 91: [`docs/impl/MILESTONE-91.md`](docs/impl/MILESTONE-91.md)
- Milestone 92: [`docs/impl/MILESTONE-92.md`](docs/impl/MILESTONE-92.md)
- Milestone 93: [`docs/impl/MILESTONE-93.md`](docs/impl/MILESTONE-93.md)
- Milestone 94: [`docs/impl/MILESTONE-94.md`](docs/impl/MILESTONE-94.md)
- Milestone 95: [`docs/impl/MILESTONE-95.md`](docs/impl/MILESTONE-95.md)
- Milestone 96: [`docs/impl/MILESTONE-96.md`](docs/impl/MILESTONE-96.md)
