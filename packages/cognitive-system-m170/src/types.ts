// M170: Working Memory System Types
export interface WorkingMemoryStorage {
  storage_id: string;
  storage_type: string;
  buffer_capacity: number; // 0-1.0
  information_retention: number; // 0-1.0
  item_quantity: number; // 0-1.0
  maintenance_strength: number; // 0-1.0
}
export interface MemoryUpdateManipulation {
  update_id: string;
  update_type: string;
  manipulation_speed: number; // 0-1.0
  transformation_accuracy: number; // 0-1.0
  operation_complexity: number; // 0-1.0
  update_efficiency: number; // 0-1.0
}
export interface CentralExecutive {
  executive_id: string;
  executive_domain: string;
  control_strength: number; // 0-1.0
  coordination_quality: number; // 0-1.0
  inhibition_effectiveness: number; // 0-1.0
  executive_capacity: number; // 0-1.0
}
export interface WorkingMemoryIntegration {
  integration_id: string;
  integration_type: string;
  long_term_link_strength: number; // 0-1.0
  episodic_binding: number; // 0-1.0
  context_maintenance: number; // 0-1.0
  retrieval_efficiency: number; // 0-1.0
}
export interface WorkingMemoryState {
  working_memory_capacity: number; // 0-1.0
  information_retention_quality: number; // 0-1.0
  manipulation_efficiency: number; // 0-1.0
  executive_control_strength: number; // 0-1.0
  memory_integration_quality: number; // 0-1.0
  working_memory_stability: number; // 0-1.0
  working_memory_cognition_integration: number; // 0-1.0
  timestamp_ms: number;
}
export interface WorkingMemoryMetrics {
  storage_capacity_strength: number; // 0-1.0
  information_retention_rate: number; // 0-1.0
  manipulation_operation_speed: number; // 0-1.0
  executive_control_effectiveness: number; // 0-1.0
  memory_update_quality: number; // 0-1.0
  working_memory_flexibility: number; // 0-1.0
  overall_working_memory_strength: number; // 0-1.0
}
