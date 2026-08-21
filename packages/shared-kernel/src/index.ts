import { homedir } from "node:os";
import { join } from "node:path";

export type HealthStatus = {
  ok: boolean;
  service: string;
  version: string;
  time: string;
};

export function getDevaiosHome(override?: string): string {
  if (override && override.trim()) {
    return override.replace(/^~(?=$|\/|\\)/, homedir());
  }
  return join(homedir(), ".devaios");
}

export function nowIso(): string {
  return new Date().toISOString();
}

export type Workspace = {
  id: string;
  slug: string;
  name: string;
  rootPath: string | null;
  createdAt: string;
  updatedAt: string;
};

export type McpServerRegistration = {
  id: string;
  name: string;
  command: string;
  args: string[];
  enabled: boolean;
  createdAt: string;
};

export type ContextChunkStrategy = "pin" | "excerpt" | "summarize" | "dedup" | "trim";

export type ContextChunk = {
  id: string;
  source: string;
  strategy: ContextChunkStrategy;
  originalTokens: number;
  packedTokens: number;
  content: string;
  dropped?: boolean;
  dropReason?: string;
};

export type ContextBundle = {
  id: string;
  budgetTokens: number;
  usedTokens: number;
  reserveTokens: number;
  chunks: ContextChunk[];
  dropList: Array<{ source: string; reason: string }>;
  createdAt: string;
};

export type MemoryKind = "note" | "decision" | "fact" | "architecture";

export type Memory = {
  id: string;
  workspaceId: string;
  kind: MemoryKind;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type McpToolInfo = {
  name: string;
  description?: string;
  inputSchema?: unknown;
};
