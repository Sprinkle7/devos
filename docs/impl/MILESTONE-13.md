# Milestone 13 — Archive Retention, Restore Preview, Workspace Clone, Failover DnD

Status: **Complete** (2026-08-11)  
Depends on: Milestone 12  
API version: **0.13.0**

## Delivered

1. **Archive export retention** — policy in `~/.devaios/archive-retention.json`; auto-rotate after archive write; `GET/POST /export/conversations/archive/retention`, `POST .../retention/rotate`
2. **Backup restore dry-run** — `POST /backup/restore/preview` returns insert/skip counts and planned actions without mutating data
3. **Workspace clone** — `POST /workspaces/:slug/clone` creates target workspace and copies all conversations/messages
4. **Failover drag-and-drop UI** — web hub draggable failover chips (replaces ↑↓ buttons)

## Acceptance

- [x] Archive export returns `{ path, rotation }` after retention pass
- [x] Restore preview lists actions without DB writes
- [x] Clone creates new workspace slug with copied conversations
- [x] Failover order saveable after drag reorder
- [x] API health reports `0.13.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq .version

curl -s 'http://127.0.0.1:8787/export/conversations/archive?save=1' | jq '{path, rotation}'

curl -s -X POST http://127.0.0.1:8787/export/conversations/archive/retention \
  -H 'Content-Type: application/json' -d '{"maxCount":5,"maxAgeDays":30}'

curl -s -X POST http://127.0.0.1:8787/backup/restore/preview \
  -H 'Content-Type: application/json' \
  -d '{"path":"/Users/you/.devaios/backups/devaios-backup-....json"}'

curl -s -X POST http://127.0.0.1:8787/workspaces/demo/clone \
  -H 'Content-Type: application/json' \
  -d '{"targetSlug":"demo-copy","targetName":"Demo Copy"}'
```

## Next (Milestone 14 candidates)

- Full workspace clone (projects + memories)
- Restore preview diff UI
- Archive export encryption
- Provider health dashboard
