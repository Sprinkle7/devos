// M168: Social Cognition and Theory of Mind System Types
export interface MentalStateReading {
  reading_id: string;
  target_agent: string;
  belief_attribution: number; // 0-1.0
  desire_inference: number; // 0-1.0
  intention_recognition: number; // 0-1.0
  emotional_understanding: number; // 0-1.0
}
export interface PerspectiveTaking {
  perspective_id: string;
  perspective_type: string;
  viewpoint_adoption: number; // 0-1.0
  cognitive_distance_bridging: number; // 0-1.0
  empathetic_accuracy: number; // 0-1.0
  perspective_integration: number; // 0-1.0
}
export interface SocialInference {
  inference_id: string;
  inference_type: string;
  social_prediction_accuracy: number; // 0-1.0
  behavioral_attribution: number; // 0-1.0
  social_reasoning_quality: number; // 0-1.0
  interaction_understanding: number; // 0-1.0
}
export interface SocialCoordination {
  coordination_id: string;
  coordination_domain: string;
  intentional_alignment: number; // 0-1.0
  mutual_understanding: number; // 0-1.0
  cooperative_efficiency: number; // 0-1.0
  coordination_smoothness: number; // 0-1.0
}
export interface SocialCognitionState {
  mental_state_reading_accuracy: number; // 0-1.0
  perspective_taking_capacity: number; // 0-1.0
  social_inference_quality: number; // 0-1.0
  social_coordination_effectiveness: number; // 0-1.0
  theory_of_mind_sophistication: number; // 0-1.0
  social_understanding_depth: number; // 0-1.0
  social_cognition_integration: number; // 0-1.0
  timestamp_ms: number;
}
export interface SocialCognitionMetrics {
  mental_state_attribution_accuracy: number; // 0-1.0
  perspective_taking_flexibility: number; // 0-1.0
  social_prediction_accuracy: number; // 0-1.0
  behavioral_understanding_quality: number; // 0-1.0
  empathetic_accuracy_rate: number; // 0-1.0
  social_coordination_efficiency: number; // 0-1.0
  overall_theory_of_mind_strength: number; // 0-1.0
}
