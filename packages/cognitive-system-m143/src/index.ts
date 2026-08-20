import { ProblemSolvingState, ProblemSolvingMetrics } from './types';
import { ProblemRepresentationSystem, SolutionSearchSystem, CreativePotentialSystem } from './problem-systems';

export class ProblemSolvingCreativitySystem {
  private problem: ProblemRepresentationSystem;
  private search: SolutionSearchSystem;
  private creativity: CreativePotentialSystem;

  private activeProblems: number = 0;
  private avgComplexity: number = 0.5;
  private successRate: number = 0.5;
  private avgCreativity: number = 0.5;

  constructor() {
    this.problem = new ProblemRepresentationSystem();
    this.search = new SolutionSearchSystem();
    this.creativity = new CreativePotentialSystem();
  }

  representProblem(individual: string, desc: string, complexity: number, constraints: number): void {
    this.problem.representProblem(individual, desc, complexity, constraints);
    this.activeProblems++;
    this.avgComplexity = this.problem.getAverageComplexity();
  }

  searchSolution(problemId: string, strategy: string, found: boolean, depth: number, creativity: number): void {
    this.search.searchSolution(problemId, strategy, found, depth, creativity);
    this.successRate = this.search.getSuccessRate();
  }

  assessCreativity(individual: string, orig: number, fluency: number, flex: number, elab: number): void {
    this.creativity.assessCreativity(individual, orig, fluency, flex, elab);
    this.avgCreativity = this.creativity.getAverageCreativity();
  }

  getState(): ProblemSolvingState {
    return {
      active_problems: this.activeProblems,
      average_problem_complexity: this.avgComplexity,
      solution_success_rate: this.successRate,
      average_creativity_level: this.avgCreativity,
      timestamp_ms: Date.now()
    };
  }

  getMetrics(): ProblemSolvingMetrics {
    return {
      problem_solving_efficiency: this.successRate * (1 - this.avgComplexity * 0.3),
      solution_quality: this.successRate * this.avgCreativity,
      creative_performance: this.avgCreativity
    };
  }
}

export { ProblemRepresentationSystem, SolutionSearchSystem, CreativePotentialSystem } from './problem-systems';
export * from './types';
