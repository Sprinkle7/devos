---
source: chatgpt-share
source_turn: 158
sprint: 2
task: 3
title: "DEVAIOS Project Workspace"
status: extracted
---

# Sprint 2 — Task 3: DEVAIOS Project Workspace

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Build the **central development environment of DEVAIOS**.

This is where users spend most of their time.

The workspace combines:

- Code editor
- AI assistant
- Agents
- Terminal
- Git
- Project memory
- Tools
- Context

into one intelligent environment.

---

# Product Vision

Traditional workflow:

```text id="a2m7f9"
VS Code

+

Browser

+

Terminal

+

ChatGPT

+

Documentation

+

GitHub

```

DEVAIOS workflow:

```text id="m8q3x1"
              DEVAIOS Workspace

 Code

 AI

 Terminal

 Agents

 Memory

 Git

 Deployment

        ALL CONNECTED

```

---

# Workspace Layout

Main layout:

```text id="k5v8n3"
+------------------------------------------------+
| Project: My App                    DEVAIOS AI |
+------------------------------------------------+
|        |                         |             |
| Files  |       Code Editor       | AI Agent    |
|        |                         |             |
|        |                         | Chat        |
|        |                         | Tools       |
|        |                         | Actions     |
+------------------------------------------------+
|                Terminal / Logs                 |
+------------------------------------------------+

```

---

# Workspace Components

## 1. File Explorer

Features:

```text id="p9n4k2"
Browse files

Create files

Delete files

Search files

Open files

```

---

## 2. Code Viewer

Features:

```text id="x3m8v5"
Syntax highlighting

File tabs

Diff viewer

AI changes

Code suggestions

```

---

## 3. AI Panel

Features:

```text id="b7q2m9"
Chat

Agent actions

Tool execution

Context display

Approvals

```

---

## 4. Terminal

Features:

```text id="z6m3p8"
Run commands

View output

Agent commands

Logs

```

---

## 5. Activity Timeline

Shows:

```text id="c8v4n1"
10:31

Agent started

10:32

Read auth.ts

10:33

Modified login.ts

10:34

Tests passed

```

---

# Architecture

```text id="w2m7q9"
Desktop UI

     |

Workspace Module

     |

 ------------------------------------------------

Project Service

File Service

Agent Service

Git Service

Terminal Service

Memory Service

```

---

# New Package

Name:

```text id="f6m9x3"
@devaios/workspace
```

Location:

```text id="h3q8m5"
packages/workspace/
```

---

# Responsibilities

Version 0.1:

✅ Project opening  
✅ File tree  
✅ Workspace state  
✅ Editor integration  
✅ Terminal integration  
✅ Agent panel foundation  

---

# Final Structure

Create:

```text id="q8m4v2"
packages/workspace/

├── src/
│
│   ├── index.ts
│   │
│   ├── workspace.ts
│   │
│   ├── project.ts
│   │
│   ├── files.ts
│   │
│   ├── editor.ts
│   │
│   ├── terminal.ts
│   │
│   ├── timeline.ts
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

```bash id="n5p2x8"
mkdir -p packages/workspace

cd packages/workspace

mkdir src tests
```

---

# Step 2 — Package Configuration

Create:

```json id="r4k7m9"
packages/workspace/package.json
```

```json id="v8m2p5"
{
"name":"@devaios/workspace",

"version":"0.1.0",

"type":"module",

"scripts":{

"build":"tsc",

"test":"vitest",

"lint":"eslint src"

},

"dependencies":{

"@devaios/tools":
"workspace:*",

"@devaios/agents":
"workspace:*",

"@devaios/memory":
"workspace:*"

}

}
```

---

# Step 3 — Workspace Types

Create:

```ts id="k9m3x7"
src/types.ts
```

```ts id="u7p4m2"
export interface Project {

id:string;

name:string;

path:string;

}

export interface FileNode {

name:string;

path:string;

type:
"file"
|
"folder";

}

export interface WorkspaceState {

project?:Project;

activeFile?:string;

}

