import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { packContext } from "@devaios/context-compression";
import { loadConfig } from "@devaios/config";
import { McpHost, registerGraphifyHelper, graphifyQuery, graphifyBuild } from "@devaios/mcp-host";
import { ProviderRegistry } from "@devaios/providers";
import { SecretsStore } from "@devaios/secrets";
import { getDevaiosHome, nowIso } from "@devaios/shared-kernel";
import { readFile } from "node:fs/promises";
import { db } from "./db/client.js";
import { conversations, memories, messages, projects, workspaces } from "./db/schema.js";
import { readBackupBundle, verifySignedBackup, isSignedBackup } from "./backup.js";
import { runBackupExport } from "./backup-export.js";
import { loadBackupSchedule, saveBackupSchedule } from "./backup-scheduler.js";
import { loadBackupRetention, rotateBackups, saveBackupRetention } from "./backup-retention.js";
import { loadArchiveRetention, rotateArchives, saveArchiveRetention } from "./archive-retention.js";
import { previewBackupRestore } from "./backup-restore-preview.js";
import { applyBackupRestore } from "./backup-restore-apply.js";
import { filterBundleBySelectedDiff } from "./backup-restore-diff-filter.js";
import { writeRestoreDiffExport } from "./backup-restore-diff-export.js";
import { resolveScopedRestoreBundle, detectScopedSlugFromBackupPath, inferScopedRestoreOptions } from "./backup-restore-scoped.js";
import { writeArchiveImportDiffExport } from "./archive-import-diff-export.js";
import {
  listTemplateRunNotifications,
  markTemplateRunNotificationsRead,
  exportTemplateRunDryRunDetails,
  previewTemplateRunDryRunExportFilters,
} from "./template-run-notifications.js";
import { importArchiveFromDiffFile, previewArchiveImportFromDiffFile, saveArchiveImportDiffSelection, mergeArchiveImportDiffFiles, previewArchiveImportDiffMerge } from "./archive-import-diff-apply.js";
import {
  loadTemplateNotificationWebhook,
  saveTemplateNotificationWebhook,
  listWebhookDeadLetters,
  replayWebhookDeadLetters,
  deleteWebhookDeadLetters,
  exportWebhookDeadLetters,
  importWebhookDeadLettersFromFile,
  importAndReplayWebhookDeadLettersFromFile,
  getDeadLetterHashIndexStats,
  rebuildDeadLetterHashIndex,
  checkDeadLetterHashIndexIntegrity,
  getHashTickCheckMetrics,
} from "./template-notification-webhook.js";
import {
  loadTemplateNotificationEmail,
  saveTemplateNotificationEmail,
  listEmailOutbox,
  listEmailDeliveryLog,
  loadEmailDeliveryRetention,
  saveEmailDeliveryRetention,
  rotateEmailDeliveryLog,
  maybeRotateEmailDeliveryLogOnTick,
  getEmailDeliveryLogMetrics,
  listEmailDeliveryRotationHistory,
  rotateEmailDeliveryRotationHistory,
  exportEmailDeliveryRotationHistoryCsv,
  checkEmailDeliveryRotationIntegrity,
  repairEmailDeliveryRotationIntegrity,
  listRotationRepairAudit,
  exportRotationRepairAuditCsv,
  loadRotationRepairAuditRetention,
  resetRotationRepairAuditRetention,
  ROTATION_REPAIR_AUDIT_RETENTION_DEFAULTS,
  saveRotationRepairAuditRetention,
  rotateRotationRepairAudit,
} from "./template-notification-email.js";
import { findLatestScopedBackupPath } from "./workspace-backup-batch.js";
import {
  batchPreviewLatestScopedBackups,
  batchRestoreLatestScopedBackups,
  previewLatestScopedBackup,
  restoreLatestScopedBackup,
} from "./backup-restore-batch.js";
import { exportWorkspaceScopedArchive, exportWorkspaceScopedBackup } from "./workspace-scoped-export.js";
import {
  loadArchiveExportSchedule,
  saveArchiveExportSchedule,
} from "./archive-export-scheduler.js";
import {
  exportAllWorkspacesArchive,
  exportWorkspaceConversations,
  writeArchiveFile,
  writeConversationExportFile,
  isSignedArchive,
  verifySignedArchive,
} from "./conversation-export.js";
import { importConversationExport, importConversationExportFromFile, importConversationArchive, previewConversationArchiveImport } from "./conversation-import.js";
import { mergeDuplicateConversationsByTitle } from "./conversation-merge.js";
import { cloneWorkspaceFull } from "./workspace-clone.js";
import {
  listTemplateRunState,
  runWorkspaceJobTemplates,
  type TemplateRunners,
} from "./job-template-runner.js";
import {
  defaultJobTemplates,
  listWorkspaceJobTemplates,
  saveWorkspaceJobTemplates,
} from "./job-templates.js";
import {
  canEnableProvider,
  clearProviderCooldown,
  loadProviderCooldown,
  recordProviderDisable,
  saveProviderCooldownMinutes,
} from "./provider-cooldown.js";
import { searchConversations } from "./conversation-search.js";
import {
  createApprovalRequest,
  isToolApproved,
  listApprovalRequests,
  resolveApprovalRequest,
} from "./governance-inbox.js";
import { deriveConversationTitle, enqueueArchiveExport, enqueueBackupExport, enqueueGraphifyBuild, getJob, mapJob } from "./jobs.js";
import { log } from "./log.js";
import { runAgent } from "./agent.js";
import { runAgentStream } from "./agent-stream.js";

const home = getDevaiosHome(process.env.DEVAIO_HOME);
const mcpHost = new McpHost(home);
const providers = new ProviderRegistry(home);
const secrets = new SecretsStore(home);

export const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.use("*", async (c, next) => {
  const started = Date.now();
  await next();
  log("info", "request", {
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    ms: Date.now() - started,
  });
});

function mapWorkspace(r: typeof workspaces.$inferSelect) {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    rootPath: r.rootPath,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

function mapProject(r: typeof projects.$inferSelect) {
  return {
    id: r.id,
    workspaceId: r.workspaceId,
    slug: r.slug,
    name: r.name,
    repoPath: r.repoPath,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

function mapMemory(r: typeof memories.$inferSelect) {
  return {
    id: r.id,
    workspaceId: r.workspaceId,
    kind: r.kind,
    title: r.title,
    content: r.content,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

app.get("/health", async (c) => {
  const cfg = await loadConfig();
  const deliveryLog = await getEmailDeliveryLogMetrics(home);
  const deadLetterHashes = await getDeadLetterHashIndexStats(home);
  const hashTickCheck = await getHashTickCheckMetrics(home);
  return c.json({
    ok: true,
    service: "devaios-api",
    version: "0.96.0",
    time: nowIso(),
    home: cfg.home,
    deliveryLog,
    deadLetterHashes: { ...deadLetterHashes, tickCheck: hashTickCheck },
  });
});

app.get("/config", async (c) => {
  const cfg = await loadConfig();
  return c.json({ config: cfg });
});

app.get("/workspaces", async (c) => {
  const rows = await db.select().from(workspaces).orderBy(workspaces.createdAt);
  return c.json({ workspaces: rows.map(mapWorkspace) });
});

const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  rootPath: z.string().min(1).optional(),
});

app.post("/workspaces", async (c) => {
  const body = createWorkspaceSchema.parse(await c.req.json());
  const [row] = await db
    .insert(workspaces)
    .values({
      name: body.name,
      slug: body.slug,
      rootPath: body.rootPath ?? null,
    })
    .returning();
  return c.json({ workspace: mapWorkspace(row) }, 201);
});

app.post("/workspaces/:slug/clone", async (c) => {
  const sourceSlug = c.req.param("slug");
  const body = z
    .object({
      targetSlug: z
        .string()
        .min(1)
        .max(64)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      targetName: z.string().min(1).max(120).optional(),
      includeApprovals: z.boolean().default(true),
      includeJobs: z.boolean().default(false),
      includeScheduleTemplates: z.boolean().default(false),
    })
    .parse(await c.req.json());
  try {
    const result = await cloneWorkspaceFull(sourceSlug, body.targetSlug, body.targetName, {
      includeApprovals: body.includeApprovals,
      includeJobs: body.includeJobs,
      includeScheduleTemplates: body.includeScheduleTemplates,
    });
    return c.json({ ok: true, ...result }, 201);
  } catch (err) {
    const msg = String(err);
    if (msg.includes("source_not_found")) return c.json({ error: "not_found" }, 404);
    if (msg.includes("target_slug_taken")) return c.json({ error: "slug_taken" }, 409);
    throw err;
  }
});

app.get("/workspaces/:slug", async (c) => {
  const slug = c.req.param("slug");
  const [row] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  if (!row) return c.json({ error: "not_found" }, 404);
  const projectRows = await db.select().from(projects).where(eq(projects.workspaceId, row.id));
  return c.json({ workspace: mapWorkspace(row), projects: projectRows.map(mapProject) });
});

const createProjectSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  repoPath: z.string().min(1).optional(),
});

app.get("/workspaces/:slug/projects", async (c) => {
  const slug = c.req.param("slug");
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);
  const rows = await db.select().from(projects).where(eq(projects.workspaceId, ws.id));
  return c.json({ projects: rows.map(mapProject) });
});

