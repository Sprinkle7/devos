# Milestone 94 — Pulse Pause, Hover Assertive, Restore Assertive, Hidden Atomic Off

Status: **Complete** (2026-08-16)  
Depends on: Milestone 93  
API version: **0.94.0**

## Delivered

1. **Dry-run undo flash border pulse pause announce on mouse enter** — hidden `aria-live` region announces "border pulse paused" when duration badge hover starts
2. **Rotation audit legend clear pulse hover badge aria-live assertive on paused state** — hover badge uses explicit `aria-live="assertive"` when state is `paused`
3. **Merge preview scrub debounce atomic restore phase aria-live assertive** — post-flash restore phase uses `aria-live="assertive"` (was polite in M93)
4. **Hash snooze prefix sync dedupe atomic restore hidden region aria-atomic off** — hidden assertive live region uses `aria-atomic={false}`

## Acceptance

- [x] Flash duration badge announces border pulse pause on mouse enter
- [x] Legend hover badge uses aria-live assertive when paused
- [x] Debounce atomic restore phase uses aria-live assertive
- [x] Dedupe atomic restore hidden region uses aria-atomic off
- [x] API health reports `0.94.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 95 candidates)

- Dry-run undo flash border pulse pause/resume badge visible label
- Rotation audit legend clear pulse hover badge aria-live polite on resumed only
- Merge preview scrub debounce atomic restore phase aria-atomic restore
- Hash snooze prefix sync dedupe atomic restore hidden region aria-live polite
