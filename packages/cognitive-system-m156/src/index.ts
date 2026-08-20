import { TemporalConsciousnessState, TemporalConsciousnessMetrics } from './types';
import {
  TemporalPointSystem,
  TemporalFlowSystem,
  DurationExperienceSystem,
  TemporalAnticipationSystem
} from './temporal-systems';

export class TemporalConsciousnessSystem {
  private temporalPoint: TemporalPointSystem;
  private temporalFlow: TemporalFlowSystem;
  private durationExperience: DurationExperienceSystem;
  private temporalAnticipation: TemporalAnticipationSystem;

  private presentMomentClarity: number = 0.6;
  private temporalContinuityExperience: number = 0.6;
  private durationAwarenessLevel: number = 0.6;
  private temporalFlowCoherence: number = 0.6;
  private pastIntegrationStrength: number = 0.6;
  private futureAnticipationLevel: number = 0.6;
  private temporalSelfCoherence: number = 0.6;

  constructor() {
    this.temporalPoint = new TemporalPointSystem();
    this.temporalFlow = new TemporalFlowSystem();
    this.durationExperience = new DurationExperienceSystem();
    this.temporalAnticipation = new TemporalAnticipationSystem();
  }

  registerTemporalPoint(temporalLocation: number, durationAwareness: number, eventDistinctness: number, temporalPrecision: number, temporalSalience: number): void {
    this.temporalPoint.registerTemporalPoint(temporalLocation, durationAwareness, eventDistinctness, temporalPrecision, temporalSalience);
    this.presentMomentClarity = this.temporalPoint.getAverageTemporalPrecision();
  }

  registerTemporalFlow(flowDirection: string, temporalContinuity: number, flowMomentum: number, transitionSmoothness: number, temporalProgression: number): void {
    this.temporalFlow.registerTemporalFlow(flowDirection, temporalContinuity, flowMomentum, transitionSmoothness, temporalProgression);
    this.temporalFlowCoherence = this.temporalFlow.getAverageTemporalContinuity();
  }

  registerDurationExperience(durationCategory: string, durationAssessment: number, temporalEstimationAccuracy: number, subjectiveTimeSense: number, timeExpansionContraction: number): void {
    this.durationExperience.registerDurationExperience(durationCategory, durationAssessment, temporalEstimationAccuracy, subjectiveTimeSense, timeExpansionContraction);
    this.durationAwarenessLevel = this.durationExperience.getAverageDurationAccuracy();
  }

  registerTemporalAnticipation(futureHorizonMs: number, anticipatoryClarity: number, predictiveConfidence: number, temporalPlanningReadiness: number, futureOrientationStrength: number): void {
    this.temporalAnticipation.registerTemporalAnticipation(futureHorizonMs, anticipatoryClarity, predictiveConfidence, temporalPlanningReadiness, futureOrientationStrength);
    this.futureAnticipationLevel = this.temporalAnticipation.getAverageAnticipationStrength();
  }

  updateMetrics(): void {
    this.presentMomentClarity = this.temporalPoint.getAverageTemporalPrecision();
    this.temporalContinuityExperience = this.temporalFlow.getAverageTemporalContinuity();
    this.durationAwarenessLevel = this.durationExperience.getAverageDurationAccuracy();
    this.futureAnticipationLevel = this.temporalAnticipation.getAverageAnticipationStrength();
    this.pastIntegrationStrength = (this.temporalContinuityExperience + this.presentMomentClarity) / 2;
    this.temporalSelfCoherence = (this.presentMomentClarity + this.temporalContinuityExperience + this.futureAnticipationLevel) / 3;
  }

  getTemporalConsciousnessState(): TemporalConsciousnessState {
    this.updateMetrics();
    return {
      present_moment_clarity: this.presentMomentClarity,
      temporal_continuity_experience: this.temporalContinuityExperience,
      duration_awareness_level: this.durationAwarenessLevel,
      temporal_flow_coherence: this.temporalFlowCoherence,
      past_integration_strength: this.pastIntegrationStrength,
      future_anticipation_level: this.futureAnticipationLevel,
      temporal_self_coherence: this.temporalSelfCoherence,
      timestamp_ms: Date.now()
    };
  }

  getTemporalConsciousnessMetrics(): TemporalConsciousnessMetrics {
    return {
      temporal_presence_quality: this.presentMomentClarity,
      now_point_distinctness: this.presentMomentClarity,
      temporal_flow_stability: this.temporalFlowCoherence,
      duration_estimation_accuracy: this.durationAwarenessLevel,
      temporal_continuity_binding: this.temporalContinuityExperience,
      temporal_anticipation_strength: this.futureAnticipationLevel,
      temporal_consciousness_depth: this.temporalSelfCoherence
    };
  }

  resetTemporalConsciousnessState(): void {
    this.presentMomentClarity = 0.6;
    this.temporalContinuityExperience = 0.6;
    this.durationAwarenessLevel = 0.6;
    this.temporalFlowCoherence = 0.6;
    this.pastIntegrationStrength = 0.6;
    this.futureAnticipationLevel = 0.6;
    this.temporalSelfCoherence = 0.6;
  }
}

export {
  TemporalPointSystem,
  TemporalFlowSystem,
  DurationExperienceSystem,
  TemporalAnticipationSystem
} from './temporal-systems';
export * from './types';
