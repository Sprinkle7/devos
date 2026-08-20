// M190: RiskTolerance System Types
export interface RiskToleranceSubsystem1 {
  id: string;
  metric_value: number; // 0-1.0
}
export interface RiskToleranceState {
  metric_1: number; // 0-1.0
  metric_2: number; // 0-1.0
  metric_3: number; // 0-1.0
  integration: number; // 0-1.0
  timestamp_ms: number;
}
export interface RiskToleranceMetrics {
  strength: number; // 0-1.0
  efficiency: number; // 0-1.0
  quality: number; // 0-1.0
  overall: number; // 0-1.0
}
