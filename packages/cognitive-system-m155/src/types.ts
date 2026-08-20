// M155: Narrative Self Construction System Types

export interface IdentityNarrative {
  narrative_id: string;
  self_concept: string;
  narrative_coherence: number; // 0-1.0
  autobiographical_continuity: number; // 0-1.0
  identity_stability: number; // 0-1.0
  narrative_integration: number; // 0-1.0
}

export interface SelfMemoryIntegration {
  integration_id: string;
  memory_type: string;
  episodic_contribution: number; // 0-1.0
  semantic_coherence: number; // 0-1.0
  self_relevance: number; // 0-1.0
  narrative_binding: number; // 0-1.0
}

export interface PersonalValueStructure {
  value_id: string;
  value_domain: string;
  value_centrality: number; // 0-1.0
  identity_congruence: number; // 0-1.0
  behavioral_alignment: number; // 0-1.0
  motivational_strength: number; // 0-1.0
}

export interface LifeStoryConstruction {
  story_id: string;
  narrative_arc: string;
  thematic_coherence: number; // 0-1.0
  causal_explanation: number; // 0-1.0
  future_projection: number; // 0-1.0
  meaning_construction: number; // 0-1.0
}

export interface NarrativeSelfState {
  overall_narrative_coherence: number; // 0-1.0
  self_concept_stability: number; // 0-1.0
  autobiographical_memory_integration: number; // 0-1.0
  identity_narrative_strength: number; // 0-1.0
  value_system_coherence: number; // 0-1.0
  life_story_coherence: number; // 0-1.0
  temporal_continuity: number; // 0-1.0
  timestamp_ms: number;
}

export interface NarrativeSelfMetrics {
  narrative_coherence_quality: number; // 0-1.0
  autobiographical_continuity_strength: number; // 0-1.0
  identity_stability_level: number; // 0-1.0
  self_memory_integration_depth: number; // 0-1.0
  value_identity_alignment: number; // 0-1.0
  life_story_meaningfulness: number; // 0-1.0
  narrative_self_coherence: number; // 0-1.0
}
