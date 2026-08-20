// M161: Implicit Learning and Unconscious Processing System Types

export interface ImplicitLearningProcess {
  process_id: string;
  learning_domain: string;
  pattern_extraction: number; // 0-1.0
  statistical_learning: number; // 0-1.0
  unconscious_acquisition: number; // 0-1.0
  implicit_skill_development: number; // 0-1.0
}

export interface UnconsciousProcessing {
  processing_id: string;
  processing_type: string;
  automatic_activation: number; // 0-1.0
  processing_efficiency: number; // 0-1.0
  unconscious_inference: number; // 0-1.0
  implicit_representation: number; // 0-1.0
}

export interface HabitFormation {
  habit_id: string;
  behavior_type: string;
  automaticity_level: number; // 0-1.0
  habit_strength: number; // 0-1.0
  contextual_cueing: number; // 0-1.0
  behavioral_fluency: number; // 0-1.0
}

export interface PreconsciousActivation {
  activation_id: string;
  stimulus_type: string;
  priming_strength: number; // 0-1.0
  semantic_activation: number; // 0-1.0
  affective_priming: number; // 0-1.0
  activation_persistence: number; // 0-1.0
}

export interface ImplicitLearningState {
  total_implicit_acquisitions: number;
  pattern_learning_strength: number; // 0-1.0
  unconscious_processing_depth: number; // 0-1.0
  habit_formation_level: number; // 0-1.0
  preconscious_activation_strength: number; // 0-1.0
  implicit_performance_level: number; // 0-1.0
  unconscious_skill_development: number; // 0-1.0
  timestamp_ms: number;
}

export interface ImplicitLearningMetrics {
  implicit_learning_rate: number; // 0-1.0
  pattern_recognition_capacity: number; // 0-1.0
  unconscious_processing_efficiency: number; // 0-1.0
  habit_formation_speed: number; // 0-1.0
  preconscious_sensitivity: number; // 0-1.0
  implicit_skill_acquisition: number; // 0-1.0
  unconscious_learning_depth: number; // 0-1.0
}
