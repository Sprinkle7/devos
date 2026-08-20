---
source: chatgpt-share
source_turn: 132
sprint: 1
task: 20
title: "Environment & Runtime Manager"
status: extracted
---

# Sprint 1 — Task 20: Environment & Runtime Manager

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the **environment intelligence layer** of DEVAIOS.

This component manages everything required to run projects:

- Programming languages
- Runtime versions
- Dependencies
- Containers
- Databases
- Local services
- Development environments

---

# Why Runtime Management Matters

A developer's machine is usually messy:

Example:

```text id="v9f3xs"
Machine

Node 18

Node 20

Node 24

Python 3.11

Python 3.14

Docker

Postgres

Redis

Different project requirements
```

---

# DEVAIOS Goal

Instead of manually remembering:

```bash
nvm use 20

docker compose up

brew services start postgres

python venv activate
```

DEVAIOS understands:

```text id="x0t3sm"
Open Project

        ↓

Analyze Requirements

        ↓

Prepare Environment

        ↓

Start Services

        ↓

Ready
```

---

# Architecture

```text id="r9z4po"
                    DEVAIOS

                       |

              Runtime Manager

                       |

 ------------------------------------------------

 Node Runtime

 Python Runtime

 Docker Runtime

 Database Runtime

 Service Manager

```

---

# Example Project Environment

File:

```yaml id="4e1f3r"
devai.environment.yml

project:

name: volition

runtime:

node:24

python:3.14

services:

postgres:true

redis:true

docker:true

```

---

# Future Commands

Eventually:

```bash id="6j8v0m"
devai env scan

devai env install

devai env start

devai env doctor

devai env reset
```

---

# Package

Name:

```text id="8x5y12"
@devaios/runtime-manager
```

Location:

```text id="3g7j4a"
packages/runtime-manager/
```

---

# Responsibilities

Version 0.1:

✅ Runtime abstraction  
✅ Environment detection  
✅ Version checking  
✅ Service management foundation  
✅ Project environment linking  

---

# Final Structure

Create:

```text id="v6r0h8"
packages/runtime-manager/

├── src/
│
│   ├── index.ts
│   │
│   ├── runtime.ts
│   │
│   ├── manager.ts
│   │
│   ├── detector.ts
│   │
│   ├── service.ts
│   │
│   ├── registry.ts
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

```bash id="0j9j5v"
mkdir -p packages/runtime-manager

cd packages/runtime-manager

mkdir src tests
```

---

# Step 2 — Package Configuration

Create:

```json id="h0m4dv"
packages/runtime-manager/package.json
```

```json id="4yd7bq"
{
  "name": "@devaios/runtime-manager",
  "version": "0.1.0",
  "type": "module",

  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit"
  },

  "dependencies": {

    "@devaios/projects":
    "workspace:*",

    "@devaios/installer":
    "workspace:*"

  }
}
```

---

# Step 3 — Runtime Types

Create:

```ts id="m8c6jh"
src/types.ts
```

```ts id="l7a3r9"
export type RuntimeType =

"node"

|
"python"

|
"docker"

|
"database"

|
"service";

export interface RuntimeInfo {

id:string;

type:
RuntimeType;

name:string;

version:string;

installed:boolean;

}
```

---

# Step 4 — Runtime Interface

Create:

```ts id="9ph7oi"
src/runtime.ts
```

```ts id="4w0f84"
import type {
RuntimeInfo
}
from "./types.js";

export interface Runtime {

info:
RuntimeInfo;

install():
Promise<void>;

start():
Promise<void>;

stop():
Promise<void>;

check():
Promise<boolean>;

}
```

---

# Step 5 — Runtime Registry

Create:

```ts id="5k0m0q"
src/registry.ts
```

```ts id="d7g4b1"
import type {
Runtime
}
from "./runtime.js";

export class RuntimeRegistry {

private runtimes =
new Map<string,Runtime>();

register(
runtime:Runtime
){

this.runtimes.set(
runtime.info.id,
runtime
);

}

get(
id:string
){

return this.runtimes.get(id);

}

list(){

return Array.from(
this.runtimes.values()
);

}

}
```

---

# Step 6 — Runtime Detector

Create:

```ts id="6m3t9w"
src/detector.ts
```

```ts id="7p3q4b"
export class RuntimeDetector {

async detectNode(){

return {

name:
"Node.js",

available:true

};

}

async detectDocker(){

return {

name:
"Docker",

available:true

};

}

}
```

---

# Step 7 — Service Manager

Create:

```ts id="5n4s0w"
src/service.ts
```

```ts id="9h7q3m"
export interface Service {

name:string;

start():
Promise<void>;

stop():
Promise<void>;

status():
Promise<string>;

}
```

---

# Step 8 — Runtime Manager

Create:

```ts id="j4n8bx"
src/manager.ts
```

```ts id="h9f2wv"
import {
RuntimeRegistry
}
from "./registry.js";

export class RuntimeManager {

constructor(
private registry:
RuntimeRegistry
){}

async checkAll(){

const results=[];

for(
const runtime
of this.registry.list()
){

results.push({

runtime:
runtime.info.name,

available:
await runtime.check()

});

}

return results;

}

}
```

---

# Step 9 — Export

Create:

```ts id="4q7l9x"
src/index.ts
```

```ts id="f6o0yz"
export {
RuntimeManager
}
from "./manager.js";

export {
RuntimeRegistry
}
from "./registry.js";

export {
RuntimeDetector
}
from "./detector.js";

export type {
Runtime
}
from "./runtime.js";
```

---

# Step 10 — Test

Create:

```ts id="x8n5pj"
tests/runtime.test.ts
```

```ts id="4z0f9k"
import {
describe,
expect,
it
}
from "vitest";

import {
RuntimeRegistry
}
from "../src/index.js";

describe(
"runtime",
()=>{

it(
"creates registry",
()=>{

const registry =
new RuntimeRegistry();

expect(
registry.list()
.length
)
toBe(0);

});

});
```

---

# Step 11 — Build

Run:

```bash id="2v8n8z"
pnpm install

pnpm build
```

Expected:

```text id="8w1h6b"
@devaios/runtime-manager ✓
```

---

# Step 12 — Commit

```bash id="4y8f4k"
git add .

git commit -m "feat(runtime): add environment manager foundation"
```

---

# Task 20 Completion Criteria

Before moving:

✅ Runtime abstraction created  
✅ Environment detection foundation exists  
✅ Services model created  
✅ Project environment support ready  
✅ Installer integration ready  

---

# DEVAIOS Architecture Update

The system is now approaching a complete development OS:

```text
                         DEVAIOS

                            CLI

                             |

                          Runtime

                             |

 ----------------------------------------------------------------

 Identity

 Projects

 Workspace

 Environment

 Storage

 Secrets

 Plugins

 AI

 Context

 Knowledge

 MCP

                             |

 ----------------------------------------------------------------

 Code

 Tools

 Models

 Containers

 Services

 Cloud

```

---

# New Capability

Future flow:

```bash
devai open volition
```

DEVAIOS:

```
Loading project...

✓ Found Node 24 requirement
✓ Found PostgreSQL dependency
✓ Found Redis dependency
✓ Loading AI context
✓ Loading MCP tools
✓ Loading knowledge graph

Environment ready.
```

---

# Sprint 1 Progress

We have completed:

✅ Core platform  
✅ Memory  
✅ AI layer  
✅ Plugins  
✅ MCP  
✅ Projects  
✅ Runtime foundation  

---
