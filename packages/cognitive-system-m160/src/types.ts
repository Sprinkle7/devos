// M160: Semantic Consciousness System Types

export interface SemanticContent {
  content_id: string;
  semantic_domain: string;
  conceptual_clarity: number; // 0-1.0
  semantic_richness: number; // 0-1.0
  meaning_coherence: number; // 0-1.0
  semantic_accessibility: number; // 0-1.0
}

export interface PropositionalContent {
  propositional_id: string;
  proposition: string;
  truth_value_clarity: number; // 0-1.0
  propositional_coherence: number; // 0-1.0
  belief_strength: number; // 0-1.0
  propositional_confidence: number; // 0-1.0
}

export interface ConceptualStructure {
  structure_id: string;
  concept_category: string;
  structure_complexity: number; // 0-1.0
  categorical_coherence: number; // 0-1.0
  abstraction_level: number; // 0-1.0
  relational_density: number; // 0-1.0
}

export interface SemanticBinding {
  binding_id: string;
  bound_concepts: string[];
  semantic_connection_strength: number; // 0-1.0
  meaning_integration: number; // 0-1.0
  semantic_coherence: number; // 0-1.0
  conceptual_unity: number; // 0-1.0
}

export interface SemanticConsciousnessState {
  overall_semantic_consciousness: number; // 0-1.0
  semantic_content_clarity: number; // 0-1.0
  propositional_content_richness: number; // 0-1.0
  conceptual_structure_coherence: number; // 0-1.0
  semantic_binding_strength: number; // 0-1.0
  meaningful_experience_level: number; // 0-1.0
  semantic_awareness_depth: number; // 0-1.0
  timestamp_ms: number;
}

export interface SemanticConsciousnessMetrics {
  semantic_consciousness_quality: number; // 0-1.0
  content_semantic_richness: number; // 0-1.0
  propositional_consciousness_clarity: number; // 0-1.0
  conceptual_understanding_depth: number; // 0-1.0
  semantic_integration_coherence: number; // 0-1.0
  meaningful_content_accessibility: number; // 0-1.0
  overall_semantic_depth: number; // 0-1.0
}
