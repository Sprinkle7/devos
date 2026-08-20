import { StreamOfConsciousnessState, StreamOfConsciousnessMetrics } from './types';
import {
  ThoughtSequenceSystem,
  ConsciousnessFlowSystem,
  MindWanderingSystem,
  AttentionalTrackingSystem
} from './stream-systems';

export class StreamOfConsciousnessSystem {
  private thoughtSequence: ThoughtSequenceSystem;
  private consciousnessFlow: ConsciousnessFlowSystem;
  private mindWandering: MindWanderingSystem;
  private attentionalTracking: AttentionalTrackingSystem;

  private overallStreamFlow: number = 0.6;
  private thoughtSequenceCoherence: number = 0.6;
  private consciousnessFlowContinuity: number = 0.6;
  private mindWanderingLevel: number = 0.6;
  private attentionalFocusClarity: number = 0.6;
  private streamIntegrationLevel: number = 0.6;
  private consciousFlowVividness: number = 0.6;

  constructor() {
    this.thoughtSequence = new ThoughtSequenceSystem();
    this.consciousnessFlow = new ConsciousnessFlowSystem();
    this.mindWandering = new MindWanderingSystem();
    this.attentionalTracking = new AttentionalTrackingSystem();
  }

  registerThoughtSequence(thoughtContent: string, associativeLinks: string[], thoughtVividness: number, semanticCoherence: number, transitionSmoothness: number, attentionCapture: number): void {
    this.thoughtSequence.registerThoughtSequence(thoughtContent, associativeLinks, thoughtVividness, semanticCoherence, transitionSmoothness, attentionCapture);
    this.thoughtSequenceCoherence = this.thoughtSequence.getAverageSemanticCoherence();
  }

  registerConsciousnessFlow(contentType: string, flowContinuity: number, phenomenalPresence: number, contentIntegration: number, flowVelocity: number): void {
    this.consciousnessFlow.registerConsciousnessFlow(contentType, flowContinuity, phenomenalPresence, contentIntegration, flowVelocity);
    this.consciousnessFlowContinuity = this.consciousnessFlow.getAverageFlowContinuity();
  }

  registerMindWandering(wanderingFocus: string, taskDisengagement: number, mindWanderingIntensity: number, selfGeneratedThought: number, wanderingControl: number): void {
    this.mindWandering.registerMindWandering(wanderingFocus, taskDisengagement, mindWanderingIntensity, selfGeneratedThought, wanderingControl);
    this.mindWanderingLevel = (1 - this.mindWandering.getAverageMindWanderingControl());
  }

  registerAttentionalTracking(trackedElement: string, trackingStability: number, focusMaintenance: number, distractionResistance: number, trackingCoherence: number): void {
    this.attentionalTracking.registerAttentionalTracking(trackedElement, trackingStability, focusMaintenance, distractionResistance, trackingCoherence);
    this.attentionalFocusClarity = this.attentionalTracking.getAverageTrackingStability();
  }

  updateMetrics(): void {
    this.thoughtSequenceCoherence = this.thoughtSequence.getAverageSemanticCoherence();
    this.consciousnessFlowContinuity = this.consciousnessFlow.getAverageFlowContinuity();
    this.mindWanderingLevel = (1 - this.mindWandering.getAverageMindWanderingControl());
    this.attentionalFocusClarity = this.attentionalTracking.getAverageTrackingStability();
    this.overallStreamFlow = (this.thoughtSequenceCoherence + this.consciousnessFlowContinuity) / 2;
    this.streamIntegrationLevel = (this.thoughtSequenceCoherence + this.consciousnessFlowContinuity + this.attentionalFocusClarity) / 3;
    this.consciousFlowVividness = (this.overallStreamFlow + this.attentionalFocusClarity) / 2;
  }

  getStreamOfConsciousnessState(): StreamOfConsciousnessState {
    this.updateMetrics();
    return {
      overall_stream_flow: this.overallStreamFlow,
      thought_sequence_coherence: this.thoughtSequenceCoherence,
      consciousness_flow_continuity: this.consciousnessFlowContinuity,
      mind_wandering_level: this.mindWanderingLevel,
      attentional_focus_clarity: this.attentionalFocusClarity,
      stream_integration_level: this.streamIntegrationLevel,
      conscious_flow_vividness: this.consciousFlowVividness,
      timestamp_ms: Date.now()
    };
  }

  getStreamOfConsciousnessMetrics(): StreamOfConsciousnessMetrics {
    return {
      flow_coherence_quality: this.overallStreamFlow,
      thought_continuity_strength: this.thoughtSequenceCoherence,
      phenomenal_flow_richness: this.consciousFlowVividness,
      mind_wandering_control_strength: (1 - this.mindWanderingLevel),
      attentional_tracking_effectiveness: this.attentionalFocusClarity,
      stream_integration_coherence: this.streamIntegrationLevel,
      consciousness_stream_depth: (this.overallStreamFlow + this.thoughtSequenceCoherence + this.consciousnessFlowContinuity) / 3
    };
  }

  resetStreamOfConsciousnessState(): void {
    this.overallStreamFlow = 0.6;
    this.thoughtSequenceCoherence = 0.6;
    this.consciousnessFlowContinuity = 0.6;
    this.mindWanderingLevel = 0.6;
    this.attentionalFocusClarity = 0.6;
    this.streamIntegrationLevel = 0.6;
    this.consciousFlowVividness = 0.6;
  }
}

export {
  ThoughtSequenceSystem,
  ConsciousnessFlowSystem,
  MindWanderingSystem,
  AttentionalTrackingSystem
} from './stream-systems';
export * from './types';
