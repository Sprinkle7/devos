# Feature Matrix (Documentation)

Status: Draft  
Maps capabilities to doc homes and triage. Implementation comes after docs gate.

| Feature | Docs | Triage | Notes |
|---------|------|--------|-------|
| Local web hub | `LOCAL-WEB.md` | Required | Primary UI; `pnpm dev` |
| Workspace/projects | `05-WORKSPACE.md`, FDS-001 | Required | Postgres-backed |
| Guided install + Docker volumes | `INSTALL-AND-DOCKER.md` | Required | pnpm default; Compose for Postgres |
| Context compression (first-party) | `CONTEXT-COMPRESSION.md` | Required | Replaces Headroom/Ponytail dependency |
| MCP host | `PLUGIN-INTEGRATIONS.md`, Sprint 2 Task 7 | Required | MCP-first (D-06) |
| Graphify integration | `PLUGIN-INTEGRATIONS.md` | Required | Prefer MCP server |
| Claude Desktop bridge | `PLUGIN-INTEGRATIONS.md` | Required | |
| Cursor bridge | `PLUGIN-INTEGRATIONS.md` | Required | |
| Provider routing / Ollama | `PRODUCT-REQUIREMENTS.md` | Required/Should | |
| Backup/restore | Sprint 1 Task 30 | Required | |
| Plugin host + permissions | Sprint 3 marketplace themes | Required (local load) | Marketplace later |
| Governance / HITL / policy | Sprint 41 Tasks 5–8 | Later (impl), Required (docs) | |
| Digital twin | Sprint 41 Task 4 | Later | |
| Multi-agent enterprise | Sprint 41 Tasks 1–3 | Later | |
| Cloud control plane | Sprint 4 | Later | |
| Billing/CRM | Sprint 40 | Later | |
| AGI/civilization layers | Sprints 9–37 | Speculative | Keep docs, defer impl |
| OmniRoute | Plugin docs | Could | Optional |
| Headroom/Ponytail | Plugin docs | Optional adapters | Not required |
| Native desktop shell | — | Later | After local web |
