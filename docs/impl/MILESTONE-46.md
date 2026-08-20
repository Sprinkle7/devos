# Milestone 46 — Open Path Hint, Save Ready, Preview Memory, Snooze Timestamp

Status: **Complete** (2026-08-16)  
Depends on: Milestone 45  
API version: **0.46.0**

## Delivered

1. **Dry-run export open path hint** — platform-aware shell command (`open -R` on macOS, `xdg-open` elsewhere) with **Copy open cmd** button and muted hint line
2. **Rotation audit save-ready badge** — green **save ready** pill when draft differs from saved baseline (Save button still disabled until changed)
3. **Merge import preview collapse memory** — expanded/collapsed state persisted in `localStorage` (`devaios-merge-profiles-preview-expanded`)
4. **Hash snooze resume timestamp** — resume notice shows ISO time when snooze expired; cleared on dismiss or when integrity alert returns

## Acceptance

- [x] Dry-run export shows Finder/shell open hint and copy-open-command button after export
- [x] Audit retention shows **save ready** badge when draft has unsaved changes
- [x] Merge JSON preview expand/collapse survives page refresh
- [x] Snooze resume notice includes expiry timestamp
- [x] API health reports `0.46.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 47 candidates)

- Dry-run export reveal-in-finder one-click (Electron/Tauri bridge stub)
- Rotation audit save keyboard shortcut hint
- Merge import preview scroll position memory
- Hash snooze resume notice relative time ("2m ago")
