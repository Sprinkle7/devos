---
source: chatgpt-share
source_turn: 130
sprint: 1
task: 19
title: "Project Management System"
status: extracted
---

# Sprint 1 — Task 19: Project Management System

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the **project intelligence layer** of DEVAIOS.

This is the component that allows DEVAIOS to understand and manage all your software projects from one central location.

Your original goal:

> "I want a central hub for myself so I can manage my projects."

This is that foundation.

---

# Why Project Management Exists

Today your projects are scattered:

```text id="u4w2q7"
~/Projects

 ├── Volition

 ├── Cropwhen

 ├── DEVAIOS

 ├── Mobile Apps

 ├── AWS Projects

 └── Experiments

```

Each project has:

- Different repositories
- Different AI context
- Different tools
- Different configurations

DEVAIOS needs a brain that understands:

```text id="a8zq2m"
Project

 |
 |
 Repository

 |
 |
 Technology Stack

 |
 |
 Environment

 |
 |
 AI Context

 |
 |
 Knowledge Graph

 |
 |
 MCP Tools

```

---

# Project Architecture

```text id="4az8wh"
                    DEVAIOS

                       |

              Project Manager

                       |

 ------------------------------------------------

 Projects

 Repositories

 Environments

 Dependencies

 AI Context

 Knowledge Graph

```

---

# Example Project

```json id="7kmr9d"
{
"id":"volition",

"name":"Volition",

"type":"web-platform",

"stack":[

"Next.js",

"Node.js",

"PostgreSQL"

],

"repositories":[

"frontend",

"api"

],

"aiProvider":

"claude"

}
```

---

# Future Features

Later:

```text id="v0zv7k"
devai project create

devai project scan

devai project analyze

devai project deploy

devai project backup

devai project ai
```

---

# Package

Name:

```text id="l1j4qk"
@devaios/projects
```

Location:

```text id="h8d4b9"
packages/projects/
```

---

# Responsibilities

Version 0.1:

✅ Project model  
✅ Repository tracking  
✅ Project registry  
✅ Project metadata  
✅ Project manager  
✅ Workspace connection  

---

# Final Structure

Create:

```text id="yq6d0d"
packages/projects/

├── src/
│
│   ├── index.ts
│   │
│   ├── project.ts
│   │
│   ├── repository.ts
│   │
│   ├── manager.ts
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

```bash id="jd3z8c"
mkdir -p packages/projects

cd packages/projects

mkdir src tests
```

---

# Step 2 — Package Configuration

Create:

```json id="4gh2s1"
packages/projects/package.json
```

```json id="77r4ok"
{
  "name": "@devaios/projects",
  "version": "0.1.0",
  "type": "module",

  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit"
  },

  "dependencies": {

    "@devaios/storage":
    "workspace:*",

    "@devaios/context":
    "workspace:*",

    "@devaios/knowledge":
    "workspace:*"

  }
}
```

---

# Step 3 — Project Types

Create:

```ts id="9c0qvh"
src/types.ts
```

```ts id="5m3r5j"
export type ProjectType =

"web"

|
"mobile"

|
"backend"

|
"library"

|
"ai";

export interface ProjectConfig {

id:string;

name:string;

type:
ProjectType;

path:string;

createdAt:Date;

}
```

---

# Step 4 — Repository Model

Create:

```ts id="m5x7wp"
src/repository.ts
```

```ts id="kj6rj4"
export interface Repository {

id:string;

name:string;

url?:string;

path:string;

branch?:string;

}
```

---

# Step 5 — Project Entity

Create:

```ts id="p4x4ut"
src/project.ts
```

```ts id="9xm7ef"
import type {
ProjectConfig
}
from "./types.js";

import type {
Repository
}
from "./repository.js";

export class Project {

private repositories:
Repository[]=[];

constructor(
public config:
ProjectConfig
){}

addRepository(
repo:Repository
){

this.repositories.push(
repo
);

}

getRepositories(){

return this.repositories;

}

info(){

return this.config;

}

}
```

---

# Step 6 — Project Registry

Create:

```ts id="j8w4o0"
src/registry.ts
```

```ts id="v0h5pz"
import {
Project
}
from "./project.js";

export class ProjectRegistry {

private projects =
new Map<string,Project>();

register(
project:Project
){

this.projects.set(
project.info().id,
project
);

}

get(
id:string
){

return this.projects.get(
id
);

}

list(){

return Array.from(
this.projects.values()
);

}

}
```

---

# Step 7 — Project Manager

Create:

```ts id="h1s7qv"
src/manager.ts
```

```ts id="x8x3s0"
import {
ProjectRegistry
}
from "./registry.js";

import {
Project
}
from "./project.js";

export class ProjectManager {

constructor(
private registry:
ProjectRegistry
){}

create(
config:any
){

const project =
new Project(
config
);

this.registry.register(
project
);

return project;

}

list(){

return this.registry.list();

}

}
```

---

# Step 8 — Export

Create:

```ts id="y6q7bh"
src/index.ts
```

```ts id="1d5x8q"
export {
Project
}
from "./project.js";

export {
ProjectRegistry
}
from "./registry.js";

export {
ProjectManager
}
from "./manager.js";

export type {
ProjectConfig
}
from "./types.js";
```

---

# Step 9 — Test

Create:

```ts id="r9z7yw"
tests/projects.test.ts
```

```ts id="w2n7kx"
import {
describe,
expect,
it
}
from "vitest";

import {
Project,
ProjectRegistry
}
from "../src/index.js";

describe(
"projects",
()=>{

it(
"registers project",
()=>{

const registry =
new ProjectRegistry();

const project =
new Project({

id:"devaios",

name:"DEVAIOS",

type:"ai",

path:"/projects/devaios",

createdAt:
new Date()

});

registry.register(
project
);

expect(
registry.list()
.length
)
.toBe(1);

});

});
```

---

# Step 10 — Build

Run:

```bash id="yqk1h3"
pnpm install

pnpm build
```

Expected:

```text id="xg6c1j"
@devaios/projects ✓
```

---

# Step 11 — Commit

```bash id="6xq6q8"
git add .

git commit -m "feat(projects): add project management system"
```

---

# Task 19 Completion Criteria

Before moving:

✅ Projects can be registered  
✅ Repositories can be attached  
✅ Project metadata exists  
✅ Workspace integration ready  
✅ AI context integration ready  
✅ Knowledge graph integration ready  

---

# DEVAIOS Architecture Update

Now DEVAIOS understands projects:

```text
                         DEVAIOS

                            CLI

                             |

                          Runtime

                             |

 -----------------------------------------------------------------

 Identity

 Projects

 Workspace

 Context

 Knowledge

 AI

 MCP

 Plugins

 Storage

 Secrets

                             |

 -----------------------------------------------------------------

 User

 Projects

 Code

 Tools

 Models

 Memory

```

---

# New Capability

Future command:

```bash
devai project open volition
```

DEVAIOS can load:

```text
✓ Repository

✓ Environment

✓ Dependencies

✓ AI context

✓ Knowledge graph

✓ MCP tools

✓ Preferred AI model
```

---
