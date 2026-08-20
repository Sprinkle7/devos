// M349: Outcome Evaluation System Types
export interface OutcomeEvaluationCore {
  id: string;
  core_metric: number; // 0-1.0
}
export interface OutcomeEvaluationState {
  metric_1: number; // 0-1.0
  metric_2: number; // 0-1.0
  metric_3: number; // 0-1.0
  metric_4: number; // 0-1.0
  integration: number; // 0-1.0
  timestamp_ms: number;
}
export interface OutcomeEvaluationMetrics {
  strength: number; // 0-1.0
  efficiency: number; // 0-1.0
  quality: number; // 0-1.0
  overall: number; // 0-1.0
}
