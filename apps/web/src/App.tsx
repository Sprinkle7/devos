import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";

const API = "/api";
const DRY_RUN_REVEAL_BRIDGE_KEY = "devaios-dry-run-reveal-bridge-installed";
const DRY_RUN_BRIDGE_UNDO_KEY = "devaios-dry-run-bridge-undo";
const DRY_RUN_BRIDGE_UNDO_MS = 5_000;
const HASH_SNOOZE_LIVE_RESUME_PREFIX_KEY = "devaios-hash-snooze-live-resume-prefix";
const HASH_SNOOZE_LIVE_RESUME_PREFIX_HELP_KEY = "devaios-hash-snooze-resume-prefix-help-expanded";
const HASH_SNOOZE_LIVE_RESUME_PREFIX_HELP_COMPACT_KEY = "devaios-hash-snooze-resume-prefix-help-compact-expanded";
const MERGE_SCROLL_SCRUB_THROTTLE_MIN_MS = 120;
const MERGE_SCROLL_SCRUB_THROTTLE_MAX_MS = 420;
const HASH_SNOOZE_PREFIX_HELPER_SYNC_STACK_MAX = 5;
const MERGE_SCROLL_SCRUB_ATOMIC_RESTORE_DEBOUNCE_MS = 16;
const HASH_SNOOZE_PREFIX_HELPER_SYNC_DEDUPE_FADE_MS = 300;
const HASH_SNOOZE_PREFIX_HELPER_SYNC_DEDUPE_TITLE_CLEAR_MS = 16;
const HASH_SNOOZE_PREFIX_HELPER_SYNC_DEDUPE_ATOMIC_RESTORE_ANNOUNCE_MS = 3_000;

function dryRunBridgeUndoUrgencyFlashDurationMs(zone: "red" | "amber" | "normal") {
  return zone === "red" ? 900 : zone === "amber" ? 750 : 600;
}

function dryRunBridgeUndoUrgencyFlashZoneBackgroundTintOpacity(zone: "red" | "amber" | "normal") {
  return Math.min(0.28, Math.max(0.1, (dryRunBridgeUndoUrgencyFlashDurationMs(zone) / 900) * 0.22));
}

function dryRunBridgeUndoUrgencyFlashZoneBorderOpacity(zone: "red" | "amber" | "normal") {
  return Math.min(1, Math.max(0.35, (dryRunBridgeUndoUrgencyFlashDurationMs(zone) / 900) * 0.85));
}

function persistDryRunBridgeUndoToast(action: "installed" | "cleared" | null) {
  try {
    if (!action) {
      sessionStorage.removeItem(DRY_RUN_BRIDGE_UNDO_KEY);
      return;
    }
    sessionStorage.setItem(DRY_RUN_BRIDGE_UNDO_KEY, JSON.stringify({ action, at: Date.now() }));
  } catch {
    /* ignore */
  }
}

