import {
  MentalSimulation,
  ContextualReconstruction,
  FutureProjection,
  CounterfactualThinking
} from './types';

export class MentalSimulationSystem {
  private simulations: Map<string, MentalSimulation> = new Map();
  private history: Array<{ timestamp: number; simulationId: string }> = [];

  generateSimulation(type: string, vividness: number, detail: number, temporal: number, emotional: number): MentalSimulation {
    const simulationId = `sim_${Date.now()}`;
    const simulation: MentalSimulation = {
      simulation_id: simulationId,
      scenario_type: type,
      scenario_vividness: Math.max(0, Math.min(1, vividness)),
      scenario_detail: Math.max(0, Math.min(1, detail)),
      temporal_accuracy: Math.max(0, Math.min(1, temporal)),
      emotional_resonance: Math.max(0, Math.min(1, emotional))
    };
    this.simulations.set(simulationId, simulation);
    this.history.push({ timestamp: Date.now(), simulationId });
    if (this.history.length > 500) this.history.shift();
    return simulation;
  }

  getSimulation(simulationId: string): MentalSimulation | null {
    return this.simulations.get(simulationId) || null;
  }

  getAverageSimulationVividness(): number {
    if (this.simulations.size === 0) return 0.6;
    const total = Array.from(this.simulations.values()).reduce((sum, s) => sum + s.scenario_vividness, 0);
    return total / this.simulations.size;
  }
}

export class ContextualReconstructionSystem {
  private reconstructions: Map<string, ContextualReconstruction> = new Map();

  reconstructContext(episode: string, spatial: number, temporal: number, positioning: number, detail: number): ContextualReconstruction {
    const reconstructionId = `recon_${Date.now()}`;
    const reconstruction: ContextualReconstruction = {
      reconstruction_id: reconstructionId,
      target_episode: episode,
      spatial_reconstruction_fidelity: Math.max(0, Math.min(1, spatial)),
      temporal_reconstruction_accuracy: Math.max(0, Math.min(1, temporal)),
      agent_positioning: Math.max(0, Math.min(1, positioning)),
      environmental_detail: Math.max(0, Math.min(1, detail))
    };
    this.reconstructions.set(reconstructionId, reconstruction);
    return reconstruction;
  }

  getReconstruction(reconstructionId: string): ContextualReconstruction | null {
    return this.reconstructions.get(reconstructionId) || null;
  }

  getAverageReconstructionFidelity(): number {
    if (this.reconstructions.size === 0) return 0.6;
    const total = Array.from(this.reconstructions.values()).reduce((sum, r) => sum + (r.spatial_reconstruction_fidelity + r.temporal_reconstruction_accuracy) / 2, 0);
    return total / this.reconstructions.size;
  }
}

export class FutureProjectionSystem {
  private projections: Map<string, FutureProjection> = new Map();

  projectFuture(scenario: string, likelihood: number, consequence: number, preparedness: number, planning: number): FutureProjection {
    const projectionId = `proj_${Date.now()}`;
    const projection: FutureProjection = {
      projection_id: projectionId,
      target_scenario: scenario,
      likelihood_estimation: Math.max(0, Math.min(1, likelihood)),
      consequence_prediction: Math.max(0, Math.min(1, consequence)),
      preparedness_assessment: Math.max(0, Math.min(1, preparedness)),
      planning_contribution: Math.max(0, Math.min(1, planning))
    };
    this.projections.set(projectionId, projection);
    return projection;
  }

  getProjection(projectionId: string): FutureProjection | null {
    return this.projections.get(projectionId) || null;
  }

  getAveragePlanningContribution(): number {
    if (this.projections.size === 0) return 0.6;
    const total = Array.from(this.projections.values()).reduce((sum, p) => sum + p.planning_contribution, 0);
    return total / this.projections.size;
  }
}

export class CounterfactualThinkingSystem {
  private counterfactuals: Map<string, CounterfactualThinking> = new Map();

  generateCounterfactual(actual: string, alternative: string, divergence: number, outcomeDiff: number, learning: number): CounterfactualThinking {
    const counterfactualId = `cf_${Date.now()}`;
    const counterfactual: CounterfactualThinking = {
      counterfactual_id: counterfactualId,
      actual_event: actual,
      alternative_scenario: alternative,
      divergence_points: divergence,
      outcome_difference: Math.max(-1, Math.min(1, outcomeDiff)),
      learning_potential: Math.max(0, Math.min(1, learning))
    };
    this.counterfactuals.set(counterfactualId, counterfactual);
    return counterfactual;
  }

  getCounterfactual(counterfactualId: string): CounterfactualThinking | null {
    return this.counterfactuals.get(counterfactualId) || null;
  }

  getCounterfactualExplorationRate(): number {
    return this.counterfactuals.size;
  }
}
