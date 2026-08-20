// M167: Reward Processing and Motivation System Types
export interface RewardProcessing {
  processing_id: string;
  reward_type: string;
  reward_salience: number; // 0-1.0
  motivational_value: number; // 0-1.0
  reward_prediction: number; // 0-1.0
  value_coding: number; // 0-1.0
}
export interface MotivationalDrive {
  drive_id: string;
  drive_type: string;
  drive_intensity: number; // 0-1.0
  goal_directedness: number; // 0-1.0
  persistence_strength: number; // 0-1.0
  motivational_sustainability: number; // 0-1.0
}
export interface RewardLearning {
  learning_id: string;
  learning_domain: string;
  reinforcement_strength: number; // 0-1.0
  association_formation: number; // 0-1.0
  behavioral_adaptation: number; // 0-1.0
  reward_generalization: number; // 0-1.0
}
export interface IncentiveEvaluation {
  evaluation_id: string;
  incentive_type: string;
  incentive_attractiveness: number; // 0-1.0
  cost_benefit_analysis: number; // 0-1.0
  decision_facilitation: number; // 0-1.0
  approach_motivation: number; // 0-1.0
}
export interface RewardMotivationState {
  total_reward_experiences: number;
  reward_processing_sensitivity: number; // 0-1.0
  motivational_drive_level: number; // 0-1.0
  reward_learning_strength: number; // 0-1.0
  incentive_evaluation_quality: number; // 0-1.0
  goal_pursuit_intensity: number; // 0-1.0
  motivation_sustainability_level: number; // 0-1.0
  timestamp_ms: number;
}
export interface RewardMotivationMetrics {
  reward_sensitivity_rate: number; // 0-1.0
  motivational_drive_strength: number; // 0-1.0
  reward_learning_efficiency: number; // 0-1.0
  incentive_salience_strength: number; // 0-1.0
  goal_persistence_capacity: number; // 0-1.0
  motivation_sustainability_quality: number; // 0-1.0
  overall_reward_motivation_strength: number; // 0-1.0
}
