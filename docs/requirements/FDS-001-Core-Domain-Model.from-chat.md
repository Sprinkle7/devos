---
source: chatgpt-share
source_turn: 64
title: "FDS-001 Core Domain Model"
status: extracted
---

**Excellent. This is exactly why I wanted to become your CTO on this project instead of just an AI assistant.**

I'm going to disagree with myself one last time.

After thinking about it deeply, **I would NOT insert these documents now.**

Why?

Because if this were a real company, I'd have a team waiting to start implementation. Changing document numbering and order now creates churn.

Instead, I'd create a dedicated **Foundation Specification** that all SRS documents reference. The SRS numbering stays stable.

This is how large projects (Linux, Kubernetes, etc.) evolve.

---

# FOUNDATION-001 — Core Domain Model

> **This is NOT an SRS document.**
>
> It is a **Foundation Specification (FDS)**.
>
> Every SRS document references it.

This is the document that defines the language of DEVAIOS.

---

````markdown
# DEVAIOS Foundation Specification

Document: FDS-001

Title: Core Domain Model

Version: 1.0

Status: Approved

---

# Purpose

This specification defines the universal vocabulary used throughout DEVAIOS.

Every subsystem MUST use these definitions.

No SRS document SHALL redefine these concepts.

---

# Domain Hierarchy

Developer

↓

Workspace

↓

Project

↓

Repository

↓

Engineering Assets

---

# Workspace

Definition

A Workspace is an Engineering Environment.

A Workspace groups one or more Projects together and contains
their engineering context.

Examples

Personal Workspace

Startup Workspace

Enterprise Workspace

Open Source Workspace

Responsibilities

• configuration

• AI context

• plugins

• services

• automation

• search

• documentation

• knowledge

---

# Project

Definition

A Project is a logical engineering product.

A Project may contain one or more repositories.

Examples

Backend API

Mobile App

Infrastructure

Website

Design System

Project responsibilities

• repositories

• environments

• documentation

• deployments

• engineering knowledge

• architecture

---

# Repository

Definition

A Repository is a source code container.

Repositories are implementation artifacts.

Repositories do not define products.

Examples

github.com/company/api

github.com/company/web

github.com/company/mobile

Responsibilities

source code

history

branches

commits

tags

---

# Knowledge

Definition

Knowledge is structured engineering understanding.

Knowledge SHALL never be raw source code.

Examples

Authentication Flow

Database Schema

Payment Pipeline

Dependency Graph

Architecture

Security Model

Knowledge is generated from analysis.

---

# Memory

Definition

Memory is persistent information collected over time.

Examples

Previous conversations

Developer preferences

Project history

Architecture evolution

Previous refactorings

Memory differs from Knowledge.

Knowledge describes software.

Memory describes history.

---

# Capability

Definition

A Capability is something DEVAIOS can perform.

Examples

Search Repository

Deploy Docker

Explain Authentication

Generate Diagram

Execute Workflow

Capabilities may come from:

Core

Plugins

Services

Agents

---

# Service

Definition

A Service provides infrastructure.

Examples

PostgreSQL

Redis

Qdrant

Meilisearch

NATS

Ollama

Anthropic

OpenAI

Services do not provide business logic.

---

# Plugin

Definition

A Plugin extends DEVAIOS.

Plugins register Capabilities.

Plugins do not own the Runtime.

---

# Agent

Definition

An Agent is an autonomous reasoning component.

Examples

Documentation Agent

Architecture Agent

Testing Agent

Security Agent

Refactoring Agent

Agents consume Knowledge.

Agents produce Actions.

---

# Action

Definition

An Action changes system state.

Examples

Create File

Modify Configuration

Run Docker

Commit Git

Deploy

---

# Event

Definition

An immutable record that something happened.

Examples

WorkspaceOpened

RepositoryScanned

PluginLoaded

KnowledgeUpdated

DeploymentFinished

Events SHALL never change.

---

# Task

Definition

A unit of planned work.

Examples

Refactor Authentication

Upgrade PostgreSQL

Add Unit Tests

Generate Documentation

---

# Workflow

Definition

An ordered collection of Tasks.

Examples

Deploy Application

Release Pipeline

Documentation Generation

CI Build

---

# Provider

Definition

External systems providing functionality.

Examples

Anthropic

OpenAI

Ollama

GitHub

AWS

Docker

Slack

---

# Artifact

Definition

Generated output.

Examples

Markdown

Diagram

Documentation

API Specification

Architecture Report

Test Report

---

# Relationship Model

Workspace

contains

Projects

Projects

contain

Repositories

Repositories

produce

Knowledge

Knowledge

powers

Agents

Agents

execute

Actions

Actions

produce

Events

Events

update

Memory

---

# Engineering Rule

The platform SHALL always model the developer's mental model rather than the implementation details.

Developers think in:

Projects

Deployments

Authentication

Payments

Users

Orders

—not—

Files

Classes

Functions

This principle SHALL guide future feature design.

---

END OF DOCUMENT
````

---

# ✅ This is the last foundational document I'll insert outside the SRS stream.

From now on:

- The **Foundation Specification (FDS)** defines *what things are*.
- The **SRS** defines *how they behave*.
- The **ADR** explains *why we made important architectural decisions*.
- The **RFC** proposes *future changes*.

That gives us four distinct document types with clear purposes.

---

# 📂 The documentation hierarchy is now stable

```text
docs/
├── foundation/
│   └── FDS-001-Core-Domain-Model.md
│
├── srs/
│   ├── SRS-010-Core-Runtime.md
│   ├── SRS-011-Runtime-Lifecycle.md
│   ├── SRS-012-Configuration.md
│   ├── SRS-013-Workspace.md
│   └── ...
│
├── adr/
│   └── ADR-xxxx.md
│
├── rfc/
│   └── RFC-xxxx.md
│
├── schemas/
├── openapi/
└── diagrams/
```

---

# 🎯 Now I'm going to tell you something important.

**I think we're done designing the foundation.**

Not because there isn't more to design.

Because **we now have enough to start engineering properly.**

From the next document onward (`SRS-014 – Projects`), every SRS will reference:

- Foundation Definitions
- Previous SRS
- Requirement IDs
- APIs
- Events
- Data Models

The architecture is now stable enough that we can continue writing specifications **and** start implementing in parallel.

---

## My proposal for how we work from here

I don't want to wait until all 100 SRS documents are finished before writing code.

Instead, I'd like to run **two synchronized tracks**:

### Track A — Specifications

Continue writing SRS documents in order.

### Track B — Implementation

As soon as an epic is complete (for example, Core Runtime), we scaffold and implement it.

That way, by the time we've finished the Brain specifications, the Core Runtime is already compiling and tested.

I believe that parallel approach will get DEVAIOS to a usable MVP much faster while keeping the documentation and implementation aligned.
