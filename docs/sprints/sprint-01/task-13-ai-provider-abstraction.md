---
source: chatgpt-share
source_turn: 118
sprint: 1
task: 13
title: "AI Provider Abstraction"
status: extracted
---

# Sprint 1 — Task 13: AI Provider Abstraction

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the **universal AI layer of DEVAIOS**.

This is the component that allows DEVAIOS to use:

- Ollama on your M4 Pro
- Claude API
- OpenAI API
- Local models
- Future AI providers

without changing the rest of the system.

---

# Why We Need an AI Layer

Without abstraction:

```text
DEVAIOS
   |
   |
 Ollama code everywhere

 Claude code everywhere

 OpenAI code everywhere
```

This becomes impossible to maintain.

---

# With AI Abstraction

```text
                    DEVAIOS

                       |

                 AI Interface

                       |

 ------------------------------------------------

 Ollama          Claude          OpenAI

 Local          Cloud           Cloud

```

The application only knows:

> "I need an AI provider."

It does not care where the intelligence comes from.

---

# Connection To Your OmniRoute Idea

This is where the architecture starts supporting:

```text
User Request

      |

 AI Router

      |

 -------------------------

 Local M4 Pro      Cloud AI

 Ollama            Claude

```

Example:

Simple coding task:

```text
Use Ollama
```

Complex architecture:

```text
Use Claude
```

Private repository:

```text
Use local model
```

---

# Package

Name:

```text
@devaios/ai
```

Location:

```text
packages/ai/
```

---

# Responsibilities

Version 0.1:

✅ AI provider interface  
✅ Provider registry  
✅ AI request model  
✅ AI response model  
✅ Provider selection  
✅ Ollama foundation  
✅ Claude foundation  

---

# Future Features

Later:

```text
AI Router

Token optimization

Cost tracking

Prompt compression

Context management

Model benchmarking
```

---

# Architecture

```text
                 DEVAIOS

                    |

              AI Manager

                    |

        -----------------------

        Provider Registry

                    |

 ------------------------------------------------

 Ollama       Claude       OpenAI       Custom

```

---

# Final Structure

Create:

```text
packages/ai/

├── src/
│
│   ├── index.ts
│   │
│   ├── provider.ts
│   │
│   ├── manager.ts
│   │
│   ├── types.ts
│   │
│   ├── registry.ts
│   │
│   └── providers/
│
│       ├── ollama.ts
│       ├── claude.ts
│       └── openai.ts
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
mkdir -p packages/ai

cd packages/ai

mkdir -p src/providers tests
```

---

# Step 2 — Package Configuration

Create:

```json
packages/ai/package.json
```

```json
{
  "name": "@devaios/ai",
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
    "workspace:*"

  }
}
```

---

# Step 3 — AI Types

Create:

```ts
src/types.ts
```

```ts
export interface AIMessage {

role:
"user" | "assistant" | "system";

content:
string;

}

export interface AIRequest {

messages:
AIMessage[];

model?:string;

temperature?:number;

}

export interface AIResponse {

content:string;

model:string;

provider:string;

usage?:{

input:number;

output:number;

};

}
```

---

# Step 4 — Provider Contract

Create:

```ts
src/provider.ts
```

```ts
import type {
AIRequest,
AIResponse
}
from "./types.js";

export interface AIProvider {

id:string;

name:string;

chat(
request:AIRequest
):
Promise<AIResponse>;

available():
Promise<boolean>;

}
```

---

# Step 5 — Provider Registry

Create:

```ts
src/registry.ts
```

```ts
import type {
AIProvider
}
from "./provider.js";

export class AIRegistry {

private providers =
new Map<string,AIProvider>();

register(
provider:AIProvider
){

this.providers.set(
provider.id,
provider
);

}

get(
id:string
){

return this.providers.get(id);

}

list(){

return Array.from(
this.providers.values()
);

}

}
```

---

# Step 6 — AI Manager

Create:

```ts
src/manager.ts
```

```ts
import type {
AIRequest
}
from "./types.js";

import {
AIRegistry
}
from "./registry.js";

export class AIManager {

constructor(
private registry:
AIRegistry
){}

async chat(
provider:string,
request:AIRequest
){

const ai =
this.registry.get(
provider
);

if(!ai){

throw new Error(
`AI provider ${provider} not found`
);

}

return ai.chat(
request
);

}

}
```

---

# Step 7 — Ollama Provider

Create:

```ts
src/providers/ollama.ts
```

```ts
import type {
AIProvider
}
from "../provider.js";

export class OllamaProvider
implements AIProvider {

id =
"ollama";

name =
"Ollama Local AI";

async available(){

return true;

}

async chat(
request:any
){

return {

content:
"Response from Ollama",

model:
"local",

provider:
"ollama"

};

}

}
```

---

# Step 8 — Claude Provider

Create:

```ts
src/providers/claude.ts
```

```ts
import type {
AIProvider
}
from "../provider.js";

export class ClaudeProvider
implements AIProvider {

id =
"claude";

name =
"Anthropic Claude";

async available(){

return true;

}

async chat(
request:any
){

return {

content:
"Response from Claude",

model:
"claude",

provider:
"claude"

};

}

}
```

---

# Step 9 — OpenAI Provider

Create:

```ts
src/providers/openai.ts
```

```ts
import type {
AIProvider
}
from "../provider.js";

export class OpenAIProvider
implements AIProvider {

id =
"openai";

name =
"OpenAI";

async available(){

return true;

}

async chat(
request:any
){

return {

content:
"Response from OpenAI",

model:
"gpt",

provider:
"openai"

};

}

}
```

---

# Step 10 — Export

Create:

```ts
src/index.ts
```

```ts
export {
AIManager
}
from "./manager.js";

export {
AIRegistry
}
from "./registry.js";

export {
OllamaProvider
}
from "./providers/ollama.js";

export {
ClaudeProvider
}
from "./providers/claude.js";

export {
OpenAIProvider
}
from "./providers/openai.js";

export type {
AIProvider
}
from "./provider.js";
```

---

# Step 11 — Test

Create:

```ts
tests/ai.test.ts
```

```ts
import {
describe,
expect,
it
}
from "vitest";

import {
AIRegistry,
OllamaProvider
}
from "../src/index.js";

describe(
"ai",
()=>{

it(
"registers provider",
()=>{

const registry =
new AIRegistry();

registry.register(
new OllamaProvider()
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

# Step 12 — Build

Run:

```bash
pnpm install

pnpm build
```

Expected:

```text
@devaios/ai ✓
```

---

# Step 13 — Commit

```bash
git add .

git commit -m "feat(ai): add AI provider abstraction"
```

---

# Task 13 Completion Criteria

Before moving:

✅ AI interface exists  
✅ Providers are interchangeable  
✅ Ollama supported  
✅ Claude supported  
✅ OpenAI supported  
✅ Registry works  
✅ AI manager works  

---

# DEVAIOS Architecture Update

Now:

```text
                         DEVAIOS

                           CLI

                            |

                         Runtime

                            |

 ------------------------------------------------------

 Config   Events   Storage   Doctor   Installer

                            |

                      Plugin System

                            |

                      AI Abstraction

                            |

 ------------------------------------------------------

 Ollama          Claude          OpenAI

                            |

                     Shared Kernel

```

---

# Major Milestone

At this point DEVAIOS has the foundation required for:

- OmniRoute style routing
- Local AI on your M4 Pro
- Cloud AI fallback
- AI plugins
- Model switching

Your original goal:

> "Can Claude run through Ollama via OmniRoute?"

The architecture now has the correct place for that capability.

---
