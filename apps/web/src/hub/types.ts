export type HubTab = "home" | "chat" | "workspace" | "connections" | "advanced";

export type UiMode = "simple" | "advanced";

export const HUB_TABS: { id: HubTab; label: string; hint: string }[] = [
  { id: "home", label: "Home", hint: "Status and setup checklist" },
  { id: "chat", label: "Chat", hint: "Agent conversations" },
  { id: "workspace", label: "Workspace", hint: "Projects, memories, graph" },
  { id: "connections", label: "Connect", hint: "Ollama, Claude, MCP bridge" },
  { id: "advanced", label: "Advanced", hint: "Backup, jobs, webhooks" },
];

export const UI_MODE_KEY = "devaios-ui-mode";
export const HUB_TAB_KEY = "devaios-hub-tab";

export type CognitiveSnapshot = {
  domains: string[];
  modules: Array<{
    domain: string;
    milestone: number;
    state: Record<string, number>;
    metrics: Record<string, number>;
  }>;
  topMetrics: Array<{ name: string; value: number; domain: string; milestone: number }>;
  summary: string;
};

export type HubStatus = {
  api: { ok: boolean; version?: string };
  workspace: string;
  chat?: {
    ready: boolean;
    enabledProviders: number;
    hint?: string;
  };
  providers: {
    ollama: { ok: boolean; latencyMs?: number; enabled?: boolean };
    anthropic: { ok: boolean; latencyMs?: number; enabled?: boolean; keySet?: boolean };
    probes: Array<{ kind: string; ok: boolean; latencyMs?: number; error?: string }>;
  };
  mcp: {
    bridgeBuilt: boolean;
    launcherPath: string;
    clientServers: number;
    lastSeenAt: string | null;
    lastTool: string | null;
    connectedRecently: boolean;
    status: "connected" | "ready" | "not_built";
  };
  cognitive: {
    ok: boolean;
    modulesActive: number;
    domains: string[];
    integrated: boolean;
    totalSystems: number;
  };
  governance: {
    pendingApprovals: number;
  };
  workspaceStats: {
    conversations: number;
    memories: number;
    projects: number;
  };
};

export type ChatResult = {
  reply: string;
  provider: string;
  model?: string;
  offline?: boolean;
  conversationId?: string;
};

export type ChatToolEvent = {
  id: string;
  kind: "call" | "result";
  round: number;
  server: string;
  tool: string;
  ok?: boolean;
  blocked?: boolean;
};

export const TAB_META: Record<HubTab, { icon: string; title: string; blurb: string }> = {
  home: {
    icon: "◉",
    title: "Home",
    blurb: "System pulse — what's alive right now",
  },
  chat: {
    icon: "💬",
    title: "Chat",
    blurb: "Talk to your workspace agent — test Ollama or Claude here",
  },
  workspace: {
    icon: "📁",
    title: "Workspace",
    blurb: "Projects, memories, and knowledge graph",
  },
  connections: {
    icon: "🔌",
    title: "Connect",
    blurb: "Ollama, API keys, Cursor / Claude Desktop MCP",
  },
  advanced: {
    icon: "⚙",
    title: "Advanced",
    blurb: "Backup, jobs, exports — power tools",
  },
};
