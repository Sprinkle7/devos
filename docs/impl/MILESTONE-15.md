# Milestone 15 — Clone Snapshots, Signed Archives, Selective Restore, Provider Auto-Disable

Status: **Complete** (2026-08-11)  
Depends on: Milestone 14  
API version: **0.15.0**

## Delivered

1. **Clone approvals/jobs snapshot** — `POST /workspaces/:slug/clone` accepts `{ includeApprovals, includeJobs }`; copies HITL approvals and workspace-scoped jobs into the target workspace
2. **Archive signing (Ed25519)** — signed `.signed.json` / `.signed.enc.json` archives via `{ sign: true }`; verify with `POST /export/conversations/archive/verify`; import rejects tampered files
3. **Restore selective merge** — `POST /backup/restore/preview` and `POST /backup/restore` accept `{ workspaceSlugs: string[] }` to merge only chosen workspaces (skips global MCP/providers overwrite)
4. **Provider auto-disable on probe failure** — `POST /providers/failover/probe` with `{ autoDisable: true }` disables providers that fail health probe (excluding missing API key / disabled)

## Acceptance

- [x] Clone reports `approvalsCloned` and `jobsCloned`
- [x] Signed archive export returns `{ signed: true }`
- [x] Archive verify endpoint validates Ed25519 signature
- [x] Restore preview/restore honor `workspaceSlugs` filter
- [x] Probe with `autoDisable: true` returns `autoDisabled.disabled[]`
- [x] API health reports `0.15.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq .version

curl -s -X POST http://127.0.0.1:8787/workspaces/demo/clone \
  -H 'Content-Type: application/json' \
  -d '{"targetSlug":"demo-snap","includeApprovals":true,"includeJobs":true}'

curl -s -X POST http://127.0.0.1:8787/export/conversations/archive \
  -H 'Content-Type: application/json' \
  -d '{"save":true,"sign":true,"encrypt":true,"passphrase":"my-archive-secret"}'

curl -s -X POST http://127.0.0.1:8787/export/conversations/archive/verify \
  -H 'Content-Type: application/json' \
  -d '{"path":"/Users/you/.devaios/exports/conversations-archive-....signed.enc.json"}'

curl -s -X POST http://127.0.0.1:8787/backup/restore/preview \
  -H 'Content-Type: application/json' \
  -d '{"path":"/Users/you/.devaios/backups/devaios-backup-....json","workspaceSlugs":["demo"]}'

curl -s -X POST http://127.0.0.1:8787/providers/failover/probe \
  -H 'Content-Type: application/json' \
  -d '{"autoDisable":true}'
```

## Next (Milestone 16 candidates)

- Archive import selective workspace pick
- Restore merge conflict resolution (replace vs skip UI)
- Clone scheduled job templates
- Provider re-enable cooldown / grace period
