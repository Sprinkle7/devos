# Milestone 75 — Aria-Label, Toggle Live, Debounce, Dedupe Live

Status: **Complete** (2026-08-16)  
Depends on: Milestone 74  
API version: **0.75.0**

## Delivered

1. **Dry-run undo flash duration badge aria-label** — `aria-label` mirrors visible live text (`flash Nms`)
2. **Rotation audit legend state live on toggle only** — separate live region announces enabled/disabled only when checkbox changes
3. **Merge preview scrub atomic restore debounce 16ms** — finish announce deferred 16ms after scrub ends (was microtask)
4. **Hash snooze prefix sync dedupe badge aria-live polite** — dedupe badge uses `aria-live="polite"`

## Acceptance

- [x] Flash duration badge aria-label matches visible text
- [x] Escape-only live region silent until toggle changes
- [x] Scrub finish uses 16ms debounce before atomic restore announce
- [x] Dedupe badge has aria-live polite
- [x] API health reports `0.75.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 76 candidates)

- Dry-run undo flash duration badge title mirrors aria-label
- Rotation audit legend toggle live clears after 3s
- Merge preview scrub atomic restore debounce label in finish announce
- Hash snooze prefix sync dedupe badge aria-label mirrors text
