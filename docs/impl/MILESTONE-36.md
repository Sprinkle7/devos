# Milestone 36 — Preview Count, Audit Retention, Merge localStorage, Alert Snooze

Status: **Complete** (2026-08-15)  
Depends on: Milestone 35  
API version: **0.36.0**

## Delivered

1. **Dry-run preview filter count** — `preview-filters` returns `matchCount`; hub shows live match count in preview badge
2. **Rotation audit retention policy** — audit retention file + trim on append + `POST .../audit/rotate` and retention GET/POST
3. **Merge preset save to localStorage** — hub Save preset / Load preset for merge action filters
4. **Hash tick alert dismiss + snooze** — Dismiss (session) and Snooze 1h (localStorage) on hash tick failure banner

## Acceptance

- [x] Dry-run preview reports matching notification count before export
- [x] Rotation repair audit trimmed by maxCount/maxAgeDays policy
- [x] Merge action filter preset persists in browser localStorage
- [x] Hash tick alert can be dismissed or snoozed for 1 hour
- [x] API health reports `0.36.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/dry-run/preview-filters \
  -H 'Content-Type: application/json' -d '{"presetRange":"7d","workspaceSlug":"demo"}' | jq '{matchCount,badge}'

curl -s http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/retention | jq .

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/rotate | jq .
```

## Next (Milestone 37 candidates)

- Dry-run preview export limit hint (matchCount vs cap)
- Rotation audit retention in hub settings panel
- Merge preset named profiles
- Hash snooze duration picker
