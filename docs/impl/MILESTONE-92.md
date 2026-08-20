# Milestone 92 — Pulse Hover Pause, Hover Atomic Restore, Restore Atomic Off, Restore Polite

Status: **Complete** (2026-08-16)  
Depends on: Milestone 91  
API version: **0.92.0**

## Delivered

1. **Dry-run undo flash border pulse duration badge animation pause on hover** — CSS `animation-play-state: paused` on duration badge hover
2. **Rotation audit legend clear pulse hover badge aria-atomic restore on mouse leave** — hover badge `aria-atomic={true}` when state is `resumed`
3. **Merge preview scrub debounce atomic restore phase aria-atomic off** — debounce pulse span uses `aria-atomic={false}` during restore phase
4. **Hash snooze prefix sync dedupe atomic restore badge aria-live polite** — visible restore badge uses `aria-live="polite"`

## Acceptance

- [x] Flash duration badge border pulse pauses on hover
- [x] Legend hover badge restores aria-atomic on mouse leave (resumed state)
- [x] Debounce atomic restore phase uses aria-atomic off
- [x] Dedupe atomic restore badge uses aria-live polite
- [x] API health reports `0.92.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 93 candidates)

- Dry-run undo flash border pulse resume announce on mouse leave
- Rotation audit legend clear pulse hover badge aria-live polite on resumed state
- Merge preview scrub debounce atomic restore phase duration in label
- Hash snooze prefix sync dedupe atomic restore badge aria-atomic off
