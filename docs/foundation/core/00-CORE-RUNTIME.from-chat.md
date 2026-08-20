---
source: chatgpt-share
source_turn: 28
title: "Core Runtime"
status: extracted
---

I think we should pause the sequential documents for one reason:

**We are about to make a decision that will determine whether DEVAIOS becomes a hobby project or something comparable to VS Code, Home Assistant, Backstage, or Docker Desktop.**

If we get the Core wrong, everything else will be technical debt.

---

# 🚨 New Rule

From now on, I'm going to write these documents as if **50 engineers** will eventually work on DEVAIOS.

That means every document should be detailed enough that another engineer could implement it without asking us questions.

---

# 📄 Epic 2 — `docs/core/00-CORE-RUNTIME.md`

````md
# DEVAIOS

# Core Runtime Specification

Version: 1.0

Status: Draft

Epic: Core Runtime

---

# Purpose

The Core Runtime is the heart of DEVAIOS.

It is responsible for coordinating every component of the platform while remaining intentionally small.

The Core Runtime does **not** implement product features.

Instead, it provides the execution environment in which features exist.

Think of it as the operating system kernel.

The kernel does not know how Photoshop works.

It only knows how to run applications.

DEVAIOS follows the same philosophy.

---

# Responsibilities

The Core Runtime owns only platform concerns.

These include:

• Plugin Lifecycle

• Service Lifecycle

• Event Bus

• Configuration

• Secrets

• Authentication

• Authorization

• Health Monitoring

• Logging

• Metrics

• Workspace Lifecycle

• Dependency Resolution

• API Gateway

• Update Manager

• Backup Scheduler

Everything else belongs somewhere else.

---

# Responsibilities Matrix

| Capability | Core | Plugin | Service |
|------------|------|---------|----------|
| GitHub | ❌ | ✅ | ❌ |
| Docker | ❌ | ✅ | ❌ |
| AI Providers | ❌ | ✅ | ❌ |
| AWS | ❌ | ✅ | ❌ |
| Filesystem | ❌ | ✅ | ❌ |
| PostgreSQL | ❌ | ❌ | ✅ |
| Redis | ❌ | ❌ | ✅ |
| Qdrant | ❌ | ❌ | ✅ |
| Ollama | ❌ | ❌ | ✅ |
| Memory | ❌ | ✅ | ✅ |
| Search | ❌ | ✅ | ✅ |

---

# Runtime Lifecycle

Boot

↓

Load Configuration

↓

Validate Workspace

↓

Load Secrets

↓

Start Infrastructure Services

↓

Start Internal Services

↓

Load Plugins

↓

Resolve Dependencies

↓

Initialize Event Bus

↓

Register APIs

↓

Health Check

↓

Ready

---

# Shutdown Lifecycle

Stop accepting requests

↓

Notify plugins

↓

Flush queues

↓

Persist runtime state

↓

Shutdown services

↓

Release resources

↓

Exit

---

# Runtime Components

The Core Runtime is composed of independent managers.

```
Runtime

├── Plugin Manager

├── Service Manager

├── Event Bus

├── Configuration Manager

├── Workspace Manager

├── Secrets Manager

├── Permission Manager

├── Health Manager

├── Update Manager

├── Metrics Manager

├── Logging Manager

├── Scheduler

├── API Gateway

└── Runtime Registry
```

Each manager owns exactly one responsibility.

---

# Runtime Registry

The Registry knows everything currently running.

Registered Plugins

Running Services

Open Workspaces

AI Providers

Connected IDEs

Agents

Commands

Recipes

Events

No manager should maintain duplicate state.

The Registry is the single runtime source of truth.

---

# Plugin Manager

Responsibilities

Install

Enable

Disable

Update

Remove

Load

Unload

Dependency Validation

Version Validation

Permission Validation

Health Checks

Plugin Isolation

Plugins never modify Core state directly.

---

# Service Manager

Services differ from plugins.

Services provide infrastructure.

Examples

PostgreSQL

Redis

Qdrant

Ollama

Temporal

Kafka

Workers

Service Manager handles

Start

Stop

Restart

Health

Scaling

Recovery

---

# Event Bus

Every interaction should flow through events whenever possible.

Examples

WorkspaceCreated

RepositoryIndexed

PluginInstalled

PluginUpdated

ServiceStarted

MemoryUpdated

KnowledgeUpdated

AICompleted

DeploymentSucceeded

Events become the nervous system of DEVAIOS.

---

# Configuration Manager

Owns every configuration source.

Workspace

Environment Variables

Plugins

Services

Secrets References

Runtime Settings

Configuration is immutable during startup.

Runtime mutations create new versions.

