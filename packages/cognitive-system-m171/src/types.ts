// M171: Language Processing System Types
export interface PhoneticProcessing {
  phonetic_id: string;
  sound_type: string;
  phoneme_recognition: number; // 0-1.0
  prosody_processing: number; // 0-1.0
  phonological_encoding: number; // 0-1.0
  speech_discrimination: number; // 0-1.0
}
export interface SyntacticProcessing {
  syntactic_id: string;
  syntax_domain: string;
  grammar_parsing: number; // 0-1.0
  structural_analysis: number; // 0-1.0
  sentence_comprehension: number; // 0-1.0
  rule_application: number; // 0-1.0
}
export interface SemanticProcessing {
  semantic_id: string;
  semantic_type: string;
  meaning_access: number; // 0-1.0
  concept_mapping: number; // 0-1.0
  semantic_integration: number; // 0-1.0
  context_sensitivity: number; // 0-1.0
}
export interface PragmaticProcessing {
  pragmatic_id: string;
  pragmatic_domain: string;
  intention_recognition: number; // 0-1.0
  discourse_coherence: number; // 0-1.0
  reference_resolution: number; // 0-1.0
  social_context_understanding: number; // 0-1.0
}
export interface LanguageProcessingState {
  phonetic_processing_quality: number; // 0-1.0
  syntactic_processing_accuracy: number; // 0-1.0
  semantic_processing_depth: number; // 0-1.0
  pragmatic_understanding_quality: number; // 0-1.0
  language_comprehension_strength: number; // 0-1.0
  language_production_quality: number; // 0-1.0
  language_cognition_integration: number; // 0-1.0
  timestamp_ms: number;
}
export interface LanguageProcessingMetrics {
  sound_processing_accuracy: number; // 0-1.0
  syntax_parsing_efficiency: number; // 0-1.0
  semantic_understanding_depth: number; // 0-1.0
  pragmatic_interpretation_quality: number; // 0-1.0
  language_fluency_rate: number; // 0-1.0
  communication_clarity_strength: number; // 0-1.0
  overall_language_strength: number; // 0-1.0
}