app.post("/workspaces/:slug/projects", async (c) => {
  const slug = c.req.param("slug");
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);
  const body = createProjectSchema.parse(await c.req.json());
  const [row] = await db
    .insert(projects)
    .values({
      workspaceId: ws.id,
      name: body.name,
      slug: body.slug,
      repoPath: body.repoPath ?? null,
    })
    .returning();
  return c.json({ project: mapProject(row) }, 201);
});

app.delete("/workspaces/:slug/projects/:projectSlug", async (c) => {
  const slug = c.req.param("slug");
  const projectSlug = c.req.param("projectSlug");
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);
  const deleted = await db
    .delete(projects)
    .where(and(eq(projects.workspaceId, ws.id), eq(projects.slug, projectSlug)))
    .returning();
  if (!deleted.length) return c.json({ error: "not_found" }, 404);
  return c.json({ ok: true });
});

const packSchema = z.object({
  budgetTokens: z.number().int().positive().optional(),
  reserveTokens: z.number().int().nonnegative().optional(),
  workspaceSlug: z.string().optional(),
  pins: z.array(z.object({ source: z.string(), content: z.string() })).optional(),
  items: z
    .array(
      z.object({
        source: z.string(),
        content: z.string(),
        prefer: z.enum(["pin", "excerpt", "summarize", "dedup", "trim"]).optional(),
      }),
    )
    .optional(),
});

app.post("/context/pack", async (c) => {
  const cfg = await loadConfig();
  const body = packSchema.parse(await c.req.json());
  const pins = [...(body.pins ?? [])];
  if (body.workspaceSlug) {
    const [ws] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.slug, body.workspaceSlug))
      .limit(1);
    if (ws) {
      const rows = await db.select().from(memories).where(eq(memories.workspaceId, ws.id));
      for (const m of rows.slice(0, 20)) {
        pins.push({
          source: `memory:${m.kind}:${m.title}`,
          content: `${m.title}\n${m.content}`,
        });
      }
    }
  }
  const bundle = packContext({
    budgetTokens: body.budgetTokens ?? cfg.defaultContextBudget,
    reserveTokens: body.reserveTokens,
    pins,
    items: body.items,
  });
  return c.json({ bundle, pinnedMemories: pins.filter((p) => p.source.startsWith("memory:")).length });
});

app.get("/mcp/servers", async (c) => {
  const servers = await mcpHost.list();
  return c.json({ servers });
});

const mcpRegisterSchema = z.object({
  name: z.string().min(1),
  command: z.string().min(1),
  args: z.array(z.string()).optional(),
  enabled: z.boolean().optional(),
});

app.post("/mcp/servers", async (c) => {
  const body = mcpRegisterSchema.parse(await c.req.json());
  const server = await mcpHost.register(body);
  return c.json({ server }, 201);
});

app.post("/mcp/servers/:id/probe", async (c) => {
  const result = await mcpHost.probe(c.req.param("id"));
  return c.json({ probe: result }, result.ok || result.timedOut ? 200 : 400);
});

app.patch("/mcp/servers/:id", async (c) => {
  const body = z.object({ enabled: z.boolean() }).parse(await c.req.json());
  const server = await mcpHost.setEnabled(c.req.param("id"), body.enabled);
  if (!server) return c.json({ error: "not_found" }, 404);
  return c.json({ server });
});

app.delete("/mcp/servers/:id", async (c) => {
  const ok = await mcpHost.remove(c.req.param("id"));
  if (!ok) return c.json({ error: "not_found" }, 404);
  return c.json({ ok: true });
});

app.post("/mcp/servers/:id/tools", async (c) => {
  const result = await mcpHost.listTools(c.req.param("id"));
  return c.json({ tools: result }, result.ok ? 200 : 400);
});

app.post("/mcp/servers/:id/call", async (c) => {
  const body = z
    .object({
      tool: z.string().min(1),
      arguments: z.record(z.unknown()).default({}),
      approveDestructive: z.boolean().default(false),
      toolDescription: z.string().optional(),
    })
    .parse(await c.req.json());
  const result = await mcpHost.callTool(c.req.param("id"), body.tool, body.arguments, {
    approveDestructive: body.approveDestructive,
    toolDescription: body.toolDescription,
  });
  if (result.blocked) return c.json({ call: result }, 403);
  return c.json({ call: result }, result.ok ? 200 : 400);
});

app.post("/graphify/query", async (c) => {
  const body = z
    .object({
      query: z.string().min(1),
      cwd: z.string().optional(),
    })
    .parse(await c.req.json());
  const result = graphifyQuery(body.query, body.cwd);
  return c.json(result, result.ok ? 200 : 404);
});

app.post("/graphify/build", async (c) => {
  const body = z
    .object({
      cwd: z.string().min(1),
      mode: z.enum(["build", "update"]).default("update"),
    })
    .parse(await c.req.json());
  const result = graphifyBuild(body.cwd, body.mode);
  return c.json(result, result.ok ? 200 : 400);
});

app.post("/graphify/build/async", async (c) => {
  const body = z
    .object({
      cwd: z.string().min(1),
      mode: z.enum(["build", "update"]).default("update"),
    })
    .parse(await c.req.json());
  const job = await enqueueGraphifyBuild(body.cwd, body.mode);
  return c.json({ job: mapJob(job) }, 202);
});

app.get("/jobs/:id", async (c) => {
  const job = await getJob(c.req.param("id"));
  if (!job) return c.json({ error: "not_found" }, 404);
  return c.json({ job: mapJob(job) });
});

app.get("/jobs/:id/stream", async (c) => {
  const id = c.req.param("id");
  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (obj: unknown) => {
        controller.enqueue(enc.encode(`data: ${JSON.stringify(obj)}\n\n`));
      };
      try {
        for (let i = 0; i < 120; i++) {
          const job = await getJob(id);
          if (!job) {
            send({ type: "error", text: "not_found" });
            break;
          }
          send({ type: "status", job: mapJob(job) });
          if (job.status === "completed" || job.status === "failed") {
            send({ type: "done", job: mapJob(job) });
            break;
          }
          await new Promise((r) => setTimeout(r, 1000));
        }
      } catch (err) {
        send({ type: "error", text: String(err) });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
});

const agentChatSchema = z.object({
  workspaceSlug: z.string().min(1),
  message: z.string().min(1),
  model: z.string().optional(),
  budgetTokens: z.number().int().positive().optional(),
  useTools: z.boolean().default(true),
  maxToolRounds: z.number().int().min(0).max(5).default(2),
  conversationId: z.string().uuid().optional(),
  approveDestructive: z.boolean().default(false),
});

app.post("/agent/chat", async (c) => {
  const cfg = await loadConfig();
  const body = agentChatSchema.parse(await c.req.json());
  const [ws] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.slug, body.workspaceSlug))
    .limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);

  const memRows = await db.select().from(memories).where(eq(memories.workspaceId, ws.id));

  let priorMessages: Array<{ role: "user" | "assistant"; content: string }> = [];
  let conversationId = body.conversationId;
  if (conversationId) {
    const [conv] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, conversationId), eq(conversations.workspaceId, ws.id)))
      .limit(1);
    if (!conv) return c.json({ error: "conversation_not_found" }, 404);
    const hist = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
    priorMessages = hist.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));
  }

  const result = await runAgent({
    workspaceName: ws.name,
    workspaceSlug: ws.slug,
    message: body.message,
    priorMessages,
    memories: memRows.map((m) => ({ kind: m.kind, title: m.title, content: m.content })),
    budgetTokens: body.budgetTokens ?? Math.min(cfg.defaultContextBudget, 2000),
    useTools: body.useTools,
    maxToolRounds: body.maxToolRounds,
    approveDestructive: body.approveDestructive,
    model: body.model,
    mcpHost,
    providers,
    secrets,
    isToolPreApproved: (server, tool) => isToolApproved(ws.id, server, tool),
    onGovernanceBlocked: async (spec, reason) => {
      const row = await createApprovalRequest({
        workspaceId: ws.id,
        server: spec.server,
        tool: spec.tool,
        arguments: spec.arguments,
        reason,
      });
      return { approvalId: row.id };
    },
  });

  if (!conversationId) {
    const [conv] = await db
      .insert(conversations)
      .values({
        workspaceId: ws.id,
        title: body.message.slice(0, 80),
      })
      .returning();
    conversationId = conv.id;
  }
  await db.insert(messages).values([
    { conversationId, role: "user", content: body.message },
    {
      conversationId,
      role: "assistant",
      content: result.reply,
      meta: {
        provider: result.provider,
        model: result.model,
        offline: result.offline,
        toolTrace: result.toolTrace,
      },
    },
  ]);
  await db
    .update(conversations)
    .set({
      updatedAt: new Date(),
      title: deriveConversationTitle(body.message, result.reply),
    })
    .where(eq(conversations.id, conversationId));

  return c.json({
    conversationId,
    reply: result.reply,
    provider: result.provider,
    model: result.model,
    offline: result.offline ?? false,
    toolMode: result.toolMode,
    toolTrace: result.toolTrace,
    pendingApprovals: result.pendingApprovals,
    selectedTools: result.selectedTools,
    nativeRounds: result.nativeRounds,
    bundle: {
      id: result.bundleId,
      usedTokens: result.usedTokens,
      pinnedMemories: result.pinnedMemories,
    },
  });
});

