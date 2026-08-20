---
source: chatgpt-share
source_turn: 110
sprint: 1
task: 9
title: "DEVAIOS Doctor System"
status: extracted
---

# Sprint 1 — Task 9: DEVAIOS Doctor System

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Build the **self-diagnosis and setup intelligence layer**.

This is one of the most important parts of DEVAIOS because it transforms the platform from:

> "A tool developers install"

into:

> "A platform that understands its own environment and guides the user."

---

# Why Doctor Exists

Different users will have different environments:

Example:

Developer A:

```text
macOS
M4 Pro
Node 24
Docker installed
Ollama installed
Claude Desktop installed
Cursor installed
```

Developer B:

```text
Windows
No Node
No Docker
No Python
No Ollama
```

DEVAIOS should detect this.

---

# Doctor Responsibilities

The doctor system will:

✅ Detect operating system  
✅ Detect CPU/GPU  
✅ Detect installed software  
✅ Validate versions  
✅ Check configuration  
✅ Check dependencies  
✅ Provide fixes  
✅ Prepare installation plans  

---

# Future Example

User runs:

```bash
devai doctor
```

Output:

```text
DEVAIOS Environment Check

System

✓ macOS detected
✓ Apple Silicon M4 detected

Runtime

✓ Node.js 24.12
✓ pnpm installed

Containers

✓ Docker installed

AI Providers

✓ Ollama installed
⚠ Claude Code missing

Recommended:

Run:

devai install claude-code
```

---

# Architecture

Doctor should NOT directly install everything.

It follows:

```text
Detect

  ↓

Analyze

  ↓

Recommend

  ↓

Approve

  ↓

Install

```

This prevents dangerous automatic changes.

---

# Package

Name:

```text id="g4g0cm"
@devaios/doctor
```

Location:

```text id="v1f6l3"
packages/doctor/
```

---

# Final Structure

Create:

```text id="q8pm4f"
packages/doctor/

├── src/
│
│   ├── index.ts
│   │
│   ├── doctor.ts
│   │
│   ├── checks/
│   │
│   │   ├── system.ts
│   │   ├── node.ts
│   │   ├── docker.ts
│   │   ├── ollama.ts
│   │   └── git.ts
│   │
│   ├── types.ts
│   │
│   └── reporter.ts
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
mkdir -p packages/doctor

cd packages/doctor

mkdir -p src/checks tests
```

---

# Step 2 — Package Configuration

Create:

```json
packages/doctor/package.json
```

```json
{
  "name": "@devaios/doctor",
  "version": "0.1.0",
  "type": "module",

  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit"
  },

  "dependencies": {

    "@devaios/logger":
    "workspace:*",

    "execa":
    "latest"

  }
}
```

---

# Step 3 — Doctor Types

Create:

```ts
src/types.ts
```

```ts
export type CheckStatus =
"pass"
|
"warning"
|
"fail";

export interface DoctorResult {

name:string;

status:CheckStatus;

message:string;

details?:unknown;

fix?:string;

}
```

---

# Step 4 — System Check

Create:

```ts
src/checks/system.ts
```

```ts
import os from "node:os";

export function systemCheck(){

return {

name:
"Operating System",

status:
"pass",

message:
`${os.platform()} ${os.arch()}`

};

}
```

---

# Step 5 — Node Check

Create:

```ts
src/checks/node.ts
```

```ts
export function nodeCheck(){

const version =
process.version;

return {

name:
"Node.js",

status:
"pass",

message:
version

};

}
```

---

# Step 6 — Git Check

Create:

```ts
src/checks/git.ts
```

```ts
import {
execSync
}
from "node:child_process";

export function gitCheck(){

try{

const version =
execSync(
"git --version"
)
.toString()
.trim();

return {

name:
"Git",

status:
"pass",

message:
version

};

}
catch{

return {

name:
"Git",

status:
"fail",

message:
"Git not installed",

fix:
"Install Git"

};

}

}
```

---

# Step 7 — Docker Check

Create:

