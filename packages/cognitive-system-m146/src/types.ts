// M146: Language and Communication Processing System Types

export interface LanguageComprehension {
  comprehension_id: string;
  input_text: string;
  semantic_parsing: number; // 0-1.0
  syntactic_accuracy: number; // 0-1.0
  pragmatic_inference: number; // 0-1.0
  ambiguity_resolution: number; // 0-1.0
  comprehension_confidence: number; // 0-1.0
}

export interface LanguageProduction {
  production_id: string;
  intended_meaning: string;
  lexical_selection: number; // 0-1.0
  syntactic_construction: number; // 0-1.0
  phonological_encoding: number; // 0-1.0
  pragmatic_appropriateness: number; // 0-1.0
  fluency_rating: number; // 0-1.0
}

export interface SemanticRepresentation {
  semantic_id: string;
  word_or_phrase: string;
  semantic_richness: number; // 0-1.0
  metaphorical_depth: number; // 0-1.0
  conceptual_relatedness: number; // 0-1.0
  frequency_of_use: number; // 0-1.0
}

export interface ConversationDynamics {
  conversation_id: string;
  turn_count: number;
  turn_taking_smoothness: number; // 0-1.0
  mutual_understanding: number; // 0-1.0
  topic_coherence: number; // 0-1.0
  emotional_tone: number; // -1.0 to 1.0
}

export interface DiscourseStructure {
  discourse_id: string;
  text_length: number;
  coherence_score: number; // 0-1.0
  cohesion_score: number; // 0-1.0
  argumentative_strength: number; // 0-1.0
  narrative_structure: string; // 'linear', 'nested', 'parallel', 'recursive'
}

export interface MultimodalIntegration {
  multimodal_id: string;
  modality_types: string[]; // 'linguistic', 'prosodic', 'gestural', 'facial'
  integration_coherence: number; // 0-1.0
  affective_congruence: number; // 0-1.0
  communicative_effectiveness: number; // 0-1.0
}

export interface LanguageCommunicationState {
  total_utterances_processed: number;
  average_comprehension_accuracy: number; // 0-1.0
  average_production_fluency: number; // 0-1.0
  average_semantic_richness: number; // 0-1.0
  conversation_engagement_level: number; // 0-1.0
  discourse_coherence_average: number; // 0-1.0
  multimodal_integration_level: number; // 0-1.0
  timestamp_ms: number;
}

export interface LanguageCommunicationMetrics {
  comprehension_to_production_ratio: number; // 0-1.0
  semantic_precision: number; // 0-1.0
  pragmatic_sensitivity: number; // 0-1.0
  conversational_fluency: number; // 0-1.0
  discourse_quality: number; // 0-1.0
  communicative_intent_alignment: number; // 0-1.0
  linguistic_creativity: number; // 0-1.0
}
