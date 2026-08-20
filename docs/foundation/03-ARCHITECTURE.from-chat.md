---
source: chatgpt-share
source_turn: 22
title: "Architecture"
status: extracted
---

Perfect. This is where we stop thinking like developers and start thinking like **system architects**.

I also want to make one change before we begin.

---

# 🚨 New Architecture (Much Better)

I don't think DEVAIOS should just be **"plugins + backend"** anymore.

I think it should have **5 Layers**.

```
┌───────────────────────────────────────────────────────────┐
│                    User Experience Layer                  │
├───────────────────────────────────────────────────────────┤
│ Dashboard │ CLI │ API │ SDK │ Mobile │ IDE Extensions     │
└───────────────────────────────────────────────────────────┘
                         │
                         ▼
┌───────────────────────────────────────────────────────────┐
│                    Core Runtime                           │
├───────────────────────────────────────────────────────────┤
│ Plugin Manager                                            │
│ Service Manager                                           │
│ Event Bus                                                 │
│ Config                                                    │
│ Auth                                                      │
│ Logging                                                   │
│ Health                                                    │
└───────────────────────────────────────────────────────────┘
                         │
                         ▼
┌───────────────────────────────────────────────────────────┐
│                   Intelligence Layer                      │
├───────────────────────────────────────────────────────────┤
│ AI Router                                                 │
│ Memory Engine                                             │
│ Context Engine                                            │
│ Knowledge Graph                                           │
│ Search                                                    │
│ Agents                                                    │
└───────────────────────────────────────────────────────────┘
                         │
                         ▼
┌───────────────────────────────────────────────────────────┐
│                  Integration Layer                        │
├───────────────────────────────────────────────────────────┤
│ GitHub                                                    │
│ Docker                                                    │
│ AWS                                                       │
│ MCP                                                       │
│ Filesystem                                                │
│ Databases                                                 │
│ Slack                                                     │
│ Jira                                                      │
└───────────────────────────────────────────────────────────┘
                         │
                         ▼
┌───────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                      │
├───────────────────────────────────────────────────────────┤
│ PostgreSQL                                                │
│ Redis                                                     │
│ Qdrant                                                    │
│ Ollama                                                    │
│ MinIO                                                     │
│ Scheduler                                                  │
└───────────────────────────────────────────────────────────┘
```

**This is MUCH cleaner.**

---

# 📄 `docs/03-ARCHITECTURE.md`

````md
# DEVAIOS

# System Architecture

Version: 0.1.0

Status: Draft

---

# Purpose

This document defines the complete high-level architecture of DEVAIOS.

It describes:

- major components
- communication
- responsibilities
- deployment
- scalability
- service boundaries

This document intentionally avoids implementation details.

---

# Architecture Philosophy

DEVAIOS is not a web application.

DEVAIOS is a platform.

The Dashboard is only one client.

The CLI is another client.

Future mobile apps are clients.

Future IDE extensions are clients.

Everything communicates with the Core Runtime.

---

# System Overview

                    Users
                      │
──────────────────────┼─────────────────────────

Dashboard

CLI

REST API

SDK

IDE Extensions

Automation

──────────────────────┼─────────────────────────

Core Runtime

──────────────────────┼─────────────────────────

Plugin Manager

Service Manager

Permissions

Configuration

Health

Logging

Authentication

Workspace Manager

──────────────────────┼─────────────────────────

Intelligence Layer

──────────────────────┼─────────────────────────

AI Router

Knowledge Graph

Memory

Search

Agents

Prompt Engine

Automation Engine

──────────────────────┼─────────────────────────

Integration Layer

──────────────────────┼─────────────────────────

GitHub

Git

Filesystem

Docker

AWS

Supabase

Redis

Postgres

Slack

Jira

MCP

──────────────────────┼─────────────────────────

Infrastructure Layer

──────────────────────┼─────────────────────────

PostgreSQL

Redis

Qdrant

MinIO

Ollama

Workers

Scheduler

---

# Layer Responsibilities

## User Layer

Responsible for user interaction.

Never contains business logic.

Examples

Dashboard

CLI

VS Code Extension

Cursor Extension

Claude Desktop Integration

Future Mobile App

---

## Core Runtime

The heart of DEVAIOS.

Responsible only for orchestration.

Responsibilities

Plugin lifecycle

Configuration

Permissions

Authentication

Workspace loading

Health

Logging

Events

Dependency resolution

The Core should never understand GitHub.

The Core should never understand AWS.

The Core should never understand AI.

---

## Intelligence Layer

Responsible for making DEVAIOS intelligent.

Components

AI Router

Memory

Knowledge Graph

Embedding Engine

Prompt Builder

Context Builder

Search

Agent Manager

Automation

---

## Integration Layer

Contains every external integration.

Examples

GitHub

