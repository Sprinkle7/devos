# Milestone 61 — Pulse Scale, Arrow Hint, Nudge Percent, Prefix Always On

Status: **Complete** (2026-08-16)  
Depends on: Milestone 60  
API version: **0.61.0**

## Delivered

1. **Dry-run undo ring pulse speed scale** — animation duration shrinks as remaining percent drops (faster near expiry)
2. **Rotation audit legend arrow hint** — container ←/→ shows transient **badge n/3 · ←/→** toast
3. **Merge preview keyboard nudge percent** — arrow/page/home/end scroll announce includes `(N%)`
4. **Hash snooze resume prefix always visible** — toggle moved to snooze panel (always rendered in Health + Run notifications)

## Acceptance

- [x] Undo ring pulse accelerates as undo window shrinks
- [x] Legend container arrow keys show transient badge hint
- [x] Keyboard scroll nudge live region includes percent
- [x] Resume prefix toggle visible even when snooze inactive
- [x] API health reports `0.61.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 62 candidates)

- Dry-run undo ring pulse duration label in toast row
- Rotation audit legend arrow hint aria-live
- Merge preview drag scrub announce includes percent
- Hash snooze prefix toggle helper tooltip
