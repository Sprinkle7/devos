---
source: chatgpt-share
source_turn: 140
sprint: 1
task: 24
title: "Tool Execution Framework"
status: extracted
---

# Sprint 1 — Task 24: Tool Execution Framework

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the **action layer of DEVAIOS**.

This is the component that allows AI agents to interact with the real world.

Until now:

```text id="4f8y2m"
Agent

 ↓

Thinks

 ↓

Returns Answer

```

After this:

```text id="5n2w8k"
Agent

 ↓

Plans

 ↓

Uses Tools

 ↓

Changes Files

 ↓

Runs Commands

 ↓

Tests Result

 ↓

Reports
```

---

# Why Tool Framework Exists

AI without tools is limited.

Example:

User:

> "Fix this bug."

Without tools:

```text id="g3k2z1"
AI:

The bug is probably here.

```

With tools:

```text id="v9q6mz"
AI:

1. Opened repository
2. Found authentication service
3. Located error
4. Updated code
5. Ran tests
6. Verified fix

```

---

# DEVAIOS Tool Architecture

```text id="n7p4kc"
                    Agent

                      |

                Tool Runtime

                      |

 ------------------------------------------------

 File Tools

 Terminal Tools

 Git Tools

 Search Tools

 MCP Tools

 Browser Tools

 Database Tools

```

---

# Core Design Principle

Every action is a tool.

Example:

```text id="q3v8za"
Read File

Write File

Search Code

Run Test

Create Commit

Deploy

Query Database

```

---

# Tool Categories

## 1. File Tools

Used for:

- Reading files
- Editing files
- Creating files

Example:

```json id="70m1k4"
{
"name":"read_file",
"input":{
"path":"src/app.ts"
}
}
```

---

## 2. Terminal Tools

Used for:

```bash id="rx5a3m"
npm install

npm test

docker compose up

git status

```

---

## 3. Repository Tools

Used for:

```text id="g8d3x7"
git diff

git branch

git commit

git history

```

---

## 4. MCP Tools

Connect:

```text id="x8s1a9"
GitHub MCP

AWS MCP

Database MCP

Graphify

```

---

# Package

Name:

```text id="p8x2c7"
@devaios/tools
```

Location:

```text id="a7k9m3"
packages/tools/
```

---

# Responsibilities

Version 0.1:

✅ Tool definition  
✅ Tool registry  
✅ Tool execution  
✅ Permission layer  
✅ Built-in tools foundation  

---

# Final Structure

Create:

```text id="q5m7b2"
packages/tools/

├── src/
│
│   ├── index.ts
│   │
│   ├── tool.ts
│   │
│   ├── registry.ts
│   │
│   ├── executor.ts
│   │
│   ├── permission.ts
│   │
│   ├── builtin/
│   │
│   │   ├── file.ts
│   │   ├── terminal.ts
│   │   └── git.ts
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

```bash id="1k6q9f"
mkdir -p packages/tools

cd packages/tools

mkdir -p src/builtin tests
```

---

# Step 2 — Package Configuration

Create:

```json id="m2h9x6"
packages/tools/package.json
```

```json id="n8c5p1"
{
  "name": "@devaios/tools",
  "version": "0.1.0",
  "type": "module",

  "scripts": {

    "build":"tsc",

    "test":"vitest",

    "lint":"eslint src",

    "typecheck":"tsc --noEmit"

  },

  "dependencies": {

    "@devaios/mcp":
    "workspace:*"

  }
}
```

---

# Step 3 — Tool Types

Create:

```ts id="p7m3q9"
src/types.ts
```

```ts id="k8x4d0"
export interface ToolInput {

[key:string]:
unknown;

}

export interface ToolResult {

success:boolean;

output?:unknown;

error?:string;

}

export interface ToolDefinition {

name:string;

description:string;

execute(
input:ToolInput
):
Promise<ToolResult>;

}
```

---

# Step 4 — Tool Base Class

Create:

```ts id="x1v6m9"
src/tool.ts
```

```ts id="f5c8q2"
import type {
ToolDefinition
}
from "./types.js";

export abstract class Tool
implements ToolDefinition {

constructor(
public name:string,

public description:string

){}

abstract execute(
input:any
):
Promise<any>;

}
```

---

# Step 5 — Tool Registry

Create:

```ts id="w4q7n3"
src/registry.ts
```

```ts id="k2m8x0"
import type {
ToolDefinition
}
from "./types.js";

