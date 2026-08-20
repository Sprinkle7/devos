---
source: chatgpt-share
source_turn: 196
sprint: 4
task: 2
title: "DEVAIOS Multi-Tenant Organization & Team System"
status: extracted
---

# Sprint 4 — Task 2: DEVAIOS Multi-Tenant Organization & Team System

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Build the **enterprise collaboration layer** of DEVAIOS.

DEVAIOS is no longer only a personal AI workspace.

Now it must support:

- Companies
- Teams
- Departments
- Multiple users
- Shared projects
- Permission control
- Enterprise governance

---

# Product Vision

Before:

```text id="single_user"

User

↓

DEVAIOS

↓

Personal Workspace

```

---

After:

```text id="multi_tenant"

                    DEVAIOS CLOUD

                         |

                  Organization

                         |

 ------------------------------------------------

 Owners

 Admins

 Developers

 Designers

 Analysts

 AI Agents

                         |

 ------------------------------------------------

 Projects

 Agents

 Plugins

 Secrets

 Deployments

```

---

# Core Concepts

## Organization

A company or workspace.

Example:

```text id="organization"

Acme AI Labs

Members:

50

Projects:

120

Agents:

30

```

---

## Team

A group inside organization.

Example:

```text id="team"

Acme AI Labs

Teams:

Backend Team

Security Team

Marketing Team

AI Research Team

```

---

## Workspace

A shared environment.

Contains:

```text id="workspace"

Projects

Agents

Files

Secrets

Integrations

Settings

```

---

# Role Based Access Control (RBAC)

Users receive roles.

Example:

```text id="roles"

Owner

↓

Full access

Admin

↓

Manage organization

Developer

↓

Create and modify projects

Viewer

↓

Read only

Agent

↓

Automated permissions

```

---

# Permission Model

Example:

```json id="rbac"
{

"role":"developer",

"permissions":[

"project.read",

"project.write",

"agent.execute",

"deployment.create"

]

}
```

---

# Architecture

```text id="tenant_arch"

                    DEVAIOS CLOUD

                           |

                  Tenant Management

                           |

 ------------------------------------------------

 Organization Service

 Team Service

 Member Service

 Role Service

 Permission Engine

 Invitation Service

                           |

 ------------------------------------------------

 Database

 Events

 Security

 Audit Logs

```

---

# New Package

Name:

```text id="package"

@devaios/organizations

```

Location:

```text id="location"

packages/organizations/

```

---

# Responsibilities

Version 0.1:

✅ Organizations  
✅ Teams  
✅ Members  
✅ Roles  
✅ Permissions  
✅ Invitations  
✅ Workspace isolation  

---

# Final Structure

```text id="tree"

packages/organizations/

├── src/
│
│   ├── index.ts
│
│   ├── organization.ts
│
│   ├── team.ts
│
│   ├── member.ts
│
│   ├── roles.ts
│
│   ├── permissions.ts
│
│   ├── invitations.ts
│
│   ├── workspace.ts
│
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

```bash id="create_org"

mkdir -p packages/organizations

cd packages/organizations

mkdir src tests

```

---

# Step 2 — Package Configuration

Create:

```json id="org_package"

packages/organizations/package.json

```

```json id="package_json"
{
"name":"@devaios/organizations",

"version":"0.1.0",

"type":"module",

"scripts":{

"build":"tsc",

"test":"vitest"

},

"dependencies":{

"@devaios/security":
"workspace:*",

"@devaios/events":
"workspace:*"

}

}
```

---

# Step 3 — Organization Types

Create:

```ts id="types"

src/types.ts

```

```ts id="types_code"
export type Role =

"owner"

|

"admin"

|

"developer"

|

"viewer";

export interface Organization {

id:string;

name:string;

ownerId:string;

}

export interface Team {

id:string;

name:string;

organizationId:string;

}

export interface Member {

id:string;

userId:string;

organizationId:string;

role:Role;

}

```

---

# Step 4 — Organization Manager

Create:

```text id="organization"

src/organization.ts

```

```ts id="organization_code"
export class OrganizationManager {

private organizations:any[]=[];

create(
organization:any
){

this.organizations.push(
organization
);

return organization;

}

find(
id:string
){

return this.organizations.find(

o=>o.id===id

);

}

list(){

return this.organizations;

}

}
```

---

# Step 5 — Team Manager

Create:

```text id="team"

src/team.ts

```

```ts id="team_code"
export class TeamManager {

private teams:any[]=[];

create(
team:any
){

this.teams.push(
team
);

return team;

}

list(){

return this.teams;

}

}
```

---

# Step 6 — Member Management

Create:

```text id="member"

src/member.ts

