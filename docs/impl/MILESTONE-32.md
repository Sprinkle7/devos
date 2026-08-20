# Milestone 32 — Date Filter, Rotation Integrity, Merge Invert, Auto-Rebuild

Status: **Complete** (2026-08-15)  
Depends on: Milestone 31  
API version: **0.32.0**

## Delivered

1. **Dry-run export date range filter** — export accepts `since` / `until` ISO timestamps; hub datetime-local inputs
2. **Rotation history integrity vs delivery log** — `GET .../rotation-history/integrity` compares last rotation kept count and timestamp
3. **Merge preview invert selection** — hub **Invert merge selection** toggles unchecked rows
4. **Auto-rebuild hash index on integrity failure** — `GET .../integrity?autoRebuild=1` rebuilds when mismatch detected

## Acceptance

- [x] Dry-run export filters by since/until on notification createdAt
- [x] Rotation integrity reports ok when latest history matches delivery log metrics
- [x] Merge invert flips checkbox selection in hub
- [x] Hash integrity with autoRebuild repairs index and returns rebuilt=true
- [x] API health reports `0.32.0`

## Run

```bash
pnpm install
pnpm dev

curl -s http://127.0.0.1:8787/health | jq '{version}'

curl -s -X POST http://127.0.0.1:8787/job-templates/notifications/dry-run/export \
  -H 'Content-Type: application/json' \
  -d '{"since":"2026-08-01T00:00:00.000Z","until":"2026-08-15T23:59:59.999Z"}' | jq .

curl -s http://127.0.0.1:8787/job-templates/notifications/email/delivery-log/rotation-history/integrity | jq .

curl -s 'http://127.0.0.1:8787/job-templates/notifications/webhook/dead-letter/hash-index/integrity?autoRebuild=1' | jq .
```

## Next (Milestone 33 candidates)

- Dry-run export preset ranges (24h / 7d / 30d)
- Rotation integrity repair endpoint
- Merge preview filter by action
- Scheduled hash integrity check on template tick
