# Requirements Backlog (Docs-First)

Goal: finish **all** requirements documentation before product code.  
MVP coding waits; documentation does not skip later sprints.

## Priority 0 — Frozen decisions

- [x] Name: DEVAIOS
- [x] UI: local web first
- [x] Docs: complete all requirements before implementation
- [x] Token compression: first-party CCE; Headroom/Ponytail optional
- [x] Database: PostgreSQL
- [x] Plugins: MCP-first
- [x] Default run: pnpm
- [x] Recorded in `decisions/FOUNDER-DECISIONS.md`

## Priority 1 — Cross-cutting docs

- [x] Product / local web / CCE / plugins / install / obstacles
- [x] TECH-STACK frozen for core choices
- [x] SECURITY / DATA-MODEL / TESTING drafts
- [x] SPRINT-CATALOG + FEATURE-MATRIX + USE-CASES
- [x] DOCS-COMPLETE gate checklist

## Priority 2 — Foundation merge

- [x] Compare curated vs from-chat (identical bodies after unwrap)
- [x] Canonical set confirmed (`FOUNDATION-MERGE.md`)
- [x] Architecture amendments for decision overrides

## Priority 3 — Sprint documentation completeness

- [x] Extract sprints 1–41.4 from chat
- [x] Continue Sprint 41 tasks 5–8
- [x] Review Required sprints 1–5 + 41 (`REQUIRED-SPRINT-REVIEW.md`)
- [ ] Optional later: polish Later/Speculative tiers (not blocking gate)

## Priority 4 — Implementation (after founder signs DOCS-COMPLETE)

1. Local web shell (`pnpm dev`)
2. Postgres + migrations
3. MCP host stub
4. CCE v0
5. Sprint 1 bootstrap slice
