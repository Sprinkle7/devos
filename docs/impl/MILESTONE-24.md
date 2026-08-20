# Milestone 24 — Selective Replay, Delivery Log, Conflict Policy, Diff Picker

Status: **Complete** (2026-08-13)  
Depends on: Milestone 23  
API version: **0.24.0**

## Delivered

1. **Webhook dead-letter selective replay** — hub checkboxes + `POST .../replay` with `ids[]` (replay selected)
2. **SMTP delivery status log** — `~/.devaios/email-delivery-log.json` + `GET /job-templates/notifications/email/delivery-log`
3. **Batch-restore conflict policy** — job template field `conflictPolicy` (`skip` | `replace`) used by `batch_restore` runner
4. **Archive from-diff row picker** — preview returns `diffRows[]`; apply accepts `diffIds[]`; hub row checkboxes

## Acceptance

- [x] Replay dead letters by selected ids removes successes only
- [x] Email dispatch writes separate delivery log entries (outbox + smtp)
- [x] `batch_restore` template honors `conflictPolicy`
- [x] Archive from-diff preview/import supports diff row selection
- [x] Hub UI updated for all four features
- [x] API health reports `0.24.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq .version

curl -s http://127.0.0.1:8787/job-templates/notifications/email/delivery-log?limit=5 | jq .

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/webhook/dead-letter/replay \
  -H 'Content-Type: application/json' \
  -d '{"ids":["some-dead-letter-id"]}' | jq .

DIFF="$HOME/.devaios/exports/archive-import-diff-....json"
curl -s -X POST http://127.0.0.1:8787/import/conversations/archive/from-diff/preview \
  -H 'Content-Type: application/json' \
  -d "{\"diffPath\":\"$DIFF\"}" | jq '.preview.diffRows | length'
```

## Next (Milestone 25 candidates)

- Delivery log retention + filter by channel/status in hub
- Batch-restore dry-run preview before scheduled apply
- Webhook dead-letter delete-without-replay
- Archive diff export with row selection persisted
