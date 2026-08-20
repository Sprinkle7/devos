# Milestone 74 — Flash Live, State Describedby, Atomic Restore, Dedupe Clear

Status: **Complete** (2026-08-16)  
Depends on: Milestone 73  
API version: **0.74.0**

## Delivered

1. **Dry-run undo flash duration badge aria-live polite** — duration badge uses `aria-live="polite"` for screen reader announce on flash
2. **Rotation audit legend describedby includes checkbox state live** — toggle references help + live state region (`enabled`/`disabled`)
3. **Merge preview scrub finish restores aria-atomic** — finish announce deferred via microtask after scrub ends; message includes aria-atomic restored
4. **Hash snooze prefix sync dedupe badge clears on overflow** — successful overflow toast clears `overflow deduped` badge

## Acceptance

- [x] Flash duration badge has aria-live polite
- [x] Legend toggle describedby includes live Escape-only state
- [x] Scrub finish announces aria-atomic restored after scrub ends
- [x] Dedupe badge clears when overflow toast shows
- [x] API health reports `0.74.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 75 candidates)

- Dry-run undo flash duration badge aria-label mirrors live text
- Rotation audit legend state live announces on toggle change only
- Merge preview scrub atomic restore debounce 16ms
- Hash snooze prefix sync overflow dedupe badge aria-live polite
