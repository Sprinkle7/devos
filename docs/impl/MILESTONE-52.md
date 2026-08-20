# Milestone 52 — Clear Confirm, Toast Legend, Scroll Jump, Escape Dismiss

Status: **Complete** (2026-08-16)  
Depends on: Milestone 51  
API version: **0.52.0**

## Delivered

1. **Dry-run bridge clear confirm** — **Clear bridge** prompts before removing session bridge
2. **Rotation audit toast legend** — inline **unchanged / single / multi** color key next to save controls
3. **Merge preview scroll click-to-jump** — click progress bar to jump JSON preview scroll position
4. **Hash snooze Escape dismiss** — **Escape** key dismisses resume notice (alongside outside-click)

## Acceptance

- [x] Dev bridge clear requires confirmation dialog
- [x] Audit retention section shows toast color legend
- [x] Merge JSON preview progress bar supports click-to-jump scrolling
- [x] Snooze resume notice dismisses on Escape key
- [x] API health reports `0.52.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 53 candidates)

- Dry-run bridge install/clear undo toast
- Rotation audit legend collapsible hint
- Merge preview scroll bar drag scrubbing
- Hash snooze notice focus trap for accessibility
