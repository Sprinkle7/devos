---
source: chatgpt-share
source_turn: 102
sprint: 1
task: 5
title: "Event Bus Foundation"
status: extracted
---

# Sprint 1 — Task 5: Event Bus Foundation

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the **nervous system of DEVAIOS**.

From this point onward, components should not tightly depend on each other.

Instead of:

```text
Scanner
   |
   | calls directly
   ↓
Knowledge System
   |
   | calls directly
   ↓
AI Context Builder
```

We move toward:

```text
Scanner

   |
   |
 emits event

   ↓

        Event Bus

   ↓          ↓          ↓

Knowledge   Logger    Automation
```

This architecture is what will allow DEVAIOS to grow into a plugin-based platform.

---

# Package

Name:

```text
@devaios/events
```

Location:

```text
packages/events/
```

---

# Event Bus Responsibilities

The first version will provide:

✅ Event definition  
✅ Event publishing  
✅ Event subscription  
✅ Type-safe events  
✅ Event history hooks  
✅ Async handlers  

Later versions can replace the internal implementation with:

- NATS
- Redis Streams
- Kafka
- RabbitMQ

without changing the rest of DEVAIOS.

---

# Core Concept

Everything important in DEVAIOS becomes an event.

Examples:

---

## Workspace Events

```text
WorkspaceCreated

WorkspaceOpened

WorkspaceClosed
```

---

## Repository Events

```text
RepositoryAdded

RepositoryScanned

RepositoryUpdated
```

---

## Intelligence Events

```text
ContextBuilt

KnowledgeUpdated

EmbeddingGenerated
```

---

## Capability Events

```text
PluginInstalled

PluginStarted

PluginFailed
```

---

# Final Structure

Create:

```text
packages/events/

├── src/
│
│   ├── index.ts
│   │
│   ├── event-bus.ts
│   │
│   ├── event-types.ts
│   │
│   ├── handler.ts
│   │
│   └── errors.ts
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
mkdir -p packages/events

cd packages/events

mkdir src tests
```

---

# Step 2 — Package Configuration

Create:

```json
packages/events/package.json
```

```json
{
  "name": "@devaios/events",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@devaios/shared-kernel": "workspace:*"
  }
}
```

---

# Step 3 — Event Definition

Create:

```ts
src/event-types.ts
```

```ts
export interface DevaiEvent<T = unknown> {

  id:string;

  type:string;

  timestamp:Date;

  payload:T;

}
```

---

# Step 4 — Event Handler Type

Create:

```ts
src/handler.ts
```

```ts
import type {
 DevaiEvent
} from "./event-types.js";

export type EventHandler<T = unknown> =
(
 event:DevaiEvent<T>
)=>void | Promise<void>;
```

---

# Step 5 — Event Bus Implementation

Create:

```ts
src/event-bus.ts
```

```ts
import type {
 DevaiEvent
} from "./event-types.js";

import type {
 EventHandler
} from "./handler.js";

export class EventBus {

private handlers =
new Map<
 string,
 Set<EventHandler>
>();

subscribe<T>(
 type:string,
 handler:EventHandler<T>
){

 if(!this.handlers.has(type)){

  this.handlers.set(
   type,
   new Set()
  );

 }

 this.handlers
 .get(type)!
 .add(handler);

}

async publish<T>(
 event:DevaiEvent<T>
){

 const handlers =
 this.handlers.get(
  event.type
 );

 if(!handlers){
  return;
 }

 for(
  const handler
  of handlers
 ){

  await handler(event);

 }

}

}
```

---

# Step 6 — Event Factory

Create:

```ts
src/index.ts
```

```ts
export {
 EventBus
}
from "./event-bus.js";

export type {
 DevaiEvent
}
from "./event-types.js";

export type {
 EventHandler
}
from "./handler.js";
```

---

# Step 7 — Example Usage

A future scanner will do:

```ts
import {
 EventBus
}
from "@devaios/events";

const bus =
new EventBus();

bus.publish({

 id:"evt_001",

 type:"RepositoryScanned",

 timestamp:new Date(),

 payload:{
   repository:"api"
 }

});
```

---

A knowledge service listens:

```ts
bus.subscribe(
"RepositoryScanned",

async(event)=>{

 console.log(
  "Repository updated",
  event.payload
 );

}

);
```

---

# Step 8 — Add Tests

Create:

```ts
tests/event-bus.test.ts
```

```ts
import {
 describe,
 expect,
 it
} from "vitest";

import {
 EventBus
}
from "../src/index.js";

describe(
"event bus",
()=>{

it(
"publishes events",
async()=>{

const bus =
new EventBus();

let received=false;

bus.subscribe(
"TestEvent",

()=>{

 received=true;

}

);

await bus.publish({

 id:"1",

 type:"TestEvent",

 timestamp:new Date(),

 payload:{}

});

expect(received)
.toBe(true);

});

});
```

---

# Step 9 — Build

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
```

---

# Step 10 — Commit

```bash
git add .

git commit -m "feat(events): add event bus foundation"
```

---

# Task 5 Completion Criteria

Before moving forward:

✅ Event abstraction created  
✅ Publish/subscribe works  
✅ Async handlers supported  
✅ TypeScript support  
✅ Tests passing  
✅ Independent package  

---

# Current DEVAIOS Foundation

We now have the first real platform layer:

```text
                    DEVAIOS

                       |
                       |

              Event Bus Layer

                       |

    ---------------------------------

    Logger        Config        Kernel

                       |

              Future Runtime

```

---

# Important Architectural Decision

From now on:

**Packages should communicate through events when possible.**

Example:

Bad:

```ts
scanner.updateKnowledge()
```

Better:

```ts
scanner.publish(
{
 type:"RepositoryScanned"
}
)
```

Now:

- Knowledge system can react.
- Documentation system can react.
- Automation can react.
- Analytics can react.

without modifying the scanner.

This is how DEVAIOS becomes an ecosystem instead of a collection of features.

---
