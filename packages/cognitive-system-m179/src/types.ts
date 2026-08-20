// M179: Interoception System Types
export interface CardiacInteroception {
  cardiacinteroception_id: string;
  cardiac_signal: number; // 0-1.0
  heart_rate_awareness: number; // 0-1.0
  rhythm_perception: number; // 0-1.0
  cardiac_variability_sensing: number; // 0-1.0
  physiological_accuracy: number; // 0-1.0
}
export interface RespiratoryInteroception {
  respiratoryinteroception_id: string;
  respiratory_signal: number; // 0-1.0
  breathing_awareness: number; // 0-1.0
  respiratory_rhythm_perception: number; // 0-1.0
  oxygen_level_sensing: number; // 0-1.0
  respiration_quality: number; // 0-1.0
}
export interface VisceralInteroception {
  visceralinteroception_id: string;
  visceral_signal: number; // 0-1.0
  digestive_awareness: number; // 0-1.0
  gut_feeling_accuracy: number; // 0-1.0
  organ_status_sensing: number; // 0-1.0
  visceral_sensitivity: number; // 0-1.0
}
export interface BodyStateIntegration {
  bodystateintegration_id: string;
  integration_type: string;
  systemic_awareness: number; // 0-1.0
  homeostatic_monitoring: number; // 0-1.0
  body_state_accuracy: number; // 0-1.0
  interoceptive_prediction: number; // 0-1.0
}
export interface InteroceptionSystemState {
  state_metric_1: number; // 0-1.0
  state_metric_2: number; // 0-1.0
  state_metric_3: number; // 0-1.0
  state_metric_4: number; // 0-1.0
  integration_quality: number; // 0-1.0
  stability: number; // 0-1.0
  cognition_integration: number; // 0-1.0
  timestamp_ms: number;
}
export interface InteroceptionSystemMetrics {
  metric_1: number; // 0-1.0
  metric_2: number; // 0-1.0
  metric_3: number; // 0-1.0
  metric_4: number; // 0-1.0
  metric_5: number; // 0-1.0
  metric_6: number; // 0-1.0
  overall_strength: number; // 0-1.0
}
