import { packContext } from "@devaios/context-compression";
import type { McpHost } from "@devaios/mcp-host";
import type { McpToolInfo } from "@devaios/shared-kernel";
import {
  catalogToProviderTools,
  newToolCallId,
  resolveNativeToolCall,
  type ProviderRegistry,
  type ToolTranscriptTurn,
} from "@devaios/providers";
import type { SecretsStore } from "@devaios/secrets";

export type ToolCallSpec = {
  server: string;
  tool: string;
  arguments?: Record<string, unknown>;
};

export type PriorMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AgentRunInput = {
  workspaceName: string;
  workspaceSlug: string;
  message: string;
  priorMessages?: PriorMessage[];
  memories: Array<{ kind: string; title: string; content: string }>;
  budgetTokens: number;
  useTools: boolean;
  maxToolRounds: number;
  approveDestructive?: boolean;
  model?: string;
  mcpHost: McpHost;
  providers: ProviderRegistry;
  secrets: SecretsStore;
  isToolPreApproved?: (server: string, tool: string) => Promise<boolean>;
  onGovernanceBlocked?: (
    spec: ToolCallSpec,
    reason?: string,
  ) => Promise<{ approvalId: string } | null>;
};

export type AgentToolTrace = {
  round: number;
  server: string;
  tool: string;
  ok: boolean;
  blocked?: boolean;
  requiresApproval?: boolean;
  approvalId?: string;
  pendingApproval?: boolean;
  result: unknown;
};

export type AgentRunResult = {
  reply: string;
  provider: string;
  model?: string;
  offline?: boolean;
  toolMode?: "native" | "fenced" | "offline";
  toolTrace: AgentToolTrace[];
  pendingApprovals: string[];
  pinnedMemories: number;
  bundleId: string;
  usedTokens: number;
  selectedTools: number;
  nativeRounds: number;
};

type CatalogEntry = {
  server: string;
  tool: McpToolInfo;
  score: number;
};

function scoreTool(message: string, tool: McpToolInfo): number {
  const tokens = message
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length >= 3);
  const hay = `${tool.name} ${tool.description ?? ""}`.toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (hay.includes(token)) score += token.length;
  }
  if (/\bping\b/i.test(message) && tool.name === "ping") score += 20;
  if (/\becho\b/i.test(message) && tool.name === "echo") score += 20;
  if (/\bgraph\b/i.test(message) && /graph/i.test(tool.name)) score += 15;
  return score;
}

async function buildToolCatalog(
  message: string,
  mcpHost: McpHost,
  maxTools = 12,
): Promise<{ catalog: CatalogEntry[]; text: string }> {
  const servers = (await mcpHost.list()).filter((s) => s.enabled).slice(0, 8);
  const catalog: CatalogEntry[] = [];

  for (const s of servers) {
    const listed = await mcpHost.listTools(s.id);
    if (!listed.ok) continue;
    for (const tool of listed.tools) {
      catalog.push({
        server: s.name,
        tool,
        score: scoreTool(message, tool),
      });
    }
  }

  catalog.sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name));
  const selected = catalog.slice(0, maxTools);

  if (!selected.length) {
    return { catalog: [], text: "" };
  }

  const lines = selected.map(
    (e) =>
      `- server=${e.server} tool=${e.tool.name} score=${e.score} — ${e.tool.description ?? ""}`.trim(),
  );

  const text = [
    "Relevant MCP tools. Providers may call them natively; offline mode uses fenced blocks:",
    "```tool",
    '{"server":"SERVER_NAME","tool":"TOOL_NAME","arguments":{}}',
    "```",
    ...lines,
  ].join("\n");

  return { catalog: selected, text };
}

function extractToolCalls(text: string, allowed: CatalogEntry[]): ToolCallSpec[] {
  const calls: ToolCallSpec[] = [];
  const fence = /```tool\s*([\s\S]*?)```/gi;
  let m: RegExpExecArray | null;
  while ((m = fence.exec(text))) {
    try {
      const parsed = JSON.parse(m[1].trim()) as ToolCallSpec;
      if (parsed.server && parsed.tool) calls.push(parsed);
    } catch {
      /* ignore */
    }
  }

  if (calls.length) return calls;

  const lower = text.toLowerCase();
  if (/\bping\b/.test(lower)) {
    const hit = allowed.find((e) => e.tool.name === "ping");
    if (hit) calls.push({ server: hit.server, tool: "ping", arguments: {} });
  }
  if (!calls.length && /\becho\b/.test(lower)) {
    const hit = allowed.find((e) => e.tool.name === "echo");
    if (hit) {
      const msg = text.match(/echo\s+(.+)$/i)?.[1]?.trim() || "hello";
      calls.push({ server: hit.server, tool: "echo", arguments: { message: msg } });
    }
  }
  return calls;
}

