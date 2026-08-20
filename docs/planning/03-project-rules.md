---
source: chatgpt-share
source_turn: 14
title: "Project Rules"
status: extracted
---

I think this is the right way to do it.

Given everything we've discussed over the last few weeks, I don't want to build **"another AI app."** I want to help you build something that could realistically become an **open-source AI developer platform**. If it's designed well, it could eventually be useful to thousands of developers—not just you. memcite

## One thing I want to change first

I would **not** call it "AI Hub."

The architecture deserves something more general because over time you'll probably add:

- AI providers
- Project management
- MCP management
- Plugin marketplace
- Installers
- Docker orchestration
- Local models
- Cloud deployment
- Documentation
- Knowledge graph
- Automation
- DevOps
- Team collaboration

That is much closer to an **Operating System for Developers** than a dashboard.

---

# The Project Rules

Before writing any code, we establish non-negotiable principles.

## Rule 1

Everything must be modular.

Nothing should know about anything else.

```
BAD

Dashboard
   │
   ├── GitHub
   ├── AWS
   ├── Docker
   ├── AI
   └── Plugins
```

```
GOOD

Dashboard

↓

Core

↓

Plugin Manager

↓

Everything else
```

---

## Rule 2

Everything is a plugin.

Even built-in features.

Examples:

```
Git Plugin

Docker Plugin

AWS Plugin

Filesystem Plugin

Memory Plugin

Claude Plugin

Ollama Plugin

Headroom Plugin

Graphify Plugin
```

If one plugin crashes, the platform continues running.

---

## Rule 3

Docker First

No manual installations whenever possible.

```
docker compose up
```

should start almost everything.

---

## Rule 4

Offline First

If the internet disappears:

✅ Local models work

✅ Search works

✅ Knowledge works

✅ Documentation works

Only cloud providers stop working.

---

## Rule 5

Open Standards

Avoid proprietary integrations where a standard exists.

Use:

- MCP
- OpenAI-compatible APIs
- OAuth
- Docker
- Git
- Markdown

This makes the platform more future-proof.

---

# Phase 0 (Current Phase)

We won't write code.

We'll design.

This phase determines whether the next year of work is enjoyable or painful.

## Deliverables

We'll create a `/docs` folder containing:

```
docs/
│
├── 00-VISION.md
├── 01-GOALS.md
├── 02-PRINCIPLES.md
├── 03-TERMINOLOGY.md
├── 04-ROADMAP.md
└── 05-ARCHITECTURE.md
```

These become the foundation.

---

# Phase 1

Product Design

Questions we'll answer include:

- Who is this for?
- What problems does it solve?
- What should it never do?
- How do users interact with it?
- How does it compare to existing tools?

---

# Phase 2

Core Architecture

We'll define:

- Core service
- Plugin manager
- Event bus
- Configuration
- Installer
- Authentication
- API
- Permissions
- Storage

No implementation yet—just decisions.

---

# Phase 3

Plugin SDK

We'll define what every plugin must provide.

For example:

```ts
interface Plugin {
  id: string;
  name: string;
  version: string;

  install(): Promise<void>;

  start(): Promise<void>;

  stop(): Promise<void>;

  uninstall(): Promise<void>;
}
```

We'll also decide how plugins:
- declare dependencies,
- request permissions,
- expose commands,
- add UI,
- register AI tools.

---

# Phase 4

Installer

One-click installation should:

1. Detect the operating system.
2. Detect installed tools (Docker, Git, Node, Python, etc.).
3. Install missing prerequisites when possible.
4. Pull required containers.
5. Configure services.
6. Launch the platform.
7. Offer optional integrations (Cursor, Claude Code, Ollama, etc.).

---

# Phase 5

AI Layer

We'll design:

- Provider abstraction
- Routing policies
- Cost optimization
- Local model support
- Streaming
- Context assembly
- Memory retrieval
- Prompt compression

This is where OmniRoute-like functionality fits—but as one component, not the entire platform.

---

# Phase 6

Knowledge Layer

This will answer questions like:

- What is this project?
- Where is authentication implemented?
- Which deployment changed Redis?
- Why was this architectural decision made?

We'll combine:
- project indexing,
- vector search,
- graph relationships,
- Markdown documentation,
- long-term memory.

---

# Phase 7

Dashboard

Only after the backend is designed.

The dashboard becomes a view into the platform—not the platform itself.

---

# The Documentation Process

Rather than generating hundreds of Markdown files in one shot, we'll build them as if we're writing the docs for a real open-source project.

Each document will include:
- Purpose
- Goals
- Design decisions
- Alternatives considered
- Trade-offs
- Risks
- Future extensions
- Open questions

That way, future contributors (or future you) can understand *why* something exists, not just *how* it works.

# What I'll deliver

We'll go through the project one document at a time. For each, I'll produce a polished Markdown file that's ready to commit to your repository.

The sequence will be:

1. `00-VISION.md`
2. `01-GOALS.md`
3. `02-PRINCIPLES.md`
4. `03-ROADMAP.md`
5. `04-ARCHITECTURE.md`
6. `05-PLUGIN-SDK.md`
7. `06-INSTALLER.md`
8. `07-AI.md`
9. `08-MEMORY.md`
10. `09-DASHBOARD.md`

…and then continue through infrastructure, security, deployment, testing, plugins, agents, and the rest.

## One recommendation before we start

Create **two repositories**, not one:

```
devos/
├── devos                 # The actual source code
└── devos-docs            # Architecture and design documentation
```

Keep the documentation versioned independently from the code. This makes it easier to evolve the design, publish docs, and maintain a clean history of architectural decisions.

I suggest we start with `00-VISION.md`. That document will define the project's identity, scope, non-goals, long-term vision, and guiding philosophy. Every future technical decision will trace back to it, making it the most important document in the entire project.
