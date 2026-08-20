# Security Baseline

Status: Draft  
Applies to: local web hub + runtime + plugins + governance

## Goals

Protect secrets, prevent accidental destructive actions, and keep localhost deployments from becoming accidental LAN/public services.

## Baseline controls

### Network

- Bind `127.0.0.1` by default
- LAN/public bind requires explicit config + warning
- TLS optional for pure localhost; required if exposed beyond localhost

### Secrets

- Store API keys in OS keychain when available, else encrypted secrets file on durable volume
- Never write secrets into markdown memory by default
- Redact secrets in logs and context packs (CCE)

### Plugins / MCP

- Permission prompts for filesystem write, network, subprocess
- Disable-by-default for untrusted plugins
- Plugin crash isolation

### Actions

- Consequential action classes go through governance/policy hooks
- Destructive actions require confirmation (personal pack)
- Audit ledger for write/deploy/destructive/identity/financial

### Web UI

- Same-origin mutating requests
- No open CORS to arbitrary origins on local API
- Reveal-secret UX is intentional click, not hover dump

### Docker

- Non-root user where practical
- Secrets via env files / mounted secret files not baked into images
- Volumes listed in install docs; no silent ephemeral state

## Threat notes (solo hub)

| Threat | Mitigation |
|--------|------------|
| Malicious plugin | Permissions + review + disable |
| Prompt injection via repo docs | Treat tool args as untrusted; policy gates |
| Lexical secret leak to model | CCE redaction + secret scanner validator |
| Accidental expose on `0.0.0.0` | Default localhost + startup warning |

## Acceptance

- [ ] Default bind is localhost
- [ ] Secrets redacted in packs/logs
- [ ] Plugin permission model documented and enforced in design
- [ ] Destructive confirm path documented
