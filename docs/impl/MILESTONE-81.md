# Milestone 81 — Zone Tint, Clear Pulse, Pulse Label, Atomic Off

Status: **Complete** (2026-08-16)  
Depends on: Milestone 80  
API version: **0.81.0**

## Delivered

1. **Dry-run undo flash zone badge background tint** — zone-tinted background (red/amber/muted rgba)
2. **Rotation audit legend live clear countdown pulse** — amber badge pulses on 1s animation ticks while counting down
3. **Merge preview scrub debounce pulse label duration** — scrub hint includes `· pulse N.Ns` from throttle-scaled duration
4. **Hash snooze prefix sync dedupe fade aria-atomic off** — `aria-atomic={false}` while fading (fade label parts announced separately)

## Acceptance

- [x] Flash duration badge has zone background tint
- [x] Legend live clear countdown badge pulses each second
- [x] Debounce pulse label includes duration seconds
- [x] Dedupe fade uses aria-atomic off when fading
- [x] API health reports `0.81.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 82 candidates)

- Dry-run undo flash zone badge tint opacity scales with flash duration
- Rotation audit legend live clear pulse pauses on hover
- Merge preview scrub debounce pulse label aria-live polite
- Hash snooze prefix sync dedupe fade atomic off only during title clear phase
