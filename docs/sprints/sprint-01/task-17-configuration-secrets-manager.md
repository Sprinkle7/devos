---
source: chatgpt-share
source_turn: 126
sprint: 1
task: 17
title: "Configuration & Secrets Manager"
status: extracted
---

# Sprint 1 — Task 17: Configuration & Secrets Manager

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the **secure configuration layer** of DEVAIOS.

This is required before DEVAIOS connects to real services.

It will manage:

- Claude API keys
- OpenAI API keys
- Ollama configuration
- MCP credentials
- GitHub tokens
- AWS credentials
- Plugin settings
- User preferences

---

# Why We Need This

Without a central secrets system:

```text
Claude Desktop
     |
     └── API Key

Cursor
     |
     └── API Key

MCP Server
     |
     └── Token

DEVAIOS
     |
     └── Another Token
```

Problems:

- Keys duplicated
- Hard to rotate
- Unsafe storage
- Different configurations everywhere

---

# DEVAIOS Approach

One secure vault:

```text
                    DEVAIOS

                       |

              Configuration Manager

                       |

              Secrets Vault

                       |

 ------------------------------------------------

 Claude Key

 OpenAI Key

 GitHub Token

 AWS Credentials

 MCP Secrets

```

---

# Security Principles

DEVAIOS must:

✅ Never store plain text secrets in git  
✅ Encrypt sensitive values  
✅ Support environment variables  
✅ Support Docker secrets  
✅ Support local development  
✅ Support cloud deployment  

---

# Storage Strategy

DEVAIOS supports multiple backends.

## Development

```text
.env
```

---

## Local Production

```text
Encrypted SQLite
```

---

## Enterprise

```text
AWS Secrets Manager

Hashicorp Vault

Azure Key Vault
```

---

# Package

Name:

```text
@devaios/secrets
```

Location:

```text
packages/secrets/
```

---

# Responsibilities

Version 0.1:

✅ Configuration loading  
✅ Environment variables  
✅ Secret abstraction  
✅ Encryption foundation  
✅ Validation  
✅ Configuration schema  

---

# Final Structure

Create:

```text
packages/secrets/

├── src/
│
│   ├── index.ts
│   │
│   ├── config.ts
│   │
│   ├── secret.ts
│   │
│   ├── manager.ts
│   │
│   ├── encryption.ts
│   │
│   ├── validator.ts
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
mkdir -p packages/secrets

cd packages/secrets

mkdir src tests
```

---

# Step 2 — Package Configuration

Create:

```json
packages/secrets/package.json
```

```json
{
  "name": "@devaios/secrets",
  "version": "0.1.0",
  "type": "module",

  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit"
  },

  "dependencies": {

    "@devaios/storage":
    "workspace:*"

  }
}
```

---

# Step 3 — Secret Types

Create:

```ts
src/types.ts
```

```ts
export type SecretProvider =

"environment"
|
"file"
|
"database"
|
"cloud";

export interface SecretValue {

key:string;

value:string;

provider:
SecretProvider;

encrypted:boolean;

}
```

---

# Step 4 — Configuration Model

Create:

```ts
src/config.ts
```

```ts
export interface DevaiConfig {

appName:string;

environment:
"development"
|
"production";

ai?:{

defaultProvider:string;

};

storage?:{

database:string;

};

plugins?:{

directory:string;

};

}
```

---

# Step 5 — Secret Interface

Create:

```ts
src/secret.ts
```

```ts
export interface SecretStore {

set(
key:string,
value:string
):
Promise<void>;

get(
key:string
):
Promise<string | null>;

remove(
key:string
):
Promise<void>;

}
```

---

# Step 6 — Encryption Foundation

Create:

```ts
src/encryption.ts
```

```ts
export class EncryptionService {

encrypt(
value:string
){

return Buffer
.from(value)
.toString(
"base64"
);

}

decrypt(
value:string
){

return Buffer
.from(
value,
"base64"
)
.toString();

}

}
```

---

# Important Note

This is only a foundation.

Later replace with:

```text
AES-256-GCM
```

or:

```text
libsodium
```

for production security.

---

# Step 7 — Secret Manager

Create:

```ts
src/manager.ts
```

```ts
import {
EncryptionService
}
from "./encryption.js";

export class SecretManager {

private memory =
new Map<string,string>();

private encryption =
new EncryptionService();

async set(
key:string,
value:string
){

this.memory.set(

key,

this.encryption.encrypt(value)

);

}

async get(
key:string
){

const value =
this.memory.get(
key
);

if(!value)
return null;

return this.encryption.decrypt(
value
);

}

async remove(
key:string
){

this.memory.delete(
key
);

}

}
```

---

# Step 8 — Validator

Create:

```ts
src/validator.ts
```

```ts
export function requireSecret(
value:string | null,
name:string
){

if(!value){

throw new Error(
`Missing secret: ${name}`
);

}

return value;

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
SecretManager
}
from "./manager.js";

export {
EncryptionService
}
from "./encryption.js";

export {
requireSecret
}
from "./validator.js";

export type {
SecretStore
}
from "./secret.js";
```

---

# Step 10 — Test

Create:

```ts
tests/secrets.test.ts
```

```ts
import {
describe,
expect,
it
}
from "vitest";

import {
SecretManager
}
from "../src/index.js";

describe(
"secrets",
()=>{

it(
"stores encrypted secrets",
async()=>{

const manager =
new SecretManager();

await manager.set(
"CLAUDE_KEY",
"abc123"
);

const value =
await manager.get(
"CLAUDE_KEY"
);

expect(value)
.toBe(
"abc123"
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
@devaios/secrets ✓
```

---

# Step 12 — Commit

```bash
git add .

git commit -m "feat(secrets): add configuration and secrets manager"
```

---

# Task 17 Completion Criteria

Before moving:

✅ Configuration system exists  
✅ Secret abstraction exists  
✅ Encryption layer exists  
✅ Validation exists  
✅ Future cloud vault support possible  

---

# DEVAIOS Architecture Update

Now we have security:

```text
                         DEVAIOS

                            CLI

                             |

                          Runtime

                             |

 ----------------------------------------------------------------

 Config

 Secrets

 Storage

 Workspace

 Plugins

 AI

 Context

 Knowledge

 MCP

                             |

 ----------------------------------------------------------------

 Claude

 Ollama

 OpenAI

 MCP Servers

 External Services

                             |

                       Shared Kernel

```

---

# Current Sprint 1 Progress

Completed:

| Task | Component | Status |
|-|-|-|
| 1 | Monorepo Foundation | ✅ |
| 2 | Shared Kernel | ✅ |
| 3 | Runtime | ✅ |
| 4 | CLI | ✅ |
| 5 | Logger | ✅ |
| 6 | Events | ✅ |
| 7 | Workspace | ✅ |
| 8 | Doctor | ✅ |
| 9 | Installer | ✅ |
| 10 | Storage | ✅ |
| 11 | Plugins | ✅ |
| 12 | AI Layer | ✅ |
| 13 | Context | ✅ |
| 14 | Knowledge Graph | ✅ |
| 15 | MCP Gateway | ✅ |
| 16 | Secrets Manager | ✅ |

---
