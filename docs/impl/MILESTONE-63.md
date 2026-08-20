# Milestone 63 — Ring Aria, Hint Persist, Throttle Scale, Prefix Describedby

Status: **Complete** (2026-08-16)  
Depends on: Milestone 62  
API version: **0.63.0**

## Delivered

1. **Dry-run undo ring pulse aria-label** — progress SVG exposes seconds, percent, and pulse duration to assistive tech
2. **Rotation audit legend arrow hint persist** — badge hint stays until next ←/→ or legend collapsed (no auto-timeout)
3. **Merge preview scrub throttle scale** — drag announce interval shrinks as scroll distance since last announce grows
4. **Hash snooze prefix aria-describedby** — visible helper text linked to toggle (Health + Run notifications)

## Acceptance

- [x] Undo ring SVG aria-label includes pulse duration when pulsing
- [x] Legend arrow hint persists across keypresses until collapse
- [x] Scrub drag throttle adapts to scroll distance (120–420ms)
- [x] Resume prefix toggle has aria-describedby helper copy
- [x] API health reports `0.63.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 64 candidates)

- Dry-run undo ring aria-label includes urgency zone name
- Rotation audit legend arrow hint clear on Escape
- Merge preview scrub throttle minimum label in dev row
- Hash snooze prefix helper collapsible
