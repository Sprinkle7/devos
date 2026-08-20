---
source: continued-here
sprint: 41
task: 5
title: "DEVAIOS Autonomous Decision Governance"
status: complete-draft
---

# Sprint 41 — Task 5: DEVAIOS Autonomous Decision Governance

## Policy Gates, Risk Scoring, Human Escalation, Explainability, Audit Ledger & Authority Delegation

---

# Objective

Build the **Autonomous Decision Governance (ADG)** platform so agents can propose and execute actions only within configurable policy, with risk-aware automation, human escalation for high-impact work, full explainability, and an auditable decision ledger.

This transforms DEVAIOS from:

> "A world-aware autonomous enterprise"

into:

> "A governed autonomous enterprise."

---

# Design Principles

1. **Fail closed** on unknown high-risk action classes
2. **Explain before/after** every consequential decision
3. **Human authority is never erased** — only delegated with scope and expiry
4. **Policies are data** — versioned, testable, workspace/org scoped
5. **Audit is mandatory** for write / deploy / destructive / financial / identity actions
6. **Personal hub and enterprise** share the same governance core; enterprise adds org packs

---

# Product Vision

## Before

```text
Agent → Action → World
```

## After

```text
Agent Proposal
    ↓
Policy Check
    ↓
Risk Score
    ↓
Auto | Escalate | Deny
    ↓
Explain + Ledger
    ↓
Execute / Delegate / Rollback hook
```

---

# Core Capabilities

## 1. Decision object model

Every consequential action is a `Decision`:

| Field | Description |
|-------|-------------|
| `id` | UUID |
| `proposed_by` | agent / user / system |
| `action_class` | read, write-local, network, deploy, destructive, identity, financial, external-comms |
| `intent` | natural language summary |
| `payload` | structured action body |
| `evidence[]` | docs, twin sims, metrics, prior decisions |
| `alternatives[]` | options considered |
| `risk` | score + factors |
| `policy_results[]` | pass/fail per rule |
| `status` | proposed, approved, denied, escalated, executing, completed, rolled_back |
| `authority` | who approved / delegated |
| `created_at` / `resolved_at` | timestamps |

Align names with FDS-001 where possible (`Agent`, `Workspace`, `Project`, etc.).

## 2. AI decision approval framework

- Pipelines: `auto-allow` → `auto-allow-with-log` → `require-human` → `require-multi-party` → `deny`
- Per action class defaults differ for personal vs org workspaces
- Approval UI in **local web** hub (`/governance/approvals`)
- Timeout policies: wait, auto-deny, or degrade to safer alternative

## 3. Risk-aware decision engine

Risk factors (weighted, configurable):

- blast radius (files, services, tenants)
- reversibility
- confidence of proposal
- novelty (never done before in workspace)
- digital-twin simulation outcome (when available)
- compliance tags

Outputs: `risk_score` 0–100 + human-readable factors.

Threshold examples (tunable):

| Score | Default personal hub | Default enterprise |
|-------|----------------------|--------------------|
| 0–20 | auto | auto |
| 21–50 | auto + log | human if write+ |
| 51–80 | human confirm | human / dual control |
| 81–100 | deny or break-glass | dual control + deny-by-default |

## 4. Human escalation policies

- Escalation targets: workspace owner, role, on-call rotation (enterprise)
- Channels: local web inbox first; optional email/webhook later
- SLA timers and reminder cadence
- If human unavailable: configured fallback (safe no-op preferred)

## 5. Constitutional / policy enforcement

Policy packs:

- `personal-default`
- `team-default`
- `enterprise-strict`
- custom packs

Rule kinds:

- `must` / `must_not` / `prefer`
- conditions on action class, path globs, env, time, agent role
- hooks to Context Compression pins (critical policies never dropped from model context)

Policies versioned; breaking changes require migration note.

## 6. Decision explainability

For every decision produce:

- why proposed
- evidence used
- alternatives rejected
- policy hits
- risk factors
- final authority path

Local web: Decision Detail page with timeline.

## 7. Decision audit ledger

Append-only event log:

- `decision.proposed`
- `policy.evaluated`
- `risk.scored`
- `approval.requested|granted|denied`
- `execution.started|finished|failed`
- `rollback.requested|finished`

Storage: durable volume in Docker; exportable for compliance.

## 8. Ethical & regulatory validation (pluggable)

- Validator interface: `validate(decision) → findings[]`
- Packs can be no-op in personal mode
- Enterprise may attach legal/security packs later
- Unknown validator failure → fail closed for high-risk classes

## 9. Autonomous authority delegation

- Scoped grants: agent, action classes, resources, expiry
- Temporary elevation with reason
- Revocation + break-glass (time-limited, heavily audited)
- No standing god-mode for autonomous agents in default packs

---

# Local web surfaces

```text
apps/web/src/governance/
  ApprovalsInbox.tsx
  DecisionDetail.tsx
  PolicyEditor.tsx
  RiskDashboard.tsx
  AuditExplorer.tsx
  AuthorityGrants.tsx
```

---

# Package sketch (implementation later)

```text
packages/governance/
  src/
    decision.ts
    risk.ts
    policy.ts
    ledger.ts
    authority.ts
    validators/
```

---

# Events

```text
decision.proposed
decision.escalated
decision.approved
decision.denied
decision.executed
decision.rolled_back
authority.granted
authority.revoked
policy.updated
```

---

# Completion criteria

- [ ] Decision model defined and referenced by agent runtime
- [ ] Policy evaluation runs before consequential execution
- [ ] Risk scoring produces explainable factors
- [ ] Human escalation path works in local web
- [ ] Audit ledger records full lifecycle
- [ ] Authority delegation supports expiry + revoke
- [ ] Personal-default pack ships; enterprise pack documented
- [ ] CCE pins governance policies into model context

---

# Dependencies

- Sprint 41 Task 1–4 (agents, collaboration, planning, digital twin risk inputs)
- Enterprise IAM (Sprint 39 Task 1) for org roles
- Context Compression pins (`CONTEXT-COMPRESSION.md`)
- Local web shell (Founder D-02)

---

# Next Task

## Sprint 41 — Task 6

### DEVAIOS Runtime Policy & Compliance Engine

Build the executable policy runtime that loads versioned policy packs, evaluates rules at action time, integrates validators, and exposes policy simulation (“would this be allowed?”) in the local web hub.
