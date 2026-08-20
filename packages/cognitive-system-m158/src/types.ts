// M158: Phenomenal Awareness System Types

export interface PhenomenalContent {
  content_id: string;
  experience_modality: string; // 'visual', 'auditory', 'tactile', 'proprioceptive', 'interoceptive'
  content_richness: number; // 0-1.0
  qualitative_character: number; // 0-1.0
  phenomenal_intensity: number; // 0-1.0
  content_clarity: number; // 0-1.0
}

export interface AwarenessQuality {
  quality_id: string;
  awareness_mode: string;
  phenomenal_consciousness: number; // 0-1.0
  access_consciousness: number; // 0-1.0
  self_awareness_level: number; // 0-1.0
  meta_awareness: number; // 0-1.0
}

export interface SubjectiveExperience {
  experience_id: string;
  experience_type: string;
  subjective_quality: number; // 0-1.0
  emotional_tone: number; // -1.0 to 1.0
  presence_intensity: number; // 0-1.0
  experience_coherence: number; // 0-1.0
}

export interface ConsciousBinding {
  binding_id: string;
  bound_elements: string[];
  binding_strength: number; // 0-1.0
  unified_representation: number; // 0-1.0
  phenomenal_unity: number; // 0-1.0
  integrated_experience: number; // 0-1.0
}

export interface PhenomenalAwarenessState {
  overall_phenomenal_consciousness: number; // 0-1.0
  phenomenal_content_richness: number; // 0-1.0
  awareness_quality_level: number; // 0-1.0
  subjective_experience_vividness: number; // 0-1.0
  conscious_binding_strength: number; // 0-1.0
  phenomenal_clarity: number; // 0-1.0
  awareness_depth: number; // 0-1.0
  timestamp_ms: number;
}

export interface PhenomenalAwarenessMetrics {
  phenomenal_consciousness_richness: number; // 0-1.0
  content_quality_depth: number; // 0-1.0
  awareness_mode_differentiation: number; // 0-1.0
  subjective_experience_quality: number; // 0-1.0
  binding_coherence_strength: number; // 0-1.0
  phenomenal_clarity_level: number; // 0-1.0
  overall_phenomenal_depth: number; // 0-1.0
}
