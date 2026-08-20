// M173: Executive Function System Types
export interface GoalRepresentation {
  goal_id: string;
  goal_type: string;
  goal_clarity: number; // 0-1.0
  hierarchy_level: number; // 0-1.0
  temporal_structure: number; // 0-1.0
  goal_commitment: number; // 0-1.0
}
export interface PlanningExecution {
  plan_id: string;
  plan_type: string;
  strategy_development: number; // 0-1.0
  step_sequencing: number; // 0-1.0
  contingency_planning: number; // 0-1.0
  execution_coordination: number; // 0-1.0
}
export interface CognitiveControl {
  control_id: string;
  control_domain: string;
  inhibition_strength: number; // 0-1.0
  interference_suppression: number; // 0-1.0
  response_flexibility: number; // 0-1.0
  control_adjustment: number; // 0-1.0
}
export interface WorkingMemoryManagement {
  memory_id: string;
  memory_type: string;
  information_holding: number; // 0-1.0
  mental_manipulation: number; // 0-1.0
  focus_maintenance: number; // 0-1.0
  dual_task_performance: number; // 0-1.0
}
export interface ExecutiveFunctionState {
  goal_representation_quality: number; // 0-1.0
  planning_execution_effectiveness: number; // 0-1.0
  cognitive_control_strength: number; // 0-1.0
  working_memory_management_quality: number; // 0-1.0
  executive_coordination_effectiveness: number; // 0-1.0
  cognitive_flexibility_strength: number; // 0-1.0
  executive_cognition_integration: number; // 0-1.0
  timestamp_ms: number;
}
export interface ExecutiveFunctionMetrics {
  goal_clarity_strength: number; // 0-1.0
  planning_quality_rating: number; // 0-1.0
  cognitive_control_effectiveness: number; // 0-1.0
  working_memory_capacity_strength: number; // 0-1.0
  task_completion_efficiency: number; // 0-1.0
  adaptive_response_quality: number; // 0-1.0
  overall_executive_strength: number; // 0-1.0
}
