# Milestone 85 — Visible Tint, Hover Badge, Atomic Flash, Title Atomic Off

Status: **Complete** (2026-08-16)  
Depends on: Milestone 84  
API version: **0.85.0**

## Delivered

1. **Dry-run undo flash tint opacity in visible badge text** — duration badge renders `tint α0.XX` in visible label (not just aria/title)
2. **Rotation audit legend clear pulse hover state badge** — visible `paused` / `resumed` badge appears on countdown hover
3. **Merge preview scrub debounce pulse brief aria-atomic true flash on scrub end** — 16ms post-scrub flash with `aria-atomic={true}` and restore label
4. **Hash snooze prefix sync dedupe title clear phase aria-atomic off** — title-clear badge suffix includes `atomic off` with `aria-atomic={false}`

## Acceptance

- [x] Flash duration badge visible text includes tint opacity alpha
- [x] Legend countdown hover shows paused/resumed state badge
- [x] Debounce pulse briefly flashes aria-atomic true after scrub end
- [x] Dedupe title-clear phase shows atomic off in badge and aria-atomic false
- [x] API health reports `0.85.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 86 candidates)

- Dry-run undo flash tint opacity badge border opacity scale
- Rotation audit legend clear pulse hover badge aria-live polite
- Merge preview scrub debounce atomic flash duration in finish announce
- Hash snooze prefix sync dedupe fade phase aria-atomic off