app.post("/agent/chat/stream", async (c) => {
  const cfg = await loadConfig();
  const body = z
    .object({
      workspaceSlug: z.string().min(1),
      message: z.string().min(1),
      model: z.string().optional(),
      useTools: z.boolean().default(false),
      maxToolRounds: z.number().int().min(0).max(5).default(2),
      approveDestructive: z.boolean().default(false),
    })
    .parse(await c.req.json());
  const [ws] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.slug, body.workspaceSlug))
    .limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);

  const memRows = await db.select().from(memories).where(eq(memories.workspaceId, ws.id));

  if (body.useTools) {
    const stream = new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder();
        const send = (obj: unknown) => {
          controller.enqueue(enc.encode(`data: ${JSON.stringify(obj)}\n\n`));
        };
        try {
          for await (const ev of runAgentStream({
            workspaceName: ws.name,
            workspaceSlug: ws.slug,
            message: body.message,
            memories: memRows.map((m) => ({ kind: m.kind, title: m.title, content: m.content })),
            budgetTokens: Math.min(cfg.defaultContextBudget, 2000),
            useTools: true,
            maxToolRounds: body.maxToolRounds,
            approveDestructive: body.approveDestructive,
            model: body.model,
            mcpHost,
            providers,
            secrets,
            isToolPreApproved: (server, tool) => isToolApproved(ws.id, server, tool),
            onGovernanceBlocked: async (spec, reason) => {
              const row = await createApprovalRequest({
                workspaceId: ws.id,
                server: spec.server,
                tool: spec.tool,
                arguments: spec.arguments,
                reason,
              });
              return { approvalId: row.id };
            },
          })) {
            send(ev);
          }
        } catch (err) {
          send({ type: "error", text: String(err) });
        } finally {
          controller.close();
        }
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  const pins = memRows.slice(0, 12).map((m) => ({
    source: `memory:${m.kind}:${m.title}`,
    content: `${m.title}\n${m.content}`,
  }));
  const bundle = packContext({
    budgetTokens: Math.min(cfg.defaultContextBudget, 1500),
    pins,
    items: [{ source: "user", content: body.message }],
  });
  const packedText = bundle.chunks
    .filter((ch) => !ch.dropped && ch.content)
    .map((ch) => `[${ch.source}]\n${ch.content}`)
    .join("\n\n");

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (obj: unknown) => {
        controller.enqueue(enc.encode(`data: ${JSON.stringify(obj)}\n\n`));
      };
      try {
        for await (const ev of providers.streamChat({
          system: `DEVAIOS assistant for ${ws.slug}`,
          user: `${packedText}\n\nUser: ${body.message}`,
          model: body.model,
        })) {
          send(ev);
        }
      } catch (err) {
        send({ type: "error", text: String(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
});

app.get("/workspaces/:slug/conversations", async (c) => {
  const slug = c.req.param("slug");
  const q = c.req.query("q")?.trim();
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);

  let rows = await db
    .select()
    .from(conversations)
    .where(eq(conversations.workspaceId, ws.id))
    .orderBy(desc(conversations.updatedAt));

  if (q) {
    const hits = await searchConversations(ws.id, q);
    return c.json({
      conversations: hits.map((r) => ({
        id: r.id,
        title: r.title,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        matchSource: r.matchSource,
      })),
    });
  }

  return c.json({
    conversations: rows.map((r) => ({
      id: r.id,
      title: r.title,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
  });
});

app.get("/workspaces/:slug/export/conversations", async (c) => {
  const slug = c.req.param("slug");
  const save = c.req.query("save") === "1";
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);
  const data = await exportWorkspaceConversations(ws.id, ws.slug);
  if (save) {
    const path = await writeConversationExportFile(data, home);
    return c.json({ export: data, path });
  }
  return c.json({ export: data });
});

const importConversationsSchema = z.object({
  path: z.string().optional(),
  dedupeByTitle: z.boolean().default(false),
  export: z
    .object({
      exportedAt: z.string().optional(),
      workspaceId: z.string().optional(),
      workspaceSlug: z.string().optional(),
      conversations: z.array(z.record(z.unknown())).default([]),
    })
    .optional(),
});

app.post("/workspaces/:slug/import/conversations", async (c) => {
  const slug = c.req.param("slug");
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);
  const body = importConversationsSchema.parse(await c.req.json().catch(() => ({})));
  const options = { dedupeByTitle: body.dedupeByTitle };
  let result;
  if (body.path) {
    result = await importConversationExportFromFile(ws.id, body.path, options);
  } else if (body.export) {
    result = await importConversationExport(ws.id, body.export as Parameters<typeof importConversationExport>[1], options);
  } else {
    return c.json({ error: "path_or_export_required" }, 400);
  }
  return c.json({ ok: true, ...result });
});

app.post("/import/conversations/archive/preview", async (c) => {
  const body = z
    .object({
      path: z.string().min(1),
      slugMap: z.record(z.string(), z.string()).optional(),
      workspaceSlugs: z.array(z.string()).optional(),
      conversationIds: z.array(z.string()).optional(),
      conflictPolicy: z.enum(["skip", "replace"]).optional(),
      passphrase: z.string().optional(),
    })
    .parse(await c.req.json());
  try {
    const preview = await previewConversationArchiveImport(
      body.path,
      {
        slugMap: body.slugMap,
        workspaceSlugs: body.workspaceSlugs,
        conversationIds: body.conversationIds,
        conflictPolicy: body.conflictPolicy,
      },
      body.passphrase,
    );
    return c.json({ ok: true, preview });
  } catch (err) {
    const msg = String(err);
    if (msg.includes("archive_passphrase_required")) {
      return c.json({ error: "passphrase_required" }, 400);
    }
    if (msg.includes("archive_signature_invalid")) {
      return c.json({ error: "signature_invalid" }, 400);
    }
    throw err;
  }
});

app.post("/import/conversations/archive/preview/export", async (c) => {
  const body = z
    .object({
      path: z.string().min(1),
      slugMap: z.record(z.string(), z.string()).optional(),
      workspaceSlugs: z.array(z.string()).optional(),
      conversationIds: z.array(z.string()).optional(),
      conflictPolicy: z.enum(["skip", "replace"]).optional(),
      passphrase: z.string().optional(),
      selectedDiffIds: z.array(z.string()).optional(),
    })
    .parse(await c.req.json());
  try {
    const preview = await previewConversationArchiveImport(
      body.path,
      {
        slugMap: body.slugMap,
        workspaceSlugs: body.workspaceSlugs,
        conversationIds: body.conversationIds,
        conflictPolicy: body.conflictPolicy,
      },
      body.passphrase,
    );
    const exportPath = await writeArchiveImportDiffExport(
      preview,
      {
        path: body.path,
        workspaceSlugs: body.workspaceSlugs ?? null,
        conversationIds: body.conversationIds ?? null,
        conflictPolicy: preview.conflictPolicy,
        selectedDiffIds:
          body.selectedDiffIds ??
          (body.conversationIds?.length ?
            preview.workspaces.flatMap((ws) =>
              (ws.conversations ?? [])
                .filter((c) => body.conversationIds?.includes(c.id))
                .map((c) => `${ws.slug}:${c.id}`),
            )
          : null),
      },
      home,
    );
    return c.json({
      ok: true,
      path: exportPath,
      diffCount: preview.totals.wouldInsert + preview.totals.wouldSkip + preview.totals.wouldReplace,
    });
  } catch (err) {
    const msg = String(err);
    if (msg.includes("archive_passphrase_required")) {
      return c.json({ error: "passphrase_required" }, 400);
    }
    if (msg.includes("archive_signature_invalid")) {
      return c.json({ error: "signature_invalid" }, 400);
    }
    throw err;
  }
});

app.post("/import/conversations/archive/from-diff/preview", async (c) => {
  const body = z
    .object({
      diffPath: z.string().min(1),
      diffIds: z.array(z.string()).optional(),
      selectedOnly: z.boolean().default(true),
      slugMap: z.record(z.string(), z.string()).optional(),
      passphrase: z.string().optional(),
    })
    .parse(await c.req.json());
  try {
    const preview = await previewArchiveImportFromDiffFile(body.diffPath, {
      diffIds: body.diffIds,
      selectedOnly: body.selectedOnly,
      slugMap: body.slugMap,
      passphrase: body.passphrase,
    });
    return c.json({ ok: true, preview });
  } catch (err) {
    const msg = String(err);
    if (msg.includes("archive_diff_invalid")) return c.json({ error: "diff_invalid" }, 400);
    if (msg.includes("archive_passphrase_required")) return c.json({ error: "passphrase_required" }, 400);
    if (msg.includes("archive_signature_invalid")) return c.json({ error: "signature_invalid" }, 400);
    throw err;
  }
});

app.post("/import/conversations/archive/from-diff/save-selection", async (c) => {
  const body = z
    .object({
      diffPath: z.string().min(1),
      diffIds: z.array(z.string()),
    })
    .parse(await c.req.json());
  try {
    const result = await saveArchiveImportDiffSelection(body.diffPath, body.diffIds);
    return c.json({ ok: true, ...result });
  } catch (err) {
    const msg = String(err);
    if (msg.includes("archive_diff_invalid")) return c.json({ error: "diff_invalid" }, 400);
    throw err;
  }
});

app.post("/import/conversations/archive/from-diff/merge/preview", async (c) => {
  const body = z
    .object({
      diffPaths: z.array(z.string().min(1)).min(2),
      allowMixedArchives: z.boolean().default(false),
      rowLimit: z.number().int().min(1).max(500).optional(),
      actionFilter: z.enum(["insert", "skip", "replace"]).optional(),
      actionFilters: z.array(z.enum(["insert", "skip", "replace"])).optional(),
    })
    .parse(await c.req.json());
  try {
    const preview = await previewArchiveImportDiffMerge(body.diffPaths, {
      allowMixedArchives: body.allowMixedArchives,
      rowLimit: body.rowLimit,
      actionFilter: body.actionFilter,
      actionFilters: body.actionFilters,
    });
    return c.json({ ok: true, preview });
  } catch (err) {
    const msg = String(err);
    if (msg.includes("archive_diff_merge_requires_two")) return c.json({ error: "merge_requires_two" }, 400);
    if (msg.includes("archive_diff_merge_archive_conflict")) {
      const paths = msg.split("archive_diff_merge_archive_conflict:")[1]?.split("|").filter(Boolean) ?? [];
      return c.json({ error: "merge_archive_conflict", archivePaths: paths }, 409);
    }
    if (msg.includes("archive_diff_invalid")) return c.json({ error: "diff_invalid" }, 400);
    throw err;
  }
});

app.post("/import/conversations/archive/from-diff/merge", async (c) => {
  const body = z
    .object({
      diffPaths: z.array(z.string().min(1)).min(2),
      allowMixedArchives: z.boolean().default(false),
      selectedDiffIds: z.array(z.string()).optional(),
    })
    .parse(await c.req.json());
  try {
    const result = await mergeArchiveImportDiffFiles(body.diffPaths, home, {
      allowMixedArchives: body.allowMixedArchives,
      selectedDiffIds: body.selectedDiffIds,
    });
    return c.json({ ok: true, ...result });
  } catch (err) {
    const msg = String(err);
    if (msg.includes("archive_diff_merge_requires_two")) return c.json({ error: "merge_requires_two" }, 400);
    if (msg.includes("archive_diff_merge_no_selection")) return c.json({ error: "merge_no_selection" }, 400);
    if (msg.includes("archive_diff_merge_archive_conflict")) {
      const paths = msg.split("archive_diff_merge_archive_conflict:")[1]?.split("|").filter(Boolean) ?? [];
      return c.json({ error: "merge_archive_conflict", archivePaths: paths }, 409);
    }
    if (msg.includes("archive_diff_invalid")) return c.json({ error: "diff_invalid" }, 400);
    throw err;
  }
});

app.post("/import/conversations/archive/from-diff", async (c) => {
  const body = z
    .object({
      diffPath: z.string().min(1),
      diffIds: z.array(z.string()).optional(),
      selectedOnly: z.boolean().default(true),
      dedupeByTitle: z.boolean().default(false),
      slugMap: z.record(z.string(), z.string()).optional(),
      passphrase: z.string().optional(),
    })
    .parse(await c.req.json());
  try {
    const result = await importArchiveFromDiffFile(body.diffPath, {
      diffIds: body.diffIds,
      selectedOnly: body.selectedOnly,
      dedupeByTitle: body.dedupeByTitle,
      slugMap: body.slugMap,
      passphrase: body.passphrase,
    });
    return c.json({ ok: true, ...result });
  } catch (err) {
    const msg = String(err);
    if (msg.includes("archive_diff_invalid")) return c.json({ error: "diff_invalid" }, 400);
    if (msg.includes("archive_passphrase_required")) return c.json({ error: "passphrase_required" }, 400);
    if (msg.includes("archive_signature_invalid")) return c.json({ error: "signature_invalid" }, 400);
    throw err;
  }
});

app.post("/import/conversations/archive", async (c) => {
  const body = z
    .object({
      path: z.string().min(1),
      dedupeByTitle: z.boolean().default(false),
      slugMap: z.record(z.string(), z.string()).optional(),
      workspaceSlugs: z.array(z.string()).optional(),
      conversationIds: z.array(z.string()).optional(),
      conflictPolicy: z.enum(["skip", "replace"]).optional(),
      passphrase: z.string().optional(),
    })
    .parse(await c.req.json());
  try {
    const result = await importConversationArchive(body.path, {
      dedupeByTitle: body.dedupeByTitle,
      slugMap: body.slugMap,
      workspaceSlugs: body.workspaceSlugs,
      conversationIds: body.conversationIds,
      conflictPolicy: body.conflictPolicy,
    }, body.passphrase);
    return c.json({ ok: true, ...result, selectedSlugs: body.workspaceSlugs ?? null });
  } catch (err) {
    const msg = String(err);
    if (msg.includes("archive_passphrase_required")) {
      return c.json({ error: "passphrase_required" }, 400);
    }
    if (msg.includes("archive_signature_invalid")) {
      return c.json({ error: "signature_invalid" }, 400);
    }
    throw err;
  }
});

app.post("/workspaces/:slug/conversations/merge-duplicates", async (c) => {
  const slug = c.req.param("slug");
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);
  const result = await mergeDuplicateConversationsByTitle(ws.id);
  return c.json({ ok: true, ...result });
});

app.get("/export/conversations/archive", async (c) => {
  const save = c.req.query("save") === "1";
  const encrypt = c.req.query("encrypt") === "1";
  const sign = c.req.query("sign") === "1";
  const passphrase = c.req.query("passphrase") ?? undefined;
  const archive = await exportAllWorkspacesArchive();
  if (save) {
    const result = await writeArchiveFile(archive, home, { encrypt, sign, passphrase });
    return c.json({ archive, ...result });
  }
  return c.json({ archive });
});

app.post("/export/conversations/archive", async (c) => {
  const body = z
    .object({
      save: z.boolean().default(true),
      encrypt: z.boolean().default(false),
      sign: z.boolean().default(false),
      passphrase: z.string().optional(),
    })
    .parse(await c.req.json().catch(() => ({})));
  const archive = await exportAllWorkspacesArchive();
  if (!body.save) return c.json({ archive });
  const result = await writeArchiveFile(archive, home, {
    encrypt: body.encrypt,
    sign: body.sign,
    passphrase: body.passphrase,
  });
  return c.json({ archive, ...result });
});

app.post("/export/conversations/archive/async", async (c) => {
  const body = z
    .object({
      encrypt: z.boolean().default(false),
      sign: z.boolean().default(false),
      passphrase: z.string().optional(),
    })
    .parse(await c.req.json().catch(() => ({})));
  const job = await enqueueArchiveExport(async () => {
    const archive = await exportAllWorkspacesArchive();
    const result = await writeArchiveFile(archive, home, {
      encrypt: body.encrypt,
      sign: body.sign,
      passphrase: body.passphrase,
    });
    return result;
  });
  return c.json({ job: mapJob(job) }, 202);
});

app.post("/export/conversations/archive/verify", async (c) => {
  const body = z.object({ path: z.string().min(1) }).parse(await c.req.json());
  const raw = JSON.parse(await readFile(body.path, "utf8")) as unknown;
  if (!isSignedArchive(raw)) {
    return c.json({ ok: false, signed: false, error: "not_signed" }, 400);
  }
  const valid = verifySignedArchive(raw);
  const payload = raw.payload;
  return c.json({
    ok: valid,
    signed: true,
    algorithm: raw.algorithm,
    signedAt: raw.signedAt,
    encrypted: payload && typeof payload === "object" && "encrypted" in payload,
  });
});

app.get("/export/conversations/archive/retention", async (c) => {
  return c.json({ retention: await loadArchiveRetention(home) });
});

app.post("/export/conversations/archive/retention", async (c) => {
  const body = z
    .object({
      maxCount: z.number().int().min(1).max(500).optional(),
      maxAgeDays: z.number().int().min(0).max(3650).optional(),
    })
    .parse(await c.req.json());
  const retention = await saveArchiveRetention(body, home);
  return c.json({ retention });
});

app.post("/export/conversations/archive/retention/rotate", async (c) => {
  const retention = await loadArchiveRetention(home);
  const rotation = await rotateArchives(home, retention);
  return c.json({ ok: true, retention, rotation });
});

app.get("/export/conversations/archive/schedule", async (c) => {
  return c.json({ schedule: await loadArchiveExportSchedule(home) });
});

app.post("/export/conversations/archive/schedule", async (c) => {
  const body = z
    .object({
      enabled: z.boolean().optional(),
      intervalMinutes: z.number().int().min(1).max(52_560).optional(),
    })
    .parse(await c.req.json());
  const schedule = await saveArchiveExportSchedule(body, home);
  return c.json({ schedule });
});

app.get("/workspaces/:slug/approvals", async (c) => {
  const slug = c.req.param("slug");
  const status = c.req.query("status");
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);
  const rows = await listApprovalRequests(ws.id, status);
  return c.json({
    approvals: rows.map((r) => ({
      id: r.id,
      status: r.status,
      server: r.server,
      tool: r.tool,
      arguments: r.arguments,
      reason: r.reason,
      createdAt: r.createdAt.toISOString(),
      resolvedAt: r.resolvedAt?.toISOString() ?? null,
    })),
  });
});

app.post("/workspaces/:slug/approvals/:id/approve", async (c) => {
  const slug = c.req.param("slug");
  const id = c.req.param("id");
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);
  const row = await resolveApprovalRequest(id, ws.id, "approved");
  if (!row) return c.json({ error: "not_found" }, 404);
  return c.json({
    approval: {
      id: row.id,
      status: row.status,
      server: row.server,
      tool: row.tool,
      resolvedAt: row.resolvedAt?.toISOString() ?? null,
    },
  });
});

