# Milestone 30 — Dry-Run Export, Rotation Chart, Merge Selection, Hash Rebuild

Status: **Complete** (2026-08-15)  
Depends on: Milestone 29  
API version: **0.30.0**

## Delivered

1. **Dry-run detail export to JSON file** — `POST .../notifications/dry-run/export` writes `~/.devaios/exports/template-dry-run-*.json`
2. **Rotation history chart in hub** — bar chart from last 12 rotation history entries (kept + deleted)
3. **Merge preview row selection before write** — hub checkboxes + merge accepts `selectedDiffIds`
4. **Hash index rebuild admin endpoint** — `POST .../dead-letter/hash-index/rebuild` rescans dead letters

## Acceptance

- [x] Hub exports dry-run details to JSON file path
- [x] Rotation history renders as bar chart after Load rotation history
- [x] Merge preview rows selectable; merge writes only selected rows
- [x] Hash index rebuild returns hash/entry counts; health reflects count
- [x] API health reports `0.30.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version, deadLetterHashes}'

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/dry-run/export \
  -H 'Content-Type: application/json' -d '{}' | jq .

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/webhook/dead-letter/hash-index/rebuild | jq .

curl -s http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotation-history?limit=12 | jq '.count'
```

## Next (Milestone 31 candidates)

- Dry-run export filter by workspace/template
- Rotation history CSV export
- Merge preview select-all / clear-all
- Hash index integrity check endpoint