async function executeToolCalls(
  calls: ToolCallSpec[],
  round: number,
  catalog: CatalogEntry[],
  input: AgentRunInput,
): Promise<{ trace: AgentToolTrace[]; pendingApprovals: string[] }> {
  const trace: AgentToolTrace[] = [];
  const pendingApprovals: string[] = [];

  for (const call of calls.slice(0, 3)) {
    const entry = catalog.find((e) => e.server === call.server && e.tool.name === call.tool);
    const preApproved =
      input.approveDestructive ||
      (await input.isToolPreApproved?.(call.server, call.tool)) ||
      false;
    const result = await input.mcpHost.callTool(call.server, call.tool, call.arguments ?? {}, {
      approveDestructive: preApproved,
      toolDescription: entry?.tool.description,
    });

    let approvalId: string | undefined;
    if (result.blocked && input.onGovernanceBlocked) {
      const queued = await input.onGovernanceBlocked(call, result.governance?.reason);
      approvalId = queued?.approvalId;
      if (approvalId) pendingApprovals.push(approvalId);
    }

    trace.push({
      round,
      server: call.server,
      tool: call.tool,
      ok: result.ok,
      blocked: result.blocked,
      requiresApproval: result.requiresApproval,
      approvalId,
      pendingApproval: Boolean(result.blocked && approvalId),
      result: result.blocked
        ? { error: result.error, governance: result.governance, approvalId }
        : (result.content ?? result.error),
    });
  }

  return { trace, pendingApprovals };
}

function formatToolResult(result: unknown): string {
  if (typeof result === "string") return result;
  try {
    return JSON.stringify(result);
  } catch {
    return String(result);
  }
}

