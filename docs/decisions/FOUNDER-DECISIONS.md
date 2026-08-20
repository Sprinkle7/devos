# Founder Decisions (Frozen)

Date: 2026-08-05 (D-01…D-04); 2026-08-05 evening (D-05…D-07)  
Decided by: Allauddin

These decisions are binding for documentation and future implementation unless explicitly revised here.

| # | Topic | Decision |
|---|--------|----------|
| D-01 | Product name | **DEVAIOS** (lowercase in paths/packages: `devaios`) |
| D-02 | Primary client | **Local web first** (browser UI talking to local DEVAIOS services). Native desktop is later, not MVP shell. |
| D-03 | Documentation scope | **Complete all requirements documentation** before implementation. Do not skip later sprints for “MVP-only docs.” MVP implementation comes later; docs must not miss material. |
| D-04 | Token / context compression | Headroom & Ponytail were considered for token compression. **Prefer a first-party DEVAIOS Context Compression module** so we do not depend on those tools. External compressors may remain optional adapters only. |
| D-05 | Primary database | **PostgreSQL** (including local/dev via Docker Compose). Not SQLite-as-default. |
| D-06 | Plugin architecture | **MCP-first** — plugins and tool integrations prefer Model Context Protocol. Custom plugin APIs only when MCP cannot express the capability. |
| D-07 | Default run path | **`pnpm`** — primary happy path is `pnpm install` / `pnpm dev` (and workspace scripts). Docker Compose remains supported for durable Postgres + full stack demos. |

## Implications

1. All curated docs use **DEVAIOS**, not DevOS.
2. Architecture diagrams and install paths prioritize `apps/web` + local API/runtime over Electron/Tauri for v1.
3. Sprint specs through the full extracted set remain in-scope for documentation completeness and triage labeling (Required / Later / Speculative), not deletion.
4. Plugin docs treat Graphify (and similar knowledge tools) as integrations; **context packing/compression is a core subsystem**.
5. Data Model Atlas and install volumes assume **Postgres** as system of record.
6. Plugin host is an **MCP host** first; marketplace/custom loaders are secondary.
7. Docs and onboarding lead with **pnpm**; Docker is the durability/Postgres companion path.

## Amendment rule for older sprint specs

Where an extracted sprint says “Desktop app”, “SQLite”, or “custom plugin API only”, treat Founder Decisions as overrides. Do not rewrite every historical sprint file wholesale; record conflicts in `FOUNDATION-MERGE.md` / `REQUIRED-SPRINT-REVIEW.md` and prefer these decisions at implementation time.
