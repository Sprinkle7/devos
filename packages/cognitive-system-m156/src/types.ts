// M156: Temporal Consciousness System Types

export interface TemporalPoint {
  point_id: string;
  temporal_location: number; // ms
  duration_awareness: number; // 0-1.0
  event_distinctness: number; // 0-1.0
  temporal_precision: number; // 0-1.0
  temporal_salience: number; // 0-1.0
}

export interface TemporalFlow {
  flow_id: string;
  flow_direction: string; // 'forward', 'backward', 'cyclical'
  temporal_continuity: number; // 0-1.0
  flow_momentum: number; // 0-1.0
  transition_smoothness: number; // 0-1.0
  temporal_progression: number; // 0-1.0
}

export interface DurationExperience {
  duration_id: string;
  duration_category: string;
  duration_assessment: number; // 0-1.0
  temporal_estimation_accuracy: number; // 0-1.0
  subjective_time_sense: number; // 0-1.0
  time_expansion_contraction: number; // 0-1.0
}

export interface TemporalAnticipation {
  anticipation_id: string;
  future_horizon_ms: number;
  anticipatory_clarity: number; // 0-1.0
  predictive_confidence: number; // 0-1.0
  temporal_planning_readiness: number; // 0-1.0
  future_orientation_strength: number; // 0-1.0
}

export interface TemporalConsciousnessState {
  present_moment_clarity: number; // 0-1.0
  temporal_continuity_experience: number; // 0-1.0
  duration_awareness_level: number; // 0-1.0
  temporal_flow_coherence: number; // 0-1.0
  past_integration_strength: number; // 0-1.0
  future_anticipation_level: number; // 0-1.0
  temporal_self_coherence: number; // 0-1.0
  timestamp_ms: number;
}

export interface TemporalConsciousnessMetrics {
  temporal_presence_quality: number; // 0-1.0
  now_point_distinctness: number; // 0-1.0
  temporal_flow_stability: number; // 0-1.0
  duration_estimation_accuracy: number; // 0-1.0
  temporal_continuity_binding: number; // 0-1.0
  temporal_anticipation_strength: number; // 0-1.0
  temporal_consciousness_depth: number; // 0-1.0
}
