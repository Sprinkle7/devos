# Milestone 44 — Export Path Clear, Defaults Mismatch Hint, JSON Preview, Resume Auto-Dismiss

Status: **Complete** (2026-08-16)  
Depends on: Milestone 43  
API version: **0.44.0**

## Delivered

1. **Dry-run clear resets export output** — **Clear filters** also clears last export path/output line
2. **Rotation audit draft vs saved defaults hint** — hub shows when draft matches defaults but saved differs (and vice versa)
3. **Merge import JSON pretty-print panel** — preview shows formatted `{ profiles: ... }` result in scrollable `<pre>`
4. **Hash snooze resume auto-dismiss on refresh** — health **Refresh** clears snooze-expired notice

## Acceptance

- [x] Clear filters removes dry-run export output path message
- [x] Audit retention panel shows draft/saved defaults mismatch hint
- [x] Merge import preview includes pretty-printed JSON panel
- [x] Refresh dismisses hash snooze resume notice
- [x] API health reports `0.44.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 45 candidates)

- Dry-run export copies path to clipboard
- Rotation audit save disabled until draft differs from saved
- Merge import preview collapsible panel
- Hash snooze resume notice persists until alert re-shown
