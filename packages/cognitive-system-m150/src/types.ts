// M150: Episodic Simulation System Types

export interface MentalSimulation {
  simulation_id: string;
  scenario_type: string; // 'past-simulation', 'future-simulation', 'counterfactual', 'hypothetical'
  scenario_vividness: number; // 0-1.0
  scenario_detail: number; // 0-1.0
  temporal_accuracy: number; // 0-1.0
  emotional_resonance: number; // 0-1.0
}

export interface ContextualReconstruction {
  reconstruction_id: string;
  target_episode: string;
  spatial_reconstruction_fidelity: number; // 0-1.0
  temporal_reconstruction_accuracy: number; // 0-1.0
  agent_positioning: number; // 0-1.0
  environmental_detail: number; // 0-1.0
}

export interface FutureProjection {
  projection_id: string;
  target_scenario: string;
  likelihood_estimation: number; // 0-1.0
  consequence_prediction: number; // 0-1.0
  preparedness_assessment: number; // 0-1.0
  planning_contribution: number; // 0-1.0
}

export interface CounterfactualThinking {
  counterfactual_id: string;
  actual_event: string;
  alternative_scenario: string;
  divergence_points: number;
  outcome_difference: number; // -1.0 to 1.0
  learning_potential: number; // 0-1.0
}

export interface EpisodicSimulationState {
  total_simulations_generated: number;
  average_simulation_vividness: number; // 0-1.0
  average_reconstruction_fidelity: number; // 0-1.0
  future_projection_accuracy: number; // 0-1.0
  counterfactual_exploration_rate: number;
  simulation_utility_average: number; // 0-1.0
  planning_benefit: number; // 0-1.0
  timestamp_ms: number;
}

export interface EpisodicSimulationMetrics {
  simulation_vividness_average: number; // 0-1.0
  episodic_reconstruction_quality: number; // 0-1.0
  future_planning_contribution: number; // 0-1.0
  counterfactual_reasoning_depth: number; // 0-1.0
  scenario_detail_richness: number; // 0-1.0
  simulation_inference_accuracy: number; // 0-1.0
  adaptive_simulation_rate: number; // 0-1.0
}
