# Milestone 45 — Copy Path, Save Gate, Collapsible Preview, Snooze Until Alert

Status: **Complete** (2026-08-16)  
Depends on: Milestone 44  
API version: **0.45.0**

## Delivered

1. **Dry-run export copy path** — **Copy path** button copies last export file path to clipboard
2. **Rotation audit save gate** — **Save audit retention** disabled until draft differs from saved baseline
3. **Merge import collapsible JSON preview** — **Show/Hide JSON preview** toggle for import preview panel
4. **Hash snooze resume until alert re-shown** — resume notice persists on refresh; clears when integrity alert returns (or manual dismiss)

## Acceptance

- [x] Dry-run export offers clipboard copy of last export path
- [x] Audit retention save button disabled when no changes from saved policy
- [x] Merge import JSON preview can be collapsed/expanded
- [x] Snooze resume notice no longer cleared by refresh alone
- [x] API health reports `0.45.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 46 candidates)

- Dry-run export open path in finder (platform hint)
- Rotation audit save enabled indicator when draft changed
- Merge import preview remember collapsed state in localStorage
- Hash snooze resume notice timestamp
