# Milestone 37 — Export Limit Hint, Audit Retention Panel, Named Profiles, Snooze Picker

Status: **Complete** (2026-08-15)  
Depends on: Milestone 36  
API version: **0.37.0**

## Delivered

1. **Dry-run preview export limit hint** — `preview-filters` and export return `matchCount`, `exportCount`, `exportLimit`, `truncated`; hub shows cap hint and configurable export limit
2. **Rotation audit retention in hub** — load/save panel for audit retention policy (`maxCount` / `maxAgeDays`)
3. **Merge preset named profiles** — localStorage profile map with save/load/delete by name (keeps last-preset shortcut)
4. **Hash snooze duration picker** — 15m / 1h / 4h / 24h snooze selector replaces fixed 1h button

## Acceptance

- [x] Dry-run preview shows match count vs export cap before export
- [x] Hub loads and saves rotation repair audit retention policy
- [x] Merge action filters persist as named localStorage profiles
- [x] Hash tick alert snooze supports selectable duration
- [x] API health reports `0.37.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/dry-run/preview-filters \
  -H 'Content-Type: application/json' \
  -d '{"presetRange":"7d","workspaceSlug":"demo","limit":50}' \
  | jq '{matchCount,exportCount,exportLimit,truncated}'

curl -s http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/retention | jq .

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/dry-run/export \
  -H 'Content-Type: application/json' -d '{"limit":10,"presetRange":"30d"}' | jq '{count,matchCount,truncated}'
```

## Next (Milestone 38 candidates)

- Dry-run export limit presets (25/50/100)
- Rotation audit retention badge in trim output
- Merge profile export/import JSON
- Hash snooze until timestamp display in health panel