```

---

# Step 4 — Project Manager

Create:

```ts id="a8q5m1"
src/project.ts
```

```ts id="c7m2x9"
import type {
Project
}
from "./types.js";

export class ProjectManager {

private projects:
Project[]=[];

add(
project:Project
){

this.projects.push(
project
);

}

list(){

return this.projects;

}

}
```

---

# Step 5 — File Service

Create:

```ts id="m4p8x3"
src/files.ts
```

```ts id="j8n5q2"
import type {
FileNode
}
from "./types.js";

export class FileService {

scan(
path:string
){

const files:
FileNode[]=[

{

name:"src",

path,

type:"folder"

}

];

return files;

}

}
```

---

# Step 6 — Editor Service

Create:

```ts id="x5m9v4"
src/editor.ts
```

```ts id="q3p7m8"
export class EditorService {

private opened:string[]=[];

open(
file:string
){

this.opened.push(
file
);

}

files(){

return this.opened;

}

}
```

---

# Step 7 — Terminal Service

Create:

```ts id="z4n8m2"
src/terminal.ts
```

```ts id="w6m3q9"
export class TerminalService {

async execute(
command:string
){

return {

command,

output:
`Executed ${command}`

};

}

}
```

---

# Step 8 — Activity Timeline

Create:

```ts id="p5x8m4"
src/timeline.ts
```

```ts id="n2m7q6"
export interface Activity {

message:string;

time:Date;

}

export class Timeline {

private events:
Activity[]=[];

add(
message:string
){

this.events.push({

message,

time:
new Date()

});

}

list(){

return this.events;

}

}
```

---

# Step 9 — Workspace Manager

Create:

```ts id="h7m4q1"
src/workspace.ts
```

```ts id="v5n8x2"
import type {
WorkspaceState
}
from "./types.js";

export class Workspace {

state:
WorkspaceState={};

openProject(
project:any
){

this.state.project =
project;

}

current(){

return this.state;

}

}
```

---

# Step 10 — Export

Create:

```ts id="y8p3m6"
src/index.ts
```

```ts id="c2m9x5"
export {
Workspace
}
from "./workspace.js";

export {
ProjectManager
}
from "./project.js";

export {
FileService
}
from "./files.js";

export {
EditorService
}
from "./editor.js";

export {
TerminalService
}
from "./terminal.js";

export {
Timeline
}
from "./timeline.js";
```

---

# Step 11 — Test

Create:

```ts id="m7q4x8"
tests/workspace.test.ts
```

```ts id="r9n3p5"
import {

describe,

expect,

it

}

from "vitest";

import {
Workspace
}
from "../src/index.js";

describe(
"workspace",
()=>{

it(
"opens project",
()=>{

const workspace =
new Workspace();

workspace.openProject({

id:"1",

name:"Test",

path:"/test"

});

expect(
workspace.current()
.project?.name
)
toBe(
"Test"
);

});

});
```

---

# Step 12 — Build

Run:

```bash id="x2m8q4"
pnpm install

pnpm build
```

Expected:

```text id="j6p9m3"
@devaios/workspace ✓
```

---

# Step 13 — Commit

```bash id="r8m4k2"
git add .

git commit -m "feat(workspace): add DEVAIOS development workspace"
```

---

# Task 3 Completion Criteria

Before moving:

✅ Project system exists  
✅ File explorer foundation exists  
✅ Editor service exists  
✅ Terminal service exists  
✅ Activity timeline exists  
✅ Workspace state exists  

---

# DEVAIOS Product Architecture Update

Now:

```text id="n5m8q3"
                         DEVAIOS

                    Desktop Application

                            |

                       Workspace

                            |

 -------------------------------------------------

 Files

 Editor

 Terminal

 AI Agent

 Timeline

 Git

 Memory

                            |

 -------------------------------------------------

 Core

 Tools

 Agents

 Runtime

 MCP

```

---

# New Capability

User opens project:

```text id="u9m2x7"
DEVAIOS:

Project detected:

Next.js Application

Loaded:

✓ Files

✓ Git

✓ Dependencies

✓ Memory

✓ Previous decisions

Ready.

```

---
