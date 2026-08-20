// M149: Attention Regulation System Types

export interface AttentionalControl {
  control_id: string;
  target_stimulus: string;
  inhibition_strength: number; // 0-1.0
  goal_alignment: number; // 0-1.0
  response_inhibition: number; // 0-1.0
  control_effectiveness: number; // 0-1.0
}

export interface ConflictMonitoring {
  conflict_id: string;
  conflict_type: string; // 'Stroop', 'Simon', 'flanker', 'response-based'
  conflict_level: number; // 0-1.0
  error_likelihood: number; // 0-1.0
  adaptation_strength: number; // 0-1.0
}

export interface FocusMaintenanceRegulation {
  maintenance_id: string;
  task_type: string;
  sustained_focus_duration: number; // milliseconds
  focus_stability: number; // 0-1.0
  distraction_resistance: number; // 0-1.0
  effort_investment: number; // 0-1.0
}

export interface AlertnessModulation {
  alertness_id: string;
  baseline_alertness: number; // 0-1.0
  task_demand_responsiveness: number; // 0-1.0
  fatigue_resistance: number; // 0-1.0
  arousal_optimization: number; // 0-1.0
}

export interface AttentionRegulationState {
  average_control_effectiveness: number; // 0-1.0
  conflict_detection_rate: number;
  average_focus_stability: number; // 0-1.0
  average_distraction_resistance: number; // 0-1.0
  alertness_level: number; // 0-1.0
  regulatory_capacity: number; // 0-1.0
  cognitive_control_investment: number; // 0-1.0
  timestamp_ms: number;
}

export interface AttentionRegulationMetrics {
  attention_regulation_efficiency: number; // 0-1.0
  conflict_resolution_capability: number; // 0-1.0
  sustained_attention_quality: number; // 0-1.0
  interference_suppression_strength: number; // 0-1.0
  adaptive_regulation_rate: number; // 0-1.0
  fatigue_management_effectiveness: number; // 0-1.0
  goal_directed_attention_rate: number; // 0-1.0
}
