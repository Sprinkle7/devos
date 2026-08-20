import { SystemCoherence, CrossSystemBinding, TemporalIntegration, GlobalIntegrationWorkspace } from './types';

export class SystemCoherenceSystem {
  private coherences: Map<string, SystemCoherence> = new Map();
  private history: Array<{ timestamp: number; coherenceId: string }> = [];

  measureCoherence(systemPairs: string[], integrationStrength: number, coordinationQuality: number, synchronizationLevel: number, functionalUnity: number): SystemCoherence {
    const coherenceId = `coh_${Date.now()}`;
    const coherence: SystemCoherence = {
      coherence_id: coherenceId,
      system_pairs: systemPairs,
      integration_strength: Math.max(0, Math.min(1, integrationStrength)),
      coordination_quality: Math.max(0, Math.min(1, coordinationQuality)),
      synchronization_level: Math.max(0, Math.min(1, synchronizationLevel)),
      functional_unity: Math.max(0, Math.min(1, functionalUnity))
    };
    this.coherences.set(coherenceId, coherence);
    this.history.push({ timestamp: Date.now(), coherenceId });
    if (this.history.length > 500) this.history.shift();
    return coherence;
  }

  getCoherence(coherenceId: string): SystemCoherence | null {
    return this.coherences.get(coherenceId) || null;
  }

  getAverageCoherence(): number {
    if (this.coherences.size === 0) return 0.6;
    const total = Array.from(this.coherences.values()).reduce((sum, c) => sum + c.integration_strength, 0);
    return total / this.coherences.size;
  }
}

export class CrossSystemBindingSystem {
  private bindings: Map<string, CrossSystemBinding> = new Map();

  establishBinding(sourceSystem: string, targetSystem: string, bindingStrength: number, informationFlow: number, constraintSatisfaction: number, bindingStability: number): CrossSystemBinding {
    const bindingId = `bind_${Date.now()}`;
    const binding: CrossSystemBinding = {
      binding_id: bindingId,
      source_system: sourceSystem,
      target_system: targetSystem,
      binding_strength: Math.max(0, Math.min(1, bindingStrength)),
      information_flow: Math.max(0, Math.min(1, informationFlow)),
      constraint_satisfaction: Math.max(0, Math.min(1, constraintSatisfaction)),
      binding_stability: Math.max(0, Math.min(1, bindingStability))
    };
    this.bindings.set(bindingId, binding);
    return binding;
  }

  getBinding(bindingId: string): CrossSystemBinding | null {
    return this.bindings.get(bindingId) || null;
  }

  getAverageBindingStrength(): number {
    if (this.bindings.size === 0) return 0.6;
    const total = Array.from(this.bindings.values()).reduce((sum, b) => sum + b.binding_strength, 0);
    return total / this.bindings.size;
  }
}

export class TemporalIntegrationSystem {
  private integrations: Map<string, TemporalIntegration> = new Map();

  establishTemporalIntegration(timeWindowMs: number, temporalCoherence: number, eventOrdering: number, causalBinding: number, sequencePrediction: number): TemporalIntegration {
    const integrationId = `tint_${Date.now()}`;
    const integration: TemporalIntegration = {
      integration_id: integrationId,
      time_window_ms: timeWindowMs,
      temporal_coherence: Math.max(0, Math.min(1, temporalCoherence)),
      event_ordering: Math.max(0, Math.min(1, eventOrdering)),
      causal_binding: Math.max(0, Math.min(1, causalBinding)),
      sequence_prediction: Math.max(0, Math.min(1, sequencePrediction))
    };
    this.integrations.set(integrationId, integration);
    return integration;
  }

  getIntegration(integrationId: string): TemporalIntegration | null {
    return this.integrations.get(integrationId) || null;
  }

  getAverageTemporalCoherence(): number {
    if (this.integrations.size === 0) return 0.6;
    const total = Array.from(this.integrations.values()).reduce((sum, i) => sum + i.temporal_coherence, 0);
    return total / this.integrations.size;
  }
}

export class GlobalIntegrationWorkspaceSystem {
  private workspaces: Map<string, GlobalIntegrationWorkspace> = new Map();

  activateWorkspace(activeRepresentations: number, globalAvailability: number, broadcastCapacity: number, integrationBandwidth: number): GlobalIntegrationWorkspace {
    const workspaceId = `giw_${Date.now()}`;
    const workspace: GlobalIntegrationWorkspace = {
      workspace_id: workspaceId,
      active_representations: activeRepresentations,
      global_availability: Math.max(0, Math.min(1, globalAvailability)),
      broadcast_capacity: Math.max(0, Math.min(1, broadcastCapacity)),
      integration_bandwidth: Math.max(0, Math.min(1, integrationBandwidth))
    };
    this.workspaces.set(workspaceId, workspace);
    return workspace;
  }

  getWorkspace(workspaceId: string): GlobalIntegrationWorkspace | null {
    return this.workspaces.get(workspaceId) || null;
  }

  getAverageGlobalAvailability(): number {
    if (this.workspaces.size === 0) return 0.6;
    const total = Array.from(this.workspaces.values()).reduce((sum, w) => sum + w.global_availability, 0);
    return total / this.workspaces.size;
  }
}
