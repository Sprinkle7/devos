// M142: Planning and Goal Pursuit System Types

export interface GoalRepresentation {
  goal_id: string;
  individual: string;
  goal_description: string;
  goal_type: string; // 'approach', 'avoidance', 'maintenance'
  goal_importance: number; // 0-1.0
  goal_feasibility: number; // 0-1.0
  temporal_scope: number; // hours to complete
}

export interface PlanStructure {
  plan_id: string;
  goal_id: string;
  plan_complexity: number; // 0-1.0
  hierarchical_depth: number; // levels of subgoals
  step_clarity: number; // 0-1.0
  plan_flexibility: number; // 0-1.0
  contingency_planning: number; // 0-1.0
}

export interface ProgressTracking {
  tracking_id: string;
  plan_id: string;
  progress_percentage: number; // 0-100
  time_elapsed: number; // hours
  resources_invested: number; // 0-1.0
  satisfaction_with_progress: number; // 0-1.0
  difficulty_encountered: number; // 0-1.0
}

export interface GoalConflict {
  conflict_id: string;
  individual: string;
  goal_a: string;
  goal_b: string;
  conflict_type: string; // 'incompatible', 'competing_resources', 'time_conflict'
  conflict_intensity: number; // 0-1.0
  resolution_strategy: string; // 'prioritize', 'integrate', 'abandon'
}

export interface MotivationDynamics {
  dynamics_id: string;
  goal_id: string;
  initial_motivation: number; // 0-1.0
  current_motivation: number; // 0-1.0
  motivation_trajectory: string; // 'increasing', 'stable', 'decreasing'
  commitment_level: number; // 0-1.0
  self_efficacy: number; // 0-1.0
}

export interface GoalAchievement {
  achievement_id: string;
  plan_id: string;
  goal_id: string;
  achievement_status: string; // 'completed', 'abandoned', 'modified'
  outcome_quality: number; // 0-1.0
  time_efficiency: number; // 0-1.0
  resource_efficiency: number; // 0-1.0
  satisfaction_with_outcome: number; // 0-1.0
}

export interface PlanningState {
  active_goals: number;
  average_goal_importance: number; // 0-1.0
  average_goal_feasibility: number; // 0-1.0
  average_progress_percentage: number; // 0-100
  average_motivation_level: number; // 0-1.0
  goal_conflict_frequency: number;
  achievement_rate: number; // 0-1.0
  timestamp_ms: number;
}

export interface PlanningMetrics {
  planning_quality: number; // 0-1.0
  goal_achievement_rate: number; // 0-1.0
  plan_completion_efficiency: number; // 0-1.0
  motivation_maintenance_level: number; // 0-1.0
  conflict_resolution_effectiveness: number; // 0-1.0
  goal_adaptation_rate: number; // 0-1.0
  temporal_estimation_accuracy: number; // 0-1.0
}