function readDryRunBridgeUndoToast(): { action: "installed" | "cleared"; remainingMs: number } | null {
  try {
    const raw = sessionStorage.getItem(DRY_RUN_BRIDGE_UNDO_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { action: "installed" | "cleared"; at: number };
    const remainingMs = DRY_RUN_BRIDGE_UNDO_MS - (Date.now() - parsed.at);
    if (remainingMs <= 0) {
      sessionStorage.removeItem(DRY_RUN_BRIDGE_UNDO_KEY);
      return null;
    }
    return { action: parsed.action, remainingMs };
  } catch {
    return null;
  }
}

function applyDryRunRevealDevBridge() {
  window.devaios = {
    ...window.devaios,
    revealInFinder: (path: string) => {
      console.log("[devaios] revealInFinder", path);
      return true;
    },
  };
  try {
    sessionStorage.setItem(DRY_RUN_REVEAL_BRIDGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

function clearDryRunRevealDevBridge() {
  try {
    sessionStorage.removeItem(DRY_RUN_REVEAL_BRIDGE_KEY);
  } catch {
    /* ignore */
  }
  if (window.devaios?.revealInFinder) {
    const next = { ...window.devaios };
    delete next.revealInFinder;
    window.devaios = Object.keys(next).length ? next : undefined;
  }
}

type Health = {
  ok: boolean;
  service: string;
  version: string;
  time: string;
  home?: string;
  deliveryLog?: {
    entryCount: number;
    lastRotatedAt: string | null;
    rotateIntervalHours: number;
    nextRotateAt: string | null;
    maxCount: number;
    maxAgeDays: number;
    rotationHistoryCount?: number;
    rotationHistoryMaxCount?: number;
    rotationHistoryMaxAgeDays?: number;
  };
  deadLetterHashes?: {
    hashCount: number;
    tickCheck?: {
      lastCheckedAt: string | null;
      lastOk: boolean | null;
      lastRebuilt: boolean | null;
      checkCount: number;
    };
  };
};
type Workspace = { id: string; slug: string; name: string; rootPath: string | null; createdAt: string };
type Project = {
  id: string;
  workspaceId: string;
  slug: string;
  name: string;
  repoPath: string | null;
};
type McpServer = { id: string; name: string; command: string; args: string[]; enabled: boolean };
type Provider = { id: string; name: string; kind: string; baseUrl?: string; enabled: boolean };
type SecretName = { name: string; updatedAt: string };
type ConversationRow = { id: string; title: string; updatedAt?: string; matchSource?: string };
type ChatMessage = { id?: string; role: string; content: string; meta?: unknown };
type ApprovalRow = {
  id: string;
  status: string;
  server: string;
  tool: string;
  reason?: string | null;
};
type Memory = { id: string; kind: string; title: string; content: string };
type Bundle = {
  id: string;
  budgetTokens: number;
  usedTokens: number;
  reserveTokens: number;
  dropList: Array<{ source: string; reason: string }>;
  chunks: Array<{ source: string; strategy: string; packedTokens: number; dropped?: boolean }>;
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) throw new Error((await res.text()) || res.statusText);
  return res.json() as Promise<T>;
}

export function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("demo");
  const [projects, setProjects] = useState<Project[]>([]);
  const [servers, setServers] = useState<McpServer[]>([]);
  const [providerList, setProviderList] = useState<Provider[]>([]);
  const [secretNames, setSecretNames] = useState<SecretName[]>([]);
  const [memoryList, setMemoryList] = useState<Memory[]>([]);
  const [toolsOut, setToolsOut] = useState<string | null>(null);
  const [callOut, setCallOut] = useState<string | null>(null);
  const [chatOut, setChatOut] = useState<string | null>(null);
  const [streamOut, setStreamOut] = useState("");
  const [graphOut, setGraphOut] = useState<string | null>(null);
  const [convList, setConvList] = useState<ConversationRow[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [convMessages, setConvMessages] = useState<ChatMessage[]>([]);
  const [secretsBackend, setSecretsBackend] = useState<string>("file");
  const [keychainAvailable, setKeychainAvailable] = useState(false);
  const [convSearch, setConvSearch] = useState("");
  const [approvalList, setApprovalList] = useState<ApprovalRow[]>([]);
  const [jobOut, setJobOut] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("Please ping the echo MCP tool then summarize.");
  const [graphQuery, setGraphQuery] = useState("How does the API relate to MCP host?");
  const [useTools, setUseTools] = useState(true);
  const [approveDestructive, setApproveDestructive] = useState(false);
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [probeOut, setProbeOut] = useState<string | null>(null);
  const [encryptBackup, setEncryptBackup] = useState(false);
  const [signBackup, setSignBackup] = useState(false);
  const [backupPassphrase, setBackupPassphrase] = useState("");
  const [exportPath, setExportPath] = useState<string | null>(null);
  const [archivePath, setArchivePath] = useState<string | null>(null);
  const [importPath, setImportPath] = useState("");
  const [archiveImportPath, setArchiveImportPath] = useState("");
  const [importResult, setImportResult] = useState<string | null>(null);
  const [mergeResult, setMergeResult] = useState<string | null>(null);
  const [dedupeByTitle, setDedupeByTitle] = useState(false);
  const [failoverOrder, setFailoverOrder] = useState<string[]>([]);
  const [failoverProbeOut, setFailoverProbeOut] = useState<string | null>(null);
  const [slugMapJson, setSlugMapJson] = useState("{}");
  const [retentionMaxCount, setRetentionMaxCount] = useState("20");
  const [retentionMaxAge, setRetentionMaxAge] = useState("30");
  const [retentionOut, setRetentionOut] = useState<string | null>(null);
  const [archiveScheduleEnabled, setArchiveScheduleEnabled] = useState(false);
  const [archiveScheduleInterval, setArchiveScheduleInterval] = useState("10080");
  const [archiveScheduleOut, setArchiveScheduleOut] = useState<string | null>(null);
  const [archiveRetentionMaxCount, setArchiveRetentionMaxCount] = useState("10");
  const [archiveRetentionMaxAge, setArchiveRetentionMaxAge] = useState("90");
  const [archiveRetentionOut, setArchiveRetentionOut] = useState<string | null>(null);
  const [failoverDragIdx, setFailoverDragIdx] = useState<number | null>(null);
  const [cloneTargetSlug, setCloneTargetSlug] = useState("");
  const [cloneTargetName, setCloneTargetName] = useState("");
  const [cloneOut, setCloneOut] = useState<string | null>(null);
  const [restorePreviewOut, setRestorePreviewOut] = useState<string | null>(null);
  const [restorePreviewDiff, setRestorePreviewDiff] = useState<Array<{ id: string; section: string; action: string; label: string }> | null>(null);
  const [selectedDiffIds, setSelectedDiffIds] = useState<string[]>([]);
  const [providerHealth, setProviderHealth] = useState<{
    summary: { total: number; enabled: number; healthy: number };
    probes: Array<{ kind: string; ok: boolean; error?: string; latencyMs?: number }>;
  } | null>(null);
  const [encryptArchive, setEncryptArchive] = useState(false);
  const [signArchive, setSignArchive] = useState(false);
  const [archivePassphrase, setArchivePassphrase] = useState("");
  const [cloneIncludeApprovals, setCloneIncludeApprovals] = useState(true);
  const [cloneIncludeJobs, setCloneIncludeJobs] = useState(false);
  const [restoreWorkspaceSlugs, setRestoreWorkspaceSlugs] = useState("");
  const [autoDisableProviders, setAutoDisableProviders] = useState(false);
  const [archiveImportSlugs, setArchiveImportSlugs] = useState("");
  const [archiveImportPreview, setArchiveImportPreview] = useState<string | null>(null);
  type ArchiveConversationPick = {
    id: string;
    title: string;
    messageCount: number;
    selected: boolean;
    conflict: "insert" | "skip" | "replace";
    workspaceSlug: string;
  };
  const [archiveConversationPicks, setArchiveConversationPicks] = useState<ArchiveConversationPick[]>([]);
  const [restoreDiffExportPath, setRestoreDiffExportPath] = useState<string | null>(null);
  const [restoreScopedOnly, setRestoreScopedOnly] = useState(false);
  const [restoreAutoDetectScoped, setRestoreAutoDetectScoped] = useState(true);
  const [archiveImportDiffExportPath, setArchiveImportDiffExportPath] = useState<string | null>(null);
  const [templateNotifications, setTemplateNotifications] = useState<
    Array<{
      id: string;
      templateId: string;
      kind: string;
      status: "ok" | "error";
      message: string;
      path?: string | null;
      dryRunSummary?: string | null;
      dryRunDetail?: {
        backupPath?: string | null;
        workspaces: { total: number; insert: number; skip: number; replace: number };
        projects: { total: number; insert: number; skip: number; replace: number };
      } | null;
      createdAt: string;
      read: boolean;
    }>
  >([]);
  const [templateNotificationsOut, setTemplateNotificationsOut] = useState<string | null>(null);
  const [notificationWebhookEnabled, setNotificationWebhookEnabled] = useState(false);
  const [notificationWebhookUrl, setNotificationWebhookUrl] = useState("");
  const [notificationWebhookOut, setNotificationWebhookOut] = useState<string | null>(null);
  const [notificationStreamOut, setNotificationStreamOut] = useState<string | null>(null);
  const [notificationWebhookMaxRetries, setNotificationWebhookMaxRetries] = useState("3");
  const [webhookDeadLetters, setWebhookDeadLetters] = useState<
    Array<{ id: string; failedAt: string; url: string; attempts: number; lastError?: string }>
  >([]);
  const [selectedWebhookDeadLetterIds, setSelectedWebhookDeadLetterIds] = useState<string[]>([]);
  const [notificationEmailEnabled, setNotificationEmailEnabled] = useState(false);
  const [notificationEmailFrom, setNotificationEmailFrom] = useState("");
  const [notificationEmailTo, setNotificationEmailTo] = useState("");
  const [notificationEmailSmtpHost, setNotificationEmailSmtpHost] = useState("");
  const [notificationEmailSmtpPort, setNotificationEmailSmtpPort] = useState("587");
  const [notificationEmailUseOutbox, setNotificationEmailUseOutbox] = useState(true);
  const [notificationEmailSendViaSmtp, setNotificationEmailSendViaSmtp] = useState(false);
  const [notificationEmailSmtpSecure, setNotificationEmailSmtpSecure] = useState(false);
  const [notificationEmailSmtpUser, setNotificationEmailSmtpUser] = useState("");
  const [notificationEmailSmtpPass, setNotificationEmailSmtpPass] = useState("");
  const [notificationEmailOut, setNotificationEmailOut] = useState<string | null>(null);
  const [archiveFromDiffPreviewOut, setArchiveFromDiffPreviewOut] = useState<string | null>(null);
  const [webhookReplayOut, setWebhookReplayOut] = useState<string | null>(null);
  const [emailOutboxPreview, setEmailOutboxPreview] = useState<string | null>(null);
  const [emailDeliveryLogPreview, setEmailDeliveryLogPreview] = useState<string | null>(null);
  const [emailDeliveryChannelFilter, setEmailDeliveryChannelFilter] = useState<"" | "outbox" | "smtp">("");
  const [emailDeliveryStatusFilter, setEmailDeliveryStatusFilter] = useState<
    "" | "written" | "sent" | "failed" | "skipped"
  >("");
  const [emailDeliveryRotateOut, setEmailDeliveryRotateOut] = useState<string | null>(null);
  const [emailRotationHistoryPreview, setEmailRotationHistoryPreview] = useState<string | null>(null);
  const [archiveImportDiffPath, setArchiveImportDiffPath] = useState("");
  type ArchiveDiffPick = {
    id: string;
    workspaceSlug: string;
    conversationId: string;
    title: string;
    action: "insert" | "skip" | "replace";
    selected: boolean;
  };
  const [archiveDiffRows, setArchiveDiffRows] = useState<ArchiveDiffPick[]>([]);
  const [selectedArchiveDiffIds, setSelectedArchiveDiffIds] = useState<string[]>([]);
  const [archiveFromDiffOut, setArchiveFromDiffOut] = useState<string | null>(null);
  const [batchRestoreOut, setBatchRestoreOut] = useState<string | null>(null);
  const [batchRestorePreviewOut, setBatchRestorePreviewOut] = useState<string | null>(null);
  const [archiveDiffSelectionOut, setArchiveDiffSelectionOut] = useState<string | null>(null);
  const [archiveDiffMergePaths, setArchiveDiffMergePaths] = useState("");
  const [archiveDiffMergeOut, setArchiveDiffMergeOut] = useState<string | null>(null);
  const [archiveDiffMergePreviewOut, setArchiveDiffMergePreviewOut] = useState<string | null>(null);
  type ArchiveMergePreviewRow = {
    id: string;
    workspaceSlug: string;
    title: string;
    action: "insert" | "skip" | "replace";
    selected: boolean;
  };
  const [archiveMergePreviewRows, setArchiveMergePreviewRows] = useState<ArchiveMergePreviewRow[]>([]);
  const [selectedArchiveMergeDiffIds, setSelectedArchiveMergeDiffIds] = useState<string[]>([]);
  const [expandedDryRunIds, setExpandedDryRunIds] = useState<string[]>([]);
  const [dryRunExportOut, setDryRunExportOut] = useState<string | null>(null);
  const [dryRunExportPath, setDryRunExportPath] = useState<string | null>(null);
  const [dryRunExportCopyOut, setDryRunExportCopyOut] = useState<string | null>(null);
  const [dryRunExportBadge, setDryRunExportBadge] = useState<string | null>(null);
  const [dryRunExportTemplateId, setDryRunExportTemplateId] = useState("");
  const [dryRunExportFilterWorkspace, setDryRunExportFilterWorkspace] = useState(true);
  const [dryRunExportSince, setDryRunExportSince] = useState("");
  const [dryRunExportUntil, setDryRunExportUntil] = useState("");
  const [dryRunExportPreset, setDryRunExportPreset] = useState<"" | "24h" | "7d" | "30d">("");
  const [dryRunExportLimit, setDryRunExportLimit] = useState("50");
  const [rotationHistoryCsvOut, setRotationHistoryCsvOut] = useState<string | null>(null);
  const [rotationIntegrityOut, setRotationIntegrityOut] = useState<string | null>(null);
  const [hashIndexAutoRebuild, setHashIndexAutoRebuild] = useState(true);
  type RotationHistoryEntry = { rotatedAt: string; deleted: number; kept: number; trigger: string };
  const [rotationHistoryChart, setRotationHistoryChart] = useState<RotationHistoryEntry[]>([]);
  const [hashIndexRebuildOut, setHashIndexRebuildOut] = useState<string | null>(null);
  const [hashIndexIntegrityOut, setHashIndexIntegrityOut] = useState<string | null>(null);
  const [webhookDeadLetterExportPath, setWebhookDeadLetterExportPath] = useState<string | null>(null);
  const [webhookDeadLetterImportPath, setWebhookDeadLetterImportPath] = useState("");
  const [webhookDeadLetterImportOut, setWebhookDeadLetterImportOut] = useState<string | null>(null);
  const [archiveDiffMergeAllowMixed, setArchiveDiffMergeAllowMixed] = useState(false);
  const [archiveMergeActionFilters, setArchiveMergeActionFilters] = useState<
    Array<"insert" | "skip" | "replace">
  >([]);
  const [rotationRepairAuditOut, setRotationRepairAuditOut] = useState<string | null>(null);
  const [rotationRepairAuditCsvOut, setRotationRepairAuditCsvOut] = useState<string | null>(null);
  const [hashTickAlert, setHashTickAlert] = useState<string | null>(null);
  const [hashTickAlertHidden, setHashTickAlertHidden] = useState(false);
  const [dryRunPreviewCount, setDryRunPreviewCount] = useState<number | null>(null);
  const [dryRunPreviewExportCount, setDryRunPreviewExportCount] = useState<number | null>(null);
  const [dryRunPreviewExportLimit, setDryRunPreviewExportLimit] = useState<number | null>(null);
  const [dryRunPreviewTruncated, setDryRunPreviewTruncated] = useState(false);
  const [rotationAuditRetentionMaxCount, setRotationAuditRetentionMaxCount] = useState("200");
  const [rotationAuditRetentionMaxAge, setRotationAuditRetentionMaxAge] = useState("365");
  const [rotationAuditRetentionOut, setRotationAuditRetentionOut] = useState<string | null>(null);
  const [mergePresetProfileName, setMergePresetProfileName] = useState("");
  const [mergePresetProfileNames, setMergePresetProfileNames] = useState<string[]>([]);
  const [mergeProfilesOut, setMergeProfilesOut] = useState<string | null>(null);
  const [mergeProfilesImportText, setMergeProfilesImportText] = useState("");
  const [mergeProfilesImportPreview, setMergeProfilesImportPreview] = useState<string | null>(null);
  const [mergeProfilesImportPreviewJson, setMergeProfilesImportPreviewJson] = useState<string | null>(null);
  const [mergeProfilesImportPreviewExpanded, setMergeProfilesImportPreviewExpanded] = useState(true);
  const [mergeExportSelectedOnly, setMergeExportSelectedOnly] = useState(true);
  const [hashSnoozeMinutes, setHashSnoozeMinutes] = useState("60");
  const [hashSnoozeUntil, setHashSnoozeUntil] = useState<string | null>(null);
  const [hashSnoozeCountdownTick, setHashSnoozeCountdownTick] = useState(0);
  const [hashSnoozeExpiredNotice, setHashSnoozeExpiredNotice] = useState<string | null>(null);
  const [hashSnoozeExpiredAt, setHashSnoozeExpiredAt] = useState<string | null>(null);
  const [hashSnoozeExpiredRelativeTick, setHashSnoozeExpiredRelativeTick] = useState(0);
  const [rotationAuditSaveToast, setRotationAuditSaveToast] = useState<{
    text: string;
    tone: "unchanged" | "single" | "multi";
  } | null>(null);
  const [dryRunRevealBridgeInstalled, setDryRunRevealBridgeInstalled] = useState(
    () =>
      typeof window !== "undefined" &&
      (typeof window.devaios?.revealInFinder === "function" ||
        sessionStorage.getItem(DRY_RUN_REVEAL_BRIDGE_KEY) === "1"),
  );
  const [dryRunBridgeUndoToast, setDryRunBridgeUndoToast] = useState<"installed" | "cleared" | null>(() =>
    typeof window !== "undefined" ? (readDryRunBridgeUndoToast()?.action ?? null) : null,
  );
  const [dryRunBridgeUndoCountdownTick, setDryRunBridgeUndoCountdownTick] = useState(0);
  const [rotationAuditToastLegendExpanded, setRotationAuditToastLegendExpanded] = useState(true);
  const [rotationAuditLegendFocusHint, setRotationAuditLegendFocusHint] = useState<string | null>(null);
  const [rotationAuditLegendFocusIndex, setRotationAuditLegendFocusIndex] = useState(0);
  const [rotationAuditLegendWrapHint, setRotationAuditLegendWrapHint] = useState(false);
  const [rotationAuditLegendArrowHint, setRotationAuditLegendArrowHint] = useState<string | null>(null);
  const [rotationAuditLegendArrowLiveAnnouncement, setRotationAuditLegendArrowLiveAnnouncement] = useState("");
  const [rotationAuditLegendMixedClearEscapeOnly, setRotationAuditLegendMixedClearEscapeOnly] = useState(
    () => {
      try {
        return localStorage.getItem("devaios-rotation-audit-legend-mixed-clear-escape-only") === "1";
      } catch {
        return false;
      }
    },
  );
  const [
    rotationAuditLegendMixedClearEscapeOnlyLiveAnnouncement,
    setRotationAuditLegendMixedClearEscapeOnlyLiveAnnouncement,
  ] = useState("");
  const [rotationAuditLegendMixedClearEscapeOnlyLiveClearSec, setRotationAuditLegendMixedClearEscapeOnlyLiveClearSec] =
    useState<number | null>(null);
  const [
    rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseResumeAnnouncement,
    setRotationAuditLegendMixedClearEscapeOnlyLiveClearPulseResumeAnnouncement,
  ] = useState("");
  const [
    rotationAuditLegendMixedClearEscapeOnlyLiveClearPulsePauseAnnouncement,
    setRotationAuditLegendMixedClearEscapeOnlyLiveClearPulsePauseAnnouncement,
  ] = useState("");
  const [
    rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverState,
    setRotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverState,
  ] = useState<"paused" | "resumed" | null>(null);
  const [hashSnoozeLiveAnnouncement, setHashSnoozeLiveAnnouncement] = useState("");
  const [hashSnoozeLiveResumePrefixEnabled, setHashSnoozeLiveResumePrefixEnabled] = useState(() => {
    try {
      return localStorage.getItem(HASH_SNOOZE_LIVE_RESUME_PREFIX_KEY) !== "0";
    } catch {
      return true;
    }
  });
  const [hashSnoozeLiveResumePrefixHelpExpanded, setHashSnoozeLiveResumePrefixHelpExpanded] = useState(() => {
    try {
      return localStorage.getItem(HASH_SNOOZE_LIVE_RESUME_PREFIX_HELP_KEY) !== "0";
    } catch {
      return true;
    }
  });
  const [hashSnoozeLiveResumePrefixHelpCompactExpanded, setHashSnoozeLiveResumePrefixHelpCompactExpanded] =
    useState(() => {
      try {
        return localStorage.getItem(HASH_SNOOZE_LIVE_RESUME_PREFIX_HELP_COMPACT_KEY) !== "0";
      } catch {
        return true;
      }
    });
  const [hashSnoozePrefixHelperSyncToasts, setHashSnoozePrefixHelperSyncToasts] = useState<
    { id: number; text: string }[]
  >([]);
  const [hashSnoozePrefixHelperSyncLiveAnnouncement, setHashSnoozePrefixHelperSyncLiveAnnouncement] =
    useState("");
  const [hashSnoozePrefixHelperSyncStackOverflow, setHashSnoozePrefixHelperSyncStackOverflow] =
    useState<string | null>(null);
  const [hashSnoozePrefixHelperSyncOverflowDedupeBadge, setHashSnoozePrefixHelperSyncOverflowDedupeBadge] =
    useState<string | null>(null);
  const [hashSnoozePrefixHelperSyncOverflowDedupeBadgeTitle, setHashSnoozePrefixHelperSyncOverflowDedupeBadgeTitle] =
    useState<string | undefined>(undefined);
  const [hashSnoozePrefixHelperSyncOverflowDedupeBadgeFading, setHashSnoozePrefixHelperSyncOverflowDedupeBadgeFading] =
    useState(false);
  const [hashSnoozePrefixHelperSyncOverflowDedupeBadgeTitleClearing, setHashSnoozePrefixHelperSyncOverflowDedupeBadgeTitleClearing] =
    useState(false);
  const [
    hashSnoozePrefixHelperSyncOverflowDedupeBadgeAtomicRestoreAnnouncement,
    setHashSnoozePrefixHelperSyncOverflowDedupeBadgeAtomicRestoreAnnouncement,
  ] = useState("");
  const [dryRunBridgeUndoUrgencyLiveAnnouncement, setDryRunBridgeUndoUrgencyLiveAnnouncement] = useState("");
  const [dryRunBridgeUndoUrgencyFlashZone, setDryRunBridgeUndoUrgencyFlashZone] = useState<
    "red" | "amber" | "normal" | null
  >(null);
  const [
    dryRunBridgeUndoUrgencyFlashDurationBorderPulseResumeAnnouncement,
    setDryRunBridgeUndoUrgencyFlashDurationBorderPulseResumeAnnouncement,
  ] = useState("");
  const [
    dryRunBridgeUndoUrgencyFlashDurationBorderPulsePauseAnnouncement,
    setDryRunBridgeUndoUrgencyFlashDurationBorderPulsePauseAnnouncement,
  ] = useState("");
  const [
    dryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverState,
    setDryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverState,
  ] = useState<"paused" | "resumed" | null>(null);
  const [mergeProfilesPreviewScrollScrubThrottleMs, setMergeProfilesPreviewScrollScrubThrottleMs] = useState<
    number | null
  >(null);
  const [mergeScrollScrubbingActive, setMergeScrollScrubbingActive] = useState(false);
  const [mergeScrollDebouncePulseAtomicRestoreFlash, setMergeScrollDebouncePulseAtomicRestoreFlash] =
    useState(false);
  const [mergeScrollDebouncePulseAtomicRestoreFlashRestored, setMergeScrollDebouncePulseAtomicRestoreFlashRestored] =
    useState(false);
  const [mergeProfilesPreviewScrollLiveAnnouncement, setMergeProfilesPreviewScrollLiveAnnouncement] = useState("");
  const [mergeProfilesPreviewScrollTop, setMergeProfilesPreviewScrollTop] = useState(0);
  const [mergeProfilesPreviewScrollMax, setMergeProfilesPreviewScrollMax] = useState(0);
  const [hashSnoozeRelativePaused, setHashSnoozeRelativePaused] = useState(
    () => typeof document !== "undefined" && document.visibilityState === "hidden",
  );
  const [hashSnoozeRelativeUpdatedAt, setHashSnoozeRelativeUpdatedAt] = useState<string | null>(null);
  const [rotationAuditRetentionBadge, setRotationAuditRetentionBadge] = useState<string | null>(null);
  const [rotationAuditRetentionBaseline, setRotationAuditRetentionBaseline] = useState<{
    maxCount: number;
    maxAgeDays: number;
  } | null>(null);
  const [rotationAuditRetentionDefaults, setRotationAuditRetentionDefaults] = useState<{
    maxCount: number;
    maxAgeDays: number;
  }>({ maxCount: 200, maxAgeDays: 365 });
  const [dryRunExportLimitPresets, setDryRunExportLimitPresets] = useState<number[]>([25, 50, 100]);
  const MERGE_ACTION_FILTERS_KEY = "devaios-merge-action-filters";
  const MERGE_ACTION_PROFILES_KEY = "devaios-merge-action-profiles";
  const HASH_TICK_SNOOZE_KEY = "devaios-hash-tick-snooze-until";
  const DRY_RUN_EXPORT_LIMIT_KEY = "devaios-dry-run-export-limit";
  const DRY_RUN_EXPORT_FILTERS_KEY = "devaios-dry-run-export-filters";
  const MERGE_PROFILES_PREVIEW_EXPANDED_KEY = "devaios-merge-profiles-preview-expanded";
  const MERGE_PROFILES_PREVIEW_SCROLL_KEY = "devaios-merge-profiles-preview-scroll";
  const ROTATION_AUDIT_TOAST_LEGEND_KEY = "devaios-rotation-audit-toast-legend-expanded";
  const ROTATION_AUDIT_LEGEND_MIXED_CLEAR_ESCAPE_ONLY_KEY =
    "devaios-rotation-audit-legend-mixed-clear-escape-only";
  const saveRotationAuditRef = useRef<(viaShortcut?: boolean) => Promise<void>>(async () => {});
  const mergeProfilesPreviewScrollRef = useRef<HTMLPreElement | null>(null);
  const mergeProfilesPreviewScrollBarRef = useRef<HTMLDivElement | null>(null);
  const mergeScrollScrubbingRef = useRef(false);
  const mergeScrollAnnounceRef = useRef(0);
  const mergeScrollLastAnnounceScrollRef = useRef(0);
  const mergeScrollScrubThrottleMsRef = useRef<number | null>(null);
  const mergeScrollAtomicRestoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mergeScrollDebouncePulseAtomicRestoreFlashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const mergeScrollDebouncePulseAtomicRestoreFlashRestoredTimerRef = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);
  const hashSnoozeLivePausedRef = useRef(false);
  const hashSnoozeLiveResumePendingRef = useRef(false);
  const hashSnoozeLiveResumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hashSnoozeExpiredNoticeRef = useRef<HTMLDivElement | null>(null);
  const hashSnoozeExpiredDismissRef = useRef<HTMLButtonElement | null>(null);
  const hashSnoozeReturnFocusRef = useRef<HTMLElement | null>(null);
  const dismissHashSnoozeExpiredNoticeRef = useRef<() => void>(() => {});
  const undoDryRunBridgeRef = useRef<() => void>(() => {});
  const rotationAuditLegendRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rotationAuditLegendToggleRef = useRef<HTMLButtonElement | null>(null);
  const rotationAuditLegendMixedClearEscapeOnlyLiveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const rotationAuditLegendMixedClearEscapeOnlyLiveClearGenRef = useRef(0);
  const rotationAuditLegendMixedClearEscapeOnlyLiveClearTickRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const dryRunBridgeUndoUrgencyZoneRef = useRef<string | null>(null);
  const hashSnoozePrefixHelperSyncToastIdRef = useRef(0);
  const hashSnoozePrefixHelperSyncOverflowLastAtRef = useRef(0);
  const [restoreConflictPolicy, setRestoreConflictPolicy] = useState<"skip" | "replace">("skip");
  const [cloneIncludeScheduleTemplates, setCloneIncludeScheduleTemplates] = useState(false);
  const [providerCooldownOut, setProviderCooldownOut] = useState<string | null>(null);
  const [cooldownMinutes, setCooldownMinutes] = useState("15");
  const [archiveImportConflictPolicy, setArchiveImportConflictPolicy] = useState<"skip" | "replace">("skip");
  const [jobTemplateRunOut, setJobTemplateRunOut] = useState<string | null>(null);
  type JobTemplateRow = {
    id: string;
    kind: "backup" | "archive_export" | "batch_restore";
    label: string;
    intervalMinutes: number;
    encrypt?: boolean;
    sign?: boolean;
    enabled: boolean;
    windowStartHour?: number | null;
    windowEndHour?: number | null;
    passphrase?: string | null;
    conflictPolicy?: "skip" | "replace";
    dryRunBeforeApply?: boolean;
  };
  const [jobTemplates, setJobTemplates] = useState<JobTemplateRow[]>([]);
  const [jobTemplatesOut, setJobTemplatesOut] = useState<string | null>(null);
  const [templateRunHistory, setTemplateRunHistory] = useState<
    Array<{ templateId: string; kind: string; lastRunAt: string; lastPath?: string | null; lastError?: string | null }>
  >([]);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleInterval, setScheduleInterval] = useState("1440");
  const [backupJobOut, setBackupJobOut] = useState<string | null>(null);
  const [streamTools, setStreamTools] = useState(true);
  const [backupPath, setBackupPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("My Workspace");
  const [slug, setSlug] = useState("my-workspace");
  const [projectName, setProjectName] = useState("devaios");
  const [projectSlug, setProjectSlug] = useState("devaios");
  const [mcpName, setMcpName] = useState("stub-echo");
  const [mcpCommand, setMcpCommand] = useState("echo");
  const [secretName, setSecretName] = useState("ANTHROPIC_API_KEY");
  const [secretValue, setSecretValue] = useState("");
  const [memoryTitle, setMemoryTitle] = useState("Architecture note");
  const [memoryContent, setMemoryContent] = useState("Local web + Postgres + MCP-first.");

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const [h, w, m, p, s] = await Promise.all([
        api<Health>("/health"),
        api<{ workspaces: Workspace[] }>("/workspaces"),
        api<{ servers: McpServer[] }>("/mcp/servers"),
        api<{ providers: Provider[] }>("/providers"),
        api<{ secrets: SecretName[]; backend?: string; keychainAvailable?: boolean }>("/secrets"),
      ]);
      setHealth(h);
      const tick = h.deadLetterHashes?.tickCheck;
      const snoozeUntil = readHashSnoozeUntil();
      setHashSnoozeUntil(snoozeUntil);
      const snoozed = Boolean(snoozeUntil);
      if (tick?.lastOk !== false) setHashTickAlertHidden(false);
      if (tick?.lastCheckedAt && tick.lastOk === false && !snoozed && !hashTickAlertHidden) {
        setHashTickAlert(
          `hash tick integrity failed · ${tick.checkCount} checks${tick.lastRebuilt ? " · auto-rebuild attempted" : ""}`,
        );
        setHashSnoozeExpiredNotice(null);
        setHashSnoozeExpiredAt(null);
        setHashSnoozeRelativeUpdatedAt(null);
      } else {
        setHashTickAlert(null);
      }
      setWorkspaces(w.workspaces);
      setServers(m.servers);
      setProviderList(p.providers);
      setSecretNames(s.secrets);
      setSecretsBackend(s.backend ?? "file");
      setKeychainAvailable(Boolean(s.keychainAvailable));
      const [failover, schedule, retention, archiveSchedule, archiveRetention] = await Promise.all([
        api<{ order: string[] }>("/providers/failover").catch(() => ({ order: [] as string[] })),
        api<{ schedule: { enabled: boolean; intervalMinutes: number } }>("/backup/schedule").catch(() => ({
          schedule: { enabled: false, intervalMinutes: 1440 },
        })),
        api<{ retention: { maxCount: number; maxAgeDays: number } }>("/backup/retention").catch(() => ({
          retention: { maxCount: 20, maxAgeDays: 30 },
        })),
        api<{ schedule: { enabled: boolean; intervalMinutes: number } }>(
          "/export/conversations/archive/schedule",
        ).catch(() => ({ schedule: { enabled: false, intervalMinutes: 10080 } })),
        api<{ retention: { maxCount: number; maxAgeDays: number } }>(
          "/export/conversations/archive/retention",
        ).catch(() => ({ retention: { maxCount: 10, maxAgeDays: 90 } })),
      ]);
      setFailoverOrder(failover.order);
      setScheduleEnabled(schedule.schedule.enabled);
      setScheduleInterval(String(schedule.schedule.intervalMinutes));
      setRetentionMaxCount(String(retention.retention.maxCount));
      setRetentionMaxAge(String(retention.retention.maxAgeDays));
      setArchiveScheduleEnabled(archiveSchedule.schedule.enabled);
      setArchiveScheduleInterval(String(archiveSchedule.schedule.intervalMinutes));
      setArchiveRetentionMaxCount(String(archiveRetention.retention.maxCount));
      setArchiveRetentionMaxAge(String(archiveRetention.retention.maxAgeDays));
      const health = await api<{
        summary: { total: number; enabled: number; healthy: number };
        probes: Array<{ kind: string; ok: boolean; error?: string; latencyMs?: number }>;
      }>("/providers/health").catch(() => null);
      if (health) setProviderHealth(health);
      const cooldown = await api<{ cooldownMinutes: number }>("/providers/cooldown").catch(() => null);
      if (cooldown) setCooldownMinutes(String(cooldown.cooldownMinutes));
      if (w.workspaces.length && !w.workspaces.some((x) => x.slug === selectedSlug)) {
        setSelectedSlug(w.workspaces[0].slug);
      }
    } catch (e) {
      setHealth(null);
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [selectedSlug, hashTickAlertHidden]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MERGE_ACTION_FILTERS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Array<"insert" | "skip" | "replace">;
      if (Array.isArray(parsed)) setArchiveMergeActionFilters(parsed);
    } catch {
      /* ignore */
    }
    try {
      const savedLimit = localStorage.getItem(DRY_RUN_EXPORT_LIMIT_KEY);
      if (savedLimit) setDryRunExportLimit(savedLimit);
    } catch {
      /* ignore */
    }
    try {
      const savedFilters = localStorage.getItem(DRY_RUN_EXPORT_FILTERS_KEY);
      if (savedFilters) {
        const parsed = JSON.parse(savedFilters) as {
          preset?: "" | "24h" | "7d" | "30d";
          templateId?: string;
          filterWorkspace?: boolean;
          since?: string;
          until?: string;
        };
        if (parsed.preset != null) setDryRunExportPreset(parsed.preset);
        if (typeof parsed.templateId === "string") setDryRunExportTemplateId(parsed.templateId);
        if (typeof parsed.filterWorkspace === "boolean") setDryRunExportFilterWorkspace(parsed.filterWorkspace);
        if (typeof parsed.since === "string") setDryRunExportSince(parsed.since);
        if (typeof parsed.until === "string") setDryRunExportUntil(parsed.until);
      }
    } catch {
      /* ignore */
    }
    try {
      const savedExpanded = localStorage.getItem(MERGE_PROFILES_PREVIEW_EXPANDED_KEY);
      if (savedExpanded != null) setMergeProfilesImportPreviewExpanded(savedExpanded !== "0");
    } catch {
      /* ignore */
    }
    try {
      if (sessionStorage.getItem(DRY_RUN_REVEAL_BRIDGE_KEY) === "1") {
        applyDryRunRevealDevBridge();
        setDryRunRevealBridgeInstalled(true);
      }
    } catch {
      /* ignore */
    }
    try {
      const savedLegend = localStorage.getItem(ROTATION_AUDIT_TOAST_LEGEND_KEY);
      if (savedLegend != null) setRotationAuditToastLegendExpanded(savedLegend !== "0");
      const savedMixedClearEscapeOnly = localStorage.getItem(
        ROTATION_AUDIT_LEGEND_MIXED_CLEAR_ESCAPE_ONLY_KEY,
      );
      if (savedMixedClearEscapeOnly != null) {
        setRotationAuditLegendMixedClearEscapeOnly(savedMixedClearEscapeOnly === "1");
      }
    } catch {
      /* ignore */
    }
    refreshMergePresetProfileNames();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        DRY_RUN_EXPORT_FILTERS_KEY,
        JSON.stringify({
          preset: dryRunExportPreset,
          templateId: dryRunExportTemplateId,
          filterWorkspace: dryRunExportFilterWorkspace,
          since: dryRunExportSince,
          until: dryRunExportUntil,
        }),
      );
    } catch {
      /* ignore */
    }
  }, [
    dryRunExportPreset,
    dryRunExportTemplateId,
    dryRunExportFilterWorkspace,
    dryRunExportSince,
    dryRunExportUntil,
  ]);

  useEffect(() => {
    if (!hashSnoozeUntil) return;
    const tick = () => {
      const stored = localStorage.getItem(HASH_TICK_SNOOZE_KEY);
      if (!stored) {
        setHashSnoozeUntil(null);
        return;
      }
      if (Date.parse(stored) <= Date.now()) {
        localStorage.removeItem(HASH_TICK_SNOOZE_KEY);
        setHashSnoozeUntil(null);
        setHashSnoozeExpiredNotice("hash alert snooze expired — integrity alerts resumed");
        setHashSnoozeExpiredAt(new Date().toISOString());
        setHashSnoozeRelativeUpdatedAt(new Date().toISOString());
        void refresh();
        return;
      }
      setHashSnoozeUntil(stored);
      setHashSnoozeCountdownTick((value) => value + 1);
    };
    tick();
    const id = setInterval(tick, 5_000);
    return () => clearInterval(id);
  }, [hashSnoozeUntil, refresh]);

  useEffect(() => {
    if (!hashSnoozeExpiredAt) return;
    function onVisibilityChange() {
      const hidden = document.visibilityState === "hidden";
      setHashSnoozeRelativePaused(hidden);
      if (!hidden) {
        setHashSnoozeExpiredRelativeTick((value) => value + 1);
        setHashSnoozeRelativeUpdatedAt(new Date().toISOString());
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [hashSnoozeExpiredAt]);

  useEffect(() => {
    if (!hashSnoozeExpiredAt || hashSnoozeRelativePaused) return;
    const id = setInterval(() => {
      setHashSnoozeExpiredRelativeTick((value) => value + 1);
      setHashSnoozeRelativeUpdatedAt(new Date().toISOString());
    }, 1_000);
    return () => clearInterval(id);
  }, [hashSnoozeExpiredAt, hashSnoozeRelativePaused]);

  useEffect(() => {
    if (!rotationAuditSaveToast) return;
    const id = setTimeout(() => setRotationAuditSaveToast(null), 3_000);
    return () => clearTimeout(id);
  }, [rotationAuditSaveToast]);

  useEffect(() => {
    if (!dryRunBridgeUndoUrgencyFlashZone) return;
    const duration = dryRunBridgeUndoUrgencyFlashDurationMs(dryRunBridgeUndoUrgencyFlashZone);
    const id = setTimeout(() => setDryRunBridgeUndoUrgencyFlashZone(null), duration);
    return () => clearTimeout(id);
  }, [dryRunBridgeUndoUrgencyFlashZone]);

  useEffect(() => {
    if (!dryRunBridgeUndoUrgencyFlashDurationBorderPulseResumeAnnouncement) return;
    const id = setTimeout(
      () => setDryRunBridgeUndoUrgencyFlashDurationBorderPulseResumeAnnouncement(""),
      3_000,
    );
    return () => clearTimeout(id);
  }, [dryRunBridgeUndoUrgencyFlashDurationBorderPulseResumeAnnouncement]);

  useEffect(() => {
    if (!dryRunBridgeUndoUrgencyFlashDurationBorderPulsePauseAnnouncement) return;
    const id = setTimeout(
      () => setDryRunBridgeUndoUrgencyFlashDurationBorderPulsePauseAnnouncement(""),
      3_000,
    );
    return () => clearTimeout(id);
  }, [dryRunBridgeUndoUrgencyFlashDurationBorderPulsePauseAnnouncement]);

  useEffect(() => {
    if (!dryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverState) return;
    const id = setTimeout(() => setDryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverState(null), 3_000);
    return () => clearTimeout(id);
  }, [dryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverState]);

  useEffect(() => {
    if (!rotationAuditLegendWrapHint) return;
    const id = setTimeout(() => setRotationAuditLegendWrapHint(false), 1_500);
    return () => clearTimeout(id);
  }, [rotationAuditLegendWrapHint]);

  useEffect(() => {
    if (!rotationAuditLegendArrowHint) {
      setRotationAuditLegendArrowLiveAnnouncement("");
    }
  }, [rotationAuditLegendArrowHint]);

  useEffect(() => {
    if (!rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseResumeAnnouncement) return;
    const id = setTimeout(
      () => setRotationAuditLegendMixedClearEscapeOnlyLiveClearPulseResumeAnnouncement(""),
      3_000,
    );
    return () => clearTimeout(id);
  }, [rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseResumeAnnouncement]);

  useEffect(() => {
    if (!rotationAuditLegendMixedClearEscapeOnlyLiveClearPulsePauseAnnouncement) return;
    const id = setTimeout(
      () => setRotationAuditLegendMixedClearEscapeOnlyLiveClearPulsePauseAnnouncement(""),
      3_000,
    );
    return () => clearTimeout(id);
  }, [rotationAuditLegendMixedClearEscapeOnlyLiveClearPulsePauseAnnouncement]);

  useEffect(() => {
    if (!rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverState) return;
    const id = setTimeout(() => setRotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverState(null), 3_000);
    return () => clearTimeout(id);
  }, [rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverState]);

  useEffect(() => {
    if (!hashSnoozePrefixHelperSyncOverflowDedupeBadgeAtomicRestoreAnnouncement) return;
    const id = setTimeout(
      () => setHashSnoozePrefixHelperSyncOverflowDedupeBadgeAtomicRestoreAnnouncement(""),
      HASH_SNOOZE_PREFIX_HELPER_SYNC_DEDUPE_ATOMIC_RESTORE_ANNOUNCE_MS,
    );
    return () => clearTimeout(id);
  }, [hashSnoozePrefixHelperSyncOverflowDedupeBadgeAtomicRestoreAnnouncement]);

  useEffect(() => {
    if (!dryRunBridgeUndoToast) return;
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        undoDryRunBridgeRef.current();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dryRunBridgeUndoToast]);

  useEffect(() => {
    if (!dryRunBridgeUndoToast) {
      dryRunBridgeUndoUrgencyZoneRef.current = null;
      setDryRunBridgeUndoUrgencyLiveAnnouncement("");
      return;
    }
    const remainingMs = readDryRunBridgeUndoToast()?.remainingMs ?? 0;
    const pct = Math.max(0, Math.min(100, Math.round((remainingMs / DRY_RUN_BRIDGE_UNDO_MS) * 100)));
    const zone = pct <= 20 ? "red" : pct <= 40 ? "amber" : "normal";
    if (dryRunBridgeUndoUrgencyZoneRef.current && dryRunBridgeUndoUrgencyZoneRef.current !== zone) {
      setDryRunBridgeUndoUrgencyLiveAnnouncement(`Undo urgency changed to ${zone}`);
      setDryRunBridgeUndoUrgencyFlashZone(zone);
    }
    dryRunBridgeUndoUrgencyZoneRef.current = zone;
  }, [dryRunBridgeUndoToast, dryRunBridgeUndoCountdownTick]);

  useEffect(() => {
    if (!dryRunBridgeUndoToast) return;
    const id = setInterval(() => setDryRunBridgeUndoCountdownTick((value) => value + 1), 250);
    return () => clearInterval(id);
  }, [dryRunBridgeUndoToast]);

  useEffect(() => {
    if (!dryRunBridgeUndoToast) return;
    const stored = readDryRunBridgeUndoToast();
    const delay = stored?.remainingMs ?? DRY_RUN_BRIDGE_UNDO_MS;
    const id = setTimeout(() => setDryRunBridgeUndoToastPersisted(null), delay);
    return () => clearTimeout(id);
  }, [dryRunBridgeUndoToast]);

  useEffect(() => {
    if (!hashSnoozeExpiredNotice) {
      setHashSnoozeLiveAnnouncement("");
      hashSnoozeLivePausedRef.current = false;
      hashSnoozeLiveResumePendingRef.current = false;
      if (hashSnoozeLiveResumeTimerRef.current) {
        clearTimeout(hashSnoozeLiveResumeTimerRef.current);
        hashSnoozeLiveResumeTimerRef.current = null;
      }
      return;
    }
    if (hashSnoozeRelativePaused) {
      hashSnoozeLivePausedRef.current = true;
      hashSnoozeLiveResumePendingRef.current = false;
      if (hashSnoozeLiveResumeTimerRef.current) {
        clearTimeout(hashSnoozeLiveResumeTimerRef.current);
        hashSnoozeLiveResumeTimerRef.current = null;
      }
      return;
    }
    const relative =
      hashSnoozeExpiredAt && hashSnoozeExpiredRelativeTick >= 0 ?
        formatRelativeTimeFromIso(hashSnoozeExpiredAt)
      : null;
    const message =
      relative ? `${hashSnoozeExpiredNotice} · ${relative}` : hashSnoozeExpiredNotice;
    if (hashSnoozeLivePausedRef.current) {
      hashSnoozeLivePausedRef.current = false;
      hashSnoozeLiveResumePendingRef.current = true;
      if (hashSnoozeLiveResumeTimerRef.current) {
        clearTimeout(hashSnoozeLiveResumeTimerRef.current);
      }
      hashSnoozeLiveResumeTimerRef.current = setTimeout(() => {
        hashSnoozeLiveResumeTimerRef.current = null;
        hashSnoozeLiveResumePendingRef.current = false;
        setHashSnoozeLiveAnnouncement(
          hashSnoozeLiveResumePrefixEnabled ? `announcements resumed · ${message}` : message,
        );
      }, 300);
      return;
    }
    if (hashSnoozeLiveResumePendingRef.current) return;
    setHashSnoozeLiveAnnouncement(message);
  }, [
    hashSnoozeExpiredNotice,
    hashSnoozeExpiredAt,
    hashSnoozeExpiredRelativeTick,
    hashSnoozeRelativePaused,
    hashSnoozeLiveResumePrefixEnabled,
  ]);

  useEffect(
    () => () => {
      if (hashSnoozeLiveResumeTimerRef.current) {
        clearTimeout(hashSnoozeLiveResumeTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    function onMove(event: MouseEvent) {
      if (!mergeScrollScrubbingRef.current) return;
      const bar = mergeProfilesPreviewScrollBarRef.current;
      if (bar) jumpMergeProfilesPreviewScroll(event.clientX, bar);
    }
    function onTouchMove(event: TouchEvent) {
      if (!mergeScrollScrubbingRef.current) return;
      const bar = mergeProfilesPreviewScrollBarRef.current;
      const touch = event.touches[0];
      if (bar && touch) {
        event.preventDefault();
        jumpMergeProfilesPreviewScroll(touch.clientX, bar);
      }
    }
    function onUp() {
      const wasScrubbing = mergeScrollScrubbingRef.current;
      setMergeScrollScrubbingActive(false);
      if (wasScrubbing) {
        const element = mergeProfilesPreviewScrollRef.current;
        const throttleMs = mergeScrollScrubThrottleMsRef.current;
        mergeScrollScrubbingRef.current = false;
        mergeScrollScrubThrottleMsRef.current = null;
        setMergeProfilesPreviewScrollScrubThrottleMs(null);
        setMergeScrollDebouncePulseAtomicRestoreFlash(true);
        if (mergeScrollDebouncePulseAtomicRestoreFlashTimerRef.current) {
          clearTimeout(mergeScrollDebouncePulseAtomicRestoreFlashTimerRef.current);
        }
        mergeScrollDebouncePulseAtomicRestoreFlashTimerRef.current = setTimeout(() => {
          setMergeScrollDebouncePulseAtomicRestoreFlash(false);
          setMergeScrollDebouncePulseAtomicRestoreFlashRestored(true);
          mergeScrollDebouncePulseAtomicRestoreFlashTimerRef.current = null;
          if (mergeScrollDebouncePulseAtomicRestoreFlashRestoredTimerRef.current) {
            clearTimeout(mergeScrollDebouncePulseAtomicRestoreFlashRestoredTimerRef.current);
          }
          mergeScrollDebouncePulseAtomicRestoreFlashRestoredTimerRef.current = setTimeout(() => {
            setMergeScrollDebouncePulseAtomicRestoreFlashRestored(false);
            mergeScrollDebouncePulseAtomicRestoreFlashRestoredTimerRef.current = null;
          }, MERGE_SCROLL_SCRUB_ATOMIC_RESTORE_DEBOUNCE_MS);
        }, MERGE_SCROLL_SCRUB_ATOMIC_RESTORE_DEBOUNCE_MS);
        if (element) {
          const maxScroll = Math.max(0, element.scrollHeight - element.clientHeight);
          const scrollTop = element.scrollTop;
          if (mergeScrollAtomicRestoreTimerRef.current) {
            clearTimeout(mergeScrollAtomicRestoreTimerRef.current);
          }
          mergeScrollAtomicRestoreTimerRef.current = setTimeout(() => {
            announceMergeProfilesPreviewScrollSummary(scrollTop, maxScroll, throttleMs);
            mergeScrollAtomicRestoreTimerRef.current = null;
          }, MERGE_SCROLL_SCRUB_ATOMIC_RESTORE_DEBOUNCE_MS);
        }
      }
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onUp);
    document.addEventListener("touchcancel", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onUp);
      document.removeEventListener("touchcancel", onUp);
      if (mergeScrollAtomicRestoreTimerRef.current) {
        clearTimeout(mergeScrollAtomicRestoreTimerRef.current);
        mergeScrollAtomicRestoreTimerRef.current = null;
      }
      if (mergeScrollDebouncePulseAtomicRestoreFlashTimerRef.current) {
        clearTimeout(mergeScrollDebouncePulseAtomicRestoreFlashTimerRef.current);
        mergeScrollDebouncePulseAtomicRestoreFlashTimerRef.current = null;
      }
      if (mergeScrollDebouncePulseAtomicRestoreFlashRestoredTimerRef.current) {
        clearTimeout(mergeScrollDebouncePulseAtomicRestoreFlashRestoredTimerRef.current);
        mergeScrollDebouncePulseAtomicRestoreFlashRestoredTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!hashSnoozeExpiredNotice) return;
    hashSnoozeReturnFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    hashSnoozeExpiredDismissRef.current?.focus();
    function onTabTrap(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const root = hashSnoozeExpiredNoticeRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onTabTrap);
    return () => document.removeEventListener("keydown", onTabTrap);
  }, [hashSnoozeExpiredNotice]);

  useEffect(() => {
    if (!hashSnoozeExpiredNotice) return;
    function onPointerDown(event: MouseEvent) {
      const root = hashSnoozeExpiredNoticeRef.current;
      if (!root || root.contains(event.target as Node)) return;
      dismissHashSnoozeExpiredNoticeRef.current();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismissHashSnoozeExpiredNoticeRef.current();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [hashSnoozeExpiredNotice]);

  useEffect(() => {
    const saveReady =
      rotationAuditRetentionBaseline != null &&
      (rotationAuditRetentionBaseline.maxCount !== Number(rotationAuditRetentionMaxCount) ||
        rotationAuditRetentionBaseline.maxAgeDays !== Number(rotationAuditRetentionMaxAge));
    if (!saveReady) return;
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void saveRotationAuditRef.current(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [rotationAuditRetentionBaseline, rotationAuditRetentionMaxCount, rotationAuditRetentionMaxAge]);

  useEffect(() => {
    if (!mergeProfilesImportPreviewExpanded || !mergeProfilesImportPreviewJson) return;
    const el = mergeProfilesPreviewScrollRef.current;
    if (el) restoreMergeProfilesPreviewScroll(el);
  }, [mergeProfilesImportPreviewExpanded, mergeProfilesImportPreviewJson]);

  function refreshMergePresetProfileNames() {
    try {
      const raw = localStorage.getItem(MERGE_ACTION_PROFILES_KEY);
      if (!raw) {
        setMergePresetProfileNames([]);
        return;
      }
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      setMergePresetProfileNames(Object.keys(parsed).sort());
    } catch {
      setMergePresetProfileNames([]);
    }
  }

  function readHashSnoozeUntil(): string | null {
    if (typeof localStorage === "undefined") return null;
    try {
      const until = localStorage.getItem(HASH_TICK_SNOOZE_KEY);
      if (!until || Date.parse(until) <= Date.now()) return null;
      return until;
    } catch {
      return null;
    }
  }

  function formatRotationAuditRetentionBadge(policy: { maxCount: number; maxAgeDays: number }) {
    return `keep ${policy.maxCount} · max age ${policy.maxAgeDays}d`;
  }

  function formatRotationAuditDefaultsBadge(defaults: { maxCount: number; maxAgeDays: number }) {
    return `defaults keep ${defaults.maxCount} · max age ${defaults.maxAgeDays}d`;
  }

  function applyRotationAuditRetentionPolicy(
    policy: { maxCount: number; maxAgeDays: number },
    updateBaseline = false,
  ) {
    setRotationAuditRetentionMaxCount(String(policy.maxCount));
    setRotationAuditRetentionMaxAge(String(policy.maxAgeDays));
    setRotationAuditRetentionBadge(formatRotationAuditRetentionBadge(policy));
    if (updateBaseline) setRotationAuditRetentionBaseline(policy);
  }

  function formatRotationAuditRetentionDiff(
    previous: { maxCount: number; maxAgeDays: number },
    next: { maxCount: number; maxAgeDays: number },
  ) {
    const parts: string[] = [];
    if (previous.maxCount !== next.maxCount) parts.push(`maxCount ${previous.maxCount}→${next.maxCount}`);
    if (previous.maxAgeDays !== next.maxAgeDays) parts.push(`maxAgeDays ${previous.maxAgeDays}→${next.maxAgeDays}`);
    return parts.length ? parts.join(", ") : "unchanged";
  }

  function rotationAuditSaveToastTone(changed: { maxCount: boolean; maxAgeDays: boolean }, diff: string) {
    if (diff === "unchanged") return "unchanged" as const;
    if (changed.maxCount && changed.maxAgeDays) return "multi" as const;
    return "single" as const;
  }

  function rotationAuditSaveToastStyle(tone: "unchanged" | "single" | "multi") {
    if (tone === "unchanged") return { border: "1px solid var(--line, #444)" };
    if (tone === "single") return { border: "1px solid #c90" };
    return { border: "1px solid var(--accent, #4a9)" };
  }

  function rotationAuditToastLegendTooltip(tone: "unchanged" | "single" | "multi") {
    if (tone === "unchanged") return "No retention fields changed";
    if (tone === "single") return "One field changed (maxCount or maxAgeDays)";
    return "Both maxCount and maxAgeDays changed";
  }

  function setDryRunBridgeUndoToastPersisted(action: "installed" | "cleared" | null) {
    setDryRunBridgeUndoToast(action);
    persistDryRunBridgeUndoToast(action);
  }

  function persistDryRunExportLimit(limit: string) {
    setDryRunExportLimit(limit);
    try {
      localStorage.setItem(DRY_RUN_EXPORT_LIMIT_KEY, limit);
    } catch {
      /* ignore */
    }
  }

  function clearDryRunExportFilters() {
    setDryRunExportPreset("");
    setDryRunExportTemplateId("");
    setDryRunExportFilterWorkspace(true);
    setDryRunExportSince("");
    setDryRunExportUntil("");
    setDryRunExportBadge(null);
    setDryRunExportOut(null);
    setDryRunExportPath(null);
    setDryRunExportCopyOut(null);
    persistDryRunExportLimit("50");
    try {
      localStorage.removeItem(DRY_RUN_EXPORT_FILTERS_KEY);
    } catch {
      /* ignore */
    }
  }

  function restoreHashSnoozeReturnFocus() {
    const target = hashSnoozeReturnFocusRef.current;
    hashSnoozeReturnFocusRef.current = null;
    if (target && document.contains(target) && typeof target.focus === "function") {
      target.focus();
    }
  }

  function dismissHashSnoozeExpiredNotice() {
    setHashSnoozeExpiredNotice(null);
    setHashSnoozeExpiredAt(null);
    setHashSnoozeRelativeUpdatedAt(null);
    restoreHashSnoozeReturnFocus();
  }

  function clearHashSnooze() {
    localStorage.removeItem(HASH_TICK_SNOOZE_KEY);
    setHashSnoozeUntil(null);
  }

  function formatHashSnoozeRemaining(untilIso: string) {
    const ms = Date.parse(untilIso) - Date.now();
    if (ms <= 0) return null;
    const mins = Math.ceil(ms / 60_000);
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const rem = mins % 60;
      return rem ? `${hours}h ${rem}m remaining` : `${hours}h remaining`;
    }
    return `${mins}m remaining`;
  }

  function formatRelativeTimeFromIso(iso: string) {
    const ms = Date.now() - Date.parse(iso);
    if (Number.isNaN(ms) || ms < 0) return "just now";
    const sec = Math.floor(ms / 1000);
    if (sec < 60) return sec <= 5 ? "just now" : `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    return `${Math.floor(hr / 24)}d ago`;
  }

  function slugifyMergeProfileName(name: string) {
    return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "profile";
  }

  async function copyDryRunExportPath() {
    if (!dryRunExportPath) return;
    try {
      await navigator.clipboard.writeText(dryRunExportPath);
      setDryRunExportCopyOut("export path copied");
    } catch {
      setDryRunExportCopyOut("copy failed");
    }
  }

  function buildDryRunOpenPathCommand(path: string) {
    const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);
    return isMac ? `open -R ${JSON.stringify(path)}` : `xdg-open ${JSON.stringify(path)}`;
  }

  function buildDryRunOpenPathHint(path: string) {
    const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);
    return isMac ? `Finder: ${buildDryRunOpenPathCommand(path)}` : `Shell: ${buildDryRunOpenPathCommand(path)}`;
  }

  async function copyDryRunOpenPathCommand() {
    if (!dryRunExportPath) return;
    try {
      await navigator.clipboard.writeText(buildDryRunOpenPathCommand(dryRunExportPath));
      setDryRunExportCopyOut("open command copied");
    } catch {
      setDryRunExportCopyOut("copy failed");
    }
  }

  async function revealDryRunExportPath() {
    if (!dryRunExportPath) return;
    const reveal = window.devaios?.revealInFinder;
    if (typeof reveal === "function") {
      try {
        const ok = await reveal(dryRunExportPath);
        setDryRunExportCopyOut(ok ? "revealed in finder" : "reveal failed");
      } catch {
        setDryRunExportCopyOut("reveal failed");
      }
      return;
    }
    setDryRunExportCopyOut("native reveal unavailable — install dev bridge or use Copy open cmd");
  }

  function buildDryRunRevealBridgeSnippet() {
    return 'window.devaios = { revealInFinder: (path) => { console.log("[devaios] reveal", path); return true; } };';
  }

  function installDryRunRevealDevBridge() {
    applyDryRunRevealDevBridge();
    setDryRunRevealBridgeInstalled(true);
    setDryRunBridgeUndoToastPersisted("installed");
    setDryRunExportCopyOut("dev reveal bridge installed — try Reveal in Finder");
  }

  function requestInstallDryRunRevealDevBridge() {
    if (!window.confirm("Install dev reveal bridge for this browser session?")) return;
    installDryRunRevealDevBridge();
  }

  function uninstallDryRunRevealDevBridge() {
    clearDryRunRevealDevBridge();
    setDryRunRevealBridgeInstalled(false);
    setDryRunBridgeUndoToastPersisted("cleared");
    setDryRunExportCopyOut("dev reveal bridge cleared");
  }

  function requestUninstallDryRunRevealDevBridge() {
    if (!window.confirm("Clear dev reveal bridge for this browser session?")) return;
    uninstallDryRunRevealDevBridge();
  }

  function undoDryRunBridgeAction() {
    if (dryRunBridgeUndoToast === "installed") {
      clearDryRunRevealDevBridge();
      setDryRunRevealBridgeInstalled(false);
      setDryRunExportCopyOut("bridge install undone");
    } else if (dryRunBridgeUndoToast === "cleared") {
      applyDryRunRevealDevBridge();
      setDryRunRevealBridgeInstalled(true);
      setDryRunExportCopyOut("bridge clear undone");
    }
    setDryRunBridgeUndoToastPersisted(null);
  }
  undoDryRunBridgeRef.current = undoDryRunBridgeAction;

  async function copyDryRunRevealBridgeSnippet() {
    try {
      await navigator.clipboard.writeText(buildDryRunRevealBridgeSnippet());
      setDryRunExportCopyOut("bridge snippet copied — paste in devtools console");
    } catch {
      setDryRunExportCopyOut("copy failed");
    }
  }

  function resetMergeProfilesPreviewScroll() {
    try {
      localStorage.removeItem(MERGE_PROFILES_PREVIEW_SCROLL_KEY);
    } catch {
      /* ignore */
    }
    const element = mergeProfilesPreviewScrollRef.current;
    if (element) {
      element.scrollTop = 0;
      setMergeProfilesPreviewScrollMax(Math.max(0, element.scrollHeight - element.clientHeight));
    }
    setMergeProfilesPreviewScrollTop(0);
  }

  function syncMergeProfilesPreviewScrollMetrics(element: HTMLPreElement) {
    setMergeProfilesPreviewScrollTop(element.scrollTop);
    setMergeProfilesPreviewScrollMax(Math.max(0, element.scrollHeight - element.clientHeight));
  }

  function persistMergeProfilesPreviewScroll(scrollTop: number, element?: HTMLPreElement) {
    setMergeProfilesPreviewScrollTop(scrollTop);
    if (element) {
      setMergeProfilesPreviewScrollMax(Math.max(0, element.scrollHeight - element.clientHeight));
    }
    try {
      localStorage.setItem(MERGE_PROFILES_PREVIEW_SCROLL_KEY, String(scrollTop));
    } catch {
      /* ignore */
    }
  }

  function mergeProfilesPreviewScrollPct(scrollTop: number, maxScroll: number) {
    return maxScroll > 0 ? Math.min(100, Math.round((scrollTop / maxScroll) * 100)) : 0;
  }

  function computeMergeScrollScrubThrottleMs(scrollDistance: number) {
    return Math.max(
      MERGE_SCROLL_SCRUB_THROTTLE_MIN_MS,
      MERGE_SCROLL_SCRUB_THROTTLE_MAX_MS - scrollDistance * 3,
    );
  }

  function announceMergeProfilesPreviewScroll(scrollTop: number, maxScroll: number) {
    const pct = mergeProfilesPreviewScrollPct(scrollTop, maxScroll);
    setMergeProfilesPreviewScrollLiveAnnouncement(
      `Merge preview scrolled to ${scrollTop} of ${maxScroll} pixels (${pct}%)`,
    );
  }

  function announceMergeProfilesPreviewScrollScrub(scrollTop: number, maxScroll: number) {
    const pct = mergeProfilesPreviewScrollPct(scrollTop, maxScroll);
    setMergeProfilesPreviewScrollLiveAnnouncement(
      `Merge preview scrubbing at ${scrollTop} of ${maxScroll} pixels (${pct}%)`,
    );
  }

  function announceMergeProfilesPreviewScrollSummary(
    scrollTop: number,
    maxScroll: number,
    throttleMs?: number | null,
  ) {
    const pct = mergeProfilesPreviewScrollPct(scrollTop, maxScroll);
    const throttleLabel =
      throttleMs != null ? ` · last throttle ${Math.round(throttleMs)}ms` : "";
    setMergeProfilesPreviewScrollLiveAnnouncement(
      `Merge preview scrub finished at ${scrollTop} of ${maxScroll} pixels (${pct}%)${throttleLabel} · scroll bar aria returned to ${pct}% scroll mode · live region aria-atomic restored · debounce pulse aria-atomic restored · debounce pulse atomic flash ${MERGE_SCROLL_SCRUB_ATOMIC_RESTORE_DEBOUNCE_MS}ms · atomic restore debounce ${MERGE_SCROLL_SCRUB_ATOMIC_RESTORE_DEBOUNCE_MS}ms`,
    );
  }

  function jumpMergeProfilesPreviewScroll(clientX: number, barElement: HTMLDivElement) {
    const element = mergeProfilesPreviewScrollRef.current;
    if (!element) return;
    const maxScroll = Math.max(0, element.scrollHeight - element.clientHeight);
    if (maxScroll <= 0) return;
    const rect = barElement.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const scrollTop = Math.round(ratio * maxScroll);
    element.scrollTop = scrollTop;
    persistMergeProfilesPreviewScroll(scrollTop, element);
    if (mergeScrollScrubbingRef.current) {
      const now = Date.now();
      const scrollDistance = Math.abs(scrollTop - mergeScrollLastAnnounceScrollRef.current);
      const throttleMs = computeMergeScrollScrubThrottleMs(scrollDistance);
      setMergeProfilesPreviewScrollScrubThrottleMs(throttleMs);
      mergeScrollScrubThrottleMsRef.current = throttleMs;
      if (now - mergeScrollAnnounceRef.current >= throttleMs) {
        mergeScrollAnnounceRef.current = now;
        mergeScrollLastAnnounceScrollRef.current = scrollTop;
        announceMergeProfilesPreviewScrollScrub(scrollTop, maxScroll);
      }
    }
  }

  function announceMergeProfilesPreviewScrollScrubStart() {
    setMergeProfilesPreviewScrollLiveAnnouncement(
      `Merge preview scrub started · throttle aria ${MERGE_SCROLL_SCRUB_THROTTLE_MIN_MS} to ${MERGE_SCROLL_SCRUB_THROTTLE_MAX_MS}ms mode`,
    );
  }

  function startMergeProfilesPreviewScrollScrub(clientX: number, barElement: HTMLDivElement) {
    mergeScrollScrubbingRef.current = true;
    setMergeScrollScrubbingActive(true);
    mergeScrollLastAnnounceScrollRef.current =
      mergeProfilesPreviewScrollRef.current?.scrollTop ?? 0;
    announceMergeProfilesPreviewScrollScrubStart();
    jumpMergeProfilesPreviewScroll(clientX, barElement);
  }

  function nudgeMergeProfilesPreviewScroll(delta: number, announce = false) {
    const element = mergeProfilesPreviewScrollRef.current;
    if (!element) return;
    const maxScroll = Math.max(0, element.scrollHeight - element.clientHeight);
    const scrollTop = Math.min(maxScroll, Math.max(0, element.scrollTop + delta));
    element.scrollTop = scrollTop;
    persistMergeProfilesPreviewScroll(scrollTop, element);
    if (announce) announceMergeProfilesPreviewScroll(scrollTop, maxScroll);
  }

  function onMergeProfilesPreviewScrollBarKeyDown(event: {
    key: string;
    shiftKey: boolean;
    preventDefault: () => void;
  }) {
    if (mergeProfilesPreviewScrollMax <= 0) return;
    const step = event.shiftKey ? 40 : 16;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      nudgeMergeProfilesPreviewScroll(step, true);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      nudgeMergeProfilesPreviewScroll(-step, true);
    } else if (event.key === "PageDown") {
      event.preventDefault();
      nudgeMergeProfilesPreviewScroll(80, true);
    } else if (event.key === "PageUp") {
      event.preventDefault();
      nudgeMergeProfilesPreviewScroll(-80, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      nudgeMergeProfilesPreviewScroll(-mergeProfilesPreviewScrollTop, true);
    } else if (event.key === "End") {
      event.preventDefault();
      nudgeMergeProfilesPreviewScroll(mergeProfilesPreviewScrollMax - mergeProfilesPreviewScrollTop, true);
    }
  }

  function persistRotationAuditToastLegendExpanded(expanded: boolean) {
    setRotationAuditToastLegendExpanded(expanded);
    if (!expanded) {
      setRotationAuditLegendArrowHint(null);
    }
    try {
      localStorage.setItem(ROTATION_AUDIT_TOAST_LEGEND_KEY, expanded ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  function persistHashSnoozeLiveResumePrefix(enabled: boolean) {
    setHashSnoozeLiveResumePrefixEnabled(enabled);
    try {
      localStorage.setItem(HASH_SNOOZE_LIVE_RESUME_PREFIX_KEY, enabled ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  function persistHashSnoozeLiveResumePrefixHelpExpanded(expanded: boolean, compact = false) {
    if (compact) {
      setHashSnoozeLiveResumePrefixHelpCompactExpanded(expanded);
    } else {
      setHashSnoozeLiveResumePrefixHelpExpanded(expanded);
    }
    try {
      localStorage.setItem(
        compact ? HASH_SNOOZE_LIVE_RESUME_PREFIX_HELP_COMPACT_KEY : HASH_SNOOZE_LIVE_RESUME_PREFIX_HELP_KEY,
        expanded ? "1" : "0",
      );
    } catch {
      /* ignore */
    }
  }

  function stopRotationAuditLegendMixedClearEscapeOnlyLiveClearCountdown() {
    if (rotationAuditLegendMixedClearEscapeOnlyLiveClearTickRef.current) {
      clearInterval(rotationAuditLegendMixedClearEscapeOnlyLiveClearTickRef.current);
      rotationAuditLegendMixedClearEscapeOnlyLiveClearTickRef.current = null;
    }
    setRotationAuditLegendMixedClearEscapeOnlyLiveClearSec(null);
  }

  function scheduleRotationAuditLegendMixedClearEscapeOnlyLiveClear() {
    if (rotationAuditLegendMixedClearEscapeOnlyLiveTimerRef.current) {
      clearTimeout(rotationAuditLegendMixedClearEscapeOnlyLiveTimerRef.current);
      rotationAuditLegendMixedClearEscapeOnlyLiveTimerRef.current = null;
    }
    stopRotationAuditLegendMixedClearEscapeOnlyLiveClearCountdown();
    const generation = ++rotationAuditLegendMixedClearEscapeOnlyLiveClearGenRef.current;
    setRotationAuditLegendMixedClearEscapeOnlyLiveClearSec(3);
    rotationAuditLegendMixedClearEscapeOnlyLiveClearTickRef.current = setInterval(() => {
      setRotationAuditLegendMixedClearEscapeOnlyLiveClearSec((prev) => (prev != null && prev > 1 ? prev - 1 : prev));
    }, 1_000);
    rotationAuditLegendMixedClearEscapeOnlyLiveTimerRef.current = setTimeout(() => {
      if (generation !== rotationAuditLegendMixedClearEscapeOnlyLiveClearGenRef.current) return;
      setRotationAuditLegendMixedClearEscapeOnlyLiveAnnouncement("");
      stopRotationAuditLegendMixedClearEscapeOnlyLiveClearCountdown();
      rotationAuditLegendMixedClearEscapeOnlyLiveTimerRef.current = null;
    }, 3_000);
  }

  function persistRotationAuditLegendMixedClearEscapeOnly(enabled: boolean) {
    setRotationAuditLegendMixedClearEscapeOnly(enabled);
    setRotationAuditLegendMixedClearEscapeOnlyLiveAnnouncement(
      `Escape only mixed clear ${enabled ? "enabled" : "disabled"}`,
    );
    scheduleRotationAuditLegendMixedClearEscapeOnlyLiveClear();
    try {
      localStorage.setItem(ROTATION_AUDIT_LEGEND_MIXED_CLEAR_ESCAPE_ONLY_KEY, enabled ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  function clearRotationAuditLegendArrowHint(returnFocus = false) {
    setRotationAuditLegendArrowHint(null);
    setRotationAuditLegendArrowLiveAnnouncement("");
    if (returnFocus) rotationAuditLegendToggleRef.current?.focus();
  }

  function nudgeRotationAuditLegendFocus(
    direction: "left" | "right",
    fromIndex: number,
    options?: { focusPill?: boolean; setHint?: boolean },
  ) {
    const wrapped =
      (direction === "right" && fromIndex === 2) || (direction === "left" && fromIndex === 0);
    const next = direction === "right" ? (fromIndex + 1) % 3 : (fromIndex + 2) % 3;
    setRotationAuditLegendFocusIndex(next);
    const tone = (["unchanged", "single", "multi"] as const)[next];
    if (options?.setHint) {
      setRotationAuditLegendFocusHint(rotationAuditToastLegendTooltip(tone));
    }
    if (wrapped) setRotationAuditLegendWrapHint(true);
    if (options?.focusPill) {
      rotationAuditLegendRefs.current[next]?.focus();
      if (!rotationAuditLegendMixedClearEscapeOnly) clearRotationAuditLegendArrowHint();
    }
  }

  function onRotationAuditLegendKeyDown(
    event: { key: string; preventDefault: () => void; stopPropagation: () => void },
    index: number,
  ) {
    if (event.key === "Escape") {
      if (rotationAuditLegendArrowHint) {
        event.preventDefault();
        clearRotationAuditLegendArrowHint(true);
      }
      return;
    }
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    event.stopPropagation();
    nudgeRotationAuditLegendFocus(event.key === "ArrowRight" ? "right" : "left", index, {
      focusPill: true,
      setHint: true,
    });
  }

  function onRotationAuditLegendContainerKeyDown(event: { key: string; preventDefault: () => void }) {
    if (event.key === "Escape") {
      if (rotationAuditLegendArrowHint) {
        event.preventDefault();
        clearRotationAuditLegendArrowHint(true);
      }
      return;
    }
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? "right" : "left";
    const next =
      direction === "right" ?
        (rotationAuditLegendFocusIndex + 1) % 3
      : (rotationAuditLegendFocusIndex + 2) % 3;
    nudgeRotationAuditLegendFocus(direction, rotationAuditLegendFocusIndex);
    const badgeLabel = `badge ${next + 1}/3 · ←/→`;
    setRotationAuditLegendArrowHint(badgeLabel);
    setRotationAuditLegendArrowLiveAnnouncement(`Legend badge moved to ${next + 1} of 3`);
  }

  function restoreMergeProfilesPreviewScroll(element: HTMLPreElement) {
    try {
      const saved = localStorage.getItem(MERGE_PROFILES_PREVIEW_SCROLL_KEY);
      const scrollTop = saved != null ? Number(saved) || 0 : 0;
      element.scrollTop = scrollTop;
      syncMergeProfilesPreviewScrollMetrics(element);
    } catch {
      /* ignore */
    }
  }

  function persistMergeProfilesPreviewExpanded(expanded: boolean) {
    setMergeProfilesImportPreviewExpanded(expanded);
    try {
      localStorage.setItem(MERGE_PROFILES_PREVIEW_EXPANDED_KEY, expanded ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  function formatDryRunLimitHint(
    matchCount: number,
    exportCount: number,
    exportLimit: number,
    truncated: boolean,
  ) {
    if (truncated) return `${matchCount} matches · export ${exportCount}/${exportLimit} cap`;
    return `${matchCount} matches · export ${exportCount}`;
  }

  useEffect(() => {
    const body: {
      workspaceSlug?: string;
      templateId?: string;
      since?: string;
      until?: string;
      presetRange?: "24h" | "7d" | "30d";
      limit?: number;
    } = {};
    const exportLimit = Number(dryRunExportLimit) || 50;
    body.limit = exportLimit;
    if (dryRunExportFilterWorkspace && selectedSlug) body.workspaceSlug = selectedSlug;
    if (dryRunExportTemplateId.trim()) body.templateId = dryRunExportTemplateId.trim();
    if (dryRunExportPreset) body.presetRange = dryRunExportPreset;
    else {
      if (dryRunExportSince.trim()) body.since = new Date(dryRunExportSince).toISOString();
      if (dryRunExportUntil.trim()) body.until = new Date(dryRunExportUntil).toISOString();
    }
    const hasFilter =
      body.workspaceSlug || body.templateId || body.presetRange || body.since || body.until;
    if (!hasFilter) {
      setDryRunPreviewCount(null);
      setDryRunPreviewExportCount(null);
      setDryRunPreviewExportLimit(null);
      setDryRunPreviewTruncated(false);
      return;
    }
    void api<{
      matchCount: number;
      exportCount: number;
      exportLimit: number;
      truncated: boolean;
      limitPresets?: number[];
    }>("/job-templates/notifications/dry-run/preview-filters", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((res) => {
        setDryRunPreviewCount(res.matchCount);
        setDryRunPreviewExportCount(res.exportCount);
        setDryRunPreviewExportLimit(res.exportLimit);
        setDryRunPreviewTruncated(res.truncated);
        if (res.limitPresets?.length) setDryRunExportLimitPresets(res.limitPresets);
      })
      .catch(() => {
        setDryRunPreviewCount(null);
        setDryRunPreviewExportCount(null);
        setDryRunPreviewExportLimit(null);
        setDryRunPreviewTruncated(false);
      });
  }, [
    dryRunExportPreset,
    dryRunExportFilterWorkspace,
    selectedSlug,
    dryRunExportTemplateId,
    dryRunExportSince,
    dryRunExportUntil,
    dryRunExportLimit,
  ]);

  const refreshProjects = useCallback(async () => {
    if (!selectedSlug) return;
    try {
      const [proj, mem] = await Promise.all([
        api<{ projects: Project[] }>(`/workspaces/${selectedSlug}/projects`),
        api<{ memories: Memory[] }>(`/workspaces/${selectedSlug}/memories`),
      ]);
      setProjects(proj.projects);
      setMemoryList(mem.memories);
    } catch {
      setProjects([]);
      setMemoryList([]);
    }
  }, [selectedSlug]);

  const refreshJobTemplates = useCallback(async () => {
    if (!selectedSlug) return;
    try {
      const [tpl, runs, notes, notesWebhook, notesEmail, rotationAuditRetention] = await Promise.all([
        api<{ templates: JobTemplateRow[] }>(`/workspaces/${selectedSlug}/job-templates`).catch(() => ({
          templates: [] as JobTemplateRow[],
        })),
        api<{
          runs: Array<{
            templateId: string;
            kind: string;
            lastRunAt: string;
            lastPath?: string | null;
            lastError?: string | null;
          }>;
        }>(`/job-templates/run-state?workspace=${encodeURIComponent(selectedSlug)}`).catch(() => ({ runs: [] })),
        api<{
          notifications: Array<{
            id: string;
            templateId: string;
            kind: string;
            status: "ok" | "error";
            message: string;
            path?: string | null;
            createdAt: string;
            read: boolean;
          }>;
          unread: number;
        }>(`/job-templates/notifications?workspace=${encodeURIComponent(selectedSlug)}&unread=1`).catch(() => ({
          notifications: [],
          unread: 0,
        })),
        api<{ webhook: { enabled: boolean; url: string | null; maxRetries?: number } }>(
          "/job-templates/notifications/webhook",
        ).catch(() => ({ webhook: { enabled: false, url: null, maxRetries: 3 } })),
        api<{
          email: {
            enabled: boolean;
            from: string | null;
            to: string | null;
            smtpHost: string | null;
            smtpPort: number | null;
            useOutbox: boolean;
            sendViaSmtp?: boolean;
            smtpSecure?: boolean;
            smtpUser?: string | null;
          };
        }>("/job-templates/notifications/email").catch(() => ({
          email: {
            enabled: false,
            from: null,
            to: null,
            smtpHost: null,
            smtpPort: null,
            useOutbox: true,
            sendViaSmtp: false,
            smtpSecure: false,
            smtpUser: null,
          },
        })),
        api<{
          policy: { maxCount: number; maxAgeDays: number };
          defaults: { maxCount: number; maxAgeDays: number };
          matchesDefaults: boolean;
        }>(
          "/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/retention",
        ).catch(() => ({
          policy: { maxCount: 200, maxAgeDays: 365 },
          defaults: { maxCount: 200, maxAgeDays: 365 },
          matchesDefaults: true,
        })),
      ]);
      setJobTemplates(tpl.templates);
      setTemplateRunHistory(runs.runs);
      setTemplateNotifications(notes.notifications);
      setNotificationWebhookEnabled(notesWebhook.webhook.enabled);
      setNotificationWebhookUrl(notesWebhook.webhook.url ?? "");
      setNotificationWebhookMaxRetries(String(notesWebhook.webhook.maxRetries ?? 3));
      setNotificationEmailEnabled(notesEmail.email.enabled);
      setNotificationEmailFrom(notesEmail.email.from ?? "");
      setNotificationEmailTo(notesEmail.email.to ?? "");
      setNotificationEmailSmtpHost(notesEmail.email.smtpHost ?? "");
      setNotificationEmailSmtpPort(String(notesEmail.email.smtpPort ?? 587));
      setNotificationEmailUseOutbox(notesEmail.email.useOutbox !== false);
      setNotificationEmailSendViaSmtp(Boolean(notesEmail.email.sendViaSmtp));
      setNotificationEmailSmtpSecure(Boolean(notesEmail.email.smtpSecure));
      setNotificationEmailSmtpUser(notesEmail.email.smtpUser ?? "");
      setRotationAuditRetentionMaxCount(String(rotationAuditRetention.policy.maxCount));
      setRotationAuditRetentionMaxAge(String(rotationAuditRetention.policy.maxAgeDays));
      setRotationAuditRetentionDefaults(rotationAuditRetention.defaults);
      applyRotationAuditRetentionPolicy(rotationAuditRetention.policy, true);
    } catch {
      setJobTemplates([]);
      setTemplateRunHistory([]);
    }
  }, [selectedSlug]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    void refreshJobTemplates();
  }, [refreshJobTemplates]);

  useEffect(() => {
    if (!selectedSlug) return;
    const es = new EventSource(
      `${API}/job-templates/notifications/stream?workspace=${encodeURIComponent(selectedSlug)}`,
    );
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data) as {
          type: string;
          notifications?: Array<{
            id: string;
            templateId: string;
            kind: string;
            status: "ok" | "error";
            message: string;
            path?: string | null;
            createdAt: string;
            read: boolean;
          }>;
          unread?: number;
        };
        if (data.type === "notifications" && data.notifications?.length) {
          setTemplateNotifications((prev) => {
            const ids = new Set(prev.map((n) => n.id));
            const merged = [...data.notifications!.filter((n) => !ids.has(n.id)), ...prev];
            return merged.slice(0, 50);
          });
          setNotificationStreamOut(`live · ${data.unread ?? 0} unread`);
        }
      } catch {
        /* ignore malformed SSE payloads */
      }
    };
    return () => es.close();
  }, [selectedSlug]);

  useEffect(() => {
    void refreshProjects();
  }, [refreshProjects]);

  const refreshConversations = useCallback(async () => {
    if (!selectedSlug) return;
    try {
      const q = convSearch.trim() ? `?q=${encodeURIComponent(convSearch.trim())}` : "";
      const convs = await api<{ conversations: ConversationRow[] }>(
        `/workspaces/${selectedSlug}/conversations${q}`,
      );
      setConvList(convs.conversations);
    } catch {
      setConvList([]);
    }
  }, [selectedSlug, convSearch]);

  const refreshApprovals = useCallback(async () => {
    if (!selectedSlug) return;
    try {
      const res = await api<{ approvals: ApprovalRow[] }>(
        `/workspaces/${selectedSlug}/approvals?status=pending`,
      );
      setApprovalList(res.approvals);
    } catch {
      setApprovalList([]);
    }
  }, [selectedSlug]);

  useEffect(() => {
    void refreshConversations();
  }, [refreshConversations]);

  useEffect(() => {
    void refreshApprovals();
  }, [refreshApprovals]);

  async function onLoadConversation(id: string) {
    setError(null);
    try {
      setSelectedConversationId(id);
      const res = await api<{ messages: ChatMessage[] }>(`/conversations/${id}/messages`);
      setConvMessages(res.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onNewConversation() {
    setSelectedConversationId(null);
    setConvMessages([]);
  }

  async function onCreateWorkspace(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api("/workspaces", { method: "POST", body: JSON.stringify({ name, slug }) });
      setSelectedSlug(slug);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onCreateProject(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api(`/workspaces/${selectedSlug}/projects`, {
        method: "POST",
        body: JSON.stringify({ name: projectName, slug: projectSlug }),
      });
      await refreshProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onRegisterMcp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api("/mcp/servers", {
        method: "POST",
        body: JSON.stringify({ name: mcpName, command: mcpCommand, args: ["devaios-mcp-ok"] }),
      });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onProbe(id: string) {
    setError(null);
    try {
      const res = await api<{ probe: Record<string, unknown> }>(`/mcp/servers/${id}/probe`, {
        method: "POST",
      });
      setProbeOut(JSON.stringify(res.probe, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onToggleMcp(id: string, enabled: boolean) {
    await api(`/mcp/servers/${id}`, { method: "PATCH", body: JSON.stringify({ enabled }) });
    await refresh();
  }

  async function onRemoveMcp(id: string) {
    await api(`/mcp/servers/${id}`, { method: "DELETE" });
    await refresh();
  }

  async function onListTools(id: string) {
    setError(null);
    try {
      const res = await api<{ tools: Record<string, unknown> }>(`/mcp/servers/${id}/tools`, {
        method: "POST",
      });
      setToolsOut(JSON.stringify(res.tools, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onCallTool(id: string, tool: string, args: Record<string, unknown> = {}) {
    setError(null);
    try {
      const res = await api<{ call: Record<string, unknown> }>(`/mcp/servers/${id}/call`, {
        method: "POST",
        body: JSON.stringify({ tool, arguments: args }),
      });
      setCallOut(JSON.stringify(res.call, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onChat(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await api<Record<string, unknown>>("/agent/chat", {
        method: "POST",
        body: JSON.stringify({
          workspaceSlug: selectedSlug,
          message: chatMessage,
          useTools,
          maxToolRounds: 2,
          conversationId: selectedConversationId ?? undefined,
          approveDestructive,
        }),
      });
      setChatOut(JSON.stringify(res, null, 2));
      if (typeof res.conversationId === "string") {
        setSelectedConversationId(res.conversationId);
      }
      await refreshConversations();
      await refreshApprovals();
      if (typeof res.conversationId === "string") {
        await onLoadConversation(res.conversationId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onStreamChat() {
    setError(null);
    setStreamOut("");
    try {
      const res = await fetch(`${API}/agent/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceSlug: selectedSlug,
          message: chatMessage,
          useTools: streamTools,
          maxToolRounds: 2,
          approveDestructive,
        }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text());
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() ?? "";
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;
          const json = JSON.parse(line.slice(5).trim()) as {
            type?: string;
            text?: string;
            server?: string;
            tool?: string;
            ok?: boolean;
          };
          if (json.type === "token" && json.text) setStreamOut((s) => s + json.text);
          if (json.type === "tool_call") {
            setStreamOut((s) => s + `\n[tool_call ${json.server}/${json.tool}]\n`);
          }
          if (json.type === "tool_result") {
            setStreamOut((s) => s + `[tool_result ${json.server}/${json.tool} ok=${String(json.ok)}]\n`);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onGraphifyBuildAsync() {
    setError(null);
    setJobOut("");
    try {
      const res = await api<{ job: { id: string; status: string } }>("/graphify/build/async", {
        method: "POST",
        body: JSON.stringify({ cwd: "/Users/ad/Desktop/devos", mode: "update" }),
      });
      setJobOut(JSON.stringify(res.job, null, 2));

      const streamRes = await fetch(`${API}/jobs/${res.job.id}/stream`);
      if (!streamRes.ok || !streamRes.body) throw new Error(await streamRes.text());
      const reader = streamRes.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() ?? "";
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;
          const json = JSON.parse(line.slice(5).trim()) as {
            type?: string;
            job?: Record<string, unknown>;
          };
          if (json.job) setJobOut(JSON.stringify(json.job, null, 2));
          if (json.type === "done") return;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onApprove(id: string) {
    await api(`/workspaces/${selectedSlug}/approvals/${id}/approve`, { method: "POST" });
    await refreshApprovals();
  }

  async function onReject(id: string) {
    await api(`/workspaces/${selectedSlug}/approvals/${id}/reject`, { method: "POST" });
    await refreshApprovals();
  }

  async function onGraphifyBuild() {
    setError(null);
    try {
      const res = await api<Record<string, unknown>>("/graphify/build", {
        method: "POST",
        body: JSON.stringify({ cwd: "/Users/ad/Desktop/devos", mode: "update" }),
      });
      setGraphOut(JSON.stringify(res, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onGraphifyQuery(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await api<Record<string, unknown>>("/graphify/query", {
        method: "POST",
        body: JSON.stringify({ query: graphQuery, cwd: "/Users/ad/Desktop/devos" }),
      });
      setGraphOut(JSON.stringify(res, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onRegisterEcho() {
    setError(null);
    try {
      await api("/mcp/echo/register", { method: "POST" });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onRegisterGraphify() {
    setError(null);
    try {
      const res = await api<Record<string, unknown>>("/mcp/graphify/register", { method: "POST" });
      setToolsOut(JSON.stringify(res, null, 2));
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onSetSecret(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api("/secrets", {
        method: "POST",
        body: JSON.stringify({ name: secretName, value: secretValue }),
      });
      setSecretValue("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onAddMemory(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api(`/workspaces/${selectedSlug}/memories`, {
        method: "POST",
        body: JSON.stringify({
          kind: "architecture",
          title: memoryTitle,
          content: memoryContent,
        }),
      });
      await refreshProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  function parseSlugList(raw: string): string[] | undefined {
    const trimmed = raw.trim();
    if (!trimmed) return undefined;
    return trimmed.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
  }

  async function onToggleProvider(id: string, enabled: boolean) {
    setError(null);
    try {
      await api(`/providers/${id}`, { method: "PATCH", body: JSON.stringify({ enabled }) });
      setProviderCooldownOut(null);
      await refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("cooldown_active") || msg.includes("429")) {
        setProviderCooldownOut(`enable blocked — cooldown active (${msg})`);
      } else {
        setError(msg);
      }
    }
  }

  async function onPack() {
    setError(null);
    try {
      const res = await api<{ bundle: Bundle; pinnedMemories?: number }>("/context/pack", {
        method: "POST",
        body: JSON.stringify({
          budgetTokens: 800,
          workspaceSlug: selectedSlug,
          pins: [{ source: "policy", content: "Never exfiltrate secrets. Confirm destructive actions." }],
          items: [
            {
              source: "readme",
              content: "DEVAIOS local-web hub with Postgres, MCP-first plugins, and CCE. ".repeat(40),
            },
            { source: "dup", content: "same" },
            { source: "dup2", content: "same" },
            { source: "note", content: `Workspace ${selectedSlug} context note.` },
          ],
        }),
      });
      setBundle(res.bundle);
      if (typeof res.pinnedMemories === "number") {
        setToolsOut(`pinnedMemories=${res.pinnedMemories}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onExportConversations() {
    setError(null);
    try {
      const res = await api<{ path: string }>(
        `/workspaces/${selectedSlug}/export/conversations?save=1`,
      );
      setExportPath(res.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onExportArchive() {
    setError(null);
    try {
      const res = await api<{ path: string; encrypted?: boolean; signed?: boolean; rotation?: { deleted: string[]; kept: number } }>(
        "/export/conversations/archive",
        {
          method: "POST",
          body: JSON.stringify({
            save: true,
            encrypt: encryptArchive,
            sign: signArchive,
            passphrase: archivePassphrase || undefined,
          }),
        },
      );
      setArchivePath(
        `${res.path}${res.encrypted ? " (encrypted)" : ""}${res.signed ? " (signed)" : ""}${res.rotation ? ` · kept ${res.rotation.kept}` : ""}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onImportConversations() {
    if (!importPath.trim()) return;
    setError(null);
    try {
      const res = await api<{
        importedConversations: number;
        importedMessages: number;
        skippedConversations: number;
        mergedByTitle?: number;
      }>(`/workspaces/${selectedSlug}/import/conversations`, {
        method: "POST",
        body: JSON.stringify({ path: importPath.trim(), dedupeByTitle }),
      });
      setImportResult(
        `imported ${res.importedConversations} conversations, ${res.importedMessages} messages (${res.skippedConversations} skipped${res.mergedByTitle ? `, ${res.mergedByTitle} merged by title` : ""})`,
      );
      await refreshConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onPreviewArchiveImport() {
    if (!archiveImportPath.trim()) return;
    setError(null);
    try {
      let slugMap: Record<string, string> | undefined;
      if (slugMapJson.trim() && slugMapJson.trim() !== "{}") {
        slugMap = JSON.parse(slugMapJson) as Record<string, string>;
      }
      const res = await api<{
        preview: {
          selectedWorkspaces: number;
          totalWorkspaces: number;
          conflictPolicy: "skip" | "replace";
          totals: { wouldInsert: number; wouldSkip: number; wouldReplace: number; conversations: number };
          workspaces: Array<{
            slug: string;
            targetSlug: string;
            found: boolean;
            conversationCount: number;
            selected: boolean;
            conflicts: { wouldInsert: number; wouldSkip: number; wouldReplace: number };
            conversations: Array<{
              id: string;
              title: string;
              messageCount: number;
              selected: boolean;
              conflict: "insert" | "skip" | "replace";
            }>;
          }>;
        };
      }>("/import/conversations/archive/preview", {
        method: "POST",
        body: JSON.stringify({
          path: archiveImportPath.trim(),
          slugMap,
          workspaceSlugs: parseSlugList(archiveImportSlugs),
          conversationIds: archiveConversationPicks.filter((c) => c.selected).map((c) => c.id),
          passphrase: archivePassphrase || undefined,
          conflictPolicy: archiveImportConflictPolicy,
        }),
      });
      const picks: ArchiveConversationPick[] = [];
      for (const ws of res.preview.workspaces) {
        if (!ws.selected) continue;
        for (const conv of ws.conversations ?? []) {
          picks.push({
            ...conv,
            workspaceSlug: ws.slug,
          });
        }
      }
      setArchiveConversationPicks(picks);
      const lines = res.preview.workspaces
        .filter((w) => w.selected)
        .map(
          (w) =>
            `${w.slug}→${w.targetSlug}:${w.found ? `+${w.conflicts.wouldInsert}/skip ${w.conflicts.wouldSkip}/replace ${w.conflicts.wouldReplace}` : "missing"}`,
        )
        .join(", ");
      setArchiveImportPreview(
        `${res.preview.selectedWorkspaces}/${res.preview.totalWorkspaces} selected · policy ${res.preview.conflictPolicy} · totals +${res.preview.totals.wouldInsert}/skip ${res.preview.totals.wouldSkip}/replace ${res.preview.totals.wouldReplace} — ${lines || "none"}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onImportArchive() {
    if (!archiveImportPath.trim()) return;
    setError(null);
    try {
      let slugMap: Record<string, string> | undefined;
      if (slugMapJson.trim() && slugMapJson.trim() !== "{}") {
        slugMap = JSON.parse(slugMapJson) as Record<string, string>;
      }
      const res = await api<{
        workspaces: Array<{ slug: string; targetSlug: string; found: boolean; importedConversations: number }>;
      }>("/import/conversations/archive", {
        method: "POST",
        body: JSON.stringify({
          path: archiveImportPath.trim(),
          dedupeByTitle,
          slugMap,
          workspaceSlugs: parseSlugList(archiveImportSlugs),
          conversationIds: archiveConversationPicks.filter((c) => c.selected).map((c) => c.id),
          passphrase: archivePassphrase || undefined,
          conflictPolicy: archiveImportConflictPolicy,
        }),
      });
      const summary = res.workspaces
        .map((w) => `${w.slug}→${w.targetSlug}:${w.found ? w.importedConversations : "missing"}`)
        .join(", ");
      setImportResult(`archive import — ${summary}`);
      await refreshConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  function onFailoverDrop(targetIdx: number) {
    if (failoverDragIdx === null || failoverDragIdx === targetIdx) return;
    setFailoverOrder((prev) => {
      const next = [...prev];
      const [item] = next.splice(failoverDragIdx, 1);
      next.splice(targetIdx, 0, item);
      return next;
    });
    setFailoverDragIdx(null);
  }

  async function onSaveFailover() {
    setError(null);
    try {
      const res = await api<{ order: string[] }>("/providers/failover", {
        method: "PUT",
        body: JSON.stringify({ order: failoverOrder }),
      });
      setFailoverOrder(res.order);
      setFailoverProbeOut("failover order saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onProbeFailover() {
    setError(null);
    try {
      const res = await api<{
        probes: Array<{ kind: string; ok: boolean; latencyMs?: number; error?: string }>;
        autoDisabled?: { disabled: Array<{ id: string; kind: string; name: string }> };
      }>("/providers/failover/probe", {
        method: "POST",
        body: JSON.stringify({ autoDisable: autoDisableProviders }),
      });
      const disabledNote =
        res.autoDisabled?.disabled.length ?
          ` · auto-disabled: ${res.autoDisabled.disabled.map((d) => d.kind).join(", ")}`
        : "";
      setFailoverProbeOut(
        res.probes.map((p) => `${p.kind}:${p.ok ? "ok" : p.error ?? "fail"}${p.latencyMs ? ` ${p.latencyMs}ms` : ""}`).join(" · ") +
          disabledNote,
      );
      if (res.autoDisabled?.disabled.length) await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onSaveRetention() {
    setError(null);
    try {
      const res = await api<{ retention: { maxCount: number; maxAgeDays: number } }>("/backup/retention", {
        method: "POST",
        body: JSON.stringify({
          maxCount: Number(retentionMaxCount) || 20,
          maxAgeDays: Number(retentionMaxAge) || 30,
        }),
      });
      setRetentionOut(`keep ${res.retention.maxCount} · max age ${res.retention.maxAgeDays}d`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onRotateBackups() {
    setError(null);
    try {
      const res = await api<{ rotation: { deleted: string[]; kept: number } }>("/backup/retention/rotate", {
        method: "POST",
        body: "{}",
      });
      setRetentionOut(`rotated: deleted ${res.rotation.deleted.length}, kept ${res.rotation.kept}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onSaveArchiveSchedule() {
    setError(null);
    try {
      const res = await api<{ schedule: { enabled: boolean; intervalMinutes: number } }>(
        "/export/conversations/archive/schedule",
        {
          method: "POST",
          body: JSON.stringify({
            enabled: archiveScheduleEnabled,
            intervalMinutes: Number(archiveScheduleInterval) || 10080,
          }),
        },
      );
      setArchiveScheduleOut(
        `archive schedule ${res.schedule.enabled ? "on" : "off"} · every ${res.schedule.intervalMinutes} min`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onExportArchiveAsync() {
    setError(null);
    try {
      const res = await api<{ job: { id: string; status: string } }>("/export/conversations/archive/async", {
        method: "POST",
        body: "{}",
      });
      setArchiveScheduleOut(`archive job ${res.job.id.slice(0, 8)} · ${res.job.status}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onSaveArchiveRetention() {
    setError(null);
    try {
      const res = await api<{ retention: { maxCount: number; maxAgeDays: number } }>(
        "/export/conversations/archive/retention",
        {
          method: "POST",
          body: JSON.stringify({
            maxCount: Number(archiveRetentionMaxCount) || 10,
            maxAgeDays: Number(archiveRetentionMaxAge) || 90,
          }),
        },
      );
      setArchiveRetentionOut(`archive keep ${res.retention.maxCount} · max age ${res.retention.maxAgeDays}d`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onRotateArchives() {
    setError(null);
    try {
      const res = await api<{ rotation: { deleted: string[]; kept: number } }>(
        "/export/conversations/archive/retention/rotate",
        { method: "POST", body: "{}" },
      );
      setArchiveRetentionOut(`archives rotated: deleted ${res.rotation.deleted.length}, kept ${res.rotation.kept}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onCloneWorkspace() {
    if (!cloneTargetSlug.trim()) return;
    setError(null);
    try {
      const res = await api<{
        targetSlug: string;
        conversationCount: number;
        projectsCloned: number;
        memoriesCloned: number;
        approvalsCloned: number;
        jobsCloned: number;
        scheduleTemplatesCloned?: number;
        imported: { importedConversations: number; importedMessages: number };
      }>(`/workspaces/${selectedSlug}/clone`, {
        method: "POST",
        body: JSON.stringify({
          targetSlug: cloneTargetSlug.trim(),
          targetName: cloneTargetName.trim() || undefined,
          includeApprovals: cloneIncludeApprovals,
          includeJobs: cloneIncludeJobs,
          includeScheduleTemplates: cloneIncludeScheduleTemplates,
        }),
      });
      setCloneOut(
        `full clone → ${res.targetSlug}: ${res.projectsCloned} projects, ${res.memoriesCloned} memories, ${res.approvalsCloned} approvals, ${res.jobsCloned} jobs, ${res.scheduleTemplatesCloned ?? 0} schedule templates, ${res.imported.importedConversations} conversations (${res.imported.importedMessages} messages)`,
      );
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  function parseRestoreSlugs(): string[] | undefined {
    return parseSlugList(restoreWorkspaceSlugs);
  }

  function toggleArchiveConversation(id: string) {
    setArchiveConversationPicks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c)),
    );
  }

  function selectArchiveConversations(mode: "all" | "inserts" | "replaces" | "none") {
    setArchiveConversationPicks((prev) => {
      if (mode === "none") return prev.map((c) => ({ ...c, selected: false }));
      if (mode === "all") return prev.map((c) => ({ ...c, selected: true }));
      if (mode === "replaces") return prev.map((c) => ({ ...c, selected: c.conflict === "replace" }));
      return prev.map((c) => ({ ...c, selected: c.conflict === "insert" }));
    });
  }

  async function applyBackupPathHints(path: string) {
    if (!restoreAutoDetectScoped) return;
    try {
      const res = await api<{ detectedSlug: string | null; suggestScopedOnly: boolean }>(
        `/backup/inspect?path=${encodeURIComponent(path)}`,
      );
      if (res.suggestScopedOnly && res.detectedSlug) {
        setRestoreScopedOnly(true);
        setRestoreWorkspaceSlugs(res.detectedSlug);
      }
    } catch {
      /* ignore inspect failures */
    }
  }

  async function onSaveNotificationWebhook() {
    setError(null);
    try {
      await api("/job-templates/notifications/webhook", {
        method: "POST",
        body: JSON.stringify({
          enabled: notificationWebhookEnabled,
          url: notificationWebhookUrl.trim() || null,
          maxRetries: Number(notificationWebhookMaxRetries) || 3,
        }),
      });
      setNotificationWebhookOut(
        notificationWebhookEnabled ?
          `webhook enabled → ${notificationWebhookUrl.trim()} (${notificationWebhookMaxRetries} retries)`
        : "webhook disabled",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onReplayWebhookDeadLetters(all = true) {
    setError(null);
    try {
      const body =
        all ?
          { all: true, limit: 10 }
        : selectedWebhookDeadLetterIds.length ?
          { ids: selectedWebhookDeadLetterIds }
        : { limit: 10 };
      const res = await api<{ replayed: number; succeeded: number; failed: number; removedIds: string[] }>(
        "/job-templates/notifications/webhook/dead-letter/replay",
        { method: "POST", body: JSON.stringify(body) },
      );
      setWebhookReplayOut(`replay ${res.replayed}: ok ${res.succeeded}, fail ${res.failed}, removed ${res.removedIds.length}`);
      setSelectedWebhookDeadLetterIds((prev) => prev.filter((id) => !res.removedIds.includes(id)));
      await onLoadWebhookDeadLetters();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  function toggleWebhookDeadLetterId(id: string) {
    setSelectedWebhookDeadLetterIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function onDeleteWebhookDeadLetters(all = false) {
    setError(null);
    try {
      const body =
        all ?
          { all: true }
        : selectedWebhookDeadLetterIds.length ?
          { ids: selectedWebhookDeadLetterIds }
        : null;
      if (!body) return;
      const res = await api<{ deleted: number; removedIds: string[] }>(
        "/job-templates/notifications/webhook/dead-letter/delete",
        { method: "POST", body: JSON.stringify(body) },
      );
      setWebhookReplayOut(`deleted ${res.deleted} dead letter(s)`);
      setSelectedWebhookDeadLetterIds((prev) => prev.filter((id) => !res.removedIds.includes(id)));
      await onLoadWebhookDeadLetters();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onLoadWebhookDeadLetters() {
    setError(null);
    try {
      const res = await api<{ entries: typeof webhookDeadLetters }>(
        "/job-templates/notifications/webhook/dead-letter?limit=10",
      );
      setWebhookDeadLetters(res.entries);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onSaveNotificationEmail() {
    setError(null);
    try {
      await api("/job-templates/notifications/email", {
        method: "POST",
        body: JSON.stringify({
          enabled: notificationEmailEnabled,
          from: notificationEmailFrom.trim() || null,
          to: notificationEmailTo.trim() || null,
          smtpHost: notificationEmailSmtpHost.trim() || null,
          smtpPort: notificationEmailSmtpPort.trim() ? Number(notificationEmailSmtpPort) : null,
          useOutbox: notificationEmailUseOutbox,
          sendViaSmtp: notificationEmailSendViaSmtp,
          smtpSecure: notificationEmailSmtpSecure,
          smtpUser: notificationEmailSmtpUser.trim() || null,
          smtpPass: notificationEmailSmtpPass.trim() || null,
        }),
      });
      setNotificationEmailOut(notificationEmailEnabled ? "email profile saved" : "email profile disabled");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onLoadEmailOutbox() {
    setError(null);
    try {
      const res = await api<{ outbox: Array<{ subject: string; createdAt: string; to: string }> }>(
        "/job-templates/notifications/email/outbox?limit=5",
      );
      setEmailOutboxPreview(
        res.outbox.length ?
          res.outbox.map((e) => `${e.createdAt.slice(0, 19)} → ${e.to}: ${e.subject}`).join(" · ")
        : "outbox empty",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onLoadEmailDeliveryLog() {
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "8" });
      if (emailDeliveryChannelFilter) params.set("channel", emailDeliveryChannelFilter);
      if (emailDeliveryStatusFilter) params.set("status", emailDeliveryStatusFilter);
      const res = await api<{
        entries: Array<{ createdAt: string; channel: string; status: string; to: string; subject: string; error?: string | null }>;
      }>(`/job-templates/notifications/email/delivery-log?${params.toString()}`);
      setEmailDeliveryLogPreview(
        res.entries.length ?
          res.entries
            .map(
              (e) =>
                `${e.createdAt.slice(0, 19)} ${e.channel}/${e.status} → ${e.to}: ${e.subject}${e.error ? ` (${e.error})` : ""}`,
            )
            .join(" · ")
        : "delivery log empty (with current filters)",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onRotateEmailDeliveryLog() {
    setError(null);
    try {
      const res = await api<{ deleted: number; kept: number }>(
        "/job-templates/notifications/email/delivery-log/rotate",
        { method: "POST", body: JSON.stringify({}) },
      );
      setEmailDeliveryRotateOut(`rotated delivery log: deleted ${res.deleted}, kept ${res.kept}`);
      await onLoadEmailDeliveryLog();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  function toggleArchiveDiffId(id: string) {
    setSelectedArchiveDiffIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function selectArchiveDiffIds(mode: "all" | "insert" | "replace" | "none") {
    if (mode === "none") {
      setSelectedArchiveDiffIds([]);
      return;
    }
    if (mode === "all") {
      setSelectedArchiveDiffIds(archiveDiffRows.map((r) => r.id));
      return;
    }
    setSelectedArchiveDiffIds(archiveDiffRows.filter((r) => r.action === mode).map((r) => r.id));
  }

  async function onPreviewArchiveFromDiff() {
    if (!archiveImportDiffPath.trim()) return;
    setError(null);
    try {
      const res = await api<{
        preview: {
          totals: { wouldInsert: number; wouldSkip: number; wouldReplace: number };
          selectedDiffIds: string[];
          diffRows: ArchiveDiffPick[];
        };
      }>("/import/conversations/archive/from-diff/preview", {
        method: "POST",
        body: JSON.stringify({
          diffPath: archiveImportDiffPath.trim(),
          selectedOnly: true,
          passphrase: archivePassphrase || undefined,
        }),
      });
      setArchiveDiffRows(res.preview.diffRows ?? []);
      setSelectedArchiveDiffIds(res.preview.selectedDiffIds ?? []);
      setArchiveFromDiffPreviewOut(
        `diff preview · ${res.preview.selectedDiffIds.length} rows · +${res.preview.totals.wouldInsert}/skip ${res.preview.totals.wouldSkip}/replace ${res.preview.totals.wouldReplace}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onExportWebhookDeadLetters() {
    setError(null);
    try {
      const body =
        selectedWebhookDeadLetterIds.length ?
          { ids: selectedWebhookDeadLetterIds }
        : { limit: 50 };
      const res = await api<{ path: string; count: number }>(
        "/job-templates/notifications/webhook/dead-letter/export",
        { method: "POST", body: JSON.stringify(body) },
      );
      setWebhookDeadLetterExportPath(`${res.path} (${res.count} entries)`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onLoadEmailRotationHistory() {
    setError(null);
    try {
      const res = await api<{ entries: RotationHistoryEntry[] }>(
        "/job-templates/notifications/email/delivery-log/rotation-history?limit=12",
      );
      setRotationHistoryChart(res.entries);
      setEmailRotationHistoryPreview(
        res.entries.length ?
          res.entries
            .map((e) => `${e.rotatedAt.slice(0, 19)} ${e.trigger}: kept ${e.kept}, deleted ${e.deleted}`)
            .join(" · ")
        : "rotation history empty",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onRotateRotationHistory() {
    setError(null);
    try {
      const res = await api<{ deleted: number; kept: number }>(
        "/job-templates/notifications/email/delivery-log/rotation-history/rotate",
        { method: "POST", body: JSON.stringify({}) },
      );
      setEmailRotationHistoryPreview(`trimmed history: deleted ${res.deleted}, kept ${res.kept}`);
      await onLoadEmailRotationHistory();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  function toggleDryRunJson(id: string) {
    setExpandedDryRunIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function onExportDryRunDetails() {
    setError(null);
    try {
      const ids = templateNotifications.filter((n) => n.dryRunDetail).map((n) => n.id);
      const exportLimit = Number(dryRunExportLimit) || 50;
      const body: {
        ids?: string[];
        limit: number;
        workspaceSlug?: string;
        templateId?: string;
        since?: string;
        until?: string;
        presetRange?: "24h" | "7d" | "30d";
      } = { limit: exportLimit };
      if (ids.length) body.ids = ids;
      if (dryRunExportFilterWorkspace && selectedSlug) body.workspaceSlug = selectedSlug;
      if (dryRunExportTemplateId.trim()) body.templateId = dryRunExportTemplateId.trim();
      if (dryRunExportPreset) {
        body.presetRange = dryRunExportPreset;
      } else {
        if (dryRunExportSince.trim()) body.since = new Date(dryRunExportSince).toISOString();
        if (dryRunExportUntil.trim()) body.until = new Date(dryRunExportUntil).toISOString();
      }
      const res = await api<{
        path: string;
        count: number;
        matchCount: number;
        exportLimit: number;
        truncated: boolean;
        filters?: {
          workspaceSlug: string | null;
          presetRange: string | null;
        };
      }>("/job-templates/notifications/dry-run/export", { method: "POST", body: JSON.stringify(body) });
      const badgeParts: string[] = [];
      if (res.filters?.presetRange) badgeParts.push(res.filters.presetRange);
      if (res.filters?.workspaceSlug) badgeParts.push(res.filters.workspaceSlug);
      setDryRunExportBadge(badgeParts.length ? badgeParts.join(" · ") : null);
      setDryRunExportPath(res.path);
      setDryRunExportCopyOut(null);
      const limitHint = res.truncated ?
        `${res.count}/${res.exportLimit} exported (${res.matchCount} matched)`
      : `${res.count} exported (${res.matchCount} matched)`;
      setDryRunExportOut(`${res.path} · ${limitHint}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onExportRotationHistoryCsv() {
    setError(null);
    try {
      const res = await api<{ path: string; count: number }>(
        "/job-templates/notifications/email/delivery-log/rotation-history/export",
        { method: "POST", body: JSON.stringify({ limit: 500 }) },
      );
      setRotationHistoryCsvOut(`${res.path} (${res.count} rows)`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onCheckRotationIntegrity() {
    setError(null);
    try {
      const res = await api<{
        ok: boolean;
        entryCount: number;
        historyCount: number;
        mismatch: string | null;
      }>("/job-templates/notifications/email/delivery-log/rotation-history/integrity");
      setRotationIntegrityOut(
        res.ok ?
          `rotation integrity ok · log ${res.entryCount} entries · ${res.historyCount} history rows`
        : `rotation mismatch · ${res.mismatch ?? "unknown"} · log ${res.entryCount} · history ${res.historyCount}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onRepairRotationIntegrity() {
    setError(null);
    try {
      const res = await api<{ repaired: boolean; ok: boolean }>(
        "/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair",
        { method: "POST", body: JSON.stringify({}) },
      );
      setRotationIntegrityOut(
        res.repaired ?
          `rotation repaired · integrity ${res.ok ? "ok" : "still failing"}`
        : `rotation already ok · no repair needed`,
      );
      const audit = await api<{ entries: Array<{ repairedAt: string; repaired: boolean }> }>(
        "/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit?limit=1",
      );
      const last = audit.entries[0];
      setRotationRepairAuditOut(
        last ? `audit · ${last.repairedAt.slice(0, 19)} · ${last.repaired ? "repaired" : "noop"}` : null,
      );
      await onLoadEmailRotationHistory();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  function selectAllArchiveMergeDiffIds() {
    setSelectedArchiveMergeDiffIds(archiveMergePreviewRows.map((r) => r.id));
  }

  function clearArchiveMergeDiffIds() {
    setSelectedArchiveMergeDiffIds([]);
  }

  function invertArchiveMergeDiffIds() {
    const allIds = archiveMergePreviewRows.map((r) => r.id);
    setSelectedArchiveMergeDiffIds(allIds.filter((id) => !selectedArchiveMergeDiffIds.includes(id)));
  }

  function toggleArchiveMergeActionFilter(action: "insert" | "skip" | "replace") {
    setArchiveMergeActionFilters((prev) =>
      prev.includes(action) ? prev.filter((x) => x !== action) : [...prev, action],
    );
  }

  function toggleArchiveMergeDiffId(id: string) {
    setSelectedArchiveMergeDiffIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function onExportRotationRepairAuditCsv() {
    setError(null);
    try {
      const res = await api<{ path: string; count: number }>(
        "/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/export",
        { method: "POST", body: JSON.stringify({ limit: 500 }) },
      );
      setRotationRepairAuditCsvOut(`${res.path} (${res.count} rows)`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  function applyMergeActionPreset(preset: "insert+replace" | "all" | "clear") {
    if (preset === "insert+replace") setArchiveMergeActionFilters(["insert", "replace"]);
    else if (preset === "all") setArchiveMergeActionFilters(["insert", "skip", "replace"]);
    else setArchiveMergeActionFilters([]);
  }

  function saveMergeActionPresetToStorage() {
    localStorage.setItem(MERGE_ACTION_FILTERS_KEY, JSON.stringify(archiveMergeActionFilters));
  }

  function loadMergeActionPresetFromStorage() {
    try {
      const raw = localStorage.getItem(MERGE_ACTION_FILTERS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Array<"insert" | "skip" | "replace">;
      if (Array.isArray(parsed)) setArchiveMergeActionFilters(parsed);
    } catch {
      /* ignore */
    }
  }

  function readMergeActionProfiles(): Record<string, Array<"insert" | "skip" | "replace">> {
    try {
      const raw = localStorage.getItem(MERGE_ACTION_PROFILES_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw) as Record<string, Array<"insert" | "skip" | "replace">>;
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveMergeActionProfile(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const profiles = readMergeActionProfiles();
    profiles[trimmed] = archiveMergeActionFilters;
    localStorage.setItem(MERGE_ACTION_PROFILES_KEY, JSON.stringify(profiles));
    setMergePresetProfileName(trimmed);
    refreshMergePresetProfileNames();
  }

  function loadMergeActionProfile(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const profiles = readMergeActionProfiles();
    const filters = profiles[trimmed];
    if (Array.isArray(filters)) setArchiveMergeActionFilters(filters);
  }

  function deleteMergeActionProfile(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const profiles = readMergeActionProfiles();
    delete profiles[trimmed];
    localStorage.setItem(MERGE_ACTION_PROFILES_KEY, JSON.stringify(profiles));
    refreshMergePresetProfileNames();
    if (mergePresetProfileName === trimmed) setMergePresetProfileName("");
  }

  function exportMergeActionProfilesJson() {
    const profiles = readMergeActionProfiles();
    const profileName = mergePresetProfileName.trim();
    const exportProfiles =
      mergeExportSelectedOnly && profileName && profiles[profileName] ?
        { [profileName]: profiles[profileName] }
      : profiles;
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      profiles: exportProfiles,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    const singleProfileName =
      mergeExportSelectedOnly && profileName && profiles[profileName] ? profileName : null;
    anchor.download =
      singleProfileName ?
        `devaios-merge-profile-${slugifyMergeProfileName(singleProfileName)}.json`
      : `devaios-merge-profiles-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMergeProfilesOut(
      `exported ${Object.keys(exportProfiles).length} profile(s)${mergeExportSelectedOnly ? " (selected only)" : " (all)"}`,
    );
  }

  function parseMergeProfilesImport(raw: string, merge = true) {
    const parsed = JSON.parse(raw) as
      | Record<string, Array<"insert" | "skip" | "replace">>
      | { profiles?: Record<string, Array<"insert" | "skip" | "replace">> };
    const incoming =
      "profiles" in parsed && parsed.profiles && typeof parsed.profiles === "object" ?
        parsed.profiles
      : (parsed as Record<string, Array<"insert" | "skip" | "replace">>);
    if (!incoming || typeof incoming !== "object") throw new Error("invalid merge profiles JSON");
    const existing = readMergeActionProfiles();
    const next = merge ? { ...existing, ...incoming } : incoming;
    return { incoming, next, existingCount: Object.keys(existing).length };
  }

  function previewMergeProfilesImport(raw: string, merge = true) {
    try {
      if (!raw.trim()) {
        setMergeProfilesImportPreview(null);
        setMergeProfilesImportPreviewJson(null);
        return;
      }
      const { incoming, next, existingCount } = parseMergeProfilesImport(raw, merge);
      const existing = readMergeActionProfiles();
      const names = Object.keys(incoming).sort().join(", ") || "none";
      const overwritten = merge ? Object.keys(incoming).filter((name) => name in existing).sort() : [];
      const added = merge ? Object.keys(incoming).filter((name) => !(name in existing)).sort() : Object.keys(incoming).sort();
      const overwriteNote = overwritten.length ? ` · overwrite ${overwritten.join(", ")}` : "";
      const addedNote = added.length ? ` · new ${added.join(", ")}` : "";
      setMergeProfilesImportPreview(
        `${merge ? "merge" : "replace"} preview · import ${Object.keys(incoming).length} profile(s): ${names} · total ${Object.keys(next).length} (was ${existingCount})${overwriteNote}${addedNote}`,
      );
      setMergeProfilesImportPreviewJson(JSON.stringify({ profiles: next }, null, 2));
    } catch (err) {
      setMergeProfilesImportPreview(err instanceof Error ? err.message : String(err));
      setMergeProfilesImportPreviewJson(null);
    }
  }

  function importMergeActionProfilesJson(raw: string, merge = true) {
    const { incoming, next } = parseMergeProfilesImport(raw, merge);
    localStorage.setItem(MERGE_ACTION_PROFILES_KEY, JSON.stringify(next));
    refreshMergePresetProfileNames();
    setMergeProfilesImportPreview(null);
    setMergeProfilesImportPreviewJson(null);
    setMergeProfilesOut(`imported ${Object.keys(incoming).length} profile(s) · ${Object.keys(next).length} total`);
  }

  function dismissHashTickAlert() {
    setHashTickAlertHidden(true);
    setHashTickAlert(null);
  }

  function snoozeHashTickAlert(minutes = 60) {
    const until = new Date(Date.now() + minutes * 60_000).toISOString();
    localStorage.setItem(HASH_TICK_SNOOZE_KEY, until);
    setHashSnoozeUntil(until);
    setHashSnoozeExpiredNotice(null);
    setHashSnoozeExpiredAt(null);
    setHashSnoozeRelativeUpdatedAt(null);
    setHashTickAlert(null);
  }

  async function onSaveRotationAuditRetention(viaShortcut = false) {
    setError(null);
    try {
      const res = await api<{
        policy: { maxCount: number; maxAgeDays: number };
        previous: { maxCount: number; maxAgeDays: number };
        changed: { maxCount: boolean; maxAgeDays: boolean };
      }>(
        "/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/retention",
        {
          method: "POST",
          body: JSON.stringify({
            maxCount: Number(rotationAuditRetentionMaxCount) || 200,
            maxAgeDays: Number(rotationAuditRetentionMaxAge) || 365,
          }),
        },
      );
      const diff = formatRotationAuditRetentionDiff(res.previous, res.policy);
      applyRotationAuditRetentionPolicy(res.policy, true);
      setRotationAuditRetentionOut(
        `saved audit retention · ${formatRotationAuditRetentionBadge(res.policy)} · ${diff}`,
      );
      if (viaShortcut) {
        const hint =
          typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘S" : "Ctrl+S";
        setRotationAuditSaveToast({
          text: `saved via ${hint} · ${diff}`,
          tone: rotationAuditSaveToastTone(res.changed, diff),
        });
      } else {
        setRotationAuditSaveToast({
          text: `saved via button · ${diff}`,
          tone: rotationAuditSaveToastTone(res.changed, diff),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }
  saveRotationAuditRef.current = onSaveRotationAuditRetention;

  async function onLoadRotationAuditRetention() {
    setError(null);
    try {
      const res = await api<{
        policy: { maxCount: number; maxAgeDays: number };
        defaults: { maxCount: number; maxAgeDays: number };
        matchesDefaults?: boolean;
      }>(
        "/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/retention",
      );
      setRotationAuditRetentionDefaults(res.defaults);
      applyRotationAuditRetentionPolicy(res.policy, true);
      setRotationAuditRetentionOut(
        `loaded audit retention keep ${res.policy.maxCount} · max age ${res.policy.maxAgeDays}d`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onResetRotationAuditRetention() {
    setError(null);
    try {
      const res = await api<{
        policy: { maxCount: number; maxAgeDays: number };
        previous: { maxCount: number; maxAgeDays: number };
        changed: { maxCount: boolean; maxAgeDays: boolean };
      }>(
        "/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/retention/reset",
        { method: "POST", body: JSON.stringify({}) },
      );
      const diff = formatRotationAuditRetentionDiff(res.previous, res.policy);
      applyRotationAuditRetentionPolicy(res.policy, true);
      setRotationAuditRetentionOut(
        `reset audit retention · ${formatRotationAuditRetentionBadge(res.policy)} · ${diff}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onMergeProfilesFileSelected(file: File | null, replace = false) {
    if (!file) return;
    setError(null);
    try {
      const text = await file.text();
      setMergeProfilesImportText(text);
      previewMergeProfilesImport(text, !replace);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onRotateRotationRepairAudit() {
    setError(null);
    try {
      const res = await api<{
        deleted: number;
        kept: number;
        policy: { maxCount: number; maxAgeDays: number };
      }>(
        "/job-templates/notifications/email/delivery-log/rotation-history/integrity/repair/audit/rotate",
        { method: "POST", body: JSON.stringify({}) },
      );
      const badge = formatRotationAuditRetentionBadge(res.policy);
      setRotationAuditRetentionBadge(badge);
      setRotationAuditRetentionOut(`audit trimmed: deleted ${res.deleted}, kept ${res.kept} · ${badge}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onRebuildHashIndex() {
    setError(null);
    try {
      const res = await api<{ hashCount: number; entryCount: number }>(
        "/job-templates/notifications/webhook/dead-letter/hash-index/rebuild",
        { method: "POST", body: JSON.stringify({}) },
      );
      setHashIndexRebuildOut(`rebuilt index: ${res.hashCount} hashes from ${res.entryCount} entries`);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onCheckHashIndexIntegrity() {
    setError(null);
    try {
      const q = hashIndexAutoRebuild ? "?autoRebuild=1" : "";
      const res = await api<{
        ok: boolean;
        hashCount: number;
        entryCount: number;
        missingInIndex: number;
        orphanInIndex: number;
        rebuilt?: boolean;
      }>(`/job-templates/notifications/webhook/dead-letter/hash-index/integrity${q}`);
      const rebuiltNote = res.rebuilt ? " · auto-rebuilt" : "";
      setHashIndexIntegrityOut(
        res.ok ?
          `integrity ok · ${res.hashCount} hashes / ${res.entryCount} entries${rebuiltNote}`
        : `integrity mismatch · missing ${res.missingInIndex}, orphan ${res.orphanInIndex}${rebuiltNote}`,
      );
      if (res.rebuilt) await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onPreviewArchiveDiffMerge() {
    const paths = archiveDiffMergePaths
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (paths.length < 2) return;
    setError(null);
    try {
      const res = await api<{
        preview: {
          totals: { rows: number; selected: number; insert: number; skip: number; replace: number };
          archivePathWarnings?: string[];
          diffRows: ArchiveMergePreviewRow[];
        };
      }>("/import/conversations/archive/from-diff/merge/preview", {
        method: "POST",
        body: JSON.stringify({
          diffPaths: paths,
          allowMixedArchives: archiveDiffMergeAllowMixed,
          rowLimit: 30,
          actionFilters: archiveMergeActionFilters.length ? archiveMergeActionFilters : undefined,
        }),
      });
      setArchiveMergePreviewRows(res.preview.diffRows ?? []);
      const rows = res.preview.diffRows ?? [];
      const defaultSelected =
        rows.filter((r) => r.selected).length ?
          rows.filter((r) => r.selected).map((r) => r.id)
        : rows.map((r) => r.id);
      setSelectedArchiveMergeDiffIds(defaultSelected);
      const warn =
        res.preview.archivePathWarnings?.length ?
          ` · mixed archives ${res.preview.archivePathWarnings.length}`
        : "";
      setArchiveDiffMergePreviewOut(
        `merge preview · ${rows.length} shown (+${res.preview.totals.insert}/skip ${res.preview.totals.skip}/replace ${res.preview.totals.replace})${warn}${archiveMergeActionFilters.length ? ` · filter ${archiveMergeActionFilters.join("+")}` : ""}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onMergeArchiveDiffFiles() {
    const paths = archiveDiffMergePaths
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (paths.length < 2) return;
    setError(null);
    try {
      const body: {
        diffPaths: string[];
        allowMixedArchives: boolean;
        selectedDiffIds?: string[];
      } = { diffPaths: paths, allowMixedArchives: archiveDiffMergeAllowMixed };
      if (selectedArchiveMergeDiffIds.length) body.selectedDiffIds = selectedArchiveMergeDiffIds;
      const res = await api<{ path: string; mergedCount: number; archivePathWarnings?: string[] }>(
        "/import/conversations/archive/from-diff/merge",
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      );
      const warn =
        res.archivePathWarnings?.length ?
          ` (mixed archives: ${res.archivePathWarnings.length})`
        : "";
      setArchiveDiffMergeOut(`merged ${res.mergedCount} rows → ${res.path}${warn}`);
      setArchiveImportDiffPath(res.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onImportWebhookDeadLetters(replay = false) {
    if (!webhookDeadLetterImportPath.trim()) return;
    setError(null);
    try {
      const route =
        replay ?
          "/job-templates/notifications/webhook/dead-letter/import-replay"
        : "/job-templates/notifications/webhook/dead-letter/import";
      const res = await api<{
        imported: number;
        total: number;
        succeeded?: number;
        failed?: number;
        skippedDuplicateHashes?: number;
        skippedDuplicateIds?: number;
      }>(route, {
        method: "POST",
        body: JSON.stringify({ path: webhookDeadLetterImportPath.trim() }),
      });
      setWebhookDeadLetterImportOut(
        replay ?
          `imported ${res.imported}, replay ok ${res.succeeded ?? 0}, fail ${res.failed ?? 0}, total ${res.total}`
        : `imported ${res.imported}, skipped hash ${res.skippedDuplicateHashes ?? 0}, id ${res.skippedDuplicateIds ?? 0}, total ${res.total}`,
      );
      await onLoadWebhookDeadLetters();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onSaveArchiveDiffSelection() {
    if (!archiveImportDiffPath.trim() || !selectedArchiveDiffIds.length) return;
    setError(null);
    try {
      const res = await api<{ selectedCount: number; total: number }>(
        "/import/conversations/archive/from-diff/save-selection",
        {
          method: "POST",
          body: JSON.stringify({
            diffPath: archiveImportDiffPath.trim(),
            diffIds: selectedArchiveDiffIds,
          }),
        },
      );
      setArchiveDiffSelectionOut(`saved selection ${res.selectedCount}/${res.total} rows`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onImportArchiveFromDiff() {
    if (!archiveImportDiffPath.trim()) return;
    setError(null);
    try {
      const res = await api<{
        importedDiffIds: string[];
        workspaces: Array<{ slug: string; importedConversations: number }>;
      }>("/import/conversations/archive/from-diff", {
        method: "POST",
        body: JSON.stringify({
          diffPath: archiveImportDiffPath.trim(),
          selectedOnly: true,
          diffIds: selectedArchiveDiffIds.length ? selectedArchiveDiffIds : undefined,
          dedupeByTitle,
        }),
      });
      const summary = res.workspaces
        .map((w) => `${w.slug}:${w.importedConversations}`)
        .join(", ");
      setArchiveFromDiffOut(`from diff — ${res.importedDiffIds.length} rows · ${summary || "none"}`);
      await refreshConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onPreviewBatchRestoreLatest() {
    setError(null);
    try {
      const slugs = parseSlugList(restoreWorkspaceSlugs) ?? [selectedSlug];
      const res = await api<{
        results: Array<{
          workspaceSlug: string;
          ok: boolean;
          path?: string | null;
          error?: string;
          preview?: {
            workspaces: { insert: number; skip: number; replace: number };
            projects: { insert: number; skip: number; replace: number };
          };
        }>;
      }>("/backup/restore/batch/preview", {
        method: "POST",
        body: JSON.stringify({
          workspaceSlugs: slugs,
          autoDetectScoped: restoreAutoDetectScoped,
          scopedOnly: restoreScopedOnly,
          conflictPolicy: restoreConflictPolicy,
          restoreApprovals: true,
          restoreJobs: false,
          passphrase: backupPassphrase || undefined,
        }),
      });
      setBatchRestorePreviewOut(
        res.results
          .map((r) => {
            if (!r.ok) return `${r.workspaceSlug}:${r.error ?? "fail"}`;
            const ws = r.preview?.workspaces;
            const proj = r.preview?.projects;
            return `${r.workspaceSlug}: ws +${ws?.insert ?? 0}/skip ${ws?.skip ?? 0}/replace ${ws?.replace ?? 0} · proj +${proj?.insert ?? 0}`;
          })
          .join(" · "),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onBatchRestoreLatest() {
    setError(null);
    try {
      const slugs = parseSlugList(restoreWorkspaceSlugs) ?? [selectedSlug];
      const res = await api<{
        results: Array<{ workspaceSlug: string; ok: boolean; path?: string | null; error?: string }>;
      }>("/backup/restore/batch", {
        method: "POST",
        body: JSON.stringify({
          workspaceSlugs: slugs,
          autoDetectScoped: restoreAutoDetectScoped,
          scopedOnly: restoreScopedOnly,
          conflictPolicy: restoreConflictPolicy,
          restoreApprovals: true,
          restoreJobs: false,
          passphrase: backupPassphrase || undefined,
        }),
      });
      setBatchRestoreOut(
        res.results
          .map(
            (r) =>
              `${r.workspaceSlug}:${r.ok ? "ok" : r.error ?? "fail"}${r.path ? ` (${r.path.split("/").pop()})` : ""}`,
          )
          .join(" · "),
      );
      await refresh();
      await refreshProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onMarkTemplateNotificationsRead() {
    setError(null);
    try {
      const res = await api<{ marked: number }>("/job-templates/notifications/read", {
        method: "POST",
        body: JSON.stringify({ workspace: selectedSlug, all: true }),
      });
      setTemplateNotificationsOut(`marked ${res.marked} notification(s) read`);
      await refreshJobTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onExportArchiveImportDiff() {
    if (!archiveImportPath.trim()) return;
    setError(null);
    try {
      let slugMap: Record<string, string> | undefined;
      if (slugMapJson.trim() && slugMapJson.trim() !== "{}") {
        slugMap = JSON.parse(slugMapJson) as Record<string, string>;
      }
      const res = await api<{ path: string; diffCount: number }>("/import/conversations/archive/preview/export", {
        method: "POST",
        body: JSON.stringify({
          path: archiveImportPath.trim(),
          slugMap,
          workspaceSlugs: parseSlugList(archiveImportSlugs),
          conversationIds: archiveConversationPicks.filter((c) => c.selected).map((c) => c.id),
          selectedDiffIds: archiveConversationPicks
            .filter((c) => c.selected)
            .map((c) => `${c.workspaceSlug}:${c.id}`),
          passphrase: archivePassphrase || undefined,
          conflictPolicy: archiveImportConflictPolicy,
        }),
      });
      setArchiveImportDiffExportPath(`${res.path} (${res.diffCount} rows)`);
      setArchiveImportDiffPath(res.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onExportRestoreDiff() {
    if (!backupPath) return;
    setError(null);
    try {
      const res = await api<{ path: string; diffCount: number }>("/backup/restore/preview/export", {
        method: "POST",
        body: JSON.stringify({
          path: backupPath,
          passphrase: backupPassphrase || undefined,
          restoreMcp: true,
          restoreProviders: true,
          restoreApprovals: true,
          restoreJobs: false,
          workspaceSlugs: parseRestoreSlugs(),
          scopedOnly: restoreScopedOnly,
          autoDetectScoped: restoreAutoDetectScoped,
          conflictPolicy: restoreConflictPolicy,
          selectedDiffIds: selectedDiffIds.length ? selectedDiffIds : undefined,
        }),
      });
      setRestoreDiffExportPath(`${res.path} (${res.diffCount} rows)`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onRestorePreview() {
    if (!backupPath) return;
    setError(null);
    try {
      const workspaceSlugs = parseRestoreSlugs();
      const res = await api<{
        preview: {
          actions: string[];
          workspaces: { insert: number; skip: number; replace?: number };
          bundleVersion: number;
          diff: Array<{ id: string; section: string; action: string; label: string }>;
        };
        selectedSlugs: string[] | null;
        conflictPolicy?: string;
        diffIds?: string[];
      }>("/backup/restore/preview", {
        method: "POST",
        body: JSON.stringify({
          path: backupPath,
          passphrase: backupPassphrase || undefined,
          restoreMcp: true,
          restoreProviders: true,
          restoreApprovals: true,
          restoreJobs: false,
          workspaceSlugs,
          scopedOnly: restoreScopedOnly,
          autoDetectScoped: restoreAutoDetectScoped,
          conflictPolicy: restoreConflictPolicy,
        }),
      });
      const scopeNote = res.selectedSlugs?.length ? ` [${res.selectedSlugs.join(", ")}]` : "";
      setRestorePreviewOut(
        `v${res.preview.bundleVersion}${scopeNote} · policy ${res.conflictPolicy ?? restoreConflictPolicy}: ${res.preview.actions.join("; ")} (ws +${res.preview.workspaces.insert}/skip ${res.preview.workspaces.skip}/replace ${res.preview.workspaces.replace ?? 0})`,
      );
      setRestorePreviewDiff(res.preview.diff);
      setSelectedDiffIds(res.diffIds ?? res.preview.diff.map((d) => d.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  function toggleDiffId(id: string) {
    setSelectedDiffIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function selectDiffByAction(action: "insert" | "replace" | "all" | "none") {
    if (!restorePreviewDiff) return;
    if (action === "none") {
      setSelectedDiffIds([]);
      return;
    }
    if (action === "all") {
      setSelectedDiffIds(restorePreviewDiff.map((r) => r.id));
      return;
    }
    setSelectedDiffIds(restorePreviewDiff.filter((r) => r.action === action).map((r) => r.id));
  }

  async function onSaveJobTemplates() {
    setError(null);
    try {
      await api(`/workspaces/${selectedSlug}/job-templates`, {
        method: "POST",
        body: JSON.stringify({ templates: jobTemplates }),
      });
      setJobTemplatesOut(`saved ${jobTemplates.length} template(s) for ${selectedSlug}`);
      await refreshJobTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onLoadDefaultJobTemplates() {
    setError(null);
    try {
      const res = await api<{ templates: JobTemplateRow[] }>(`/workspaces/${selectedSlug}/job-templates`, {
        method: "POST",
        body: JSON.stringify({ useDefaults: true }),
      });
      setJobTemplates(res.templates);
      setJobTemplatesOut(`loaded defaults for ${selectedSlug}`);
      await refreshJobTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  function updateJobTemplate(id: string, patch: Partial<JobTemplateRow>) {
    setJobTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  async function onSaveCooldownMinutes() {
    setError(null);
    try {
      const res = await api<{ cooldownMinutes: number }>("/providers/cooldown", {
        method: "POST",
        body: JSON.stringify({ cooldownMinutes: Number(cooldownMinutes) || 15 }),
      });
      setProviderCooldownOut(`cooldown set to ${res.cooldownMinutes} min`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onRunJobTemplates() {
    setError(null);
    try {
      const res = await api<{ executed: Array<{ templateId: string; kind: string; lastPath?: string | null }>; skipped: string[] }>(
        `/workspaces/${selectedSlug}/job-templates/run`,
        { method: "POST", body: JSON.stringify({ force: true }) },
      );
      setJobTemplateRunOut(
        `executed ${res.executed.length}${res.executed[0]?.lastPath ? ` · ${res.executed[0].lastPath}` : ""}${res.skipped.length ? ` · skipped ${res.skipped.length}` : ""}`,
      );
      await refreshJobTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onRefreshProviderHealth() {
    setError(null);
    try {
      const health = await api<{
        summary: { total: number; enabled: number; healthy: number };
        probes: Array<{ kind: string; ok: boolean; error?: string; latencyMs?: number }>;
      }>("/providers/health");
      setProviderHealth(health);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onMergeDuplicates() {
    setError(null);
    try {
      const res = await api<{
        mergedGroups: number;
        removedConversations: number;
        movedMessages: number;
      }>(`/workspaces/${selectedSlug}/conversations/merge-duplicates`, { method: "POST", body: "{}" });
      setMergeResult(
        `merged ${res.mergedGroups} groups, removed ${res.removedConversations} conversations, moved ${res.movedMessages} messages`,
      );
      await refreshConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onBackupAsync() {
    setError(null);
    try {
      const res = await api<{ job: { id: string; status: string } }>("/backup/export/async", {
        method: "POST",
        body: JSON.stringify({
          encrypt: encryptBackup,
          sign: signBackup,
          passphrase: backupPassphrase || undefined,
        }),
      });
      setBackupJobOut(`backup job ${res.job.id.slice(0, 8)} · ${res.job.status}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onSaveSchedule() {
    setError(null);
    try {
      const res = await api<{ schedule: { enabled: boolean; intervalMinutes: number } }>("/backup/schedule", {
        method: "POST",
        body: JSON.stringify({
          enabled: scheduleEnabled,
          intervalMinutes: Number(scheduleInterval) || 1440,
          encrypt: encryptBackup,
          sign: signBackup,
        }),
      });
      setBackupJobOut(
        `schedule ${res.schedule.enabled ? "on" : "off"} · every ${res.schedule.intervalMinutes} min`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onBackup() {
    setError(null);
    try {
      const res = await api<{ path: string; encrypted?: boolean; signed?: boolean; version?: number }>(
        "/backup/export",
        {
          method: "POST",
          body: JSON.stringify({
            encrypt: encryptBackup,
            sign: signBackup,
            passphrase: backupPassphrase || undefined,
          }),
        },
      );
      setBackupPath(res.path);
      await applyBackupPathHints(res.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function onRestore() {
    if (!backupPath) return;
    setError(null);
    try {
      await api("/backup/restore", {
        method: "POST",
        body: JSON.stringify({
          path: backupPath,
          passphrase: backupPassphrase || undefined,
          restoreMcp: true,
          restoreProviders: true,
          restoreApprovals: true,
          restoreJobs: false,
          workspaceSlugs: parseRestoreSlugs(),
          scopedOnly: restoreScopedOnly,
          autoDetectScoped: restoreAutoDetectScoped,
          conflictPolicy: restoreConflictPolicy,
          selectedDiffIds: selectedDiffIds.length ? selectedDiffIds : undefined,
        }),
      });
      await refresh();
      await refreshProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  function buildDryRunBadgePreview(): string | null {
    const parts: string[] = [];
    if (dryRunExportPreset) parts.push(dryRunExportPreset);
    else if (dryRunExportSince || dryRunExportUntil) parts.push("custom");
    if (dryRunExportFilterWorkspace && selectedSlug) parts.push(selectedSlug);
    if (dryRunExportTemplateId.trim()) parts.push(dryRunExportTemplateId.trim());
    return parts.length ? parts.join(" · ") : null;
  }

  const dryRunBadgePreview = buildDryRunBadgePreview();
  const dryRunLimitHint =
    dryRunPreviewCount != null &&
    dryRunPreviewExportCount != null &&
    dryRunPreviewExportLimit != null ?
      formatDryRunLimitHint(
        dryRunPreviewCount,
        dryRunPreviewExportCount,
        dryRunPreviewExportLimit,
        dryRunPreviewTruncated,
      )
    : null;
  const hashSnoozeRemaining =
    hashSnoozeUntil && hashSnoozeCountdownTick >= 0 ?
      formatHashSnoozeRemaining(hashSnoozeUntil)
    : null;
  const rotationAuditDraftMatchesDefaults =
    (Number(rotationAuditRetentionMaxCount) || rotationAuditRetentionDefaults.maxCount) ===
      rotationAuditRetentionDefaults.maxCount &&
    (Number(rotationAuditRetentionMaxAge) || rotationAuditRetentionDefaults.maxAgeDays) ===
      rotationAuditRetentionDefaults.maxAgeDays;
  const rotationAuditSavedMatchesDefaults =
    rotationAuditRetentionBaseline != null &&
    rotationAuditRetentionBaseline.maxCount === rotationAuditRetentionDefaults.maxCount &&
    rotationAuditRetentionBaseline.maxAgeDays === rotationAuditRetentionDefaults.maxAgeDays;
  const rotationAuditDefaultsMismatchHint =
    rotationAuditDraftMatchesDefaults && rotationAuditRetentionBaseline && !rotationAuditSavedMatchesDefaults ?
      "draft matches defaults · saved policy differs"
    : !rotationAuditDraftMatchesDefaults && rotationAuditSavedMatchesDefaults ?
      "draft differs from defaults · saved matches defaults"
    : null;
  const rotationAuditSaveDisabled =
    !rotationAuditRetentionBaseline ||
    (rotationAuditRetentionBaseline.maxCount === Number(rotationAuditRetentionMaxCount) &&
      rotationAuditRetentionBaseline.maxAgeDays === Number(rotationAuditRetentionMaxAge));
  const rotationAuditSaveReady = !rotationAuditSaveDisabled;
  const rotationAuditSaveShortcutHint =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘S" : "Ctrl+S";
  const hashSnoozeExpiredRelative =
    hashSnoozeExpiredAt && hashSnoozeExpiredRelativeTick >= 0 ?
      formatRelativeTimeFromIso(hashSnoozeExpiredAt)
    : null;
  const dryRunOpenPathHint = dryRunExportPath ? buildDryRunOpenPathHint(dryRunExportPath) : null;
  const mergeProfilesPreviewScrollProgress =
    mergeProfilesPreviewScrollMax > 0 ?
      Math.min(100, Math.round((mergeProfilesPreviewScrollTop / mergeProfilesPreviewScrollMax) * 100))
    : 0;
  const dryRunBridgeUndoShortcutHint =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘Z" : "Ctrl+Z";
  const dryRunBridgeUndoRemainingSec =
    dryRunBridgeUndoToast && dryRunBridgeUndoCountdownTick >= 0 ?
      Math.max(0, Math.ceil((readDryRunBridgeUndoToast()?.remainingMs ?? 0) / 1000))
    : null;
  const dryRunBridgeUndoProgressPct =
    dryRunBridgeUndoToast && dryRunBridgeUndoCountdownTick >= 0 ?
      Math.max(
        0,
        Math.min(
          100,
          Math.round(((readDryRunBridgeUndoToast()?.remainingMs ?? 0) / DRY_RUN_BRIDGE_UNDO_MS) * 100),
        ),
      )
    : 0;
  const dryRunBridgeUndoRingStroke =
    dryRunBridgeUndoProgressPct <= 20 ? "#c44"
    : dryRunBridgeUndoProgressPct <= 40 ? "#c90"
    : "var(--accent, #4a9)";
  const dryRunBridgeUndoRingPulseClass =
    dryRunBridgeUndoProgressPct > 0 && dryRunBridgeUndoProgressPct <= 20 ? "dry-run-undo-ring-pulse"
    : dryRunBridgeUndoProgressPct > 20 && dryRunBridgeUndoProgressPct <= 40 ?
      "dry-run-undo-ring-pulse-amber"
    : undefined;
  const dryRunBridgeUndoRingPulseDuration =
    dryRunBridgeUndoRingPulseClass ?
      Math.max(0.45, 0.35 + (dryRunBridgeUndoProgressPct / 100) * 1.05)
    : null;
  const dryRunBridgeUndoRingPulseDurationLabel =
    dryRunBridgeUndoRingPulseDuration != null ?
      `pulse ${dryRunBridgeUndoRingPulseDuration.toFixed(1)}s`
    : null;
  const dryRunBridgeUndoRingUrgencyZone =
    dryRunBridgeUndoProgressPct <= 20 ? "red urgency"
    : dryRunBridgeUndoProgressPct <= 40 ? "amber urgency"
    : "normal";
  const dryRunBridgeUndoRingUrgencyBadge =
    dryRunBridgeUndoToast ?
      dryRunBridgeUndoProgressPct <= 20 ? "red"
      : dryRunBridgeUndoProgressPct <= 40 ? "amber"
      : "normal"
    : null;
  const dryRunBridgeUndoRingAriaLabel =
    dryRunBridgeUndoToast ?
      dryRunBridgeUndoRingPulseDurationLabel ?
        `Bridge undo ${dryRunBridgeUndoRemainingSec ?? 0} seconds remaining, ${dryRunBridgeUndoProgressPct} percent, ${dryRunBridgeUndoRingUrgencyZone} zone, ${dryRunBridgeUndoRingPulseDurationLabel}`
      : `Bridge undo ${dryRunBridgeUndoRemainingSec ?? 0} seconds remaining, ${dryRunBridgeUndoProgressPct} percent, ${dryRunBridgeUndoRingUrgencyZone} zone`
    : undefined;
  const mergeProfilesPreviewScrollScrubThrottleLabel =
    mergeProfilesPreviewScrollScrubThrottleMs != null ?
      `throttle ${Math.round(mergeProfilesPreviewScrollScrubThrottleMs)}ms`
    : `throttle min ${MERGE_SCROLL_SCRUB_THROTTLE_MIN_MS}ms · max ${MERGE_SCROLL_SCRUB_THROTTLE_MAX_MS}ms`;
  const mergeProfilesPreviewScrollAtomicRestoreDebounceLabel =
    `atomic restore debounce ${MERGE_SCROLL_SCRUB_ATOMIC_RESTORE_DEBOUNCE_MS}ms`;
  const mergeScrollDebouncePulseDurationSec =
    mergeScrollScrubbingActive ?
      Math.max(
        0.45,
        Math.min(1.35, (mergeProfilesPreviewScrollScrubThrottleMs ?? MERGE_SCROLL_SCRUB_THROTTLE_MAX_MS) / 300),
      )
    : null;
  const mergeProfilesPreviewScrollAtomicRestoreDebouncePulseLabel =
    mergeScrollDebouncePulseDurationSec != null ?
      `${mergeProfilesPreviewScrollAtomicRestoreDebounceLabel} · pulse ${mergeScrollDebouncePulseDurationSec.toFixed(1)}s`
    : mergeProfilesPreviewScrollAtomicRestoreDebounceLabel;
  const mergeProfilesPreviewScrollAtomicRestoreDebouncePulseFlashLabel =
    `debounce pulse atomic flash ${MERGE_SCROLL_SCRUB_ATOMIC_RESTORE_DEBOUNCE_MS}ms · aria-atomic restored`;
  const mergeProfilesPreviewScrollAtomicRestoreDebouncePulseFlashRestoredLabel =
    `debounce pulse restore phase ${MERGE_SCROLL_SCRUB_ATOMIC_RESTORE_DEBOUNCE_MS}ms · aria-atomic restored · atomic off`;
  const dryRunBridgeUndoUrgencyFlashZoneAccentColor =
    dryRunBridgeUndoUrgencyFlashZone === "red" ? "#c44"
    : dryRunBridgeUndoUrgencyFlashZone === "amber" ? "#c90"
    : "var(--muted, #8fa3b5)";
  const dryRunBridgeUndoUrgencyFlashZoneBackgroundTint =
    dryRunBridgeUndoUrgencyFlashZone ?
      (() => {
        const opacity = dryRunBridgeUndoUrgencyFlashZoneBackgroundTintOpacity(dryRunBridgeUndoUrgencyFlashZone);
        return dryRunBridgeUndoUrgencyFlashZone === "red" ? `rgba(204, 68, 68, ${opacity})`
          : dryRunBridgeUndoUrgencyFlashZone === "amber" ? `rgba(204, 144, 0, ${opacity})`
          : `rgba(143, 163, 181, ${opacity})`;
      })()
    : undefined;
  const dryRunBridgeUndoUrgencyFlashZoneBorderColor =
    dryRunBridgeUndoUrgencyFlashZone ?
      (() => {
        const opacity = dryRunBridgeUndoUrgencyFlashZoneBorderOpacity(dryRunBridgeUndoUrgencyFlashZone);
        return dryRunBridgeUndoUrgencyFlashZone === "red" ? `rgba(204, 68, 68, ${opacity})`
          : dryRunBridgeUndoUrgencyFlashZone === "amber" ? `rgba(204, 144, 0, ${opacity})`
          : `rgba(143, 163, 181, ${opacity})`;
      })()
    : dryRunBridgeUndoUrgencyFlashZoneAccentColor;
  const mergeProfilesPreviewScrollBarAriaValueText =
    mergeScrollScrubbingActive ?
      `${mergeProfilesPreviewScrollTop} of ${mergeProfilesPreviewScrollMax} pixels scrolled, throttle ${Math.round(mergeProfilesPreviewScrollScrubThrottleMs ?? MERGE_SCROLL_SCRUB_THROTTLE_MAX_MS)}ms`
    : `${mergeProfilesPreviewScrollTop} of ${mergeProfilesPreviewScrollMax} pixels scrolled, throttle ${MERGE_SCROLL_SCRUB_THROTTLE_MIN_MS} to ${MERGE_SCROLL_SCRUB_THROTTLE_MAX_MS}ms`;
  const mergeProfilesPreviewScrollBarAriaValueMin =
    mergeScrollScrubbingActive ? MERGE_SCROLL_SCRUB_THROTTLE_MIN_MS : 0;
  const mergeProfilesPreviewScrollBarAriaValueMax =
    mergeScrollScrubbingActive ? MERGE_SCROLL_SCRUB_THROTTLE_MAX_MS : 100;
  const mergeProfilesPreviewScrollBarAriaValueNow =
    mergeScrollScrubbingActive ?
      Math.round(mergeProfilesPreviewScrollScrubThrottleMs ?? MERGE_SCROLL_SCRUB_THROTTLE_MAX_MS)
    : mergeProfilesPreviewScrollProgress;
  const dryRunBridgeUndoRingUrgencyBadgeTooltip =
    "Urgency zones: red ≤20% (flash 900ms) · amber ≤40% (flash 750ms) · normal >40% (flash 600ms)";
  const rotationAuditLegendPositionBadge =
    rotationAuditToastLegendExpanded ? `${rotationAuditLegendFocusIndex + 1}/3` : null;
  const rotationAuditLegendToggleAriaPressed =
    rotationAuditToastLegendExpanded ?
      rotationAuditLegendArrowHint ? ("mixed" as const)
      : (true as const)
    : undefined;
  const rotationAuditLegendMixedClearEscapeOnlyStateLabel =
    rotationAuditLegendMixedClearEscapeOnly ? "enabled" : "disabled";
  const hashSnoozePrefixHelperSyncStackDepthBadge =
    hashSnoozePrefixHelperSyncToasts.length > 0 ?
      `stack ${hashSnoozePrefixHelperSyncToasts.length}/${HASH_SNOOZE_PREFIX_HELPER_SYNC_STACK_MAX}`
    : null;
  const dryRunBridgeUndoUrgencyFlashDurationBadge =
    dryRunBridgeUndoUrgencyFlashZone ?
      `${dryRunBridgeUndoUrgencyFlashZone.toUpperCase()} flash ${dryRunBridgeUndoUrgencyFlashDurationMs(dryRunBridgeUndoUrgencyFlashZone)}ms`
    : null;
  const dryRunBridgeUndoUrgencyFlashDurationBadgeBorderPulseSec =
    dryRunBridgeUndoUrgencyFlashZone ?
      Math.max(
        0.45,
        Math.min(1.35, dryRunBridgeUndoUrgencyFlashDurationMs(dryRunBridgeUndoUrgencyFlashZone) / 700),
      )
    : null;
  const dryRunBridgeUndoUrgencyFlashDurationBadgeTitle =
    dryRunBridgeUndoUrgencyFlashZone && dryRunBridgeUndoUrgencyFlashDurationBadge ?
      `${dryRunBridgeUndoUrgencyFlashDurationBadge} · tint α${dryRunBridgeUndoUrgencyFlashZoneBackgroundTintOpacity(dryRunBridgeUndoUrgencyFlashZone).toFixed(2)} · border α${dryRunBridgeUndoUrgencyFlashZoneBorderOpacity(dryRunBridgeUndoUrgencyFlashZone).toFixed(2)}${dryRunBridgeUndoUrgencyFlashDurationBadgeBorderPulseSec != null ? ` · pulse ${dryRunBridgeUndoUrgencyFlashDurationBadgeBorderPulseSec.toFixed(1)}s` : ""}`
    : null;
  const dryRunBridgeUndoUrgencyFlashDurationBadgeVisible =
    dryRunBridgeUndoUrgencyFlashDurationBadgeTitle ??
    (dryRunBridgeUndoUrgencyFlashDurationBadge && dryRunBridgeUndoUrgencyFlashDurationBadgeBorderPulseSec != null ?
      `${dryRunBridgeUndoUrgencyFlashDurationBadge} · pulse ${dryRunBridgeUndoUrgencyFlashDurationBadgeBorderPulseSec.toFixed(1)}s`
    : dryRunBridgeUndoUrgencyFlashDurationBadge);
  const dryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverStateLabel =
    dryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverState ?
      `border pulse ${dryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverState}`
    : null;
  const rotationAuditLegendMixedClearEscapeOnlyLiveClearBadge =
    rotationAuditLegendMixedClearEscapeOnlyLiveClearSec != null ?
      `live clear ${rotationAuditLegendMixedClearEscapeOnlyLiveClearSec}s`
    : null;
  const rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverStateLabel =
    rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverState ?
      `live clear countdown ${rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverState}`
    : null;
  const hashSnoozePrefixHelperSyncOverflowDedupeBadgeAtomicRestoreBadge =
    hashSnoozePrefixHelperSyncOverflowDedupeBadgeAtomicRestoreAnnouncement ?
      `atomic restore ${HASH_SNOOZE_PREFIX_HELPER_SYNC_DEDUPE_ATOMIC_RESTORE_ANNOUNCE_MS / 1_000}s`
    : null;
  const hashSnoozePrefixHelperSyncOverflowDedupeBadgeAtomicRestoreAriaLabel =
    hashSnoozePrefixHelperSyncOverflowDedupeBadgeAtomicRestoreAnnouncement ?? undefined;
  const hashSnoozePrefixHelperSyncOverflowDedupeBadgeDisplay =
    hashSnoozePrefixHelperSyncOverflowDedupeBadge ?
      hashSnoozePrefixHelperSyncOverflowDedupeBadgeTitleClearing ?
        `${hashSnoozePrefixHelperSyncOverflowDedupeBadge} · title clear ${HASH_SNOOZE_PREFIX_HELPER_SYNC_DEDUPE_TITLE_CLEAR_MS}ms · atomic off`
      : hashSnoozePrefixHelperSyncOverflowDedupeBadgeFading ?
        `${hashSnoozePrefixHelperSyncOverflowDedupeBadge} · fade ${HASH_SNOOZE_PREFIX_HELPER_SYNC_DEDUPE_FADE_MS}ms · atomic off`
      : hashSnoozePrefixHelperSyncOverflowDedupeBadge
    : null;
  dismissHashSnoozeExpiredNoticeRef.current = dismissHashSnoozeExpiredNotice;

  function clearHashSnoozePrefixHelperSyncOverflowDedupeBadge() {
    setHashSnoozePrefixHelperSyncOverflowDedupeBadgeTitle(undefined);
    setHashSnoozePrefixHelperSyncOverflowDedupeBadge((badge) => {
      if (!badge) {
        setHashSnoozePrefixHelperSyncOverflowDedupeBadgeTitleClearing(false);
        return null;
      }
      setHashSnoozePrefixHelperSyncOverflowDedupeBadgeTitleClearing(true);
      setTimeout(() => {
        setHashSnoozePrefixHelperSyncOverflowDedupeBadgeTitleClearing(false);
        setHashSnoozePrefixHelperSyncOverflowDedupeBadgeFading(true);
        setTimeout(() => {
          setHashSnoozePrefixHelperSyncOverflowDedupeBadgeFading(false);
          setHashSnoozePrefixHelperSyncOverflowDedupeBadge(null);
          setHashSnoozePrefixHelperSyncOverflowDedupeBadgeAtomicRestoreAnnouncement(
            `dedupe badge aria-atomic restored · ${HASH_SNOOZE_PREFIX_HELPER_SYNC_DEDUPE_ATOMIC_RESTORE_ANNOUNCE_MS / 1_000}s`,
          );
        }, HASH_SNOOZE_PREFIX_HELPER_SYNC_DEDUPE_FADE_MS);
      }, HASH_SNOOZE_PREFIX_HELPER_SYNC_DEDUPE_TITLE_CLEAR_MS);
      return badge;
    });
  }

  function showHashSnoozePrefixHelperSyncOverflowDedupeBadge() {
    const text = "overflow deduped";
    setHashSnoozePrefixHelperSyncOverflowDedupeBadgeFading(false);
    setHashSnoozePrefixHelperSyncOverflowDedupeBadgeTitleClearing(false);
    setHashSnoozePrefixHelperSyncOverflowDedupeBadgeAtomicRestoreAnnouncement("");
    setHashSnoozePrefixHelperSyncOverflowDedupeBadge(text);
    setHashSnoozePrefixHelperSyncOverflowDedupeBadgeTitle(text);
    setTimeout(() => clearHashSnoozePrefixHelperSyncOverflowDedupeBadge(), 1_500);
  }

  function showHashSnoozePrefixHelperSyncStackOverflow() {
    const now = Date.now();
    if (now - hashSnoozePrefixHelperSyncOverflowLastAtRef.current < 1_000) {
      showHashSnoozePrefixHelperSyncOverflowDedupeBadge();
      return;
    }
    hashSnoozePrefixHelperSyncOverflowLastAtRef.current = now;
    clearHashSnoozePrefixHelperSyncOverflowDedupeBadge();
    const text = `sync stack capped at ${HASH_SNOOZE_PREFIX_HELPER_SYNC_STACK_MAX} — oldest toast dropped`;
    setHashSnoozePrefixHelperSyncStackOverflow(text);
    setHashSnoozePrefixHelperSyncLiveAnnouncement(text);
    setTimeout(() => setHashSnoozePrefixHelperSyncStackOverflow(null), 3_000);
  }

  function pushHashSnoozePrefixHelperSyncToast(message: string) {
    const id = ++hashSnoozePrefixHelperSyncToastIdRef.current;
    setHashSnoozePrefixHelperSyncToasts((prev) => {
      if (prev.length >= HASH_SNOOZE_PREFIX_HELPER_SYNC_STACK_MAX) {
        queueMicrotask(showHashSnoozePrefixHelperSyncStackOverflow);
      }
      return [...prev, { id, text: message }].slice(-HASH_SNOOZE_PREFIX_HELPER_SYNC_STACK_MAX);
    });
    setHashSnoozePrefixHelperSyncLiveAnnouncement(message);
    setTimeout(() => {
      setHashSnoozePrefixHelperSyncToasts((prev) => prev.filter((entry) => entry.id !== id));
    }, 3_000);
  }

  function syncHashSnoozeLiveResumePrefixHelpExpanded(expanded: boolean) {
    persistHashSnoozeLiveResumePrefixHelpExpanded(expanded, false);
    persistHashSnoozeLiveResumePrefixHelpExpanded(expanded, true);
    pushHashSnoozePrefixHelperSyncToast(
      `prefix helper ${expanded ? "shown" : "hidden"} on both panels`,
    );
  }

  function renderHashSnoozeLiveResumePrefixToggle(compact = false) {
    const helpId = compact ? "hash-snooze-resume-prefix-help-compact" : "hash-snooze-resume-prefix-help";
    const helpExpanded =
      compact ? hashSnoozeLiveResumePrefixHelpCompactExpanded : hashSnoozeLiveResumePrefixHelpExpanded;
    return (
      <>
        <div className="row" style={{ marginBottom: compact ? "0.25rem" : "0.35rem", alignItems: "center" }}>
          <label
            className="muted"
            style={{ fontSize: "0.8rem", marginBottom: 0 }}
            title="When enabled, refocusing the tab prefixes snooze live updates with announcements resumed"
          >
            <input
              type="checkbox"
              checked={hashSnoozeLiveResumePrefixEnabled}
              onChange={(event) => persistHashSnoozeLiveResumePrefix(event.target.checked)}
              aria-describedby={helpExpanded ? helpId : undefined}
            />{" "}
            resume prefix in live region
          </label>
          <button
            type="button"
            style={{ fontSize: "0.75rem", padding: "0.2rem 0.45rem" }}
            onClick={() => persistHashSnoozeLiveResumePrefixHelpExpanded(!helpExpanded, compact)}
          >
            {helpExpanded ? "Hide" : "Show"} prefix helper
          </button>
          <button
            type="button"
            style={{ fontSize: "0.75rem", padding: "0.2rem 0.45rem" }}
            onClick={() => syncHashSnoozeLiveResumePrefixHelpExpanded(helpExpanded)}
            title="Apply this panel's helper visibility to Health and Run notifications"
          >
            Sync helper panels
          </button>
          {(hashSnoozePrefixHelperSyncOverflowDedupeBadge || hashSnoozePrefixHelperSyncOverflowDedupeBadgeFading) ?
            <span
              role="status"
              aria-live={
                hashSnoozePrefixHelperSyncOverflowDedupeBadgeFading ? "assertive"
                : hashSnoozePrefixHelperSyncOverflowDedupeBadgeTitleClearing ? "polite"
                : "off"
              }
              aria-atomic={
                !hashSnoozePrefixHelperSyncOverflowDedupeBadgeTitleClearing &&
                !hashSnoozePrefixHelperSyncOverflowDedupeBadgeFading
              }
              aria-label={hashSnoozePrefixHelperSyncOverflowDedupeBadgeDisplay ?? undefined}
              className={
                hashSnoozePrefixHelperSyncOverflowDedupeBadgeFading ?
                  "muted hash-snooze-sync-dedupe-fade"
                : "muted"
              }
              style={{ fontSize: "0.7rem", padding: "0 0.3rem", borderRadius: "999px", border: "1px solid var(--line, #444)" }}
              title={hashSnoozePrefixHelperSyncOverflowDedupeBadgeTitle}
            >
              {hashSnoozePrefixHelperSyncOverflowDedupeBadgeDisplay}
            </span>
          : null}
          {hashSnoozePrefixHelperSyncOverflowDedupeBadgeAtomicRestoreAnnouncement ?
            <>
              {hashSnoozePrefixHelperSyncOverflowDedupeBadgeAtomicRestoreBadge ?
                <span
                  role="status"
                  aria-live="polite"
                  aria-atomic={false}
                  aria-label={hashSnoozePrefixHelperSyncOverflowDedupeBadgeAtomicRestoreAriaLabel}
                  className="muted"
                  style={{
                    fontSize: "0.7rem",
                    padding: "0 0.3rem",
                    borderRadius: "999px",
                    border: "1px solid var(--line, #444)",
                  }}
                  title={hashSnoozePrefixHelperSyncOverflowDedupeBadgeAtomicRestoreAnnouncement}
                >
                  {hashSnoozePrefixHelperSyncOverflowDedupeBadgeAtomicRestoreBadge}
                </span>
              : null}
              <span
                role="status"
                aria-live="polite"
                aria-atomic={true}
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: "hidden",
                  clip: "rect(0, 0, 0, 0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              >
                {hashSnoozePrefixHelperSyncOverflowDedupeBadgeAtomicRestoreAnnouncement}
              </span>
            </>
          : null}
          {hashSnoozePrefixHelperSyncStackDepthBadge ?
            <span
              role="status"
              className="muted"
              style={{ fontSize: "0.7rem", padding: "0 0.3rem", borderRadius: "999px", border: "1px solid var(--line, #444)" }}
              title={`Prefix helper sync toast stack depth (max ${HASH_SNOOZE_PREFIX_HELPER_SYNC_STACK_MAX})`}
            >
              {hashSnoozePrefixHelperSyncStackDepthBadge}
            </span>
          : null}
        </div>
        {helpExpanded ?
          <span
            id={helpId}
            className="muted"
            style={{ fontSize: "0.75rem", display: "block", marginBottom: compact ? "0.35rem" : "0.5rem" }}
          >
            Adds announcements resumed before live snooze updates when you return to this tab.
          </span>
        : null}
        {hashSnoozePrefixHelperSyncStackOverflow ?
          <span
            role="status"
            className="muted"
            style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.2rem", color: "#c90" }}
          >
            {hashSnoozePrefixHelperSyncStackOverflow}
          </span>
        : null}
        {hashSnoozePrefixHelperSyncToasts.length > 0 ?
          <>
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                border: 0,
              }}
            >
              {hashSnoozePrefixHelperSyncLiveAnnouncement}
            </div>
            {hashSnoozePrefixHelperSyncToasts.map((entry) => (
              <span
                key={entry.id}
                className="muted"
                style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.2rem" }}
              >
                {entry.text}
              </span>
            ))}
          </>
        : null}
      </>
    );
  }

  function renderHashSnoozePanel(compact = false) {
    return (
      <>
        {renderHashSnoozeLiveResumePrefixToggle(compact)}
        {hashSnoozeUntil ?
          <>
            <p className="muted" style={compact ? { marginBottom: "0.35rem" } : undefined}>
              hash alert snoozed until {hashSnoozeUntil.slice(0, 19).replace("T", " ")}
              {hashSnoozeRemaining ? ` · ${hashSnoozeRemaining}` : ""}
            </p>
            <button type="button" onClick={clearHashSnooze} style={{ marginBottom: "0.35rem" }}>
              Clear snooze
            </button>
          </>
        : null}
      </>
    );
  }

  function renderHashSnoozeExpiredNotice(compact = false) {
    if (!hashSnoozeExpiredNotice) return null;
    return (
      <div
        ref={hashSnoozeExpiredNoticeRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="hash-snooze-expired-notice-text"
        className="row"
        style={{ marginBottom: compact ? "0.35rem" : undefined }}
      >
        <p id="hash-snooze-expired-notice-text" className="muted" style={{ margin: 0 }}>
          {hashSnoozeExpiredNotice}
          {hashSnoozeExpiredRelative ? (
            <span title={hashSnoozeExpiredAt ?? undefined}>
              {" "}
              · {hashSnoozeExpiredRelative}
              {hashSnoozeRelativePaused ? " (paused)" : ""}
              {hashSnoozeRelativePaused && hashSnoozeRelativeUpdatedAt ?
                ` · updated ${hashSnoozeRelativeUpdatedAt.slice(11, 19)}`
              : ""}
            </span>
          ) : null}
        </p>
        <button type="button" ref={hashSnoozeExpiredDismissRef} onClick={dismissHashSnoozeExpiredNotice}>
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="shell">
      <div className="brand">
        <h1>DEVAIOS</h1>
        <span>milestone 96</span>
      </div>
      <p className="lede">
        Pulse hover polite, legend atomic off paused, restore polite, dedupe hidden atomic restore.
      </p>

      {error ? <p className="error">{error}</p> : null}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {hashSnoozeLiveAnnouncement}
      </div>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {dryRunBridgeUndoUrgencyLiveAnnouncement}
      </div>

      <div className="grid">
        <section className="panel">
          <h2>Health</h2>
          <div className="status">
            <span className={`dot ${health?.ok ? "ok" : ""}`} />
            <span>{health ? `${health.service} v${health.version}` : "API unreachable"}</span>
          </div>
          <p className="muted">{health?.home ?? health?.time ?? "Start with pnpm dev"}</p>
          {health?.deliveryLog ? (
            <p className="muted">
              delivery log: {health.deliveryLog.entryCount} entries · rotate every{" "}
              {health.deliveryLog.rotateIntervalHours}h
              {health.deliveryLog.nextRotateAt ?
                ` · next ${health.deliveryLog.nextRotateAt.slice(0, 19)}`
              : ""}
              {health.deliveryLog.rotationHistoryCount != null ?
                ` · ${health.deliveryLog.rotationHistoryCount} rotations logged`
              : ""}
            </p>
          ) : null}
          {health?.deadLetterHashes ? (
            <p className="muted">dead-letter hash index: {health.deadLetterHashes.hashCount} entries</p>
          ) : null}
          {health?.deadLetterHashes?.tickCheck?.lastCheckedAt ? (
            <p className="muted">
              hash tick checks: {health.deadLetterHashes.tickCheck.checkCount} · last{" "}
              {health.deadLetterHashes.tickCheck.lastOk ? "ok" : "fail"}
              {health.deadLetterHashes.tickCheck.lastRebuilt ? " (rebuilt)" : ""}
            </p>
          ) : null}
          {renderHashSnoozePanel()}
          {renderHashSnoozeExpiredNotice()}
          {hashTickAlert ? (
            <>
              <p className="error">{hashTickAlert}</p>
              <div className="row" style={{ marginBottom: "0.35rem" }}>
                <button type="button" onClick={dismissHashTickAlert}>
                  Dismiss alert
                </button>
                <select value={hashSnoozeMinutes} onChange={(e) => setHashSnoozeMinutes(e.target.value)}>
                  <option value="15">15m</option>
                  <option value="60">1h</option>
                  <option value="240">4h</option>
                  <option value="1440">24h</option>
                </select>
                <button type="button" onClick={() => snoozeHashTickAlert(Number(hashSnoozeMinutes) || 60)}>
                  Snooze
                </button>
              </div>
            </>
          ) : null}
          <button type="button" onClick={() => void refresh()}>
            Refresh
          </button>
        </section>

        <section className="panel">
          <h2>Workspaces</h2>
          <form className="form" onSubmit={onCreateWorkspace}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug" />
            <button className="primary" type="submit">
              Create workspace
            </button>
          </form>
          <ul className="list">
            {workspaces.map((w) => (
              <li key={w.id}>
                <button type="button" onClick={() => setSelectedSlug(w.slug)}>
                  {selectedSlug === w.slug ? "● " : "○ "}
                  {w.slug} — {w.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="form" style={{ marginTop: "0.75rem" }}>
            <input
              value={cloneTargetSlug}
              onChange={(e) => setCloneTargetSlug(e.target.value)}
              placeholder="clone target slug"
            />
            <input
              value={cloneTargetName}
              onChange={(e) => setCloneTargetName(e.target.value)}
              placeholder="clone target name (optional)"
            />
            <label className="muted">
              <input
                type="checkbox"
                checked={cloneIncludeApprovals}
                onChange={(e) => setCloneIncludeApprovals(e.target.checked)}
              />{" "}
              include approvals snapshot
            </label>
            <label className="muted">
              <input
                type="checkbox"
                checked={cloneIncludeJobs}
                onChange={(e) => setCloneIncludeJobs(e.target.checked)}
              />{" "}
              include related jobs snapshot
            </label>
            <label className="muted">
              <input
                type="checkbox"
                checked={cloneIncludeScheduleTemplates}
                onChange={(e) => setCloneIncludeScheduleTemplates(e.target.checked)}
              />{" "}
              include schedule job templates
            </label>
            <button type="button" onClick={() => void onCloneWorkspace()}>
              Full clone `{selectedSlug}` (projects + memories + chats)
            </button>
            <button type="button" onClick={() => void onRunJobTemplates()}>
              Run job templates for `{selectedSlug}`
            </button>
          </div>
          {cloneOut ? <p className="muted">{cloneOut}</p> : null}
          {jobTemplateRunOut ? <p className="muted">{jobTemplateRunOut}</p> : null}
        </section>

        <section className="panel">
          <h2>Job templates (`{selectedSlug}`)</h2>
          <div className="row" style={{ marginBottom: "0.5rem" }}>
            <button type="button" onClick={() => void onLoadDefaultJobTemplates()}>
              Load defaults
            </button>
            <button type="button" onClick={() => void onSaveJobTemplates()}>
              Save templates
            </button>
            <button type="button" onClick={() => void refreshJobTemplates()}>
              Refresh history
            </button>
          </div>
          {jobTemplates.length === 0 ? <p className="muted">No templates — load defaults to start</p> : null}
          <ul className="list">
            {jobTemplates.map((t) => (
              <li key={t.id}>
                <label className="muted">
                  <input
                    type="checkbox"
                    checked={t.enabled}
                    onChange={(e) => updateJobTemplate(t.id, { enabled: e.target.checked })}
                  />{" "}
                  {t.label} ({t.kind})
                </label>
                <input
                  value={String(t.intervalMinutes)}
                  onChange={(e) =>
                    updateJobTemplate(t.id, { intervalMinutes: Number(e.target.value) || t.intervalMinutes })
                  }
                  placeholder="interval minutes"
                  style={{ marginTop: "0.25rem" }}
                />
                <div className="row" style={{ marginTop: "0.25rem" }}>
                  <input
                    value={t.windowStartHour ?? ""}
                    onChange={(e) =>
                      updateJobTemplate(t.id, {
                        windowStartHour: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                    placeholder="window start hour (0-23)"
                  />
                  <input
                    value={t.windowEndHour ?? ""}
                    onChange={(e) =>
                      updateJobTemplate(t.id, {
                        windowEndHour: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                    placeholder="window end hour (0-23)"
                  />
                </div>
                <input
                  value={t.passphrase ?? ""}
                  onChange={(e) => updateJobTemplate(t.id, { passphrase: e.target.value || null })}
                  placeholder="template passphrase (optional)"
                  type="password"
                  style={{ marginTop: "0.25rem" }}
                />
                {t.kind === "batch_restore" ? (
                  <>
                    <label className="muted" style={{ display: "block", marginTop: "0.25rem" }}>
                      restore conflict{" "}
                      <select
                        value={t.conflictPolicy ?? "skip"}
                        onChange={(e) =>
                          updateJobTemplate(t.id, { conflictPolicy: e.target.value as "skip" | "replace" })
                        }
                      >
                        <option value="skip">skip existing</option>
                        <option value="replace">replace existing</option>
                      </select>
                    </label>
                    <label className="muted" style={{ display: "block", marginTop: "0.25rem" }}>
                      <input
                        type="checkbox"
                        checked={t.dryRunBeforeApply ?? false}
                        onChange={(e) => updateJobTemplate(t.id, { dryRunBeforeApply: e.target.checked })}
                      />{" "}
                      dry-run preview before apply
                    </label>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
          {jobTemplatesOut ? <p className="muted">{jobTemplatesOut}</p> : null}
          <h3 style={{ marginTop: "0.75rem", fontSize: "0.95rem" }}>Run notifications</h3>
          {renderHashSnoozePanel(true)}
          {renderHashSnoozeExpiredNotice(true)}
          {hashTickAlert ? (
            <>
              <p className="error" style={{ marginBottom: "0.35rem" }}>
                {hashTickAlert}
              </p>
              <div className="row" style={{ marginBottom: "0.35rem" }}>
                <button type="button" onClick={dismissHashTickAlert}>
                  Dismiss
                </button>
                <select value={hashSnoozeMinutes} onChange={(e) => setHashSnoozeMinutes(e.target.value)}>
                  <option value="15">15m</option>
                  <option value="60">1h</option>
                  <option value="240">4h</option>
                  <option value="1440">24h</option>
                </select>
                <button type="button" onClick={() => snoozeHashTickAlert(Number(hashSnoozeMinutes) || 60)}>
                  Snooze
                </button>
              </div>
            </>
          ) : null}
          <div className="row" style={{ marginBottom: "0.35rem" }}>
            <button type="button" onClick={() => void onMarkTemplateNotificationsRead()}>
              Mark all read
            </button>
            <button type="button" onClick={() => void onExportDryRunDetails()}>
              Export dry-run JSON
            </button>
            {dryRunExportBadge ? (
              <span
                style={{
                  fontSize: "0.8rem",
                  padding: "0.1rem 0.45rem",
                  borderRadius: "999px",
                  border: "1px solid var(--line, #444)",
                }}
              >
                {dryRunExportBadge}
              </span>
            ) : null}
          </div>
          <div className="row" style={{ marginBottom: "0.35rem" }}>
            <label className="muted">
              <input
                type="checkbox"
                checked={dryRunExportFilterWorkspace}
                onChange={(e) => setDryRunExportFilterWorkspace(e.target.checked)}
              />{" "}
              filter workspace `{selectedSlug}`
            </label>
            <input
              value={dryRunExportTemplateId}
              onChange={(e) => setDryRunExportTemplateId(e.target.value)}
              placeholder="template id filter (optional)"
            />
            <input
              type="datetime-local"
              value={dryRunExportSince}
              onChange={(e) => setDryRunExportSince(e.target.value)}
              title="since"
            />
            <input
              type="datetime-local"
              value={dryRunExportUntil}
              onChange={(e) => setDryRunExportUntil(e.target.value)}
              title="until"
            />
            <select
              value={dryRunExportPreset}
              onChange={(e) => setDryRunExportPreset(e.target.value as "" | "24h" | "7d" | "30d")}
            >
              <option value="">no preset</option>
              <option value="24h">last 24h</option>
              <option value="7d">last 7d</option>
              <option value="30d">last 30d</option>
            </select>
            <input
              value={dryRunExportLimit}
              onChange={(e) => persistDryRunExportLimit(e.target.value)}
              placeholder="export limit (default 50)"
              title="export limit"
            />
            {dryRunExportLimitPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => persistDryRunExportLimit(String(preset))}
                style={{
                  fontSize: "0.8rem",
                  opacity: dryRunExportLimit === String(preset) ? 1 : 0.75,
                }}
              >
                limit {preset}
              </button>
            ))}
            {dryRunBadgePreview ? (
              <span
                style={{
                  fontSize: "0.8rem",
                  padding: "0.1rem 0.45rem",
                  borderRadius: "999px",
                  border: "1px dashed var(--line, #666)",
                  opacity: 0.85,
                }}
                title="live filter preview"
              >
                preview: {dryRunBadgePreview}
                {dryRunLimitHint ? ` · ${dryRunLimitHint}` : ""}
              </span>
            ) : dryRunLimitHint ? (
              <span className="muted" style={{ fontSize: "0.8rem" }}>
                {dryRunLimitHint}
              </span>
            ) : null}
            <button type="button" onClick={clearDryRunExportFilters}>
              Clear filters
            </button>
          </div>
          <ul className="list">
            {templateNotifications.length === 0 ? <li className="muted">No unread notifications</li> : null}
            {templateNotifications.map((n) => (
              <li key={n.id}>
                {n.status === "ok" ? "ok" : "err"} · {n.templateId} · {n.createdAt.slice(0, 19)}
                {n.path ? ` · ${n.path}` : ""}
                <div className="muted">{n.message}</div>
                {n.dryRunDetail ? (
                  <>
                    <div className="muted" style={{ marginTop: "0.2rem", fontSize: "0.85rem" }}>
                      dry-run detail · backup {n.dryRunDetail.backupPath?.split("/").pop() ?? "n/a"} · ws
                      +{n.dryRunDetail.workspaces.insert}/skip {n.dryRunDetail.workspaces.skip}/replace{" "}
                      {n.dryRunDetail.workspaces.replace} · proj +{n.dryRunDetail.projects.insert}
                    </div>
                    <button type="button" style={{ marginTop: "0.2rem" }} onClick={() => toggleDryRunJson(n.id)}>
                      {expandedDryRunIds.includes(n.id) ? "Hide" : "Show"} dry-run JSON
                    </button>
                    {expandedDryRunIds.includes(n.id) ? (
                      <pre style={{ marginTop: "0.25rem", fontSize: "0.75rem" }}>
                        {JSON.stringify(n.dryRunDetail, null, 2)}
                      </pre>
                    ) : null}
                  </>
                ) : null}
              </li>
            ))}
          </ul>
          {dryRunExportOut ? (
            <div className="row" style={{ alignItems: "center" }}>
              <p className="muted" style={{ margin: 0 }}>
                {dryRunExportOut}
              </p>
              {dryRunExportPath ? (
                <>
                  <button type="button" onClick={() => void copyDryRunExportPath()}>
                    Copy path
                  </button>
                  <button type="button" onClick={() => void copyDryRunOpenPathCommand()}>
                    Copy open cmd
                  </button>
                  <button type="button" onClick={() => void revealDryRunExportPath()}>
                    Reveal in Finder
                  </button>
                </>
              ) : null}
            </div>
          ) : null}
          {dryRunOpenPathHint ? <p className="muted">{dryRunOpenPathHint}</p> : null}
          <div className="row" style={{ marginTop: "0.25rem", alignItems: "center" }}>
            <button type="button" onClick={requestInstallDryRunRevealDevBridge}>
              Install dev bridge
            </button>
            <button type="button" onClick={() => void copyDryRunRevealBridgeSnippet()}>
              Copy bridge snippet
            </button>
            {dryRunRevealBridgeInstalled ? (
              <button type="button" onClick={requestUninstallDryRunRevealDevBridge}>
                Clear bridge
              </button>
            ) : null}
            {dryRunRevealBridgeInstalled ? (
              <span className="muted" style={{ fontSize: "0.8rem" }}>
                bridge active · session
              </span>
            ) : (
              <span className="muted" style={{ fontSize: "0.8rem" }}>
                bridge not installed
              </span>
            )}
          </div>
          {dryRunBridgeUndoToast ? (
            <div className="row" style={{ marginTop: "0.25rem", alignItems: "center" }}>
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                role="img"
                aria-label={dryRunBridgeUndoRingAriaLabel}
                style={{ flexShrink: 0 }}
              >
                <circle cx={8} cy={8} r={6} fill="none" stroke="var(--line, #444)" strokeWidth={2} />
                <circle
                  cx={8}
                  cy={8}
                  r={6}
                  fill="none"
                  stroke={dryRunBridgeUndoRingStroke}
                  strokeWidth={2}
                  strokeDasharray={`${(dryRunBridgeUndoProgressPct / 100) * 37.7} 37.7`}
                  transform="rotate(-90 8 8)"
                  className={dryRunBridgeUndoRingPulseClass}
                  style={
                    dryRunBridgeUndoRingPulseDuration != null ?
                      { animationDuration: `${dryRunBridgeUndoRingPulseDuration}s` }
                    : undefined
                  }
                />
              </svg>
              <span className="muted" style={{ fontSize: "0.8rem" }}>
                bridge {dryRunBridgeUndoToast}
                {dryRunBridgeUndoRemainingSec != null ? ` · ${dryRunBridgeUndoRemainingSec}s` : ""}
              </span>
              {dryRunBridgeUndoRingUrgencyBadge ?
                <>
                <span
                  role="status"
                  aria-label={dryRunBridgeUndoRingUrgencyBadgeTooltip}
                  title={dryRunBridgeUndoRingUrgencyBadgeTooltip}
                  className={
                    dryRunBridgeUndoUrgencyFlashZone === "red" ? "dry-run-undo-urgency-flash-red"
                    : dryRunBridgeUndoUrgencyFlashZone === "amber" ? "dry-run-undo-urgency-flash-amber"
                    : dryRunBridgeUndoUrgencyFlashZone === "normal" ? "dry-run-undo-urgency-flash-normal"
                    : undefined
                  }
                  style={{
                    fontSize: "0.75rem",
                    padding: "0 0.3rem",
                    borderRadius: "999px",
                    border: "1px solid var(--line, #444)",
                    animationDuration:
                      dryRunBridgeUndoUrgencyFlashZone ?
                        `${dryRunBridgeUndoUrgencyFlashDurationMs(dryRunBridgeUndoUrgencyFlashZone)}ms`
                      : undefined,
                    color:
                      dryRunBridgeUndoRingUrgencyBadge === "red" ? "#c44"
                      : dryRunBridgeUndoRingUrgencyBadge === "amber" ? "#c90"
                      : "var(--muted, #8fa3b5)",
                  }}
                >
                  {dryRunBridgeUndoRingUrgencyBadge}
                </span>
                {dryRunBridgeUndoUrgencyFlashDurationBadge ?
                  <>
                    <span
                      role="status"
                      aria-live="polite"
                      aria-atomic="true"
                      aria-label={dryRunBridgeUndoUrgencyFlashDurationBadgeTitle ?? dryRunBridgeUndoUrgencyFlashDurationBadge ?? undefined}
                      className="muted dry-run-undo-urgency-flash-duration-border-pulse"
                      style={{
                        fontSize: "0.7rem",
                        padding: "0 0.3rem",
                        borderRadius: "999px",
                        border: `1px solid ${dryRunBridgeUndoUrgencyFlashZoneBorderColor}`,
                        backgroundColor: dryRunBridgeUndoUrgencyFlashZoneBackgroundTint,
                        color: dryRunBridgeUndoUrgencyFlashZoneAccentColor,
                        animationDuration:
                          dryRunBridgeUndoUrgencyFlashDurationBadgeBorderPulseSec != null ?
                            `${dryRunBridgeUndoUrgencyFlashDurationBadgeBorderPulseSec}s`
                          : undefined,
                      }}
                      title={dryRunBridgeUndoUrgencyFlashDurationBadgeTitle ?? undefined}
                      onMouseEnter={() => {
                        setDryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverState("paused");
                        setDryRunBridgeUndoUrgencyFlashDurationBorderPulsePauseAnnouncement(
                          "border pulse paused",
                        );
                      }}
                      onMouseLeave={() => {
                        setDryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverState("resumed");
                        setDryRunBridgeUndoUrgencyFlashDurationBorderPulseResumeAnnouncement(
                          "border pulse resumed",
                        );
                      }}
                    >
                      {dryRunBridgeUndoUrgencyFlashDurationBadgeVisible}
                    </span>
                    {dryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverState ?
                      <span
                        role="status"
                        aria-live={
                          dryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverState === "resumed" ?
                            "polite"
                          : dryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverState === "paused" ?
                            "assertive"
                          : "off"
                        }
                        aria-atomic={
                          dryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverState === "paused" ?
                            false
                          : dryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverState === "resumed"
                        }
                        aria-label={dryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverStateLabel ?? undefined}
                        className="muted"
                        style={{
                          fontSize: "0.65rem",
                          padding: "0 0.25rem",
                          borderRadius: "999px",
                          border: "1px solid var(--line, #444)",
                          textTransform: "capitalize",
                        }}
                        title={dryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverStateLabel ?? undefined}
                      >
                        {dryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverStateLabel ??
                          dryRunBridgeUndoUrgencyFlashDurationBorderPulseHoverState}
                      </span>
                    : null}
                    <span
                      role="status"
                      aria-live="polite"
                      aria-atomic="true"
                      style={{
                        position: "absolute",
                        width: 1,
                        height: 1,
                        padding: 0,
                        margin: -1,
                        overflow: "hidden",
                        clip: "rect(0, 0, 0, 0)",
                        whiteSpace: "nowrap",
                        border: 0,
                      }}
                    >
                      {dryRunBridgeUndoUrgencyFlashDurationBorderPulsePauseAnnouncement ||
                        dryRunBridgeUndoUrgencyFlashDurationBorderPulseResumeAnnouncement}
                    </span>
                  </>
                : null}
              </>
              : null}
              <button type="button" onClick={undoDryRunBridgeAction}>
                Undo
              </button>
              <span className="muted" style={{ fontSize: "0.8rem" }}>
                {dryRunBridgeUndoShortcutHint}
                {dryRunBridgeUndoRingPulseDurationLabel ?
                  ` · ${dryRunBridgeUndoRingPulseDurationLabel}`
                : ""}
              </span>
            </div>
          ) : null}
          {dryRunExportCopyOut ? <p className="muted">{dryRunExportCopyOut}</p> : null}
          {templateNotificationsOut ? <p className="muted">{templateNotificationsOut}</p> : null}
          {notificationStreamOut ? <p className="muted">{notificationStreamOut}</p> : null}
          <h3 style={{ marginTop: "0.75rem", fontSize: "0.95rem" }}>Notification webhook</h3>
          <label className="muted">
            <input
              type="checkbox"
              checked={notificationWebhookEnabled}
              onChange={(e) => setNotificationWebhookEnabled(e.target.checked)}
            />{" "}
            POST notifications to webhook URL
          </label>
          <input
            value={notificationWebhookUrl}
            onChange={(e) => setNotificationWebhookUrl(e.target.value)}
            placeholder="https://hooks.example.com/devaios"
            style={{ marginTop: "0.25rem" }}
          />
          <input
            value={notificationWebhookMaxRetries}
            onChange={(e) => setNotificationWebhookMaxRetries(e.target.value)}
            placeholder="max retries (default 3)"
            style={{ marginTop: "0.25rem" }}
          />
          <div className="row" style={{ marginTop: "0.25rem" }}>
            <button type="button" onClick={() => void onSaveNotificationWebhook()}>
              Save webhook
            </button>
            <button type="button" onClick={() => void onLoadWebhookDeadLetters()}>
              Load dead letters
            </button>
            <button type="button" onClick={() => void onReplayWebhookDeadLetters(true)}>
              Replay all
            </button>
            <button
              type="button"
              onClick={() => void onReplayWebhookDeadLetters(false)}
              disabled={!selectedWebhookDeadLetterIds.length}
            >
              Replay selected ({selectedWebhookDeadLetterIds.length})
            </button>
            <button
              type="button"
              onClick={() => void onDeleteWebhookDeadLetters(false)}
              disabled={!selectedWebhookDeadLetterIds.length}
            >
              Delete selected
            </button>
            <button type="button" onClick={() => void onDeleteWebhookDeadLetters(true)}>
              Delete all
            </button>
            <button type="button" onClick={() => void onExportWebhookDeadLetters()}>
              Export dead letters JSON
            </button>
            <button type="button" onClick={() => void onRebuildHashIndex()}>
              Rebuild hash index
            </button>
            <button type="button" onClick={() => void onCheckHashIndexIntegrity()}>
              Check hash integrity
            </button>
            <label className="muted">
              <input
                type="checkbox"
                checked={hashIndexAutoRebuild}
                onChange={(e) => setHashIndexAutoRebuild(e.target.checked)}
              />{" "}
              auto-rebuild on failure
            </label>
          </div>
          <input
            value={webhookDeadLetterImportPath}
            onChange={(e) => setWebhookDeadLetterImportPath(e.target.value)}
            placeholder="path to exported dead-letter JSON"
            style={{ marginTop: "0.25rem" }}
          />
          <div className="row" style={{ marginTop: "0.25rem" }}>
            <button type="button" onClick={() => void onImportWebhookDeadLetters(false)}>
              Import dead letters
            </button>
            <button type="button" onClick={() => void onImportWebhookDeadLetters(true)}>
              Import + replay
            </button>
          </div>
          {notificationWebhookOut ? <p className="muted">{notificationWebhookOut}</p> : null}
          {webhookReplayOut ? <p className="muted">{webhookReplayOut}</p> : null}
          {webhookDeadLetterExportPath ? <p className="muted">{webhookDeadLetterExportPath}</p> : null}
          {hashIndexRebuildOut ? <p className="muted">{hashIndexRebuildOut}</p> : null}
          {hashIndexIntegrityOut ? <p className="muted">{hashIndexIntegrityOut}</p> : null}
          {webhookDeadLetterImportOut ? <p className="muted">{webhookDeadLetterImportOut}</p> : null}
          {webhookDeadLetters.length ? (
            <ul className="list">
              {webhookDeadLetters.map((d) => (
                <li key={d.id}>
                  <label className="muted">
                    <input
                      type="checkbox"
                      checked={selectedWebhookDeadLetterIds.includes(d.id)}
                      onChange={() => toggleWebhookDeadLetterId(d.id)}
                    />{" "}
                    {d.failedAt.slice(0, 19)} · {d.attempts} tries · {d.lastError ?? "failed"}
                  </label>
                </li>
              ))}
            </ul>
          ) : null}
          <h3 style={{ marginTop: "0.75rem", fontSize: "0.95rem" }}>Notification email (SMTP profile)</h3>
          <label className="muted">
            <input
              type="checkbox"
              checked={notificationEmailEnabled}
              onChange={(e) => setNotificationEmailEnabled(e.target.checked)}
            />{" "}
            send template notifications via email outbox
          </label>
          <input
            value={notificationEmailFrom}
            onChange={(e) => setNotificationEmailFrom(e.target.value)}
            placeholder="from address"
            style={{ marginTop: "0.25rem" }}
          />
          <input
            value={notificationEmailTo}
            onChange={(e) => setNotificationEmailTo(e.target.value)}
            placeholder="to address"
            style={{ marginTop: "0.25rem" }}
          />
          <div className="row" style={{ marginTop: "0.25rem" }}>
            <input
              value={notificationEmailSmtpHost}
              onChange={(e) => setNotificationEmailSmtpHost(e.target.value)}
              placeholder="smtp host (optional)"
            />
            <input
              value={notificationEmailSmtpPort}
              onChange={(e) => setNotificationEmailSmtpPort(e.target.value)}
              placeholder="smtp port"
            />
          </div>
          <label className="muted">
            <input
              type="checkbox"
              checked={notificationEmailUseOutbox}
              onChange={(e) => setNotificationEmailUseOutbox(e.target.checked)}
            />{" "}
            write to ~/.devaios/email-outbox
          </label>
          <label className="muted">
            <input
              type="checkbox"
              checked={notificationEmailSendViaSmtp}
              onChange={(e) => setNotificationEmailSendViaSmtp(e.target.checked)}
            />{" "}
            send via SMTP (TLS)
          </label>
          <label className="muted">
            <input
              type="checkbox"
              checked={notificationEmailSmtpSecure}
              onChange={(e) => setNotificationEmailSmtpSecure(e.target.checked)}
            />{" "}
            implicit TLS (port 465)
          </label>
          <input
            value={notificationEmailSmtpUser}
            onChange={(e) => setNotificationEmailSmtpUser(e.target.value)}
            placeholder="smtp user (optional)"
            style={{ marginTop: "0.25rem" }}
          />
          <input
            value={notificationEmailSmtpPass}
            onChange={(e) => setNotificationEmailSmtpPass(e.target.value)}
            placeholder="smtp pass (optional)"
            type="password"
            style={{ marginTop: "0.25rem" }}
          />
          <div className="row" style={{ marginTop: "0.25rem" }}>
            <button type="button" onClick={() => void onSaveNotificationEmail()}>
              Save email profile
            </button>
            <button type="button" onClick={() => void onLoadEmailOutbox()}>
              Preview outbox
            </button>
            <button type="button" onClick={() => void onLoadEmailDeliveryLog()}>
              Load delivery log
            </button>
            <button type="button" onClick={() => void onRotateEmailDeliveryLog()}>
              Rotate log
            </button>
            <button type="button" onClick={() => void onLoadEmailRotationHistory()}>
              Rotation history
            </button>
            <button type="button" onClick={() => void onRotateRotationHistory()}>
              Trim history
            </button>
            <button type="button" onClick={() => void onExportRotationHistoryCsv()}>
              Export CSV
            </button>
            <button type="button" onClick={() => void onCheckRotationIntegrity()}>
              Check rotation integrity
            </button>
            <button type="button" onClick={() => void onRepairRotationIntegrity()}>
              Repair rotation integrity
            </button>
            <button type="button" onClick={() => void onExportRotationRepairAuditCsv()}>
              Export audit CSV
            </button>
            <button type="button" onClick={() => void onRotateRotationRepairAudit()}>
              Trim audit log
            </button>
          </div>
          <div className="form" style={{ marginTop: "0.5rem" }}>
            <input
              value={rotationAuditRetentionMaxCount}
              onChange={(e) => setRotationAuditRetentionMaxCount(e.target.value)}
              placeholder="audit retention max count"
            />
            <input
              value={rotationAuditRetentionMaxAge}
              onChange={(e) => setRotationAuditRetentionMaxAge(e.target.value)}
              placeholder="audit max age days"
            />
            <div className="row">
              <button type="button" onClick={() => void onLoadRotationAuditRetention()}>
                Load audit retention
              </button>
              <button
                type="button"
                onClick={() => void onSaveRotationAuditRetention()}
                disabled={rotationAuditSaveDisabled}
              >
                Save audit retention
              </button>
              {rotationAuditSaveReady ? (
                <>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      padding: "0.1rem 0.45rem",
                      borderRadius: "999px",
                      border: "1px solid var(--accent, #4a9)",
                    }}
                  >
                    save ready
                  </span>
                  <span className="muted" style={{ fontSize: "0.8rem" }}>
                    {rotationAuditSaveShortcutHint} to save
                  </span>
                </>
              ) : null}
              {rotationAuditSaveToast ? (
                <span
                  style={{
                    fontSize: "0.8rem",
                    padding: "0.1rem 0.45rem",
                    borderRadius: "999px",
                    ...rotationAuditSaveToastStyle(rotationAuditSaveToast.tone),
                  }}
                >
                  {rotationAuditSaveToast.text}
                </span>
              ) : null}
              <button
                type="button"
                id="rotation-audit-toast-legend-toggle"
                ref={rotationAuditLegendToggleRef}
                aria-expanded={rotationAuditToastLegendExpanded}
                aria-describedby="rotation-audit-legend-mixed-clear-escape-only-help rotation-audit-legend-mixed-clear-escape-only-state"
                {...(rotationAuditLegendToggleAriaPressed !== undefined ?
                  { "aria-pressed": rotationAuditLegendToggleAriaPressed }
                : {})}
                aria-controls="rotation-audit-toast-legend"
                onClick={() => persistRotationAuditToastLegendExpanded(!rotationAuditToastLegendExpanded)}
              >
                {rotationAuditToastLegendExpanded ? "Hide" : "Show"} toast legend
              </button>
              <span
                id="rotation-audit-legend-mixed-clear-escape-only-help"
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: "hidden",
                  clip: "rect(0, 0, 0, 0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              >
                Mixed clears on Escape only controls whether legend pill focus clears aria-pressed mixed.
              </span>
              <span
                id="rotation-audit-legend-mixed-clear-escape-only-state"
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: "hidden",
                  clip: "rect(0, 0, 0, 0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              >
                Escape only mixed clear {rotationAuditLegendMixedClearEscapeOnlyStateLabel}
              </span>
              <span
                role="status"
                aria-live="polite"
                aria-atomic="true"
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: "hidden",
                  clip: "rect(0, 0, 0, 0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              >
                {rotationAuditLegendMixedClearEscapeOnlyLiveAnnouncement}
              </span>
              <label className="muted" style={{ fontSize: "0.75rem", marginLeft: "0.35rem" }}>
                <input
                  id="rotation-audit-legend-mixed-clear-escape-only"
                  type="checkbox"
                  checked={rotationAuditLegendMixedClearEscapeOnly}
                  onChange={(event) =>
                    persistRotationAuditLegendMixedClearEscapeOnly(event.target.checked)
                  }
                  title="When enabled, aria-pressed mixed clears only on Escape — not when focusing legend pills"
                />{" "}
                mixed clears on Escape only
              </label>
              {rotationAuditLegendMixedClearEscapeOnlyLiveClearBadge ?
                <>
                  <span
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    className="muted rotation-audit-legend-live-clear-pulse"
                    style={{
                      fontSize: "0.7rem",
                      marginLeft: "0.35rem",
                      padding: "0 0.3rem",
                      borderRadius: "999px",
                      border: "1px solid #c90",
                      color: "#c90",
                    }}
                    title="Seconds until Escape-only live announcement clears"
                    onMouseEnter={() => {
                      setRotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverState("paused");
                      setRotationAuditLegendMixedClearEscapeOnlyLiveClearPulsePauseAnnouncement(
                        "live clear countdown paused",
                      );
                    }}
                    onMouseLeave={() => {
                      setRotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverState("resumed");
                      setRotationAuditLegendMixedClearEscapeOnlyLiveClearPulseResumeAnnouncement(
                        "live clear countdown resumed",
                      );
                    }}
                  >
                    {rotationAuditLegendMixedClearEscapeOnlyLiveClearBadge}
                  </span>
                  {rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverState ?
                    <span
                      role="status"
                      aria-live={
                        rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverState === "resumed" ?
                          "polite"
                        : rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverState === "paused" ?
                          "assertive"
                        : "off"
                      }
                      aria-atomic={
                        rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverState === "paused" ?
                          false
                        : rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverState === "resumed"
                      }
                      aria-label={rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverStateLabel ?? undefined}
                      className="muted"
                      style={{
                        fontSize: "0.65rem",
                        marginLeft: "0.25rem",
                        padding: "0 0.25rem",
                        borderRadius: "999px",
                        border: "1px solid var(--line, #444)",
                        textTransform: "capitalize",
                      }}
                      title={rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverStateLabel ?? undefined}
                    >
                      {rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverStateLabel ??
                        rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseHoverState}
                    </span>
                  : null}
                  <span
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    style={{
                      position: "absolute",
                      width: 1,
                      height: 1,
                      padding: 0,
                      margin: -1,
                      overflow: "hidden",
                      clip: "rect(0, 0, 0, 0)",
                      whiteSpace: "nowrap",
                      border: 0,
                    }}
                  >
                    {rotationAuditLegendMixedClearEscapeOnlyLiveClearPulsePauseAnnouncement ||
                      rotationAuditLegendMixedClearEscapeOnlyLiveClearPulseResumeAnnouncement}
                  </span>
                </>
              : null}
              {rotationAuditToastLegendExpanded ? (
                <span
                  id="rotation-audit-toast-legend"
                  className="muted"
                  style={{ fontSize: "0.75rem" }}
                  tabIndex={0}
                  aria-labelledby="rotation-audit-toast-legend-toggle"
                  onKeyDown={onRotationAuditLegendContainerKeyDown}
                >
                  toast legend
                  {rotationAuditLegendPositionBadge ? ` · ${rotationAuditLegendPositionBadge}` : ""}:
                  {(["unchanged", "single", "multi"] as const).map((tone, index) => (
                    <span
                      key={tone}
                      ref={(element) => {
                        rotationAuditLegendRefs.current[index] = element;
                      }}
                      tabIndex={rotationAuditLegendFocusIndex === index ? 0 : -1}
                      role="note"
                      title={rotationAuditToastLegendTooltip(tone)}
                      aria-label={rotationAuditToastLegendTooltip(tone)}
                      onFocus={() => {
                        setRotationAuditLegendFocusIndex(index);
                        setRotationAuditLegendFocusHint(rotationAuditToastLegendTooltip(tone));
                        if (rotationAuditLegendArrowHint && !rotationAuditLegendMixedClearEscapeOnly) {
                          clearRotationAuditLegendArrowHint();
                        }
                      }}
                      onBlur={() => setRotationAuditLegendFocusHint(null)}
                      onKeyDown={(event) => onRotationAuditLegendKeyDown(event, index)}
                      style={{
                        marginLeft: index === 0 ? "0.35rem" : "0.25rem",
                        padding: "0 0.3rem",
                        borderRadius: "999px",
                        ...rotationAuditSaveToastStyle(tone),
                      }}
                    >
                      {tone}
                    </span>
                  ))}
                </span>
              ) : null}
              {rotationAuditLegendFocusHint ? (
                <span className="muted" style={{ fontSize: "0.75rem" }}>
                  {rotationAuditLegendFocusHint}
                </span>
              ) : null}
              {rotationAuditLegendWrapHint ? (
                <span className="muted" style={{ fontSize: "0.75rem" }}>
                  wrapped
                </span>
              ) : null}
              {rotationAuditLegendArrowHint ? (
                <span className="muted" style={{ fontSize: "0.75rem" }}>
                  {rotationAuditLegendArrowHint}
                </span>
              ) : null}
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: "hidden",
                  clip: "rect(0, 0, 0, 0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              >
                {rotationAuditLegendArrowLiveAnnouncement}
              </div>
              <button type="button" onClick={() => void onResetRotationAuditRetention()}>
                Reset to defaults
              </button>
              {rotationAuditRetentionBadge ? (
                <span
                  style={{
                    fontSize: "0.8rem",
                    padding: "0.1rem 0.45rem",
                    borderRadius: "999px",
                    border: "1px solid var(--line, #444)",
                  }}
                >
                  {rotationAuditRetentionBadge}
                </span>
              ) : null}
              <span
                style={{
                  fontSize: "0.8rem",
                  padding: "0.1rem 0.45rem",
                  borderRadius: "999px",
                  border: "1px dashed var(--line, #666)",
                  opacity: 0.85,
                }}
              >
                {formatRotationAuditDefaultsBadge(rotationAuditRetentionDefaults)}
              </span>
              {rotationAuditDraftMatchesDefaults ? (
                <span
                  style={{
                    fontSize: "0.8rem",
                    padding: "0.1rem 0.45rem",
                    borderRadius: "999px",
                    border: "1px solid var(--accent, #4a9)",
                  }}
                >
                  matches defaults
                </span>
              ) : null}
              {rotationAuditDefaultsMismatchHint ? (
                <span className="muted" style={{ fontSize: "0.8rem" }}>
                  {rotationAuditDefaultsMismatchHint}
                </span>
              ) : null}
              {rotationAuditRetentionBaseline &&
              (rotationAuditRetentionBaseline.maxCount !== Number(rotationAuditRetentionMaxCount) ||
                rotationAuditRetentionBaseline.maxAgeDays !== Number(rotationAuditRetentionMaxAge)) ? (
                <span className="muted" style={{ fontSize: "0.8rem" }}>
                  unsaved:{" "}
                  {formatRotationAuditRetentionDiff(rotationAuditRetentionBaseline, {
                    maxCount: Number(rotationAuditRetentionMaxCount) || rotationAuditRetentionBaseline.maxCount,
                    maxAgeDays: Number(rotationAuditRetentionMaxAge) || rotationAuditRetentionBaseline.maxAgeDays,
                  })}
                </span>
              ) : null}
            </div>
          </div>
          <div className="row" style={{ marginTop: "0.25rem" }}>
            <select
              value={emailDeliveryChannelFilter}
              onChange={(e) => setEmailDeliveryChannelFilter(e.target.value as "" | "outbox" | "smtp")}
            >
              <option value="">all channels</option>
              <option value="outbox">outbox</option>
              <option value="smtp">smtp</option>
            </select>
            <select
              value={emailDeliveryStatusFilter}
              onChange={(e) =>
                setEmailDeliveryStatusFilter(e.target.value as "" | "written" | "sent" | "failed" | "skipped")
              }
            >
              <option value="">all statuses</option>
              <option value="written">written</option>
              <option value="sent">sent</option>
              <option value="failed">failed</option>
              <option value="skipped">skipped</option>
            </select>
          </div>
          {notificationEmailOut ? <p className="muted">{notificationEmailOut}</p> : null}
          {emailOutboxPreview ? <p className="muted">{emailOutboxPreview}</p> : null}
          {emailDeliveryLogPreview ? <p className="muted">{emailDeliveryLogPreview}</p> : null}
          {emailDeliveryRotateOut ? <p className="muted">{emailDeliveryRotateOut}</p> : null}
          {emailRotationHistoryPreview ? <p className="muted">{emailRotationHistoryPreview}</p> : null}
          {rotationHistoryCsvOut ? <p className="muted">{rotationHistoryCsvOut}</p> : null}
          {rotationIntegrityOut ? <p className="muted">{rotationIntegrityOut}</p> : null}
          {rotationRepairAuditOut ? <p className="muted">{rotationRepairAuditOut}</p> : null}
          {rotationRepairAuditCsvOut ? <p className="muted">{rotationRepairAuditCsvOut}</p> : null}
          {rotationAuditRetentionOut ? <p className="muted">{rotationAuditRetentionOut}</p> : null}
          {rotationHistoryChart.length ? (
            <div
              className="muted"
              style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "52px", marginTop: "0.35rem" }}
              title="Rotation history (bar height = kept + deleted)"
            >
              {[...rotationHistoryChart].reverse().map((e, i) => {
                const max = Math.max(...rotationHistoryChart.map((x) => x.deleted + x.kept), 1);
                const total = e.deleted + e.kept;
                const h = Math.max(4, Math.round((total / max) * 100));
                return (
                  <div
                    key={`${e.rotatedAt}-${i}`}
                    title={`${e.rotatedAt.slice(0, 10)} · kept ${e.kept} · deleted ${e.deleted} · ${e.trigger}`}
                    style={{
                      width: "14px",
                      height: `${h}%`,
                      background: e.deleted > 0 ? "var(--warn, #c9a227)" : "var(--accent, #4a9)",
                      borderRadius: "2px",
                    }}
                  />
                );
              })}
            </div>
          ) : null}
          <h3 style={{ marginTop: "0.75rem", fontSize: "0.95rem" }}>Run history</h3>
          <ul className="list">
            {templateRunHistory.length === 0 ? <li className="muted">No runs yet</li> : null}
            {templateRunHistory.map((r) => (
              <li key={`${r.templateId}-${r.lastRunAt}`}>
                {r.templateId} · {r.kind} · {r.lastRunAt.slice(0, 19)}
                {r.lastPath ? ` · ${r.lastPath}` : ""}
                {r.lastError ? ` · err ${r.lastError.slice(0, 40)}` : ""}
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2>Projects in `{selectedSlug}`</h2>
          <form className="form" onSubmit={onCreateProject}>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project name"
            />
            <input
              value={projectSlug}
              onChange={(e) => setProjectSlug(e.target.value)}
              placeholder="project-slug"
            />
            <button className="primary" type="submit">
              Add project
            </button>
          </form>
          <ul className="list">
            {projects.length === 0 ? <li className="muted">No projects</li> : null}
            {projects.map((p) => (
              <li key={p.id}>
                {p.slug} — {p.name}
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2>MCP host</h2>
          <form className="form" onSubmit={onRegisterMcp}>
            <input value={mcpName} onChange={(e) => setMcpName(e.target.value)} placeholder="name" />
            <input
              value={mcpCommand}
              onChange={(e) => setMcpCommand(e.target.value)}
              placeholder="command"
            />
            <button className="primary" type="submit">
              Register server
            </button>
          </form>
          <div className="row" style={{ marginTop: "0.5rem" }}>
            <button type="button" onClick={() => void onRegisterEcho()}>
              Register echo MCP
            </button>
            <button type="button" onClick={() => void onRegisterGraphify()}>
              Register Graphify
            </button>
          </div>
          <ul className="list">
            {servers.map((s) => (
              <li key={s.id}>
                <div>
                  {s.enabled ? "on" : "off"} · {s.name} → {s.command}
                </div>
                <div className="row" style={{ marginTop: "0.35rem" }}>
                  <button type="button" onClick={() => void onProbe(s.id)}>
                    Probe
                  </button>
                  <button type="button" onClick={() => void onListTools(s.id)}>
                    List tools
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      void onCallTool(
                        s.id,
                        s.name === "devaios-echo" ? "echo" : "ping",
                        s.name === "devaios-echo" ? { message: "hello from DEVAIOS" } : {},
                      )
                    }
                  >
                    Call tool
                  </button>
                  <button type="button" onClick={() => void onToggleMcp(s.id, !s.enabled)}>
                    {s.enabled ? "Disable" : "Enable"}
                  </button>
                  <button type="button" onClick={() => void onRemoveMcp(s.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {probeOut ? <pre>{probeOut}</pre> : null}
          {toolsOut ? <pre>{toolsOut}</pre> : null}
          {callOut ? <pre>{callOut}</pre> : null}
        </section>

        <section className="panel">
          <h2>Agent chat v0</h2>
          <form className="form" onSubmit={onChat}>
            <input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask about this workspace"
            />
            <label className="muted">
              <input
                type="checkbox"
                checked={useTools}
                onChange={(e) => setUseTools(e.target.checked)}
              />{" "}
              useTools (MCP loop)
            </label>
            <label className="muted">
              <input
                type="checkbox"
                checked={approveDestructive}
                onChange={(e) => setApproveDestructive(e.target.checked)}
              />{" "}
              approve destructive tools
            </label>
            <label className="muted">
              <input
                type="checkbox"
                checked={streamTools}
                onChange={(e) => setStreamTools(e.target.checked)}
              />{" "}
              stream with tool events
            </label>
            <div className="row">
              <button className="primary" type="submit">
                Chat ({selectedSlug})
              </button>
              <button type="button" onClick={() => void onStreamChat()}>
                Stream
              </button>
              <button type="button" onClick={() => void onNewConversation()}>
                New conversation
              </button>
            </div>
          </form>
          {selectedConversationId ? (
            <p className="muted">Resume: {selectedConversationId.slice(0, 8)}…</p>
          ) : (
            <p className="muted">New conversation</p>
          )}
          <input
            value={convSearch}
            onChange={(e) => setConvSearch(e.target.value)}
            placeholder="Search conversations (title + message FTS)"
          />
          <button type="button" onClick={() => void refreshConversations()}>
            Search
          </button>
          {chatOut ? <pre>{chatOut}</pre> : null}
          {streamOut ? <pre>{streamOut}</pre> : null}
          <ul className="list">
            {convList.map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => void onLoadConversation(c.id)}>
                  {selectedConversationId === c.id ? "● " : "○ "}
                  {c.title} · {c.id.slice(0, 8)}
                  {c.matchSource ? ` · ${c.matchSource}` : ""}
                </button>
              </li>
            ))}
          </ul>
          {convMessages.length ? (
            <pre>
              {convMessages
                .map((m) => `[${m.role}] ${m.content.slice(0, 200)}`)
                .join("\n\n")}
            </pre>
          ) : null}
          <button type="button" onClick={() => void onExportConversations()}>
            Export conversations
          </button>
          <button type="button" onClick={() => void onExportArchive()}>
            Export all-workspace archive
          </button>
          <label className="muted">
            <input
              type="checkbox"
              checked={encryptArchive}
              onChange={(e) => setEncryptArchive(e.target.checked)}
            />{" "}
            encrypt archive (AES-256-GCM)
          </label>
          <label className="muted">
            <input
              type="checkbox"
              checked={signArchive}
              onChange={(e) => setSignArchive(e.target.checked)}
            />{" "}
            sign archive (Ed25519)
          </label>
          <input
            value={archivePassphrase}
            onChange={(e) => setArchivePassphrase(e.target.value)}
            placeholder="archive passphrase (optional)"
            type="password"
          />
          <button type="button" onClick={() => void onExportArchiveAsync()}>
            Export archive async (job)
          </button>
          {exportPath ? <p className="muted">{exportPath}</p> : null}
          {archivePath ? <p className="muted">{archivePath}</p> : null}
          <div className="form" style={{ marginTop: "0.75rem" }}>
            <label className="muted">
              <input
                type="checkbox"
                checked={dedupeByTitle}
                onChange={(e) => setDedupeByTitle(e.target.checked)}
              />{" "}
              dedupe by title on import
            </label>
            <input
              value={importPath}
              onChange={(e) => setImportPath(e.target.value)}
              placeholder="path to conversation export JSON"
            />
            <button type="button" onClick={() => void onImportConversations()}>
              Import conversations
            </button>
            <input
              value={archiveImportPath}
              onChange={(e) => setArchiveImportPath(e.target.value)}
              placeholder="path to multi-workspace archive JSON"
            />
            <input
              value={archiveImportSlugs}
              onChange={(e) => setArchiveImportSlugs(e.target.value)}
              placeholder="import only slugs (comma-separated, optional)"
            />
            <input
              value={slugMapJson}
              onChange={(e) => setSlugMapJson(e.target.value)}
              placeholder='slug map JSON e.g. {"old":"demo"}'
            />
            <label className="muted">
              Archive conflict{" "}
              <select
                value={archiveImportConflictPolicy}
                onChange={(e) => setArchiveImportConflictPolicy(e.target.value as "skip" | "replace")}
              >
                <option value="skip">skip existing conversations</option>
                <option value="replace">replace existing conversations</option>
              </select>
            </label>
            <div className="row">
              <button type="button" onClick={() => void onPreviewArchiveImport()}>
                Preview archive import
              </button>
              <button type="button" onClick={() => void onExportArchiveImportDiff()}>
                Export import diff JSON
              </button>
              <button type="button" onClick={() => void onImportArchive()}>
                Import archive
              </button>
              <button type="button" onClick={() => void onMergeDuplicates()}>
                Merge duplicate titles
              </button>
            </div>
          {archiveImportPreview ? <p className="muted">{archiveImportPreview}</p> : null}
          {archiveImportDiffExportPath ? <p className="muted">{archiveImportDiffExportPath}</p> : null}
          <input
            value={archiveImportDiffPath}
            onChange={(e) => setArchiveImportDiffPath(e.target.value)}
            placeholder="path to archive-import-diff JSON"
            style={{ marginTop: "0.35rem" }}
          />
          <input
            value={archiveDiffMergePaths}
            onChange={(e) => setArchiveDiffMergePaths(e.target.value)}
            placeholder="merge diff paths (comma-separated, 2+)"
            style={{ marginTop: "0.25rem" }}
          />
          <div className="row" style={{ marginTop: "0.25rem" }}>
            <button type="button" onClick={() => void onPreviewArchiveDiffMerge()}>
              Preview merge
            </button>
            <label className="muted">
              <input
                type="checkbox"
                checked={archiveMergeActionFilters.includes("insert")}
                onChange={() => toggleArchiveMergeActionFilter("insert")}
              />{" "}
              insert
            </label>
            <label className="muted">
              <input
                type="checkbox"
                checked={archiveMergeActionFilters.includes("skip")}
                onChange={() => toggleArchiveMergeActionFilter("skip")}
              />{" "}
              skip
            </label>
            <label className="muted">
              <input
                type="checkbox"
                checked={archiveMergeActionFilters.includes("replace")}
                onChange={() => toggleArchiveMergeActionFilter("replace")}
              />{" "}
              replace
            </label>
            <button type="button" onClick={() => applyMergeActionPreset("insert+replace")}>
              insert+replace
            </button>
            <button type="button" onClick={() => applyMergeActionPreset("all")}>
              all actions
            </button>
            <button type="button" onClick={() => applyMergeActionPreset("clear")}>
              clear filters
            </button>
            <button type="button" onClick={saveMergeActionPresetToStorage}>
              Save last preset
            </button>
            <button type="button" onClick={loadMergeActionPresetFromStorage}>
              Load last preset
            </button>
            <input
              value={mergePresetProfileName}
              onChange={(e) => setMergePresetProfileName(e.target.value)}
              placeholder="profile name"
            />
            <button type="button" onClick={() => saveMergeActionProfile(mergePresetProfileName)}>
              Save profile
            </button>
            <select
              value={mergePresetProfileName}
              onChange={(e) => {
                setMergePresetProfileName(e.target.value);
                loadMergeActionProfile(e.target.value);
              }}
            >
              <option value="">load profile…</option>
              {mergePresetProfileNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => deleteMergeActionProfile(mergePresetProfileName)}
              disabled={!mergePresetProfileName.trim()}
            >
              Delete profile
            </button>
            <button type="button" onClick={exportMergeActionProfilesJson}>
              Export profiles JSON
            </button>
            <label className="muted">
              <input
                type="checkbox"
                checked={mergeExportSelectedOnly}
                onChange={(e) => setMergeExportSelectedOnly(e.target.checked)}
              />{" "}
              export selected profile only
            </label>
            <label className="muted">
              <input
                type="file"
                accept=".json,application/json"
                onChange={(e) => {
                  void onMergeProfilesFileSelected(e.target.files?.[0] ?? null, false);
                  e.target.value = "";
                }}
              />{" "}
              import profiles file
            </label>
            <label className="muted">
              <input
                type="file"
                accept=".json,application/json"
                onChange={(e) => {
                  void onMergeProfilesFileSelected(e.target.files?.[0] ?? null, true);
                  e.target.value = "";
                }}
              />{" "}
              replace profiles file
            </label>
            <button
              type="button"
              onClick={() => {
                try {
                  previewMergeProfilesImport(mergeProfilesImportText, true);
                } catch (err) {
                  setError(err instanceof Error ? err.message : String(err));
                }
              }}
              disabled={!mergeProfilesImportText.trim()}
            >
              Preview merge import
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  importMergeActionProfilesJson(mergeProfilesImportText, true);
                  setMergeProfilesImportText("");
                } catch (err) {
                  setError(err instanceof Error ? err.message : String(err));
                }
              }}
              disabled={!mergeProfilesImportText.trim() || !mergeProfilesImportPreview}
            >
              Apply merge import
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  previewMergeProfilesImport(mergeProfilesImportText, false);
                } catch (err) {
                  setError(err instanceof Error ? err.message : String(err));
                }
              }}
              disabled={!mergeProfilesImportText.trim()}
            >
              Preview replace import
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  importMergeActionProfilesJson(mergeProfilesImportText, false);
                  setMergeProfilesImportText("");
                } catch (err) {
                  setError(err instanceof Error ? err.message : String(err));
                }
              }}
              disabled={!mergeProfilesImportText.trim() || !mergeProfilesImportPreview}
            >
              Apply replace import
            </button>
            <button type="button" onClick={() => void onMergeArchiveDiffFiles()}>
              Merge diff files
            </button>
            <label className="muted">
              <input
                type="checkbox"
                checked={archiveDiffMergeAllowMixed}
                onChange={(e) => setArchiveDiffMergeAllowMixed(e.target.checked)}
              />{" "}
              allow mixed archive paths
            </label>
          </div>
          <textarea
            value={mergeProfilesImportText}
            onChange={(e) => {
              setMergeProfilesImportText(e.target.value);
              previewMergeProfilesImport(e.target.value, true);
            }}
            placeholder='paste merge profiles JSON e.g. {"profiles":{"default":["insert","replace"]}}'
            rows={2}
            style={{ marginTop: "0.25rem", width: "100%" }}
          />
          {mergeProfilesImportPreview ? <p className="muted">{mergeProfilesImportPreview}</p> : null}
          {mergeProfilesImportPreviewJson ? (
            <>
              <button
                type="button"
                style={{ marginTop: "0.25rem" }}
                onClick={() => persistMergeProfilesPreviewExpanded(!mergeProfilesImportPreviewExpanded)}
              >
                {mergeProfilesImportPreviewExpanded ? "Hide" : "Show"} JSON preview
              </button>
              {mergeProfilesImportPreviewExpanded ? (
                <>
                  <button
                    type="button"
                    style={{ marginTop: "0.25rem", marginLeft: "0.35rem" }}
                    onClick={resetMergeProfilesPreviewScroll}
                  >
                    Reset scroll
                  </button>
                  <span className="muted" style={{ fontSize: "0.8rem", marginLeft: "0.35rem" }}>
                    scroll {mergeProfilesPreviewScrollTop}px / {mergeProfilesPreviewScrollMax}px
                    {mergeProfilesPreviewScrollMax > 0 ?
                      ` · ${mergeProfilesPreviewScrollScrubThrottleLabel}`
                    : ""}
                    {mergeScrollScrubbingActive ||
                    mergeScrollDebouncePulseAtomicRestoreFlash ||
                    mergeScrollDebouncePulseAtomicRestoreFlashRestored ?
                      <span
                        role="status"
                        aria-live={
                          mergeScrollDebouncePulseAtomicRestoreFlashRestored ? "polite"
                          : mergeScrollDebouncePulseAtomicRestoreFlash && !mergeScrollScrubbingActive ?
                            "assertive"
                          : "polite"
                        }
                        aria-atomic={mergeScrollDebouncePulseAtomicRestoreFlashRestored}
                        className="merge-scroll-debounce-pulse"
                        style={
                          mergeScrollScrubbingActive && mergeScrollDebouncePulseDurationSec != null ?
                            { animationDuration: `${mergeScrollDebouncePulseDurationSec}s` }
                          : mergeScrollDebouncePulseAtomicRestoreFlash ||
                              mergeScrollDebouncePulseAtomicRestoreFlashRestored ?
                            { animationDuration: `${MERGE_SCROLL_SCRUB_ATOMIC_RESTORE_DEBOUNCE_MS}ms` }
                          : undefined
                        }
                      >
                        {mergeScrollScrubbingActive ?
                          ` · ${mergeProfilesPreviewScrollAtomicRestoreDebouncePulseLabel}`
                        : mergeScrollDebouncePulseAtomicRestoreFlashRestored ?
                          ` · ${mergeProfilesPreviewScrollAtomicRestoreDebouncePulseFlashRestoredLabel}`
                        : ` · ${mergeProfilesPreviewScrollAtomicRestoreDebouncePulseFlashLabel}`}
                      </span>
                    : null}
                  </span>
                  {mergeProfilesPreviewScrollMax > 0 ? (
                    <>
                      <div
                        role="status"
                        aria-live="polite"
                        aria-atomic={!mergeScrollScrubbingActive}
                        style={{
                          position: "absolute",
                          width: 1,
                          height: 1,
                          padding: 0,
                          margin: -1,
                          overflow: "hidden",
                          clip: "rect(0, 0, 0, 0)",
                          whiteSpace: "nowrap",
                          border: 0,
                        }}
                      >
                        {mergeProfilesPreviewScrollLiveAnnouncement}
                      </div>
                      <div
                        ref={mergeProfilesPreviewScrollBarRef}
                        role="progressbar"
                      tabIndex={0}
                      aria-valuenow={mergeProfilesPreviewScrollBarAriaValueNow}
                      aria-valuemin={mergeProfilesPreviewScrollBarAriaValueMin}
                      aria-valuemax={mergeProfilesPreviewScrollBarAriaValueMax}
                      aria-valuetext={mergeProfilesPreviewScrollBarAriaValueText}
                      aria-label="Merge JSON preview scroll. Home jumps to top, End jumps to bottom."
                      aria-keyshortcuts="ArrowUp ArrowDown PageUp PageDown Home End"
                      title="Click, drag, touch, or arrow keys to scrub scroll position"
                      onKeyDown={onMergeProfilesPreviewScrollBarKeyDown}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        startMergeProfilesPreviewScrollScrub(event.clientX, event.currentTarget);
                      }}
                      onTouchStart={(event) => {
                        const touch = event.touches[0];
                        if (!touch) return;
                        event.preventDefault();
                        startMergeProfilesPreviewScrollScrub(touch.clientX, event.currentTarget);
                      }}
                      style={{
                        marginTop: "0.25rem",
                        height: "4px",
                        width: "100%",
                        maxWidth: "240px",
                        background: "var(--line, #444)",
                        borderRadius: "2px",
                        cursor: "pointer",
                        touchAction: "none",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${mergeProfilesPreviewScrollProgress}%`,
                          background: "var(--accent, #4a9)",
                          borderRadius: "2px",
                          transition: "width 0.1s linear",
                        }}
                      />
                    </div>
                    </>
                  ) : null}
                </>
              ) : null}
              {mergeProfilesImportPreviewExpanded ? (
                <pre
                  ref={(element) => {
                    mergeProfilesPreviewScrollRef.current = element;
                    if (element) restoreMergeProfilesPreviewScroll(element);
                  }}
                  onScroll={(event) =>
                    persistMergeProfilesPreviewScroll(event.currentTarget.scrollTop, event.currentTarget)
                  }
                  style={{
                    marginTop: "0.25rem",
                    fontSize: "0.75rem",
                    maxHeight: "140px",
                    overflow: "auto",
                    padding: "0.35rem",
                    border: "1px solid var(--line, #444)",
                    borderRadius: "4px",
                  }}
                >
                  {mergeProfilesImportPreviewJson}
                </pre>
              ) : null}
            </>
          ) : null}
          {mergeProfilesOut ? <p className="muted">{mergeProfilesOut}</p> : null}
          {archiveDiffMergePreviewOut ? <p className="muted">{archiveDiffMergePreviewOut}</p> : null}
          {archiveMergePreviewRows.length ? (
            <>
              <div className="row" style={{ marginTop: "0.25rem" }}>
                <button type="button" onClick={selectAllArchiveMergeDiffIds}>
                  Select all merge rows
                </button>
                <button type="button" onClick={clearArchiveMergeDiffIds}>
                  Clear merge selection
                </button>
                <button type="button" onClick={invertArchiveMergeDiffIds}>
                  Invert merge selection
                </button>
              </div>
              <ul className="list">
                {archiveMergePreviewRows.map((r) => (
                  <li key={r.id}>
                    <label className="muted">
                      <input
                        type="checkbox"
                        checked={selectedArchiveMergeDiffIds.includes(r.id)}
                        onChange={() => toggleArchiveMergeDiffId(r.id)}
                      />{" "}
                      {r.action} · {r.workspaceSlug} · {r.title}
                    </label>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {archiveDiffMergeOut ? <p className="muted">{archiveDiffMergeOut}</p> : null}
          <div className="row" style={{ marginTop: "0.25rem" }}>
            <button type="button" onClick={() => void onPreviewArchiveFromDiff()}>
              Preview from diff
            </button>
            <button type="button" onClick={() => void onImportArchiveFromDiff()}>
              Import from diff JSON
            </button>
          </div>
          {archiveFromDiffPreviewOut ? <p className="muted">{archiveFromDiffPreviewOut}</p> : null}
          {archiveDiffRows.length ? (
            <>
              <div className="row" style={{ marginTop: "0.25rem" }}>
                <button type="button" onClick={() => selectArchiveDiffIds("all")}>
                  Select all diff rows
                </button>
                <button type="button" onClick={() => selectArchiveDiffIds("insert")}>
                  Select inserts
                </button>
                <button type="button" onClick={() => selectArchiveDiffIds("replace")}>
                  Select replaces
                </button>
                <button type="button" onClick={() => selectArchiveDiffIds("none")}>
                  Clear
                </button>
                <button type="button" onClick={() => void onSaveArchiveDiffSelection()}>
                  Save selection to diff file
                </button>
              </div>
              <ul className="list">
                {archiveDiffRows.map((r) => (
                  <li key={r.id}>
                    <label className="muted">
                      <input
                        type="checkbox"
                        checked={selectedArchiveDiffIds.includes(r.id)}
                        onChange={() => toggleArchiveDiffId(r.id)}
                      />{" "}
                      {r.action} · {r.workspaceSlug} · {r.title}
                    </label>
                  </li>
                ))}
              </ul>
              <p className="muted">{selectedArchiveDiffIds.length} diff row(s) selected for import</p>
            </>
          ) : null}
          {archiveDiffSelectionOut ? <p className="muted">{archiveDiffSelectionOut}</p> : null}
          {archiveFromDiffOut ? <p className="muted">{archiveFromDiffOut}</p> : null}
          {archiveConversationPicks.length ? (
            <>
              <div className="row" style={{ marginTop: "0.35rem" }}>
                <button type="button" onClick={() => selectArchiveConversations("inserts")}>
                  Select inserts
                </button>
                <button type="button" onClick={() => selectArchiveConversations("replaces")}>
                  Select replaces
                </button>
                <button type="button" onClick={() => selectArchiveConversations("all")}>
                  Select all
                </button>
                <button type="button" onClick={() => selectArchiveConversations("none")}>
                  Clear
                </button>
              </div>
              <ul className="list">
                {archiveConversationPicks.map((c) => (
                  <li key={c.id}>
                    <label className="muted">
                      <input
                        type="checkbox"
                        checked={c.selected}
                        onChange={() => toggleArchiveConversation(c.id)}
                      />{" "}
                      [{c.workspaceSlug}/{c.conflict}] {c.title} ({c.messageCount} msgs)
                    </label>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          </div>
          {importResult ? <p className="muted">{importResult}</p> : null}
          {mergeResult ? <p className="muted">{mergeResult}</p> : null}
          <div className="form" style={{ marginTop: "0.75rem" }}>
            <label className="muted">
              <input
                type="checkbox"
                checked={archiveScheduleEnabled}
                onChange={(e) => setArchiveScheduleEnabled(e.target.checked)}
              />{" "}
              scheduled archive export
            </label>
            <input
              value={archiveScheduleInterval}
              onChange={(e) => setArchiveScheduleInterval(e.target.value)}
              placeholder="interval minutes (default 10080 = 7d)"
            />
            <button type="button" onClick={() => void onSaveArchiveSchedule()}>
              Save archive schedule
            </button>
          </div>
          {archiveScheduleOut ? <p className="muted">{archiveScheduleOut}</p> : null}
          <div className="form" style={{ marginTop: "0.75rem" }}>
            <input
              value={archiveRetentionMaxCount}
              onChange={(e) => setArchiveRetentionMaxCount(e.target.value)}
              placeholder="archive retention max count"
            />
            <input
              value={archiveRetentionMaxAge}
              onChange={(e) => setArchiveRetentionMaxAge(e.target.value)}
              placeholder="archive max age days"
            />
            <div className="row">
              <button type="button" onClick={() => void onSaveArchiveRetention()}>
                Save archive retention
              </button>
              <button type="button" onClick={() => void onRotateArchives()}>
                Rotate archives
              </button>
            </div>
          </div>
          {archiveRetentionOut ? <p className="muted">{archiveRetentionOut}</p> : null}
        </section>

        <section className="panel">
          <h2>HITL approvals ({selectedSlug})</h2>
          <button type="button" onClick={() => void refreshApprovals()}>
            Refresh inbox
          </button>
          <ul className="list">
            {approvalList.length === 0 ? <li className="muted">No pending approvals</li> : null}
            {approvalList.map((a) => (
              <li key={a.id}>
                {a.server}/{a.tool} — {a.reason ?? "destructive tool"}
                <div className="row" style={{ marginTop: "0.35rem" }}>
                  <button type="button" onClick={() => void onApprove(a.id)}>
                    Approve
                  </button>
                  <button type="button" onClick={() => void onReject(a.id)}>
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2>Graphify query</h2>
          <form className="form" onSubmit={onGraphifyQuery}>
            <input
              value={graphQuery}
              onChange={(e) => setGraphQuery(e.target.value)}
              placeholder="query"
            />
            <div className="row">
              <button className="primary" type="submit">
                Run query
              </button>
              <button type="button" onClick={() => void onGraphifyBuild()}>
                Build/update graph
              </button>
              <button type="button" onClick={() => void onGraphifyBuildAsync()}>
                Build async (SSE stream)
              </button>
            </div>
          </form>
          {graphOut ? <pre>{graphOut}</pre> : null}
          {jobOut ? <pre>{jobOut}</pre> : null}
        </section>

        <section className="panel">
          <h2>Secrets</h2>
          <p className="muted">
            Backend: {secretsBackend}
            {keychainAvailable ? " · Keychain available (set DEVAIO_SECRETS_BACKEND=keychain)" : ""}
          </p>
          <form className="form" onSubmit={onSetSecret}>
            <input value={secretName} onChange={(e) => setSecretName(e.target.value)} placeholder="name" />
            <input
              value={secretValue}
              onChange={(e) => setSecretValue(e.target.value)}
              placeholder="value"
              type="password"
            />
            <button className="primary" type="submit">
              Store secret
            </button>
          </form>
          <ul className="list">
            {secretNames.length === 0 ? <li className="muted">No secrets</li> : null}
            {secretNames.map((s) => (
              <li key={s.name}>
                {s.name} · {s.updatedAt}
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2>Brain memories (`{selectedSlug}`)</h2>
          <form className="form" onSubmit={onAddMemory}>
            <input
              value={memoryTitle}
              onChange={(e) => setMemoryTitle(e.target.value)}
              placeholder="title"
            />
            <input
              value={memoryContent}
              onChange={(e) => setMemoryContent(e.target.value)}
              placeholder="content"
            />
            <button className="primary" type="submit">
              Add memory
            </button>
          </form>
          <ul className="list">
            {memoryList.length === 0 ? <li className="muted">No memories</li> : null}
            {memoryList.map((m) => (
              <li key={m.id}>
                [{m.kind}] {m.title}
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2>Provider health</h2>
          <button type="button" onClick={() => void onRefreshProviderHealth()}>
            Refresh health
          </button>
          {providerHealth ? (
            <>
              <p className="muted">
                {providerHealth.summary.healthy}/{providerHealth.summary.enabled} healthy ·{" "}
                {providerHealth.summary.total} registered
              </p>
              <ul className="health-grid">
                {providerHealth.probes.map((p) => (
                  <li key={p.kind} className={`health-card${p.ok ? " ok" : " fail"}`}>
                    <strong>{p.kind}</strong>
                    <span>{p.ok ? "ok" : p.error ?? "fail"}</span>
                    {p.latencyMs ? <span className="muted">{p.latencyMs}ms</span> : null}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="muted">Load health to see provider status</p>
          )}
        </section>

        <section className="panel">
          <h2>Providers</h2>
          <p className="muted">Drag to reorder failover chain</p>
          <ul
            className="failover-list"
            onDragOver={(e) => e.preventDefault()}
          >
            {failoverOrder.map((kind, idx) => (
              <li
                key={kind}
                className={`failover-chip${failoverDragIdx === idx ? " dragging" : ""}`}
                draggable
                onDragStart={() => setFailoverDragIdx(idx)}
                onDragEnd={() => setFailoverDragIdx(null)}
                onDrop={() => onFailoverDrop(idx)}
                onDragOver={(e) => e.preventDefault()}
              >
                {idx + 1}. {kind}
              </li>
            ))}
          </ul>
          <div className="row" style={{ marginTop: "0.35rem" }}>
            <button type="button" onClick={() => void onSaveFailover()}>
              Save failover order
            </button>
            <button type="button" onClick={() => void onProbeFailover()}>
              Probe failover chain
            </button>
          </div>
          <label className="muted">
            <input
              type="checkbox"
              checked={autoDisableProviders}
              onChange={(e) => setAutoDisableProviders(e.target.checked)}
            />{" "}
            auto-disable providers that fail probe
          </label>
          {failoverProbeOut ? <p className="muted">{failoverProbeOut}</p> : null}
          {providerCooldownOut ? <p className="muted">{providerCooldownOut}</p> : null}
          <div className="form" style={{ marginTop: "0.75rem" }}>
            <input
              value={cooldownMinutes}
              onChange={(e) => setCooldownMinutes(e.target.value)}
              placeholder="cooldown minutes (default 15)"
            />
            <button type="button" onClick={() => void onSaveCooldownMinutes()}>
              Save cooldown minutes
            </button>
          </div>
          <ul className="list">
            {providerList.map((p) => (
              <li key={p.id}>
                {p.name} ({p.kind}) {p.enabled ? "· on" : "· off"}
                <div className="row" style={{ marginTop: "0.35rem" }}>
                  <button type="button" onClick={() => void onToggleProvider(p.id, !p.enabled)}>
                    {p.enabled ? "Disable" : "Enable"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2>Context compression</h2>
          <button className="primary" type="button" onClick={() => void onPack()}>
            Pack context
          </button>
          {bundle ? (
            <pre>
              {JSON.stringify(
                {
                  usedTokens: bundle.usedTokens,
                  budgetTokens: bundle.budgetTokens,
                  chunks: bundle.chunks.map((c) => ({
                    source: c.source,
                    strategy: c.strategy,
                    packedTokens: c.packedTokens,
                    dropped: c.dropped ?? false,
                  })),
                  dropList: bundle.dropList,
                },
                null,
                2,
              )}
            </pre>
          ) : null}
        </section>

        <section className="panel">
          <h2>Backup</h2>
          <label className="muted">
            <input
              type="checkbox"
              checked={encryptBackup}
              onChange={(e) => setEncryptBackup(e.target.checked)}
            />{" "}
            encrypt backup (AES-256-GCM)
          </label>
          <label className="muted">
            <input
              type="checkbox"
              checked={signBackup}
              onChange={(e) => setSignBackup(e.target.checked)}
            />{" "}
            sign backup (Ed25519)
          </label>
          <input
            value={backupPassphrase}
            onChange={(e) => setBackupPassphrase(e.target.value)}
            placeholder="backup passphrase (optional)"
            type="password"
          />
          <input
            value={restoreWorkspaceSlugs}
            onChange={(e) => setRestoreWorkspaceSlugs(e.target.value)}
            placeholder="selective restore slugs (comma-separated, optional)"
          />
          <label className="muted">
            Conflict policy{" "}
            <select
              value={restoreConflictPolicy}
              onChange={(e) => setRestoreConflictPolicy(e.target.value as "skip" | "replace")}
            >
              <option value="skip">skip existing</option>
              <option value="replace">replace existing</option>
            </select>
          </label>
          <label className="muted">
            <input
              type="checkbox"
              checked={restoreAutoDetectScoped}
              onChange={(e) => setRestoreAutoDetectScoped(e.target.checked)}
            />{" "}
            auto-detect scoped restore from backup filename
          </label>
          <label className="muted">
            <input
              type="checkbox"
              checked={restoreScopedOnly}
              onChange={(e) => setRestoreScopedOnly(e.target.checked)}
            />{" "}
            scoped workspace backup only (template exports)
          </label>
          <div className="row">
            <button className="primary" type="button" onClick={() => void onBackup()}>
              Export backup
            </button>
            <button type="button" onClick={() => void onBackupAsync()}>
              Export async (job)
            </button>
            <button type="button" disabled={!backupPath} onClick={() => void onRestorePreview()}>
              Preview restore
            </button>
            <button type="button" disabled={!backupPath} onClick={() => void onRestore()}>
              Restore last export
            </button>
            <button type="button" onClick={() => void onPreviewBatchRestoreLatest()}>
              Preview batch restore (dry-run)
            </button>
            <button type="button" onClick={() => void onBatchRestoreLatest()}>
              Batch restore latest scoped
            </button>
          </div>
          {batchRestorePreviewOut ? <p className="muted">{batchRestorePreviewOut}</p> : null}
          {batchRestoreOut ? <p className="muted">{batchRestoreOut}</p> : null}
          {restorePreviewOut ? <p className="muted">{restorePreviewOut}</p> : null}
          {restoreDiffExportPath ? <p className="muted">{restoreDiffExportPath}</p> : null}
          {restorePreviewDiff?.length ? (
            <>
              <div className="row" style={{ marginTop: "0.35rem" }}>
                <button type="button" onClick={() => selectDiffByAction("insert")}>
                  Select inserts
                </button>
                <button type="button" onClick={() => selectDiffByAction("replace")}>
                  Select replaces
                </button>
                <button type="button" onClick={() => selectDiffByAction("all")}>
                  Select all
                </button>
                <button type="button" onClick={() => selectDiffByAction("none")}>
                  Clear
                </button>
                <button type="button" disabled={!backupPath} onClick={() => void onExportRestoreDiff()}>
                  Export diff JSON
                </button>
              </div>
              <ul className="list">
              {restorePreviewDiff.map((row) => (
                <li key={row.id}>
                  <label className="muted">
                    <input
                      type="checkbox"
                      checked={selectedDiffIds.includes(row.id)}
                      onChange={() => toggleDiffId(row.id)}
                    />{" "}
                    [{row.section}/{row.action}] {row.label}
                  </label>
                </li>
              ))}
              </ul>
            </>
          ) : null}
          <div className="form" style={{ marginTop: "0.75rem" }}>
            <label className="muted">
              <input
                type="checkbox"
                checked={scheduleEnabled}
                onChange={(e) => setScheduleEnabled(e.target.checked)}
              />{" "}
              scheduled backup
            </label>
            <input
              value={scheduleInterval}
              onChange={(e) => setScheduleInterval(e.target.value)}
              placeholder="interval minutes (default 1440)"
            />
            <button type="button" onClick={() => void onSaveSchedule()}>
              Save schedule
            </button>
          </div>
          {backupPath ? <p className="muted">{backupPath}</p> : null}
          {backupJobOut ? <p className="muted">{backupJobOut}</p> : null}
          <div className="form" style={{ marginTop: "0.75rem" }}>
            <input
              value={retentionMaxCount}
              onChange={(e) => setRetentionMaxCount(e.target.value)}
              placeholder="retention max count"
            />
            <input
              value={retentionMaxAge}
              onChange={(e) => setRetentionMaxAge(e.target.value)}
              placeholder="retention max age days"
            />
            <div className="row">
              <button type="button" onClick={() => void onSaveRetention()}>
                Save retention
              </button>
              <button type="button" onClick={() => void onRotateBackups()}>
                Rotate now
              </button>
            </div>
          </div>
          {retentionOut ? <p className="muted">{retentionOut}</p> : null}
        </section>
      </div>
    </div>
  );
}
