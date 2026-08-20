# Milestone 35 — Badge Preview, Audit CSV, Merge Presets, Hash Tick Alerts

Status: **Complete** (2026-08-15)  
Depends on: Milestone 34  
API version: **0.35.0**

## Delivered

1. **Dry-run export badge live preview** — hub dashed preview pill from current filters; `POST .../dry-run/preview-filters` API
2. **Rotation audit CSV export** — `POST .../repair/audit/export` writes `email-rotation-repair-audit-*.csv`
3. **Merge preview action filter presets** — hub insert+replace / all actions / clear filters buttons
4. **Hash tick failure alert in hub** — health refresh surfaces error banner when `tickCheck.lastOk` is false

## Acceptance

- [x] Dry-run filter badge preview updates live before export
- [x] Rotation repair audit exports CSV with repairedAt/repaired/ok columns
- [x] Merge filter presets set checkbox state for common combinations
- [x] Hub shows hash tick failure alert in health + notifications sections
- [x] API health reports `0.35.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version, deadLetterHashes}'

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/dry-run/preview-filters \
  -H 'Content-Type: application/json' \
  -d '{"presetRange":"7d","workspaceSlug":"demo"}' | jq .

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/export \
  -H 'Content-Type: application/json' -d '{}' | jq .
```

## Next (Milestone 36 candidates)

- Dry-run preview filter count before export
- Rotation audit retention policy
- Merge preset save to localStorage
- Hash tick alert dismiss + snooze
