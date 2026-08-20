# Milestone 73 — Flash Badge, Describedby, Atomic Off, Dedupe Badge

Status: **Complete** (2026-08-16)  
Depends on: Milestone 72  
API version: **0.73.0**

## Delivered

1. **Dry-run undo urgency flash duration badge** — adjacent `flash Nms` badge while zone flash animation is active
2. **Rotation audit legend Escape-only aria-describedby** — legend toggle references hidden help for mixed-clear Escape-only option
3. **Merge preview scrub start live region aria-atomic off** — `aria-atomic={false}` while scrubbing active (start/drag announcements)
4. **Hash snooze prefix sync overflow dedupe badge** — `overflow deduped` badge when overflow toast suppressed within 1s

## Acceptance

- [x] Flash duration badge appears during active zone flash
- [x] Legend toggle has aria-describedby for Escape-only help
- [x] Merge scroll live region atomic off during scrub
- [x] Dedupe badge shows when overflow toast suppressed
- [x] API health reports `0.73.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 74 candidates)

- Dry-run undo flash duration badge aria-live polite
- Rotation audit legend describedby includes checkbox state live
- Merge preview scrub finish restores aria-atomic true with announce
- Hash snooze prefix sync dedupe badge clears on next successful overflow
