# Milestone 23 — Dead-Letter Replay, SMTP TLS, Diff Preview, Batch-Restore Template

Status: **Complete** (2026-08-13)  
Depends on: Milestone 22  
API version: **0.23.0**

## Delivered

1. **Webhook dead-letter replay** — `POST /job-templates/notifications/webhook/dead-letter/replay` retries stored payloads and removes successes
2. **Real SMTP send (TLS)** — email profile adds `sendViaSmtp`, `smtpSecure`, `smtpUser`, `smtpPass`; native TLS/STARTTLS via `template-notification-smtp.ts`
3. **Archive diff import preview** — `POST /import/conversations/archive/from-diff/preview` previews selected diff rows before apply
4. **Batch scoped restore job template** — new template kind `batch_restore` restores latest `workspace-{slug}-*` backup on schedule

## Acceptance

- [x] Dead-letter replay endpoint retries and clears successful entries
- [x] Email profile can send via SMTP TLS (plus outbox fallback)
- [x] Archive from-diff preview returns conflict totals for selected rows
- [x] Job template runner executes `batch_restore` kind
- [x] Hub UI: replay button, diff preview, SMTP toggles
- [x] API health reports `0.23.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq .version

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/webhook/dead-letter/replay \
  -H 'Content-Type: application/json' \
  -d '{"all":true,"limit":5}' | jq .

DIFF="$HOME/.devaios/exports/archive-import-diff-....json"
curl -s -X POST http://127.0.0.1:8787/import/conversations/archive/from-diff/preview \
  -H 'Content-Type: application/json' \
  -d "{\"diffPath\":\"$DIFF\"}" | jq '.preview.totals'

curl -s http://127.0.0.1:8787/job-templates/notifications/email | jq .
```

## Next (Milestone 24 candidates)

- Webhook dead-letter selective replay by id in hub UI
- SMTP delivery status log separate from outbox
- Batch-restore template conflict policy config
- Archive from-diff apply with diffIds picker
