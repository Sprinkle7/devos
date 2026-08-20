# Milestone 59 — Ring Pulse, Badge Always On, Scrub Summary, Resume Debounce

Status: **Complete** (2026-08-16)  
Depends on: Milestone 58  
API version: **0.59.0**

## Delivered

1. **Dry-run undo ring pulse** — progress ring pulses when ≤20% remaining (red urgency zone)
2. **Rotation audit legend position badge always on** — **1/3**, **2/3**, **3/3** shown in legend header whenever expanded
3. **Merge preview scrub finish announce** — mouseup/touchend announces final scroll position summary
4. **Hash snooze live resume debounce** — tab refocus resume announcement debounced 300ms before live region update

## Acceptance

- [x] Undo ring pulses near expiry (≤20%)
- [x] Audit legend position badge visible whenever legend expanded
- [x] Merge scroll scrub end triggers finish summary in aria-live
- [x] Snooze live resume debounced; ticker updates wait until debounce completes
- [x] API health reports `0.59.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 60 candidates)

- Dry-run undo ring pulse at amber zone (≤40%)
- Rotation audit legend badge updates on arrow without focus
- Merge preview scrub summary includes percent
- Hash snooze live region resume prefix toggle
