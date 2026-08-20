// M147: Metacognition and Self-Reflection System Types

export interface SelfAwareness {
  awareness_id: string;
  awareness_type: string; // 'cognitive', 'emotional', 'social', 'bodily'
  self_recognition_level: number; // 0-1.0
  introspective_depth: number; // 0-1.0
  perspective_taking: number; // 0-1.0
  identity_coherence: number; // 0-1.0
}

export interface MetacognitiveMonitoring {
  monitoring_id: string;
  process_type: string; // 'learning', 'problem-solving', 'decision-making', 'memory'
  monitoring_accuracy: number; // 0-1.0
  confidence_calibration: number; // 0-1.0
  error_detection_rate: number; // 0-1.0
  strategy_awareness: number; // 0-1.0
}

export interface ReflectiveProcessing {
  reflection_id: string;
  reflection_type: string; // 'self-evaluation', 'experience-review', 'goal-assessment', 'value-clarification'
  depth_of_processing: number; // 0-1.0
  insight_generation: number; // 0-1.0
  meaning_making: number; // 0-1.0
  transformative_potential: number; // 0-1.0
}

export interface MindwanderingMetacognition {
  wandering_id: string;
  task_focus_deviation: number; // 0-1.0
  mindwandering_quality: string; // 'poor', 'neutral', 'productive'
  self_detection_lag: number; // milliseconds
  refocus_efficiency: number; // 0-1.0
}

export interface AffectiveMetacognition {
  affective_id: string;
  emotional_awareness: number; // 0-1.0
  emotion_regulation_understanding: number; // 0-1.0
  empathic_accuracy: number; // 0-1.0
  affective_integration: number; // 0-1.0
}

export interface MetacognitionState {
  current_self_awareness_level: number; // 0-1.0
  average_monitoring_accuracy: number; // 0-1.0
  average_reflection_depth: number; // 0-1.0
  mindwandering_frequency: number;
  emotional_metacognition_level: number; // 0-1.0
  overall_metacognitive_ability: number; // 0-1.0
  timestamp_ms: number;
}

export interface MetacognitionMetrics {
  metacognitive_accuracy: number; // 0-1.0
  self_reflection_quality: number; // 0-1.0
  insight_generation_rate: number; // 0-1.0
  error_correction_rate: number; // 0-1.0
  affective_metacognition_level: number; // 0-1.0
  cognitive_flexibility_awareness: number; // 0-1.0
  self_improvement_trajectory: number; // 0-1.0
}
