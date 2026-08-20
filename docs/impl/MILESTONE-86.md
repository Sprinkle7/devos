# Milestone 86 — Border Opacity, Hover Live, Flash Duration, Fade Atomic Off

Status: **Complete** (2026-08-16)  
Depends on: Milestone 85  
API version: **0.86.0**

## Delivered

1. **Dry-run undo flash tint opacity badge border opacity scale** — border rgba alpha scales with zone flash duration (900ms → stronger border)
2. **Rotation audit legend clear pulse hover badge aria-live polite** — paused/resumed hover state badge uses `aria-live="polite"`
3. **Merge preview scrub debounce atomic flash duration in finish announce** — scrub finish includes `debounce pulse atomic flash 16ms`
4. **Hash snooze prefix sync dedupe fade phase aria-atomic off** — fade badge suffix includes `atomic off` with `aria-atomic={false}`

## Acceptance

- [x] Flash duration badge border opacity scales with zone flash ms
- [x] Legend hover state badge announces via aria-live polite
- [x] Scrub finish announce includes debounce atomic flash duration
- [x] Dedupe fade phase uses aria-atomic off
- [x] API health reports `0.86.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 87 candidates)

- Dry-run undo flash border opacity label in badge tooltip
- Rotation audit legend clear pulse hover badge aria-label with state
- Merge preview scrub debounce atomic flash label in visible pulse text
- Hash snooze prefix sync dedupe fade phase aria-live assertive
