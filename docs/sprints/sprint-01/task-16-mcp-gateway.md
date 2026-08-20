---
source: chatgpt-share
source_turn: 124
sprint: 1
task: 16
title: "MCP Gateway"
status: extracted
---

# Sprint 1 — Task 16: MCP Gateway

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the **Model Context Protocol integration layer** for DEVAIOS.

This is the bridge that allows DEVAIOS to communicate with:

- Claude Desktop
- Cursor
- MCP servers
- External developer tools
- Internal DEVAIOS capabilities

---

# Why MCP Gateway Exists

Right now, AI tools are isolated.

Example:

```text
Claude Desktop

      |
      |
      X

Cursor

      |
      |
      X

Custom MCP servers

```

Each tool has its own configuration.

You wanted:

> "A central hub so I don't have to jump everywhere."

The MCP Gateway becomes that hub.

---

# New Architecture

Before:

```text
Claude
 |
 |
GitHub MCP

Cursor
 |
 |
Database MCP

DEVAIOS
 |
 |
Custom Tools
```

---

After:

```text
                    Claude Desktop

                         |

                    Cursor IDE

                         |

                         |

                  DEVAIOS MCP Gateway

                         |

 ------------------------------------------------

 GitHub MCP

 AWS MCP

 Database MCP

 Graphify MCP

 Internal DEVAIOS Tools

 AI Providers

```

---

# What MCP Gateway Does

Version 0.1:

✅ MCP client management  
✅ MCP server registry  
✅ Tool discovery  
✅ Resource discovery  
✅ Connection lifecycle  
✅ Authentication foundation  

---

# Future Features

Later:

```text
devai mcp install github

devai mcp install postgres

devai mcp install aws

devai mcp status

devai mcp doctor
```

---

# Package

Name:

```text id="6b8v1q"
@devaios/mcp
```

Location:

```text id="y5f7hr"
packages/mcp/
```

---

# Responsibilities

The MCP layer manages:

```text
MCP Server

    |
    |
Connection

    |
    |
Tools

    |
    |
Resources

```

---

# Final Structure

Create:

```text
packages/mcp/

├── src/
│
│   ├── index.ts
│   │
│   ├── client.ts
│   │
│   ├── server.ts
│   │
│   ├── registry.ts
│   │
│   ├── manager.ts
│   │
│   ├── types.ts
│   │
│   └── events.ts
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
mkdir -p packages/mcp

cd packages/mcp

mkdir src tests
```

---

# Step 2 — Package Configuration

Create:

```json
packages/mcp/package.json
```

```json
{
  "name": "@devaios/mcp",
  "version": "0.1.0",
  "type": "module",

  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit"
  },

  "dependencies": {

    "@devaios/plugins":
    "workspace:*",

    "@devaios/events":
    "workspace:*"

  }
}
```

---

# Step 3 — MCP Types

Create:

```ts
src/types.ts
```

```ts
export interface MCPTool {

name:string;

description:string;

inputSchema:
unknown;

}

export interface MCPResource {

uri:string;

name:string;

description?:string;

}

export interface MCPServerConfig {

id:string;

name:string;

command:string;

args:string[];

}
```

---

# Step 4 — MCP Client

Create:

```ts
src/client.ts
```

```ts
export class MCPClient {

constructor(
public config:any
){}

async connect(){

console.log(
`Connecting to ${this.config.name}`
);

}

async disconnect(){

console.log(
`Disconnecting ${this.config.name}`
);

}

async tools(){

return [];

}

}
```

---

# Step 5 — MCP Server Model

Create:

```ts
src/server.ts
```

```ts
import type {
MCPServerConfig
}
from "./types.js";

export class MCPServer {

constructor(
public config:MCPServerConfig
){}

status(){

return {

id:this.config.id,

connected:false

};

}

}
```

---

# Step 6 — Server Registry

Create:

```ts
src/registry.ts
```

```ts
import type {
MCPServer
}
from "./server.js";

export class MCPRegistry {

private servers =
new Map<string,MCPServer>();

register(
server:MCPServer
){

this.servers.set(
server.config.id,
server
);

}

get(
id:string
){

return this.servers.get(id);

}

list(){

return Array.from(
this.servers.values()
);

}

}
```

---

# Step 7 — MCP Manager

Create:

```ts
src/manager.ts
```

```ts
import {
MCPRegistry
}
from "./registry.js";

import {
MCPClient
}
from "./client.js";

export class MCPManager {

constructor(
private registry:
MCPRegistry
){}

async connectAll(){

for(
const server
of this.registry.list()
){

const client =
new MCPClient(
server.config
);

await client.connect();

}

}

}
```

---

# Step 8 — MCP Events

Create:

```ts
src/events.ts
```

```ts
export const MCPEvents = {

CONNECTED:
"MCPConnected",

DISCONNECTED:
"MCPDisconnected",

TOOL_DISCOVERED:
"MCPToolDiscovered"

};
```

---

# Step 9 — Export

Create:

```ts
src/index.ts
```

```ts
export {
MCPManager
}
from "./manager.js";

export {
MCPRegistry
}
from "./registry.js";

export {
MCPClient
}
from "./client.js";

export {
MCPServer
}
from "./server.js";
```

---

# Step 10 — Test

Create:

```ts
tests/mcp.test.ts
```

```ts
import {
describe,
expect,
it
}
from "vitest";

import {
MCPRegistry,
MCPServer
}
from "../src/index.js";

describe(
"mcp",
()=>{

it(
"registers server",
()=>{

const registry =
new MCPRegistry();

registry.register(

new MCPServer({

id:"github",

name:"GitHub MCP",

command:"github-mcp",

args:[]

})

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

# Step 11 — Build

Run:

```bash
pnpm install

pnpm build
```

Expected:

```text
@devaios/mcp ✓
```

---

# Step 12 — Commit

```bash
git add .

git commit -m "feat(mcp): add MCP gateway foundation"
```

---

# Task 16 Completion Criteria

Before moving:

✅ MCP abstraction exists  
✅ MCP servers can register  
✅ MCP lifecycle exists  
✅ Tool discovery foundation exists  
✅ Claude/Cursor integration path exists  

---

# DEVAIOS Architecture Update

Now the full picture:

```text
                         DEVAIOS

                             CLI

                              |

                           Runtime

                              |

 -----------------------------------------------------------------

 Storage

 Workspace

 Plugins

 AI

 Context

 Knowledge

 MCP Gateway

                              |

 -----------------------------------------------------------------

Claude Desktop

Cursor

Ollama

Claude API

OpenAI

Graphify

MCP Servers

                              |

                         Shared Kernel

```

---

# Important Milestone

This is the component that makes DEVAIOS a real **central hub**.

Your workflow eventually becomes:

```text
Open DEVAIOS

↓

Select project

↓

DEVAIOS loads:

✓ Code context

✓ Knowledge graph

✓ MCP tools

✓ AI provider

✓ Previous decisions

↓

Ask anything

```

No more manually configuring every tool.

---
