# Milestone 70 — Flash Color Zone, Pressed Mixed, Aria Announce, Stack Depth

Status: **Complete** (2026-08-16)  
Depends on: Milestone 69  
API version: **0.70.0**

## Delivered

1. **Dry-run undo urgency flash color matches zone** — red/amber/normal CSS flash classes tied to zone on threshold crossing
2. **Rotation audit legend aria-pressed mixed** — `aria-pressed="mixed"` when legend expanded with arrow hint active
3. **Merge preview scrub aria flip live announce** — finish message includes scroll bar aria return to percent mode
4. **Hash snooze prefix sync stack max depth badge** — `stack N/5` badge; stack capped at 5 toasts

## Acceptance

- [x] Urgency badge flash color matches red/amber/normal zone
- [x] Legend toggle reports mixed when arrow hint partial state
- [x] Scrub finish announces aria flip in live region
- [x] Sync stack shows depth badge and respects max 5
- [x] API health reports `0.70.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 71 candidates)

- Dry-run undo urgency flash duration scales with zone severity
- Rotation audit legend mixed clears on pill focus
- Merge preview scrub aria flip announces throttle ms on drag end
- Hash snooze prefix sync stack overflow toast when capped
