# Milestone 41 — Filter Clear, Defaults Badge, Export Toggle, Snooze in Notifications

Status: **Complete** (2026-08-16)  
Depends on: Milestone 40  
API version: **0.41.0**

## Delivered

1. **Dry-run filter clear/reset** — hub **Clear filters** resets preset/template/dates/workspace toggle and clears localStorage
2. **Rotation audit defaults badge** — retention panel shows dashed defaults badge from API `defaults`
3. **Merge profile export all vs selected** — checkbox toggles export selected profile only or all profiles
4. **Hash snooze countdown in notifications** — run notifications section mirrors health snooze status + clear

## Acceptance

- [x] Dry-run filters can be cleared in one click and localStorage entry removed
- [x] Rotation audit retention panel shows API defaults badge alongside current policy
- [x] Merge export toggle switches between selected profile and all profiles
- [x] Notifications section shows hash snooze until + remaining countdown
- [x] API health reports `0.41.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'

curl -s http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/retention | jq '{policy,defaults}'
```

## Next (Milestone 42 candidates)

- Dry-run filter reset also clears export limit to default
- Rotation audit defaults match indicator when policy equals defaults
- Merge profile import preview before apply
- Hash snooze auto-resume alert when countdown expires
