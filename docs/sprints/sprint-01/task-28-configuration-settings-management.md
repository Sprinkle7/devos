---
source: chatgpt-share
source_turn: 148
sprint: 1
task: 28
title: "Configuration & Settings Management"
status: extracted
---

# Sprint 1 — Task 28: Configuration & Settings Management

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the **central configuration brain of DEVAIOS**.

Every serious application needs one place where it understands:

- How it is configured
- Which services are enabled
- Which AI providers are available
- Which plugins are installed
- Which environment it is running in
- What the user prefers

---

# Why Configuration Exists

Without a configuration system:

```text
DEVAIOS

AI keys everywhere

Environment variables everywhere

Plugin settings everywhere

Project settings everywhere

Docker settings everywhere

```

Problems:

- Hard to install
- Hard to backup
- Hard to migrate
- Hard to self-host

---

# With Configuration

Everything becomes:

```text id="s2n7m5"
                 DEVAIOS Config

                      |

 ------------------------------------------------

 AI Providers

 Runtime

 Projects

 Plugins

 Security

 Deployment

 User Preferences

```

---

# Example Configuration

File:

```yaml id="h4v8m2"
devaios.config.yml

system:

name:
DEVAIOS

environment:
production

ai:

providers:

- claude

- ollama

runtime:

docker:true

node:
24

plugins:

github:true

graphify:true

```

---

# Configuration Sources

DEVAIOS should support:

## 1. Default Configuration

Built into application.

```text
defaults
```

---

## 2. User Configuration

User preferences.

```text
~/.devaios/config
```

---

## 3. Project Configuration

Project-specific.

```text
project/.devaios/config
```

---

## 4. Environment Variables

For deployment.

```bash
DEVAIOS_API_KEY=value
```

---

# Configuration Priority

Highest priority wins:

```text id="j3k7m9"
Environment Variables

        ↑

Project Config

        ↑

User Config

        ↑

Default Config

```

---

# Package

Name:

```text
@devaios/config
```

Location:

```text
packages/config/
```

---

# Responsibilities

Version 0.1:

✅ Configuration loading  
✅ Configuration merging  
✅ Environment variables  
✅ Feature flags  
✅ User preferences  
✅ Secret references  

---

# Final Structure

Create:

```text id="a8q4n1"
packages/config/

├── src/
│
│   ├── index.ts
│   │
│   ├── config.ts
│   │
│   ├── loader.ts
│   │
│   ├── schema.ts
│   │
│   ├── merge.ts
│   │
│   ├── environment.ts
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
mkdir -p packages/config

cd packages/config

mkdir src tests
```

---

# Step 2 — Package Configuration

Create:

```json
packages/config/package.json
```

```json
{
  "name":"@devaios/config",

  "version":"0.1.0",

  "type":"module",

  "scripts":{

    "build":"tsc",

    "test":"vitest",

    "lint":"eslint src",

    "typecheck":"tsc --noEmit"

  },

  "dependencies":{

    "zod":"^3.23.0"

  }
}
```

---

# Step 3 — Configuration Types

Create:

```ts
src/types.ts
```

```ts
export interface AIConfig {

providers:string[];

defaultProvider:string;

}

export interface RuntimeConfig {

docker:boolean;

nodeVersion?:string;

pythonVersion?:string;

}

export interface DevAIOSConfig {

name:string;

environment:string;

ai:AIConfig;

runtime:RuntimeConfig;

plugins:Record<string,boolean>;

}
```

---

# Step 4 — Configuration Schema

Create:

```ts
src/schema.ts
```

```ts
import {
z
}
from "zod";

export const ConfigSchema =
z.object({

name:
z.string(),

environment:
z.string(),

ai:
z.object({

providers:
z.array(
z.string()
),

defaultProvider:
z.string()

}),

runtime:
z.object({

docker:
z.boolean()

})

});
```

---

# Step 5 — Config Loader

Create:

```ts
src/loader.ts
```

```ts
import {
ConfigSchema
}
from "./schema.js";

export class ConfigLoader {

load(
data:any
){

return ConfigSchema.parse(
data
);

}

}
```

---

# Step 6 — Configuration Merge

Create:

```ts
src/merge.ts
```

```ts
export class ConfigMerger {

merge(
base:any,

override:any

){

return {

...base,

...override

};

}

}
```

---

# Step 7 — Environment Reader

Create:

```ts
src/environment.ts
```

```ts
export class EnvironmentReader {

get(
key:string
){

return process.env[key];

}

has(
key:string
){

return Boolean(
process.env[key]
);

}

}
```

---

# Step 8 — Config Manager

Create:

```ts
src/config.ts
```

```ts
import {
ConfigLoader
}
from "./loader.js";

export class ConfigManager {

constructor(
private loader =
new ConfigLoader()
){}

load(
data:any
){

return this.loader.load(
data
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
ConfigManager
}
from "./config.js";

export {
ConfigLoader
}
from "./loader.js";

export {
ConfigMerger
}
from "./merge.js";

export {
EnvironmentReader
}
from "./environment.js";
```

---

# Step 10 — Test

Create:

```ts
tests/config.test.ts
```

```ts
import {

describe,

expect,

it

}

from "vitest";

import {
ConfigLoader
}
from "../src/index.js";

describe(
"config",
()=>{

it(
"loads configuration",
()=>{

const loader =
new ConfigLoader();

const config =
loader.load({

name:"DEVAIOS",

environment:"dev",

ai:{

providers:[
"claude"
],

defaultProvider:
"claude"

},

runtime:{

docker:true

}

});

expect(
config.name
)
toBe(
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
@devaios/config ✓
```

---

# Step 12 — Commit

```bash
git add .

git commit -m "feat(config): add configuration management system"
```

---

# Task 28 Completion Criteria

Before moving:

✅ Configuration system exists  
✅ Multiple configuration sources supported  
✅ Environment variables supported  
✅ Validation exists  
✅ Feature flags foundation exists  

---

# DEVAIOS Architecture Update

Now DEVAIOS can configure itself:

```text
                         DEVAIOS

                            |

                       Config Engine

                            |

 ------------------------------------------------

 AI Providers

 Runtime

 Plugins

 Security

 Deployment

 Projects

 User Preferences

                            |

 ------------------------------------------------

 Agents

 Tools

 Dashboard

 MCP

 Memory

```

---

# New Capability

Fresh installation:

```bash
devai install
```

DEVAIOS reads:

```text
✓ Hardware detected

✓ Docker available

✓ Node version checked

✓ AI providers found

✓ Plugins available

✓ Configuration created

```

---

# Sprint 1 Foundation Nearly Complete

Completed:

✅ Core  
✅ AI  
✅ Agents  
✅ Tools  
✅ Memory  
✅ Runtime  
✅ Dashboard  
✅ Deployment  
✅ Security  
✅ Observability  
✅ Configuration  

---
