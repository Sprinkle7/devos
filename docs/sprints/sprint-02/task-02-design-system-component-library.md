---
source: chatgpt-share
source_turn: 156
sprint: 2
task: 2
title: "DEVAIOS Design System & Component Library"
status: extracted
---

# Sprint 2 — Task 2: DEVAIOS Design System & Component Library

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Create the **shared visual language of DEVAIOS**.

Every screen in DEVAIOS should feel like one unified product.

Instead of building UI separately:

```text
Dashboard

different style

Chat

different style

Settings

different style

```

We create:

```text
                 DEVAIOS UI System

                      |

 ------------------------------------------------

 Buttons

 Cards

 Panels

 Navigation

 Chat Components

 Agent Components

 Terminal Components

 Code Components

```

---

# Why UI Library Exists

DEVAIOS will have many interfaces:

- Desktop app
- Web dashboard
- Mobile companion app
- Plugin interfaces
- Agent panels

A shared design system prevents duplication.

---

# Technology Choice

Recommended:

## React + Tailwind + Radix UI

Architecture:

```text
@devaios/ui

React Components

        |

Tailwind Styling

        |

Radix Accessibility

```

---

# Design Direction

DEVAIOS identity:

## "AI Developer Workspace"

Style:

- Dark-first
- Professional
- Minimal
- Developer focused
- High information density

Inspired by:

- VS Code
- Linear
- Raycast
- Cursor

---

# Design Tokens

Create:

```text
packages/ui/src/tokens/
```

---

## Colors

```ts
export const colors = {

background:
"#0d1117",

surface:
"#161b22",

border:
"#30363d",

primary:
"#6366f1",

success:
"#22c55e",

warning:
"#f59e0b",

danger:
"#ef4444"

}
```

---

# Typography

```text
Font:

Inter

Code:

JetBrains Mono

Heading:

Semi-bold

Body:

Regular

```

---

# Package

Name:

```text
@devaios/ui
```

Location:

```text
packages/ui/
```

---

# Responsibilities

Version 0.1:

✅ Design tokens  
✅ Base components  
✅ Layout components  
✅ Chat UI  
✅ Agent UI  
✅ Terminal UI  
✅ Notification system  

---

# Final Structure

Create:

```text
packages/ui/

├── src/
│
│   ├── index.ts
│
│   ├── components/
│   │
│   ├── Button/
│   ├── Card/
│   ├── Panel/
│   ├── Sidebar/
│   ├── Dialog/
│   ├── Input/
│   ├── Badge/
│   ├── Avatar/
│   ├── Tabs/
│   │
│   ├── chat/
│   │
│   │   ├── Message.tsx
│   │   ├── Composer.tsx
│   │   └── Conversation.tsx
│   │
│   ├── agent/
│   │
│   │   ├── AgentCard.tsx
│   │   ├── AgentStatus.tsx
│   │
│   ├── terminal/
│   │
│   │   └── TerminalPanel.tsx
│   │
│   └── styles/
│
├── package.json
└── tsconfig.json

```

---

# Step 1 — Create Package

From root:

```bash
mkdir -p packages/ui

cd packages/ui

mkdir -p src/components
```

---

# Step 2 — Package Configuration

Create:

```json
packages/ui/package.json
```

```json
{
"name":"@devaios/ui",

"version":"0.1.0",

"type":"module",

"scripts":{

"build":"tsc",

"lint":"eslint src"

},

"dependencies":{

"react":"^19.0.0",

"lucide-react":"latest",

"@radix-ui/react-dialog":"latest",

"@radix-ui/react-tabs":"latest"

}

}
```

---

# Step 3 — Button Component

Create:

```text
src/components/Button.tsx
```

```tsx
import React from "react";

interface Props {

children:React.ReactNode;

onClick?:()=>void;

}

export function Button(
{
children,
onClick
}:Props
){

return (

<button
onClick={onClick}
className="
px-4
py-2
rounded-lg
bg-indigo-600
text-white
"
>

{children}

</button>

)

}
```

