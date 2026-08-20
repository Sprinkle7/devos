---
source: chatgpt-share
source_turn: 100
sprint: 1
task: 4
title: "Logging & Observability Foundation"
status: extracted
---

# Sprint 1 — Task 4: Logging & Observability Foundation

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the DEVAIOS logging system.

A platform without observability becomes impossible to maintain.

As DEVAIOS grows, we will have:

- Runtime
- Plugins
- Agents
- Scanners
- AI providers
- Automation workflows
- External integrations

When something fails, we need to answer:

- What happened?
- When did it happen?
- Which component failed?
- Which workspace/project was involved?
- What was the request flow?

Logging is not just printing text.

It is the foundation of operational intelligence.

---

# Package

Name:

```text
@devaios/logger
```

Location:

```text
packages/logger/
```

---

# Design Goals

The logger must support:

✅ Structured logs  
✅ Log levels  
✅ JSON output  
✅ Development readability  
✅ Metadata attachment  
✅ Component identification  
✅ Future OpenTelemetry integration  

---

# Example Output

Development:

```text
[INFO] Runtime started
component=runtime
version=0.1.0
```

Production:

```json
{
  "level":"info",
  "message":"Runtime started",
  "component":"runtime",
  "timestamp":"2026-08-05T12:00:00Z"
}
```

---

# Logging Rules

## Never do this:

```ts
console.log("starting server");
```

---

## Always:

```ts
logger.info(
 "server started",
 {
   port:3000
 }
);
```

---

# Final Structure

Create:

```text
packages/logger/

├── src/
│
│   ├── index.ts
│   │
│   ├── logger.ts
│   │
│   ├── levels.ts
│   │
│   ├── context.ts
│   │
│   ├── formatters/
│   │   ├── json.ts
│   │   └── pretty.ts
│   │
│   └── types.ts
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
mkdir -p packages/logger

cd packages/logger

mkdir -p src/formatters tests
```

---

# Step 2 — Package Configuration

Create:

```json
packages/logger/package.json
```

```json
{
  "name": "@devaios/logger",
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
    "pino": "latest"
  }
}
```

---

# Step 3 — Logger Levels

Create:

```ts
src/levels.ts
```

```ts
export enum LogLevel {

  DEBUG="debug",

  INFO="info",

  WARN="warn",

  ERROR="error"

}
```

---

# Step 4 — Logger Types

Create:

```ts
src/types.ts
```

```ts
import {
 LogLevel
} from "./levels.js";

export interface LogContext {

 component?:string;

 workspaceId?:string;

 projectId?:string;

 requestId?:string;

}

export interface LogEntry {

 level:LogLevel;

 message:string;

 timestamp:Date;

 context?:LogContext;

 data?:unknown;

}
```

---

# Step 5 — Logger Implementation

Create:

```ts
src/logger.ts
```

```ts
import {
 LogLevel
} from "./levels.js";

import type {
 LogContext
} from "./types.js";

export class Logger {

constructor(
 private component:string,
 private context:LogContext={}
){}

private write(
 level:LogLevel,
 message:string,
 data?:unknown
){

 const entry={

  timestamp:
   new Date(),

  level,

  message,

  component:
   this.component,

  ...this.context,

  data

 };

 console.log(
  JSON.stringify(entry)
 );

}

debug(
 message:string,
 data?:unknown
){

 this.write(
  LogLevel.DEBUG,
  message,
  data
 );

}

info(
 message:string,
 data?:unknown
){

 this.write(
  LogLevel.INFO,
  message,
  data
 );

}

warn(
 message:string,
 data?:unknown
){

 this.write(
  LogLevel.WARN,
  message,
  data
 );

}

error(
 message:string,
 data?:unknown
){

 this.write(
  LogLevel.ERROR,
  message,
  data
 );

}

}
```

---

# Step 6 — Logger Factory

Create:

```ts
src/index.ts
```

```ts
export {
 Logger
}
from "./logger.js";

export {
 LogLevel
}
from "./levels.js";

export type {
 LogContext
}
from "./types.js";
```

---

# Step 7 — Usage Example

Future DEVAIOS packages will use:

```ts
import {
 Logger
}
from "@devaios/logger";

const logger =
new Logger(
 "runtime"
);

logger.info(
 "Runtime started",
 {
   version:"0.1.0"
 }
);
```

Output:

```json
{
 "timestamp":"2026-08-05",
 "level":"info",
 "message":"Runtime started",
 "component":"runtime",
 "data":{
   "version":"0.1.0"
 }
}
```

---

# Step 8 — Add Tests

Create:

```ts
tests/logger.test.ts
```

```ts
import {
 describe,
 expect,
 it
} from "vitest";

import {
 Logger
}
from "../src/index.js";

describe(
"logger",
()=>{

it(
"creates logger",
()=>{

const logger =
new Logger(
 "test"
 );

expect(logger)
.toBeDefined();

});

});
```

---

# Step 9 — Install Dependencies

From root:

```bash
pnpm install
```

---

# Step 10 — Build

```bash
pnpm build
```

Expected:

```text
@devaios/shared-kernel ✓

@devaios/config ✓

@devaios/logger ✓
```

---

# Step 11 — Commit

```bash
git add .

git commit -m "feat(logger): add structured logging foundation"
```

---

# Task 4 Completion Criteria

Before continuing:

✅ Logger package created  
✅ Structured logs  
✅ Log levels  
✅ Component context  
✅ TypeScript types  
✅ Tests added  
✅ Monorepo build works  

---

# Current DEVAIOS Architecture

We now have:

```text
DEVAIOS FOUNDATION

                 Future Runtime

                     |
        -----------------------------
        |             |             |

   Logger        Config       Shared Kernel

```

---

# Why Logger Before Runtime?

Because when we create the Runtime in the next tasks, every lifecycle event must already be observable.

We don't want:

```
Runtime failed
```

We want:

```
Runtime initialization failed

component:
runtime

phase:
configuration-loading

workspace:
my-api

error:
DATABASE_URL missing

timestamp:
2026-08-05
```

That difference is what separates hobby projects from production platforms.

---
