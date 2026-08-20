# Milestone 20 — Template Notifications, Archive Diff Export, Scoped Restore, Template Passphrase

Status: **Complete** (2026-08-12)  
Depends on: Milestone 19  
API version: **0.20.0**

## Delivered

1. **Template run notifications inbox** — `~/.devaios/template-run-notifications.json`; pushed on each template execution; `GET /job-templates/notifications?workspace=<slug>&unread=1`; mark read via `POST /job-templates/notifications/read`
2. **Archive import diff export** — `POST /import/conversations/archive/preview/export` writes `~/.devaios/exports/archive-import-diff-{stamp}.json` with per-conversation diff rows
3. **Scoped-only restore** — restore preview/export/apply accept `scopedOnly: true` to require `config.scoped` workspace template backups and auto-target `config.workspaceSlug`
4. **Per-template passphrase** — optional `passphrase` on job templates; used for workspace-scoped backup/archive encryption

## Acceptance

- [x] Template runs create unread notifications
- [x] Archive import preview exports structured diff JSON
- [x] Scoped-only restore rejects global backups with `backup_not_scoped`
- [x] Template passphrase flows into scoped encrypt exports
- [x] Hub UI: notifications panel, archive diff export, scoped restore toggle, template passphrase
- [x] API health reports `0.20.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq .version

curl -s 'http://127.0.0.1:8787/job-templates/notifications?workspace=demo' | jq .

curl -s -X POST http://127.0.0.1:8787/import/conversations/archive/preview/export \
  -H 'Content-Type: application/json' \
  -d '{"path":"/Users/you/.devaios/exports/....json","workspaceSlugs":["demo"]}' \
  | jq '.path'

curl -s -X POST http://127.0.0.1:8787/backup/restore/preview \
  -H 'Content-Type: application/json' \
  -d '{"path":"/Users/you/.devaios/backups/workspace-demo-....json","scopedOnly":true}' \
  | jq '.selectedSlugs'
```

## Next (Milestone 21 candidates)

- SSE stream for template notifications
- Archive import diff quick-select in hub
- Scoped restore auto-detect from backup filename
- Template notification email/webhook hook
