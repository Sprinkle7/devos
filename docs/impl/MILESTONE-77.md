# Milestone 77 — Zone Label, Clear Cancel, Scroll Hint, Title Clear

Status: **Complete** (2026-08-16)  
Depends on: Milestone 76  
API version: **0.77.0**

## Delivered

1. **Dry-run undo flash duration badge zone label** — visible/`aria-label`/`title` text includes zone (`red flash 900ms`, etc.)
2. **Rotation audit legend live clear cancel on re-toggle** — generation ref cancels stale 3s clear timers on rapid toggle
3. **Merge preview scrub debounce in scroll hint** — visible scroll line includes `atomic restore debounce 16ms`
4. **Hash snooze prefix sync dedupe title clear on hide** — separate title state cleared before badge unmounts

## Acceptance

- [x] Flash duration badge shows zone name in label
- [x] Rapid Escape-only re-toggle resets 3s live clear timer
- [x] Scroll hint shows atomic restore debounce label
- [x] Dedupe badge title clears when badge hides
- [x] API health reports `0.77.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 78 candidates)

- Dry-run undo flash zone label uppercase in badge
- Rotation audit legend live clear timer badge countdown
- Merge preview scrub debounce hint only while scrubbing
- Hash snooze prefix sync dedupe badge fade on title clear
