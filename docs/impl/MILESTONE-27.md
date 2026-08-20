# Milestone 27 — Health Metrics, Dry-Run Notifications, Merge Guard, Dead-Letter Import

Status: **Complete** (2026-08-15)  
Depends on: Milestone 26  
API version: **0.27.0**

## Delivered

1. **Delivery log rotation metrics in health** — `/health` includes `deliveryLog` entry count, last/next rotation
2. **Batch-restore dry-run in notifications** — template runner stores `dryRunSummary`; notifications include preview totals
3. **Archive diff merge archive-path guard** — rejects mixed `archivePath` unless `allowMixedArchives: true` (409 conflict)
4. **Dead-letter import/replay** — `POST .../import` and `POST .../import-replay` from exported JSON file

## Acceptance

- [x] Health panel shows delivery log metrics
- [x] Batch-restore with dry-run includes summary in template notifications
- [x] Diff merge returns 409 when archive paths differ (unless allowed)
- [x] Dead-letter export JSON can be imported and replayed
- [x] Hub UI updated for import/replay and merge guard toggle
- [x] API health reports `0.27.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version, deliveryLog}'

EXPORT="$HOME/.devaios/exports/webhook-dead-letter-....json"
curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/webhook/dead-letter/import \
  -H 'Content-Type: application/json' \
  -d "{\"path\":\"$EXPORT\"}" | jq .

curl -s -X POST http://127.0.0.1:8787/import/conversations/archive/from-diff/merge \
  -H 'Content-Type: application/json' \
  -d '{"diffPaths":["/path/a.json","/path/b.json"]}' | jq .
```

## Next (Milestone 28 candidates)

- Template notification dry-run detail panel in hub
- Delivery log rotation history file
- Archive diff merge preview before write
- Dead-letter import dedupe by payload hash
