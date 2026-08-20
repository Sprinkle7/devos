# Milestone 71 — Flash Duration Zone, Mixed Clears, Throttle Announce, Overflow Toast

Status: **Complete** (2026-08-16)  
Depends on: Milestone 70  
API version: **0.71.0**

## Delivered

1. **Dry-run undo urgency flash duration scales with zone** — red 900ms · amber 750ms · normal 600ms (timeout + CSS + inline animationDuration)
2. **Rotation audit legend mixed clears on pill focus** — arrow hint cleared when legend pill receives focus (keyboard or click)
3. **Merge preview scrub aria flip throttle announce** — drag-end live region includes last throttle ms before aria percent flip
4. **Hash snooze prefix sync stack overflow toast** — amber toast when stack at max and oldest entry is dropped

## Acceptance

- [x] Red zone flash lasts longer than amber/normal
- [x] Legend toggle returns to aria-pressed true after pill focus clears mixed
- [x] Scrub finish message includes last throttle ms
- [x] Overflow toast appears when stack capped at 5
- [x] API health reports `0.71.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 72 candidates)

- Dry-run undo urgency flash duration label in badge tooltip
- Rotation audit legend mixed clears on Escape only option toggle
- Merge preview scrub throttle announce min/max on drag start
- Hash snooze prefix sync overflow toast dedupe within 1s
