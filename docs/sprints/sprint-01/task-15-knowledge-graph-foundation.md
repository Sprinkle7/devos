---
source: chatgpt-share
source_turn: 122
sprint: 1
task: 15
title: "Knowledge Graph Foundation"
status: extracted
---

# Sprint 1 — Task 15: Knowledge Graph Foundation

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the **relationship intelligence layer** of DEVAIOS.

This is where DEVAIOS stops seeing projects as files and starts understanding them as connected systems.

---

# The Problem

Traditional tools see:

```text
project/

├── api/

│   ├── auth.ts

│   ├── users.ts

│   └── payments.ts

├── frontend/

│   ├── login.tsx

│   └── dashboard.tsx

```

A human sees:

```text
Authentication

        |
        |
        v

User Service

        |
        |
        v

Database

        |
        |
        v

Frontend Login

        |
        |
        v

Payment Permissions
```

DEVAIOS needs this understanding.

---

# Why Knowledge Graph?

A graph answers questions like:

> "If I change this API, what breaks?"

or:

> "Where is authentication handled?"

or:

> "Which services depend on Redis?"

---

# Graph Model

Everything becomes a node.

Example:

```text
NODE TYPES:

User

Workspace

Project

Repository

File

Function

Class

Database

API

Decision

Documentation

AI Memory
```

---

# Relationships

Connections become edges.

Example:

```text
File

  IMPLEMENTS

Function

Function

  CALLS

Function

API

  USES

Database

Project

  CONTAINS

Repository

```

---

# DEVAIOS Knowledge Graph

```text
                     Workspace

                         |

                         |

                    Project

                         |

        --------------------------------

        Repository                 Documentation

            |

            |

          Files

            |

            |

        Functions

            |

            |

       Dependencies

```

---

# Graphify Integration

Your Graphify tool will eventually become a plugin/provider.

Architecture:

```text
DEVAIOS Knowledge Layer

          |

          |

 Graph Provider Interface

          |

 ----------------------------

 DEVAIOS Graph

 Graphify

 Neo4j

 PostgreSQL Graph

```

---

# Package

Name:

```text
@devaios/knowledge
```

Location:

```text
packages/knowledge/
```

---

# Responsibilities

Version 0.1:

✅ Node model  
✅ Relationship model  
✅ Graph storage interface  
✅ Graph queries  
✅ Entity registry  
✅ Future Graphify support  

---

# Final Structure

Create:

```text
packages/knowledge/

├── src/
│
│   ├── index.ts
│   │
│   ├── node.ts
│   │
│   ├── edge.ts
│   │
│   ├── graph.ts
│   │
│   ├── registry.ts
│   │
│   ├── query.ts
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
mkdir -p packages/knowledge

cd packages/knowledge

mkdir src tests
```

---

# Step 2 — Package Configuration

Create:

```json
packages/knowledge/package.json
```

```json
{
  "name": "@devaios/knowledge",
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
    "workspace:*"

  }
}
```

---

# Step 3 — Node Types

Create:

```ts
src/types.ts
```

```ts
export type NodeType =

"workspace"
|
"project"
|
"repository"
|
"file"
|
"function"
|
"class"
|
"database"
|
"api"
|
"document"
|
"decision";

export type RelationType =

"contains"
|
"depends_on"
|
"calls"
|
"uses"
|
"implements"
|
"references";
```

---

# Step 4 — Graph Node

Create:

```ts
src/node.ts
```

```ts
import type {
NodeType
}
from "./types.js";

export interface GraphNode {

id:string;

type:
NodeType;

name:string;

metadata?:
Record<string,unknown>;

}
```

---

# Step 5 — Graph Edge

Create:

```ts
src/edge.ts
```

```ts
import type {
RelationType
}
from "./types.js";

export interface GraphEdge {

id:string;

from:string;

to:string;

type:
RelationType;

}
```

---

# Step 6 — Graph Engine

Create:

```ts
src/graph.ts
```

```ts
import type {
GraphNode
}
from "./node.js";

import type {
GraphEdge
}
from "./edge.js";

export class KnowledgeGraph {

private nodes =
new Map<string,GraphNode>();

private edges =
new Map<string,GraphEdge>();

addNode(
node:GraphNode
){

this.nodes.set(
node.id,
node
);

}

addEdge(
edge:GraphEdge
){

this.edges.set(
edge.id,
edge
);

}

getNode(
id:string
){

return this.nodes.get(id);

}

getNodes(){

return Array.from(
this.nodes.values()
);

}

getEdges(){

return Array.from(
this.edges.values()
);

}

}
```

---

# Step 7 — Entity Registry

Create:

```ts
src/registry.ts
```

```ts
import {
KnowledgeGraph
}
from "./graph.js";

export class EntityRegistry {

constructor(
private graph:
KnowledgeGraph
){}

register(
entity:any
){

this.graph.addNode(
entity
);

}

}
```

---

# Step 8 — Graph Query

Create:

```ts
src/query.ts
```

```ts
import {
KnowledgeGraph
}
from "./graph.js";

export class GraphQuery {

constructor(
private graph:
KnowledgeGraph
){}

findByType(
type:string
){

return this.graph
.getNodes()
.filter(
node =>
node.type===type
);

}

}
```

---

# Step 9 — Export

Create:

```ts
src/index.ts
```

```ts
export {
KnowledgeGraph
}
from "./graph.js";

export {
EntityRegistry
}
from "./registry.js";

export {
GraphQuery
}
from "./query.js";

export type {
GraphNode
}
from "./node.js";

export type {
GraphEdge
}
from "./edge.js";
```

---

# Step 10 — Test

Create:

```ts
tests/graph.test.ts
```

```ts
import {
describe,
expect,
it
}
from "vitest";

import {
KnowledgeGraph
}
from "../src/index.js";

describe(
"knowledge graph",
()=>{

it(
"stores nodes",
()=>{

const graph =
new KnowledgeGraph();

graph.addNode({

id:"project1",

type:"project",

name:"DEVAIOS"

});

expect(
graph.getNodes()
.length
)
toBe(1);

});

});
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
@devaios/knowledge ✓
```

---

# Step 12 — Commit

```bash
git add .

git commit -m "feat(knowledge): add knowledge graph foundation"
```

---

# Task 15 Completion Criteria

Before moving:

✅ Graph nodes exist  
✅ Graph relationships exist  
✅ Query system exists  
✅ Entity registry exists  
✅ Future Graphify integration ready  

---

# DEVAIOS Architecture Update

We now have the complete intelligence foundation:

```text
                         DEVAIOS

                            CLI

                             |

                          Runtime

                             |

 ----------------------------------------------------------------

 Config

 Storage

 Workspace

 Plugins

 AI

 Context

 Knowledge Graph

                             |

 ----------------------------------------------------------------

 Ollama       Claude       OpenAI       Graphify       MCP

                             |

                       Shared Kernel

```

---

# Major Milestone Reached

DEVAIOS now has:

## Memory

Storage + Context

## Understanding

Knowledge Graph

## Intelligence

AI Providers

## Extensibility

Plugins

## Self-management

Doctor + Installer

---