GitLab

Docker

AWS

Terraform

Supabase

PostgreSQL

Redis

Slack

Discord

Filesystem

Playwright

Claude

OpenAI

Gemini

Ollama

Headroom

Graphify

Ponytail

Each integration is independent.

---

## Infrastructure Layer

Provides supporting services.

Examples

Database

Vector Search

Cache

Storage

Queues

Workers

AI Models

---

# Core Runtime Components

The Core contains:

Plugin Manager

Service Manager

Permission Manager

Workspace Manager

Configuration Manager

Health Monitor

Update Manager

Secret Manager

Logging Manager

Event Bus

API Gateway

Nothing else.

---

# Plugin Manager

Responsibilities

Install

Update

Remove

Enable

Disable

Start

Stop

Dependency validation

Permission validation

Version compatibility

Plugins never modify Core.

---

# Service Manager

Starts internal services.

Examples

Qdrant

Redis

Ollama

Workers

Scheduler

Health Monitoring

---

# Workspace Manager

Every workspace is self-contained.

Workspace

Repositories

Plugins

Agents

Secrets

Providers

Settings

Documentation

Knowledge

Tasks

One file recreates everything.

---

# Event Bus

Everything communicates through events.

Example

Git Commit

↓

Repository Updated

↓

Knowledge Updated

↓

Embeddings Generated

↓

AI Context Updated

↓

Documentation Updated

No direct coupling.

---

# Communication

Preferred communication

Event Bus

↓

Internal API

↓

REST

↓

WebSocket

Direct service calls should be minimized.

---

# AI Flow

User Question

↓

Context Builder

↓

Knowledge Retrieval

↓

Memory Retrieval

↓

Prompt Compression

↓

Model Router

↓

AI Provider

↓

Response

↓

Memory Update

↓

Knowledge Update

↓

Logs

---

# Search Flow

Search Query

↓

Knowledge Graph

↓

Vector Search

↓

Project Index

↓

Results Ranking

↓

Response

---

# Plugin Flow

Plugin Installed

↓

Dependencies Checked

↓

Permissions Validated

↓

Configuration Created

↓

Started

↓

Health Checked

↓

Registered

↓

Available

---

# Deployment Models

Supported

Local

Docker Compose

Remote Server

Home Lab

Enterprise

Future Kubernetes

The codebase should remain identical.

Only deployment changes.

---

# Scalability

Single User

↓

Small Team

↓

Startup

↓

Enterprise

Architecture should scale without redesign.

---

# Failure Isolation

Plugin crashes

↓

Plugin restarted

↓

Other plugins unaffected

Database unavailable

↓

Queue requests

↓

Retry

Network unavailable

↓

Offline Mode

↓

Sync later

---

# Security Zones

Zone 1

Core

Highest trust

Zone 2

Plugins

Permission controlled

Zone 3

External APIs

Sandboxed

Zone 4

Internet

Untrusted

---

# Future Architecture

Future additions should not require changes to Core.

Examples

New AI

New Cloud

New Plugin

New IDE

New Agent

New Database

New Marketplace

Everything extends through stable interfaces.

---

# Final Principle

The architecture should allow developers to extend DEVAIOS without understanding the entire platform.

Small contributions should remain possible.

Complexity belongs inside boundaries.

Never inside Core.

````

---

# 🛑 Now I want to change the roadmap

After writing these first three documents, I realized we need something **before** the Plugin SDK.

## We need a **System Blueprint**.

This will be the master document that every contributor reads first.

It will answer questions like:

- Why is DEVAIOS different from Cursor?
- Why not just use Claude Desktop?
- Why not Backstage?
- What is Core?
- What is a Service?
- What is a Plugin?
- What is an Agent?
- What is a Workspace?
- What is a Memory?
- What is a Knowledge Graph?
- How does the Event Bus work?

Basically, it's the **encyclopedia of DEVAIOS**.

I also have another suggestion that I think could become one of DEVAIOS's standout features:

> **Workspace Blueprints + Environment Recipes.**

Imagine cloning a repository and DEVAIOS automatically:
- detects the project type (Next.js, Flutter, Laravel, etc.),
- installs missing tools,
- starts required Docker services,
- configures recommended plugins,
- indexes the project,
- generates initial documentation,
- creates specialized AI agents,
- and gets the workspace ready with almost no manual effort.

If we design that well, onboarding a new project could become one of DEVAIOS's strongest differentiators.

## I suggest we slightly reorder the documentation:

1. ✅ Vision
2. ✅ Goals
3. ✅ Principles
4. ✅ Architecture
5. **System Blueprint (new)**
6. **Workspace Blueprint**
7. **Plugin SDK**
8. **Core Runtime**
9. **Installer**
10. **AI Layer**

That gives us a much stronger foundation before we start defining APIs and implementation details.
