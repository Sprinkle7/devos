# Milestone 54 — Undo Shortcut, Legend Tooltips, Touch Scrub, Return Focus

Status: **Complete** (2026-08-16)  
Depends on: Milestone 53  
API version: **0.54.0**

## Delivered

1. **Dry-run bridge undo shortcut** — **⌘Z / Ctrl+Z** triggers bridge undo while undo toast is visible; hint shown next to **Undo**
2. **Rotation audit legend tooltips** — hover **unchanged / single / multi** pills for field-change descriptions
3. **Merge preview touch scrub** — progress bar supports touch scrubbing (`touchstart` + `touchmove`)
4. **Hash snooze return focus** — dismissing resume notice (button, Escape, outside click) restores focus to pre-notice element

## Acceptance

- [x] Bridge undo toast responds to keyboard shortcut
- [x] Audit toast legend pills show descriptive tooltips on hover
- [x] Merge JSON preview scroll bar scrubs on touch devices
- [x] Snooze notice dismiss returns keyboard focus to prior element
- [x] API health reports `0.54.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 55 candidates)

- Dry-run bridge undo toast persist across navigation
- Rotation audit legend keyboard focus tooltips
- Merge preview scroll bar keyboard nudge (arrow keys)
- Hash snooze notice announce via live region
