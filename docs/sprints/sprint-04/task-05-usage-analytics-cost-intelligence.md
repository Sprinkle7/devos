---
source: chatgpt-share
source_turn: 202
sprint: 4
task: 5
title: "DEVAIOS Usage Analytics & Cost Intelligence"
status: extracted
---

# Sprint 4 — Task 5: DEVAIOS Usage Analytics & Cost Intelligence

> Extracted from ChatGPT conversation. Review and refine before implementation.

## Objective

Build the **observability and financial intelligence layer** of DEVAIOS.

As DEVAIOS grows into an AI operating platform, organizations need visibility into:

- How AI is being used
- Which agents consume resources
- Where money is spent
- Which models are expensive
- How teams optimize usage

---

# Product Vision

Before:

```text id="blind_usage"

User

↓

Runs AI Agents

↓

No visibility

↓

Unexpected costs

```

---

After:

```text id="cost_intelligence"

                     DEVAIOS

                         |

              Analytics Intelligence

                         |

 ------------------------------------------------

 Token Tracking

 Cost Engine

 Usage Metrics

 Reports

 Budgets

 Optimization AI

                         |

 ------------------------------------------------

 Users

 Teams

 Organizations

 Agents

 Projects

```

---

# Analytics Capabilities

## 1. Token Tracking

Track:

```text id="tokens"

Input Tokens

Output Tokens

Total Tokens

Model Used

Request Time

```

Example:

```json id="token_event"
{
"agent":"developer-agent",

"model":"GPT",

"inputTokens":1200,

"outputTokens":3400,

"totalTokens":4600
}
```

---

# 2. AI Cost Calculation

Calculate:

```text id="cost"

Model Price

×

Tokens Used

=

Total Cost

```

Example:

```text id="example_cost"

Developer Agent

GPT Model

45,000 tokens

Cost:

$0.35

```

---

# 3. Agent Analytics

Track:

```text id="agent_metrics"

Agent Runs

Success Rate

Failure Rate

Execution Time

Average Cost

```

---

# 4. Team Analytics

Example:

```text id="team_usage"

Backend Team

Agents:

12

Requests:

20,450

Cost:

$320

```

---

# 5. Budget Control

Allow:

```text id="budget"

Monthly Budget:

$500

Warning:

80%

Limit:

100%

```

---

# 6. Optimization Recommendations

DEVAIOS suggests:

Example:

```text id="recommendation"

Your Developer Agent used GPT-5

Switching 40% of tasks to smaller model

Estimated saving:

$120/month

```

---

# Architecture

```text id="analytics_arch"

                     DEVAIOS

                         |

                 Analytics Platform

                         |

 ------------------------------------------------

 Event Collector

 Usage Processor

 Cost Calculator

 Metrics Store

 Report Generator

 Budget Manager

                         |

 ------------------------------------------------

 Events

 Database

 Dashboard

```

---

# Technology Stack

Backend:

```text id="stack"

Node.js

PostgreSQL

Redis

TimescaleDB (future)

Charts Library

```

---

# New Package

Name:

```text id="package"

@devaios/analytics

```

Location:

```text id="location"

packages/analytics/

```

---

# Responsibilities

Version 0.1:

✅ Event collection  
✅ Usage tracking  
✅ Token accounting  
✅ Cost calculation  
✅ Metrics storage  
✅ Budget monitoring  

---

# Final Structure

```text id="tree"

packages/analytics/

├── src/
│
│   ├── index.ts
│
│   ├── collector.ts
│
│   ├── tracker.ts
│
│   ├── calculator.ts
│
│   ├── metrics.ts
│
│   ├── reports.ts
│
│   ├── budgets.ts
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

```bash id="create"

mkdir -p packages/analytics

cd packages/analytics

mkdir src tests

```

---

# Step 2 — Package Configuration

Create:

```json id="package"

packages/analytics/package.json

```

```json id="analytics_package"
{
"name":"@devaios/analytics",

"version":"0.1.0",

"type":"module",

"scripts":{

"build":"tsc",

"test":"vitest"

},

"dependencies":{

"@devaios/events":
"workspace:*"

}

}
```

---

# Step 3 — Analytics Types

Create:

```text id="types"

src/types.ts

```

```ts id="types_code"
export interface UsageRecord {

id:string;

user:string;

agent:string;

model:string;

inputTokens:number;

outputTokens:number;

cost:number;

createdAt:Date;

}

export interface Metric {

name:string;

value:number;

time:Date;

}

```

---

# Step 4 — Usage Collector

Create:

```text id="collector"

src/collector.ts

```

```ts id="collector_code"
export class UsageCollector {

private records:any[]=[];

collect(
record:any
){

this.records.push(record);

}

list(){

return this.records;

}

}
```

---

# Step 5 — Token Tracker

Create:

```text id="tracker"

