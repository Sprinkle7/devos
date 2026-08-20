# Milestone 60 — Amber Pulse, Arrow Badge, Scrub Percent, Resume Prefix Toggle

Status: **Complete** (2026-08-16)  
Depends on: Milestone 59  
API version: **0.60.0**

## Delivered

1. **Dry-run undo ring amber pulse** — slower pulse animation when ≤40% remaining (amber zone); fast pulse still at ≤20%
2. **Rotation audit legend arrow badge** — focus legend container and use ←/→ to update **n/3** badge without focusing pills
3. **Merge preview scrub percent summary** — finish announce includes scroll percent `(N%)`
4. **Hash snooze live resume prefix toggle** — checkbox on expired notice toggles **announcements resumed ·** prefix (persisted)

## Acceptance

- [x] Undo ring amber pulse at ≤40%, red fast pulse at ≤20%
- [x] Legend container arrow keys update position badge without pill focus
- [x] Scrub finish summary includes percent
- [x] Resume prefix toggle persisted; debounced resume respects setting
- [x] API health reports `0.60.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 61 candidates)

- Dry-run undo ring pulse speed scales with remaining percent
- Rotation audit legend container arrow hint toast
- Merge preview scrub summary percent in keyboard nudge announce
- Hash snooze live region prefix toggle in snooze panel (always visible)
