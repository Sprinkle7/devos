# Milestone 28 — Dry-Run Detail Panel, Rotation History, Merge Preview, Hash Dedupe

Status: **Complete** (2026-08-15)  
Depends on: Milestone 27  
API version: **0.28.0**

## Delivered

1. **Template notification dry-run detail panel** — notifications carry `dryRunDetail` (backup path, ws/proj totals); hub renders detail block
2. **Delivery log rotation history** — `~/.devaios/email-delivery-rotation-history.json` + `GET .../rotation-history`
3. **Archive diff merge preview** — `POST .../from-diff/merge/preview` returns row totals before write
4. **Dead-letter import hash dedupe** — import skips duplicate payload hashes (reports `skippedDuplicateHashes`)

## Acceptance

- [x] Batch-restore dry-run stores structured detail in notifications
- [x] Rotations append to history file (manual + tick triggers)
- [x] Merge preview returns totals without writing merged file
- [x] Dead-letter import dedupes by payload SHA-256 hash
- [x] Hub UI: dry-run detail, rotation history, merge preview, hash skip counts
- [x] API health reports `0.28.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version, deliveryLog}'

curl -s "http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotation-history?limit=5" | jq .

curl -s -X POST http://127.0.0.1:8787/import/conversations/archive/from-diff/merge/preview \
  -H 'Content-Type: application/json' \
  -d '{"diffPaths":["/path/a.json","/path/b.json"]}' | jq '.preview.totals'

EXPORT="$HOME/.devaios/exports/webhook-dead-letter-....json"
curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/webhook/dead-letter/import \
  -H 'Content-Type: application/json' \
  -d "{\"path\":\"$EXPORT\"}" | jq .
```

## Next (Milestone 29 candidates)

- Dry-run detail expandable JSON in hub
- Rotation history retention policy
- Merge preview row-level diff in hub
- Dead-letter hash index persisted for faster dedupe
