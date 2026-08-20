# DEVAIOS

# Engineering Principles

Version: 0.1.0

Status: Living Document

---

# Purpose

This document defines the engineering principles that govern the design, implementation, maintenance, and evolution of DEVAIOS.

Every architectural decision should align with these principles.

Whenever there is uncertainty, simplicity and modularity should take precedence over feature completeness.

---

# The Golden Rule

The Core must remain small.

Everything else should be replaceable.

The Core should orchestrate.

Plugins should implement.

---

# Principle 1

## Plugin First

Every capability should be implemented as a plugin unless there is a compelling reason for it to exist inside Core.

Examples:

✓ GitHub

✓ Git

✓ Docker

✓ Kubernetes

✓ AWS

✓ PostgreSQL

✓ Redis

✓ Ollama

✓ Claude

✓ OpenAI

✓ Gemini

✓ Graphify

✓ Headroom

✓ Ponytail

✓ Jira

✓ Slack

✓ Discord

✓ Filesystem

✓ Playwright

✓ GitLab

Core should know nothing about these systems.

---

# Principle 2

## Core Never Depends on Plugins

Allowed

Core

↓

Plugin

Not Allowed

Plugin

↓

Core Logic

Plugins may use Core APIs.

Core must never import plugin code.

---

# Principle 3

## API First

Everything should be accessible through APIs.

If functionality exists inside the UI, it should also exist through an API.

Benefits:

CLI

SDK

Automation

Future Mobile Apps

Third Party Integrations

---

# Principle 4

## Event Driven

Plugins should communicate using events.

Bad

Plugin A

↓

Plugin B

↓

Plugin C

Good

Plugin A

↓

Event Bus

↓

Subscribers

Example

Repository Indexed

↓

Documentation Plugin

↓

Knowledge Plugin

↓

AI Plugin

↓

Search Plugin

Each plugin reacts independently.

---

# Principle 5

## Offline First

DEVAIOS should continue functioning without internet connectivity.

Unavailable:

Cloud AI

Cloud APIs

Available:

Projects

Knowledge

Search

Documentation

Memory

Ollama

Local Plugins

Offline mode should never corrupt data.

Synchronization happens when connectivity returns.

---

# Principle 6

## Docker First

Every service should have an official Docker image.

Local installation should require minimal manual configuration.

Docker Compose should provide a complete development environment.

Future Kubernetes support must not require changes to application code.

---

# Principle 7

## Local First Storage

Developer knowledge belongs to the developer.

By default:

Chats

Indexes

Embeddings

Knowledge Graph

Project Metadata

Settings

Plugins

should remain on the user's machine.

Cloud synchronization should always be optional.

---

# Principle 8

## Security by Default

Plugins receive only the permissions they request.

Example

GitHub Plugin

Requests:

Read Repositories

Read Pull Requests

Read Issues

No Write Access

If write access is needed:

The user must explicitly approve it.

No plugin receives unrestricted access.

---

# Principle 9

## Fail Gracefully

A failing plugin must never crash the platform.

If AWS Plugin fails:

GitHub continues.

AI continues.

Dashboard continues.

Plugins must be isolated.

---

# Principle 10

## Versioned APIs

Every public interface must be versioned.

Core APIs

Plugin APIs

REST APIs

SDKs

CLI Commands

Breaking changes require migration paths.

---

# Principle 11

## Configuration as Code

Everything configurable should be exportable.

Workspace

Plugins

Providers

Agents

Projects

Permissions

Settings

Example

workspace.yaml

should recreate an identical environment.

---

# Principle 12

## Human Readable

Configuration should be readable.

Preferred

YAML

Markdown

JSON

Avoid proprietary binary formats.

---

# Principle 13

## Markdown First

Documentation should be Markdown.

Architecture

Meeting Notes

ADRs

Project Docs

Tutorials

Knowledge

This enables:

Git

Diffs

Search

AI

Offline editing

---

# Principle 14

## AI Provider Independence

No AI provider should become a hard dependency.

Supported examples

Anthropic

OpenAI

Gemini

Ollama

Groq

OpenRouter

Future providers

Users choose providers.

DEVAIOS adapts.

---

# Principle 15

## Open Standards

Prefer standards over proprietary protocols.

Examples

MCP

OpenAPI

OAuth

Git

Docker

OCI Images

Markdown

SQLite

PostgreSQL

JSON Schema

YAML

Avoid vendor lock-in.

---

# Principle 16

## Small Independent Services

Large systems become difficult to maintain.

Prefer multiple focused services over one monolith.

Example

Search Service

Memory Service

Plugin Service

Indexing Service

AI Router

Authentication

Scheduler

Workers

Each should be independently testable.

---

# Principle 17

## Observable Everything

Every significant action should be observable.

Plugin Load

Plugin Failure

API Calls

AI Requests

Errors

Background Jobs

Indexing

Synchronization

Users should understand what the system is doing.

---

# Principle 18

## Explainability

AI should explain:

Why a tool was used.

Why a document was selected.

Why a model was chosen.

Why a deployment failed.

The platform should never behave like a black box.

---

# Principle 19

## Automation Before Manual Work

If a repetitive task can be automated safely,

it should be.

Examples

Generate README

Generate Changelog

Generate ADR

Generate API Docs

Update Dependencies

Create Release Notes

Environment Validation

Plugin Updates

---

# Principle 20

## Extensibility Over Completeness

Core should solve 80% through extension points rather than implementing every possible feature.

The community should be able to build:

plugins

themes

agents

providers

installers

templates

without modifying Core.

---

# Decision Checklist

Before implementing a feature ask:

Does it belong in Core?

Can it be a plugin?

Can it be event-driven?

Can it work offline?

Can it be configured?

Can it be tested independently?

Can it be versioned?

Can users understand it?

If multiple answers are "No",

reconsider the implementation.

---

# Engineering Philosophy

DEVAIOS should not become larger.

It should become smarter.

The best architecture is not the one with the most code.

It is the one that allows others to build without changing the foundation.

