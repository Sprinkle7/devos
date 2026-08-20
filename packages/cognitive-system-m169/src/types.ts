// M169: Attention and Focus System Types
export interface SelectiveAttention {
  attention_id: string;
  target_stimulus: string;
  salience_filtering: number; // 0-1.0
  distraction_suppression: number; // 0-1.0
  attention_selectivity: number; // 0-1.0
  feature_binding: number; // 0-1.0
}
export interface SustainedFocus {
  focus_id: string;
  focus_domain: string;
  focus_duration: number; // 0-1.0
  engagement_level: number; // 0-1.0
  vigilance_maintenance: number; // 0-1.0
  fatigue_resistance: number; // 0-1.0
}
export interface AttentionalShifting {
  shift_id: string;
  shift_type: string;
  switching_speed: number; // 0-1.0
  task_switching_efficiency: number; // 0-1.0
  cognitive_flexibility: number; // 0-1.0
  reorienting_capacity: number; // 0-1.0
}
export interface AttentionalCapacity {
  capacity_id: string;
  capacity_domain: string;
  resource_availability: number; // 0-1.0
  parallel_processing_strength: number; // 0-1.0
  load_tolerance: number; // 0-1.0
  bottleneck_mitigation: number; // 0-1.0
}
export interface AttentionFocusState {
  selective_attention_quality: number; // 0-1.0
  sustained_focus_strength: number; // 0-1.0
  attentional_shifting_efficiency: number; // 0-1.0
  attentional_capacity_level: number; // 0-1.0
  attention_control_effectiveness: number; // 0-1.0
  focus_stability: number; // 0-1.0
  attentional_cognition_integration: number; // 0-1.0
  timestamp_ms: number;
}
export interface AttentionFocusMetrics {
  selective_attention_accuracy: number; // 0-1.0
  sustained_focus_capacity: number; // 0-1.0
  attentional_shifting_speed: number; // 0-1.0
  attentional_resource_efficiency: number; // 0-1.0
  task_focus_quality: number; // 0-1.0
  attention_persistence_strength: number; // 0-1.0
  overall_attention_strength: number; // 0-1.0
}
