// M176: Attention to Emotion System Types
export interface EmotionalSalience {
  emotionalsalience_id: string;
  emotion_type: string;
  attentional_priority: number; // 0-1.0
  emotion_detection_speed: number; // 0-1.0
  affective_relevance: number; // 0-1.0
  emotional_capture: number; // 0-1.0
}
export interface BiasedProcessing {
  biasedprocessing_id: string;
  processing_type: string;
  attention_bias_strength: number; // 0-1.0
  emotional_facilitation: number; // 0-1.0
  interference_management: number; // 0-1.0
  selective_attention: number; // 0-1.0
}
export interface EmotionalFocus {
  emotionalfocus_id: string;
  focus_domain: number; // 0-1.0
  emotional_engagement: number; // 0-1.0
  focus_intensity: number; // 0-1.0
  distraction_resistance: number; // 0-1.0
  attention_sustainability: number; // 0-1.0
}
export interface AffectiveInfluence {
  affectiveinfluence_id: string;
  influence_type: string;
  emotion_impact_strength: number; // 0-1.0
  processing_modulation: number; // 0-1.0
  decision_influence: number; // 0-1.0
  behavioral_impact: number; // 0-1.0
}
export interface AttentiontoEmotionSystemState {
  state_metric_1: number; // 0-1.0
  state_metric_2: number; // 0-1.0
  state_metric_3: number; // 0-1.0
  state_metric_4: number; // 0-1.0
  integration_quality: number; // 0-1.0
  stability: number; // 0-1.0
  cognition_integration: number; // 0-1.0
  timestamp_ms: number;
}
export interface AttentiontoEmotionSystemMetrics {
  metric_1: number; // 0-1.0
  metric_2: number; // 0-1.0
  metric_3: number; // 0-1.0
  metric_4: number; // 0-1.0
  metric_5: number; // 0-1.0
  metric_6: number; // 0-1.0
  overall_strength: number; // 0-1.0
}
