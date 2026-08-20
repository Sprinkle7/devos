import {
  SelfAwareness,
  MetacognitiveMonitoring,
  ReflectiveProcessing,
  MindwanderingMetacognition,
  AffectiveMetacognition
} from './types';

export class SelfAwarenessSystem {
  private awarenesses: Map<string, SelfAwareness> = new Map();
  private history: Array<{ timestamp: number; awarenessId: string }> = [];

  assessSelfAwareness(type: string, recognition: number, introspection: number, perspective: number, coherence: number): SelfAwareness {
    const awarenessId = `aware_${Date.now()}`;
    const awareness: SelfAwareness = {
      awareness_id: awarenessId,
      awareness_type: type,
      self_recognition_level: Math.max(0, Math.min(1, recognition)),
      introspective_depth: Math.max(0, Math.min(1, introspection)),
      perspective_taking: Math.max(0, Math.min(1, perspective)),
      identity_coherence: Math.max(0, Math.min(1, coherence))
    };
    this.awarenesses.set(awarenessId, awareness);
    this.history.push({ timestamp: Date.now(), awarenessId });
    if (this.history.length > 500) this.history.shift();
    return awareness;
  }

  getAwareness(awarenessId: string): SelfAwareness | null {
    return this.awarenesses.get(awarenessId) || null;
  }

  getAverageSelfAwareness(): number {
    if (this.awarenesses.size === 0) return 0.6;
    const total = Array.from(this.awarenesses.values()).reduce((sum, a) => sum + (a.self_recognition_level + a.introspective_depth) / 2, 0);
    return total / this.awarenesses.size;
  }
}

export class MetacognitiveMonitoringSystem {
  private monitorings: Map<string, MetacognitiveMonitoring> = new Map();

  monitorProcess(processType: string, accuracy: number, calibration: number, errorDetection: number, strategyAwareness: number): MetacognitiveMonitoring {
    const monitoringId = `mon_${Date.now()}`;
    const monitoring: MetacognitiveMonitoring = {
      monitoring_id: monitoringId,
      process_type: processType,
      monitoring_accuracy: Math.max(0, Math.min(1, accuracy)),
      confidence_calibration: Math.max(0, Math.min(1, calibration)),
      error_detection_rate: Math.max(0, Math.min(1, errorDetection)),
      strategy_awareness: Math.max(0, Math.min(1, strategyAwareness))
    };
    this.monitorings.set(monitoringId, monitoring);
    return monitoring;
  }

  getMonitoring(monitoringId: string): MetacognitiveMonitoring | null {
    return this.monitorings.get(monitoringId) || null;
  }

  getAverageMonitoringAccuracy(): number {
    if (this.monitorings.size === 0) return 0.6;
    const total = Array.from(this.monitorings.values()).reduce((sum, m) => sum + m.monitoring_accuracy, 0);
    return total / this.monitorings.size;
  }
}

export class ReflectiveProcessingSystem {
  private reflections: Map<string, ReflectiveProcessing> = new Map();

  reflect(type: string, depth: number, insight: number, meaning: number, transformative: number): ReflectiveProcessing {
    const reflectionId = `refl_${Date.now()}`;
    const reflection: ReflectiveProcessing = {
      reflection_id: reflectionId,
      reflection_type: type,
      depth_of_processing: Math.max(0, Math.min(1, depth)),
      insight_generation: Math.max(0, Math.min(1, insight)),
      meaning_making: Math.max(0, Math.min(1, meaning)),
      transformative_potential: Math.max(0, Math.min(1, transformative))
    };
    this.reflections.set(reflectionId, reflection);
    return reflection;
  }

  getReflection(reflectionId: string): ReflectiveProcessing | null {
    return this.reflections.get(reflectionId) || null;
  }

  getAverageReflectionDepth(): number {
    if (this.reflections.size === 0) return 0.5;
    const total = Array.from(this.reflections.values()).reduce((sum, r) => sum + r.depth_of_processing, 0);
    return total / this.reflections.size;
  }
}

export class MindwanderingMetacognitionSystem {
  private wanderings: Map<string, MindwanderingMetacognition> = new Map();

  detectMindwandering(focusDeviation: number, quality: string, detectionLag: number, refocusEfficiency: number): MindwanderingMetacognition {
    const wanderingId = `wan_${Date.now()}`;
    const wandering: MindwanderingMetacognition = {
      wandering_id: wanderingId,
      task_focus_deviation: Math.max(0, Math.min(1, focusDeviation)),
      mindwandering_quality: quality,
      self_detection_lag: detectionLag,
      refocus_efficiency: Math.max(0, Math.min(1, refocusEfficiency))
    };
    this.wanderings.set(wanderingId, wandering);
    return wandering;
  }

  getWandering(wanderingId: string): MindwanderingMetacognition | null {
    return this.wanderings.get(wanderingId) || null;
  }

  getMindwanderingFrequency(): number {
    return this.wanderings.size;
  }
}

export class AffectiveMetacognitionSystem {
  private affectives: Map<string, AffectiveMetacognition> = new Map();

  assessAffectiveMetacognition(awareness: number, regulation: number, empathy: number, integration: number): AffectiveMetacognition {
    const affectiveId = `aff_${Date.now()}`;
    const affective: AffectiveMetacognition = {
      affective_id: affectiveId,
      emotional_awareness: Math.max(0, Math.min(1, awareness)),
      emotion_regulation_understanding: Math.max(0, Math.min(1, regulation)),
      empathic_accuracy: Math.max(0, Math.min(1, empathy)),
      affective_integration: Math.max(0, Math.min(1, integration))
    };
    this.affectives.set(affectiveId, affective);
    return affective;
  }

  getAffectiveMetacognition(affectiveId: string): AffectiveMetacognition | null {
    return this.affectives.get(affectiveId) || null;
  }

  getAverageAffectiveMetacognition(): number {
    if (this.affectives.size === 0) return 0.5;
    const total = Array.from(this.affectives.values()).reduce((sum, a) => sum + a.emotional_awareness, 0);
    return total / this.affectives.size;
  }
}