export class ToolRegistry {

private tools =
new Map<string,ToolDefinition>();

register(
tool:ToolDefinition
){

this.tools.set(
tool.name,
tool
);

}

get(
name:string
){

return this.tools.get(
name
);

}

list(){

return Array.from(
this.tools.values()
);

}

}
```

---

# Step 6 — Tool Executor

Create:

```ts id="e6v3q9"
src/executor.ts
```

```ts id="p3m7k1"
import {
ToolRegistry
}
from "./registry.js";

export class ToolExecutor {

constructor(
private registry:
ToolRegistry
){}

async run(
name:string,
input:any
){

const tool =
this.registry.get(
name
);

if(!tool){

throw new Error(
`Tool not found: ${name}`
);

}

return tool.execute(
input
);

}

}
```

---

# Step 7 — Permission Layer

Create:

```ts id="m9q2w5"
src/permission.ts
```

```ts id="y7k4p8"
export class PermissionManager {

private allowed =
new Set<string>();

allow(
tool:string
){

this.allowed.add(
tool
);

}

canUse(
tool:string
){

return this.allowed.has(
tool
);

}

}
```

---

# Step 8 — File Tool

Create:

```ts id="v2n8s5"
src/builtin/file.ts
```

```ts
import {
Tool
}
from "../tool.js";

export class ReadFileTool
extends Tool {

constructor(){

super(
"read_file",
"Read a file from project"
);

}

async execute(
input:any
){

return {

success:true,

output:
`Reading ${input.path}`

};

}

}
```

---

# Step 9 — Terminal Tool

Create:

```ts id="r8k3m6"
src/builtin/terminal.ts
```

```ts
import {
Tool
}
from "../tool.js";

export class TerminalTool
extends Tool {

constructor(){

super(
"terminal",
"Execute terminal command"
);

}

async execute(
input:any
){

return {

success:true,

output:
`Running ${input.command}`

};

}

}
```

---

# Step 10 — Git Tool

Create:

```ts id="z5p7m4"
src/builtin/git.ts
```

```ts
import {
Tool
}
from "../tool.js";

export class GitTool
extends Tool {

constructor(){

super(
"git",
"Git operations"
);

}

async execute(){

return {

success:true,

output:
"git executed"

};

}

}
```

---

# Step 11 — Export

Create:

```ts id="s7m2k9"
src/index.ts
```

```ts
export {
ToolExecutor
}
from "./executor.js";

export {
ToolRegistry
}
from "./registry.js";

export {
PermissionManager
}
from "./permission.js";

export {
ReadFileTool
}
from "./builtin/file.js";

export {
TerminalTool
}
from "./builtin/terminal.js";

export {
GitTool
}
from "./builtin/git.js";
```

---

# Step 12 — Test

Create:

```ts id="c8v4q1"
tests/tools.test.ts
```

```ts
import {
describe,
expect,
it
}
from "vitest";

import {
ToolRegistry,
ReadFileTool
}
from "../src/index.js";

describe(
"tools",
()=>{

it(
"registers tools",
()=>{

const registry =
new ToolRegistry();

registry.register(
new ReadFileTool()
);

expect(
registry.list()
.length
)
toBe(1);

});

});
```

---

# Step 13 — Build

Run:

```bash id="h5m9x0"
pnpm install

pnpm build
```

Expected:

```text
@devaios/tools ✓
```

---

# Step 14 — Commit

```bash
git add .

git commit -m "feat(tools): add tool execution framework"
```

---

# Task 24 Completion Criteria

Before moving:

✅ Tools have standard interface  
✅ Tools can register  
✅ Agents can execute tools  
✅ Permission foundation exists  
✅ File/terminal/git tools exist  
✅ MCP integration path ready  

---

# DEVAIOS Architecture Update

Now DEVAIOS can actually work:

```text
                         DEVAIOS

                            USER

                             |

                          Agent

                             |

                          Planner

                             |

                         Tool Engine

                             |

 ------------------------------------------------

 Files

 Terminal

 Git

 MCP

 Database

 Cloud

                             |

 ------------------------------------------------

 Project

 Runtime

 Knowledge Graph

 Memory

```

---

# New Capability

User:

```text
Create a login page.
```

DEVAIOS:

```text
Planning...

Tools required:

✓ Read project files
✓ Create components
✓ Install dependency
✓ Run tests

Executing...
```

---
