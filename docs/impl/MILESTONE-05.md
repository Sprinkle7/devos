# Milestone 05 — Tool Loops, Streaming, Provider Secrets, Conversations

Status: **Complete** (2026-08-06)  
Depends on: Milestone 04  
API version: **0.5.0**

## Delivered

1. `conversations` + `messages` tables; list history per workspace
2. Agent chat with MCP tool loop (`useTools`, `maxToolRounds`) via `runAgent`
3. Provider secrets: `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` from secrets store when those providers are enabled
4. SSE streaming: `POST /agent/chat/stream`
5. Graphify build/update: `POST /graphify/build`
6. Hub UI: useTools checkbox, Stream, conversations list, Build/update graph

## Acceptance

- [x] Conversation + messages persist
- [x] Agent chat with `useTools` calls echo MCP (`ping` → `pong`)
- [x] Stream endpoint emits SSE tokens
- [x] Graphify build helper runs (`graphify update .`)
- [x] Web panels wired

## Run

```bash
pnpm install
pnpm dev
```

## Next (Milestone 06 candidates)

- Smarter tool selection (model-driven only; less heuristic)
- Conversation resume (`conversationId` UI picker)
- Keychain-backed secrets option
- Background jobs for long Graphify builds
- Basic governance gate on destructive MCP tools
