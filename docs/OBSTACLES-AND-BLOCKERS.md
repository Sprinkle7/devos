# Obstacles & Blockers

Status: Draft  
Requested in original chat: consider possibilities, obstacles, blockers while planning.

## Product / scope blockers

| ID | Obstacle | Impact | Mitigation |
|----|----------|--------|------------|
| O-01 | ChatGPT sprint scope explosion (AGI/civilization) | Never ships | Freeze MVP in `PRODUCT-REQUIREMENTS.md`; defer Sprint 9+ |
| O-02 | Incomplete conversation (stopped at Sprint 41.4) | Missing specs | Continue only MVP-critical docs; stub Sprint 41.5 |
| O-03 | Dual naming (DevOS vs DEVAIOS) | Confused docs/code | **Resolved:** DEVAIOS frozen; vision rename started |
| O-04 | Docs duplicated (curated + from-chat) | Contradictions | Merge pass in backlog Priority 1 |

## Technical blockers

| ID | Obstacle | Impact | Mitigation |
|----|----------|--------|------------|
| T-01 | Many AI providers / tools | Integration complexity | Provider adapter interface first |
| T-02 | Plugin security (MCP/tools) | Secret leakage, RCE risk | Permission model + confirmations |
| T-03 | Knowledge graph + memory quality | Noise, wrong context | Project scoping + ranking |
| T-04 | Docker without durable volumes | Data loss | Mandatory volume map |
| T-05 | Desktop + local services coupling | Hard installs | Clear process model (hub + sidecars) |
| T-06 | Cursor/Claude are external apps | Limited deep control | Orchestrate via MCP/CLI/APIs, don’t fork IDEs day one |

## Operational blockers

| ID | Obstacle | Impact | Mitigation |
|----|----------|--------|------------|
| Ops-01 | Solo builder bandwidth | Slow delivery | Tiny vertical slices; Sprint 1 bootstrap only |
| Ops-02 | No frozen tech stack yet | Churn | Decide stack in architecture merge pass |
| Ops-03 | Implementing before docs freeze | Rework | Docs-first gate |

## External dependency risks

| Dependency | Risk | Approach |
|------------|------|----------|
| Anthropic / OpenAI APIs | Cost, outages, policy | Local model fallback optional |
| Ollama | Hardware limits (e.g. 24GB) | Expect local quality tradeoffs; document |
| Graphify / Headroom / Ponytail | API churn, install friction | Version-pin + adapter layer |
| Claude Desktop / Cursor | Config formats change | Treat as integrations, not core |

## Decision needed soon

1. ~~Native desktop vs local web~~ → **Local web** (frozen)
2. ~~SQLite vs Postgres~~ → **PostgreSQL** (frozen)
3. ~~MCP-first vs custom API~~ → **MCP-first** (frozen)
4. ~~Skip Sprint 41 docs?~~ → **No** — full requirements docs; implement MVP later
5. ~~Default run path~~ → **pnpm** (frozen); Docker for Postgres/durability
6. Data dir convention (`~/.devaios` vs XDG)
7. ORM choice (Drizzle / Prisma / Kysely)
8. MCP host library pick
9. UI component library
