import { CognitiveUnificationState, CognitiveUnificationMetrics } from './types';
import {
  ProcessIntegrationSystem,
  CognitiveBindingSystem,
  UnifiedWorkspaceSystem,
  GlobalConsciousStateSystem
} from './unification-systems';

export class CognitiveIntegrationUnificationSystem {
  private processIntegration: ProcessIntegrationSystem;
  private cognitiveBinding: CognitiveBindingSystem;
  private unifiedWorkspace: UnifiedWorkspaceSystem;
  private globalConsciousState: GlobalConsciousStateSystem;

  private overallIntegrationLevel: number = 0.6;
  private processCoordinationQuality: number = 0.6;
  private cognitiveBindingStrength: number = 0.6;
  private unifiedWorkspaceCoherence: number = 0.6;
  private globalConsciousnessUnity: number = 0.6;
  private integratedProcessingEfficiency: number = 0.6;
  private unificationStability: number = 0.6;

  constructor() {
    this.processIntegration = new ProcessIntegrationSystem();
    this.cognitiveBinding = new CognitiveBindingSystem();
    this.unifiedWorkspace = new UnifiedWorkspaceSystem();
    this.globalConsciousState = new GlobalConsciousStateSystem();
  }

  integrateProcesses(processTypes: string[], integrationQuality: number, processCoordination: number, informationTransfer: number, integrationStability: number): void {
    this.processIntegration.integrateProcesses(processTypes, integrationQuality, processCoordination, informationTransfer, integrationStability);
    this.processCoordinationQuality = this.processIntegration.getAverageIntegrationQuality();
  }

  bindCognitiveProcesses(boundProcesses: string[], bindingCoherence: number, unifiedOperation: number, constraintSatisfaction: number, bindingRobustness: number): void {
    this.cognitiveBinding.bindCognitiveProcesses(boundProcesses, bindingCoherence, unifiedOperation, constraintSatisfaction, bindingRobustness);
    this.cognitiveBindingStrength = this.cognitiveBinding.getAverageBindingCoherence();
  }

  activateUnifiedWorkspace(workspaceType: string, capacityUtilization: number, informationAccessibility: number, workspaceCoherence: number, unificationEffectiveness: number): void {
    this.unifiedWorkspace.activateUnifiedWorkspace(workspaceType, capacityUtilization, informationAccessibility, workspaceCoherence, unificationEffectiveness);
    this.unifiedWorkspaceCoherence = this.unifiedWorkspace.getAverageWorkspaceCoherence();
  }

  updateGlobalState(integrationLevel: number, consciousnessUnity: number, coordinatedProcessing: number, stateStability: number): void {
    this.globalConsciousState.updateGlobalState(integrationLevel, consciousnessUnity, coordinatedProcessing, stateStability);
    this.globalConsciousnessUnity = this.globalConsciousState.getAverageConsciousnessUnity();
  }

  updateMetrics(): void {
    this.processCoordinationQuality = this.processIntegration.getAverageIntegrationQuality();
    this.cognitiveBindingStrength = this.cognitiveBinding.getAverageBindingCoherence();
    this.unifiedWorkspaceCoherence = this.unifiedWorkspace.getAverageWorkspaceCoherence();
    this.globalConsciousnessUnity = this.globalConsciousState.getAverageConsciousnessUnity();
    this.overallIntegrationLevel = (this.processCoordinationQuality + this.cognitiveBindingStrength + this.unifiedWorkspaceCoherence) / 3;
    this.integratedProcessingEfficiency = (this.processCoordinationQuality + this.unifiedWorkspaceCoherence) / 2;
    this.unificationStability = (this.cognitiveBindingStrength + this.globalConsciousnessUnity) / 2;
  }

  getCognitiveUnificationState(): CognitiveUnificationState {
    this.updateMetrics();
    return {
      overall_integration_level: this.overallIntegrationLevel,
      process_coordination_quality: this.processCoordinationQuality,
      cognitive_binding_strength: this.cognitiveBindingStrength,
      unified_workspace_coherence: this.unifiedWorkspaceCoherence,
      global_consciousness_unity: this.globalConsciousnessUnity,
      integrated_processing_efficiency: this.integratedProcessingEfficiency,
      unification_stability: this.unificationStability,
      timestamp_ms: Date.now()
    };
  }

  getCognitiveUnificationMetrics(): CognitiveUnificationMetrics {
    return {
      process_integration_quality: this.processCoordinationQuality,
      cognitive_binding_coherence: this.cognitiveBindingStrength,
      workspace_unification_strength: this.unifiedWorkspaceCoherence,
      consciousness_integration_depth: this.globalConsciousnessUnity,
      coordinated_processing_efficiency: this.integratedProcessingEfficiency,
      unified_function_coherence: (this.processCoordinationQuality + this.cognitiveBindingStrength) / 2,
      overall_unification_strength: this.overallIntegrationLevel
    };
  }

  resetCognitiveUnificationState(): void {
    this.overallIntegrationLevel = 0.6;
    this.processCoordinationQuality = 0.6;
    this.cognitiveBindingStrength = 0.6;
    this.unifiedWorkspaceCoherence = 0.6;
    this.globalConsciousnessUnity = 0.6;
    this.integratedProcessingEfficiency = 0.6;
    this.unificationStability = 0.6;
  }
}

export {
  ProcessIntegrationSystem,
  CognitiveBindingSystem,
  UnifiedWorkspaceSystem,
  GlobalConsciousStateSystem
} from './unification-systems';
export * from './types';
