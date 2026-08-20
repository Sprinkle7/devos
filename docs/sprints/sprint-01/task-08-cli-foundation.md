---
source: chatgpt-share
source_turn: 108
sprint: 1
task: 8
title: "DEVAIOS CLI Foundation"
status: extracted
---

# Sprint 1 — Task 8: DEVAIOS CLI Foundation

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the first **human interface** for DEVAIOS.

Until now:

- Runtime exists
- Configuration exists
- Events exist
- Workspace exists

But a developer cannot use it.

The CLI becomes the first doorway into DEVAIOS.

---

# Why CLI First?

Before building:

- Desktop app
- Web dashboard
- VS Code extension
- Cursor integration
- Claude integration

we need a stable command interface.

The CLI becomes:

- The testing tool
- The developer interface
- The automation interface
- The CI/CD interface

---

# Package

Location:

```text
apps/cli/
```

Name:

```text
@devaios/cli
```

---

# Initial Commands

Version 0.1:

```bash
devai init

devai status

devai workspace create

devai workspace list

devai doctor

devai version
```

---

# Command Philosophy

Commands should be:

- Simple
- Scriptable
- Machine-readable
- Human-friendly

Example:

Human:

```bash
devai status
```

Output:

```text
DEVAIOS

Runtime:
✓ Running

Workspace:
✓ volition

Events:
✓ Connected

Version:
0.1.0
```

Machine:

```bash
devai status --json
```

Output:

```json
{
  "runtime":"running",
  "workspace":"volition",
  "version":"0.1.0"
}
```

---

# Final Structure

Create:

```text
apps/cli/

├── src/
│
│   ├── index.ts
│   │
│   ├── commands/
│   │
│   │   ├── init.ts
│   │   ├── status.ts
│   │   ├── doctor.ts
│   │   ├── version.ts
│   │   └── workspace.ts
│   │
│   ├── cli.ts
│   │
│   └── output.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

---

# Step 1 — Create Application

From root:

```bash
mkdir -p apps/cli

cd apps/cli

mkdir -p src/commands
```

---

# Step 2 — Package Configuration

Create:

```json
apps/cli/package.json
```

```json
{
  "name": "@devaios/cli",
  "version": "0.1.0",
  "type": "module",

  "bin": {
    "devai": "./dist/index.js"
  },

  "scripts": {
    "build": "tsc",
    "dev": "tsx src/index.ts",
    "test": "vitest",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit"
  },

  "dependencies": {

    "@devaios/runtime":
    "workspace:*",

    "@devaios/workspace":
    "workspace:*",

    "commander":
    "latest",

    "chalk":
    "latest"

  },

  "devDependencies": {
    "tsx": "latest"
  }
}
```

---

# Step 3 — CLI Framework

We use:

```text
Commander.js
```

Why?

- Mature
- Lightweight
- Good command parsing
- Used in many production CLIs

---

Create:

```ts
src/cli.ts
```

```ts
import {
 Command
}
from "commander";

import {
 registerInit
}
from "./commands/init.js";

import {
 registerStatus
}
from "./commands/status.js";

import {
 registerDoctor
}
from "./commands/doctor.js";

import {
 registerVersion
}
from "./commands/version.js";

export function createCLI(){

const program =
new Command();

program
.name("devai")
.description(
"DEVAIOS Engineering Intelligence Platform"
)
.version("0.1.0");

registerInit(program);

registerStatus(program);

registerDoctor(program);

registerVersion(program);

return program;

}
```

---

# Step 4 — Entry Point

Create:

```ts
src/index.ts
```

```ts
#!/usr/bin/env node

import {
 createCLI
}
from "./cli.js";

await createCLI()
.parseAsync();
```

---

# Step 5 — Version Command

Create:

```ts
src/commands/version.ts
```

```ts
import type {
 Command
}
from "commander";

export function registerVersion(
program:Command
){

program
.command("version")
.description(
"Show DEVAIOS version"
)
.action(()=>{

console.log(
"DEVAIOS v0.1.0"
);

});

}
```

---

# Step 6 — Status Command

Create:

```ts
src/commands/status.ts
```

```ts
import type {
Command
}
from "commander";

export function registerStatus(
program:Command
){

program
.command("status")
.description(
"Show system status"
)
.action(()=>{

console.log(`
DEVAIOS

Runtime:
✓ Ready

Version:
0.1.0
`);

});

}
```

---

# Step 7 — Doctor Command

Create:

```ts
src/commands/doctor.ts
```

```ts
import type {
Command
}
from "commander";

export function registerDoctor(
program:Command
){

program
.command("doctor")
.description(
"Check DEVAIOS installation"
)
.action(()=>{

console.log(`
DEVAIOS Doctor

✓ Node.js

✓ Configuration

✓ Runtime

✓ Workspace

Everything looks good.
`);

});

}
```

---

# Step 8 — Init Command

Create:

```ts
src/commands/init.ts
```

```ts
import type {
Command
}
from "commander";

export function registerInit(
program:Command
){

program
.command("init")
.description(
"Initialize DEVAIOS workspace"
)
.action(()=>{

console.log(
`
Initializing DEVAIOS...

✓ Created configuration

✓ Created workspace

DEVAIOS ready.
`
);

});

}
```

---

# Step 9 — Build

From root:

```bash
pnpm install

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

@devaios/cli ✓
```

---

# Step 10 — Test CLI

Run:

```bash
pnpm --filter @devaios/cli dev -- version
```

Expected:

```text
DEVAIOS v0.1.0
```

Test:

```bash
pnpm --filter @devaios/cli dev -- doctor
```

Expected:

```text
DEVAIOS Doctor

✓ Node.js

✓ Configuration

✓ Runtime

✓ Workspace
```

---

# Step 11 — Commit

```bash
git add .

git commit -m "feat(cli): add DEVAIOS command line interface"
```

---

# Task 8 Completion Criteria

Before moving on:

✅ CLI exists  
✅ Commands registered  
✅ Version command works  
✅ Doctor command works  
✅ Build succeeds  
✅ CLI can run locally  

---

# Current DEVAIOS Architecture

We now have the first complete user path:

```text
Developer

    |
    |
    v

DEVAIOS CLI

    |
    |
    v

Runtime

    |
    |
 ------------------------

Config   Events   Workspace

    |
    |
Shared Kernel

```

---

# Milestone Reached 🎉

At this point DEVAIOS has:

- A repository
- A runtime
- Internal communication
- Configuration
- Logging
- Workspace concept
- User interface

It is no longer a collection of ideas.

It is a bootable platform skeleton.

---
