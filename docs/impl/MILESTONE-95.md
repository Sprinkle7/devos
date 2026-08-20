# Milestone 95 — Pulse Pause Badge, Hover Polite Resumed, Restore Atomic Restore, Hidden Polite

Status: **Complete** (2026-08-16)  
Depends on: Milestone 94  
API version: **0.95.0**

## Delivered

1. **Dry-run undo flash border pulse pause/resume badge visible label** — visible hover state badge shows `border pulse paused` / `border pulse resumed` for 3s after mouse enter/leave
2. **Rotation audit legend clear pulse hover badge aria-live polite on resumed only** — hover badge uses explicit `aria-live="polite"` only when state is `resumed` (assertive when paused)
3. **Merge preview scrub debounce atomic restore phase aria-atomic restore** — restore phase uses `aria-atomic={true}` (was off in M94)
4. **Hash snooze prefix sync dedupe atomic restore hidden region aria-live polite** — hidden live region uses `aria-live="polite"` (was assertive in M94)

## Acceptance

- [x] Flash duration badge shows visible border pulse pause/resume label on hover
- [x] Legend hover badge uses aria-live polite only when resumed
- [x] Debounce atomic restore phase uses aria-atomic restore
- [x] Dedupe atomic restore hidden region uses aria-live polite
- [x] API health reports `0.95.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 96 candidates)

- Dry-run undo flash border pulse hover badge aria-live polite on resumed only
- Rotation audit legend clear pulse hover badge aria-atomic off on paused
- Merge preview scrub debounce atomic restore phase aria-live polite
- Hash snooze prefix sync dedupe atomic restore hidden region aria-atomic restore
