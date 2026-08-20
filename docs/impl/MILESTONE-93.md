# Milestone 93 — Pulse Resume, Hover Polite, Restore Duration, Restore Atomic Off

Status: **Complete** (2026-08-16)  
Depends on: Milestone 92  
API version: **0.93.0**

## Delivered

1. **Dry-run undo flash border pulse resume announce on mouse leave** — hidden `aria-live` region announces "border pulse resumed" when duration badge hover ends
2. **Rotation audit legend clear pulse hover badge aria-live polite on resumed state** — hover badge uses `aria-live="polite"` when state is `resumed` (assertive while paused)
3. **Merge preview scrub debounce atomic restore phase duration in label** — restore phase label includes `restore phase 16ms · atomic off`
4. **Hash snooze prefix sync dedupe atomic restore badge aria-atomic off** — visible restore badge uses `aria-atomic={false}`

## Acceptance

- [x] Flash duration badge announces border pulse resume on mouse leave
- [x] Legend hover badge uses aria-live polite when resumed
- [x] Debounce restore phase label includes duration ms
- [x] Dedupe atomic restore badge uses aria-atomic off
- [x] API health reports `0.93.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 94 candidates)

- Dry-run undo flash border pulse pause announce on mouse enter
- Rotation audit legend clear pulse hover badge aria-live assertive on paused state badge
- Merge preview scrub debounce atomic restore phase aria-live assertive
- Hash snooze prefix sync dedupe atomic restore hidden region aria-atomic off
