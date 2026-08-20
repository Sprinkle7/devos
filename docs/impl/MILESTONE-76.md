# Milestone 76 — Title Mirror, Live Clear, Debounce Label, Dedupe Label

Status: **Complete** (2026-08-16)  
Depends on: Milestone 75  
API version: **0.76.0**

## Delivered

1. **Dry-run undo flash duration badge title mirrors aria-label** — `title` matches visible/`aria-label` text (`flash Nms`)
2. **Rotation audit legend toggle live clears after 3s** — Escape-only live announcement auto-clears 3 seconds after toggle
3. **Merge preview scrub atomic restore debounce label** — finish announce includes `atomic restore debounce 16ms`
4. **Hash snooze prefix sync dedupe badge aria-label** — `aria-label` and `title` mirror visible `overflow deduped` text

## Acceptance

- [x] Flash duration badge title matches aria-label
- [x] Legend Escape-only live region clears after 3s
- [x] Scrub finish message includes debounce ms label
- [x] Dedupe badge aria-label mirrors visible text
- [x] API health reports `0.76.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 77 candidates)

- Dry-run undo flash duration badge visible label includes zone name
- Rotation audit legend toggle live clear cancel on rapid re-toggle
- Merge preview scrub debounce label in visible scroll hint
- Hash snooze prefix sync dedupe badge clears title on hide
