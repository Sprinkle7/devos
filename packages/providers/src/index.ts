import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { getDevaiosHome, nowIso } from "@devaios/shared-kernel";
import {
  type ChatWithToolsResult,
  type ProviderToolDefinition,
  type ToolTranscriptTurn,
  buildAnthropicToolMessages,
  buildOpenAiToolMessages,
  parseAnthropicToolCalls,
  parseOpenAiToolCalls,
} from "./tools.js";

export {
  mcpNativeToolId,
  catalogToProviderTools,
  resolveNativeToolCall,
  buildOpenAiToolMessages,
  buildAnthropicToolMessages,
  newToolCallId,
  type ProviderToolDefinition,
  type NativeToolCall,
  type ToolTranscriptTurn,
  type ChatWithToolsResult,
} from "./tools.js";

export type ProviderKind = "ollama" | "anthropic" | "openai" | "custom";

export type ProviderRegistration = {
  id: string;
  name: string;
  kind: ProviderKind;
  baseUrl?: string;
  enabled: boolean;
  createdAt: string;
};

const builtin: ProviderRegistration[] = [
  {
    id: "builtin-ollama",
    name: "Ollama (local)",
    kind: "ollama",
    baseUrl: "http://127.0.0.1:11434",
    enabled: true,
    createdAt: "1970-01-01T00:00:00.000Z",
  },
  {
    id: "builtin-anthropic",
    name: "Anthropic",
    kind: "anthropic",
    baseUrl: "https://api.anthropic.com",
    enabled: false,
    createdAt: "1970-01-01T00:00:00.000Z",
  },
  {
    id: "builtin-openai",
    name: "OpenAI",
    kind: "openai",
    baseUrl: "https://api.openai.com",
    enabled: false,
    createdAt: "1970-01-01T00:00:00.000Z",
  },
];

/**
 * Provider registry + lightweight chat (Ollama when available).
 */
export class ProviderRegistry {
  private readonly storePath: string;

  constructor(home = getDevaiosHome()) {
    this.storePath = join(home, "providers", "providers.json");
    this.failoverPath = join(home, "providers", "failover.json");
  }

  private readonly failoverPath: string;

  private async ensure(): Promise<void> {
    await mkdir(dirname(this.storePath), { recursive: true });
    try {
      await readFile(this.storePath, "utf8");
    } catch {
      await writeFile(this.storePath, JSON.stringify(builtin, null, 2) + "\n", "utf8");
    }
  }

  async list(): Promise<ProviderRegistration[]> {
    await this.ensure();
    return JSON.parse(await readFile(this.storePath, "utf8")) as ProviderRegistration[];
  }

  async setEnabled(id: string, enabled: boolean): Promise<ProviderRegistration | null> {
    const all = await this.list();
    const row = all.find((p) => p.id === id);
    if (!row) return null;
    row.enabled = enabled;
    await writeFile(this.storePath, JSON.stringify(all, null, 2) + "\n", "utf8");
    return row;
  }

  async upsertCustom(name: string, baseUrl: string): Promise<ProviderRegistration> {
    const all = await this.list();
    const existing = all.find((p) => p.name === name && p.kind === "custom");
    if (existing) {
      existing.baseUrl = baseUrl;
      existing.enabled = true;
      await writeFile(this.storePath, JSON.stringify(all, null, 2) + "\n", "utf8");
      return existing;
    }
    const row: ProviderRegistration = {
      id: `custom-${Date.now()}`,
      name,
      kind: "custom",
      baseUrl,
      enabled: true,
      createdAt: nowIso(),
    };
    all.push(row);
    await writeFile(this.storePath, JSON.stringify(all, null, 2) + "\n", "utf8");
    return row;
  }

  private defaultFailoverOrder(): ProviderKind[] {
    return ["ollama", "openai", "anthropic"];
  }

  async getFailoverOrder(): Promise<ProviderKind[]> {
    await mkdir(dirname(this.failoverPath), { recursive: true });
    try {
      const raw = JSON.parse(await readFile(this.failoverPath, "utf8")) as { order?: ProviderKind[] };
      const order = raw.order?.filter((k) => this.defaultFailoverOrder().includes(k)) ?? [];
      return order.length ? order : this.defaultFailoverOrder();
    } catch {
      return this.defaultFailoverOrder();
    }
  }

