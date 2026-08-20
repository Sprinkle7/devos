# Milestone 83 — Tint Label, Pulse Resume, Atomic Off, Title Badge

Status: **Complete** (2026-08-16)  
Depends on: Milestone 82  
API version: **0.83.0**

## Delivered

1. **Dry-run undo flash tint opacity label in badge tooltip** — duration badge `title` includes `tint α0.XX` from zone-scaled opacity helper
2. **Rotation audit legend clear pulse resume announce on mouse leave** — hidden `aria-live` region announces "live clear countdown resumed" when hover ends
3. **Merge preview scrub debounce live region aria-atomic off during scrub** — debounce pulse span uses `aria-atomic={false}` while scrubbing
4. **Hash snooze prefix sync dedupe title clear phase duration badge** — 16ms title-clear phase with visible badge suffix before fade

## Acceptance

- [x] Flash duration badge tooltip shows tint opacity alpha
- [x] Legend countdown pulse resume announced on mouse leave
- [x] Debounce pulse uses aria-atomic off during scrub
- [x] Dedupe badge shows title clear duration phase
- [x] API health reports `0.83.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 84 candidates)

- Dry-run undo flash tint opacity in aria-label (not just title)
- Rotation audit legend clear pulse pause announce on mouse enter
- Merge preview scrub debounce pulse aria-atomic restore on scrub end
- Hash snooze prefix sync dedupe title clear phase aria-live polite
