# Milestone 38 — Limit Presets, Audit Badge, Profile JSON, Snooze Until

Status: **Complete** (2026-08-15)  
Depends on: Milestone 37  
API version: **0.38.0**

## Delivered

1. **Dry-run export limit presets** — API exposes `limitPresets: [25, 50, 100]`; hub quick buttons set export limit
2. **Rotation audit retention badge on trim** — trim output and panel show policy badge (`keep N · max age Nd`)
3. **Merge profile export/import JSON** — hub export download + paste import (merge or replace)
4. **Hash snooze-until in health** — health panel shows snooze expiry timestamp from localStorage

## Acceptance

- [x] Dry-run hub offers 25/50/100 limit preset buttons synced with API
- [x] Rotation audit trim output includes retention policy badge
- [x] Merge profiles export to JSON and import from pasted JSON
- [x] Health panel shows hash alert snooze-until when active
- [x] API health reports `0.38.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/dry-run/preview-filters \
  -H 'Content-Type: application/json' \
  -d '{"presetRange":"7d","limit":25}' \
  | jq '{exportLimit,limitPresets,truncated}'

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/rotate \
  -H 'Content-Type: application/json' -d '{}' | jq '{deleted,kept,policy}'
```

## Next (Milestone 39 candidates)

- Dry-run limit preset persistence in localStorage
- Rotation audit retention policy diff on save
- Merge profile import from file picker
- Hash snooze clear button in health panel
