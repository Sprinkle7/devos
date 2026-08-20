# Milestone 91 — Pulse Visible, Hover Assertive, Restore Polite, Restore Aria-Label

Status: **Complete** (2026-08-16)  
Depends on: Milestone 90  
API version: **0.91.0**

## Delivered

1. **Dry-run undo flash border pulse duration in visible badge text** — duration badge visible label includes `pulse N.Ns` via dedicated visible label helper
2. **Rotation audit legend clear pulse hover badge aria-live assertive** — hover state badge uses `aria-live="assertive"`
3. **Merge preview scrub debounce atomic restore phase aria-live polite** — post-flash restored phase uses `aria-live="polite"` (flash stays assertive)
4. **Hash snooze prefix sync dedupe atomic restore badge aria-label with duration** — restore badge `aria-label` mirrors full announce text with duration

## Acceptance

- [x] Flash duration badge visible text includes border pulse duration
- [x] Legend hover badge uses aria-live assertive
- [x] Debounce atomic restore phase uses aria-live polite
- [x] Dedupe atomic restore badge aria-label includes duration
- [x] API health reports `0.91.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 92 candidates)

- Dry-run undo flash border pulse duration badge animation pause on hover
- Rotation audit legend clear pulse hover badge aria-atomic restore on mouse leave
- Merge preview scrub debounce atomic restore phase aria-atomic off
- Hash snooze prefix sync dedupe atomic restore badge aria-live polite
