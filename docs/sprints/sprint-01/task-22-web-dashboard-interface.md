---
source: chatgpt-share
source_turn: 136
sprint: 1
task: 22
title: "Web Dashboard Interface"
status: extracted
---

# Sprint 1 — Task 22: Web Dashboard Interface

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the **visual control center of DEVAIOS**.

This is the interface where a developer manages everything:

- Projects
- AI conversations
- Models
- MCP servers
- Plugins
- Environments
- Memory
- Settings

This is the part that transforms DEVAIOS from a backend framework into a **complete AI Development Operating System**.

---

# Why Dashboard Exists

Currently:

```text
DEVAIOS Core

     |
     |
     CLI commands

```

Powerful, but not accessible.

The dashboard provides:

```text
Human

  ↓

Visual Interface

  ↓

DEVAIOS Core

  ↓

AI + Tools + Projects

```

---

# Product Vision

When you open DEVAIOS:

```
┌───────────────────────────────┐
│ DEVAIOS                       │
├───────────────────────────────┤
│                               │
│ Projects                      │
│                               │
│  • Volition                   │
│  • Cropwhen                   │
│  • DEVAIOS                    │
│                               │
├───────────────────────────────┤
│ AI Assistant                  │
│                               │
│ "Analyze my API performance"  │
│                               │
├───────────────────────────────┤
│ Environment                   │
│                               │
│ Node ✓  Docker ✓ PostgreSQL ✓ │
│                               │
└───────────────────────────────┘
```

---

# Dashboard Architecture

```text
                    Browser

                       |

                 DEVAIOS UI

                       |

              Dashboard API Layer

                       |

 ------------------------------------------------

 Runtime

 Projects

 AI

 MCP

 Plugins

 Knowledge

 Deployment

```

---

# Technology Decision

Recommended:

Frontend:

```text
Next.js

React

TypeScript

Tailwind CSS

shadcn/ui
```

Backend:

Reuse:

```text
DEVAIOS Runtime
```

---

# Package

Name:

```text
@devaios/dashboard
```

Location:

```text
apps/dashboard/
```

---

# Responsibilities

Version 0.1:

✅ Web application  
✅ Authentication foundation  
✅ Project view  
✅ AI chat interface  
✅ System status  
✅ Settings UI  

---

# Monorepo Structure Update

Before:

```
packages/

├── core
├── ai
├── mcp
├── plugins
├── projects

```

After:

```
DEVAIOS

├── apps/

│
├── dashboard/

├── packages/

│
├── core
├── ai
├── mcp
├── plugins
├── projects

```

---

# Create Application

From root:

```bash
mkdir -p apps

cd apps

npx create-next-app dashboard
```

Choose:

```
✔ TypeScript
✔ ESLint
✔ Tailwind CSS
✔ App Router
✔ src directory
```

---

# Dashboard Structure

```
apps/dashboard/

├── src/

│
├── app/

│   ├── page.tsx
│   │
│   ├── projects/
│   │
│   ├── ai/
│   │
│   ├── plugins/
│   │
│   ├── settings/
│
│
├── components/

│
├── lib/

│
├── hooks/

│
└── package.json

```

---

# Core Pages

## 1. Home Dashboard

Route:

```
/
```

Purpose:

Overview.

Displays:

- Active project
- AI provider
- System health
- Recent activity

---

## 2. Projects

Route:

```
/projects
```

Displays:

```
Projects

✓ Volition

Stack:
Next.js
Node
Postgres

✓ Cropwhen

Stack:
Next.js
MongoDB

```

---

## 3. AI Workspace

Route:

```
/ai
```

Interface:

```
--------------------------------

User:

Analyze authentication flow

DEVAIOS:

I found:

3 API endpoints

2 database models

1 security issue

--------------------------------

```

---

## 4. Plugin Manager

Route:

```
/plugins
```

Displays:

```
Installed Plugins

✓ GitHub MCP

✓ Graphify

✓ Headroom

✓ Ponytail

[Install Plugin]

```

---

## 5. Environment

Route:

```
/environment
```

Shows:

```
Runtime Status

Node

24.12 ✓

Python

3.14 ✓

Docker

Running ✓

Postgres

Running ✓

```

---

## 6. Settings

Route:

```
/settings
```

Contains:

```
AI Providers

Secrets

Appearance

Account

Backup

```

---

# UI Component System

Install:

```bash
npm install lucide-react
```

For components:

Use:

```
shadcn/ui
```

Install:

```bash
npx shadcn@latest init
```

---

# Dashboard API Layer

Create:

```
packages/api
```

Purpose:

Expose DEVAIOS services:

```
Dashboard

    |

API

    |

DEVAIOS Core

```

---

# API Endpoints

Version 0.1:

## Projects

```
GET /api/projects
```

Returns:

```json
[
 {
  "name":"Volition",
  "status":"active"
 }
]
```

---

## AI Providers

```
GET /api/ai/providers
```

Returns:

```json
[
 "ollama",
 "claude",
 "openai"
]
```

---

## System Health

```
GET /api/system/status
```

Returns:

```json
{
"docker":true,
"database":true,
"mcp":true
}
```

---

# Dashboard Design Principles

## 1. Everything is discoverable

No hidden commands.

---

## 2. Every action has explanation

Example:

Instead of:

```
Install MCP
```

Show:

```
Install MCP Server

This allows DEVAIOS to connect
with GitHub repositories.

[Install]

```

---

## 3. AI First

Every page has:

```
Ask DEVAIOS
```

button.

Example:

Project page:

```
[Ask about this project]

```

---

# Docker Integration

Dashboard runs with DEVAIOS:

```yaml
services:

 devaios-core:

   image:
    devaios

 dashboard:

   image:
    devaios-dashboard

   ports:

    - 3000:3000

 volumes:

    - devaios-data:/data

```

---

# Environment Variables

Create:

```
.env.example
```

```env
DEVAIOS_API_URL=http://localhost:4000

DEVAIOS_ENV=development

```

---

# Build

Run:

```bash
pnpm install

pnpm build
```

Expected:

```
apps/dashboard ✓
```

---

# Commit

```bash
git add .

git commit -m "feat(dashboard): add DEVAIOS web interface"
```

---

# Task 22 Completion Criteria

Before moving:

✅ Dashboard application exists  
✅ Project UI exists  
✅ AI workspace exists  
✅ Plugin management UI foundation exists  
✅ Environment monitoring UI exists  
✅ Settings foundation exists  

---

# DEVAIOS Architecture Update

We now have the complete product shape:

```
                         DEVAIOS

                           USER

                            |

                     Web Dashboard

                            |

                         API Layer

                            |

 ----------------------------------------------------------------

 Identity

 Projects

 Runtime

 AI

 MCP

 Plugins

 Knowledge

 Memory

 Secrets

 Deployment

                            |

 ----------------------------------------------------------------

 Claude

 Ollama

 OpenAI

 Cursor

 Claude Desktop

 Docker

 Cloud

```

---

# Important Milestone

At this point DEVAIOS is no longer only a collection of packages.

It is becoming:

> A self-hosted AI development operating system.

---