---

# Step 4 — Card Component

Create:

```text
src/components/Card.tsx
```

```tsx
import React from "react";

export function Card(
{
children
}:{
children:React.ReactNode
}
){

return (

<div
className="
rounded-xl
border
p-4
bg-gray-900
"
>

{children}

</div>

)

}
```

---

# Step 5 — Panel Component

Create:

```text
src/components/Panel.tsx
```

```tsx
import React from "react";

export function Panel(
{
children
}:{
children:React.ReactNode
}
){

return (

<section
className="
h-full
border-r
p-4
"
>

{children}

</section>

)

}
```

---

# Step 6 — Sidebar Component

Create:

```text
src/components/Sidebar.tsx
```

```tsx
const items=[

"Dashboard",

"Projects",

"Agents",

"Chat",

"Memory",

"Plugins",

"Settings"

];

export function Sidebar(){

return (

<nav>

{

items.map(
item=>

<div
key={item}
className="
p-3
cursor-pointer
"
>

{item}

</div>

)

}

</nav>

)

}
```

---

# Step 7 — Chat Message Component

Create:

```text
src/components/chat/Message.tsx
```

```tsx
interface Props {

role:
"user"
|
"assistant";

content:string;

}

export function Message(
{
role,
content
}:Props
){

return (

<div>

<strong>
{role}
</strong>

<p>
{content}
</p>

</div>

)

}
```

---

# Step 8 — Agent Status

Create:

```text
src/components/agent/AgentStatus.tsx
```

```tsx
export function AgentStatus(
{
status
}:{
status:string
}
){

return (

<span>

{status}

</span>

)

}
```

---

# Step 9 — Terminal Panel

Create:

```text
src/components/terminal/TerminalPanel.tsx
```

```tsx
export function TerminalPanel(){

return (

<div>

Terminal Ready...

</div>

)

}
```

---

# Step 10 — Export Components

Create:

```text
src/index.ts
```

```ts
export {

Button

}

from "./components/Button.js";

export {

Card

}

from "./components/Card.js";

export {

Panel

}

from "./components/Panel.js";

export {

Sidebar

}

from "./components/Sidebar.js";

export {

Message

}

from "./components/chat/Message.js";

export {

AgentStatus

}

from "./components/agent/AgentStatus.js";

export {

TerminalPanel

}

from "./components/terminal/TerminalPanel.js";
```

---

# Step 11 — Connect Desktop App

Update:

```json
apps/desktop/package.json
```

Add:

```json
{
"dependencies":{

"@devaios/ui":
"workspace:*"

}
}
```

---

# Example Usage

Desktop:

```tsx
import {

Sidebar,

Card,

Button

}

from "@devaios/ui";

export default function Dashboard(){

return (

<div>

<Sidebar/>

<Card>

<h1>
DEVAIOS
</h1>

<Button>

Start Agent

</Button>

</Card>

</div>

)

}
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
@devaios/ui ✓
```

---

# Step 13 — Commit

```bash
git add .

git commit -m "feat(ui): create DEVAIOS design system"
```

---

# Task 2 Completion Criteria

Before moving:

✅ UI package created  
✅ Design system foundation exists  
✅ Shared components available  
✅ Chat components created  
✅ Agent components created  
✅ Desktop can consume UI package  

---

# DEVAIOS Product Architecture Update

Now:

```text
                         DEVAIOS

                    Desktop Application

                            |

                      UI System

                            |

 -------------------------------------------------

 Dashboard

 Chat

 Agents

 Projects

 Terminal

 Settings

                            |

 -------------------------------------------------

 Core

 AI

 Tools

 Memory

 MCP

 Runtime

 Security

```

---

# New Capability

DEVAIOS now has a consistent product identity:

```text
Open DEVAIOS

↓

Beautiful developer workspace

↓

Create project

↓

Launch AI Agent

↓

Monitor execution

```

---
