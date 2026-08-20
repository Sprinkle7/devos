# Milestone 16 — Selective Archive Import, Restore Conflicts, Job Templates, Provider Cooldown

Status: **Complete** (2026-08-11)  
Depends on: Milestone 15  
API version: **0.16.0**

## Delivered

1. **Archive import selective workspace pick** — `workspaceSlugs[]` on archive import; dry-run via `POST /import/conversations/archive/preview`
2. **Restore merge conflict resolution** — `conflictPolicy: "skip" | "replace"` on restore preview/restore; diff shows replace actions; apply module updates existing entities
3. **Clone scheduled job templates** — per-workspace templates in `~/.devaios/job-templates.json`; `GET/POST /workspaces/:slug/job-templates`; clone with `{ includeScheduleTemplates: true }`
4. **Provider re-enable cooldown** — 15-minute grace after auto-disable; `GET /providers/cooldown`; enable blocked with `429 cooldown_active` until retry window

## Acceptance

- [x] Archive import preview lists selected workspaces and conversation counts
- [x] Archive import honors `workspaceSlugs` filter
- [x] Restore preview shows replace counts when `conflictPolicy: "replace"`
- [x] Restore apply returns `applied.workspacesReplaced` etc.
- [x] Clone reports `scheduleTemplatesCloned`
- [x] Provider enable blocked during cooldown after auto-disable
- [x] API health reports `0.16.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq .version

curl -s -X POST http://127.0.0.1:8787/import/conversations/archive/preview \
  -H 'Content-Type: application/json' \
  -d '{"path":"/Users/you/.devaios/exports/conversations-archive-....json","workspaceSlugs":["demo"]}'

curl -s -X POST http://127.0.0.1:8787/backup/restore/preview \
  -H 'Content-Type: application/json' \
  -d '{"path":"/Users/you/.devaios/backups/devaios-backup-....json","conflictPolicy":"replace"}'

curl -s http://127.0.0.1:8787/workspaces/demo/job-templates

curl -s -X POST http://127.0.0.1:8787/workspaces/demo/clone \
  -H 'Content-Type: application/json' \
  -d '{"targetSlug":"demo-tpl","includeScheduleTemplates":true}'

curl -s http://127.0.0.1:8787/providers/cooldown | jq .
```

## Next (Milestone 17 candidates)

- Job template runner (execute templates on schedule)
- Archive import conflict policy (replace conversations)
- Restore diff interactive picker in UI
- Configurable provider cooldown minutes via API
