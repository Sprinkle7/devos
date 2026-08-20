import { ProblemRepresentation, SolutionSearch, CreativePotential } from './types';

export class ProblemRepresentationSystem {
  private problems: Map<string, ProblemRepresentation> = new Map();

  representProblem(individual: string, description: string, complexity: number, constraints: number): ProblemRepresentation {
    const problemId = `prob_${Date.now()}`;
    const problem: ProblemRepresentation = {
      problem_id: problemId,
      individual: individual,
      problem_description: description,
      complexity: Math.max(0, Math.min(1, complexity)),
      constraint_number: constraints
    };
    this.problems.set(problemId, problem);
    return problem;
  }

  getProblem(problemId: string): ProblemRepresentation | null {
    return this.problems.get(problemId) || null;
  }

  getAverageComplexity(): number {
    if (this.problems.size === 0) return 0.5;
    const total = Array.from(this.problems.values()).reduce((sum, p) => sum + p.complexity, 0);
    return total / this.problems.size;
  }
}

export class SolutionSearchSystem {
  private searches: Map<string, SolutionSearch> = new Map();

  searchSolution(problemId: string, strategy: string, found: boolean, depth: number, creativity: number): SolutionSearch {
    const searchId = `search_${Date.now()}`;
    const search: SolutionSearch = {
      search_id: searchId,
      problem_id: problemId,
      search_strategy: strategy,
      solution_found: found,
      search_depth: depth,
      creativity_level: Math.max(0, Math.min(1, creativity))
    };
    this.searches.set(searchId, search);
    return search;
  }

  getSearch(searchId: string): SolutionSearch | null {
    return this.searches.get(searchId) || null;
  }

  getSuccessRate(): number {
    if (this.searches.size === 0) return 0.5;
    const found = Array.from(this.searches.values()).filter(s => s.solution_found).length;
    return found / this.searches.size;
  }
}

export class CreativePotentialSystem {
  private potentials: Map<string, CreativePotential> = new Map();

  assessCreativity(individual: string, originality: number, fluency: number, flexibility: number, elaboration: number): CreativePotential {
    const potentialId = `crea_${Date.now()}`;
    const potential: CreativePotential = {
      potential_id: potentialId,
      individual: individual,
      originality: Math.max(0, Math.min(1, originality)),
      fluency: Math.max(0, Math.min(1, fluency)),
      flexibility: Math.max(0, Math.min(1, flexibility)),
      elaboration: Math.max(0, Math.min(1, elaboration))
    };
    this.potentials.set(potentialId, potential);
    return potential;
  }

  getPotential(potentialId: string): CreativePotential | null {
    return this.potentials.get(potentialId) || null;
  }

  getAverageCreativity(): number {
    if (this.potentials.size === 0) return 0.5;
    const total = Array.from(this.potentials.values()).reduce((sum, p) => sum + (p.originality + p.fluency + p.flexibility + p.elaboration) / 4, 0);
    return total / this.potentials.size;
  }
}