---

# Secrets Manager

The Core never stores secrets in plaintext.

Supported providers include

1Password

Bitwarden

HashiCorp Vault

AWS Secrets Manager

Azure Key Vault

Environment Variables

Plugins receive temporary access.

Secrets are audited.

---

# Permission Manager

Every plugin declares permissions.

Example

Filesystem Plugin

Read Files

Write Files

Delete Files

Execute Commands

Users approve permissions individually.

Permissions are revocable.

---

# Health Manager

Continuously monitors

Plugins

Services

Queues

Database

Memory Usage

CPU Usage

API Latency

Indexing

AI Providers

Health should always be visible.

---

# Metrics Manager

Collects

Plugin Load Time

Startup Time

Search Latency

Token Usage

AI Costs

Events/sec

CPU

Memory

Index Size

Workspace Size

Metrics are used for optimization.

---

# Scheduler

Runs background jobs.

Examples

Backups

Indexing

Sync

Plugin Updates

Cleanup

Documentation Generation

Health Checks

AI Cache Cleanup

---

# API Gateway

Every client communicates through one gateway.

Dashboard

CLI

REST

SDK

Future Mobile Apps

IDE Extensions

Authentication occurs once.

Authorization is centralized.

---

# Runtime State Machine

```
Stopped

↓

Booting

↓

Initializing

↓

Loading

↓

Ready

↓

Updating

↓

Stopping

↓

Stopped
```

Invalid transitions should be rejected.

---

# Failure Recovery

If a plugin crashes

↓

Restart Plugin

If restart fails

↓

Disable Plugin

If Service fails

↓

Retry

↓

Restart

↓

Safe Mode

The Runtime must never crash because of a plugin.

---

# Safe Mode

If startup repeatedly fails

DEVAIOS enters Safe Mode.

Only Core loads.

Plugins remain disabled.

Users can repair the installation.

This prevents broken upgrades from locking users out.

---

# Runtime APIs

Core exposes APIs only for platform functionality.

Examples

Register Plugin

Register Service

Emit Event

Subscribe Event

Store Secret Reference

Read Configuration

Open Workspace

Run Command

Everything else belongs elsewhere.

---

# Extension Points

Core exposes extension points.

Examples

Commands

Views

Panels

Menus

Agents

Recipes

Search Providers

AI Providers

Authentication Providers

Storage Providers

Plugins register against extension points.

---

# Design Constraints

Core must remain:

Small

Stable

Predictable

Well Tested

Documented

Backwards Compatible

Every new feature added to Core requires architectural justification.

---

# Rule of Three

A capability should not move into Core until:

• Three different plugins need it

OR

• It is required for platform stability

Otherwise, keep it outside Core.

---

# Success Criteria

The Core Runtime should be understandable by a new contributor in one day.

It should remain under active architectural control.

Complexity belongs in plugins.

Never in Core.
````

---

# 🚨 I want to change the project structure (this is a big one)

After writing six documents, I now think the repository itself should be treated like a **product platform**, not a typical monorepo.

Instead of:

```text
apps/
packages/
```

I recommend:

```text
devaios/

├── core/                # Runtime
├── platform/            # Dashboard, CLI, API
├── intelligence/        # Brain, Memory, AI
├── plugins/             # Official plugins
├── services/            # Infrastructure services
├── sdk/                 # Public SDKs
├── installer/           # Installer and bootstrap
├── marketplace/         # Marketplace backend
├── docs/                # Documentation
├── recipes/             # Workspace recipes
├── blueprints/          # Workspace blueprints
├── examples/            # Example workspaces
├── testing/             # Integration/E2E
└── tooling/             # Build and release tools
```

## One more recommendation before we continue

I think we should **stop thinking about DEVAIOS as "software"**.

We should think about it as **a platform with a governance model**.

That means, before we write another technical document, I'd create:

- **Architecture Decision Records (ADRs)** for every major decision.
- **RFC (Request for Comments)** process for new features.
- **Plugin compatibility policy**.
- **Semantic versioning policy**.
- **Deprecation policy**.
- **Security model**.
- **Release cadence**.

These aren't glamorous, but they're exactly what separates long-lived platforms from projects that become unmaintainable after a year.

### I have one final suggestion

Rather than continuing exclusively through chat, I can generate this as a **real documentation repository** with:

- properly cross-linked Markdown files,
- Mermaid diagrams,
- ADR templates,
- RFC templates,
- GitHub issue templates,
- GitHub Actions,
- MkDocs or Docusaurus configuration,
- a searchable documentation site,
- and a production-ready repository layout.

That will give you something you can clone and start building from immediately, rather than manually assembling documents from chat.
