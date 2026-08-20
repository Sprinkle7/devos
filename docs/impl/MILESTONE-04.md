# Milestone 04 — callTool, Memory→CCE, Agent Chat v0, Graphify Query

Status: **Complete** (2026-08-06)  
Depends on: Milestone 03  
API version: **0.4.0**

## Delivered

1. MCP `callTool` (`POST /mcp/servers/:id/call`)
2. Context pack with `workspaceSlug` → memory pins
3. Agent chat v0 (`POST /agent/chat`) — Ollama when up, else offline stub with packed context
4. Graphify query proxy (`POST /graphify/query`)
5. Hub UI: Call tool, Agent chat, Graphify query

## Acceptance

- [x] callTool on echo works (`echo: m04`)
- [x] `/context/pack` with `workspaceSlug` includes memory pins
- [x] `/agent/chat` returns a reply (offline stub without Ollama model)
- [x] `/graphify/query` proxies CLI (ok even when graph.json missing)
- [x] Web panels wired; `pnpm dev` healthy

## Run

```bash
pnpm install
pnpm dev
```

## Next (Milestone 05 candidates)

- Multi-step tool loop in agent chat
- Stream Ollama replies over WebSocket
- Build/update graphify-out in-repo helper
- Secrets → provider auth for Anthropic/OpenAI
- Conversation history table
