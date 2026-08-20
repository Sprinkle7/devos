# Milestone 22 — Webhook Retry, Archive From-Diff Import, Email Outbox, Batch Scoped Restore

Status: **Complete** (2026-08-13)  
Depends on: Milestone 21  
API version: **0.22.0**

## Delivered

1. **Webhook delivery retry + dead-letter log** — configurable `maxRetries` (default 3); failures append to `~/.devaios/template-webhook-dead-letter.json`; `GET /job-templates/notifications/webhook/dead-letter`
2. **Archive import from diff JSON** — `POST /import/conversations/archive/from-diff` reads exported diff file and imports selected conversation rows
3. **Template notification email (SMTP profile)** — `GET/POST /job-templates/notifications/email`; outbox at `~/.devaios/email-outbox/`; `GET .../email/outbox`
4. **Scoped restore batch** — `GET /workspaces/:slug/backups/latest`; `POST /backup/restore/batch` restores latest `workspace-{slug}-*` backup per workspace

## Acceptance

- [x] Webhook retries then dead-letters on persistent failure
- [x] Archive diff JSON drives selective import
- [x] Email profile writes outbox entries on template notifications
- [x] Batch restore finds and applies latest scoped backup per slug
- [x] Hub UI: dead letters, email profile, import from diff, batch restore
- [x] API health reports `0.22.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq .version

curl -s http://127.0.0.1:8787/job-templates/notifications/webhook/dead-letter | jq .

curl -s -X POST http://127.0.0.1:8787/import/conversations/archive/from-diff \
  -H 'Content-Type: application/json' \
  -d '{"diffPath":"/Users/you/.devaios/exports/archive-import-diff-....json"}' | jq .

curl -s http://127.0.0.1:8787/workspaces/demo/backups/latest | jq .

curl -s -X POST http://127.0.0.1:8787/backup/restore/batch \
  -H 'Content-Type: application/json' \
  -d '{"workspaceSlugs":["demo"],"autoDetectScoped":true}' | jq .
```

## Next (Milestone 23 candidates)

- Webhook dead-letter replay
- Real SMTP send (TLS) from email profile
- Archive diff import preview before apply
- Scheduled batch scoped restore job template
