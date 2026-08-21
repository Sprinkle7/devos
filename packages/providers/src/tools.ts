import { randomUUID } from "node:crypto";
import type { McpToolInfo } from "@devaios/shared-kernel";

export type ProviderToolDefinition = {
  nativeId: string;
  server: string;
  tool: string;
  description?: string;
  inputSchema?: unknown;
};

export type NativeToolCall = {
  id?: string;
  nativeId: string;
  arguments: Record<string, unknown>;
};

export type ToolTranscriptTurn = {
  role: "user" | "assistant" | "tool";
  content?: string;
  toolCalls?: NativeToolCall[];
  toolCallId?: string;
  toolName?: string;
};

export type ChatWithToolsResult = {
  ok: boolean;
  provider: string;
  model?: string;
  reply: string;
  toolCalls?: NativeToolCall[];
  offline?: boolean;
  attemptedProviders?: string[];
};

export function mcpNativeToolId(server: string, toolName: string): string {
  const s = server.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  const t = toolName.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return `devaios__${s}__${t}`;
}

export function catalogToProviderTools(
  entries: Array<{ server: string; tool: McpToolInfo }>,
): ProviderToolDefinition[] {
  return entries.map((e) => ({
    nativeId: mcpNativeToolId(e.server, e.tool.name),
    server: e.server,
    tool: e.tool.name,
    description: e.tool.description,
    inputSchema: e.tool.inputSchema ?? { type: "object", properties: {} },
  }));
}

export function resolveNativeToolCall(
  call: NativeToolCall,
  catalog: ProviderToolDefinition[],
): { server: string; tool: string; arguments: Record<string, unknown> } | null {
  const hit = catalog.find((c) => c.nativeId === call.nativeId);
  if (hit) {
    return { server: hit.server, tool: hit.tool, arguments: call.arguments };
  }
  const parts = call.nativeId.match(/^devaios__(.+)__(.+)$/);
  if (!parts) return null;
  const serverGuess = parts[1].replace(/_/g, "-");
  return { server: serverGuess, tool: parts[2].replace(/_/g, "-"), arguments: call.arguments };
}

export function parseOpenAiToolCalls(
  message: {
    tool_calls?: Array<{
      id?: string;
      function?: { name?: string; arguments?: string };
    }>;
  } | undefined,
): NativeToolCall[] {
  const out: NativeToolCall[] = [];
  for (const tc of message?.tool_calls ?? []) {
    const name = tc.function?.name;
    if (!name) continue;
    let args: Record<string, unknown> = {};
    try {
      args = JSON.parse(tc.function?.arguments ?? "{}") as Record<string, unknown>;
    } catch {
      args = {};
    }
    out.push({ id: tc.id, nativeId: name, arguments: args });
  }
  return out;
}

export function parseAnthropicToolCalls(
  content: Array<{ type?: string; id?: string; name?: string; input?: Record<string, unknown> }> | undefined,
): NativeToolCall[] {
  const out: NativeToolCall[] = [];
  for (const block of content ?? []) {
    if (block.type === "tool_use" && block.name) {
      out.push({ id: block.id, nativeId: block.name, arguments: block.input ?? {} });
    }
  }
  return out;
}

export function newToolCallId(): string {
  return randomUUID();
}

export function buildOpenAiToolMessages(
  transcript: ToolTranscriptTurn[],
  system?: string,
): Array<Record<string, unknown>> {
  const messages: Array<Record<string, unknown>> = [];
  if (system) messages.push({ role: "system", content: system });
  for (const turn of transcript) {
    if (turn.role === "user") {
      messages.push({ role: "user", content: turn.content ?? "" });
      continue;
    }
    if (turn.role === "assistant") {
      const row: Record<string, unknown> = {
        role: "assistant",
        content: turn.content ?? null,
      };
      if (turn.toolCalls?.length) {
        row.tool_calls = turn.toolCalls.map((tc) => ({
          id: tc.id ?? newToolCallId(),
          type: "function",
          function: {
            name: tc.nativeId,
            arguments: JSON.stringify(tc.arguments ?? {}),
          },
        }));
      }
      messages.push(row);
      continue;
    }
    if (turn.role === "tool" && turn.toolCallId) {
      messages.push({
        role: "tool",
        tool_call_id: turn.toolCallId,
        content: turn.content ?? "",
      });
    }
  }
  return messages;
}

export function buildAnthropicToolMessages(
  transcript: ToolTranscriptTurn[],
): Array<{ role: "user" | "assistant"; content: unknown }> {
  const messages: Array<{ role: "user" | "assistant"; content: unknown }> = [];
  for (const turn of transcript) {
    if (turn.role === "user") {
      messages.push({ role: "user", content: turn.content ?? "" });
      continue;
    }
    if (turn.role === "assistant") {
      const blocks: Array<Record<string, unknown>> = [];
      if (turn.content) blocks.push({ type: "text", text: turn.content });
      for (const tc of turn.toolCalls ?? []) {
        blocks.push({
          type: "tool_use",
          id: tc.id ?? newToolCallId(),
          name: tc.nativeId,
          input: tc.arguments ?? {},
        });
      }
      messages.push({ role: "assistant", content: blocks.length === 1 ? blocks : blocks });
      continue;
    }
    if (turn.role === "tool" && turn.toolCallId) {
      messages.push({
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: turn.toolCallId,
            content: turn.content ?? "",
          },
        ],
      });
    }
  }
  return messages;
}
