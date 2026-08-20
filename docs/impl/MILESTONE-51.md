# Milestone 51 — Install Confirm, Toast Colors, Scroll Bar, Outside Dismiss

Status: **Complete** (2026-08-16)  
Depends on: Milestone 50  
API version: **0.51.0**

## Delivered

1. **Dry-run bridge install confirm** — **Install dev bridge** prompts before registering session bridge (auto-restore on refresh still silent)
2. **Rotation audit toast colors** — toast border color by change type: gray **unchanged**, amber **single field**, green **both fields**
3. **Merge preview scroll progress bar** — thin progress bar under scroll indicator reflects scroll position (0–100%)
4. **Hash snooze outside dismiss** — clicking outside the resume notice dismisses it (same as **Dismiss** button)

## Acceptance

- [x] Dev bridge install requires confirmation dialog
- [x] Audit save toast color reflects number of changed retention fields
- [x] Merge JSON preview shows visual scroll progress bar
- [x] Snooze resume notice dismisses on outside click
- [x] API health reports `0.51.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 52 candidates)

- Dry-run bridge clear confirmation dialog
- Rotation audit toast legend for color meanings
- Merge preview scroll bar click-to-jump
- Hash snooze notice escape key dismiss
