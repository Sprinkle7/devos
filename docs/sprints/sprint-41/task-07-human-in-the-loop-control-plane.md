---
source: continued-here
sprint: 41
task: 7
title: "DEVAIOS Human-in-the-Loop Control Plane"
status: complete-draft
---

# Sprint 41 — Task 7: DEVAIOS Human-in-the-Loop Control Plane

## Approvals Inbox, Live Intervention, Pause/Resume, Break-Glass & Operator UX

---

# Objective

Build the **Human-in-the-Loop Control Plane (HITL)** so humans remain effective governors of autonomous work: approve, deny, edit, pause, resume, and break-glass with full context—primarily through the **local web** hub.

---

# Design Principles

1. Humans need **context packs**, not raw dumps (use Context Compression)
2. Intervention must work mid-plan, not only at start
3. Break-glass is loud, timed, and audited
4. Mobile-friendly later; desktop browser first
5. Solo-user mode still benefits (self-approvals + audit)

---

# Core Capabilities

## 1. Approvals inbox

- Queue of pending decisions
- Filters: risk, project, agent, age
- Bulk allow only for low-risk classes
- Deep link to Decision Detail + twin/sim evidence when present

## 2. Live intervention

For running multi-step plans:

- Pause plan
- Cancel remaining steps
- Skip step (policy permitting)
- Inject human instruction (replanning trigger)
- Take over single step manually

## 3. Break-glass

- Explicit reason required
- Short TTL
- Notifies configured parties (enterprise)
- Auto-revokes on expiry
- Always `risk` elevated in ledger

## 4. Operator presence

- Optional “operator on duty” flag
- If off-duty: escalation routing / auto-deny high risk

## 5. Context for humans

Each approval shows compressed pack:

- intent
- pinned policies
- key diffs / commands
- twin risk summary
- suggested decision

---

# Local web surfaces

```text
apps/web/src/hitl/
  Inbox.tsx
  InterventionConsole.tsx
  BreakGlassModal.tsx
  OnDutyToggle.tsx
```

---

# Events

```text
hitl.approval.viewed
hitl.plan.paused
hitl.plan.resumed
hitl.plan.cancelled
hitl.break_glass.opened
hitl.break_glass.closed
```

---

# Completion criteria

- [ ] Inbox lists actionable items with risk badges
- [ ] Pause/resume works for long-horizon plans (Sprint 41 Task 3)
- [ ] Break-glass TTL enforced
- [ ] Compressed context shown for approvals
- [ ] All interventions ledgered

---

# Next Task

## Sprint 41 — Task 8

### DEVAIOS Governed Autonomy Closeout & Integration

Integrate agents, collaboration, planning, digital twin, governance, policy runtime, and HITL into one governed autonomy loop; document end-to-end acceptance scenarios.
