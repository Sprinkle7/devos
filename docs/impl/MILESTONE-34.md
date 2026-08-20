# Milestone 34 — Filter Badge, Repair Audit, Multi-Action Filter, Hash Tick Health

Status: **Complete** (2026-08-15)  
Depends on: Milestone 33  
API version: **0.34.0**

## Delivered

1. **Dry-run export combined preset + workspace badge** — export returns `filters`; hub shows preset · workspace pill after export
2. **Rotation repair audit log file** — `~/.devaios/email-rotation-repair-audit.json` + GET audit endpoint
3. **Merge preview multi-action filter** — merge preview accepts `actionFilters[]`; hub insert/skip/replace checkboxes
4. **Hash tick check metrics in `/health`** — `deadLetterHashes.tickCheck` with last check time, ok, rebuilt, count

## Acceptance

- [x] Dry-run export response includes filter metadata; hub badge shows preset + workspace
- [x] Rotation repair appends audit entries; audit endpoint lists recent repairs
- [x] Merge preview filters by multiple actions simultaneously
- [x] Health reports hash tick check metrics after template runner ticks
- [x] API health reports `0.34.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version, deadLetterHashes}'

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/dry-run/export \
  -H 'Content-Type: application/json' \
  -d '{"presetRange":"24h","workspaceSlug":"demo"}' | jq '.filters'

curl -s http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit | jq .

curl -s -X POST http://127.0.0.1:8787/import/conversations/archive/from-diff/merge/preview \
  -H 'Content-Type: application/json' \
  -d '{"diffPaths":["/path/a.json","/path/b.json"],"actionFilters":["insert","replace"]}' | jq '.preview.diffRows | length'
```

## Next (Milestone 35 candidates)

- Dry-run export badge live preview before export
- Rotation audit CSV export
- Merge preview action filter presets (insert+replace)
- Hash tick failure alert in hub notifications
