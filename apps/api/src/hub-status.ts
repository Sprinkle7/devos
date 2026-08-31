import { analyzeCognitive } from "@devaios/cognitive-runtime";
import type { ProviderRegistry } from "@devaios/providers";
import type { SecretsStore } from "@devaios/secrets";
import {
  getMcpActivity,
  isMcpConnectedRecently,
  mcpBridgePaths,
  resolveMcpLauncherScript,
} from "./mcp-bridge.js";

export async function buildHubStatus(input: {
  healthOk: boolean;
  healthVersion?: string;
  providers: ProviderRegistry;
  secrets: SecretsStore;
  workspaceSlug?: string;
  mcpServersCount?: number;
  pendingApprovals?: number;
  conversationCount?: number;
  memoryCount?: number;
  projectCount?: number;
}) {
  const paths = await mcpBridgePaths();
  const activity = getMcpActivity();
  const connectedRecently = isMcpConnectedRecently();

  const openaiApiKey = (await input.secrets.get("OPENAI_API_KEY")) ?? undefined;
  const anthropicApiKey = (await input.secrets.get("ANTHROPIC_API_KEY")) ?? undefined;
  const probes = await input.providers.probeFailoverChain({ openaiApiKey, anthropicApiKey });
  const list = await input.providers.list();

  let cognitiveOk = false;
  let cognitiveModules = 0;
  let cognitiveDomains: string[] = [];
  try {
    const snapshot = await analyzeCognitive({
      message: "hub health ping",
      workspaceSlug: input.workspaceSlug,
    });
    cognitiveOk = snapshot.modules.length > 0;
    cognitiveModules = snapshot.modules.length;
    cognitiveDomains = snapshot.domains;
  } catch {
    cognitiveOk = false;
  }

  const ollamaProbe = probes.find((p) => p.kind === "ollama");
  const anthropicProbe = probes.find((p) => p.kind === "anthropic");
  const enabledCount = list.filter((p) => p.enabled).length;
  const chatReady = probes.some((p) => p.ok);

  return {
    api: { ok: input.healthOk, version: input.healthVersion },
    workspace: input.workspaceSlug ?? "demo",
    chat: {
      ready: chatReady,
      enabledProviders: enabledCount,
      hint: chatReady
        ? undefined
        : enabledCount === 0
          ? "No LLM provider enabled — open Connect and enable Ollama or add an API key."
          : "Providers enabled but unreachable — start Ollama or check API keys.",
    },
    providers: {
      ollama: { ok: ollamaProbe?.ok ?? false, latencyMs: ollamaProbe?.latencyMs, enabled: list.some((p) => p.kind === "ollama" && p.enabled) },
      anthropic: {
        ok: anthropicProbe?.ok ?? false,
        latencyMs: anthropicProbe?.latencyMs,
        enabled: list.some((p) => p.id === "builtin-anthropic" && p.enabled),
        keySet: Boolean(anthropicApiKey),
      },
      probes: probes.map((p) => ({ kind: p.kind, ok: p.ok, latencyMs: p.latencyMs, error: p.error })),
    },
    mcp: {
      bridgeBuilt: paths.launcherExists && paths.entryExists,
      launcherPath: resolveMcpLauncherScript(),
      clientServers: input.mcpServersCount ?? 0,
      lastSeenAt: activity.lastSeenAt,
      lastTool: activity.lastTool,
      connectedRecently,
      status: connectedRecently ? "connected" : paths.launcherExists && paths.entryExists ? "ready" : "not_built",
    },
    cognitive: {
      ok: cognitiveOk,
      modulesActive: cognitiveModules,
      domains: cognitiveDomains,
      integrated: true,
      totalSystems: 205,
    },
    governance: {
      pendingApprovals: input.pendingApprovals ?? 0,
    },
    workspaceStats: {
      conversations: input.conversationCount ?? 0,
      memories: input.memoryCount ?? 0,
      projects: input.projectCount ?? 0,
    },
  };
}
