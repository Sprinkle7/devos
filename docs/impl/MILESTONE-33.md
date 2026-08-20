# Milestone 33 — Preset Ranges, Rotation Repair, Merge Filter, Hash Tick Check

Status: **Complete** (2026-08-15)  
Depends on: Milestone 32  
API version: **0.33.0**

## Delivered

1. **Dry-run export preset ranges** — export accepts `presetRange: "24h" | "7d" | "30d"`; hub preset dropdown
2. **Rotation integrity repair** — `POST .../rotation-history/integrity/repair` syncs latest history with delivery log
3. **Merge preview filter by action** — merge preview accepts `actionFilter`; hub action dropdown
4. **Scheduled hash integrity on template tick** — job template runner calls hash check with auto-rebuild each minute

## Acceptance

- [x] Dry-run export preset resolves since/until window
- [x] Rotation repair fixes kept/timestamp mismatch and marks trigger `repair`
- [x] Merge preview filters rows by insert/skip/replace
- [x] Template runner tick runs hash integrity check with auto-rebuild
- [x] API health reports `0.33.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/dry-run/export \
  -H 'Content-Type: application/json' -d '{"presetRange":"7d"}' | jq .

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair | jq .

curl -s -X POST http://127.0.0.1:8787/import/conversations/archive/from-diff/merge/preview \
  -H 'Content-Type: application/json' \
  -d '{"diffPaths":["/path/a.json","/path/b.json"],"actionFilter":"insert","rowLimit":10}' | jq '.preview.diffRows | length'
```

## Next (Milestone 34 candidates)

- Dry-run export combined preset + workspace badge in hub
- Rotation repair audit log file
- Merge preview multi-action filter
- Hash tick check metrics in `/health`
