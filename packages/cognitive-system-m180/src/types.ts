// M180: Body Schema System Types
export interface SomatosensoryRepresentation {
  somatosensoryrepresentation_id: string;
  body_part: number; // 0-1.0
  limb_position_accuracy: number; // 0-1.0
  sensory_mapping: number; // 0-1.0
  proprioceptive_precision: number; // 0-1.0
  body_boundary_definition: number; // 0-1.0
}
export interface PosturalRepresentation {
  posturalrepresentation_id: string;
  posture_type: string;
  postural_stability: number; // 0-1.0
  balance_maintenance: number; // 0-1.0
  gravitational_resistance: number; // 0-1.0
  postural_control: number; // 0-1.0
}
export interface MotorExecution {
  motorexecution_id: string;
  motor_type: string;
  movement_planning_quality: number; // 0-1.0
  motor_coordination: number; // 0-1.0
  movement_accuracy: number; // 0-1.0
  motor_smoothness: number; // 0-1.0
}
export interface BodyEnvironmentInteraction {
  bodyenvironmentinteraction_id: string;
  interaction_type: string;
  peripersonal_space_awareness: number; // 0-1.0
  tool_body_integration: number; // 0-1.0
  spatial_coordination: number; // 0-1.0
  embodied_action_quality: number; // 0-1.0
}
export interface BodySchemaSystemState {
  state_metric_1: number; // 0-1.0
  state_metric_2: number; // 0-1.0
  state_metric_3: number; // 0-1.0
  state_metric_4: number; // 0-1.0
  integration_quality: number; // 0-1.0
  stability: number; // 0-1.0
  cognition_integration: number; // 0-1.0
  timestamp_ms: number;
}
export interface BodySchemaSystemMetrics {
  metric_1: number; // 0-1.0
  metric_2: number; // 0-1.0
  metric_3: number; // 0-1.0
  metric_4: number; // 0-1.0
  metric_5: number; // 0-1.0
  metric_6: number; // 0-1.0
  overall_strength: number; // 0-1.0
}
