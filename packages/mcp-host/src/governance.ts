export type ToolRisk = "safe" | "destructive";

export type GovernanceAssessment = {
  risk: ToolRisk;
  requiresApproval: boolean;
  reason?: string;
};

const DESTRUCTIVE_PATTERN =
  /\b(delete|remove|drop|destroy|wipe|truncate|purge|erase|unlink|rm|kill|shutdown|format|reset|clear-all|clear_all)\b/i;

/**
 * Heuristic risk gate for MCP tools (Milestone 06).
 * Destructive tools require explicit approval before execution.
 */
export function assessToolRisk(toolName: string, description?: string): GovernanceAssessment {
  const normalized = `${toolName} ${description ?? ""}`.replace(/[_-]/g, " ");
  if (DESTRUCTIVE_PATTERN.test(normalized)) {
    return {
      risk: "destructive",
      requiresApproval: true,
      reason: `Tool "${toolName}" matches destructive pattern`,
    };
  }
  return { risk: "safe", requiresApproval: false };
}
