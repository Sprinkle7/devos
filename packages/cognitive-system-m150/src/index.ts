import { EpisodicSimulationState, EpisodicSimulationMetrics } from './types';
import {
  MentalSimulationSystem,
  ContextualReconstructionSystem,
  FutureProjectionSystem,
  CounterfactualThinkingSystem
} from './simulation-systems';

export class EpisodicSimulationSystem {
  private simulation: MentalSimulationSystem;
  private reconstruction: ContextualReconstructionSystem;
  private projection: FutureProjectionSystem;
  private counterfactual: CounterfactualThinkingSystem;

  private totalSimulationsGenerated: number = 0;
  private avgSimulationVividness: number = 0.6;
  private avgReconstructionFidelity: number = 0.6;
  private futureProjectionAccuracy: number = 0.6;
  private counterfactualExplorationRate: number = 0;
  private simulationUtilityAverage: number = 0.6;
  private planningBenefit: number = 0.6;

  constructor() {
    this.simulation = new MentalSimulationSystem();
    this.reconstruction = new ContextualReconstructionSystem();
    this.projection = new FutureProjectionSystem();
    this.counterfactual = new CounterfactualThinkingSystem();
  }

  generateSimulation(type: string, vividness: number, detail: number, temporal: number, emotional: number): void {
    this.simulation.generateSimulation(type, vividness, detail, temporal, emotional);
    this.totalSimulationsGenerated++;
    this.avgSimulationVividness = this.simulation.getAverageSimulationVividness();
  }

  reconstructContext(episode: string, spatial: number, temporal: number, positioning: number, detail: number): void {
    this.reconstruction.reconstructContext(episode, spatial, temporal, positioning, detail);
    this.avgReconstructionFidelity = this.reconstruction.getAverageReconstructionFidelity();
  }

  projectFuture(scenario: string, likelihood: number, consequence: number, preparedness: number, planning: number): void {
    this.projection.projectFuture(scenario, likelihood, consequence, preparedness, planning);
    this.futureProjectionAccuracy = this.projection.getAveragePlanningContribution();
    this.planningBenefit = this.projection.getAveragePlanningContribution();
  }

  generateCounterfactual(actual: string, alternative: string, divergence: number, outcomeDiff: number, learning: number): void {
    this.counterfactual.generateCounterfactual(actual, alternative, divergence, outcomeDiff, learning);
    this.counterfactualExplorationRate = this.counterfactual.getCounterfactualExplorationRate();
  }

  updateMetrics(): void {
    this.avgSimulationVividness = this.simulation.getAverageSimulationVividness();
    this.avgReconstructionFidelity = this.reconstruction.getAverageReconstructionFidelity();
    this.futureProjectionAccuracy = this.projection.getAveragePlanningContribution();
    this.counterfactualExplorationRate = this.counterfactual.getCounterfactualExplorationRate();
  }

  getEpisodicSimulationState(): EpisodicSimulationState {
    this.updateMetrics();
    return {
      total_simulations_generated: this.totalSimulationsGenerated,
      average_simulation_vividness: this.avgSimulationVividness,
      average_reconstruction_fidelity: this.avgReconstructionFidelity,
      future_projection_accuracy: this.futureProjectionAccuracy,
      counterfactual_exploration_rate: this.counterfactualExplorationRate,
      simulation_utility_average: this.simulationUtilityAverage,
      planning_benefit: this.planningBenefit,
      timestamp_ms: Date.now()
    };
  }

  getEpisodicSimulationMetrics(): EpisodicSimulationMetrics {
    return {
      simulation_vividness_average: this.avgSimulationVividness,
      episodic_reconstruction_quality: this.avgReconstructionFidelity,
      future_planning_contribution: this.planningBenefit,
      counterfactual_reasoning_depth: 0.5 + Math.random() * 0.5,
      scenario_detail_richness: this.avgSimulationVividness * 0.9,
      simulation_inference_accuracy: (this.avgSimulationVividness + this.avgReconstructionFidelity) / 2,
      adaptive_simulation_rate: this.simulationUtilityAverage
    };
  }

  resetEpisodicSimulationState(): void {
    this.totalSimulationsGenerated = 0;
    this.avgSimulationVividness = 0.6;
    this.avgReconstructionFidelity = 0.6;
    this.futureProjectionAccuracy = 0.6;
    this.counterfactualExplorationRate = 0;
    this.simulationUtilityAverage = 0.6;
    this.planningBenefit = 0.6;
  }
}

export {
  MentalSimulationSystem,
  ContextualReconstructionSystem,
  FutureProjectionSystem,
  CounterfactualThinkingSystem
} from './simulation-systems';
export * from './types';
