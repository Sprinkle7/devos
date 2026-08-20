---
source: chatgpt-share
source_turn: 174
sprint: 3
task: 1
title: "DEVAIOS Monorepo Infrastructure"
status: extracted
---

# Sprint 3 — Task 1: DEVAIOS Monorepo Infrastructure

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Now we move from **designing components** into building the **real engineering foundation**.

We currently have many packages:

```text id="current-packages"
DEVAIOS

apps/

└── desktop

packages/

├── core

├── agents

├── tools

├── security

├── memory

├── workspace

├── chat

├── agent-center

├── plugins

├── mcp

├── devops

└── analytics

```

Managing these separately becomes difficult.

We need a professional monorepo system.

---

# Product Vision

Instead of:

```text id="bad-flow"
Repository A

Repository B

Repository C

Repository D

Different versions

Different configs

Different builds

```

DEVAIOS becomes:

```text id="good-flow"
                 DEVAIOS

                  ONE REPOSITORY

                        |

 ------------------------------------------------

 Desktop App

 Core Packages

 Shared UI

 AI Systems

 Infrastructure

 Tests

 Documentation

```

---

# Technology Stack

We use:

## Package Manager

```text
pnpm workspaces
```

---

## Build System

```text
Turborepo
```

---

## Language

```text
TypeScript
```

---

## Versioning

```text
Changesets
```

---

## CI/CD

```text
GitHub Actions
```

---

# Final Repository Structure

```text id="final-tree"
devaios/

├── apps/
│
│   └── desktop/
│
│
├── packages/
│
│   ├── core/
│   ├── agents/
│   ├── tools/
│   ├── security/
│   ├── memory/
│   ├── workspace/
│   ├── chat/
│   ├── agent-center/
│   ├── plugins/
│   ├── mcp/
│   ├── devops/
│   ├── analytics/
│   └── ui/
│
│
├── docs/
│
├── scripts/
│
├── .github/
│
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json
└── README.md

```

---

# Step 1 — Initialize Root Project

From repository root:

```bash id="root-init"
npm init -y
```

---

# Step 2 — Install pnpm

If not installed:

```bash id="install-pnpm"
npm install -g pnpm
```

Check:

```bash
pnpm --version
```

Expected:

```text
10.x.x
```

---

# Step 3 — Create Workspace File

Create:

```text id="workspace-file"
pnpm-workspace.yaml
```

Content:

```yaml id="workspace-yaml"
packages:

  - "apps/*"

  - "packages/*"

```

---

# Step 4 — Root Package Configuration

Update:

```json id="root-package"
package.json
```

```json
{
"name":"devaios",

"private":true,

"version":"0.1.0",

"packageManager":
"pnpm@10.0.0",

"scripts":{

"dev":
"turbo dev",

"build":
"turbo build",

"test":
"turbo test",

"lint":
"turbo lint"

},

"devDependencies":{

"turbo":"latest",

"typescript":"latest"

}

}
```

---

# Step 5 — Install Turbo

Run:

```bash id="turbo-install"
pnpm add turbo -D
```

---

# Step 6 — Turbo Configuration

Create:

```text id="turbo-file"
turbo.json
```

Content:

```json
{
"$schema":
"https://turbo.build/schema.json",

"tasks":{

"build":{

"dependsOn":[

"^build"

],

"outputs":[

"dist/**"

]

},

"dev":{

"cache":false

},

"test":{

"dependsOn":[

"build"

]

}

}

}
```

---

# Step 7 — Shared TypeScript Configuration

Create:

```text id="ts-file"
tsconfig.json
```

```json
{
"compilerOptions":{

"target":
"ES2022",

"module":
"ESNext",

"moduleResolution":
"Bundler",

"strict":
true,

"skipLibCheck":
true,

"declaration":
true

}

}
```

---

# Step 8 — Package Template

Every package follows:

```text id="package-template"
package-name/

├── src/

│   └── index.ts

├── package.json

├── tsconfig.json

└── README.md

```

---

# Step 9 — Workspace Dependencies

Example:

Desktop depends on:

```json
{
"dependencies":{

"@devaios/core":
"workspace:*",

"@devaios/ui":
"workspace:*",

"@devaios/chat":
"workspace:*"

}

}
```

---

# Step 10 — Create Package Naming Rules

All internal packages:

```text id="naming"
@devaios/package-name
```

Examples:

```text
@devaios/core

@devaios/ui

@devaios/agents

@devaios/mcp

```

---

# Step 11 — Build Order

Turbo automatically creates:

```text id="build-order"
core

↓

agents

↓

workspace

↓

chat

↓

desktop

```

Because dependencies define the graph.

---

# Step 12 — Add Changesets

Install:

```bash
pnpm add @changesets/cli -D
```

Initialize:

```bash
pnpm changeset init
```

Creates:

```text id="changesets"
.changeset/

```

---

# Purpose

When releasing:

```text
@devaios/core

1.0.0

@devaios/ui

0.5.0

```

Changesets manages:

- Versions
- Changelogs
- Publishing

---

# Step 13 — Add ESLint

Install:

```bash
pnpm add eslint -D
```

Create:

```text id="eslint"
eslint.config.js
```

---

# Step 14 — Add Prettier

Install:

```bash
pnpm add prettier -D
```

Create:

```text id="prettier"
.prettierrc
```

```json
{
"semi":true,

"singleQuote":true,

"printWidth":100

}
```

---

# Step 15 — Git Ignore

Create:

```text id="gitignore"
.gitignore
```

Add:

```text
node_modules

dist

.env

.DS_Store

.turbo

```

---

# Step 16 — CI/CD Foundation

Create:

```text id="github"
.github/workflows/
```

File:

```text
ci.yml
```

---

Content:

```yaml
name:
DEVAIOS CI

on:

  pull_request:

  push:

    branches:

      - main

jobs:

 build:

  runs-on:
    ubuntu-latest

  steps:

  - uses:
      actions/checkout@v4

  - uses:
      pnpm/action-setup@v4

  - run:
      pnpm install

  - run:
      pnpm build

  - run:
      pnpm test

```

---

# Step 17 — First Full Build

Run:

```bash id="first-build"
pnpm install

pnpm build
```

Expected:

```text
@devaios/core       ✓

@devaios/agents     ✓

@devaios/ui         ✓

@devaios/chat       ✓

desktop             ✓

BUILD SUCCESSFUL

```

---

# Step 18 — Commit

```bash
git add .

git commit -m "chore: setup DEVAIOS monorepo infrastructure"
```

---

# Task 1 Completion Criteria

Before moving:

✅ pnpm workspace created  
✅ Turbo build system working  
✅ Shared TypeScript config  
✅ Package dependency graph  
✅ Versioning system  
✅ CI pipeline foundation  
✅ Code quality tooling  

---

# DEVAIOS Architecture Update

Now the platform has a professional foundation:

```text id="final-architecture"
                         DEVAIOS

                    Monorepo Platform

                            |

 -------------------------------------------------

 Desktop App

 Shared UI

 Core Engine

 AI Agents

 MCP

 Memory

 DevOps

 Analytics

                            |

 -------------------------------------------------

 Build System

 CI/CD

 Versioning

 Testing

```

---

# New Capability

DEVAIOS can now scale like a real company product:

Multiple teams can work on:

```text
Agent Team

UI Team

Infrastructure Team

AI Team

Cloud Team

```

without breaking each other.

---
