// M164: Learning and Memory Consolidation System Types
export interface LearningAcquisition {
  acquisition_id: string;
  learning_type: string;
  encoding_strength: number; // 0-1.0
  processing_depth: number; // 0-1.0
  semantic_elaboration: number; // 0-1.0
  learning_efficiency: number; // 0-1.0
}
export interface MemoryConsolidation {
  consolidation_id: string;
  memory_phase: string;
  synaptic_strengthening: number; // 0-1.0
  systems_consolidation: number; // 0-1.0
  memory_stabilization: number; // 0-1.0
  retention_quality: number; // 0-1.0
}
export interface RetrievalOptimization {
  optimization_id: string;
  retrieval_type: string;
  recall_accessibility: number; // 0-1.0
  retrieval_fluency: number; // 0-1.0
  context_reinstatement: number; // 0-1.0
  retrieval_success_rate: number; // 0-1.0
}
export interface LearningTransfer {
  transfer_id: string;
  transfer_domain: string;
  near_transfer_strength: number; // 0-1.0
  far_transfer_capacity: number; // 0-1.0
  skill_generalization: number; // 0-1.0
  knowledge_application: number; // 0-1.0
}
export interface LearningMemoryState {
  total_learning_acquisitions: number;
  learning_efficiency_level: number; // 0-1.0
  memory_consolidation_strength: number; // 0-1.0
  retrieval_optimization_quality: number; // 0-1.0
  learning_transfer_capacity: number; // 0-1.0
  memory_retention_quality: number; // 0-1.0
  learning_performance_level: number; // 0-1.0
  timestamp_ms: number;
}
export interface LearningMemoryMetrics {
  learning_acquisition_rate: number; // 0-1.0
  memory_consolidation_efficiency: number; // 0-1.0
  retrieval_success_rate: number; // 0-1.0
  learning_retention_durability: number; // 0-1.0
  transfer_learning_capacity: number; // 0-1.0
  knowledge_integration_depth: number; // 0-1.0
  overall_learning_strength: number; // 0-1.0
}
