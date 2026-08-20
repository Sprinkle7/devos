// M153: Embodied Cognition and Sensorimotor Integration System Types

export interface SensorimotorSchema {
  schema_id: string;
  action_type: string; // 'reaching', 'grasping', 'locomotion', 'manipulation'
  sensory_prediction: number; // 0-1.0
  motor_execution: number; // 0-1.0
  feedback_integration: number; // 0-1.0
  learning_efficiency: number; // 0-1.0
}

export interface ProprioceptiveAwareness {
  awareness_id: string;
  body_part: string;
  position_accuracy: number; // 0-1.0
  movement_monitoring: number; // 0-1.0
  kinesthetic_vividness: number; // 0-1.0
  postural_coherence: number; // 0-1.0
}

export interface MotorPlanning {
  plan_id: string;
  action_goal: string;
  trajectory_precision: number; // 0-1.0
  movement_smoothness: number; // 0-1.0
  motor_efficiency: number; // 0-1.0
  adaptation_capacity: number; // 0-1.0
}

export interface SomaticAwareness {
  somatic_id: string;
  body_sensation: string;
  sensation_clarity: number; // 0-1.0
  embodied_understanding: number; // 0-1.0
  visceral_awareness: number; // 0-1.0
  integrated_body_sense: number; // 0-1.0
}

export interface EmbodiedState {
  total_sensorimotor_interactions: number;
  average_motor_execution_quality: number; // 0-1.0
  average_feedback_integration: number; // 0-1.0
  proprioceptive_accuracy_level: number; // 0-1.0
  motor_planning_efficiency: number; // 0-1.0
  embodied_cognition_integration: number; // 0-1.0
  somatic_awareness_depth: number; // 0-1.0
  timestamp_ms: number;
}

export interface EmbodiedMetrics {
  sensorimotor_learning_rate: number; // 0-1.0
  motor_control_precision: number; // 0-1.0
  proprioceptive_calibration_quality: number; // 0-1.0
  embodied_understanding_depth: number; // 0-1.0
  action_perception_coupling_strength: number; // 0-1.0
  adaptive_motor_capability: number; // 0-1.0
  somatic_integration_coherence: number; // 0-1.0
}
