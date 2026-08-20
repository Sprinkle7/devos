# Milestone 96 — Pulse Hover Polite, Legend Atomic Off Paused, Restore Polite, Hidden Atomic Restore

Status: **Complete** (2026-08-16)  
Depends on: Milestone 95  
API version: **0.96.0**

## Delivered

1. **Dry-run undo flash border pulse hover badge aria-live polite on resumed only** — hover state badge uses explicit `aria-live="polite"` only when state is `resumed` (assertive when paused)
2. **Rotation audit legend clear pulse hover badge aria-atomic off on paused** — hover badge uses explicit `aria-atomic={false}` when state is `paused`
3. **Merge preview scrub debounce atomic restore phase aria-live polite** — post-flash restore phase uses `aria-live="polite"` (was assertive in M94/M95)
4. **Hash snooze prefix sync dedupe atomic restore hidden region aria-atomic restore** — hidden live region uses `aria-atomic={true}` (was off in M95)

## Acceptance

- [x] Border pulse hover badge uses aria-live polite only when resumed
- [x] Legend hover badge uses aria-atomic off when paused
- [x] Debounce atomic restore phase uses aria-live polite
- [x] Dedupe atomic restore hidden region uses aria-atomic restore
- [x] API health reports `0.96.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 97 candidates)

- Dry-run undo flash border pulse hover badge aria-atomic off on paused
- Rotation audit legend clear pulse hover badge aria-live assertive on paused only
- Merge preview scrub debounce atomic restore phase aria-atomic off
- Hash snooze prefix sync dedupe atomic restore visible badge aria-atomic restore
