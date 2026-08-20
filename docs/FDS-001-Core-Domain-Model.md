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
