# Milestone 18 — Template Editor, Archive Conflict Preview, Diff Quick-Select, Run History

Status: **Complete** (2026-08-12)  
Depends on: Milestone 17  
API version: **0.18.0**

## Delivered

1. **Job template per-workspace schedule UI** — hub panel to load defaults, toggle enabled, edit interval minutes, save templates for selected workspace
2. **Archive import conflict preview** — preview returns per-workspace and total `wouldInsert` / `wouldSkip` / `wouldReplace` counts (honors `conflictPolicy`)
3. **Restore diff quick actions** — Select inserts / Select replaces / Select all / Clear buttons in backup panel
4. **Template run history** — `GET /job-templates/run-state?workspace=<slug>` filter; run history list in hub per workspace

## Acceptance

- [x] Archive preview reports conflict totals with policy
- [x] Job templates editable and saveable from hub UI
- [x] Restore diff quick-select filters `selectedDiffIds`
- [x] Run history filtered by workspace slug
- [x] API health reports `0.18.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq .version

curl -s http://127.0.0.1:8787/workspaces/demo/job-templates | jq .

curl -s -X POST http://127.0.0.1:8787/import/conversations/archive/preview \
  -H 'Content-Type: application/json' \
  -d '{"path":"/Users/you/.devaios/exports/....json","workspaceSlugs":["demo"],"conflictPolicy":"replace"}' \
  | jq '.preview.totals'

curl -s 'http://127.0.0.1:8787/job-templates/run-state?workspace=demo' | jq .
```

## Next (Milestone 19 candidates)

- Template runner ties to workspace-scoped backup/archive (not global)
- Archive import per-conversation picker
- Restore diff export to JSON
- Job template enable/disable schedule windows
