# Milestone 69 — Zone Flash, Pressed Omit, Aria Flip, Sync Stack

Status: **Complete** (2026-08-16)  
Depends on: Milestone 68  
API version: **0.69.0**

## Delivered

1. **Dry-run undo urgency zone flash** — badge animates on zone threshold crossing (600ms)
2. **Rotation audit legend aria-pressed omit** — `aria-pressed` only when legend expanded (omitted on Show)
3. **Merge preview scrub aria flip** — throttle aria values tied to scrubbing active; flip back on mouseup
4. **Hash snooze prefix sync toast stack** — rapid Sync clicks stack toasts (each expires 3s)

## Acceptance

- [x] Urgency badge flashes on zone change
- [x] Legend toggle omits aria-pressed when collapsed
- [x] Scroll bar aria returns to scroll percent on mouseup
- [x] Multiple sync toasts stack without replacing prior
- [x] API health reports `0.69.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 70 candidates)

- Dry-run undo urgency flash color matches zone
- Rotation audit legend toggle aria-pressed="mixed" when partial
- Merge preview scrub aria flip announces in live region
- Hash snooze prefix sync stack max depth badge
