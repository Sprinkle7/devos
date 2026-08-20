# DEVAIOS Documentation

This folder is the documentation source of truth for **DEVAIOS**: a central AI developer operating system / hub that orchestrates tools, projects, memory, plugins, and AI providers.

Frozen decisions: [`decisions/FOUNDER-DECISIONS.md`](decisions/FOUNDER-DECISIONS.md)  
(name, local web, full docs first, first-party CCE, **Postgres**, **MCP-first**, **pnpm**).

## How this was built

1. Original ChatGPT share: `../chatgpt-omniroute-installation-guide.md`
2. OmniRoute installation chatter was ignored for product docs
3. Useful project content was extracted into the tree below
4. Existing curated files at the docs root were **kept** (not overwritten)
5. Chat-extracted duplicates are stored under `foundation/*.from-chat.md` for comparison

## Documentation map

### A. Curated foundation (already collected)

| File | Purpose |
|------|---------|
| [00-VISION.md](00-VISION.md) | Product vision |
| [01-GOALS.md](01-GOALS.md) | Goals & success criteria |
| [02-PRINCIPLES.md](02-PRINCIPLES.md) | Design principles |
| [03-ARCHITECTURE.md](03-ARCHITECTURE.md) | Architecture |
| [04-SYSTEM-BLUEPRINT.md](04-SYSTEM-BLUEPRINT.md) | System blueprint |
| [05-WORKSPACE.md](05-WORKSPACE.md) | Workspace model |
| [010-Core-Runtime.md](010-Core-Runtime.md) | Core runtime SRS |
| [011-Lifecycle.md](011-Lifecycle.md) | Lifecycle SRS |
| [012-Configuration.md](012-Configuration.md) | Configuration SRS |
| [013-Workspace.md](013-Workspace.md) | Workspace SRS |
| [FDS-001-Core-Domain-Model.md](FDS-001-Core-Domain-Model.md) | Domain vocabulary |
| [core/00-CORE-RUNTIME.md](core/00-CORE-RUNTIME.md) | Core runtime notes |
| [intelligence/00-BRAIN.md](intelligence/00-BRAIN.md) | Brain / memory killer feature |

### B. Planning & source intent

| File | Purpose |
|------|---------|
| [planning/USER-INTENT.md](planning/USER-INTENT.md) | Original user requirements from chat |
| [planning/](planning/) | Early concept, working agreements, phase plans |

### C. Decisions & ADRs

| Folder | Purpose |
|--------|---------|
| [decisions/](decisions/) | Architecture freeze, CTO decisions, moat, platform strategy |

### D. Requirements extracted from chat

| Folder | Purpose |
|--------|---------|
| [requirements/](requirements/) | SRS overview + SRS-010..013 + FDS chat copies |
| [foundation/](foundation/) | Chat copies of vision/architecture docs for diffing |

### E. Sprint specifications (feature requirements)

- [Sprint 1](sprints/sprint-01/README.md) — 30 tasks
- [Sprint 2](sprints/sprint-02/README.md) — 10 tasks
- [Sprint 3](sprints/sprint-03/README.md) — 10 tasks
- [Sprint 4](sprints/sprint-04/README.md) — 10 tasks
- [Sprint 5](sprints/sprint-05/README.md) — 10 tasks
- [Sprint 6](sprints/sprint-06/README.md) — 8 tasks
- [Sprint 7](sprints/sprint-07/README.md) — 8 tasks
- [Sprint 8](sprints/sprint-08/README.md) — 6 tasks
- [Sprint 9](sprints/sprint-09/README.md) — 5 tasks
- [Sprint 10](sprints/sprint-10/README.md) — 5 tasks
- [Sprint 11](sprints/sprint-11/README.md) — 5 tasks
- [Sprint 12](sprints/sprint-12/README.md) — 5 tasks
- [Sprint 13](sprints/sprint-13/README.md) — 5 tasks
- [Sprint 14](sprints/sprint-14/README.md) — 5 tasks
- [Sprint 15](sprints/sprint-15/README.md) — 5 tasks
- [Sprint 16](sprints/sprint-16/README.md) — 5 tasks
- [Sprint 17](sprints/sprint-17/README.md) — 5 tasks
- [Sprint 18](sprints/sprint-18/README.md) — 5 tasks
- [Sprint 19](sprints/sprint-19/README.md) — 5 tasks
- [Sprint 20](sprints/sprint-20/README.md) — 5 tasks
- [Sprint 21](sprints/sprint-21/README.md) — 5 tasks
- [Sprint 22](sprints/sprint-22/README.md) — 5 tasks
- [Sprint 23](sprints/sprint-23/README.md) — 5 tasks
- [Sprint 24](sprints/sprint-24/README.md) — 5 tasks
- [Sprint 25](sprints/sprint-25/README.md) — 5 tasks
- [Sprint 26](sprints/sprint-26/README.md) — 5 tasks
- [Sprint 27](sprints/sprint-27/README.md) — 5 tasks
- [Sprint 28](sprints/sprint-28/README.md) — 5 tasks
- [Sprint 29](sprints/sprint-29/README.md) — 5 tasks
- [Sprint 30](sprints/sprint-30/README.md) — 5 tasks
- [Sprint 31](sprints/sprint-31/README.md) — 5 tasks
- [Sprint 32](sprints/sprint-32/README.md) — 5 tasks
- [Sprint 33](sprints/sprint-33/README.md) — 5 tasks
- [Sprint 34](sprints/sprint-34/README.md) — 5 tasks
- [Sprint 35](sprints/sprint-35/README.md) — 5 tasks
- [Sprint 36](sprints/sprint-36/README.md) — 10 tasks
- [Sprint 37](sprints/sprint-37/README.md) — 8 tasks
- [Sprint 38](sprints/sprint-38/README.md) — 7 tasks
- [Sprint 39](sprints/sprint-39/README.md) — 8 tasks
- [Sprint 40](sprints/sprint-40/README.md) — 8 tasks
- [Sprint 41](sprints/sprint-41/README.md) — 4 tasks

