// M151: Conscious Experience and Phenomenal Consciousness System Types

export interface PhenomenalExperience {
  experience_id: string;
  modality: string; // 'visual', 'auditory', 'tactile', 'proprioceptive', 'emotional'
  qualia_intensity: number; // 0-1.0
  sensory_richness: number; // 0-1.0
  affect_valence: number; // -1.0 to 1.0
  unity_of_experience: number; // 0-1.0
}

export interface WakefulnessState {
  state_id: string;
  consciousness_level: number; // 0-1.0
  alertness: number; // 0-1.0
  arousal_state: string; // 'awake', 'drowsy', 'alert', 'hyperaroused'
  attention_span: number; // 0-1.0
  clarity_of_mind: number; // 0-1.0
}

export interface BodyAwareness {
  awareness_id: string;
  somatic_sensitivity: number; // 0-1.0
  interoceptive_accuracy: number; // 0-1.0
  felt_sense_quality: number; // 0-1.0
  embodied_presence: number; // 0-1.0
}

export interface AffectiveConsciousness {
  affect_id: string;
  emotional_intensity: number; // 0-1.0
  emotional_clarity: number; // 0-1.0
  affective_differentiation: number; // 0-1.0
  felt_quality_richness: number; // 0-1.0
}

export interface UnifiedConsciousness {
  unity_id: string;
  binding_strength: number; // 0-1.0
  coherence_level: number; // 0-1.0
  integrated_totality: number; // 0-1.0
  singular_subject_quality: number; // 0-1.0
}

export interface ConsciousExperienceState {
  total_experiences_generated: number;
  average_phenomenal_intensity: number; // 0-1.0
  average_consciousness_level: number; // 0-1.0
  current_arousal_state: string;
  body_awareness_level: number; // 0-1.0
  affective_consciousness_depth: number; // 0-1.0
  unified_consciousness_quality: number; // 0-1.0
  timestamp_ms: number;
}

export interface ConsciousExperienceMetrics {
  phenomenal_richness: number; // 0-1.0
  consciousness_depth: number; // 0-1.0
  wakefulness_stability: number; // 0-1.0
  embodied_presence_strength: number; // 0-1.0
  affective_consciousness_intensity: number; // 0-1.0
  unified_consciousness_strength: number; // 0-1.0
  experiential_continuity: number; // 0-1.0
}
