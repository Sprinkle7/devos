# Milestone 90 — Pulse Label, Hover Atomic Off, Atomic Restore, Restore Badge

Status: **Complete** (2026-08-16)  
Depends on: Milestone 89  
API version: **0.90.0**

## Delivered

1. **Dry-run undo flash border pulse duration label in badge tooltip** — duration badge `title` includes `pulse N.Ns` from border pulse scale
2. **Rotation audit legend clear pulse hover badge aria-atomic off** — hover state badge uses `aria-atomic={false}`
3. **Merge preview scrub debounce atomic flash pulse aria-atomic restore after flash** — post-flash restored phase briefly uses `aria-atomic={true}` with restore label
4. **Hash snooze prefix sync dedupe atomic restore announcement duration badge** — visible `atomic restore 3s` badge plus assertive live announce with duration

## Acceptance

- [x] Flash duration badge tooltip includes border pulse duration seconds
- [x] Legend hover badge uses aria-atomic off
- [x] Debounce atomic flash restores aria-atomic true after flash phase
- [x] Dedupe atomic restore shows duration badge and assertive announce
- [x] API health reports `0.90.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 91 candidates)

- Dry-run undo flash border pulse duration in visible badge text
- Rotation audit legend clear pulse hover badge aria-live assertive
- Merge preview scrub debounce atomic restore phase aria-live polite
- Hash snooze prefix sync dedupe atomic restore badge aria-label with duration
