// M296: List Management System Types
export interface ListManagementCore {
  id: string;
  core_metric: number; // 0-1.0
}
export interface ListManagementState {
  metric_1: number; // 0-1.0
  metric_2: number; // 0-1.0
  metric_3: number; // 0-1.0
  metric_4: number; // 0-1.0
  integration: number; // 0-1.0
  timestamp_ms: number;
}
export interface ListManagementMetrics {
  strength: number; // 0-1.0
  efficiency: number; // 0-1.0
  quality: number; // 0-1.0
  overall: number; // 0-1.0
}
