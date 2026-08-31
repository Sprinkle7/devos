import path from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export type CognitiveModuleResult = {
  domain: string;
  milestone: number;
  state: Record<string, number>;
  metrics: Record<string, number>;
};

export type CognitiveSnapshot = {
  domains: string[];
  modules: CognitiveModuleResult[];
  topMetrics: Array<{ name: string; value: number; domain: string; milestone: number }>;
  summary: string;
};

export type AnalyzeInput = {
  message: string;
  workspaceSlug?: string;
};

const DOMAIN_REGISTRY: Record<string, { milestones: number[]; keywords: string[] }> = {
  language: {
    milestones: [146, 171, 172],
    keywords: ["code", "text", "language", "write", "explain", "function", "bug", "typescript", "error"],
  },
  attention: {
    milestones: [150, 169, 173],
    keywords: ["plan", "focus", "task", "priority", "schedule", "organize", "deadline", "roadmap"],
  },
  memory: {
    milestones: [151, 164, 170],
    keywords: ["remember", "recall", "history", "previous", "context", "learn", "memory", "past"],
  },
  creativity: {
    milestones: [163],
    keywords: ["brainstorm", "creative", "idea", "novel", "design", "innovate", "imagine"],
  },
  emotion: {
    milestones: [168, 175],
    keywords: ["tone", "feel", "social", "team", "collaborate", "empathy", "user"],
  },
  integration: {
    milestones: [350],
    keywords: [],
  },
};

function pickDomains(message: string): string[] {
  const lower = message.toLowerCase();
  const picked = new Set<string>(["integration"]);
  for (const [domain, cfg] of Object.entries(DOMAIN_REGISTRY)) {
    if (domain === "integration") continue;
    if (cfg.keywords.some((k) => lower.includes(k))) picked.add(domain);
  }
  if (picked.size <= 1) picked.add("language");
  return [...picked].slice(0, 6);
}

async function loadSystemModule(milestone: number): Promise<Record<string, unknown>> {
  const modulePath = path.join(PKG_ROOT, "..", `cognitive-system-m${milestone}`, "dist", "index.js");
  return import(pathToFileURL(modulePath).href);
}

function resolveSystemClass(module: Record<string, unknown>): new () => Record<string, unknown> {
  const candidates = Object.entries(module).filter(([name, value]) => {
    if (typeof value !== "function" || !/^[A-Z]/.test(name)) return false;
    const proto = (value as { prototype?: object }).prototype;
    if (!proto) return false;
    return Object.getOwnPropertyNames(proto).some((m) => m !== "constructor");
  });
  if (!candidates.length) throw new Error("No exported system class");
  const preferred =
    candidates.find(([name]) => /System$/.test(name)) ??
    candidates.find(([name]) => !name.endsWith("Metrics") && !name.endsWith("State")) ??
    candidates[0];
  return preferred![1] as new () => Record<string, unknown>;
}

function runOperation(system: Record<string, unknown>, index: number, seed: number): void {
  const proto = Object.getPrototypeOf(system);
  const methods = Object.getOwnPropertyNames(proto).filter(
    (name) => name !== "constructor" && typeof system[name] === "function",
  );
  const op =
    methods.find((name) =>
      /^(register|initiate|assess|form|execute|comprehend|produce|represent|analyze|integrate)/.test(name),
    ) ?? methods.find((name) => name === "registerItem");

  if (!op) {
    if (typeof system.updateMetrics === "function") (system.updateMetrics as () => void)();
    return;
  }

  const fn = system[op] as (...args: unknown[]) => void;
  const args = Array.from({ length: fn.length }, (_, argIndex) => {
    const v = (seed + index + argIndex * 0.13) % 1;
    if (argIndex === 0 && fn.length > 1) return `${op}_${index}`;
    if (argIndex === 0) return v;
    return v;
  });
  fn.apply(system, args);
}

function extractNumericFields(obj: Record<string, unknown>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "number" && value >= 0 && value <= 1) out[key] = value;
  }
  return out;
}

function extractModuleMetrics(system: Record<string, unknown>): { state: Record<string, number>; metrics: Record<string, number> } {
  const proto = Object.getPrototypeOf(system);
  const getters = Object.getOwnPropertyNames(proto).filter(
    (name) =>
      (/^get\w+(State|Metrics)$/.test(name) || name === "getState" || name === "getMetrics") &&
      typeof system[name] === "function",
  );

  let state: Record<string, number> = {};
  let metrics: Record<string, number> = {};

  for (const getter of getters) {
    try {
      const result = (system[getter] as () => Record<string, unknown>)();
      if (!result || typeof result !== "object") continue;
      const nums = extractNumericFields(result);
      if (/Metrics/.test(getter) || getter === "getMetrics") metrics = { ...metrics, ...nums };
      else state = { ...state, ...nums };
    } catch {
      /* skip */
    }
  }

  if (!Object.keys(metrics).length && Object.keys(state).length) metrics = { ...state };
  return { state, metrics };
}

async function runMilestone(domain: string, milestone: number, message: string): Promise<CognitiveModuleResult | null> {
  try {
    const mod = await loadSystemModule(milestone);
    const SystemClass = resolveSystemClass(mod);
    const system = new SystemClass();
    const seed = message.split("").reduce((a, c) => a + c.charCodeAt(0), 0) / 1000;
    for (let i = 0; i < 3; i++) runOperation(system, i, seed);
    const { state, metrics } = extractModuleMetrics(system);
    return { domain, milestone, state, metrics };
  } catch {
    return null;
  }
}

function buildTopMetrics(modules: CognitiveModuleResult[]) {
  const rows: Array<{ name: string; value: number; domain: string; milestone: number }> = [];
  for (const mod of modules) {
    const source = Object.keys(mod.metrics).length ? mod.metrics : mod.state;
    for (const [name, value] of Object.entries(source)) {
      rows.push({ name, value, domain: mod.domain, milestone: mod.milestone });
    }
  }
  return rows.sort((a, b) => b.value - a.value).slice(0, 8);
}

function buildSummary(domains: string[], modules: CognitiveModuleResult[]): string {
  const ms = [...new Set(modules.map((m) => `M${m.milestone}`))].join(", ");
  return `Active domains: ${domains.join(", ")} · modules: ${ms || "none"}`;
}

export async function analyzeCognitive(input: AnalyzeInput): Promise<CognitiveSnapshot> {
  const domains = pickDomains(input.message);
  const modules: CognitiveModuleResult[] = [];

  for (const domain of domains) {
    const cfg = DOMAIN_REGISTRY[domain];
    if (!cfg) continue;
    const milestones = cfg.milestones.slice(0, domain === "integration" ? 1 : 2);
    for (const milestone of milestones) {
      const result = await runMilestone(domain, milestone, input.message);
      if (result) modules.push(result);
    }
  }

  return {
    domains,
    modules,
    topMetrics: buildTopMetrics(modules),
    summary: buildSummary(domains, modules),
  };
}

export function formatCognitiveForContext(snapshot: CognitiveSnapshot, maxTokens = 512): string {
  const lines = [
    "Cognitive context (background metrics 0-1, not user-facing verbatim):",
    snapshot.summary,
  ];
  for (const m of snapshot.topMetrics.slice(0, 5)) {
    lines.push(`- ${m.domain}/M${m.milestone} ${m.name}: ${m.value.toFixed(2)}`);
  }
  const text = lines.join("\n");
  const approxTokens = Math.ceil(text.length / 4);
  if (approxTokens <= maxTokens) return text;
  return text.slice(0, maxTokens * 4);
}