app.post("/workspaces/:slug/approvals/:id/reject", async (c) => {
  const slug = c.req.param("slug");
  const id = c.req.param("id");
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);
  const row = await resolveApprovalRequest(id, ws.id, "rejected");
  if (!row) return c.json({ error: "not_found" }, 404);
  return c.json({
    approval: {
      id: row.id,
      status: row.status,
      server: row.server,
      tool: row.tool,
      resolvedAt: row.resolvedAt?.toISOString() ?? null,
    },
  });
});

app.get("/conversations/:id/messages", async (c) => {
  const id = c.req.param("id");
  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(messages.createdAt);
  return c.json({
    messages: rows.map((r) => ({
      id: r.id,
      role: r.role,
      content: r.content,
      meta: r.meta,
      createdAt: r.createdAt.toISOString(),
    })),
  });
});

app.post("/mcp/echo/register", async (c) => {
  const server = await mcpHost.ensureEchoRegistered();
  return c.json({ server }, 201);
});

app.post("/mcp/graphify/register", async (c) => {
  const result = await registerGraphifyHelper(mcpHost);
  return c.json(result, result.ok ? 201 : 404);
});

app.get("/secrets", async (c) => {
  return c.json({
    secrets: await secrets.listNames(),
    backend: secrets.getBackend(),
    keychainAvailable: secrets.isKeychainAvailable(),
  });
});

