# Milestone 72 — Flash Tooltip, Escape Toggle, Scrub Start, Overflow Dedupe

Status: **Complete** (2026-08-16)  
Depends on: Milestone 71  
API version: **0.72.0**

## Delivered

1. **Dry-run undo urgency flash duration in badge tooltip** — tooltip lists per-zone flash ms (900/750/600)
2. **Rotation audit legend mixed Escape-only toggle** — checkbox persists preference; when on, pill focus keeps mixed until Escape
3. **Merge preview scrub throttle announce on drag start** — live region announces min/max throttle aria mode at scrub start
4. **Hash snooze prefix sync overflow toast dedupe** — overflow toast suppressed if another shown within 1s

## Acceptance

- [x] Urgency badge tooltip includes flash duration per zone
- [x] Escape-only toggle controls whether pill focus clears mixed
- [x] Scrub start announces throttle min/max in live region
- [x] Rapid overflow events dedupe within 1 second
- [x] API health reports `0.72.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 73 candidates)

- Dry-run undo urgency flash duration badge when actively flashing
- Rotation audit legend Escape-only toggle aria-describedby on legend toggle
- Merge preview scrub start throttle live region aria-atomic off
- Hash snooze prefix sync overflow dedupe badge when suppressed
