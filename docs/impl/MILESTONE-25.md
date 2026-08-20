# Milestone 25 — Delivery Log Retention, Batch Dry-Run, Dead-Letter Delete, Diff Selection Save

Status: **Complete** (2026-08-13)  
Depends on: Milestone 24  
API version: **0.25.0**

## Delivered

1. **Delivery log retention + filter** — filter by `channel`/`status`; retention policy + `POST .../delivery-log/rotate`
2. **Batch-restore dry-run preview** — `POST /backup/restore/batch/preview` previews latest scoped backups without apply
3. **Webhook dead-letter delete** — `POST .../webhook/dead-letter/delete` with `ids[]` or `all`
4. **Archive diff selection persisted** — export honors `selectedDiffIds`; `POST .../from-diff/save-selection` writes row flags to diff JSON

## Acceptance

- [x] Delivery log list supports channel/status filters
- [x] Delivery log rotate enforces max count + max age
- [x] Batch restore preview returns per-workspace conflict totals
- [x] Dead letters can be deleted without replay
- [x] Archive diff export + save-selection persist row selection
- [x] Hub UI updated for all four features
- [x] API health reports `0.25.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq .version

curl -s "http://127.0.0.1:8787/job-templates/notifications/email/delivery-log?channel=smtp&status=failed&limit=5" | jq .

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotate \
  -H 'Content-Type: application/json' \
  -d '{}' | jq .

curl -s -X POST http://127.0.0.1:8787/backup/restore/batch/preview \
  -H 'Content-Type: application/json' \
  -d '{"workspaceSlugs":["demo"],"conflictPolicy":"skip"}' | jq .

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/webhook/dead-letter/delete \
  -H 'Content-Type: application/json' \
  -d '{"ids":["some-id"]}' | jq .
```

## Next (Milestone 26 candidates)

- Scheduled delivery log rotation on template runner tick
- Batch-restore template dry-run in job template runner before apply
- Archive diff merge from multiple diff files
- Webhook dead-letter export JSON
