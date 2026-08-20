# Data Model Atlas

Status: Draft (DB frozen: PostgreSQL)  
Canonical vocabulary: `FDS-001-Core-Domain-Model.md`  
Stack: `TECH-STACK.md` (D-05 Postgres, D-06 MCP-first)

## Purpose

Map domain concepts to durable stores so sprint specs do not invent conflicting nouns.

## Core entities (from FDS-001 + hub needs)

| Entity | Description | Likely store |
|--------|-------------|--------------|
| User / Profile | Local operator | PostgreSQL |
| Workspace | Hub boundary | PostgreSQL + files |
| Project | Unit of work | PostgreSQL |
| Repository | Linked git repo | PostgreSQL + fs path |
| Document | Managed doc/memory note | PostgreSQL / fs |
| Memory | Durable facts/decisions | PostgreSQL |
| GraphNode/Edge | Knowledge graph | Graphify + optional PG |
| Plugin / MCP server | Installed MCP integration | PostgreSQL + fs |
| Provider | AI provider config | secrets + PG refs |
| ContextBundle | Packed context + manifest | PostgreSQL / fs |
| Decision | Governance decision | PostgreSQL + ledger |
| PolicyPack | Versioned rules | fs + PG active pointer |
| Agent | Autonomous worker | PostgreSQL |
| Plan / Milestone | Long-horizon planning | PostgreSQL |
| TwinState | Digital twin snapshot | PostgreSQL |
| AuditEvent | Append-only ledger | PostgreSQL |

## ID rules

- Prefer UUID strings across API boundaries
- Human slugs allowed for workspace/project (`acme`, `devaios`)
- Never reuse IDs after delete (soft-delete preferred)

## Durability map (Docker)

| Volume mount | Contents |
|--------------|----------|
| `data/postgres` | PostgreSQL data directory |
| `data/workspaces` | project files mirrors / caches |
| `data/graph` | graph persistence |
| `data/secrets` | encrypted secrets |
| `data/ledger` | audit export if separate from PG |
| `data/backups` | backup bundles |
| `data/mcp` | MCP server configs / local state |

## API sketch (nouns only)

```text
/workspaces
/projects
/memories
/graph/query
/context/pack
/plugins
/providers
/governance/decisions
/governance/policies
/hitl/inbox
/system/health
```

## Conflict rule

If a sprint doc invents a synonym, update this atlas and FDS-001 — do not silently fork vocabulary.
