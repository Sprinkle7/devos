# Milestone 68 — Zone Live, Aria-Pressed, Throttle Aria, Sync Live

Status: **Complete** (2026-08-16)  
Depends on: Milestone 67  
API version: **0.68.0**

## Delivered

1. **Dry-run undo urgency zone live region** — crossing red/amber/normal thresholds announces **Undo urgency changed to …**
2. **Rotation audit legend toggle aria-pressed** — Show/Hide button sets `aria-pressed` when legend expanded
3. **Merge preview scrub throttle aria values** — during drag, bar `valuemin`/`valuemax`/`valuenow` reflect throttle ms range
4. **Hash snooze prefix sync toast aria-live** — sync confirmation mirrored in polite live region

## Acceptance

- [x] Undo urgency zone changes announce in live region
- [x] Legend toggle exposes aria-pressed when expanded
- [x] Scroll bar throttle ms mapped to aria-valuemin/max/now during scrub
- [x] Prefix helper sync toast uses aria-live polite region
- [x] API health reports `0.68.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 69 candidates)

- Dry-run undo urgency zone change visual flash
- Rotation audit legend toggle aria-pressed only when expanded (not Hide state)
- Merge preview scrub throttle aria flips back on mouseup
- Hash snooze prefix sync toast stacks if clicked rapidly
