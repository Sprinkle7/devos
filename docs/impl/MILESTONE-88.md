# Milestone 88 — Border Visible, Hover Title, Flash Assertive, Atomic Restore

Status: **Complete** (2026-08-16)  
Depends on: Milestone 87  
API version: **0.88.0**

## Delivered

1. **Dry-run undo flash border opacity in visible badge text** — duration badge display includes `border α0.XX` via shared title/display label
2. **Rotation audit legend clear pulse hover badge title mirrors aria-label** — hover badge `title` reads `live clear countdown paused/resumed`
3. **Merge preview scrub debounce atomic flash pulse aria-live assertive** — post-scrub atomic flash pulse uses `aria-live="assertive"`
4. **Hash snooze prefix sync dedupe fade phase aria-atomic restore on complete** — fade completion announces `dedupe badge aria-atomic restored` via hidden live region

## Acceptance

- [x] Flash duration badge visible text includes border opacity alpha
- [x] Legend hover badge title mirrors aria-label state
- [x] Debounce atomic flash pulse uses aria-live assertive
- [x] Dedupe fade completion announces aria-atomic restore
- [x] API health reports `0.88.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 89 candidates)

- Dry-run undo flash border opacity badge pulse scale with duration
- Rotation audit legend clear pulse hover badge visible text mirrors aria-label
- Merge preview scrub debounce atomic flash pulse aria-atomic off during flash
- Hash snooze prefix sync dedupe atomic restore announcement aria-live assertive