  async setFailoverOrder(order: ProviderKind[]): Promise<ProviderKind[]> {
    const cleaned = order.filter((k) => this.defaultFailoverOrder().includes(k));
    const next = cleaned.length ? cleaned : this.defaultFailoverOrder();
    await mkdir(dirname(this.failoverPath), { recursive: true });
    await writeFile(this.failoverPath, JSON.stringify({ order: next }, null, 2) + "\n", "utf8");
    return next;
  }

  async probeFailoverChain(input?: {
    openaiApiKey?: string;
    anthropicApiKey?: string;
  }): Promise<
    Array<{
      kind: ProviderKind;
      enabled: boolean;
      ok: boolean;
      latencyMs?: number;
      provider?: string;
      error?: string;
    }>
  > {
    const all = await this.list();
    const order = await this.getFailoverOrder();
    const rows: Array<{
      kind: ProviderKind;
      enabled: boolean;
      ok: boolean;
      latencyMs?: number;
      provider?: string;
      error?: string;
    }> = [];

    for (const kind of order) {
      const reg = all.find((p) => p.kind === kind);
      const enabled = Boolean(reg?.enabled);
      if (!enabled) {
        rows.push({ kind, enabled: false, ok: false, error: "disabled" });
        continue;
      }

      const started = Date.now();
      try {
        if (kind === "ollama" && reg?.baseUrl) {
          const res = await fetch(`${reg.baseUrl.replace(/\/$/, "")}/api/tags`, {
            signal: AbortSignal.timeout(5_000),
          });
          rows.push({
            kind,
            enabled: true,
            ok: res.ok,
            latencyMs: Date.now() - started,
            provider: "ollama",
            error: res.ok ? undefined : `HTTP ${res.status}`,
          });
          continue;
        }

        if (kind === "openai" && reg && input?.openaiApiKey) {
          const res = await fetch(`${(reg.baseUrl ?? "https://api.openai.com").replace(/\/$/, "")}/v1/models`, {
            headers: { Authorization: `Bearer ${input.openaiApiKey}` },
            signal: AbortSignal.timeout(8_000),
          });
          rows.push({
            kind,
            enabled: true,
            ok: res.ok,
            latencyMs: Date.now() - started,
            provider: "openai",
            error: res.ok ? undefined : `HTTP ${res.status}`,
          });
          continue;
        }

        if (kind === "anthropic" && reg && input?.anthropicApiKey) {
          const res = await fetch(`${(reg.baseUrl ?? "https://api.anthropic.com").replace(/\/$/, "")}/v1/messages`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": input.anthropicApiKey,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: "claude-3-5-haiku-latest",
              max_tokens: 8,
              messages: [{ role: "user", content: "ping" }],
            }),
            signal: AbortSignal.timeout(8_000),
          });
          rows.push({
            kind,
            enabled: true,
            ok: res.ok,
            latencyMs: Date.now() - started,
            provider: "anthropic",
            error: res.ok ? undefined : `HTTP ${res.status}`,
          });
          continue;
        }

