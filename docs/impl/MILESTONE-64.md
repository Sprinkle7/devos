# Milestone 64 — Urgency Aria, Escape Clear, Throttle Label, Helper Collapse

Status: **Complete** (2026-08-16)  
Depends on: Milestone 63  
API version: **0.64.0**

## Delivered

1. **Dry-run undo ring urgency zone aria** — SVG aria-label includes **red urgency**, **amber urgency**, or **normal** zone
2. **Rotation audit legend Escape clear** — Escape on legend container or pill clears persistent arrow hint
3. **Merge preview scrub throttle label** — scroll dev row shows **throttle min 120ms**
4. **Hash snooze prefix helper collapsible** — Show/Hide prefix helper button (persisted); aria-describedby when expanded

## Acceptance

- [x] Undo ring aria-label names urgency zone
- [x] Escape clears legend arrow hint and live announcement
- [x] Merge scroll row displays scrub throttle minimum
- [x] Prefix helper collapses with persisted preference
- [x] API health reports `0.64.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 65 candidates)

- Dry-run undo ring urgency zone badge in toast row
- Rotation audit legend Escape returns focus to Show legend button
- Merge preview scrub throttle current ms label during drag
- Hash snooze prefix helper collapse memory per panel
