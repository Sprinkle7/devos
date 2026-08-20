# Milestone 26 — Scheduled Log Rotation, Template Dry-Run, Diff Merge, Dead-Letter Export

Status: **Complete** (2026-08-15)  
Depends on: Milestone 25  
API version: **0.26.0**

## Delivered

1. **Scheduled delivery log rotation** — job template runner tick calls `maybeRotateEmailDeliveryLogOnTick` (24h default interval)
2. **Batch-restore template dry-run** — job template field `dryRunBeforeApply`; runner previews before apply when enabled
3. **Archive diff merge** — `POST /import/conversations/archive/from-diff/merge` merges 2+ diff JSON files by row id
4. **Webhook dead-letter export** — `POST .../webhook/dead-letter/export` writes JSON to `~/.devaios/exports/`

## Acceptance

- [x] Template runner tick rotates delivery log when interval elapsed
- [x] `batch_restore` template with `dryRunBeforeApply` previews before restore
- [x] Diff merge combines rows (last id wins) into merged export file
- [x] Dead-letter export supports all entries or selected ids
- [x] Hub UI updated for merge, export, dry-run toggle
- [x] API health reports `0.26.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq .version

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotate-on-tick | jq .

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/webhook/dead-letter/export \
  -H 'Content-Type: application/json' \
  -d '{"limit":10}' | jq .

DIFF1="$HOME/.devaios/exports/archive-import-diff-a.json"
DIFF2="$HOME/.devaios/exports/archive-import-diff-b.json"
curl -s -X POST http://127.0.0.1:8787/import/conversations/archive/from-diff/merge \
  -H 'Content-Type: application/json' \
  -d "{\"diffPaths\":[\"$DIFF1\",\"$DIFF2\"]}" | jq .
```

## Next (Milestone 27 candidates)

- Delivery log rotation metrics in hub health panel
- Batch-restore dry-run summary in template run notifications
- Archive diff merge conflict when archive paths differ
- Dead-letter import/replay from exported JSON file
