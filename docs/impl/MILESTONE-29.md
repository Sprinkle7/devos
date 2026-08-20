# Milestone 29 — Expandable Dry-Run JSON, History Retention, Merge Rows, Hash Index

Status: **Complete** (2026-08-15)  
Depends on: Milestone 28  
API version: **0.29.0**

## Delivered

1. **Expandable dry-run JSON in hub** — notifications with `dryRunDetail` have Show/Hide JSON toggle
2. **Rotation history retention policy** — `rotationHistoryMaxCount` / `rotationHistoryMaxAgeDays` + trim endpoint
3. **Merge preview row-level diff** — merge preview returns `diffRows[]` (limit 30 in hub)
4. **Dead-letter hash index file** — `~/.devaios/template-webhook-dead-letter-hashes.json` for fast dedupe

## Acceptance

- [x] Hub expands dry-run detail as formatted JSON
- [x] Rotation history trimmed by retention policy on append and via POST trim
- [x] Merge preview lists row-level actions in hub
- [x] Hash index persisted and synced on dead-letter save; `/health` reports hash count
- [x] API health reports `0.29.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version, deliveryLog, deadLetterHashes}'

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotation-history/rotate | jq .

curl -s http://127.0.0.1:8787/job-templates/notifications/webhook/dead-letter/hash-index | jq .

DIFF="$HOME/.devaios/exports/archive-import-diff-a.json"
curl -s -X POST http://127.0.0.1:8787/import/conversations/archive/from-diff/merge/preview \
  -H 'Content-Type: application/json' \
  -d "{\"diffPaths\":[\"$DIFF\",\"$DIFF\"],\"rowLimit\":10}" | jq '.preview.diffRows | length'
```

## Next (Milestone 30 candidates)

- Dry-run detail export to JSON file
- Rotation history chart in hub
- Merge preview row selection before write
- Hash index rebuild admin endpoint
