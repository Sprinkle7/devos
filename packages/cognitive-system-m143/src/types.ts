// M143: Problem-Solving and Creativity System Types

export interface ProblemRepresentation {
  problem_id: string;
  individual: string;
  problem_description: string;
  complexity: number;
  constraint_number: number;
}

export interface SolutionSearch {
  search_id: string;
  problem_id: string;
  search_strategy: string;
  solution_found: boolean;
  search_depth: number;
  creativity_level: number;
}

export interface CreativePotential {
  potential_id: string;
  individual: string;
  originality: number;
  fluency: number;
  flexibility: number;
  elaboration: number;
}

export interface ProblemSolvingState {
  active_problems: number;
  average_problem_complexity: number;
  solution_success_rate: number;
  average_creativity_level: number;
  timestamp_ms: number;
}

export interface ProblemSolvingMetrics {
  problem_solving_efficiency: number;
  solution_quality: number;
  creative_performance: number;
}