        rows.push({
          kind,
          enabled: true,
          ok: false,
          latencyMs: Date.now() - started,
          error: kind === "openai" || kind === "anthropic" ? "missing_api_key" : "unconfigured",
        });
      } catch (err) {
        rows.push({
          kind,
          enabled: true,
          ok: false,
          latencyMs: Date.now() - started,
          error: String(err),
        });
      }
    }

    return rows;
  }

  async autoDisableFailedProbes(
    probes: Array<{ kind: ProviderKind; ok: boolean; enabled: boolean; error?: string }>,
  ): Promise<{ disabled: Array<{ id: string; kind: ProviderKind; name: string }> }> {
    const disabled: Array<{ id: string; kind: ProviderKind; name: string }> = [];
    const skipErrors = new Set(["disabled", "missing_api_key", "unconfigured"]);

    for (const probe of probes) {
      if (!probe.enabled || probe.ok) continue;
      if (probe.error && skipErrors.has(probe.error)) continue;

      const all = await this.list();
      const reg = all.find((p) => p.kind === probe.kind && p.enabled);
      if (!reg) continue;

      await this.setEnabled(reg.id, false);
      disabled.push({ id: reg.id, kind: reg.kind, name: reg.name });
    }

    return { disabled };
  }

  async chat(input: {
    system?: string;
    user: string;
    model?: string;
    anthropicApiKey?: string;
    openaiApiKey?: string;
  }): Promise<{
    ok: boolean;
    provider: string;
    model?: string;
    reply: string;
    offline?: boolean;
    attemptedProviders?: string[];
  }> {
    const all = await this.list();
    const order = await this.getFailoverOrder();
    const attempted: string[] = [];

    for (const kind of order) {
      attempted.push(kind);
      if (kind === "ollama") {
        const ollama = all.find((p) => p.kind === "ollama" && p.enabled);
        if (ollama?.baseUrl) {
          try {
            const model = input.model ?? "llama3.2";
            const res = await fetch(`${ollama.baseUrl.replace(/\/$/, "")}/api/chat`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                model,
                stream: false,
                messages: [
                  ...(input.system ? [{ role: "system", content: input.system }] : []),
                  { role: "user", content: input.user },
                ],
              }),
              signal: AbortSignal.timeout(45_000),
            });
            if (res.ok) {
              const data = (await res.json()) as { message?: { content?: string } };
              const reply = data.message?.content?.trim();
              if (reply) {
                return { ok: true, provider: "ollama", model, reply, attemptedProviders: attempted };
              }
            }
          } catch {
            /* try next */
          }
        }
      }

      if (kind === "openai") {
        const openai = all.find((p) => p.kind === "openai" && p.enabled);
        if (openai && input.openaiApiKey) {
          try {
            const model = input.model ?? "gpt-4o-mini";
            const res = await fetch(`${(openai.baseUrl ?? "https://api.openai.com").replace(/\/$/, "")}/v1/chat/completions`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${input.openaiApiKey}`,
              },
              body: JSON.stringify({
                model,
                messages: [
                  ...(input.system ? [{ role: "system", content: input.system }] : []),
                  { role: "user", content: input.user },
                ],
              }),
              signal: AbortSignal.timeout(60_000),
            });
            if (res.ok) {
              const data = (await res.json()) as {
                choices?: Array<{ message?: { content?: string } }>;
              };
              const reply = data.choices?.[0]?.message?.content?.trim();
              if (reply) return { ok: true, provider: "openai", model, reply, attemptedProviders: attempted };
            }
          } catch {
            /* try next */
          }
        }
      }

      if (kind === "anthropic") {
        const anthropic = all.find((p) => p.kind === "anthropic" && p.enabled);
        if (anthropic && input.anthropicApiKey) {
          try {
            const model = input.model ?? "claude-3-5-haiku-latest";
            const res = await fetch(`${(anthropic.baseUrl ?? "https://api.anthropic.com").replace(/\/$/, "")}/v1/messages`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": input.anthropicApiKey,
                "anthropic-version": "2023-06-01",
              },
              body: JSON.stringify({
                model,
                max_tokens: 1024,
                system: input.system,
                messages: [{ role: "user", content: input.user }],
              }),
              signal: AbortSignal.timeout(60_000),
            });
            if (res.ok) {
              const data = (await res.json()) as {
                content?: Array<{ type?: string; text?: string }>;
              };
              const reply = data.content?.find((c) => c.type === "text")?.text?.trim();
              if (reply) return { ok: true, provider: "anthropic", model, reply, attemptedProviders: attempted };
            }
          } catch {
            /* try next */
          }
        }
      }
    }

    const preview = input.user.slice(0, 1200);
    return {
      ok: true,
      provider: "offline-stub",
      offline: true,
      attemptedProviders: attempted,
      reply: [
        "DEVAIOS offline agent (no live model reached).",
        input.system ? `\n[system]\n${input.system.slice(0, 800)}` : "",
        `\n[user]\n${preview}`,
        "\n\nEnable Ollama, or store OPENAI_API_KEY / ANTHROPIC_API_KEY and enable that provider.",
      ].join(""),
    };
  }

  async chatWithTools(input: {
    system?: string;
    user?: string;
    transcript?: ToolTranscriptTurn[];
    model?: string;
    tools: ProviderToolDefinition[];
    anthropicApiKey?: string;
    openaiApiKey?: string;
  }): Promise<ChatWithToolsResult> {
    const all = await this.list();
    const order = await this.getFailoverOrder();
    const attempted: string[] = [];
    const transcript: ToolTranscriptTurn[] =
      input.transcript ?? (input.user ? [{ role: "user", content: input.user }] : []);
    const openAiTools = input.tools.map((t) => ({
      type: "function" as const,
      function: {
        name: t.nativeId,
        description: t.description ?? `MCP ${t.server}/${t.tool}`,
        parameters: (t.inputSchema as Record<string, unknown>) ?? { type: "object", properties: {} },
      },
    }));

    for (const kind of order) {
      attempted.push(kind);

      if (kind === "ollama") {
        const ollama = all.find((p) => p.kind === "ollama" && p.enabled);
        if (ollama?.baseUrl && openAiTools.length && transcript.length) {
          try {
            const model = input.model ?? "llama3.2";
            const messages = buildOpenAiToolMessages(transcript, input.system);
            const res = await fetch(`${ollama.baseUrl.replace(/\/$/, "")}/api/chat`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                model,
                messages,
                tools: openAiTools,
                stream: false,
              }),
              signal: AbortSignal.timeout(90_000),
            });
            if (res.ok) {
              const data = (await res.json()) as {
                message?: {
                  content?: string;
                  tool_calls?: Array<{ id?: string; function?: { name?: string; arguments?: string | Record<string, unknown> } }>;
                };
              };
              const message = data.message;
              const normalized = message?.tool_calls?.map((tc) => ({
                function: {
                  name: tc.function?.name,
                  arguments:
                    typeof tc.function?.arguments === "string"
                      ? tc.function.arguments
                      : JSON.stringify(tc.function?.arguments ?? {}),
                },
                id: tc.id,
              }));
              const toolCalls = parseOpenAiToolCalls({ tool_calls: normalized });
              const reply = message?.content?.trim() ?? "";
              if (toolCalls.length || reply) {
                return { ok: true, provider: "ollama", model, reply, toolCalls, attemptedProviders: attempted };
              }
            }
          } catch {
            /* try next */
          }
        }
      }

      if (kind === "openai") {
        const openai = all.find((p) => p.kind === "openai" && p.enabled);
        if (openai && input.openaiApiKey && openAiTools.length && transcript.length) {
          try {
            const model = input.model ?? "gpt-4o-mini";
            const messages = buildOpenAiToolMessages(transcript, input.system);
            const res = await fetch(
              `${(openai.baseUrl ?? "https://api.openai.com").replace(/\/$/, "")}/v1/chat/completions`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${input.openaiApiKey}`,
                },
                body: JSON.stringify({
                  model,
                  messages,
                  tools: openAiTools,
                  tool_choice: "auto",
                }),
                signal: AbortSignal.timeout(90_000),
              },
            );
            if (res.ok) {
              const data = (await res.json()) as {
                choices?: Array<{
                  message?: {
                    content?: string | null;
                    tool_calls?: Array<{ id?: string; function?: { name?: string; arguments?: string } }>;
                  };
                }>;
              };
              const message = data.choices?.[0]?.message;
              const toolCalls = parseOpenAiToolCalls(message);
              const reply = message?.content?.trim() ?? "";
              if (toolCalls.length || reply) {
                return { ok: true, provider: "openai", model, reply, toolCalls, attemptedProviders: attempted };
              }
            }
          } catch {
            /* try next */
          }
        }
      }

      if (kind === "anthropic") {
        const anthropic = all.find((p) => p.kind === "anthropic" && p.enabled);
        if (anthropic && input.anthropicApiKey && input.tools.length && transcript.length) {
          try {
            const model = input.model ?? "claude-3-5-haiku-latest";
            const anthropicTools = input.tools.map((t) => ({
              name: t.nativeId,
              description: t.description ?? `MCP ${t.server}/${t.tool}`,
              input_schema: (t.inputSchema as Record<string, unknown>) ?? { type: "object", properties: {} },
            }));
            const messages = buildAnthropicToolMessages(transcript);
            const res = await fetch(
              `${(anthropic.baseUrl ?? "https://api.anthropic.com").replace(/\/$/, "")}/v1/messages`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": input.anthropicApiKey,
                  "anthropic-version": "2023-06-01",
                },
                body: JSON.stringify({
                  model,
                  max_tokens: 1024,
                  system: input.system,
                  tools: anthropicTools,
                  messages,
                }),
                signal: AbortSignal.timeout(90_000),
              },
            );
            if (res.ok) {
              const data = (await res.json()) as {
                content?: Array<{ type?: string; id?: string; text?: string; name?: string; input?: Record<string, unknown> }>;
              };
              const toolCalls = parseAnthropicToolCalls(data.content);
              const reply = data.content?.find((c) => c.type === "text")?.text?.trim() ?? "";
              if (toolCalls.length || reply) {
                return { ok: true, provider: "anthropic", model, reply, toolCalls, attemptedProviders: attempted };
              }
            }
          } catch {
            /* try next */
          }
        }
      }
    }

    return {
      ok: false,
      provider: "none",
      reply: "",
      offline: true,
      attemptedProviders: attempted,
    };
  }

  async *streamChat(input: {
    system?: string;
    user: string;
    model?: string;
  }): AsyncGenerator<{ type: "token" | "done" | "meta"; text?: string; provider?: string; model?: string }> {
    const all = await this.list();
    const ollama = all.find((p) => p.kind === "ollama" && p.enabled);
    if (ollama?.baseUrl) {
      try {
        const model = input.model ?? "llama3.2";
        const res = await fetch(`${ollama.baseUrl.replace(/\/$/, "")}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            stream: true,
            messages: [
              ...(input.system ? [{ role: "system", content: input.system }] : []),
              { role: "user", content: input.user },
            ],
          }),
          signal: AbortSignal.timeout(90_000),
        });
        if (res.ok && res.body) {
          yield { type: "meta", provider: "ollama", model };
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buf = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });
            const lines = buf.split("\n");
            buf = lines.pop() ?? "";
            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const json = JSON.parse(line) as {
                  message?: { content?: string };
                  done?: boolean;
                };
                if (json.message?.content) yield { type: "token", text: json.message.content };
              } catch {
                /* ignore partial */
              }
            }
          }
          yield { type: "done" };
          return;
        }
      } catch {
        /* offline stream */
      }
    }

    yield { type: "meta", provider: "offline-stub" };
    const offline = [
      "DEVAIOS offline stream. ",
      "Start Ollama for live tokens. ",
      `You asked: ${input.user.slice(0, 200)}`,
    ].join("");
    for (const word of offline.split(/(\s+)/)) {
      yield { type: "token", text: word };
    }
    yield { type: "done" };
  }

  async *streamChatWithTools(input: {
    system?: string;
    user?: string;
    model?: string;
    tools: ProviderToolDefinition[];
    transcript?: ToolTranscriptTurn[];
  }): AsyncGenerator<{
    type: "meta" | "tool_call" | "token" | "done";
    text?: string;
    provider?: string;
    model?: string;
    nativeId?: string;
    arguments?: Record<string, unknown>;
    hasToolCalls?: boolean;
    reply?: string;
  }> {
    const result = await this.chatWithTools(input);
    if (!result.ok) return;

    yield { type: "meta", provider: result.provider, model: result.model };

    if (result.toolCalls?.length) {
      for (const tc of result.toolCalls) {
        yield { type: "tool_call", nativeId: tc.nativeId, arguments: tc.arguments };
      }
      yield { type: "done", reply: result.reply, hasToolCalls: true };
      return;
    }

    const all = await this.list();
    const ollama = all.find((p) => p.kind === "ollama" && p.enabled);
    const userText =
      input.transcript?.filter((t) => t.role === "user").at(-1)?.content ?? input.user ?? "";

    if (ollama?.baseUrl && result.provider === "ollama" && userText) {
      for await (const ev of this.streamChat({ system: input.system, user: userText, model: input.model })) {
        if (ev.type === "token" && ev.text) yield { type: "token", text: ev.text };
      }
      yield { type: "done", reply: result.reply };
      return;
    }

    for (const word of result.reply.split(/(\s+)/)) {
      if (word) yield { type: "token", text: word };
    }
    yield { type: "done", reply: result.reply };
  }
}
