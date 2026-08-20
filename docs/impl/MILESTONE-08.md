# Milestone 08 — FTS Search, Native Round-Trip, Job SSE, Backup v2

Status: **Complete** (2026-08-11)  
Depends on: Milestone 07  
API version: **0.8.0**

## Delivered

1. **Message-body FTS search** — `messages_content_fts_idx` GIN index; `searchConversations()` matches title ILIKE + `plainto_tsquery` on message content; results include `matchSource`
2. **Native tool round-trip** — `ToolTranscriptTurn` + `buildOpenAiToolMessages` / `buildAnthropicToolMessages`; agent keeps transcript across rounds and feeds tool results back to provider
3. **Job SSE progress stream** — `GET /jobs/:id/stream` emits status events until `completed`/`failed`
4. **Backup v2** — export includes `approvals` + `jobs` (last 200); restore supports `restoreApprovals` / `restoreJobs`

## Acceptance

- [x] Conversation search finds matches in message bodies (FTS)
- [x] Agent reports `nativeRounds` when native multi-hop runs
- [x] Job stream delivers SSE status updates
- [x] Backup export returns `version: 2`

## Run

```bash
pnpm install
pnpm dev
```

## Next (Milestone 09 candidates)

- WebSocket job channel (optional upgrade from SSE)
- Conversation export per workspace
- Provider streaming with interleaved tool calls
- Encrypted backup bundle
