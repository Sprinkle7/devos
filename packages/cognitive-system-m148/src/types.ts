// M148: Knowledge Representation and Reasoning System Types

export interface ConceptualRepresentation {
  concept_id: string;
  concept_name: string;
  abstraction_level: number; // 0-1.0
  prototype_similarity: number; // 0-1.0
  feature_completeness: number; // 0-1.0
  exemplar_connectivity: number; // 0-1.0
}

export interface RelationalStructure {
  relation_id: string;
  source_concept: string;
  target_concept: string;
  relation_type: string; // 'hierarchical', 'associative', 'causal', 'comparative'
  relation_strength: number; // 0-1.0
  directionality: string; // 'unidirectional', 'bidirectional'
}

export interface LogicalReasoning {
  reasoning_id: string;
  reasoning_type: string; // 'deductive', 'inductive', 'abductive', 'analogical'
  premise_validity: number; // 0-1.0
  conclusion_validity: number; // 0-1.0
  soundness_rating: number; // 0-1.0
  confidence_level: number; // 0-1.0
}

export interface InferentialCapacity {
  inference_id: string;
  inference_type: string; // 'forward', 'backward', 'bidirectional'
  inference_complexity: number; // 0-1.0
  inference_reliability: number; // 0-1.0
  information_integration: number; // 0-1.0
}

export interface KnowledgeUpdate {
  update_id: string;
  knowledge_revision: string;
  consistency_maintenance: number; // 0-1.0
  integration_smoothness: number; // 0-1.0
  belief_coherence: number; // 0-1.0
  learning_from_conflict: number; // 0-1.0
}

export interface KnowledgeState {
  total_concepts_represented: number;
  average_abstraction_level: number; // 0-1.0
  average_relation_strength: number; // 0-1.0
  reasoning_validity_average: number; // 0-1.0
  inferential_capacity_level: number; // 0-1.0
  knowledge_consistency_score: number; // 0-1.0
  knowledge_integration_rate: number; // 0-1.0
  timestamp_ms: number;
}

export interface KnowledgeMetrics {
  knowledge_completeness: number; // 0-1.0
  conceptual_clarity: number; // 0-1.0
  relational_coherence: number; // 0-1.0
  reasoning_quality: number; // 0-1.0
  inference_reliability: number; // 0-1.0
  knowledge_flexibility: number; // 0-1.0
  adaptive_reasoning_rate: number; // 0-1.0
}
