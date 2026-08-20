---
source: chatgpt-share
source_turn: 96
sprint: 1
task: 2
title: "Shared Kernel Package"
status: extracted
---

# Sprint 1 — Task 2: Shared Kernel Package

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the **smallest and most stable package in DEVAIOS**.

The Shared Kernel is the foundation every future package will depend on.

The rule:

> The Shared Kernel must be boring, stable, and dependency-free.

If this package becomes messy, the entire platform becomes messy.

---

# Package

Name:

```text
@devaios/shared-kernel
```

Location:

```text
packages/shared-kernel/
```

---

# What belongs here?

Only universal concepts.

## Included

✅ IDs  
✅ Metadata  
✅ Errors  
✅ Result types  
✅ Events contracts  
✅ Common types  
✅ Validation primitives  

---

# What does NOT belong here?

❌ Database code

❌ API code

❌ AI code

❌ Repository logic

❌ Workspace logic

❌ Business rules

❌ External dependencies

---

# Final Structure

Create:

```text
packages/shared-kernel/

├── src/
│
│   ├── index.ts
│   │
│   ├── ids/
│   │   ├── id.ts
│   │   └── index.ts
│   │
│   ├── errors/
│   │   ├── error.ts
│   │   └── index.ts
│   │
│   ├── result/
│   │   ├── result.ts
│   │   └── index.ts
│   │
│   ├── events/
│   │   ├── event.ts
│   │   └── index.ts
│   │
│   ├── metadata/
│   │   ├── metadata.ts
│   │   └── index.ts
│   │
│   └── types/
│       ├── common.ts
│       └── index.ts
│
├── tests/
│
├── package.json
├── tsconfig.json
└── README.md
```

---

# Step 1 — Create Package

Run:

```bash
mkdir -p packages/shared-kernel

cd packages/shared-kernel

mkdir src tests
```

---

# Step 2 — Package Configuration

Create:

```json
packages/shared-kernel/package.json
```

```json
{
  "name": "@devaios/shared-kernel",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit"
  }
}
```

---

# Step 3 — TypeScript Configuration

Create:

```json
packages/shared-kernel/tsconfig.json
```

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": [
    "src"
  ]
}
```

---

# Step 4 — Identity System

Everything in DEVAIOS needs identity.

Examples:

```
Workspace
Project
Repository
Plugin
Agent
Task
Event
```

All need stable IDs.

---

Create:

```ts
src/ids/id.ts
```

```ts
export type EntityId<T extends string> = {
  readonly value: string;
  readonly type: T;
};

export function createId<T extends string>(
  type: T,
  value: string
): EntityId<T> {

  return {
    value,
    type,
  };
}
```

---

Example:

```ts
const projectId = createId(
  "project",
  "proj_123"
);
```

Result:

```json
{
  "type": "project",
  "value": "proj_123"
}
```

---

# Step 5 — Metadata System

Every DEVAIOS object should support metadata.

Create:

```ts
src/metadata/metadata.ts
```

```ts
export interface Metadata {

  createdAt: Date;

  updatedAt: Date;

  createdBy?: string;

  labels?: Record<string,string>;

}
```

---

Example:

```json
{
 "createdAt":"2026-08-05",
 "labels":{
   "environment":"development"
 }
}
```

---

# Step 6 — Error System

Create:

```ts
src/errors/error.ts
```

```ts
export class DevaiError extends Error {

  constructor(
    public code:string,
    message:string,
    public details?:unknown
  ){
    super(message);

    this.name="DevaiError";
  }

}
```

---

Usage:

```ts
throw new DevaiError(
 "WORKSPACE_NOT_FOUND",
 "Workspace does not exist"
);
```

---

# Step 7 — Result Type

DEVAIOS should avoid uncontrolled exceptions.

Create:

```ts
src/result/result.ts
```

```ts
export type Result<T,E> =
{
 success:true;
 value:T;
}
|
{
 success:false;
 error:E;
};

export function ok<T>(
 value:T
):Result<T,never>{

 return {
  success:true,
  value
 };

}

export function fail<E>(
 error:E
):Result<never,E>{

 return {
  success:false,
  error
 };

}
```

---

Example:

```ts
const result =
 ok("workspace loaded");
```

---

# Step 8 — Event Foundation

Events are central to DEVAIOS.

Everything important emits events.

Create:

```ts
src/events/event.ts
```

```ts
export interface DomainEvent {

 id:string;

 type:string;

 timestamp:Date;

 payload:unknown;

}
```

---

Example:

```json
{
"type":"RepositoryScanned",
"payload":{
 "repository":"api"
 }
}
```

---

# Step 9 — Common Types

Create:

```ts
src/types/common.ts
```

```ts
export type Nullable<T> =
 T | null;

export type Optional<T> =
 T | undefined;
```

---

# Step 10 — Export Everything

Create:

```ts
src/index.ts
```

```ts
export * from "./ids/index.js";

export * from "./errors/index.js";

export * from "./result/index.js";

export * from "./events/index.js";

export * from "./metadata/index.js";

export * from "./types/index.js";
```

---

# Step 11 — Add Tests

Create:

```ts
tests/id.test.ts
```

```ts
import {
 describe,
 expect,
 it
} from "vitest";

import {
 createId
} from "../src/index.js";

describe(
"Entity IDs",
()=>{

 it(
 "creates IDs",
 ()=>{

 const id=createId(
  "project",
  "proj_001"
 );

 expect(id.type)
 .toBe("project");

 });

});
```

---

# Step 12 — Build

From root:

```bash
pnpm install
```

Then:

```bash
pnpm build
```

Expected:

```
@devaios/shared-kernel build successful
```

---

# Step 13 — Commit

```bash
git add .

git commit -m "feat(shared-kernel): add foundation primitives"
```

---

# Task 2 Completion Criteria

Before moving forward:

✅ Package exists  
✅ Builds successfully  
✅ Tests pass  
✅ No external dependencies  
✅ All exports work  
✅ Other packages can import it  

---

# What we have created now

DEVAIOS has its first real building block:

```text
DEVAIOS

        Shared Kernel

             |
             |
   -----------------------
   |          |          |
 Runtime   Events    Workspace
```

Everything from now on builds on this.

---
