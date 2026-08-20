# DEVAIOS Product Requirements (MVP Draft)

Status: Draft (decisions frozen 2026-08-05)  
Source: User intent + foundation docs + Sprints 1–5 themes  
Full requirements corpus: all sprints remain documented (see `SPRINT-CATALOG.md`)  
Decisions: [`decisions/FOUNDER-DECISIONS.md`](decisions/FOUNDER-DECISIONS.md)

---

## 1. Problem

Developers bounce between Claude, Cursor, terminals, docs, GitHub, Docker, notes, and plugins. Context is fragmented. Each AI starts cold. The human becomes the integration layer.

## 2. Product statement

**DEVAIOS** is a personal (later team) **central hub / developer operating system** that:

- connects projects, tools, AI providers, and plugins
- remembers workspace context across sessions
- compresses/packs context for models **first-party** (no hard dependency on Headroom/Ponytail)
- supports one-click / guided setup
- can run durably in Docker with retained state
- exposes a **local web** hub first
- orchestrates tools instead of replacing them

Product name is frozen: **DEVAIOS**.

## 3. Primary users

1. Solo developer (Allauddin / founder use-case) — v1
2. Small team sharing a project hub — later
3. Enterprise multi-tenant — later (documented in later sprints; implement after MVP)

## 4. Must-have (MVP implementation — after docs complete)

### 4.1 Hub shell (local web)

- Local web app as the home base (`LOCAL-WEB.md`)
- Project/workspace switcher
- Unified command/palette style actions

### 4.2 Workspace & project model

- Workspace contains projects, repos, docs, memories, plugins, AI settings
- Persist and restore workspace state
- Align with `05-WORKSPACE.md` + FDS-001 terms

### 4.3 AI provider routing

- Connect Claude, Cursor workflows, local models (Ollama), optional gateways
- Per-project provider preferences
- No hard dependency on any single paid API for core shell to boot

### 4.4 Memory / brain + context compression

- Durable project memory (decisions, architecture notes, chat-derived facts)
- Graphify (or equivalent) knowledge graph integration
- **First-party Context Compression Engine** (`CONTEXT-COMPRESSION.md`)
- Context inspector in local web

### 4.5 Plugin system

- Install/enable plugins: Graphify and MCP tools
- Headroom/Ponytail optional adapters only (not required)
- Clear plugin permission model
- Marketplace can be later; local plugin load is MVP

### 4.6 One-click / guided install

- Detect missing dependencies
- Guided install path for first run
- Docker compose with **persistent volumes**

### 4.7 Backup / restore

- Export/import workspace bundle
- Migration between machines

### 4.8 Safety basics

- Confirm destructive actions
- Audit log of consequential tool actions
- Governance hooks compatible with later full ADG (Sprint 41)

## 5. Should-have (near-MVP)

- Design system / consistent UI
- Basic analytics/observability of hub usage
- Auth for multi-profile local users
- Remote agent execution hooks
- Simple notification center

## 6. Could-have (post-MVP; still fully documented)

- Cloud control plane
- Multi-tenant orgs
- Agent marketplace / studio
- Advanced orchestration / multi-agent
- Enterprise IAM, billing, CRM, digital twin, decision governance (Sprints 39–41)

## 7. Documentation policy (Founder D-03)

All sprint requirements remain in `docs/sprints/` and `SPRINT-CATALOG.md`.  
Nothing is deleted for being “too big.”  
Triage labels (Required / Later / Speculative) guide **implementation order**, not documentation omission.

## 8. Explicit constraints & obstacles (seed)

See `OBSTACLES-AND-BLOCKERS.md`.

## 9. Success criteria (MVP implementation)

A developer can:

1. Install DEVAIOS (local web or Docker) in one guided flow
2. Create a workspace and attach an existing repo
3. Enable Graphify (or substitute) and query project knowledge
4. Pack context via CCE and chat with an AI provider
5. Quit and reopen without losing memory/config
6. Backup and restore onto another machine

## 10. First implementation milestone (only after docs freeze)

**Sprint 1 bootstrap slice**: repository skeleton, local web shell, config service, workspace model, install/bootstrap, backup/restore, CCE v0.

## 11. Frozen decisions

| Topic | Choice |
|-------|--------|
| Name | DEVAIOS |
| UI | Local web first |
| Docs | Complete all requirements docs before coding |
| Token compression | First-party CCE; Headroom/Ponytail optional only |
| Database | PostgreSQL |
| Plugins | MCP-first |
| Default run | pnpm (`pnpm install` / `pnpm dev`) |
