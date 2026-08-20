---
source: chatgpt-share
source_turn: 128
sprint: 1
task: 18
title: "User Identity & Profile System"
status: extracted
---

# Sprint 1 — Task 18: User Identity & Profile System

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the **identity layer of DEVAIOS**.

This is the system that allows DEVAIOS to understand:

- Who is using it
- User preferences
- Coding style
- AI behavior preferences
- Workspace ownership
- Future team collaboration

---

# Why Identity Matters

A normal AI assistant treats every session as a new user.

Example:

Today:

```text
User:
I prefer TypeScript.
Use clean architecture.
Explain before changing code.
```

Tomorrow:

```text
AI:
How should I structure this project?
```

DEVAIOS should remember.

---

# Identity Architecture

```text
                    DEVAIOS

                       |

                Identity System

                       |

 ------------------------------------------------

 User Profile

 Preferences

 AI Behavior

 Security

 Teams

```

---

# Example User Profile

```json
{
  "name": "Developer",

  "preferences": {

    "language": "typescript",

    "framework": "nextjs",

    "style": "clean architecture"

  },

  "ai": {

    "explanationLevel": "detailed",

    "defaultProvider": "ollama"

  }
}
```

---

# Future Capabilities

Identity enables:

```text
Multiple Users

    ↓

Teams

    ↓

Organizations

    ↓

Permissions

    ↓

Enterprise DEVAIOS
```

---

# Package

Name:

```text
@devaios/identity
```

Location:

```text
packages/identity/
```

---

# Responsibilities

Version 0.1:

✅ User model  
✅ Profile storage  
✅ Preference management  
✅ Identity service  
✅ AI preference integration  

---

# Final Structure

Create:

```text
packages/identity/

├── src/
│
│   ├── index.ts
│   │
│   ├── user.ts
│   │
│   ├── profile.ts
│   │
│   ├── preferences.ts
│   │
│   ├── manager.ts
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
mkdir -p packages/identity

cd packages/identity

mkdir src tests
```

---

# Step 2 — Package Configuration

Create:

```json
packages/identity/package.json
```

```json
{
  "name": "@devaios/identity",
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

# Step 3 — Identity Types

Create:

```ts
src/types.ts
```

```ts
export interface UserPreference {

key:string;

value:string;

}

export interface UserProfile {

id:string;

name:string;

email?:string;

createdAt:Date;

}
```

---

# Step 4 — User Entity

Create:

```ts
src/user.ts
```

```ts
import type {
UserProfile
}
from "./types.js";

export class User {

constructor(
public profile:UserProfile
){}

id(){

return this.profile.id;

}

name(){

return this.profile.name;

}

}
```

---

# Step 5 — Preferences

Create:

```ts
src/preferences.ts
```

```ts
export class PreferenceStore {

private values =
new Map<string,string>();

set(
key:string,
value:string
){

this.values.set(
key,
value
);

}

get(
key:string
){

return this.values.get(
key
);

}

all(){

return Object.fromEntries(
this.values
);

}

}
```

---

# Step 6 — Identity Manager

Create:

```ts
src/manager.ts
```

```ts
import {
PreferenceStore
}
from "./preferences.js";

import {
User
}
from "./user.js";

export class IdentityManager {

private preferences =
new PreferenceStore();

constructor(
private user:User
){}

setPreference(
key:string,
value:string
){

this.preferences.set(
key,
value
);

}

getPreference(
key:string
){

return this.preferences.get(
key
);

}

currentUser(){

return this.user;

}

}
```

---

# Step 7 — Export

Create:

```ts
src/index.ts
```

```ts
export {
IdentityManager
}
from "./manager.js";

export {
PreferenceStore
}
from "./preferences.js";

export {
User
}
from "./user.js";

export type {
UserProfile
}
from "./types.js";
```

---

# Step 8 — Test

Create:

```ts
tests/identity.test.ts
```

```ts
import {
describe,
expect,
it
}
from "vitest";

import {
User,
IdentityManager
}
from "../src/index.js";

describe(
"identity",
()=>{

it(
"stores user preference",
()=>{

const user =
new User({

id:"user1",

name:"Developer",

createdAt:
new Date()

});

const identity =
new IdentityManager(
user
);

identity.setPreference(
"language",
"typescript"
);

expect(
identity.getPreference(
"language"
)
)
.toBe(
"typescript"
);

});

});
```

---

# Step 9 — Build

Run:

```bash
pnpm install

pnpm build
```

Expected:

```text
@devaios/identity ✓
```

---

# Step 10 — Commit

```bash
git add .

git commit -m "feat(identity): add user identity system"
```

---

# Task 18 Completion Criteria

Before moving:

✅ User model created  
✅ Preferences system created  
✅ Identity manager created  
✅ Future team support possible  
✅ AI personalization foundation exists  

---

# DEVAIOS Architecture Update

DEVAIOS now understands the user:

```text
                         DEVAIOS

                            CLI

                             |

                          Runtime

                             |

 ----------------------------------------------------------------

 Identity

 Secrets

 Config

 Storage

 Workspace

 Plugins

 AI

 Context

 Knowledge

 MCP

                             |

 ----------------------------------------------------------------

 User

 Projects

 AI Models

 Tools

 Memory

```

---

# New Capability

DEVAIOS can now answer:

> "How should I help this developer?"

instead of:

> "What is this random request?"

---

# Example Future Flow

User opens DEVAIOS:

```
devai start
```

DEVAIOS loads:

```
✓ User profile

✓ Coding preferences

✓ Previous projects

✓ Knowledge graph

✓ Available AI providers

✓ MCP tools

✓ Context memory
```

Then:

```
Ready.

Current project:
Volition

Preferred AI:
Ollama + Claude fallback

Coding style:
Clean architecture
```

---