const secretSetSchema = z.object({
  name: z.string().min(1).max(120),
  value: z.string().min(1),
});

app.post("/secrets", async (c) => {
  const body = secretSetSchema.parse(await c.req.json());
  await secrets.set(body.name, body.value);
  return c.json({ ok: true, name: body.name }, 201);
});

app.get("/secrets/:name", async (c) => {
  const value = await secrets.get(c.req.param("name"));
  if (value === null) return c.json({ error: "not_found" }, 404);
  return c.json({ name: c.req.param("name"), value });
});

app.delete("/secrets/:name", async (c) => {
  const ok = await secrets.remove(c.req.param("name"));
  if (!ok) return c.json({ error: "not_found" }, 404);
  return c.json({ ok: true });
});

const memorySchema = z.object({
  kind: z.enum(["note", "decision", "fact", "architecture"]).default("note"),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
});

app.get("/workspaces/:slug/memories", async (c) => {
  const slug = c.req.param("slug");
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);
  const rows = await db.select().from(memories).where(eq(memories.workspaceId, ws.id));
  return c.json({ memories: rows.map(mapMemory) });
});

app.post("/workspaces/:slug/memories", async (c) => {
  const slug = c.req.param("slug");
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);
  const body = memorySchema.parse(await c.req.json());
  const [row] = await db
    .insert(memories)
    .values({
      workspaceId: ws.id,
      kind: body.kind,
      title: body.title,
      content: body.content,
    })
    .returning();
  return c.json({ memory: mapMemory(row) }, 201);
});

app.delete("/workspaces/:slug/memories/:id", async (c) => {
  const slug = c.req.param("slug");
  const id = c.req.param("id");
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);
  const deleted = await db
    .delete(memories)
    .where(and(eq(memories.workspaceId, ws.id), eq(memories.id, id)))
    .returning();
  if (!deleted.length) return c.json({ error: "not_found" }, 404);
  return c.json({ ok: true });
});

app.get("/providers", async (c) => {
  return c.json({ providers: await providers.list() });
});

app.get("/workspaces/:slug/job-templates", async (c) => {
  const slug = c.req.param("slug");
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);
  const templates = await listWorkspaceJobTemplates(slug, home);
  return c.json({ workspaceSlug: slug, templates });
});

app.post("/workspaces/:slug/job-templates", async (c) => {
  const slug = c.req.param("slug");
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);
  const body = z
    .object({
      templates: z
        .array(
          z.object({
            id: z.string().min(1),
            kind: z.enum(["backup", "archive_export", "batch_restore"]),
            label: z.string().min(1),
            intervalMinutes: z.number().int().min(1).max(525_600),
            encrypt: z.boolean().optional(),
            sign: z.boolean().optional(),
            enabled: z.boolean(),
            windowStartHour: z.number().int().min(0).max(23).nullable().optional(),
            windowEndHour: z.number().int().min(0).max(23).nullable().optional(),
            passphrase: z.string().nullable().optional(),
            conflictPolicy: z.enum(["skip", "replace"]).optional(),
            dryRunBeforeApply: z.boolean().optional(),
          }),
        )
        .optional(),
      useDefaults: z.boolean().default(false),
    })
    .parse(await c.req.json());
  const templates = body.useDefaults ? defaultJobTemplates() : (body.templates ?? []);
  const saved = await saveWorkspaceJobTemplates(slug, templates, home);
  return c.json({ ok: true, ...saved });
});

app.post("/workspaces/:slug/job-templates/run", async (c) => {
  const slug = c.req.param("slug");
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);
  const body = z.object({ force: z.boolean().default(true) }).parse(await c.req.json().catch(() => ({})));
  const result = await runWorkspaceJobTemplates(slug, createJobTemplateRunners(), home, { force: body.force });
  return c.json({ ok: true, workspaceSlug: slug, ...result });
});

app.get("/job-templates/run-state", async (c) => {
  const workspace = c.req.query("workspace") ?? undefined;
  return c.json({ runs: await listTemplateRunState(home, workspace) });
});

app.get("/job-templates/notifications", async (c) => {
  const workspaceSlug = c.req.query("workspace") ?? undefined;
  const unreadOnly = c.req.query("unread") === "1";
  const notifications = await listTemplateRunNotifications(home, { workspaceSlug, unreadOnly });
  return c.json({ notifications, unread: notifications.filter((n) => !n.read).length });
});

app.post("/job-templates/notifications/read", async (c) => {
  const body = z
    .object({
      ids: z.array(z.string()).optional(),
      workspace: z.string().optional(),
      all: z.boolean().default(false),
    })
    .parse(await c.req.json().catch(() => ({})));
  const result = await markTemplateRunNotificationsRead(home, {
    ids: body.ids,
    workspaceSlug: body.workspace,
    all: body.all,
  });
  return c.json({ ok: true, ...result });
});

app.post("/job-templates/notifications/dry-run/export", async (c) => {
  const body = z
    .object({
      ids: z.array(z.string()).optional(),
      limit: z.number().int().min(1).max(500).optional(),
      workspaceSlug: z.string().min(1).optional(),
      templateId: z.string().min(1).optional(),
      since: z.string().optional(),
      until: z.string().optional(),
      presetRange: z.enum(["24h", "7d", "30d"]).optional(),
    })
    .parse(await c.req.json().catch(() => ({})));
  const result = await exportTemplateRunDryRunDetails(home, body);
  return c.json({ ok: true, ...result });
});

app.post("/job-templates/notifications/dry-run/preview-filters", async (c) => {
  const body = z
    .object({
      workspaceSlug: z.string().min(1).optional(),
      templateId: z.string().min(1).optional(),
      since: z.string().optional(),
      until: z.string().optional(),
      presetRange: z.enum(["24h", "7d", "30d"]).optional(),
      limit: z.number().int().min(1).max(500).optional(),
    })
    .parse(await c.req.json().catch(() => ({})));
  const preview = await previewTemplateRunDryRunExportFilters(home, body);
  return c.json({ ok: true, ...preview });
});

app.get("/job-templates/notifications/webhook", async (c) => {
  const config = await loadTemplateNotificationWebhook(home);
  return c.json({ webhook: config });
});

app.post("/job-templates/notifications/webhook", async (c) => {
  const body = z
    .object({
      enabled: z.boolean(),
      url: z.string().nullable(),
      maxRetries: z.number().int().min(1).max(10).optional(),
    })
    .parse(await c.req.json());
  const webhook = await saveTemplateNotificationWebhook(
    {
      enabled: body.enabled,
      url: body.url,
      maxRetries: body.maxRetries ?? 3,
    },
    home,
  );
  return c.json({ ok: true, webhook });
});

