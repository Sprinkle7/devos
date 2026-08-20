# Milestone 31 — Export Filters, Rotation CSV, Merge Select-All, Hash Integrity

Status: **Complete** (2026-08-15)  
Depends on: Milestone 30  
API version: **0.31.0**

## Delivered

1. **Dry-run export filter by workspace/template** — export accepts `workspaceSlug` and `templateId`; hub filters by current workspace + optional template id
2. **Rotation history CSV export** — `POST .../rotation-history/export` writes `~/.devaios/exports/email-rotation-history-*.csv`
3. **Merge preview select-all / clear-all** — hub buttons before merge row checkboxes
4. **Hash index integrity check** — `GET .../hash-index/integrity` reports missing/orphan counts

## Acceptance

- [x] Dry-run export respects workspace and template filters
- [x] Rotation history exports CSV with rotatedAt/deleted/kept/trigger columns
- [x] Merge preview select-all and clear-all update checkbox state
- [x] Hash integrity endpoint returns `ok` when index matches dead letters
- [x] API health reports `0.31.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/dry-run/export \
  -H 'Content-Type: application/json' \
  -d '{"workspaceSlug":"demo","templateId":"batch_restore"}' | jq .

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotation-history/export \
  -H 'Content-Type: application/json' -d '{}' | jq .

curl -s http://127.0.0.1:8787/job-templates/notifications/webhook/dead-letter/hash-index/integrity | jq .
```

## Next (Milestone 32 candidates)

- Dry-run export date range filter
- Rotation history integrity vs delivery log
- Merge preview invert selection
- Auto-rebuild hash index on integrity failure
