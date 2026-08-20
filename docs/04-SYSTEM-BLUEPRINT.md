# DEVAIOS

# System Blueprint

Version: 0.1.0

Status: Living Document

---

# Purpose

This document explains how every major component of DEVAIOS fits together.

It is intended to answer:

"What is DEVAIOS?"

without requiring readers to understand the implementation.

If the Architecture document explains WHERE things live,

this document explains WHY they exist.

---

# Mental Model

Think of DEVAIOS as an operating system.

Operating systems manage:

• hardware
• applications
• permissions
• memory
• files
• networking

DEVAIOS manages:

• projects
• AI
• documentation
• infrastructure
• knowledge
• plugins
• automation
• developer workflows

Instead of applications,

DEVAIOS manages developer capabilities.

---

# DEVAIOS Ecosystem

                 Developer
                      │

        Dashboard / CLI / IDE / API

                      │

                Core Runtime

                      │

      Plugin Manager    Event Bus

                      │

────────────────────────────────────────────

Workspace Manager

Agent Manager

Knowledge Engine

Memory Engine

Context Engine

Search Engine

Automation Engine

AI Router

────────────────────────────────────────────

                      │

GitHub

Docker

AWS

Filesystem

Databases

MCP

Slack

Jira

Terminal

────────────────────────────────────────────

Infrastructure

Postgres

Redis

Qdrant

Ollama

MinIO

Workers

Scheduler

---

# The Core Runtime

The Core Runtime is the operating system kernel.

It has only one responsibility.

Coordinate everything.

It never understands:

GitHub

Claude

AWS

Docker

Redis

Headroom

Graphify

Those belong elsewhere.

---

# Plugins

Plugins extend DEVAIOS.

Examples

GitHub Plugin

AWS Plugin

Docker Plugin

Filesystem Plugin

Terraform Plugin

Playwright Plugin

Git Plugin

Claude Plugin

Gemini Plugin

OpenAI Plugin

Headroom Plugin

Graphify Plugin

Ponytail Plugin

Plugins provide capabilities.

They never become part of Core.

---

# Services

Services provide infrastructure.

Examples

Search Engine

Vector Database

Memory Engine

Scheduler

Redis

PostgreSQL

Qdrant

MinIO

Services usually run continuously.

Plugins consume services.

---

# Agents

Agents perform work.

Examples

Backend Engineer

Frontend Engineer

DevOps Engineer

Security Auditor

Documentation Writer

Code Reviewer

Architect

Database Expert

Agents are not models.

Agents are workflows that use:

AI

Memory

Knowledge

Tools

Plugins

Permissions

---

# Knowledge

Knowledge is permanent.

Examples

Architecture

API Documentation

Meeting Notes

ADR

Deployment History

Schemas

Design Decisions

Generated Documentation

Knowledge should survive model changes.

Knowledge belongs to the workspace.

---

# Memory

Memory is contextual.

Examples

Recent conversations

Temporary plans

Developer preferences

Current task

Session state

Memory expires.

Knowledge does not.

---

# Context

Context is assembled.

It is never stored.

Example

User Question

↓

Project

↓

Memory

↓

Knowledge

↓

Git History

↓

Documentation

↓

Plugin Data

↓

Prompt

↓

AI

Every AI request has different context.

---

# Search

Search combines multiple systems.

Keyword Search

Semantic Search

Knowledge Graph

Project Index

Documentation

Code Search

Results are merged.

Ranked.

Returned.

---

# AI Router

The Router decides:

Which model?

Which provider?

Which cost?

Which latency?

Which fallback?

Users should not think about providers.

Users think about work.

---

# Event Bus

Everything talks through events.

Repository Indexed

↓

Knowledge Updated

↓

Embeddings Created

↓

Documentation Updated

↓

Agent Notified

↓

Dashboard Updated

Nothing communicates directly unless necessary.

---

# Workspace

Everything belongs to a Workspace.

Workspace contains

Projects

Agents

Plugins

Knowledge

Memory

Documentation

Tasks

Secrets

Providers

Settings

Workspace is portable.

---

# Project

A Workspace contains Projects.

Each Project contains

Repository

Branches

Issues

Deployments

Documentation

Architecture

Knowledge

Agents

Plugins

Tasks

Logs

A Project is never "just a Git repository."

---

# Provider

Providers offer capabilities.

Examples

Anthropic

OpenAI

Gemini

Groq

OpenRouter

Ollama

Providers may disappear.

Capabilities remain.

---

# Tool

Tools perform actions.

Examples

Read File

Write File

Run SQL

Create PR

Restart Docker

Deploy EC2

Run Tests

Generate Docs

Agents use Tools.

Plugins expose Tools.

---

# Commands

Everything eventually becomes a command.

Examples

Deploy

Generate Docs

Index Repository

Create Agent

Open Project

Restart Plugin

Sync Knowledge

Commands enable:

CLI

API

Automation

Agents

Dashboard

---

# Marketplace

Marketplace distributes:

Plugins

Themes

Templates

Agents

Blueprints

Recipes

Everything should be installable.

---

# Recipes

Recipes automate setup.

Example

Node.js Recipe

↓

Install Node

↓

Install pnpm

↓

Docker

↓

Redis

↓

Postgres

↓

Index Project

↓

Generate Docs

↓

Ready

Recipes are reusable.

---

# Blueprints

Blueprints describe entire environments.

Workspace

Projects

Plugins

Agents

Services

Providers

Recipes

Secrets

A Blueprint recreates everything.

---

# Secrets

Secrets are never stored in repositories.

DEVAIOS should support

Vault

1Password

Bitwarden

Environment Variables

Cloud Secret Managers

Plugins request secrets.

Core provides access.

---

# Observability

Everything produces telemetry.

Plugin Health

Service Health

Logs

Errors

AI Usage

Cost

Token Usage

CPU

Memory

Indexing

Users always know what the system is doing.

---

# Design Philosophy

Core remains small.

Plugins remain independent.

Services remain isolated.

Knowledge remains portable.

Workspaces remain reproducible.

Users remain in control.

---

# One Sentence Definition

DEVAIOS is an extensible operating system that orchestrates AI, developer tools, infrastructure, and project knowledge into one intelligent workspace.
