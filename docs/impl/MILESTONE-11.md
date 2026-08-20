# Milestone 11 — Scheduled Backups, Archive Import, Failover, Merge

Status: **Complete** (2026-08-11)  
Depends on: Milestone 10  
API version: **0.11.0**

## Delivered

1. **Scheduled backup jobs** — interval schedule in `~/.devaios/backup-schedule.json`; `GET/POST /backup/schedule`; async export via `POST /backup/export/async` (job kind `backup-export`)
2. **Archive import** — `POST /import/conversations/archive` imports multi-workspace archive into matching slugs
3. **Provider failover chain** — configurable order at `~/.devaios/providers/failover.json`; `GET/PUT /providers/failover`; `chat()` and `chatWithTools()` try providers in order and return `attemptedProviders`
4. **Conversation merge/dedupe** — import option `dedupeByTitle`; `POST /workspaces/:slug/conversations/merge-duplicates` merges same-title threads

## Acceptance

- [x] Async backup returns job with kind `backup-export`
- [x] Schedule config persists and arms interval on API boot
- [x] Archive import maps workspaces by slug
- [x] Failover order configurable and honored
- [x] Merge duplicates collapses same-title conversations

## Run

```bash
pnpm install
pnpm dev

# Async backup
curl -s -X POST http://127.0.0.1:8787/backup/export/async \
  -H 'Content-Type: application/json' \
  -d '{"sign":true}' | jq .

# Enable daily scheduled backup
curl -s -X POST http://127.0.0.1:8787/backup/schedule \
  -H 'Content-Type: application/json' \
  -d '{"enabled":true,"intervalMinutes":1440,"sign":true}'

# Import archive
curl -s -X POST http://127.0.0.1:8787/import/conversations/archive \
  -H 'Content-Type: application/json' \
  -d '{"path":"/Users/you/.devaios/exports/conversations-archive-....json","dedupeByTitle":true}'

# Provider failover
curl -s http://127.0.0.1:8787/providers/failover | jq .
curl -s -X PUT http://127.0.0.1:8787/providers/failover \
  -H 'Content-Type: application/json' \
  -d '{"order":["ollama","openai","anthropic"]}'

# Merge duplicate titles
curl -s -X POST http://127.0.0.1:8787/workspaces/demo/conversations/merge-duplicates
```

## Next (Milestone 12 candidates)

- Failover UI reorder + live probe
- Archive import with slug remap
- Backup retention / rotation
- Scheduled conversation archive export
