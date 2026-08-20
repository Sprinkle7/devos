---
source: chatgpt-share
source_turn: 120
sprint: 1
task: 14
title: "Context Management System"
status: extracted
---

# Sprint 1 — Task 14: Context Management System

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Build the **context intelligence layer** of DEVAIOS.

This is the system that solves the main problem you described:

> "I am tired of here and there between Claude, Cursor, tools and losing context."

The purpose of DEVAIOS is not just to run AI models.

The purpose is:

> Keep the right information available to the right AI at the right time.

---

# Why Context Management Is Critical

AI models are powerful, but they have a weakness:

They forget.

Example:

You tell Claude:

```text
I am building DEVAIOS.

Architecture:
- Runtime
- Plugins
- Ollama
- Cursor integration
```

After a new session:

```text
Claude:
"Tell me about your project."
```

The context is gone.

DEVAIOS fixes this.

---

# DEVAIOS Context Architecture

```text
                 DEVAIOS

                    |

              Context Engine

                    |

 ------------------------------------------------

 Project Context

 Code Context

 User Preferences

 AI Conversations

 Documentation

 Knowledge Graph

```

---

# Connection With Your Tools

## Headroom

Purpose:

```text
Token optimization
```

DEVAIOS will use it for:

- Compressing history
- Reducing AI costs
- Keeping important information

---

## Ponytail

Purpose:

```text
Context persistence
```

DEVAIOS will use it for:

- Saving context
- Restoring sessions

---

## Graphify

Purpose:

```text
Knowledge relationships
```

DEVAIOS will use it for:

- Understanding relationships
- Creating project knowledge graph

---

# Context Layers

DEVAIOS uses multiple memory layers.

## Layer 1 — Short Term

Current conversation.

Example:

```text
User:
Fix authentication bug

Context:
Current files
Current error
Current branch
```

---

## Layer 2 — Project Memory

Persistent project information.

Example:

```yaml
project:

name: volition

stack:

- Next.js
- Node
- PostgreSQL

architecture:

- API
- Frontend
```

---

## Layer 3 — Knowledge Memory

Long-term intelligence.

Example:

```text
User prefers:

TypeScript

AWS

Docker

Clean architecture

```

---

# Package

Name:

```text
@devaios/context
```

Location:

```text
packages/context/
```

---

# Responsibilities

Version 0.1:

✅ Context model  
✅ Context storage  
✅ Context retrieval  
✅ Context prioritization  
✅ Token budgeting  
✅ AI preparation pipeline  

---

# Final Structure

Create:

```text
packages/context/

├── src/
│
│   ├── index.ts
│   │
│   ├── context.ts
│   │
│   ├── manager.ts
│   │
│   ├── memory.ts
│   │
│   ├── retriever.ts
│   │
│   ├── compressor.ts
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
mkdir -p packages/context

cd packages/context

mkdir src tests
```

---

# Step 2 — Package Configuration

Create:

```json
packages/context/package.json
```

```json
{
  "name": "@devaios/context",
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

    "@devaios/ai":
    "workspace:*"

  }
}
```

---

# Step 3 — Context Types

Create:

```ts
src/types.ts
```

```ts
export type ContextType =
"conversation"
|
"project"
|
"code"
|
"documentation"
|
"preference";

export interface ContextItem {

id:string;

type:
ContextType;

content:string;

priority:number;

createdAt:Date;

}
```

---

# Step 4 — Context Entity

Create:

```ts
src/context.ts
```

```ts
import type {
ContextItem
}
from "./types.js";

export interface AIContext {

id:string;

items:
ContextItem[];

add(
item:ContextItem
):
void;

getImportant():
ContextItem[];

}
```

---

# Step 5 — Memory Store

Create:

```ts
src/memory.ts
```

```ts
import type {
ContextItem
}
from "./types.js";

export class ContextMemory {

private items:
ContextItem[]=[];

add(
item:ContextItem
){

this.items.push(
item
);

}

all(){

return this.items;

}

important(){

return this.items
.sort(
(a,b)=>
b.priority-a.priority
);

}

}
```

---

# Step 6 — Context Manager

Create:

```ts
src/manager.ts
```

```ts
import {
ContextMemory
}
from "./memory.js";

import type {
ContextItem
}
from "./types.js";

export class ContextManager {

private memory =
new ContextMemory();

add(
item:ContextItem
){

this.memory.add(
item
);

}

buildPrompt(){

return this.memory
.important()
.map(
x=>x.content
)
.join("\n");

}

}
```

---

# Step 7 — Context Retriever

Create:

```ts
src/retriever.ts
```

```ts
import {
ContextMemory
}
from "./memory.js";

export class ContextRetriever {

constructor(
private memory:
ContextMemory
){}

search(
keyword:string
){

return this.memory
.all()
.filter(
item =>
item.content
.includes(keyword)
);

}

}
```

---

# Step 8 — Context Compressor

Create:

```ts
src/compressor.ts
```

```ts
export class ContextCompressor {

compress(
text:string
){

if(
text.length < 500
){

return text;

}

return (
text.substring(
0,
500
)
+
"..."
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
ContextManager
}
from "./manager.js";

export {
ContextMemory
}
from "./memory.js";

export {
ContextRetriever
}
from "./retriever.js";

export {
ContextCompressor
}
from "./compressor.js";

export type {
ContextItem
}
from "./types.js";
```

---

# Step 10 — Test

Create:

```ts
tests/context.test.ts
```

```ts
import {
describe,
expect,
it
}
from "vitest";

import {
ContextManager
}
from "../src/index.js";

describe(
"context",
()=>{

it(
"stores context",
()=>{

const manager =
new ContextManager();

manager.add({

id:"1",

type:"project",

content:
"DEVAIOS uses TypeScript",

priority:10,

createdAt:
new Date()

});

expect(
manager.buildPrompt()
)
.toContain(
"DEVAIOS"
);

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
@devaios/context ✓
```

---

# Step 12 — Commit

```bash
git add .

git commit -m "feat(context): add context management system"
```

---

# Task 14 Completion Criteria

Before moving:

✅ Context model exists  
✅ Memory layer exists  
✅ Retrieval exists  
✅ Compression exists  
✅ AI prompt preparation exists  
✅ Future Headroom integration possible  

---

# DEVAIOS Architecture Update

Now DEVAIOS has intelligence:

```text
                         DEVAIOS

                           CLI

                            |

                         Runtime

                            |

 -------------------------------------------------------

 Storage     Workspace     Plugins     AI     Context

                            |

 -------------------------------------------------------

 Ollama       Claude       OpenAI       Graph Memory

                            |

                       Shared Kernel

```

---

# Important Milestone

This is the point where DEVAIOS becomes more than:

- A CLI
- A wrapper
- A collection of MCP servers

It becomes a **personal AI engineering operating system**.

---
