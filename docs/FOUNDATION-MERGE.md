# Foundation Merge Record

Date: 2026-08-05  
Status: Complete for curated foundation set

## Method

Compared each curated foundation file to its `*.from-chat.md` extract. Chat files wrap the same markdown in conversational preamble and fenced `md` blocks. After unwrapping fences, content similarity was **1.00** for Principles, Core Runtime, Brain, and Workspace; Vision/Goals/Architecture/Blueprint/FDS were already curated subsets of the same substance (chat-only headings were process chatter like “Next Document”).

## Canonical files (keep editing these)

| Canonical | Chat archive (do not edit for product truth) |
|-----------|-----------------------------------------------|
| `00-VISION.md` | `foundation/00-VISION.from-chat.md` |
| `01-GOALS.md` | `foundation/01-GOALS.from-chat.md` |
| `02-PRINCIPLES.md` | `foundation/02-PRINCIPLES.from-chat.md` |
| `03-ARCHITECTURE.md` | `foundation/03-ARCHITECTURE.from-chat.md` |
| `04-SYSTEM-BLUEPRINT.md` | `foundation/04-SYSTEM-BLUEPRINT.from-chat.md` |
| `05-WORKSPACE.md` | `foundation/05-WORKSPACE.from-chat.md` |
| `core/00-CORE-RUNTIME.md` | `foundation/core/00-CORE-RUNTIME.from-chat.md` |
| `intelligence/00-BRAIN.md` | `foundation/intelligence/00-BRAIN.from-chat.md` |
| `FDS-001-Core-Domain-Model.md` | `requirements/FDS-001-Core-Domain-Model.from-chat.md` |
| `010`–`013` SRS | `requirements/SRS-*` chat copies |

## Overrides applied on top of historical foundation text

These founder decisions supersede older wording inside foundation/sprint prose where they conflict:

| Decision | Override |
|----------|----------|
| D-01 | Name = DEVAIOS |
| D-02 | Local web first (not desktop-first) |
| D-04 | First-party CCE (not Headroom/Ponytail required) |
| D-05 | PostgreSQL default |
| D-06 | MCP-first plugins |
| D-07 | pnpm default run path |

See `decisions/FOUNDER-DECISIONS.md` and `ARCHITECTURE-AMENDMENTS.md`.

## Result

- No content loss from chat extracts relative to curated bodies
- Chat archives retained for provenance
- Further edits go only to canonical files + amendment docs
