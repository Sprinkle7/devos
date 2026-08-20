# Context Compression (First-Party)

Status: Draft  
Decision: [FOUNDER-DECISIONS.md](decisions/FOUNDER-DECISIONS.md) D-04  
Replaces dependency on: Headroom, Ponytail (optional adapters only)

## Problem

AI sessions blow the context window with:

- full file dumps
- long chat history
- repeated docs
- low-signal tool output
- duplicate graph/memory snippets

External token-compression tools can help, but create vendor lock-in and another moving part.

## Product decision

DEVAIOS ships a **first-party Context Compression Engine (CCE)** as part of the Brain / Intelligence layer.

External tools (Headroom, Ponytail, etc.) are **optional adapters**, not required dependencies.

## Goals

1. Maximize useful signal per token sent to any model (cloud or local)
2. Preserve provenance (what was compressed, from where, confidence)
3. Work offline with local models (Ollama) as well as Claude/OpenAI
4. Be workspace-aware (different projects → different compression profiles)
5. Be explainable (show what was dropped vs summarized vs kept verbatim)

## Non-goals

- Perfect lossless compression of all source code
- Replacing the knowledge graph (Graphify) — CCE *uses* graph/memory outputs
- Hiding deletions without an audit trail

## Core capabilities

### 1. Context packing pipeline

```text
Sources (repo, memory, graph, chat, tools)
        ↓
Select candidates (relevance rank)
        ↓
Deduplicate
        ↓
Summarize / excerpt / pin
        ↓
Budget fit (token limit + reserve)
        ↓
Packed Context Bundle (+ manifest)
```

### 2. Compression strategies

| Strategy | When | Notes |
|----------|------|-------|
| Pin | Critical facts, decisions, open tasks | Never auto-drop |
| Excerpt | Large files | Keep symbol/window around hits |
| Summarize | Long chats, docs | Structured summary + pointers |
| Dedup | Repeated blocks | Hash / semantic near-dup |
| Graph collapse | Many related nodes | Subgraph summary |
| Tool-output trim | Noisy command logs | Keep exit code + tail + errors |

### 3. Token budget profiles

- `local-small` (e.g. 8k–16k)
- `local-medium` (e.g. 32k)
- `cloud-large` (100k+)
- `custom` per provider/model

Each pack reserves tokens for: system policy, user turn, tool schemas, reply headroom.

### 4. Manifest & audit

Every packed bundle includes:

- source refs (file path, memory id, graph node id, message id)
- strategy used per chunk
- original vs packed token estimates
- drop list (what was excluded and why)

### 5. APIs (docs-level)

- `context.pack(request) → Bundle`
- `context.explain(bundleId)`
- `context.profiles.list|upsert`
- `context.adapters.register` (optional Headroom/Ponytail bridges)

## Integration points

| Subsystem | Use of CCE |
|-----------|------------|
| Brain / memory | Compact long-term memories into session packs |
| Graphify adapter | Collapse subgraphs into ranked summaries |
| Agent runtime | Pack tool+repo context before each model call |
| Local web UI | “Context inspector” showing pack contents |
| Decision governance | Keep policy pins uncompressed |

## Acceptance criteria

- [ ] Can pack a workspace session under a configured token budget
- [ ] Manifest lists sources and drop reasons
- [ ] Critical pins always survive packing
- [ ] Works with at least one local and one cloud provider profile
- [ ] Hub runs without Headroom or Ponytail installed
- [ ] Optional adapter interface exists but is disabled by default

## Implementation note (later)

Build CCE before investing in third-party compression plugins. If an external tool later outperforms a strategy, add it behind the adapter interface without changing callers.