export async function runAgent(input: AgentRunInput): Promise<AgentRunResult> {
  const pins = input.memories.slice(0, 20).map((m) => ({
    source: `memory:${m.kind}:${m.title}`,
    content: `${m.title}\n${m.content}`,
  }));
  pins.unshift({
    source: "policy",
    content:
      "Never exfiltrate secrets. Destructive MCP tools require explicit approval. Be concise.",
  });

  let toolCatalogText = "";
  let catalog: CatalogEntry[] = [];
  if (input.useTools) {
    const built = await buildToolCatalog(input.message, input.mcpHost);
    catalog = built.catalog;
    toolCatalogText = built.text;
    if (toolCatalogText) {
      pins.push({ source: "tools", content: toolCatalogText });
    }
  }

  const providerTools = catalogToProviderTools(
    catalog.map((e) => ({ server: e.server, tool: e.tool })),
  );

  const anthropicKey = await input.secrets.get("ANTHROPIC_API_KEY");
  const openaiKey = await input.secrets.get("OPENAI_API_KEY");

  const toolTrace: AgentToolTrace[] = [];
  const pendingApprovals: string[] = [];
  let userMessage = input.message;
  let finalReply = "";
  let provider = "offline-stub";
  let model: string | undefined;
  let offline = true;
  let toolMode: AgentRunResult["toolMode"] = "offline";
  let bundleId = "";
  let usedTokens = 0;
  let nativeRounds = 0;

  const historyItems =
    input.priorMessages?.slice(-8).map((m, i) => ({
      source: `history-${i}-${m.role}`,
      content: m.content,
      prefer: "summarize" as const,
    })) ?? [];

  const systemPrompt = [
    `You are DEVAIOS workspace assistant for "${input.workspaceName}" (${input.workspaceSlug}).`,
    "Use pinned memory, conversation history, and tool results.",
    input.useTools
      ? "Call MCP tools when needed. Destructive tools require human approval."
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  let nativeTranscript: ToolTranscriptTurn[] | null = null;

  for (let round = 0; round <= input.maxToolRounds; round++) {
    const bundle = packContext({
      budgetTokens: input.budgetTokens,
      pins,
      items: [
        ...historyItems,
        { source: "user", content: userMessage, prefer: "excerpt" },
        ...toolTrace.map((t, i) => ({
          source: `tool-result-${i}`,
          content: JSON.stringify(t),
          prefer: "summarize" as const,
        })),
      ],
    });
    bundleId = bundle.id;
    usedTokens = bundle.usedTokens;
    const packedText = bundle.chunks
      .filter((ch) => !ch.dropped && ch.content)
      .map((ch) => `[${ch.strategy}:${ch.source}]\n${ch.content}`)
      .join("\n\n");

    const userPrompt = `${packedText}\n\n---\nUser question:\n${input.message}`;
    let calls: ToolCallSpec[] = [];

    if (input.useTools && providerTools.length) {
      if (!nativeTranscript) {
        nativeTranscript = [{ role: "user", content: userPrompt }];
      }

      const allowToolExecution = round < input.maxToolRounds;
      const native = await input.providers.chatWithTools({
        system: systemPrompt,
        transcript: nativeTranscript,
        model: input.model,
        tools: providerTools,
        anthropicApiKey: anthropicKey ?? undefined,
        openaiApiKey: openaiKey ?? undefined,
      });

      if (native.toolCalls?.length && allowToolExecution) {
        nativeRounds += 1;
        toolMode = "native";
        provider = native.provider;
        model = native.model;
        offline = false;
        finalReply = native.reply;

        const nativeCalls = native.toolCalls.map((tc) => ({
          ...tc,
          id: tc.id ?? newToolCallId(),
        }));

        calls = nativeCalls
          .map((tc) => resolveNativeToolCall(tc, providerTools))
          .filter((c): c is NonNullable<typeof c> => c !== null)
          .map((c) => ({ server: c.server, tool: c.tool, arguments: c.arguments }));

        const executed = await executeToolCalls(calls, round, catalog, input);
        toolTrace.push(...executed.trace);
        pendingApprovals.push(...executed.pendingApprovals);

        nativeTranscript.push({
          role: "assistant",
          content: native.reply,
          toolCalls: nativeCalls,
        });

        for (let i = 0; i < nativeCalls.length; i++) {
          const tc = nativeCalls[i]!;
          const trace = executed.trace[i];
          nativeTranscript.push({
            role: "tool",
            toolCallId: tc.id,
            toolName: tc.nativeId,
            content: formatToolResult(trace?.result),
          });
        }

        if (round === input.maxToolRounds) break;
        continue;
      }

      if (native.ok && native.reply) {
        finalReply = native.reply;
        provider = native.provider;
        model = native.model;
        offline = false;
        toolMode = "native";
        nativeRounds += 1;
        break;
      }
    }

    if (!calls.length) {
      const chat = await input.providers.chat({
        system: systemPrompt,
        user: userPrompt,
        model: input.model,
        anthropicApiKey: anthropicKey ?? undefined,
        openaiApiKey: openaiKey ?? undefined,
      });
      finalReply = chat.reply;
      provider = chat.provider;
      model = chat.model;
      offline = chat.offline ?? false;
      if (offline) toolMode = "offline";

      if (!input.useTools || round === input.maxToolRounds) break;

      const callSource =
        chat.offline && round === 0 ? input.message : chat.offline ? "" : chat.reply;
      calls = extractToolCalls(callSource, catalog);
      if (calls.length) toolMode = "fenced";
      if (!calls.length) break;

      const executed = await executeToolCalls(calls, round, catalog, input);
      toolTrace.push(...executed.trace);
      pendingApprovals.push(...executed.pendingApprovals);
      userMessage = `${input.message}\n\nTool results:\n${JSON.stringify(toolTrace, null, 2)}\n\nContinue with a final answer. Do not call more tools unless necessary.`;
    }
  }

  return {
    reply: finalReply,
    provider,
    model,
    offline,
    toolMode,
    toolTrace,
    pendingApprovals: [...new Set(pendingApprovals)],
    pinnedMemories: pins.filter((p) => p.source.startsWith("memory:")).length,
    bundleId,
    usedTokens,
    selectedTools: catalog.length,
    nativeRounds,
  };
}
