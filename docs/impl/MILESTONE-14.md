# Milestone 14 — Full Clone, Encrypted Archives, Restore Diff, Provider Health

Status: **Complete** (2026-08-11)  
Depends on: Milestone 13  
API version: **0.14.0**

## Delivered

1. **Full workspace clone** — `POST /workspaces/:slug/clone` copies projects, memories, and conversations into a new workspace slug
2. **Archive export encryption** — AES-256-GCM `.enc.json` archives via `POST /export/conversations/archive` with `{ encrypt: true }`; import accepts `passphrase`
3. **Restore preview diff** — `POST /backup/restore/preview` returns structured `diff[]` (section/action/label per entity)
4. **Provider health dashboard** — `GET /providers/health` with summary + probes; web UI health cards

## Acceptance

- [x] Clone reports `projectsCloned`, `memoriesCloned`, and conversation import counts
- [x] Encrypted archive export returns `{ encrypted: true }`
- [x] Encrypted import requires passphrase (`passphrase_required`)
- [x] Restore preview includes non-empty `diff` array
- [x] Provider health endpoint returns probes + summary
- [x] API health reports `0.14.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq .version

curl -s http://127.0.0.1:8787/providers/health | jq .

curl -s -X POST http://127.0.0.1:8787/export/conversations/archive \
  -H 'Content-Type: application/json' \
  -d '{"save":true,"encrypt":true,"passphrase":"my-archive-secret"}'

curl -s -X POST http://127.0.0.1:8787/backup/restore/preview \
  -H 'Content-Type: application/json' \
  -d '{"path":"/Users/you/.devaios/backups/devaios-backup-....json"}' | jq .preview.diff

curl -s -X POST http://127.0.0.1:8787/workspaces/demo/clone \
  -H 'Content-Type: application/json' \
  -d '{"targetSlug":"demo-full-clone","targetName":"Demo Full Clone"}'
```

## Next (Milestone 15 candidates)

- Clone include approvals/jobs snapshot
- Archive signing (Ed25519) parity with backups
- Restore selective merge (pick workspaces)
- Provider auto-disable on probe failure
