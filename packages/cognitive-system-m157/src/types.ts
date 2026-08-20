// M157: Stream of Consciousness System Types

export interface ThoughtSequence {
  sequence_id: string;
  thought_content: string;
  associative_links: string[];
  thought_vividness: number; // 0-1.0
  semantic_coherence: number; // 0-1.0
  transition_smoothness: number; // 0-1.0
  attention_capture: number; // 0-1.0
}

export interface ConsciousnessFlow {
  flow_id: string;
  content_type: string; // 'perceptual', 'cognitive', 'emotional', 'memorial'
  flow_continuity: number; // 0-1.0
  phenomenal_presence: number; // 0-1.0
  content_integration: number; // 0-1.0
  flow_velocity: number; // 0-1.0
}

export interface MindWandering {
  wandering_id: string;
  wandering_focus: string;
  task_disengagement: number; // 0-1.0
  mind_wandering_intensity: number; // 0-1.0
  self_generated_thought: number; // 0-1.0
  wandering_control: number; // 0-1.0
}

export interface AttentionalTracking {
  tracking_id: string;
  tracked_element: string;
  tracking_stability: number; // 0-1.0
  focus_maintenance: number; // 0-1.0
  distraction_resistance: number; // 0-1.0
  tracking_coherence: number; // 0-1.0
}

export interface StreamOfConsciousnessState {
  overall_stream_flow: number; // 0-1.0
  thought_sequence_coherence: number; // 0-1.0
  consciousness_flow_continuity: number; // 0-1.0
  mind_wandering_level: number; // 0-1.0
  attentional_focus_clarity: number; // 0-1.0
  stream_integration_level: number; // 0-1.0
  conscious_flow_vividness: number; // 0-1.0
  timestamp_ms: number;
}

export interface StreamOfConsciousnessMetrics {
  flow_coherence_quality: number; // 0-1.0
  thought_continuity_strength: number; // 0-1.0
  phenomenal_flow_richness: number; // 0-1.0
  mind_wandering_control_strength: number; // 0-1.0
  attentional_tracking_effectiveness: number; // 0-1.0
  stream_integration_coherence: number; // 0-1.0
  consciousness_stream_depth: number; // 0-1.0
}
