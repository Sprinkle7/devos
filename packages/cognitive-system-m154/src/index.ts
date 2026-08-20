import { CoherenceState, CoherenceMetrics } from './types';
import {
  SystemCoherenceSystem,
  CrossSystemBindingSystem,
  TemporalIntegrationSystem,
  GlobalIntegrationWorkspaceSystem
} from './coherence-systems';

export class IntegrationCoherenceSystem {
  private systemCoherence: SystemCoherenceSystem;
  private crossSystemBinding: CrossSystemBindingSystem;
  private temporalIntegration: TemporalIntegrationSystem;
  private globalWorkspace: GlobalIntegrationWorkspaceSystem;

  private overallSystemCoherence: number = 0.6;
  private crossSystemBindingStrength: number = 0.6;
  private temporalIntegrationLevel: number = 0.6;
  private globalWorkspaceActivation: number = 0.6;
  private integrationStability: number = 0.6;
  private unifiedExperienceLevel: number = 0.6;

  constructor() {
    this.systemCoherence = new SystemCoherenceSystem();
    this.crossSystemBinding = new CrossSystemBindingSystem();
    this.temporalIntegration = new TemporalIntegrationSystem();
    this.globalWorkspace = new GlobalIntegrationWorkspaceSystem();
  }

  measureSystemCoherence(systemPairs: string[], integrationStrength: number, coordinationQuality: number, synchronizationLevel: number, functionalUnity: number): void {
    this.systemCoherence.measureCoherence(systemPairs, integrationStrength, coordinationQuality, synchronizationLevel, functionalUnity);
    this.overallSystemCoherence = this.systemCoherence.getAverageCoherence();
  }

  establishCrossSystemBinding(sourceSystem: string, targetSystem: string, bindingStrength: number, informationFlow: number, constraintSatisfaction: number, bindingStability: number): void {
    this.crossSystemBinding.establishBinding(sourceSystem, targetSystem, bindingStrength, informationFlow, constraintSatisfaction, bindingStability);
    this.crossSystemBindingStrength = this.crossSystemBinding.getAverageBindingStrength();
  }

  establishTemporalIntegration(timeWindowMs: number, temporalCoherence: number, eventOrdering: number, causalBinding: number, sequencePrediction: number): void {
    this.temporalIntegration.establishTemporalIntegration(timeWindowMs, temporalCoherence, eventOrdering, causalBinding, sequencePrediction);
    this.temporalIntegrationLevel = this.temporalIntegration.getAverageTemporalCoherence();
  }

  activateGlobalWorkspace(activeRepresentations: number, globalAvailability: number, broadcastCapacity: number, integrationBandwidth: number): void {
    this.globalWorkspace.activateWorkspace(activeRepresentations, globalAvailability, broadcastCapacity, integrationBandwidth);
    this.globalWorkspaceActivation = this.globalWorkspace.getAverageGlobalAvailability();
  }

  updateMetrics(): void {
    this.overallSystemCoherence = this.systemCoherence.getAverageCoherence();
    this.crossSystemBindingStrength = this.crossSystemBinding.getAverageBindingStrength();
    this.temporalIntegrationLevel = this.temporalIntegration.getAverageTemporalCoherence();
    this.globalWorkspaceActivation = this.globalWorkspace.getAverageGlobalAvailability();
    this.integrationStability = (this.overallSystemCoherence + this.crossSystemBindingStrength + this.temporalIntegrationLevel) / 3;
    this.unifiedExperienceLevel = (this.overallSystemCoherence + this.globalWorkspaceActivation) / 2;
  }

  getCoherenceState(): CoherenceState {
    this.updateMetrics();
    return {
      overall_system_coherence: this.overallSystemCoherence,
      cross_system_binding_strength: this.crossSystemBindingStrength,
      temporal_integration_level: this.temporalIntegrationLevel,
      global_workspace_activation: this.globalWorkspaceActivation,
      integration_stability: this.integrationStability,
      unified_experience_level: this.unifiedExperienceLevel,
      timestamp_ms: Date.now()
    };
  }

  getCoherenceMetrics(): CoherenceMetrics {
    return {
      system_coordination_quality: this.overallSystemCoherence,
      integration_efficiency: (this.crossSystemBindingStrength + this.temporalIntegrationLevel) / 2,
      binding_coherence: this.crossSystemBindingStrength,
      temporal_synchronization: this.temporalIntegrationLevel,
      global_workspace_effectiveness: this.globalWorkspaceActivation,
      unified_consciousness_strength: this.unifiedExperienceLevel,
      integration_resilience: this.integrationStability
    };
  }

  resetCoherenceState(): void {
    this.overallSystemCoherence = 0.6;
    this.crossSystemBindingStrength = 0.6;
    this.temporalIntegrationLevel = 0.6;
    this.globalWorkspaceActivation = 0.6;
    this.integrationStability = 0.6;
    this.unifiedExperienceLevel = 0.6;
  }
}

export {
  SystemCoherenceSystem,
  CrossSystemBindingSystem,
  TemporalIntegrationSystem,
  GlobalIntegrationWorkspaceSystem
} from './coherence-systems';
export * from './types';