src/tracker.ts

```

```ts id="tracker_code"
export class TokenTracker {

calculate(
input:number,

output:number

){

return {

total:

input + output

};

}

}
```

---

# Step 6 — Cost Calculator

Create:

```text id="calculator"

src/calculator.ts

```

```ts id="calculator_code"
export class CostCalculator {

private prices:any={

gpt:0.01,

claude:0.008,

local:0

};

calculate(
model:string,

tokens:number

){

return (

tokens / 1000

)

*

this.prices[model];

}

}
```

---

# Step 7 — Metrics Engine

Create:

```text id="metrics"

src/metrics.ts

```

```ts id="metrics_code"
export class MetricsEngine {

private metrics:any[]=[];

record(
metric:any
){

this.metrics.push(metric);

}

list(){

return this.metrics;

}

}
```

---

# Step 8 — Report Generator

Create:

```text id="reports"

src/reports.ts

```

```ts id="reports_code"
export class ReportGenerator {

generate(
records:any[]
){

return {

totalRequests:
records.length,

totalCost:
records.reduce(

(a,b)=>a+b.cost,

0

)

};

}

}
```

---

# Step 9 — Budget Manager

Create:

```text id="budgets"

src/budgets.ts

```

```ts id="budget_code"
export class BudgetManager {

private budgets:any={};

set(
organization:string,

amount:number

){

this.budgets[organization]=amount;

}

check(
organization:string,

usage:number

){

return {

remaining:

this.budgets[organization]-usage

};

}

}
```

---

# Step 10 — Export

Create:

```text id="index"

src/index.ts

```

```ts id="export_code"
export {
UsageCollector
}
from "./collector.js";

export {
TokenTracker
}
from "./tracker.js";

export {
CostCalculator
}
from "./calculator.js";

export {
MetricsEngine
}
from "./metrics.js";

export {
ReportGenerator
}
from "./reports.js";

export {
BudgetManager
}
from "./budgets.js";
```

---

# Step 11 — Database Models

Add:

```text id="migration"

apps/cloud-api/migrations/

014_usage_records.sql

015_cost_reports.sql

016_budgets.sql

```

---

Example:

```sql id="usage_sql"

CREATE TABLE usage_records (

id UUID PRIMARY KEY,

organization_id UUID,

model TEXT,

tokens INTEGER,

cost DECIMAL,

created_at TIMESTAMP DEFAULT NOW()

);

```

---

# Step 12 — Analytics Dashboard UI

Add:

```text id="analytics_ui"

packages/ui/src/analytics/

```

Structure:

```text id="analytics_tree"

analytics/

├── UsageOverview.tsx

├── CostChart.tsx

├── AgentMetrics.tsx

├── TeamUsage.tsx

├── BudgetStatus.tsx

└── Recommendations.tsx

```

---

# Dashboard Example

```text id="dashboard"

+--------------------------------+

DEVAIOS Analytics

This Month

AI Requests:

245,320

Tokens:

12.5M

Cost:

$420

Top Agent:

Developer Agent

Cost:

$120

Budget:

84% used

+--------------------------------+

```

---

# Step 13 — Event Integration

Listen to:

```text id="events"

ai.request.completed

agent.completed

deployment.completed

plugin.executed

```

---

Flow:

```text id="analytics_flow"

AI Request

↓

Event Bus

↓

Analytics Collector

↓

Token Tracker

↓

Cost Calculator

↓

Database

↓

Dashboard

```

---

# Step 14 — Cloud Integration

Add API endpoints:

```text id="api"

GET /analytics/usage

GET /analytics/cost

GET /analytics/agents

GET /analytics/team

GET /analytics/budget

```

---

# Step 15 — Build

Run:

```bash id="build"

pnpm install

pnpm build

```

Expected:

```text id="success"

@devaios/analytics ✓

```

---

# Step 16 — Commit

```bash id="commit"

git add .

git commit -m "feat(analytics): add usage analytics and cost intelligence"

```

---

# Task 5 Completion Criteria

Before moving:

✅ Token tracking exists  
✅ Cost calculation exists  
✅ Usage metrics exist  
✅ Reports exist  
✅ Budget management exists  
✅ Analytics dashboard exists  

---

# DEVAIOS Architecture Update

DEVAIOS now has business intelligence:

```text id="final"

                         DEVAIOS CLOUD

 ------------------------------------------------

 Users

 Organizations

 Agents

 Plugins

 Projects

 ------------------------------------------------

 Analytics Intelligence

 ------------------------------------------------

 Usage

 Cost

 Performance

 Budgets

 Optimization

```

---

# New Capability

A company can now answer:

```text id="questions"

Which agent costs the most?

Which team uses the most AI?

How much will next month cost?

Which model should we use?

Where can we save money?

```

---
