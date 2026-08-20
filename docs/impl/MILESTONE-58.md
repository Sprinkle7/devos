# Milestone 58 — Ring Urgency, Position Badge, Scrub Announce, Live Resume

Status: **Complete** (2026-08-16)  
Depends on: Milestone 57  
API version: **0.58.0**

## Delivered

1. **Dry-run undo ring color shift** — progress ring turns amber (<40% remaining) then red (<20%) as undo window expires
2. **Rotation audit legend position badge** — focused legend pill shows **1/3**, **2/3**, or **3/3** next to focus hint
3. **Merge preview scrub announce** — drag/touch scrub throttled `aria-live` updates every 400ms
4. **Hash snooze live resume** — returning to tab announces **announcements resumed · …** before resuming relative ticker

## Acceptance

- [x] Undo ring stroke color reflects urgency near expiry
- [x] Audit legend focus shows position badge (n/3)
- [x] Merge scroll drag scrub triggers live announcements
- [x] Snooze live region announces resume when tab refocused
- [x] API health reports `0.58.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 59 candidates)

- Dry-run undo ring pulse animation near expiry
- Rotation audit legend position badge always visible when expanded
- Merge preview scrub announce on mouseup summary
- Hash snooze live region debounce on resume
