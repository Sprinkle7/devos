# Milestone 09 — Encrypted Backup, Conversation Export, Stream Tools, Job WebSocket

Status: **Complete** (2026-08-11)  
Depends on: Milestone 08  
API version: **0.9.0**

## Delivered

1. **Encrypted backup v3** — optional AES-256-GCM envelope (`.enc.json`); passphrase via body or `DEVAIO_BACKUP_PASSPHRASE`
2. **Per-workspace conversation export** — `GET /workspaces/:slug/export/conversations?save=1` writes JSON to `~/.devaios/exports/`
3. **Streaming tool events** — `POST /agent/chat/stream` with `useTools: true` emits interleaved `tool_call` / `tool_result` SSE events
4. **Job WebSocket** — `ws://127.0.0.1:8787/jobs/:id/ws` for live job status (SSE stream remains available)

## Acceptance

- [x] Encrypted export returns `{ encrypted: true, version: 3 }`
- [x] Restore rejects encrypted backup without passphrase (`passphrase_required`)
- [x] Conversation export includes messages per conversation
- [x] Stream with tools emits tool events before tokens
- [x] WebSocket job channel delivers status until done

## Run

```bash
pnpm install
pnpm dev

# Encrypted backup
curl -s -X POST http://127.0.0.1:8787/backup/export \
  -H 'Content-Type: application/json' \
  -d '{"encrypt":true,"passphrase":"my-secret"}'
```

## Next (Milestone 10 candidates)

- Import conversation export into workspace
- Ollama native tool streaming
- Backup bundle signing (Ed25519)
- Multi-workspace export archive
