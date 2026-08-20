# Milestone 50 — Bridge Clear, Toast Diff, Scroll Max, Paused Updated

Status: **Complete** (2026-08-16)  
Depends on: Milestone 49  
API version: **0.50.0**

## Delivered

1. **Dry-run reveal bridge clear** — **Clear bridge** removes `window.devaios.revealInFinder` and sessionStorage flag
2. **Rotation audit toast diff** — save toasts include policy diff summary (`saved via button · maxCount 200→150`)
3. **Merge preview scroll max** — indicator shows **scroll Npx / Maxpx** (current offset vs max scroll height)
4. **Hash snooze paused last-updated** — when tab hidden, notice shows **(paused · updated HH:MM:SS)** from last live tick

## Acceptance

- [x] Dev bridge can be uninstalled in-session without manual devtools
- [x] Audit retention save toasts include changed-field summary
- [x] Merge JSON preview scroll indicator shows max scrollable height
- [x] Paused snooze relative time shows when ticker last updated
- [x] API health reports `0.50.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'
```

## Next (Milestone 51 candidates)

- Dry-run reveal bridge install confirmation dialog
- Rotation audit toast color by change type
- Merge preview scroll progress bar
- Hash snooze resume notice dismiss on outside click
