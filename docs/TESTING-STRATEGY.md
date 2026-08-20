# Testing Strategy

Status: Draft

## Principles

1. Docs define acceptance; tests prove acceptance
2. Prefer deterministic fixtures for policy/governance
3. Local web E2E covers hub happy paths
4. No test should require paid cloud APIs by default (mock providers)

## Layers

| Layer | Tooling (proposed) | What |
|-------|--------------------|------|
| Unit | Vitest | CCE strategies, policy eval, risk scoring |
| Integration | Vitest + test DB | workspace lifecycle, ledger writes |
| Contract | schema tests | API request/response types |
| E2E | Playwright | local web flows |
| Policy fixtures | YAML fixtures | allow/deny matrices |

## Must-cover scenarios (from Sprint 41 closeout)

- A read-only auto-allow
- Destructive require-human
- Twin-informed escalate/deny (can mock twin)
- Mid-plan pause/resume
- Break-glass TTL expiry

## MVP E2E smoke

1. First-run wizard completes
2. Create workspace + attach repo
3. Pack context under budget
4. Backup then restore

## CI expectations (later)

- PR runs unit + integration
- Nightly E2E
- Policy fixture suite gate for governance changes
