# Milestone 10 — Import, Archive, Signed Backups, Ollama Tools

Status: **Complete** (2026-08-11)  
Depends on: Milestone 09  
API version: **0.10.0**

## Delivered

1. **Conversation import** — `POST /workspaces/:slug/import/conversations` from file path or inline export JSON; assigns new IDs, skips duplicates by source conversation id
2. **Multi-workspace archive** — `GET /export/conversations/archive?save=1` writes all workspaces to `~/.devaios/exports/conversations-archive-*.json`
3. **Ed25519 signed backups (v4)** — optional `sign: true` on `POST /backup/export`; key at `~/.devaios/keys/backup-signing.json`; verify via `POST /backup/verify`
4. **Ollama native tool calls** — `ProviderRegistry.chatWithTools` and `streamChatWithTools` use Ollama `/api/chat` with OpenAI-style tools when Ollama is enabled

## Acceptance

- [x] Import from export path increases conversation count in target workspace
- [x] Archive export includes all workspaces
- [x] Signed export returns `{ signed: true, version: 4 }`
- [x] Restore rejects tampered signed backup (`signature_invalid`)
- [x] Verify endpoint reports valid/invalid signature
- [x] Ollama `chatWithTools` returns tool calls when model supports tools

## Run

```bash
pnpm install
pnpm dev

# Export signed backup
curl -s -X POST http://127.0.0.1:8787/backup/export \
  -H 'Content-Type: application/json' \
  -d '{"sign":true}'

# Verify signature
curl -s -X POST http://127.0.0.1:8787/backup/verify \
  -H 'Content-Type: application/json' \
  -d '{"path":"/Users/you/.devaios/backups/devaios-backup-....signed.json"}'

# Import conversations
curl -s -X POST http://127.0.0.1:8787/workspaces/demo/import/conversations \
  -H 'Content-Type: application/json' \
  -d '{"path":"/Users/you/.devaios/exports/conversations-demo-....json"}'

# Multi-workspace archive
curl -s 'http://127.0.0.1:8787/export/conversations/archive?save=1'
```

## Next (Milestone 11 candidates)

- Scheduled backup jobs
- Import archive into multiple workspaces
- Provider failover chain
- Conversation merge/dedupe by title
