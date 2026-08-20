# Milestone 62 — Pulse Label, Arrow Live, Scrub Drag Percent, Prefix Tooltip

Status: **Complete** (2026-08-16)  
Depends on: Milestone 61  
API version: **0.62.0**

## Delivered

1. **Dry-run undo ring pulse duration label** — toast row shows **pulse 0.8s** (etc.) while ring is pulsing
2. **Rotation audit legend arrow aria-live** — container ←/→ updates hidden live region **Legend badge moved to n of 3**
3. **Merge preview drag scrub percent** — throttled scrub announce uses **scrubbing at … (N%)** wording
4. **Hash snooze prefix toggle tooltip** — hover title explains resume prefix behavior

## Acceptance

- [x] Undo toast row shows pulse duration label when pulsing
- [x] Legend arrow keys announce badge move in aria-live region
- [x] Drag scrub live region includes percent with scrubbing prefix
- [x] Resume prefix toggle has helper tooltip
- [x] API health reports `0.62.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 63 candidates)

- Dry-run undo ring pulse duration in aria-label
- Rotation audit legend arrow hint persists until next keypress
- Merge preview scrub drag announce throttle scales with scroll distance
- Hash snooze prefix toggle aria-describedby helper text
