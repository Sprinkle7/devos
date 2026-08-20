# Milestone 17 — Template Runner, Archive Conflicts, Restore Diff Picker, Cooldown Config

Status: **Complete** (2026-08-11)  
Depends on: Milestone 16  
API version: **0.17.0**

## Delivered

1. **Job template runner** — background tick (60s) executes due enabled templates; `POST /workspaces/:slug/job-templates/run`; run state in `~/.devaios/job-template-runs.json`
2. **Archive import conflict policy** — `{ conflictPolicy: "skip" | "replace" }` replaces existing conversations (messages refreshed) on import
3. **Restore diff interactive picker** — preview diff rows include stable `id`; restore accepts `selectedDiffIds[]` to apply only checked rows
4. **Configurable provider cooldown** — `POST /providers/cooldown` with `{ cooldownMinutes }` (1–10080)

## Acceptance

- [x] Job template run endpoint executes enabled templates and records last run
- [x] Archive import with `conflictPolicy: "replace"` reports `replacedConversations`
- [x] Restore preview returns `diffIds[]` with stable row ids
- [x] Restore honors `selectedDiffIds` subset
- [x] Cooldown minutes configurable via API
- [x] API health reports `0.17.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq .version

curl -s -X POST http://127.0.0.1:8787/workspaces/demo/job-templates/run \
  -H 'Content-Type: application/json' -d '{"force":true}'

curl -s http://127.0.0.1:8787/job-templates/run-state | jq .

curl -s -X POST http://127.0.0.1:8787/import/conversations/archive \
  -H 'Content-Type: application/json' \
  -d '{"path":"/Users/you/.devaios/exports/....json","conflictPolicy":"replace","workspaceSlugs":["demo"]}'

curl -s -X POST http://127.0.0.1:8787/backup/restore/preview \
  -H 'Content-Type: application/json' \
  -d '{"path":"/Users/you/.devaios/backups/....json"}' | jq '.diffIds, .preview.diff'

curl -s -X POST http://127.0.0.1:8787/providers/cooldown \
  -H 'Content-Type: application/json' -d '{"cooldownMinutes":30}'
```

## Next (Milestone 18 candidates)

- Job template per-workspace schedule overrides in UI
- Archive import diff preview with conflict counts
- Restore diff “select all insert / skip replace” quick actions
- Template run history in web hub