app.get("/job-templates/notifications/webhook/dead-letter", async (c) => {
  const limit = Number(c.req.query("limit") ?? "50");
  const entries = await listWebhookDeadLetters(home, limit);
  return c.json({ entries, count: entries.length });
});

app.post("/job-templates/notifications/webhook/dead-letter/replay", async (c) => {
  const body = z
    .object({
      ids: z.array(z.string()).optional(),
      all: z.boolean().default(false),
      limit: z.number().int().min(1).max(50).optional(),
    })
    .parse(await c.req.json().catch(() => ({})));
  const result = await replayWebhookDeadLetters(home, body);
  return c.json({ ok: true, ...result });
});

app.post("/job-templates/notifications/webhook/dead-letter/delete", async (c) => {
  const body = z
    .object({
      ids: z.array(z.string()).optional(),
      all: z.boolean().default(false),
    })
    .parse(await c.req.json().catch(() => ({})));
  const result = await deleteWebhookDeadLetters(home, body);
  return c.json({ ok: true, ...result });
});

app.post("/job-templates/notifications/webhook/dead-letter/export", async (c) => {
  const body = z
    .object({
      ids: z.array(z.string()).optional(),
      limit: z.number().int().min(1).max(200).optional(),
    })
    .parse(await c.req.json().catch(() => ({})));
  const result = await exportWebhookDeadLetters(home, body);
  return c.json({ ok: true, ...result });
});

app.post("/job-templates/notifications/webhook/dead-letter/import", async (c) => {
  const body = z
    .object({
      path: z.string().min(1),
      merge: z.boolean().default(true),
    })
    .parse(await c.req.json());
  try {
    const result = await importWebhookDeadLettersFromFile(body.path, home, { merge: body.merge });
    return c.json({ ok: true, ...result });
  } catch (err) {
    const msg = String(err);
    if (msg.includes("dead_letter_export_invalid")) return c.json({ error: "export_invalid" }, 400);
    throw err;
  }
});

app.post("/job-templates/notifications/webhook/dead-letter/import-replay", async (c) => {
  const body = z.object({ path: z.string().min(1) }).parse(await c.req.json());
  try {
    const result = await importAndReplayWebhookDeadLettersFromFile(body.path, home);
    return c.json({ ok: true, ...result });
  } catch (err) {
    const msg = String(err);
    if (msg.includes("dead_letter_export_invalid")) return c.json({ error: "export_invalid" }, 400);
    throw err;
  }
});

app.get("/job-templates/notifications/email", async (c) => {
  const email = await loadTemplateNotificationEmail(home);
  return c.json({ email });
});

app.post("/job-templates/notifications/email", async (c) => {
  const body = z
    .object({
      enabled: z.boolean(),
      from: z.string().nullable(),
      to: z.string().nullable(),
      smtpHost: z.string().nullable(),
      smtpPort: z.number().int().min(1).max(65535).nullable(),
      useOutbox: z.boolean().default(true),
      sendViaSmtp: z.boolean().default(false),
      smtpSecure: z.boolean().default(false),
      smtpUser: z.string().nullable().optional(),
      smtpPass: z.string().nullable().optional(),
    })
    .parse(await c.req.json());
  const email = await saveTemplateNotificationEmail(
    {
      ...body,
      smtpUser: body.smtpUser ?? null,
      smtpPass: body.smtpPass ?? null,
    },
    home,
  );
  return c.json({ ok: true, email });
});

app.get("/job-templates/notifications/email/outbox", async (c) => {
  const limit = Number(c.req.query("limit") ?? "20");
  const outbox = await listEmailOutbox(home, limit);
  return c.json({ outbox, count: outbox.length });
});

app.get("/job-templates/notifications/email/delivery-log", async (c) => {
  const limit = Number(c.req.query("limit") ?? "50");
  const channel = c.req.query("channel");
  const status = c.req.query("status");
  const entries = await listEmailDeliveryLog(
    home,
    limit,
    {
      channel:
        channel === "outbox" || channel === "smtp" ?
          channel
        : undefined,
      status:
        status === "written" || status === "sent" || status === "failed" || status === "skipped" ?
          status
        : undefined,
    },
  );
  return c.json({ entries, count: entries.length });
});

app.get("/job-templates/notifications/email/delivery-retention", async (c) => {
  const policy = await loadEmailDeliveryRetention(home);
  return c.json({ policy });
});

app.post("/job-templates/notifications/email/delivery-retention", async (c) => {
  const body = z
    .object({
      maxCount: z.number().int().min(1).max(5000).optional(),
      maxAgeDays: z.number().int().min(1).max(3650).optional(),
      rotateIntervalHours: z.number().int().min(1).max(720).optional(),
      rotationHistoryMaxCount: z.number().int().min(1).max(1000).optional(),
      rotationHistoryMaxAgeDays: z.number().int().min(1).max(3650).optional(),
    })
    .parse(await c.req.json());
  const policy = await saveEmailDeliveryRetention(body, home);
  return c.json({ ok: true, policy });
});

app.post("/job-templates/notifications/email/delivery-log/rotate", async (c) => {
  const body = z
    .object({
      maxCount: z.number().int().min(1).max(5000).optional(),
      maxAgeDays: z.number().int().min(1).max(3650).optional(),
    })
    .parse(await c.req.json().catch(() => ({})));
  const result = await rotateEmailDeliveryLog(home, body, { trigger: "manual" });
  return c.json({ ok: true, ...result });
});

app.get("/job-templates/notifications/email/delivery-log/rotation-history", async (c) => {
  const limit = Number(c.req.query("limit") ?? "20");
  const entries = await listEmailDeliveryRotationHistory(home, limit);
  return c.json({ entries, count: entries.length });
});

app.post("/job-templates/notifications/email/delivery-log/rotation-history/rotate", async (c) => {
  const result = await rotateEmailDeliveryRotationHistory(home);
  return c.json({ ok: true, ...result });
});

app.post("/job-templates/notifications/email/delivery-log/rotation-history/export", async (c) => {
  const body = z
    .object({ limit: z.number().int().min(1).max(5000).optional() })
    .parse(await c.req.json().catch(() => ({})));
  const result = await exportEmailDeliveryRotationHistoryCsv(home, body.limit ?? 500);
  return c.json({ ok: true, ...result });
});

app.get("/job-templates/notifications/email/delivery-log/rotation-history/integrity", async (c) => {
  const result = await checkEmailDeliveryRotationIntegrity(home);
  return c.json(result);
});

app.post("/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair", async (c) => {
  const result = await repairEmailDeliveryRotationIntegrity(home);
  return c.json(result);
});

app.get("/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit", async (c) => {
  const limit = Number(c.req.query("limit") ?? "20");
  const entries = await listRotationRepairAudit(home, limit);
  return c.json({ entries, count: entries.length });
});

app.post("/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/export", async (c) => {
  const body = z
    .object({ limit: z.number().int().min(1).max(5000).optional() })
    .parse(await c.req.json().catch(() => ({})));
  const result = await exportRotationRepairAuditCsv(home, body.limit ?? 500);
  return c.json({ ok: true, ...result });
});

app.get("/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/retention", async (c) => {
  const policy = await loadRotationRepairAuditRetention(home);
  const defaults = ROTATION_REPAIR_AUDIT_RETENTION_DEFAULTS;
  return c.json({
    policy,
    defaults,
    matchesDefaults: policy.maxCount === defaults.maxCount && policy.maxAgeDays === defaults.maxAgeDays,
  });
});

app.post("/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/retention", async (c) => {
  const body = z
    .object({
      maxCount: z.number().int().min(1).max(5000).optional(),
      maxAgeDays: z.number().int().min(1).max(3650).optional(),
    })
    .parse(await c.req.json());
  const policy = await saveRotationRepairAuditRetention(body, home);
  return c.json({ ok: true, ...policy });
});

app.post(
  "/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/retention/reset",
  async (c) => {
    const result = await resetRotationRepairAuditRetention(home);
    return c.json({ ok: true, ...result });
  },
);

app.post("/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/rotate", async (c) => {
  const body = z
    .object({
      maxCount: z.number().int().min(1).max(5000).optional(),
      maxAgeDays: z.number().int().min(1).max(3650).optional(),
    })
    .parse(await c.req.json().catch(() => ({})));
  const result = await rotateRotationRepairAudit(home, body);
  return c.json({ ok: true, ...result });
});

app.get("/job-templates/notifications/webhook/dead-letter/hash-index", async (c) => {
  const stats = await getDeadLetterHashIndexStats(home);
  return c.json(stats);
});

app.post("/job-templates/notifications/webhook/dead-letter/hash-index/rebuild", async (c) => {
  const result = await rebuildDeadLetterHashIndex(home);
  return c.json({ ok: true, ...result });
});

app.get("/job-templates/notifications/webhook/dead-letter/hash-index/integrity", async (c) => {
  const autoRebuild = c.req.query("autoRebuild") === "1" || c.req.query("autoRebuild") === "true";
  const result = await checkDeadLetterHashIndexIntegrity(home, { autoRebuild });
  return c.json(result);
});

app.post("/job-templates/notifications/email/delivery-log/rotate-on-tick", async (c) => {
  const result = await maybeRotateEmailDeliveryLogOnTick(home);
  return c.json({ ok: true, ...result });
});

