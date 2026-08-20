# Milestone 40 — Filter Persistence, Audit Reset, Profile Naming, Snooze Countdown

Status: **Complete** (2026-08-16)  
Depends on: Milestone 39  
API version: **0.40.0**

## Delivered

1. **Dry-run filter preset persistence** — hub saves preset/template/date/workspace filter toggles to localStorage (`devaios-dry-run-export-filters`)
2. **Rotation audit retention reset to defaults** — `POST .../audit/retention/reset` restores `maxCount: 200` / `maxAgeDays: 365`; GET includes `defaults`
3. **Merge profile export filename from profile name** — selected profile exports as `devaios-merge-profile-{name}.json` (single profile payload)
4. **Hash snooze remaining countdown** — health panel shows live remaining time (refreshes every 30s)

## Acceptance

- [x] Dry-run filter controls survive page reload via localStorage
- [x] Hub resets rotation audit retention to API defaults with diff output
- [x] Named merge profile export uses profile slug in filename
- [x] Health shows hash snooze remaining countdown while active
- [x] API health reports `0.40.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'

curl -s http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/retention | jq '{policy,defaults}'

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/retention/reset \
  -H 'Content-Type: application/json' -d '{}' | jq '{policy,previous,changed}'
```

## Next (Milestone 41 candidates)

- Dry-run filter clear/reset button
- Rotation audit defaults badge in retention panel
- Merge profile export all vs selected toggle
- Hash snooze countdown in notifications section too
