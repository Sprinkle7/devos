---
source: chatgpt-share
source_turn: 98
sprint: 1
task: 3
title: "Configuration Service"
status: extracted
---

# Sprint 1 — Task 3: Configuration Service

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the **configuration foundation** for DEVAIOS.

Every serious platform needs a predictable configuration system.

Configuration mistakes create some of the hardest production bugs:

- Wrong environment loaded
- Missing secrets
- Invalid settings
- Different behavior on different machines
- "It works on my machine" problems

DEVAIOS must have one configuration system used by:

- Runtime
- Plugins
- Services
- CLI
- Dashboard
- Agents

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

The configuration service will:

✅ Load defaults  
✅ Load `.env` values  
✅ Load YAML configuration  
✅ Support environments  
✅ Validate configuration  
✅ Provide typed access  
✅ Prevent invalid startup  

---

# Configuration Priority

Higher priority overrides lower priority.

```text
CLI Arguments

        ↓

Environment Variables

        ↓

Config File

        ↓

Default Values
```

Example:

Default:

```yaml
port: 3000
```

Environment:

```bash
DEVAIOS_PORT=4000
```

Result:

```yaml
port: 4000
```

---

# Configuration Philosophy

Applications should NOT do this:

```ts
process.env.DATABASE_URL
```

Never.

Instead:

```ts
config.database.url
```

One source of truth.

---

# Final Structure

Create:

```text
packages/config/

├── src/
│
│   ├── index.ts
│   │
│   ├── schema/
│   │   ├── config.schema.ts
│   │   └── index.ts
│   │
│   ├── loader/
│   │   ├── env.ts
│   │   ├── yaml.ts
│   │   └── index.ts
│   │
│   ├── profiles/
│   │   ├── development.ts
│   │   ├── production.ts
│   │   └── index.ts
│   │
│   └── config.ts
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
mkdir -p packages/config

cd packages/config

mkdir -p src/{schema,loader,profiles} tests
```

---

# Step 2 — Package Configuration

Create:

```json
packages/config/package.json
```

```json
{
  "name": "@devaios/config",
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
    "dotenv": "latest",
    "yaml": "latest",
    "zod": "latest"
  }
}
```

---

# Step 3 — Configuration Schema

We use Zod.

Why?

Because we get:

- Runtime validation
- TypeScript types
- Better errors

---

Create:

```ts
src/schema/config.schema.ts
```

```ts
import { z } from "zod";

export const ConfigSchema = z.object({

  environment:
    z.enum([
      "development",
      "production",
      "test"
    ])
    .default("development"),

  server: z.object({

    host:
      z.string()
      .default("localhost"),

    port:
      z.number()
      .default(3000)

  }),

  logging: z.object({

    level:
      z.enum([
        "debug",
        "info",
        "warn",
        "error"
      ])
      .default("info")

  }),

  database: z.object({

    url:
      z.string()
      .optional()

  }),

  ai: z.object({

    provider:
      z.string()
      .optional()

  })

});

export type DevaiConfig =
z.infer<typeof ConfigSchema>;
```

---

# Step 4 — Default Configuration

Create:

```ts
src/profiles/development.ts
```

```ts
export default {

 environment:"development",

 server:{
   host:"localhost",
   port:3000
 },

 logging:{
   level:"debug"
 },

 database:{
   url:null
 },

 ai:{
   provider:null
 }

};
```

---

# Step 5 — Environment Loader

Create:

```ts
src/loader/env.ts
```

```ts
export function loadEnv(){

 return {

  environment:
   process.env.DEVAIOS_ENV,

  database:{
    url:
    process.env.DATABASE_URL
  },

  ai:{
    provider:
    process.env.LLM_PROVIDER
  }

 };

}
```

---

# Step 6 — YAML Loader

Create:

```ts
src/loader/yaml.ts
```

```ts
import fs from "node:fs";

import YAML from "yaml";

export function loadYaml(
 path:string
){

 if(!fs.existsSync(path)){
  return {};
 }

 const content =
 fs.readFileSync(
  path,
  "utf8"
 );

 return YAML.parse(content);

}
```

---

# Step 7 — Configuration Builder

Create:

```ts
src/config.ts
```

```ts
import {
 ConfigSchema
} from "./schema/config.schema.js";

import development
from "./profiles/development.js";

import {
 loadEnv
} from "./loader/env.js";

export function createConfig(){

 const merged = {

   ...development,

   ...loadEnv()

 };

 return ConfigSchema.parse(
  merged
 );

}
```

---

# Step 8 — Export

Create:

```ts
src/index.ts
```

```ts
export * from "./config.js";

export * from "./schema/config.schema.js";
```

---

# Step 9 — Test

Create:

```ts
tests/config.test.ts
```

```ts
import {
 describe,
 expect,
 it
} from "vitest";

import {
 createConfig
} from "../src/index.js";

describe(
"configuration",
()=>{

it(
"loads defaults",
()=>{

const config =
createConfig();

expect(
config.environment
)
.toBe(
"development"
);

});

});
```

---

# Step 10 — Install Dependencies

From root:

```bash
pnpm install
```

---

# Step 11 — Build

```bash
pnpm build
```

Expected:

```text
@devaios/shared-kernel ✓

@devaios/config ✓
```

---

# Step 12 — Commit

```bash
git add .

git commit -m "feat(config): add configuration service"
```

---

# Task 3 Completion Criteria

Before moving forward:

✅ Typed configuration  
✅ Environment support  
✅ YAML support  
✅ Validation  
✅ Tests  
✅ Shared Kernel dependency  
✅ Builds inside monorepo  

---

# Current DEVAIOS Foundation

We now have:

```text
DEVAIOS

├── Shared Kernel
│
└── Configuration
```

Architecture:

```text
             Runtime
                |
                |
        Configuration
                |
                |
        Shared Kernel
```

---