app.get("/job-templates/notifications/stream", async (c) => {
  const workspaceSlug = c.req.query("workspace") ?? undefined;
  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (obj: unknown) => {
        controller.enqueue(enc.encode(`data: ${JSON.stringify(obj)}\n\n`));
      };
      const seen = new Set<string>();
      try {
        for (let i = 0; i < 300; i++) {
          const notifications = await listTemplateRunNotifications(home, {
            workspaceSlug,
            unreadOnly: true,
          });
          const fresh = notifications.filter((n) => !seen.has(n.id));
          for (const n of fresh) seen.add(n.id);
          if (fresh.length) {
            send({ type: "notifications", notifications: fresh, unread: notifications.length });
          } else {
            send({ type: "heartbeat", unread: notifications.length });
          }
          await new Promise((r) => setTimeout(r, 2000));
        }
      } catch (err) {
        send({ type: "error", text: String(err) });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
});

app.patch("/providers/:id", async (c) => {
  const body = z.object({ enabled: z.boolean() }).parse(await c.req.json());
  const id = c.req.param("id");
  if (body.enabled) {
    const gate = await canEnableProvider(id, home);
    if (!gate.allowed) {
      return c.json({ error: "cooldown_active", retryAt: gate.retryAt, reason: gate.reason }, 429);
    }
    await clearProviderCooldown(id, home);
  }
  const row = await providers.setEnabled(id, body.enabled);
  if (!row) return c.json({ error: "not_found" }, 404);
  return c.json({ provider: row });
});

app.get("/providers/cooldown", async (c) => {
  const state = await loadProviderCooldown(home);
  const now = Date.now();
  const active = Object.values(state.entries).filter((e) => new Date(e.retryAt).getTime() > now);
  return c.json({ cooldownMinutes: state.cooldownMinutes, entries: active });
});

app.post("/providers/cooldown", async (c) => {
  const body = z
    .object({ cooldownMinutes: z.number().int().min(1).max(10_080) })
    .parse(await c.req.json());
  const state = await saveProviderCooldownMinutes(body.cooldownMinutes, home);
  return c.json({ ok: true, cooldownMinutes: state.cooldownMinutes });
});

app.get("/providers/failover", async (c) => {
  return c.json({ order: await providers.getFailoverOrder() });
});

app.put("/providers/failover", async (c) => {
  const body = z
    .object({
      order: z.array(z.enum(["ollama", "openai", "anthropic"])).min(1),
    })
    .parse(await c.req.json());
  const order = await providers.setFailoverOrder(body.order);
  return c.json({ order });
});

app.post("/providers/failover/probe", async (c) => {
  const body = z
    .object({ autoDisable: z.boolean().default(false) })
    .parse(await c.req.json().catch(() => ({})));
  const openaiApiKey = (await secrets.get("OPENAI_API_KEY")) ?? undefined;
  const anthropicApiKey = (await secrets.get("ANTHROPIC_API_KEY")) ?? undefined;
  const probes = await providers.probeFailoverChain({ openaiApiKey, anthropicApiKey });
  const autoDisabled = body.autoDisable ? await providers.autoDisableFailedProbes(probes) : { disabled: [] };
  if (body.autoDisable) {
    for (const row of autoDisabled.disabled) {
      await recordProviderDisable(row.id, "probe_failed", home);
    }
  }
  return c.json({ order: await providers.getFailoverOrder(), probes, autoDisabled });
});

app.get("/providers/health", async (c) => {
  const openaiApiKey = (await secrets.get("OPENAI_API_KEY")) ?? undefined;
  const anthropicApiKey = (await secrets.get("ANTHROPIC_API_KEY")) ?? undefined;
  const order = await providers.getFailoverOrder();
  const probes = await providers.probeFailoverChain({ openaiApiKey, anthropicApiKey });
  const list = await providers.list();
  return c.json({
    order,
    probes,
    providers: list.map((p) => ({
      id: p.id,
      name: p.name,
      kind: p.kind,
      enabled: p.enabled,
    })),
    summary: {
      total: list.length,
      enabled: list.filter((p) => p.enabled).length,
      healthy: probes.filter((p) => p.ok).length,
    },
  });
});

app.post("/backup/export", async (c) => {
  const cfg = await loadConfig();
  const body = z
    .object({
      encrypt: z.boolean().default(false),
      sign: z.boolean().default(false),
      passphrase: z.string().optional(),
    })
    .parse(await c.req.json().catch(() => ({})));
  const result = await runBackupExport(cfg.home, mcpHost, providers, {
    encrypt: body.encrypt,
    sign: body.sign,
    passphrase: body.passphrase,
  });
  return c.json(result);
});

app.post("/backup/export/async", async (c) => {
  const cfg = await loadConfig();
  const body = z
    .object({
      encrypt: z.boolean().default(false),
      sign: z.boolean().default(false),
      passphrase: z.string().optional(),
    })
    .parse(await c.req.json().catch(() => ({})));
  const job = await enqueueBackupExport(cfg.home, mcpHost, providers, {
    encrypt: body.encrypt,
    sign: body.sign,
    passphrase: body.passphrase,
  });
  return c.json({ job: mapJob(job) }, 202);
});

app.get("/backup/schedule", async (c) => {
  return c.json({ schedule: await loadBackupSchedule(home) });
});

app.post("/backup/schedule", async (c) => {
  const body = z
    .object({
      enabled: z.boolean().optional(),
      intervalMinutes: z.number().int().min(1).max(10_080).optional(),
      encrypt: z.boolean().optional(),
      sign: z.boolean().optional(),
    })
    .parse(await c.req.json());
  const schedule = await saveBackupSchedule(body, home);
  return c.json({ schedule });
});

app.get("/backup/retention", async (c) => {
  return c.json({ retention: await loadBackupRetention(home) });
});

app.post("/backup/retention", async (c) => {
  const body = z
    .object({
      maxCount: z.number().int().min(1).max(500).optional(),
      maxAgeDays: z.number().int().min(0).max(3650).optional(),
    })
    .parse(await c.req.json());
  const retention = await saveBackupRetention(body, home);
  return c.json({ retention });
});

app.post("/backup/retention/rotate", async (c) => {
  const retention = await loadBackupRetention(home);
  const rotation = await rotateBackups(home, retention);
  return c.json({ ok: true, retention, rotation });
});

app.post("/backup/verify", async (c) => {
  const body = z.object({ path: z.string().min(1) }).parse(await c.req.json());
  const raw = JSON.parse(await readFile(body.path, "utf8")) as unknown;
  if (!isSignedBackup(raw)) {
    return c.json({ ok: false, signed: false, error: "not_signed" }, 400);
  }
  const valid = verifySignedBackup(raw);
  return c.json({
    ok: valid,
    signed: true,
    algorithm: raw.algorithm,
    signedAt: raw.signedAt,
    encrypted: raw.payload && typeof raw.payload === "object" && "encrypted" in raw.payload,
  });
});

const restoreSchema = z.object({
  path: z.string().min(1),
  passphrase: z.string().optional(),
  restoreMcp: z.boolean().default(true),
  restoreProviders: z.boolean().default(true),
  restoreApprovals: z.boolean().default(true),
  restoreJobs: z.boolean().default(false),
  workspaceSlugs: z.array(z.string()).optional(),
  scopedOnly: z.boolean().default(false),
  autoDetectScoped: z.boolean().default(true),
  conflictPolicy: z.enum(["skip", "replace"]).default("skip"),
  selectedDiffIds: z.array(z.string()).optional(),
});

app.get("/backup/inspect", async (c) => {
  const path = c.req.query("path");
  if (!path) return c.json({ error: "path_required" }, 400);
  const detectedSlug = detectScopedSlugFromBackupPath(path);
  return c.json({
    path,
    detectedSlug,
    suggestScopedOnly: Boolean(detectedSlug),
  });
});

app.get("/workspaces/:slug/backups/latest", async (c) => {
  const slug = c.req.param("slug");
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  if (!ws) return c.json({ error: "not_found" }, 404);
  const path = await findLatestScopedBackupPath(slug, home);
  return c.json({
    workspaceSlug: slug,
    path,
    detectedSlug: path ? detectScopedSlugFromBackupPath(path) : null,
  });
});

app.post("/backup/restore/batch", async (c) => {
  const body = z
    .object({
      workspaceSlugs: z.array(z.string()).min(1),
      autoDetectScoped: z.boolean().default(true),
      scopedOnly: z.boolean().default(false),
      conflictPolicy: z.enum(["skip", "replace"]).default("skip"),
      restoreApprovals: z.boolean().default(true),
      restoreJobs: z.boolean().default(false),
      passphrase: z.string().optional(),
    })
    .parse(await c.req.json());

  const results = await batchRestoreLatestScopedBackups(body.workspaceSlugs, home, {
    autoDetectScoped: body.autoDetectScoped,
    scopedOnly: body.scopedOnly,
    conflictPolicy: body.conflictPolicy,
    restoreApprovals: body.restoreApprovals,
    restoreJobs: body.restoreJobs,
    passphrase: body.passphrase,
  });

  return c.json({ ok: true, results });
});

app.post("/backup/restore/batch/preview", async (c) => {
  const body = z
    .object({
      workspaceSlugs: z.array(z.string()).min(1),
      autoDetectScoped: z.boolean().default(true),
      scopedOnly: z.boolean().default(false),
      conflictPolicy: z.enum(["skip", "replace"]).default("skip"),
      restoreApprovals: z.boolean().default(true),
      restoreJobs: z.boolean().default(false),
      passphrase: z.string().optional(),
    })
    .parse(await c.req.json());

  const results = await batchPreviewLatestScopedBackups(body.workspaceSlugs, home, {
    autoDetectScoped: body.autoDetectScoped,
    scopedOnly: body.scopedOnly,
    conflictPolicy: body.conflictPolicy,
    restoreApprovals: body.restoreApprovals,
    restoreJobs: body.restoreJobs,
    passphrase: body.passphrase,
  });

  return c.json({ ok: true, dryRun: true, results });
});

function restoreBundleErrorResponse(msg: string) {
  if (msg.includes("backup_passphrase_required")) return { error: "passphrase_required" as const };
  if (msg.includes("backup_signature_invalid")) return { error: "signature_invalid" as const };
  if (msg.includes("backup_not_scoped")) return { error: "backup_not_scoped" as const };
  if (msg.includes("backup_scoped_slug_missing")) return { error: "backup_scoped_slug_missing" as const };
  if (msg.includes("backup_scoped_slug_mismatch")) return { error: "backup_scoped_slug_mismatch" as const };
  return null;
}

async function loadRestoreBundle(body: z.infer<typeof restoreSchema>) {
  const bundle = await readBackupBundle(body.path, body.passphrase);
  const inferred = inferScopedRestoreOptions(body.path, {
    scopedOnly: body.scopedOnly,
    autoDetectScoped: body.autoDetectScoped,
    workspaceSlugs: body.workspaceSlugs,
  });
  const resolved = resolveScopedRestoreBundle(bundle, {
    scopedOnly: inferred.scopedOnly,
    workspaceSlugs: inferred.workspaceSlugs,
  });
  return { ...resolved, ...inferred };
}

app.post("/backup/restore/preview", async (c) => {
  const body = restoreSchema.parse(await c.req.json());
  let resolved;
  try {
    resolved = await loadRestoreBundle(body);
  } catch (err) {
    const mapped = restoreBundleErrorResponse(String(err));
    if (mapped) return c.json(mapped, 400);
    throw err;
  }
  const preview = await previewBackupRestore(resolved.bundle, body);
  return c.json({
    ok: true,
    preview,
    scopedOnly: resolved.scopedOnly,
    autoDetected: resolved.autoDetected,
    detectedSlug: resolved.detectedSlug,
    selectedSlugs: resolved.workspaceSlugs ?? body.workspaceSlugs ?? null,
    conflictPolicy: body.conflictPolicy,
    diffIds: preview.diff.map((d) => d.id),
  });
});

app.post("/backup/restore/preview/export", async (c) => {
  const body = restoreSchema.parse(await c.req.json());
  let resolved;
  try {
    resolved = await loadRestoreBundle(body);
  } catch (err) {
    const mapped = restoreBundleErrorResponse(String(err));
    if (mapped) return c.json(mapped, 400);
    throw err;
  }
  const preview = await previewBackupRestore(resolved.bundle, body);
  const exportPath = await writeRestoreDiffExport(preview, {
    path: body.path,
    selectedSlugs: resolved.workspaceSlugs ?? body.workspaceSlugs ?? null,
    selectedDiffIds: body.selectedDiffIds ?? null,
    conflictPolicy: body.conflictPolicy,
  }, home);
  return c.json({
    ok: true,
    path: exportPath,
    diffCount: preview.diff.length,
    scopedOnly: resolved.scopedOnly,
    autoDetected: resolved.autoDetected,
    selectedDiffIds: body.selectedDiffIds ?? null,
  });
});

app.post("/backup/restore", async (c) => {
  const body = restoreSchema.parse(await c.req.json());
  let resolved;
  try {
    resolved = await loadRestoreBundle(body);
  } catch (err) {
    const mapped = restoreBundleErrorResponse(String(err));
    if (mapped) return c.json(mapped, 400);
    throw err;
  }
  const scoped = resolved.bundle;
  const preview = await previewBackupRestore(scoped, body);
  const filtered =
    body.selectedDiffIds?.length ?
      filterBundleBySelectedDiff(scoped, preview.diff, body.selectedDiffIds)
    : scoped;
  const workspaceSlugs = resolved.workspaceSlugs ?? body.workspaceSlugs;
  const restoreMcp = body.restoreMcp && (!body.selectedDiffIds?.length || body.selectedDiffIds.some((id) => id.startsWith("mcp:")));
  const restoreProviders =
    body.restoreProviders && (!body.selectedDiffIds?.length || body.selectedDiffIds.some((id) => id.startsWith("providers:")));
  if (restoreMcp && !workspaceSlugs?.length) await mcpHost.replaceAll(filtered.mcpServers ?? []);
  if (restoreProviders && !workspaceSlugs?.length) {
    const { writeFile, mkdir } = await import("node:fs/promises");
    const { dirname, join: j } = await import("node:path");
    const p = j(home, "providers", "providers.json");
    await mkdir(dirname(p), { recursive: true });
    await writeFile(p, JSON.stringify(filtered.providers ?? [], null, 2) + "\n", "utf8");
  }
  const applied = await applyBackupRestore(filtered, {
    restoreApprovals: body.restoreApprovals,
    restoreJobs: body.restoreJobs,
    conflictPolicy: body.conflictPolicy,
  });
  return c.json({
    ok: true,
    restoredAt: nowIso(),
    bundleVersion: filtered.version ?? scoped.version ?? 1,
    scopedOnly: resolved.scopedOnly,
    autoDetected: resolved.autoDetected,
    selectedSlugs: workspaceSlugs ?? null,
    selectedDiffIds: body.selectedDiffIds ?? null,
    conflictPolicy: body.conflictPolicy,
    applied,
  });
});

export function createJobTemplateRunners(): TemplateRunners {
  return {
    backup: async (template, workspaceSlug) => {
      const result = await exportWorkspaceScopedBackup(workspaceSlug, home, {
        encrypt: template.encrypt,
        sign: template.sign,
        passphrase: template.passphrase ?? undefined,
      });
      return { path: result.path };
    },
    archive_export: async (template, workspaceSlug) => {
      const result = await exportWorkspaceScopedArchive(workspaceSlug, home, {
        encrypt: template.encrypt,
        sign: template.sign,
        passphrase: template.passphrase ?? undefined,
      });
      return { path: result.path };
    },
    batch_restore: async (template, workspaceSlug) => {
      const opts = {
        autoDetectScoped: true,
        scopedOnly: false,
        conflictPolicy: template.conflictPolicy ?? "skip",
        restoreApprovals: true,
        restoreJobs: false,
        passphrase: template.passphrase ?? undefined,
      } as const;
      let dryRunSummary: string | undefined;
      let dryRunDetail:
        | {
            backupPath?: string | null;
            workspaces: { total: number; insert: number; skip: number; replace: number };
            projects: { total: number; insert: number; skip: number; replace: number };
          }
        | undefined;
      if (template.dryRunBeforeApply) {
        const preview = await previewLatestScopedBackup(workspaceSlug, home, opts);
        if (!preview.ok) throw new Error(preview.error ?? "batch_restore_preview_failed");
        const ws = preview.preview?.workspaces;
        const proj = preview.preview?.projects;
        dryRunSummary = `dry-run ws +${ws?.insert ?? 0}/skip ${ws?.skip ?? 0}/replace ${ws?.replace ?? 0}`;
        dryRunDetail = {
          backupPath: preview.path ?? null,
          workspaces: {
            total: ws?.total ?? 0,
            insert: ws?.insert ?? 0,
            skip: ws?.skip ?? 0,
            replace: ws?.replace ?? 0,
          },
          projects: {
            total: proj?.total ?? 0,
            insert: proj?.insert ?? 0,
            skip: proj?.skip ?? 0,
            replace: proj?.replace ?? 0,
          },
        };
      }
      const result = await restoreLatestScopedBackup(workspaceSlug, home, opts);
      if (!result.ok) throw new Error(result.error ?? "batch_restore_failed");
      return { path: result.path ?? undefined, dryRunSummary, dryRunDetail };
    },
  };
}

export function createBackupExportRunner() {
  return (options?: Parameters<typeof runBackupExport>[3]) => runBackupExport(home, mcpHost, providers, options);
}

export function createArchiveExportRunner() {
  return async (options?: { encrypt?: boolean; sign?: boolean; passphrase?: string }) => {
    const archive = await exportAllWorkspacesArchive();
    return writeArchiveFile(archive, home, options);
  };
}

app.onError((err, c) => {
  if (err instanceof z.ZodError) {
    return c.json({ error: "validation_error", details: err.flatten() }, 400);
  }
  log("error", "unhandled", { err: String(err) });
  return c.json({ error: "internal_error", message: String(err) }, 500);
});
