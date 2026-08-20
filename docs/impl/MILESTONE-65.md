# Milestone 65 — Urgency Badge, Escape Focus, Throttle Live, Helper Per Panel

Status: **Complete** (2026-08-16)  
Depends on: Milestone 64  
API version: **0.65.0**

## Delivered

1. **Dry-run undo urgency zone badge** — toast row pill shows **red**, **amber**, or **normal**
2. **Rotation audit Escape return focus** — clearing arrow hint returns focus to Show/Hide toast legend button
3. **Merge preview scrub throttle live** — scroll row shows current **throttle Nms** during drag scrub
4. **Hash snooze prefix helper per panel** — Health and Run notifications panels persist helper collapse separately

## Acceptance

- [x] Undo toast row displays urgency zone badge
- [x] Escape on legend clears hint and focuses legend toggle
- [x] Scrub drag updates throttle ms label dynamically
- [x] Prefix helper collapse independent per panel
- [x] API health reports `0.65.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 66 candidates)

- Dry-run undo urgency badge tooltip with zone thresholds
- Rotation audit legend toggle aria-expanded
- Merge preview scrub throttle max label when idle
- Hash snooze prefix helper collapse sync button
