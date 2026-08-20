import { ThoughtSequence, ConsciousnessFlow, MindWandering, AttentionalTracking } from './types';

export class ThoughtSequenceSystem {
  private sequences: Map<string, ThoughtSequence> = new Map();
  private history: Array<{ timestamp: number; sequenceId: string }> = [];

  registerThoughtSequence(thoughtContent: string, associativeLinks: string[], thoughtVividness: number, semanticCoherence: number, transitionSmoothness: number, attentionCapture: number): ThoughtSequence {
    const sequenceId = `ts_${Date.now()}`;
    const sequence: ThoughtSequence = {
      sequence_id: sequenceId,
      thought_content: thoughtContent,
      associative_links: associativeLinks,
      thought_vividness: Math.max(0, Math.min(1, thoughtVividness)),
      semantic_coherence: Math.max(0, Math.min(1, semanticCoherence)),
      transition_smoothness: Math.max(0, Math.min(1, transitionSmoothness)),
      attention_capture: Math.max(0, Math.min(1, attentionCapture))
    };
    this.sequences.set(sequenceId, sequence);
    this.history.push({ timestamp: Date.now(), sequenceId });
    if (this.history.length > 500) this.history.shift();
    return sequence;
  }

  getSequence(sequenceId: string): ThoughtSequence | null {
    return this.sequences.get(sequenceId) || null;
  }

  getAverageSemanticCoherence(): number {
    if (this.sequences.size === 0) return 0.6;
    const total = Array.from(this.sequences.values()).reduce((sum, s) => sum + s.semantic_coherence, 0);
    return total / this.sequences.size;
  }
}

export class ConsciousnessFlowSystem {
  private flows: Map<string, ConsciousnessFlow> = new Map();

  registerConsciousnessFlow(contentType: string, flowContinuity: number, phenomenalPresence: number, contentIntegration: number, flowVelocity: number): ConsciousnessFlow {
    const flowId = `cf_${Date.now()}`;
    const flow: ConsciousnessFlow = {
      flow_id: flowId,
      content_type: contentType,
      flow_continuity: Math.max(0, Math.min(1, flowContinuity)),
      phenomenal_presence: Math.max(0, Math.min(1, phenomenalPresence)),
      content_integration: Math.max(0, Math.min(1, contentIntegration)),
      flow_velocity: Math.max(0, Math.min(1, flowVelocity))
    };
    this.flows.set(flowId, flow);
    return flow;
  }

  getFlow(flowId: string): ConsciousnessFlow | null {
    return this.flows.get(flowId) || null;
  }

  getAverageFlowContinuity(): number {
    if (this.flows.size === 0) return 0.6;
    const total = Array.from(this.flows.values()).reduce((sum, f) => sum + f.flow_continuity, 0);
    return total / this.flows.size;
  }
}

export class MindWanderingSystem {
  private wanderings: Map<string, MindWandering> = new Map();

  registerMindWandering(wanderingFocus: string, taskDisengagement: number, mindWanderingIntensity: number, selfGeneratedThought: number, wanderingControl: number): MindWandering {
    const wanderingId = `mw_${Date.now()}`;
    const wandering: MindWandering = {
      wandering_id: wanderingId,
      wandering_focus: wanderingFocus,
      task_disengagement: Math.max(0, Math.min(1, taskDisengagement)),
      mind_wandering_intensity: Math.max(0, Math.min(1, mindWanderingIntensity)),
      self_generated_thought: Math.max(0, Math.min(1, selfGeneratedThought)),
      wandering_control: Math.max(0, Math.min(1, wanderingControl))
    };
    this.wanderings.set(wanderingId, wandering);
    return wandering;
  }

  getWandering(wanderingId: string): MindWandering | null {
    return this.wanderings.get(wanderingId) || null;
  }

  getAverageMindWanderingControl(): number {
    if (this.wanderings.size === 0) return 0.6;
    const total = Array.from(this.wanderings.values()).reduce((sum, w) => sum + w.wandering_control, 0);
    return total / this.wanderings.size;
  }
}

export class AttentionalTrackingSystem {
  private trackings: Map<string, AttentionalTracking> = new Map();

  registerAttentionalTracking(trackedElement: string, trackingStability: number, focusMaintenance: number, distractionResistance: number, trackingCoherence: number): AttentionalTracking {
    const trackingId = `at_${Date.now()}`;
    const tracking: AttentionalTracking = {
      tracking_id: trackingId,
      tracked_element: trackedElement,
      tracking_stability: Math.max(0, Math.min(1, trackingStability)),
      focus_maintenance: Math.max(0, Math.min(1, focusMaintenance)),
      distraction_resistance: Math.max(0, Math.min(1, distractionResistance)),
      tracking_coherence: Math.max(0, Math.min(1, trackingCoherence))
    };
    this.trackings.set(trackingId, tracking);
    return tracking;
  }

  getTracking(trackingId: string): AttentionalTracking | null {
    return this.trackings.get(trackingId) || null;
  }

  getAverageTrackingStability(): number {
    if (this.trackings.size === 0) return 0.6;
    const total = Array.from(this.trackings.values()).reduce((sum, t) => sum + t.tracking_stability, 0);
    return total / this.trackings.size;
  }
}
