---
source: chatgpt-share
source_turn: 106
sprint: 1
task: 7
title: "Workspace Service"
status: extracted
---

# Sprint 1 — Task 7: Workspace Service

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the first **domain-level service** inside DEVAIOS.

Until now, we built infrastructure:

```text
Shared Kernel
        |
Config
        |
Logger
        |
Events
        |
Runtime
```

Now we create something DEVAIOS actually understands:

> A Workspace.

---

# What is a Workspace?

A Workspace is the root boundary of engineering intelligence.

Everything belongs to a workspace:

```text id="1qug3h"
Workspace

 ├── Repositories

 ├── Projects

 ├── Services

 ├── Documentation

 ├── Infrastructure

 ├── AI Context

 └── Knowledge Graph
```

---

# Example

A developer might have:

```text
Workspace:
Volition Platform

Repositories:

- backend-api
- web-dashboard
- mobile-app

Infrastructure:

- AWS
- PostgreSQL
- Redis

Documentation:

- Architecture
- ADRs
```

DEVAIOS will eventually understand all of this.

---

# Package

Name:

```text
@devaios/workspace
```

Location:

```text
packages/workspace/
```

---

# Responsibilities

The Workspace service will:

✅ Create workspaces  
✅ Load workspaces  
✅ Validate workspace configuration  
✅ Store workspace metadata  
✅ Emit workspace events  

---

# Workspace Configuration

A workspace is defined by:

```yaml
workspace.yaml
```

Example:

```yaml
name: volition

description: Recruitment platform

repositories:

  - name: api
    path: ./api

  - name: frontend
    path: ./frontend

environment:

  type: development
```

---

# Final Structure

Create:

```text
packages/workspace/

├── src/
│
│   ├── index.ts
│   │
│   ├── workspace.ts
│   │
│   ├── workspace-manager.ts
│   │
│   ├── schema.ts
│   │
│   ├── repository.ts
│   │
│   └── events.ts
│
├── tests/
│
├── package.json
├── tsconfig.json
└── README.md
```

---

# Step 1 — Create Package

From root:

```bash
mkdir -p packages/workspace

cd packages/workspace

mkdir src tests
```

---

# Step 2 — Package Configuration

Create:

```json
packages/workspace/package.json
```

```json
{
  "name": "@devaios/workspace",
  "version": "0.1.0",
  "type": "module",

  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit"
  },

  "dependencies": {
    "@devaios/shared-kernel": "workspace:*",
    "@devaios/events": "workspace:*"
  }
}
```

---

# Step 3 — Workspace Schema

Create:

```ts
src/schema.ts
```

```ts
import { z } from "zod";

export const WorkspaceSchema =
z.object({

 name:
 z.string()
 .min(1),

 description:
 z.string()
 .optional(),

 repositories:
 z.array(

  z.object({

   name:
   z.string(),

   path:
   z.string()

  })

 )
 .default([])

});

export type WorkspaceConfig =
z.infer<typeof WorkspaceSchema>;
```

---

# Step 4 — Repository Entity

Create:

```ts
src/repository.ts
```

```ts
export interface Repository {

 name:string;

 path:string;

}
```

---

# Step 5 — Workspace Entity

Create:

```ts
src/workspace.ts
```

```ts
import type {
 Repository
}
from "./repository.js";

export interface Workspace {

id:string;

name:string;

description?:string;

repositories:
Repository[];

createdAt:Date;

}
```

---

# Step 6 — Workspace Events

Create:

```ts
src/events.ts
```

```ts
export const WorkspaceEvents = {

CREATED:
"WorkspaceCreated",

OPENED:
"WorkspaceOpened",

CLOSED:
"WorkspaceClosed"

};
```

---

# Step 7 — Workspace Manager

Create:

```ts
src/workspace-manager.ts
```

```ts
import {
 randomUUID
}
from "node:crypto";

import {
 WorkspaceSchema
}
from "./schema.js";

import type {
 Workspace
}
from "./workspace.js";

import {
 EventBus
}
from "@devaios/events";

export class WorkspaceManager {

constructor(
 private events:EventBus
){}

create(
 input:unknown
):Workspace{

 const data =
 WorkspaceSchema.parse(
  input
 );

 const workspace:Workspace =
 {

 id:
 randomUUID(),

 name:
 data.name,

 description:
 data.description,

 repositories:
 data.repositories,

 createdAt:
 new Date()

 };

 this.events.publish({

  id:
  randomUUID(),

  type:
  "WorkspaceCreated",

  timestamp:
  new Date(),

  payload:
  workspace

 });

 return workspace;

}

}
```

---

# Step 8 — Export

Create:

```ts
src/index.ts
```

```ts
export {
 WorkspaceManager
}
from "./workspace-manager.js";

export type {
 Workspace
}
from "./workspace.js";

export {
 WorkspaceEvents
}
from "./events.js";
```

---

# Step 9 — Test

Create:

```ts
tests/workspace.test.ts
```

```ts
import {
 describe,
 expect,
 it
}
from "vitest";

import {
 WorkspaceManager
}
from "../src/index.js";

import {
 EventBus
}
from "@devaios/events";

describe(
"workspace",
()=>{

it(
"creates workspace",
()=>{

const manager =
new WorkspaceManager(
 new EventBus()
);

const workspace =
manager.create({

 name:"test-project",

 repositories:[
  {
   name:"api",
   path:"./api"
  }
 ]

});

expect(
workspace.name
)
.toBe(
"test-project"
);

});

});
```

---

# Step 10 — Build

From root:

```bash
pnpm build
```

Expected:

```text
@devaios/shared-kernel ✓

@devaios/config ✓

@devaios/logger ✓

@devaios/events ✓

@devaios/runtime ✓

@devaios/workspace ✓
```

---

# Step 11 — Commit

```bash
git add .

git commit -m "feat(workspace): add workspace management"
```

---

# Task 7 Completion Criteria

Before moving on:

✅ Workspace entity created  
✅ Repository model created  
✅ Workspace validation added  
✅ Workspace events created  
✅ Event bus integration works  
✅ Tests pass  
✅ Builds correctly  

---

# DEVAIOS Progress

We now have:

```text
                    DEVAIOS

                      Runtime

                         |

        ---------------------------------

        Config     Logger     Events

                         |

                  Workspace Layer

                         |

                  Shared Kernel

```

---

# Important Design Decision

The Workspace becomes the **root context boundary**.

Later:

When Claude asks:

> "Explain authentication flow"

DEVAIOS will not search the whole machine.

It will reason inside:

```text
Workspace
    |
    |
    Project
    |
    |
    Repository
    |
    |
    Code
```

This keeps context accurate and prevents AI hallucination.

---