**Total extracted sprint tasks:** 272

### F. Status, MVP & cross-cutting

- [STATUS.md](STATUS.md) — progress
- [REQUIREMENTS-BACKLOG.md](REQUIREMENTS-BACKLOG.md) — docs backlog
- [DOCS-COMPLETE.md](DOCS-COMPLETE.md) — gate before coding
- [SPRINT-CATALOG.md](SPRINT-CATALOG.md) — all sprint tasks + triage
- [PRODUCT-REQUIREMENTS.md](PRODUCT-REQUIREMENTS.md) — MVP + full-corpus policy
- [FEATURE-MATRIX.md](FEATURE-MATRIX.md) — feature ↔ docs map
- [USE-CASES.md](USE-CASES.md) — primary use cases
- [LOCAL-WEB.md](LOCAL-WEB.md) — primary UI
- [CONTEXT-COMPRESSION.md](CONTEXT-COMPRESSION.md) — first-party token/context packing
- [TECH-STACK.md](TECH-STACK.md) — proposed stack
- [SECURITY-BASELINE.md](SECURITY-BASELINE.md) — security baseline
- [DATA-MODEL-ATLAS.md](DATA-MODEL-ATLAS.md) — entity map
- [TESTING-STRATEGY.md](TESTING-STRATEGY.md) — test strategy
- [INSTALL-AND-DOCKER.md](INSTALL-AND-DOCKER.md) — one-click + durable Docker
- [PLUGIN-INTEGRATIONS.md](PLUGIN-INTEGRATIONS.md) — Graphify / Claude / Cursor / etc.
- [OBSTACLES-AND-BLOCKERS.md](OBSTACLES-AND-BLOCKERS.md) — risks and mitigations
- [FOUNDATION-MERGE.md](FOUNDATION-MERGE.md) — curated vs chat merge record
- [ARCHITECTURE-AMENDMENTS.md](ARCHITECTURE-AMENDMENTS.md) — decision overrides on older specs
- [REQUIRED-SPRINT-REVIEW.md](REQUIRED-SPRINT-REVIEW.md) — Sprints 1–5 + 41 review
- [impl/MILESTONE-01.md](impl/MILESTONE-01.md) — first coding milestone
- [impl/MILESTONE-02.md](impl/MILESTONE-02.md) — projects, MCP probe, backup, providers
- [impl/MILESTONE-03.md](impl/MILESTONE-03.md) — listTools, secrets, memories, Graphify helper
- [impl/MILESTONE-04.md](impl/MILESTONE-04.md) — callTool, memory→CCE, agent chat, Graphify query
- [impl/MILESTONE-05.md](impl/MILESTONE-05.md) — tool loops, SSE, conversations, Graphify build
- [impl/MILESTONE-06.md](impl/MILESTONE-06.md) — smarter tools, resume, governance, keychain secrets
- [impl/MILESTONE-07.md](impl/MILESTONE-07.md) — native tools, HITL inbox, search, async jobs
- [impl/MILESTONE-08.md](impl/MILESTONE-08.md) — FTS, native round-trip, job SSE, backup v2
- [impl/MILESTONE-09.md](impl/MILESTONE-09.md) — encrypted backup, export, stream tools, job WS

## Working agreement (docs-first)

1. Finish / consolidate **all** requirements documentation before implementation
2. Triage labels guide implementation order; they do not delete docs
3. Local web + first-party CCE are baseline architecture assumptions
4. Every new requirement lands as a markdown file here first
