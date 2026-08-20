# Milestone 12 — Failover Probe, Slug Remap, Retention, Archive Schedule

Status: **Complete** (2026-08-11)  
Depends on: Milestone 11  
API version: **0.12.0**

## Delivered

1. **Failover UI reorder + live probe** — `POST /providers/failover/probe` tests each provider in chain; web UI ↑↓ reorder + save
2. **Archive import with slug remap** — `slugMap` on `POST /import/conversations/archive` maps archive slugs to local workspace slugs
3. **Backup retention / rotation** — policy in `~/.devaios/backup-retention.json`; auto-rotate after export; `GET/POST /backup/retention`, `POST /backup/retention/rotate`
4. **Scheduled conversation archive export** — `~/.devaios/archive-export-schedule.json`; `GET/POST /export/conversations/archive/schedule`; async `POST /export/conversations/archive/async`

## Acceptance

- [x] Failover probe returns per-provider status + latency
- [x] Slug remap imports into remapped workspace
- [x] Backup export returns rotation summary `{ deleted, kept }`
- [x] Archive schedule persists and runs on API boot when enabled
- [x] Async archive export job kind `archive-export`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq .version

curl -s -X POST http://127.0.0.1:8787/providers/failover/probe | jq .

curl -s -X POST http://127.0.0.1:8787/backup/retention \
  -H 'Content-Type: application/json' \
  -d '{"maxCount":10,"maxAgeDays":14}'

curl -s -X POST http://127.0.0.1:8787/backup/export \
  -H 'Content-Type: application/json' -d '{}' | jq '{path, rotation}'

curl -s -X POST http://127.0.0.1:8787/import/conversations/archive \
  -H 'Content-Type: application/json' \
  -d '{"path":"/path/to/archive.json","slugMap":{"old-slug":"demo"}}'

curl -s -X POST http://127.0.0.1:8787/export/conversations/archive/schedule \
  -H 'Content-Type: application/json' \
  -d '{"enabled":true,"intervalMinutes":10080}'
```

## Next (Milestone 13 candidates)

- Export retention for conversation archives
- Failover drag-and-drop UI polish
- Backup restore dry-run preview
- Workspace clone (export + import slug remap one-shot)
