# DEVAIOS

# Workspace Specification

Version: 0.1.0

Status: Draft

---

# Purpose

The Workspace is the highest-level object in DEVAIOS.

Everything belongs to a Workspace.

A Workspace represents a complete engineering environment.

A Workspace is portable.

A Workspace is reproducible.

A Workspace is self-contained.

---

# Philosophy

Developers don't build repositories.

They build products.

Products consist of:

• multiple repositories

• databases

• cloud infrastructure

• documentation

• AI memory

• knowledge

• secrets

• agents

• automation

• deployments

DEVAIOS should organize around Products.

Not Git repositories.

---

# Definition

A Workspace is a container that describes everything required to develop, understand, deploy, maintain and operate one or more software products.

A Workspace is the smallest portable unit inside DEVAIOS.

---

# Goals

A Workspace should allow a developer to:

Open one file.

Restore everything.

Continue working immediately.

No manual setup.

---

# Workspace Contains

Projects

Plugins

Services

Agents

Knowledge

Memory

Tasks

Secrets

AI Providers

Recipes

Blueprints

Settings

Documentation

Deployments

Monitoring

Logs

Search Indexes

Vector Indexes

Custom Commands

Templates

---

# Workspace Structure

workspace/

    workspace.yaml

    projects/

    docs/

    knowledge/

    memory/

    agents/

    plugins/

    recipes/

    templates/

    automations/

    settings/

    logs/

    backups/

    cache/

---

# Workspace Manifest

Every workspace contains:

workspace.yaml

This file defines the workspace.

Example

name: CropWhen

version: 1

projects:

- frontend

- backend

- mobile

providers:

- anthropic

- ollama

plugins:

- github

- docker

- graphify

- headroom

agents:

- architect

- backend

- frontend

services:

- postgres

- redis

- qdrant

---

# Workspace Lifecycle

Create

↓

Initialize

↓

Install

↓

Index

↓

Analyze

↓

Generate Knowledge

↓

Generate DNA

↓

Ready

---

# Workspace Creation

Methods

Blank

Clone Git Repository

Import Existing Project

Template

Blueprint

Marketplace

---

# Workspace States

Creating

Installing

Indexing

Analyzing

Ready

Updating

Repairing

Archived

Deleted

---

# Workspace Startup

When opening a workspace DEVAIOS should:

Load configuration

↓

Validate environment

↓

Check plugins

↓

Check services

↓

Check providers

↓

Restore memory

↓

Load knowledge

↓

Index changes

↓

Generate context

↓

Workspace Ready

---

# Workspace Shutdown

Before closing

Save session

Flush cache

Store memory

Complete background jobs

Create restore point

Shutdown services

---

# Workspace DNA

Every workspace owns a continuously updated DNA profile.

DNA contains

Languages

Frameworks

Architecture

Infrastructure

Cloud Providers

Dependencies

Databases

Authentication

CI/CD

Testing

Performance

Security

Documentation

Technical Debt

Health Score

Ownership

Architecture Style

Package Managers

Licenses

API Surface

Events

Workflows

AI Providers

MCP Servers

The DNA is generated automatically.

No manual editing.

---

# Workspace Health

Every workspace has a health score.

Categories

Security

Performance

Documentation

Architecture

Dependencies

Testing

Deployment

Infrastructure

AI Readiness

Knowledge Coverage

Automation

Developer Experience

Scores should improve over time.

---

# Workspace Memory

Memory belongs to the workspace.

Examples

Current Sprint

Recent AI Conversations

Open Tasks

Recent Decisions

Temporary Notes

Developer Preferences

Memory is searchable.

Memory can expire.

Knowledge cannot.

---

# Workspace Knowledge

Knowledge belongs permanently.

Architecture

Meeting Notes

Documentation

API Docs

Design Decisions

Runbooks

Deployment History

Generated Documentation

Knowledge survives forever.

---

# Workspace Services

Services are attached.

Examples

Postgres

Redis

Qdrant

Ollama

MinIO

Temporal

Kafka

Workers

Scheduler

Users enable only what they need.

---

# Workspace Plugins

Plugins belong to a Workspace.

Example

Workspace A

AWS

Terraform

Docker

Workspace B

Firebase

Flutter

Android

Workspace C

Laravel

MySQL

PHP

Different workspaces can have different capabilities.

---

# Workspace Agents

Every workspace owns agents.

Architect

Backend

Frontend

DevOps

Security

Reviewer

QA

Documentation

Agents inherit workspace context automatically.

---

# Workspace Secrets

Secrets are references.

Never stored directly.

Examples

AWS

GitHub

Anthropic

OpenAI

Database Passwords

SSH Keys

Vaults

---

# Workspace Recipes

Recipes automate common tasks.

Examples

Create API

Deploy Production

Generate Documentation

Setup Redis

Install Dependencies

Index Repository

Run Tests

Recipes are reusable.

---

# Workspace Blueprints

Blueprints describe complete environments.

A Blueprint should recreate:

Projects

Plugins

Services

Agents

Knowledge

Settings

Recipes

Providers

Documentation

Everything except secrets.

---

# Workspace Snapshots

Users should create snapshots.

Snapshot includes

Settings

Knowledge

Memory

Plugins

Workspace Manifest

Configuration

Indexes

Agents

Restoring a snapshot recreates the previous state.

---

# Workspace Synchronization

Future feature.

Sync

Knowledge

Settings

Memory

Blueprints

Documentation

Workspace DNA

Between devices.

Projects remain local unless explicitly synchronized.

---

# Workspace Permissions

Permissions should exist at workspace level.

Examples

Read

Write

Admin

Plugin Installation

Service Management

AI Usage

Deployments

Secrets

Useful for future team support.

---

# Workspace Goals

Every workspace defines goals.

Examples

Launch MVP

Reduce Technical Debt

Improve Documentation

Increase Test Coverage

Reduce AI Costs

Agents should understand these goals.

---

# Workspace Backups

Automatic.

Daily.

Encrypted.

Incremental.

One-click restore.

---

# Workspace Philosophy

A Workspace is not a folder.

A Workspace is not a repository.

A Workspace is a living representation of an entire software product.

Everything the developer needs should belong to the Workspace.

Nothing should exist outside of it.

---

# Future

In the future, Workspaces may become shareable.

A developer could send another developer a Workspace Blueprint.

After connecting secrets,

DEVAIOS reconstructs the entire engineering environment automatically.

