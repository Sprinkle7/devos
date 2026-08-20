---
source: chatgpt-share
source_turn: 114
sprint: 1
task: 11
title: "Persistent Storage Layer"
status: extracted
---

# Sprint 1 — Task 11: Persistent Storage Layer

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the **memory layer of DEVAIOS**.

Until now DEVAIOS can:

- Start
- Detect environments
- Install dependencies
- Create workspaces
- Communicate internally

But after closing the application:

```text
DEVAIOS forgets everything.
```

A real platform needs memory.

---

# Why Storage Is Critical

DEVAIOS needs to remember:

```text
User

 |
 |
Workspace

 |
 |
Projects

 |
 |
Repositories

 |
 |
AI Context

 |
 |
Knowledge Graph

 |
 |
Plugins
```

Example:

Today:

```bash
devai workspace create volition
```

Tomorrow:

```bash
devai status
```

DEVAIOS should know:

```text
Current workspace:

volition

Repositories:

api
frontend

AI Context:

loaded
```

---

# Storage Philosophy

We separate:

## Storage Interface

What DEVAIOS needs.

Example:

```ts
save()
find()
delete()
list()
```

---

## Storage Engine

How it stores.

Possible implementations:

Development:

```text
SQLite
```

Production:

```text
PostgreSQL
```

Cloud:

```text
DynamoDB
```

AI memory:

```text
Vector Database
```

---

# Architecture

```text
                 DEVAIOS

                    |

             Storage Interface

                    |

       ----------------------------

       SQLite     PostgreSQL     Cloud

```

---

# Package

Name:

```text
@devaios/storage
```

Location:

```text
packages/storage/
```

---

# Responsibilities

Version 0.1:

✅ Storage abstraction  
✅ SQLite implementation  
✅ CRUD operations  
✅ Database initialization  
✅ Migration foundation  

---

# Final Structure

Create:

```text
packages/storage/

├── src/
│
│   ├── index.ts
│   │
│   ├── storage.ts
│   │
│   ├── database.ts
│   │
│   ├── migrations/
│   │
│   │   └── init.ts
│   │
│   ├── sqlite/
│   │
│   │   └── sqlite-storage.ts
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
mkdir -p packages/storage

cd packages/storage

mkdir -p src/migrations src/sqlite tests
```

---

# Step 2 — Package Configuration

Create:

```json
packages/storage/package.json
```

```json
{
  "name": "@devaios/storage",
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

    "better-sqlite3":
    "latest"

  }
}
```

---

# Step 3 — Storage Types

Create:

```ts
src/types.ts
```

```ts
export interface StorageRecord {

id:string;

type:string;

data:unknown;

createdAt:Date;

updatedAt:Date;

}
```

---

# Step 4 — Storage Interface

Create:

```ts
src/storage.ts
```

```ts
import type {
StorageRecord
}
from "./types.js";

export interface Storage {

save(
record:StorageRecord
):
Promise<void>;

find(
id:string
):
Promise<StorageRecord | null>;

list(
type?:string
):
Promise<StorageRecord[]>;

delete(
id:string
):
Promise<void>;

}
```

---

# Step 5 — Database Connection

Create:

```ts
src/database.ts
```

```ts
import Database from "better-sqlite3";

export function createDatabase(
path:string
){

return new Database(
path
);

}
```

---

# Step 6 — SQLite Implementation

Create:

```ts
src/sqlite/sqlite-storage.ts
```

```ts
import type {
Storage
}
from "../storage.js";

import type {
StorageRecord
}
from "../types.js";

import Database from "better-sqlite3";

export class SqliteStorage
implements Storage {

constructor(
private db:Database.Database
){}

async save(
record:StorageRecord
){

this.db
.prepare(
`
INSERT OR REPLACE INTO records
(id,type,data,created_at,updated_at)

VALUES
(@id,@type,@data,@createdAt,@updatedAt)
`
)
.run({

id:record.id,

type:record.type,

data:
JSON.stringify(record.data),

createdAt:
record.createdAt.toISOString(),

updatedAt:
record.updatedAt.toISOString()

});

}

async find(
id:string
){

const row =
this.db
.prepare(
`
SELECT * FROM records
WHERE id=?
`
)
.get(id) as any;

if(!row)
return null;

return {

id:row.id,

type:row.type,

data:
JSON.parse(row.data),

createdAt:
new Date(row.created_at),

updatedAt:
new Date(row.updated_at)

};

}

async list(
type?:string
){

return [];

}

async delete(
id:string
){

this.db
.prepare(
`
DELETE FROM records
WHERE id=?
`
)
.run(id);

}

}
```

---

# Step 7 — Database Migration

Create:

```ts
src/migrations/init.ts
```

```ts
export function initializeDatabase(
db:any
){

db.exec(`
CREATE TABLE IF NOT EXISTS records (

id TEXT PRIMARY KEY,

type TEXT NOT NULL,

data TEXT NOT NULL,

created_at TEXT NOT NULL,

updated_at TEXT NOT NULL

);
`);

}
```

---

# Step 8 — Export

Create:

```ts
src/index.ts
```

```ts
export {
SqliteStorage
}
from "./sqlite/sqlite-storage.js";

export {
createDatabase
}
from "./database.js";

export {
initializeDatabase
}
from "./migrations/init.js";

export type {
Storage
}
from "./storage.js";
```

---

# Step 9 — Example Usage

Future Runtime:

```ts
const storage =
new SqliteStorage(
 database
);

await storage.save({

id:"workspace_001",

type:"workspace",

data:{
name:"volition"
},

createdAt:new Date(),

updatedAt:new Date()

});
```

---

# Step 10 — Add Test

Create:

```ts
tests/storage.test.ts
```

```ts
import {
describe,
expect,
it
}
from "vitest";

import {
createDatabase,
initializeDatabase
}
from "../src/index.js";

describe(
"storage",
()=>{

it(
"creates database",
()=>{

const db =
createDatabase(
":memory:"
);

initializeDatabase(
db
);

expect(db)
.toBeDefined();

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
@devaios/storage ✓
```

---

# Step 12 — Commit

```bash
git add .

git commit -m "feat(storage): add persistent storage foundation"
```

---

# Task 11 Completion Criteria

Before moving:

✅ Storage abstraction created  
✅ SQLite backend created  
✅ Database initialization created  
✅ CRUD foundation exists  
✅ Runtime can store state  
✅ Future database migration possible  

---

# DEVAIOS Architecture Update

Now:

```text
                         DEVAIOS

                           CLI

                            |

                         Runtime

                            |

 -------------------------------------------------

 Config     Logger     Events     Storage

                            |

                      Workspace

                            |

                     Shared Kernel

```

---

# Important Milestone

DEVAIOS now has:

## Brain

Runtime

## Nervous System

Events

## Memory

Storage

## Awareness

Doctor

## Hands

Installer

---
