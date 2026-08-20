# Milestone 82 — Tint Opacity, Pulse Hover, Debounce Live, Title Atomic

Status: **Complete** (2026-08-16)  
Depends on: Milestone 81  
API version: **0.82.0**

## Delivered

1. **Dry-run undo flash zone tint opacity scales with duration** — background rgba alpha scales with zone flash ms (900→stronger, 600→lighter)
2. **Rotation audit legend live clear pulse pauses on hover** — CSS `animation-play-state: paused` on countdown badge hover
3. **Merge preview scrub debounce pulse label aria-live** — pulsing debounce hint uses `role="status"` + `aria-live="polite"`
4. **Hash snooze prefix sync dedupe title clear atomic off** — `aria-atomic={false}` only during title-clear microtask phase before fade

## Acceptance

- [x] Flash badge tint opacity varies by zone flash duration
- [x] Legend countdown pulse pauses on hover
- [x] Debounce pulse label announces via aria-live polite
- [x] Dedupe atomic off limited to title clear phase
- [x] API health reports `0.82.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 83 candidates)

- Dry-run undo flash tint opacity label in badge tooltip
- Rotation audit legend clear pulse resume announce on mouse leave
- Merge preview scrub debounce live region aria-atomic off during scrub
- Hash snooze prefix sync dedupe title clear phase duration badge
