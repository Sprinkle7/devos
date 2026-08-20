# Milestone 80 — Zone Border, Clear Amber, Pulse Scale, Fade Live

Status: **Complete** (2026-08-16)  
Depends on: Milestone 79  
API version: **0.80.0**

## Delivered

1. **Dry-run undo flash zone badge border color** — border matches zone accent (red/amber/muted)
2. **Rotation audit legend live clear countdown amber** — countdown badge uses amber text and border
3. **Merge preview scrub debounce pulse throttle scale** — pulse `animationDuration` scales with current scrub throttle ms (0.45–1.35s)
4. **Hash snooze prefix sync dedupe fade label aria-live** — `aria-live="polite"` only while fading (fade label announced)

## Acceptance

- [x] Flash duration badge border matches zone color
- [x] Legend live clear countdown badge is amber
- [x] Debounce pulse speed varies with throttle during scrub
- [x] Dedupe fade label uses aria-live polite when fading
- [x] API health reports `0.80.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 81 candidates)

- Dry-run undo flash zone badge background tint matches zone
- Rotation audit legend live clear countdown badge pulses at 1s ticks
- Merge preview scrub debounce pulse label includes duration seconds
- Hash snooze prefix sync dedupe fade live region aria-atomic off
