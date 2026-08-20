---
source: chatgpt-share
source_turn: 116
sprint: 1
task: 12
title: "Plugin System Foundation"
status: extracted
---

# Sprint 1 — Task 12: Plugin System Foundation

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the **extension architecture of DEVAIOS**.

This is one of the most important parts of the entire platform.

The goal:

> DEVAIOS should not be a fixed application. It should be an operating system where capabilities can be installed.

---

# Why Plugins Matter

Your original vision includes:

- Headroom
- Ponytail
- Graphify
- Ollama
- Claude Desktop
- Cursor
- MCP servers
- AI agents
- Custom tools

These should not become hardcoded features.

Instead:

```text id="q6h8u4"
                DEVAIOS CORE

                     |

              Plugin Runtime

                     |

 ------------------------------------------------

 AI Plugin     MCP Plugin     Git Plugin

 Cloud Plugin  Database Plugin  Custom Plugin

```

---

# Plugin Examples

## AI Provider Plugin

```text id="6q9k7f"
ollama-provider

Provides:

- local models
- embeddings
- inference
```

---

## MCP Plugin

```text id="cx9y7z"
mcp-github

Provides:

- repositories
- issues
- pull requests
```

---

## Developer Tool Plugin

```text id="9g8jvf"
cursor-integration

Provides:

- editor context
- commands
```

---

# Plugin Philosophy

A plugin must be:

- Discoverable
- Installable
- Versioned
- Configurable
- Removable

---

# Plugin Lifecycle

```text id="0d8h5v"
Installed

   ↓

Loaded

   ↓

Initialized

   ↓

Running

   ↓

Stopped

   ↓

Removed
```

---

# Package

Name:

```text id="j6x5o2"
@devaios/plugins
```

Location:

```text id="3r2h1w"
packages/plugins/
```

---

# Responsibilities

Version 0.1:

✅ Plugin interface  
✅ Plugin metadata  
✅ Plugin registry  
✅ Plugin loading  
✅ Plugin lifecycle  
✅ Plugin events  

---

# Final Structure

Create:

```text id="c6osd3"
packages/plugins/

├── src/
│
│   ├── index.ts
│   │
│   ├── plugin.ts
│   │
│   ├── registry.ts
│   │
│   ├── manager.ts
│   │
│   ├── lifecycle.ts
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

```bash id="o7f5d1"
mkdir -p packages/plugins

cd packages/plugins

mkdir src tests
```

---

# Step 2 — Package Configuration

Create:

```json id="r4j0wk"
packages/plugins/package.json
```

```json
{
  "name": "@devaios/plugins",
  "version": "0.1.0",
  "type": "module",

  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit"
  },

  "dependencies": {

    "@devaios/shared-kernel":
    "workspace:*",

    "@devaios/events":
    "workspace:*"

  }
}
```

---

# Step 3 — Plugin Lifecycle

Create:

```ts
src/lifecycle.ts
```

```ts
export enum PluginState {

INSTALLED =
"installed",

LOADED =
"loaded",

RUNNING =
"running",

STOPPED =
"stopped",

FAILED =
"failed"

}
```

---

# Step 4 — Plugin Definition

Create:

```ts
src/plugin.ts
```

```ts
import type {
PluginState
}
from "./lifecycle.js";

export interface DevaiPlugin {

id:string;

name:string;

version:string;

state:
PluginState;

initialize():
Promise<void>;

start():
Promise<void>;

stop():
Promise<void>;

}
```

---

# Example Plugin

A plugin would look like:

```ts
const plugin = {

id:
"ollama",

name:
"Ollama Provider",

version:
"1.0.0",

state:
PluginState.INSTALLED,

async initialize(){

},

async start(){

},

async stop(){

}

};
```

---

# Step 5 — Plugin Registry

Create:

```ts
src/registry.ts
```

```ts
import type {
DevaiPlugin
}
from "./plugin.js";

export class PluginRegistry {

private plugins =
new Map<string,DevaiPlugin>();

register(
plugin:DevaiPlugin
){

this.plugins.set(
plugin.id,
plugin
);

}

get(
id:string
){

return this.plugins.get(id);

}

list(){

return Array.from(
this.plugins.values()
);

}

}
```

---

# Step 6 — Plugin Manager

Create:

```ts
src/manager.ts
```

```ts
import {
PluginState
}
from "./lifecycle.js";

import type {
DevaiPlugin
}
from "./plugin.js";

import {
PluginRegistry
}
from "./registry.js";

export class PluginManager {

constructor(
private registry:
PluginRegistry
){}

async startAll(){

for(
const plugin
of this.registry.list()
){

await plugin.initialize();

await plugin.start();

plugin.state =
PluginState.RUNNING;

}

}

async stopAll(){

for(
const plugin
of this.registry.list()
){

await plugin.stop();

plugin.state =
PluginState.STOPPED;

}

}

}
```

---

# Step 7 — Plugin Events

Create:

```ts
src/events.ts
```

```ts
export const PluginEvents = {

INSTALLED:
"PluginInstalled",

STARTED:
"PluginStarted",

STOPPED:
"PluginStopped",

FAILED:
"PluginFailed"

};
```

---

# Step 8 — Export Everything

Create:

```ts
src/index.ts
```

```ts
export {
PluginManager
}
from "./manager.js";

export {
PluginRegistry
}
from "./registry.js";

export {
PluginState
}
from "./lifecycle.js";

export type {
DevaiPlugin
}
from "./plugin.js";
```

---

# Step 9 — Test

Create:

```ts
tests/plugin.test.ts
```

```ts
import {
describe,
expect,
it
}
from "vitest";

import {
PluginRegistry
}
from "../src/index.js";

describe(
"plugins",
()=>{

it(
"registers plugin",
()=>{

const registry =
new PluginRegistry();

registry.register({

id:"test",

name:"Test Plugin",

version:"1.0",

state:"installed",

async initialize(){},

async start(){},

async stop(){}

});

expect(
registry.list()
.length
)
toBe(1);

});

});
```

---

# Step 10 — Build

Run:

```bash
pnpm install

pnpm build
```

Expected:

```text
@devaios/plugins ✓
```

---

# Step 11 — Commit

```bash
git add .

git commit -m "feat(plugins): add plugin system foundation"
```

---

# Task 12 Completion Criteria

Before moving:

✅ Plugin contract created  
✅ Lifecycle implemented  
✅ Registry works  
✅ Manager works  
✅ Events defined  
✅ Future MCP support possible  

---

# DEVAIOS Architecture Now

We have reached a major architecture milestone:

```
                         DEVAIOS

                           CLI

                            |

                         Runtime

                            |

        ------------------------------------------------

        Config      Logger      Events      Storage

                            |

                      Plugin System

                            |

        ------------------------------------------------

        Workspace      AI       MCP       Tools

                            |

                     Shared Kernel

```

---

# What This Enables

Now DEVAIOS can eventually do:

```bash
devai plugin install ollama

devai plugin install github-mcp

devai plugin install cursor

devai plugin install graphify

devai plugin install headroom
```

The platform no longer needs new code for every integration.

---