```

```ts id="member_code"
export class MemberManager {

private members:any[]=[];

add(
member:any
){

this.members.push(
member
);

}

remove(
id:string
){

this.members =
this.members.filter(

m=>m.id!==id

);

}

list(){

return this.members;

}

}
```

---

# Step 7 — Role System

Create:

```text id="roles"

src/roles.ts

```

```ts id="roles_code"
export class RoleManager {

private roles:any={

owner:[

"*"

],

admin:[

"users.manage",

"projects.manage"

],

developer:[

"projects.write",

"agents.execute"

],

viewer:[

"projects.read"

]

};

permissions(
role:string
){

return this.roles[role] || [];

}

}
```

---

# Step 8 — Permission Engine

Create:

```text id="permissions"

src/permissions.ts

```

```ts id="permission_code"
export class OrganizationPermission {

check(
role:string,

permission:string

){

const permissions =

new RoleManager()
.permissions(role);

return (

permissions.includes("*")

||

permissions.includes(permission)

);

}

}
```

---

# Step 9 — Invitation System

Create:

```text id="invitations"

src/invitations.ts

```

```ts id="invite_code"
export class InvitationManager {

private invitations:any[]=[];

invite(
email:string,

organization:string

){

const invitation={

email,

organization,

status:"pending"

};

this.invitations.push(
invitation
);

return invitation;

}

list(){

return this.invitations;

}

}
```

---

# Step 10 — Workspace Isolation

Create:

```text id="workspace"

src/workspace.ts

```

```ts id="workspace_code"
export class WorkspaceManager {

create(
organizationId:string
){

return {

organizationId,

projects:[],

agents:[],

settings:{}

};

}

}
```

---

# Step 11 — Export

Create:

```text id="index"

src/index.ts

```

```ts id="export_code"
export {
OrganizationManager
}
from "./organization.js";

export {
TeamManager
}
from "./team.js";

export {
MemberManager
}
from "./member.js";

export {
RoleManager
}
from "./roles.js";

export {
OrganizationPermission
}
from "./permissions.js";

export {
InvitationManager
}
from "./invitations.js";

export {
WorkspaceManager
}
from "./workspace.js";
```

---

# Step 12 — Database Models

Add:

```text id="migrations"

apps/cloud-api/migrations/

006_organizations.sql

007_teams.sql

008_members.sql

009_roles.sql

010_invitations.sql

```

---

## Example

```sql id="org_sql"

CREATE TABLE organizations (

id UUID PRIMARY KEY,

name TEXT NOT NULL,

owner_id UUID,

created_at TIMESTAMP DEFAULT NOW()

);

```

---

# Step 13 — Organization Dashboard UI

Add:

```text id="org_ui"

packages/ui/src/organization/

```

Structure:

```text id="ui_tree"

organization/

├── OrganizationSettings.tsx

├── Members.tsx

├── Teams.tsx

├── Roles.tsx

├── Invitations.tsx

└── Permissions.tsx

```

---

# Dashboard Example

```text id="dashboard"

+--------------------------------+

Acme AI Labs

Members:

42

Teams:

8

Roles:

Owner        1

Admins       4

Developers   30

Viewers      7

[Invite Member]

+--------------------------------+

```

---

# Step 14 — Event Integration

Events:

```text id="events"

organization.created

member.invited

member.joined

role.changed

permission.denied

team.created

```

---

# Step 15 — Security Integration

Every resource:

```text id="security_flow"

Request

↓

Organization Check

↓

Role Check

↓

Permission Check

↓

Execute

↓

Audit Log

```

---

# Step 16 — Build

Run:

```bash id="build"

pnpm install

pnpm build

```

Expected:

```text id="success"

@devaios/organizations ✓

```

---

# Step 17 — Commit

```bash id="commit"

git add .

git commit -m "feat(orgs): add multi tenant organization system"

```

---

# Task 2 Completion Criteria

Before moving:

✅ Organizations exist  
✅ Teams exist  
✅ Members exist  
✅ RBAC exists  
✅ Invitations exist  
✅ Workspace isolation exists  
✅ Security integration exists  

---

# DEVAIOS Architecture Update

DEVAIOS now supports companies:

```text id="enterprise"

                         DEVAIOS CLOUD

                              |

                        Organizations

                              |

 -------------------------------------------------

 Company A

 ├── Team 1

 ├── Team 2

 ├── Projects

 ├── Agents

 └── Deployments

 Company B

 ├── Team 1

 ├── Projects

 └── Agents

```

---

# New Capability

A company can now operate DEVAIOS:

```text id="company_flow"

CEO creates organization

↓

Invites developers

↓

Creates teams

↓

Assigns permissions

↓

Teams build with AI agents

↓

All activity audited

```

---
