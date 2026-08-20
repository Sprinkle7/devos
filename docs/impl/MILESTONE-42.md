# Milestone 42 — Limit Reset, Defaults Match, Import Preview, Snooze Resume

Status: **Complete** (2026-08-16)  
Depends on: Milestone 41  
API version: **0.42.0**

## Delivered

1. **Dry-run clear resets export limit** — **Clear filters** also restores export limit to default `50` and clears limit localStorage
2. **Rotation audit defaults match indicator** — GET retention returns `matchesDefaults`; hub shows **matches defaults** badge when policy equals defaults
3. **Merge profile import preview** — preview merge/replace before apply; file picker loads JSON into preview textarea
4. **Hash snooze auto-resume alert** — when snooze expires, hub shows resume notice and re-evaluates hash tick alert via refresh

## Acceptance

- [x] Clear filters resets export limit to 50
- [x] Audit retention panel indicates when saved policy matches defaults
- [x] Merge import shows preview with profile names/count before apply
- [x] Expired hash snooze surfaces resume notice and restores alerts
- [x] API health reports `0.42.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'

curl -s http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/retention | jq '{policy,defaults,matchesDefaults}'
```

## Next (Milestone 43 candidates)

- Dry-run clear also resets export badge
- Rotation audit match indicator updates live while editing
- Merge import preview diff for overwritten profile names
- Hash snooze resume dismiss button
