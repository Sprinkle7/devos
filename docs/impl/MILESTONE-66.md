# Milestone 66 — Urgency Tooltip, Aria-Expanded, Throttle Max, Helper Sync

Status: **Complete** (2026-08-16)  
Depends on: Milestone 65  
API version: **0.66.0**

## Delivered

1. **Dry-run undo urgency badge tooltip** — hover shows zone thresholds (red ≤20%, amber ≤40%, normal >40%)
2. **Rotation audit legend toggle aria-expanded** — Show/Hide button exposes `aria-expanded` + `aria-controls` on legend region
3. **Merge preview scrub throttle max label** — idle scroll row shows **throttle min 120ms · max 420ms**
4. **Hash snooze prefix helper sync** — Sync helper panels button applies current panel visibility to both panels

## Acceptance

- [x] Urgency badge has threshold tooltip
- [x] Legend toggle has aria-expanded and aria-controls
- [x] Idle scrub row shows min and max throttle
- [x] Sync helper panels updates both Health and Run notifications
- [x] API health reports `0.66.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 67 candidates)

- Dry-run undo urgency badge aria-label mirrors tooltip
- Rotation audit legend region aria-labelledby on toggle
- Merge preview scrub throttle range aria-valuetext on bar
- Hash snooze prefix helper sync confirms with toast
