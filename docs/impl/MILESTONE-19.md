# Milestone 19 — Workspace-Scoped Templates, Archive Conversation Picker, Diff Export, Schedule Windows

Status: **Complete** (2026-08-12)  
Depends on: Milestone 18  
API version: **0.19.0**

## Delivered

1. **Workspace-scoped template runs** — job template backup/archive runners export only the selected workspace (`workspace-{slug}-*.json` backups, single-workspace archives)
2. **Archive import per-conversation picker** — preview returns `conversations[]` per workspace; import accepts `conversationIds[]`
3. **Restore diff export** — `POST /backup/restore/preview/export` writes `~/.devaios/exports/restore-diff-{stamp}.json`
4. **Job template schedule windows** — optional `windowStartHour` / `windowEndHour` (0–23); runner skips with `outside_window` when outside range

## Acceptance

- [x] Template runners produce workspace-scoped backup/archive files
- [x] Archive preview/import honor `conversationIds[]`
- [x] Restore diff export includes preview + selection metadata
- [x] Template window hours persisted and enforced by runner
- [x] Hub UI: conversation picker, diff export button, window hour inputs
- [x] API health reports `0.19.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq .version

curl -s -X POST http://127.0.0.1:8787/workspaces/demo/job-templates/run \
  -H 'Content-Type: application/json' \
  -d '{"force":true}' | jq '.executed[].lastPath'

curl -s -X POST http://127.0.0.1:8787/import/conversations/archive/preview \
  -H 'Content-Type: application/json' \
  -d '{"path":"/Users/you/.devaios/exports/....json","workspaceSlugs":["demo"],"conversationIds":["conv-id-1"]}' \
  | jq '.preview.workspaces[0].conversations'

curl -s -X POST http://127.0.0.1:8787/backup/restore/preview/export \
  -H 'Content-Type: application/json' \
  -d '{"path":"/Users/you/.devaios/backups/....json","conflictPolicy":"skip"}' \
  | jq '.path'
```

## Next (Milestone 20 candidates)

- Template run notifications (SSE or inbox)
- Archive import merge preview diff export
- Workspace-scoped restore from template backups only
- Per-template passphrase / encryption profile