```ts
src/checks/docker.ts
```

```ts
import {
execSync
}
from "node:child_process";

export function dockerCheck(){

try{

const version =
execSync(
"docker --version"
)
.toString()
.trim();

return {

name:
"Docker",

status:
"pass",

message:
version

};

}
catch{

return {

name:
"Docker",

status:
"warning",

message:
"Docker unavailable",

fix:
"Install Docker Desktop"

};

}

}
```

---

# Step 8 — Ollama Check

Create:

```ts
src/checks/ollama.ts
```

```ts
import {
execSync
}
from "node:child_process";

export function ollamaCheck(){

try{

const result =
execSync(
"ollama --version"
)
.toString()
.trim();

return {

name:
"Ollama",

status:
"pass",

message:
result

};

}
catch{

return {

name:
"Ollama",

status:
"warning",

message:
"Ollama not installed",

fix:
"Install Ollama for local AI models"

};

}

}
```

---

# Step 9 — Doctor Engine

Create:

```ts
src/doctor.ts
```

```ts
import {
systemCheck
}
from "./checks/system.js";

import {
nodeCheck
}
from "./checks/node.js";

import {
gitCheck
}
from "./checks/git.js";

import {
dockerCheck
}
from "./checks/docker.js";

import {
ollamaCheck
}
from "./checks/ollama.js";

export function runDoctor(){

return [

systemCheck(),

nodeCheck(),

gitCheck(),

dockerCheck(),

ollamaCheck()

];

}
```

---

# Step 10 — Reporter

Create:

```ts
src/reporter.ts
```

```ts
import type {
DoctorResult
}
from "./types.js";

export function printReport(
results:DoctorResult[]
){

console.log(
"\nDEVAIOS Doctor\n"
);

for(
const result of results
){

const icon =
result.status==="pass"
?
"✓"
:
"⚠";

console.log(
`${icon} ${result.name}: ${result.message}`
);

if(result.fix){

console.log(
`  Fix: ${result.fix}`
);

}

}

}
```

---

# Step 11 — Export

Create:

```ts
src/index.ts
```

```ts
export {
runDoctor
}
from "./doctor.js";

export {
printReport
}
from "./reporter.js";
```

---

# Step 12 — Connect CLI

Update:

```text
apps/cli/src/commands/doctor.ts
```

Replace with:

```ts
import type {
Command
}
from "commander";

import {
runDoctor,
printReport
}
from "@devaios/doctor";

export function registerDoctor(
program:Command
){

program
.command("doctor")
.description(
"Check DEVAIOS environment"
)
.action(()=>{

const results =
runDoctor();

printReport(
results
);

});

}
```

---

# Step 13 — Build

Run:

```bash
pnpm install

pnpm build
```

Expected:

```text
@devaios/doctor ✓

@devaios/cli ✓
```

---

# Step 14 — Test

Run:

```bash
pnpm --filter @devaios/cli dev -- doctor
```

Example:

```text
DEVAIOS Doctor

✓ Operating System: darwin arm64

✓ Node.js: v24.12.0

✓ Git: git version 2.xx

✓ Docker: Docker version xx

⚠ Ollama: Ollama not installed

Fix:
Install Ollama for local AI models
```

---

# Step 15 — Commit

```bash
git add .

git commit -m "feat(doctor): add environment diagnostics system"
```

---

# Task 9 Completion Criteria

✅ Environment detection  
✅ Dependency checks  
✅ Ollama detection  
✅ Docker detection  
✅ Git detection  
✅ CLI integration  
✅ Fix recommendations  

---

# DEVAIOS Architecture Now

```text
                 DEVAIOS CLI

                      |

        -----------------------------

        Runtime        Doctor

          |              |

          |        Environment

          |

 -------------------------------

 Config   Events   Workspace

          |

    Shared Kernel

```

---

# Major Milestone

The foundation for your original requirement now exists:

> "When someone installs DEVAIOS it should know what to install."

We now have the brain that can answer:

- What is missing?
- What is installed?
- What should happen next?

---
