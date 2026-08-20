// M172: Semantic Memory System Types
export interface ConceptualRepresentation {
  concept_id: string;
  concept_type: string;
  feature_encoding: number; // 0-1.0
  categorical_membership: number; // 0-1.0
  semantic_richness: number; // 0-1.0
  prototype_similarity: number; // 0-1.0
}
export interface SemanticNetwork {
  network_id: string;
  network_type: string;
  connection_density: number; // 0-1.0
  spreading_activation: number; // 0-1.0
  semantic_relatedness: number; // 0-1.0
  path_length_efficiency: number; // 0-1.0
}
export interface FactualKnowledge {
  factual_id: string;
  knowledge_domain: string;
  fact_retrieval_speed: number; // 0-1.0
  knowledge_accuracy: number; // 0-1.0
  information_completeness: number; // 0-1.0
  knowledge_confidence: number; // 0-1.0
}
export interface ConceptualOrganization {
  organization_id: string;
  organization_type: string;
  taxonomic_structure: number; // 0-1.0
  hierarchical_organization: number; // 0-1.0
  cross_category_relations: number; // 0-1.0
  conceptual_coherence: number; // 0-1.0
}
export interface SemanticMemoryState {
  conceptual_representation_quality: number; // 0-1.0
  semantic_network_connectivity: number; // 0-1.0
  factual_knowledge_strength: number; // 0-1.0
  conceptual_organization_quality: number; // 0-1.0
  semantic_knowledge_depth: number; // 0-1.0
  knowledge_accessibility: number; // 0-1.0
  semantic_cognition_integration: number; // 0-1.0
  timestamp_ms: number;
}
export interface SemanticMemoryMetrics {
  concept_encoding_strength: number; // 0-1.0
  semantic_network_efficiency: number; // 0-1.0
  factual_knowledge_retrieval_speed: number; // 0-1.0
  conceptual_organization_strength: number; // 0-1.0
  semantic_knowledge_accuracy: number; // 0-1.0
  knowledge_integration_quality: number; // 0-1.0
  overall_semantic_memory_strength: number; // 0-1.0
}
