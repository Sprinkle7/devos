// M165: Prediction and Anticipation System Types
export interface PredictionModel {
  model_id: string;
  prediction_domain: string;
  pattern_recognition: number; // 0-1.0
  predictive_accuracy: number; // 0-1.0
  temporal_extrapolation: number; // 0-1.0
  uncertainty_estimation: number; // 0-1.0
}
export interface AnticipatoryCoding {
  coding_id: string;
  anticipation_type: string;
  forward_modeling: number; // 0-1.0
  expectation_generation: number; // 0-1.0
  surprise_sensitivity: number; // 0-1.0
  prediction_error_processing: number; // 0-1.0
}
export interface FutureSimulation {
  simulation_id: string;
  simulation_domain: string;
  scenario_generation: number; // 0-1.0
  outcome_prediction: number; // 0-1.0
  contingency_planning: number; // 0-1.0
  simulation_realism: number; // 0-1.0
}
export interface AdaptivePrediction {
  adaptation_id: string;
  adaptation_domain: string;
  model_updating: number; // 0-1.0
  error_correction: number; // 0-1.0
  prediction_refinement: number; // 0-1.0
  adaptive_efficiency: number; // 0-1.0
}
export interface PredictionState {
  overall_prediction_accuracy: number; // 0-1.0
  predictive_modeling_quality: number; // 0-1.0
  anticipatory_coding_strength: number; // 0-1.0
  future_simulation_depth: number; // 0-1.0
  adaptive_prediction_capacity: number; // 0-1.0
  prediction_confidence_level: number; // 0-1.0
  anticipation_readiness: number; // 0-1.0
  timestamp_ms: number;
}
export interface PredictionMetrics {
  prediction_accuracy_rate: number; // 0-1.0
  predictive_modeling_efficiency: number; // 0-1.0
  anticipatory_precision: number; // 0-1.0
  future_simulation_capability: number; // 0-1.0
  adaptive_learning_rate: number; // 0-1.0
  error_correction_speed: number; // 0-1.0
  overall_prediction_strength: number; // 0-1.0
}
