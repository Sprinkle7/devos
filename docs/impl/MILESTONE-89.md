# Milestone 89 — Border Pulse, Hover Text, Atomic Off, Restore Assertive

Status: **Complete** (2026-08-16)  
Depends on: Milestone 88  
API version: **0.89.0**

## Delivered

1. **Dry-run undo flash border opacity badge pulse scale with duration** — duration badge border pulse `animationDuration` scales with zone flash ms (0.45–1.35s)
2. **Rotation audit legend clear pulse hover badge visible text mirrors aria-label** — hover badge renders full `live clear countdown paused/resumed` label
3. **Merge preview scrub debounce atomic flash pulse aria-atomic off during flash** — debounce pulse span uses `aria-atomic={false}` during scrub and post-scrub flash
4. **Hash snooze prefix sync dedupe atomic restore announcement aria-live assertive** — fade-complete restore uses `aria-live="assertive"`

## Acceptance

- [x] Flash duration badge border pulse scales with zone flash duration
- [x] Legend hover badge visible text matches aria-label
- [x] Debounce atomic flash pulse uses aria-atomic off
- [x] Dedupe atomic restore announcement uses aria-live assertive
- [x] API health reports `0.89.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 90 candidates)

- Dry-run undo flash border pulse duration label in badge tooltip
- Rotation audit legend clear pulse hover badge aria-atomic off
- Merge preview scrub debounce atomic flash pulse aria-atomic restore after flash
- Hash snooze prefix sync dedupe atomic restore announcement duration badge
