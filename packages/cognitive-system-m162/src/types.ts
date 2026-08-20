// M162: Flow State and Engagement System Types
export interface FlowState {
  state_id: string;
  activity_type: string;
  challenge_skill_balance: number; // 0-1.0
  goal_clarity: number; // 0-1.0
  feedback_immediacy: number; // 0-1.0
  flow_intensity: number; // 0-1.0
}
export interface EngagementLevel {
  engagement_id: string;
  engagement_type: string;
  attention_absorption: number; // 0-1.0
  motivation_level: number; // 0-1.0
  enjoyment_quality: number; // 0-1.0
  persistence_strength: number; // 0-1.0
}
export interface OptimalExperience {
  experience_id: string;
  experience_domain: string;
  loss_of_self_consciousness: number; // 0-1.0
  sense_of_control: number; // 0-1.0
  time_distortion: number; // 0-1.0
  autotelic_quality: number; // 0-1.0
}
export interface PerformanceOptimization {
  optimization_id: string;
  performance_domain: string;
  peak_performance_level: number; // 0-1.0
  skill_expression_quality: number; // 0-1.0
  efficiency_level: number; // 0-1.0
  achievement_satisfaction: number; // 0-1.0
}
export interface FlowEngagementState {
  overall_flow_quality: number; // 0-1.0
  engagement_depth: number; // 0-1.0
  challenge_balance_level: number; // 0-1.0
  optimal_experience_frequency: number; // 0-1.0
  performance_peak_strength: number; // 0-1.0
  flow_state_accessibility: number; // 0-1.0
  engagement_sustainability: number; // 0-1.0
  timestamp_ms: number;
}
export interface FlowEngagementMetrics {
  flow_frequency_rate: number; // 0-1.0
  flow_duration_quality: number; // 0-1.0
  engagement_consistency: number; // 0-1.0
  challenge_skill_calibration: number; // 0-1.0
  peak_performance_capability: number; // 0-1.0
  optimal_experience_richness: number; // 0-1.0
  overall_flow_strength: number; // 0-1.0
}
