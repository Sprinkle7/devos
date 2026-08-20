# Milestone 56 — Undo Countdown, Roving Legend, Scroll Aria, Live Relative

Status: **Complete** (2026-08-16)  
Depends on: Milestone 55  
API version: **0.56.0**

## Delivered

1. **Dry-run bridge undo countdown** — undo toast shows remaining seconds (`· 4s`) ticking every 250ms until expiry
2. **Rotation audit roving tabindex** — legend pills use roving `tabIndex`; **←/→** moves focus between unchanged / single / multi
3. **Merge preview scroll aria labels** — progress bar exposes `aria-valuetext` (px scrolled) and `aria-label` documenting Home/End jumps
4. **Hash snooze live region relative time** — `aria-live` announcement includes relative expiry time and updates with ticker

## Acceptance

- [x] Bridge undo toast displays live countdown seconds
- [x] Audit legend supports arrow-key roving focus between pills
- [x] Merge scroll bar documents position and Home/End behavior to assistive tech
- [x] Snooze live region announces notice plus relative time
- [x] API health reports `0.56.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 57 candidates)

- Dry-run bridge undo countdown progress ring
- Rotation audit legend wrap-around focus indicator
- Merge preview scroll bar aria live updates on nudge
- Hash snooze live region pause when tab hidden
