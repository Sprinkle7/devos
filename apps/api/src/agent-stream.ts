import type { AgentRunInput, AgentToolTrace } from "./agent.js";
import { runAgent } from "./agent.js";

export type AgentStreamEvent =
  | { type: "meta"; provider: string; model?: string; toolMode?: string }
  | { type: "tool_call"; round: number; server: string; tool: string; arguments?: Record<string, unknown> }
  | { type: "tool_result"; round: number; server: string; tool: string; ok: boolean; blocked?: boolean }
  | { type: "token"; text: string }
  | { type: "done"; reply: string; conversationHints?: { toolTrace: AgentToolTrace[]; nativeRounds: number } }
  | { type: "error"; text: string };

/**
 * Stream agent run with interleaved tool events (Milestone 09).
 */
export async function* runAgentStream(input: AgentRunInput): AsyncGenerator<AgentStreamEvent> {
  try {
    const result = await runAgent(input);
    yield {
      type: "meta",
      provider: result.provider,
      model: result.model,
      toolMode: result.toolMode,
    };

    for (const t of result.toolTrace) {
      yield {
        type: "tool_call",
        round: t.round,
        server: t.server,
        tool: t.tool,
      };
      yield {
        type: "tool_result",
        round: t.round,
        server: t.server,
        tool: t.tool,
        ok: t.ok,
        blocked: t.blocked,
      };
    }

    for (const word of result.reply.split(/(\s+)/)) {
      if (word) yield { type: "token", text: word };
    }

    yield {
      type: "done",
      reply: result.reply,
      conversationHints: {
        toolTrace: result.toolTrace,
        nativeRounds: result.nativeRounds,
      },
    };
  } catch (err) {
    yield { type: "error", text: String(err) };
  }
}
