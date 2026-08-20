# Milestone 49 — Session Bridge, Button Toast, Scroll Indicator, Tab Pause

Status: **Complete** (2026-08-16)  
Depends on: Milestone 48  
API version: **0.49.0**

## Delivered

1. **Dry-run reveal bridge session persist** — dev bridge install writes `sessionStorage`; refresh restores bridge automatically (**bridge active · session** badge)
2. **Rotation audit button save toast** — **Save audit retention** shows **saved via button** toast (keyboard still shows **saved via ⌘S / Ctrl+S**)
3. **Merge preview scroll indicator** — live **scroll Npx** label next to **Reset scroll** while JSON preview expanded
4. **Hash snooze ticker tab pause** — relative time ticker pauses when tab hidden; shows **(paused)** suffix; resumes on focus

## Acceptance

- [x] Dev bridge survives page refresh within same browser session
- [x] Audit retention button save shows distinct toast from keyboard save
- [x] Merge JSON preview displays current scroll offset in pixels
- [x] Snooze relative time stops ticking when tab is backgrounded
- [x] API health reports `0.49.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 50 candidates)

- Dry-run reveal bridge clear / uninstall button
- Rotation audit save toast shows diff summary
- Merge preview scroll indicator max scroll height
- Hash snooze paused ticker shows last-updated time
