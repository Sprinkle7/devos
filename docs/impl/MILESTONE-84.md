# Milestone 84 — Tint Aria-Label, Pulse Pause, Atomic Restore, Title Live

Status: **Complete** (2026-08-16)  
Depends on: Milestone 83  
API version: **0.84.0**

## Delivered

1. **Dry-run undo flash tint opacity in aria-label** — flash duration badge `aria-label` mirrors tooltip with `tint α0.XX`
2. **Rotation audit legend clear pulse pause announce on mouse enter** — hidden `aria-live` region announces "live clear countdown paused" on hover
3. **Merge preview scrub debounce pulse aria-atomic restore on scrub end** — scrub finish announcement includes "debounce pulse aria-atomic restored"
4. **Hash snooze prefix sync dedupe title clear phase aria-live polite** — dedupe badge uses `aria-live="polite"` during title-clear phase

## Acceptance

- [x] Flash duration badge aria-label includes tint opacity alpha
- [x] Legend countdown pulse pause announced on mouse enter
- [x] Scrub finish announces debounce pulse atomic restore
- [x] Dedupe badge aria-live polite during title clear
- [x] API health reports `0.84.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 85 candidates)

- Dry-run undo flash tint opacity in visible badge text (not just aria/title)
- Rotation audit legend clear pulse hover state badge (paused/resumed)
- Merge preview scrub debounce pulse brief aria-atomic true flash on scrub end
- Hash snooze prefix sync dedupe title clear phase aria-atomic off
