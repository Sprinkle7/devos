// M154: Integration and Coherence System Types

export interface SystemCoherence {
  coherence_id: string;
  system_pairs: string[]; // pairs of system names
  integration_strength: number; // 0-1.0
  coordination_quality: number; // 0-1.0
  synchronization_level: number; // 0-1.0
  functional_unity: number; // 0-1.0
}

export interface CrossSystemBinding {
  binding_id: string;
  source_system: string;
  target_system: string;
  binding_strength: number; // 0-1.0
  information_flow: number; // 0-1.0
  constraint_satisfaction: number; // 0-1.0
  binding_stability: number; // 0-1.0
}

export interface TemporalIntegration {
  integration_id: string;
  time_window_ms: number;
  temporal_coherence: number; // 0-1.0
  event_ordering: number; // 0-1.0
  causal_binding: number; // 0-1.0
  sequence_prediction: number; // 0-1.0
}

export interface GlobalIntegrationWorkspace {
  workspace_id: string;
  active_representations: number;
  global_availability: number; // 0-1.0
  broadcast_capacity: number; // 0-1.0
  integration_bandwidth: number; // 0-1.0
}

export interface CoherenceState {
  overall_system_coherence: number; // 0-1.0
  cross_system_binding_strength: number; // 0-1.0
  temporal_integration_level: number; // 0-1.0
  global_workspace_activation: number; // 0-1.0
  integration_stability: number; // 0-1.0
  unified_experience_level: number; // 0-1.0
  timestamp_ms: number;
}

export interface CoherenceMetrics {
  system_coordination_quality: number; // 0-1.0
  integration_efficiency: number; // 0-1.0
  binding_coherence: number; // 0-1.0
  temporal_synchronization: number; // 0-1.0
  global_workspace_effectiveness: number; // 0-1.0
  unified_consciousness_strength: number; // 0-1.0
  integration_resilience: number; // 0-1.0
}
