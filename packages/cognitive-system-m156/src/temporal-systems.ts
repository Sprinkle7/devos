import { TemporalPoint, TemporalFlow, DurationExperience, TemporalAnticipation } from './types';

export class TemporalPointSystem {
  private points: Map<string, TemporalPoint> = new Map();
  private history: Array<{ timestamp: number; pointId: string }> = [];

  registerTemporalPoint(temporalLocation: number, durationAwareness: number, eventDistinctness: number, temporalPrecision: number, temporalSalience: number): TemporalPoint {
    const pointId = `tp_${Date.now()}`;
    const point: TemporalPoint = {
      point_id: pointId,
      temporal_location: temporalLocation,
      duration_awareness: Math.max(0, Math.min(1, durationAwareness)),
      event_distinctness: Math.max(0, Math.min(1, eventDistinctness)),
      temporal_precision: Math.max(0, Math.min(1, temporalPrecision)),
      temporal_salience: Math.max(0, Math.min(1, temporalSalience))
    };
    this.points.set(pointId, point);
    this.history.push({ timestamp: Date.now(), pointId });
    if (this.history.length > 500) this.history.shift();
    return point;
  }

  getPoint(pointId: string): TemporalPoint | null {
    return this.points.get(pointId) || null;
  }

  getAverageTemporalPrecision(): number {
    if (this.points.size === 0) return 0.6;
    const total = Array.from(this.points.values()).reduce((sum, p) => sum + p.temporal_precision, 0);
    return total / this.points.size;
  }
}

export class TemporalFlowSystem {
  private flows: Map<string, TemporalFlow> = new Map();

  registerTemporalFlow(flowDirection: string, temporalContinuity: number, flowMomentum: number, transitionSmoothness: number, temporalProgression: number): TemporalFlow {
    const flowId = `tf_${Date.now()}`;
    const flow: TemporalFlow = {
      flow_id: flowId,
      flow_direction: flowDirection,
      temporal_continuity: Math.max(0, Math.min(1, temporalContinuity)),
      flow_momentum: Math.max(0, Math.min(1, flowMomentum)),
      transition_smoothness: Math.max(0, Math.min(1, transitionSmoothness)),
      temporal_progression: Math.max(0, Math.min(1, temporalProgression))
    };
    this.flows.set(flowId, flow);
    return flow;
  }

  getFlow(flowId: string): TemporalFlow | null {
    return this.flows.get(flowId) || null;
  }

  getAverageTemporalContinuity(): number {
    if (this.flows.size === 0) return 0.6;
    const total = Array.from(this.flows.values()).reduce((sum, f) => sum + f.temporal_continuity, 0);
    return total / this.flows.size;
  }
}

export class DurationExperienceSystem {
  private durations: Map<string, DurationExperience> = new Map();

  registerDurationExperience(durationCategory: string, durationAssessment: number, temporalEstimationAccuracy: number, subjectiveTimeSense: number, timeExpansionContraction: number): DurationExperience {
    const durationId = `dur_${Date.now()}`;
    const duration: DurationExperience = {
      duration_id: durationId,
      duration_category: durationCategory,
      duration_assessment: Math.max(0, Math.min(1, durationAssessment)),
      temporal_estimation_accuracy: Math.max(0, Math.min(1, temporalEstimationAccuracy)),
      subjective_time_sense: Math.max(0, Math.min(1, subjectiveTimeSense)),
      time_expansion_contraction: Math.max(0, Math.min(1, timeExpansionContraction))
    };
    this.durations.set(durationId, duration);
    return duration;
  }

  getDuration(durationId: string): DurationExperience | null {
    return this.durations.get(durationId) || null;
  }

  getAverageDurationAccuracy(): number {
    if (this.durations.size === 0) return 0.6;
    const total = Array.from(this.durations.values()).reduce((sum, d) => sum + d.temporal_estimation_accuracy, 0);
    return total / this.durations.size;
  }
}

export class TemporalAnticipationSystem {
  private anticipations: Map<string, TemporalAnticipation> = new Map();

  registerTemporalAnticipation(futureHorizonMs: number, anticipatoryClarity: number, predictiveConfidence: number, temporalPlanningReadiness: number, futureOrientationStrength: number): TemporalAnticipation {
    const anticipationId = `ant_${Date.now()}`;
    const anticipation: TemporalAnticipation = {
      anticipation_id: anticipationId,
      future_horizon_ms: futureHorizonMs,
      anticipatory_clarity: Math.max(0, Math.min(1, anticipatoryClarity)),
      predictive_confidence: Math.max(0, Math.min(1, predictiveConfidence)),
      temporal_planning_readiness: Math.max(0, Math.min(1, temporalPlanningReadiness)),
      future_orientation_strength: Math.max(0, Math.min(1, futureOrientationStrength))
    };
    this.anticipations.set(anticipationId, anticipation);
    return anticipation;
  }

  getAnticipation(anticipationId: string): TemporalAnticipation | null {
    return this.anticipations.get(anticipationId) || null;
  }

  getAverageAnticipationStrength(): number {
    if (this.anticipations.size === 0) return 0.6;
    const total = Array.from(this.anticipations.values()).reduce((sum, a) => sum + a.anticipatory_clarity, 0);
    return total / this.anticipations.size;
  }
}
