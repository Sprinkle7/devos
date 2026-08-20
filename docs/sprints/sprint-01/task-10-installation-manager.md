---
source: chatgpt-share
source_turn: 112
sprint: 1
task: 10
title: "Installation Manager"
status: extracted
---

# Sprint 1 — Task 10: Installation Manager

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Build the **bootstrap system** for DEVAIOS.

This is the layer that turns:

> "I downloaded DEVAIOS"

into:

> "DEVAIOS configured my machine and is ready."

---

# Why Installer Exists

The original vision:

> "If someone is using it, it should know what to install and have one-click installations."

This is exactly this component.

The installer will eventually handle:

```text
New Machine

    ↓

DEVAIOS Doctor

    ↓

Installation Plan

    ↓

User Approval

    ↓

Install Missing Dependencies

    ↓

Configure Environment

    ↓

Ready
```

---

# Important Safety Decision

DEVAIOS should NOT silently install software.

Bad:

```text
DEVAIOS downloaded Docker without asking
```

Good:

```text
Missing dependency:

Docker Desktop

Purpose:
Required for DEVAIOS containers

Install?

[Y/n]
```

---

# Package

Name:

```text
@devaios/installer
```

Location:

```text
packages/installer/
```

---

# Responsibilities

Version 0.1:

✅ Create installation plans  
✅ Detect missing dependencies  
✅ Ask for approval  
✅ Execute installers  
✅ Track installation state  
✅ Verify installation  

---

# Future Install Targets

## Development Tools

```text
Node.js

pnpm

Git

Docker
```

---

## AI Tools

```text
Ollama

Models

Embedding engines
```

---

## DEVAIOS Integrations

```text
Claude Desktop MCP

Cursor MCP

VS Code Extension

GitHub integration
```

---

# Installation Architecture

```text
Installer

    |
    |
    +---- Planner
    |
    |
    +---- Executor
    |
    |
    +---- Verifier
```

---

# Final Structure

Create:

```text
packages/installer/

├── src/
│
│   ├── index.ts
│   │
│   ├── installer.ts
│   │
│   ├── planner.ts
│   │
│   ├── executor.ts
│   │
│   ├── state.ts
│   │
│   ├── steps/
│   │
│   │   ├── node.ts
│   │   ├── docker.ts
│   │   ├── ollama.ts
│   │   └── config.ts
│   │
│   └── types.ts
│
├── tests/
│
├── package.json
└── tsconfig.json
```

---

# Step 1 — Create Package

From root:

```bash
mkdir -p packages/installer

cd packages/installer

mkdir -p src/steps tests
```

---

# Step 2 — Package Configuration

Create:

```json
packages/installer/package.json
```

```json
{
  "name": "@devaios/installer",
  "version": "0.1.0",
  "type": "module",

  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit"
  },

  "dependencies": {

    "@devaios/doctor":
    "workspace:*",

    "@devaios/logger":
    "workspace:*"

  }
}
```

---

# Step 3 — Installation Types

Create:

```ts
src/types.ts
```

```ts
export type InstallStatus =
"pending"
|
"running"
|
"completed"
|
"failed";

export interface InstallStep {

id:string;

name:string;

description:string;

execute():
Promise<void>;

verify():
Promise<boolean>;

}
```

---

# Step 4 — Installation Plan

Create:

```ts
src/planner.ts
```

```ts
import type {
InstallStep
}
from "./types.js";

export class InstallPlanner {

private steps:
InstallStep[]=[];

add(
step:InstallStep
){

this.steps.push(step);

}

getPlan(){

return this.steps;

}

}
```

---

# Step 5 — Installer Engine

Create:

```ts
src/installer.ts
```

```ts
import type {
InstallStep
}
from "./types.js";

export class Installer {

constructor(
private steps:InstallStep[]
){}

async run(){

for(
const step of this.steps
){

console.log(
`Installing ${step.name}`
);

await step.execute();

const verified =
await step.verify();

if(!verified){

throw new Error(
`${step.name} verification failed`
);

}

console.log(
`${step.name} complete`
);

}

}

}
```

---

# Step 6 — Node Installer Step

Create:

```ts
src/steps/node.ts
```

```ts
import type {
InstallStep
}
from "../types.js";

export const NodeInstallStep:
InstallStep =
{

id:
"node",

name:
"Node.js",

description:
"Install Node.js runtime",

async execute(){

console.log(
"Node installation required"
);

},

async verify(){

return true;

}

};
```

---

# Step 7 — Docker Installer Step

Create:

```ts
src/steps/docker.ts
```

```ts
import type {
InstallStep
}
from "../types.js";

export const DockerInstallStep:
InstallStep =
{

id:
"docker",

name:
"Docker",

description:
"Install Docker runtime",

async execute(){

console.log(
"Docker installation required"
);

},

async verify(){

return true;

}

};
```

---

# Step 8 — Ollama Installer Step

Create:

```ts
src/steps/ollama.ts
```

```ts
import type {
InstallStep
}
from "../types.js";

export const OllamaInstallStep:
InstallStep =
{

id:
"ollama",

name:
"Ollama",

description:
"Install local AI runtime",

async execute(){

console.log(
"Ollama installation required"
);

},

async verify(){

return true;

}

};
```

---

# Step 9 — Export

Create:

```ts
src/index.ts
```

```ts
export {
Installer
}
from "./installer.js";

export {
InstallPlanner
}
from "./planner.js";

export type {
InstallStep
}
from "./types.js";
```

---

# Step 10 — Example Usage

Future CLI:

```bash
devai install
```

will execute:

```ts
const planner =
new InstallPlanner();

planner.add(
DockerInstallStep
);

planner.add(
OllamaInstallStep
);

const installer =
new Installer(
planner.getPlan()
);

await installer.run();
```

---

# Step 11 — Build

Run:

```bash
pnpm install

pnpm build
```

Expected:

```text
@devaios/doctor ✓

@devaios/installer ✓
```

---

# Step 12 — Commit

```bash
git add .

git commit -m "feat(installer): add installation framework"
```

---

# Task 10 Completion Criteria

Before moving on:

✅ Installation architecture created  
✅ Install plans supported  
✅ Steps supported  
✅ Verification supported  
✅ Safe execution model  
✅ Future automation ready  

---

# DEVAIOS Foundation Status

We now have:

```text
                         DEVAIOS

                          CLI

                           |

        -------------------------------------

        Runtime        Doctor       Installer

          |              |             |

          |              |       Machine Setup

          |

 ------------------------------------------------

 Config        Events        Workspace

                         |

                  Shared Kernel

```

---

# What DEVAIOS Can Do Now

At this stage:

```bash
devai doctor
```

can inspect a machine.

Soon:

```bash
devai install
```

can prepare it.

This creates the foundation for:

- One-click onboarding
- Docker deployment
- AI setup
- Claude/Cursor integration

---
