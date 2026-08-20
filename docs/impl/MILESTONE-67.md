# Milestone 67 — Badge Aria, Labelledby, Valuetext, Sync Toast

Status: **Complete** (2026-08-16)  
Depends on: Milestone 66  
API version: **0.67.0**

## Delivered

1. **Dry-run undo urgency badge aria-label** — badge `aria-label` mirrors zone threshold tooltip for screen readers
2. **Rotation audit legend aria-labelledby** — legend region labelled by Show/Hide toast legend toggle
3. **Merge preview scrub throttle aria-valuetext** — scroll bar valuetext includes throttle range or live ms during drag
4. **Hash snooze prefix helper sync toast** — Sync helper panels shows transient confirmation toast (3s)

## Acceptance

- [x] Urgency badge aria-label matches tooltip thresholds
- [x] Legend region uses aria-labelledby on toggle id
- [x] Scroll bar aria-valuetext includes throttle info
- [x] Sync helper panels shows confirmation toast
- [x] API health reports `0.67.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 68 candidates)

- Dry-run undo urgency badge live region on zone change
- Rotation audit legend toggle aria-pressed when expanded
- Merge preview scrub throttle aria-valuemin/max on bar
- Hash snooze prefix sync toast aria-live polite
