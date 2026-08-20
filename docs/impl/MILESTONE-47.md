# Milestone 47 — Reveal Stub, Save Shortcut, Scroll Memory, Relative Time

Status: **Complete** (2026-08-16)  
Depends on: Milestone 46  
API version: **0.47.0**

## Delivered

1. **Dry-run reveal-in-Finder stub** — **Reveal in Finder** button calls `window.devaios.revealInFinder(path)` when a native bridge exists; otherwise shows Electron/Tauri stub message and falls back to copy-open-cmd workflow
2. **Rotation audit save shortcut** — **⌘S / Ctrl+S** saves audit retention when draft differs from baseline; hint shown next to **save ready** badge
3. **Merge import preview scroll memory** — JSON preview panel scroll position persisted in `localStorage` (`devaios-merge-profiles-preview-scroll`)
4. **Hash snooze resume relative time** — resume notice shows relative expiry (`2m ago`) with ISO timestamp on hover; refreshes every 30s

## Acceptance

- [x] Dry-run export offers one-click reveal stub with bridge hook + fallback message
- [x] Audit retention saves via keyboard shortcut when draft changed
- [x] Merge JSON preview scroll position survives refresh
- [x] Snooze resume notice shows human-readable relative time
- [x] API health reports `0.47.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 48 candidates)

- Dry-run reveal bridge dev console helper (`window.devaios = { revealInFinder: ... }`)
- Rotation audit save toast on keyboard shortcut
- Merge import preview scroll reset button
- Hash snooze relative time live seconds ticker
