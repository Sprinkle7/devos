# Milestone 87 — Border Label, Hover Aria-Label, Flash Text, Fade Assertive

Status: **Complete** (2026-08-16)  
Depends on: Milestone 86  
API version: **0.87.0**

## Delivered

1. **Dry-run undo flash border opacity label in badge tooltip** — duration badge `title`/`aria-label` includes `border α0.XX` alongside tint alpha
2. **Rotation audit legend clear pulse hover badge aria-label with state** — hover badge `aria-label` reads `live clear countdown paused/resumed`
3. **Merge preview scrub debounce atomic flash label in visible pulse text** — post-scrub pulse shows `debounce pulse atomic flash 16ms · aria-atomic restored`
4. **Hash snooze prefix sync dedupe fade phase aria-live assertive** — fade phase uses `aria-live="assertive"` (title-clear stays polite)

## Acceptance

- [x] Flash duration badge tooltip includes border opacity alpha
- [x] Legend hover badge aria-label includes countdown state
- [x] Debounce atomic flash label visible in post-scrub pulse text
- [x] Dedupe fade phase uses aria-live assertive
- [x] API health reports `0.87.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 88 candidates)

- Dry-run undo flash border opacity in visible badge text
- Rotation audit legend clear pulse hover badge title mirrors aria-label
- Merge preview scrub debounce atomic flash pulse aria-live assertive
- Hash snooze prefix sync dedupe fade phase aria-atomic restore on complete
