# Milestone 39 — Limit Persistence, Audit Diff, File Import, Snooze Clear

Status: **Complete** (2026-08-15)  
Depends on: Milestone 38  
API version: **0.39.0**

## Delivered

1. **Dry-run export limit localStorage** — hub persists selected export limit across reloads (`devaios-dry-run-export-limit`)
2. **Rotation audit retention save diff** — POST retention returns `previous` + `changed`; hub shows diff on save and unsaved preview
3. **Merge profile file picker import** — hub file inputs for merge or replace import from JSON file
4. **Hash snooze clear** — health panel **Clear snooze** removes localStorage snooze and expiry display

## Acceptance

- [x] Dry-run export limit survives page reload via localStorage
- [x] Saving audit retention reports field-level diff from previous policy
- [x] Merge profiles importable from `.json` file picker
- [x] Hash snooze can be cleared from health panel
- [x] API health reports `0.39.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/retention \
  -H 'Content-Type: application/json' -d '{"maxCount":150}' \
  | jq '{policy,previous,changed}'
```

## Next (Milestone 40 candidates)

- Dry-run filter preset persistence in localStorage
- Rotation audit retention reset to defaults button
- Merge profile export filename from profile name
- Hash snooze remaining time countdown in health
