# Milestone 78 — Zone Uppercase, Clear Countdown, Scrub Hint, Dedupe Fade

Status: **Complete** (2026-08-16)  
Depends on: Milestone 77  
API version: **0.78.0**

## Delivered

1. **Dry-run undo flash zone uppercase** — badge label uses uppercase zone (`RED flash 900ms`, etc.)
2. **Rotation audit legend live clear countdown badge** — `live clear Ns` badge counts down 3→1 after Escape-only toggle
3. **Merge preview scrub debounce hint while scrubbing** — atomic restore debounce label only shown during active scrub
4. **Hash snooze prefix sync dedupe badge fade** — 300ms fade-out when title clears before badge unmounts

## Acceptance

- [x] Flash duration badge zone is uppercase
- [x] Legend live clear countdown badge ticks during 3s window
- [x] Scroll debounce hint hidden unless scrubbing
- [x] Dedupe badge fades out on hide
- [x] API health reports `0.78.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 79 candidates)

- Dry-run undo flash zone badge color matches urgency color
- Rotation audit legend live clear countdown aria-live polite
- Merge preview scrub debounce hint pulses while scrubbing
- Hash snooze prefix sync dedupe fade duration label in badge
