// M159: Cognitive Integration and Unification System Types

export interface ProcessIntegration {
  integration_id: string;
  process_types: string[];
  integration_quality: number; // 0-1.0
  process_coordination: number; // 0-1.0
  information_transfer: number; // 0-1.0
  integration_stability: number; // 0-1.0
}

export interface CognitiveBinding {
  binding_id: string;
  bound_processes: string[];
  binding_coherence: number; // 0-1.0
  unified_operation: number; // 0-1.0
  constraint_satisfaction: number; // 0-1.0
  binding_robustness: number; // 0-1.0
}

export interface UnifiedWorkspace {
  workspace_id: string;
  workspace_type: string;
  capacity_utilization: number; // 0-1.0
  information_accessibility: number; // 0-1.0
  workspace_coherence: number; // 0-1.0
  unification_effectiveness: number; // 0-1.0
}

export interface GlobalConsciousState {
  state_id: string;
  integration_level: number; // 0-1.0
  consciousness_unity: number; // 0-1.0
  coordinated_processing: number; // 0-1.0
  state_stability: number; // 0-1.0
}

export interface CognitiveUnificationState {
  overall_integration_level: number; // 0-1.0
  process_coordination_quality: number; // 0-1.0
  cognitive_binding_strength: number; // 0-1.0
  unified_workspace_coherence: number; // 0-1.0
  global_consciousness_unity: number; // 0-1.0
  integrated_processing_efficiency: number; // 0-1.0
  unification_stability: number; // 0-1.0
  timestamp_ms: number;
}

export interface CognitiveUnificationMetrics {
  process_integration_quality: number; // 0-1.0
  cognitive_binding_coherence: number; // 0-1.0
  workspace_unification_strength: number; // 0-1.0
  consciousness_integration_depth: number; // 0-1.0
  coordinated_processing_efficiency: number; // 0-1.0
  unified_function_coherence: number; // 0-1.0
  overall_unification_strength: number; // 0-1.0
}
