# Milestone 06 — Smarter Tools, Resume, Governance, Keychain Secrets

Status: **Complete** (2026-08-11)  
Depends on: Milestone 05  
API version: **0.6.0**

## Delivered

1. **Smarter tool selection** — relevance-scored MCP catalog (top 12) pinned into CCE; model uses ` ```tool ` JSON blocks; offline fallback only maps to allowed catalog entries
2. **Conversation resume** — `conversationId` loads prior messages into agent context; hub UI picker + message preview
3. **Governance gates** — destructive tool name heuristics block MCP `callTool` unless `approveDestructive: true` (API + agent + UI checkbox)
4. **Keychain secrets option** — macOS Keychain backend via `DEVAIO_SECRETS_BACKEND=keychain` (file backend remains default)

## Acceptance

- [x] Tool catalog ranked by message relevance (`selectedTools` in agent response)
- [x] Resume conversation continues with prior messages in context pack
- [x] Destructive tool call returns 403 / `governance_blocked` without approval
- [x] Secrets API reports `backend` + `keychainAvailable`
- [x] Web UI: conversation picker, approve destructive, secrets backend hint

## Run

```bash
pnpm install
pnpm dev

# Optional macOS Keychain backend
export DEVAIO_SECRETS_BACKEND=keychain
```

## Next (Milestone 07 candidates)

- Structured tool-calling via provider native APIs (not fenced JSON)
- HITL inbox for pending destructive approvals
- Conversation title auto-update + search
- Background jobs for long Graphify builds
