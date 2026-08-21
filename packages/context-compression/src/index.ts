import { randomUUID } from "node:crypto";
import type { ContextBundle, ContextChunk, ContextChunkStrategy } from "@devaios/shared-kernel";
import { nowIso } from "@devaios/shared-kernel";

export type PackInput = {
  budgetTokens: number;
  reserveTokens?: number;
  pins?: Array<{ source: string; content: string }>;
  items?: Array<{ source: string; content: string; prefer?: ContextChunkStrategy }>;
};

/** Rough token estimate: ~4 chars per token. */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.max(1, Math.ceil(text.length / 4));
}

function summarize(text: string, maxTokens: number): string {
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return text;
  const head = text.slice(0, Math.floor(maxChars * 0.7));
  const tail = text.slice(-Math.floor(maxChars * 0.25));
  return `${head}\n…\n${tail}`;
}

function excerpt(text: string, maxTokens: number): string {
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "\n…";
}

/**
 * Context Compression Engine v0 — pack sources under a token budget with a manifest.
 */
export function packContext(input: PackInput): ContextBundle {
  const reserveTokens = input.reserveTokens ?? Math.min(512, Math.floor(input.budgetTokens * 0.15));
  const usable = Math.max(0, input.budgetTokens - reserveTokens);
  const chunks: ContextChunk[] = [];
  const dropList: ContextBundle["dropList"] = [];
  let used = 0;

  const push = (
    source: string,
    _content: string,
    strategy: ContextChunkStrategy,
    originalTokens: number,
    packedContent: string,
  ) => {
    const packedTokens = estimateTokens(packedContent);
    if (used + packedTokens > usable && strategy !== "pin") {
      dropList.push({ source, reason: `over budget after ${strategy}` });
      chunks.push({
        id: randomUUID(),
        source,
        strategy,
        originalTokens,
        packedTokens: 0,
        content: "",
        dropped: true,
        dropReason: "budget_exceeded",
      });
      return;
    }
    used += packedTokens;
    chunks.push({
      id: randomUUID(),
      source,
      strategy,
      originalTokens,
      packedTokens,
      content: packedContent,
    });
  };

  for (const pin of input.pins ?? []) {
    const original = estimateTokens(pin.content);
    // Pins always kept; if over budget, still include (caller should raise budget).
    const content =
      used + original > usable ? summarize(pin.content, Math.max(64, usable - used || 64)) : pin.content;
    const packedTokens = estimateTokens(content);
    used += packedTokens;
    chunks.push({
      id: randomUUID(),
      source: pin.source,
      strategy: "pin",
      originalTokens: original,
      packedTokens,
      content,
    });
  }

  // Dedup by exact content hash-ish
  const seen = new Set<string>();
  for (const item of input.items ?? []) {
    const key = item.content.trim();
    const original = estimateTokens(item.content);
    if (seen.has(key)) {
      dropList.push({ source: item.source, reason: "duplicate" });
      chunks.push({
        id: randomUUID(),
        source: item.source,
        strategy: "dedup",
        originalTokens: original,
        packedTokens: 0,
        content: "",
        dropped: true,
        dropReason: "duplicate",
      });
      continue;
    }
    seen.add(key);

    const remaining = usable - used;
    if (remaining <= 0) {
      dropList.push({ source: item.source, reason: "no remaining budget" });
      chunks.push({
        id: randomUUID(),
        source: item.source,
        strategy: "trim",
        originalTokens: original,
        packedTokens: 0,
        content: "",
        dropped: true,
        dropReason: "budget_exceeded",
      });
      continue;
    }

    const prefer = item.prefer ?? (original > remaining ? "summarize" : "excerpt");
    let packed = item.content;
    let strategy: ContextChunkStrategy = "excerpt";
    if (prefer === "summarize" || original > remaining) {
      packed = summarize(item.content, remaining);
      strategy = "summarize";
    } else if (prefer === "trim") {
      packed = excerpt(item.content, remaining);
      strategy = "trim";
    } else {
      packed = excerpt(item.content, remaining);
      strategy = "excerpt";
    }
    push(item.source, item.content, strategy, original, packed);
  }

  return {
    id: randomUUID(),
    budgetTokens: input.budgetTokens,
    usedTokens: used,
    reserveTokens,
    chunks,
    dropList,
    createdAt: nowIso(),
  };
}
