# Milestone 21 — Notification SSE, Archive Diff Quick-Select, Scoped Auto-Detect, Webhook Hook

Status: **Complete** (2026-08-13)  
Depends on: Milestone 20  
API version: **0.21.0**

## Delivered

1. **Template notification SSE stream** — `GET /job-templates/notifications/stream?workspace=<slug>` pushes unread notifications every 2s (heartbeat + fresh events)
2. **Archive import diff quick-select** — hub adds **Select replaces** alongside inserts/all/clear for conversation picker
3. **Scoped restore auto-detect** — `autoDetectScoped` (default true) + `GET /backup/inspect?path=...` detect `workspace-{slug}-*` filenames; auto-target scoped restore
4. **Template notification webhook** — `GET/POST /job-templates/notifications/webhook`; POST JSON payload on each template run notification

## Acceptance

- [x] SSE stream emits notification events for workspace
- [x] Archive picker supports insert/replace/all/none quick-select
- [x] Workspace backup filenames auto-enable scoped restore
- [x] Webhook config persisted and invoked on notification push
- [x] Hub UI: live stream status, webhook config, auto-detect toggle
- [x] API health reports `0.21.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq .version

curl -N 'http://127.0.0.1:8787/job-templates/notifications/stream?workspace=demo'

curl -s 'http://127.0.0.1:8787/backup/inspect?path=/Users/you/.devaios/backups/workspace-demo-....json' | jq .

curl -s -X POST http://127.0.0.1:8787/backup/restore/preview \
  -H 'Content-Type: application/json' \
  -d '{"path":"/Users/you/.devaios/backups/workspace-demo-....json","autoDetectScoped":true}' \
  | jq '{autoDetected, selectedSlugs}'

curl -s http://127.0.0.1:8787/job-templates/notifications/webhook | jq .
```

## Next (Milestone 22 candidates)

- Webhook delivery retry + dead-letter log
- Archive import diff import from exported JSON
- Template notification email (SMTP) profile
- Scoped restore batch from latest template backup per workspace
