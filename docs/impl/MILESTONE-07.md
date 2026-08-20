# Milestone 07 — Native Tools, HITL Inbox, Conversation Search, Async Jobs

Status: **Complete** (2026-08-11)  
Depends on: Milestone 06  
API version: **0.7.0**

## Delivered

1. **Native provider tool-calling** — OpenAI / Anthropic `tools` API via `chatWithTools`; agent reports `toolMode: native|fenced|offline`
2. **HITL approvals inbox** — `approval_requests` table; blocked destructive tools queue pending approvals; approve/reject endpoints + UI
3. **Conversation search + auto-title** — `GET /workspaces/:slug/conversations?q=`; titles refined via `deriveConversationTitle`
4. **Async Graphify jobs** — `POST /graphify/build/async` + `GET /jobs/:id` with background spawn

## Acceptance

- [x] `chatWithTools` maps MCP catalog to provider-native tool IDs
- [x] Governance block creates pending approval (agent returns `pendingApprovals`)
- [x] Approve/reject updates inbox; approved tools pass governance on retry
- [x] Conversation search filters by title
- [x] Async job completes with status in DB

## Run

```bash
pnpm install
pnpm dev
```

## Next (Milestone 08 candidates)

- Full message-body conversation search (FTS)
- Provider tool round-trip with tool result messages (multi-hop native)
- WebSocket job progress stream
- Backup bundle includes approvals + job history
