// M163: Creativity and Novelty Generation System Types
export interface CreativeProcess {
  process_id: string;
  creative_domain: string;
  idea_fluency: number; // 0-1.0
  idea_flexibility: number; // 0-1.0
  original_synthesis: number; // 0-1.0
  creative_elaboration: number; // 0-1.0
}
export interface NoveltyGeneration {
  novelty_id: string;
  novelty_type: string;
  uniqueness_level: number; // 0-1.0
  creative_combination: number; // 0-1.0
  innovation_potential: number; // 0-1.0
  conceptual_distance: number; // 0-1.0
}
export interface DivergentThinking {
  thinking_id: string;
  thinking_domain: string;
  alternative_generation: number; // 0-1.0
  perspective_multiplicity: number; // 0-1.0
  constraint_transcendence: number; // 0-1.0
  associative_richness: number; // 0-1.0
}
export interface ConvergentIntegration {
  integration_id: string;
  integration_type: string;
  idea_evaluation: number; // 0-1.0
  quality_discrimination: number; // 0-1.0
  practical_feasibility: number; // 0-1.0
  coherent_synthesis: number; // 0-1.0
}
export interface CreativityState {
  overall_creative_capacity: number; // 0-1.0
  idea_generation_fluency: number; // 0-1.0
  novelty_generation_strength: number; // 0-1.0
  divergent_thinking_depth: number; // 0-1.0
  convergent_integration_quality: number; // 0-1.0
  creative_output_quality: number; // 0-1.0
  innovation_readiness: number; // 0-1.0
  timestamp_ms: number;
}
export interface CreativityMetrics {
  creative_fluency_rate: number; // 0-1.0
  novelty_generation_capacity: number; // 0-1.0
  divergent_thinking_flexibility: number; // 0-1.0
  convergent_thinking_quality: number; // 0-1.0
  idea_elaboration_depth: number; // 0-1.0
  creative_synthesis_coherence: number; // 0-1.0
  overall_creativity_strength: number; // 0-1.0
}
