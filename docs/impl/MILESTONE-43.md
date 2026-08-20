# Milestone 43 — Badge Clear, Live Defaults Match, Overwrite Diff, Resume Dismiss

Status: **Complete** (2026-08-16)  
Depends on: Milestone 42  
API version: **0.43.0**

## Delivered

1. **Dry-run clear resets export badge** — **Clear filters** also clears the last exported filter badge pill
2. **Rotation audit live defaults match** — **matches defaults** badge updates from current input values while editing
3. **Merge import overwrite diff** — import preview lists overwritten and new profile names on merge
4. **Hash snooze resume dismiss** — **Dismiss** button on snooze-expired notice in health + notifications

## Acceptance

- [x] Clear filters removes dry-run export badge
- [x] Audit retention defaults match indicator reflects draft form values live
- [x] Merge import preview shows overwrite/new profile name diff
- [x] Snooze resume notice can be dismissed without re-snoozing
- [x] API health reports `0.43.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'

curl -s http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/retention | jq '{matchesDefaults}'
```

## Next (Milestone 44 candidates)

- Dry-run clear also clears last export output path
- Rotation audit draft vs saved defaults mismatch hint
- Merge import preview JSON pretty-print panel
- Hash snooze resume notice auto-dismiss after refresh
