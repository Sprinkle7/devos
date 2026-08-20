import { MetacognitionState, MetacognitionMetrics } from './types';
import {
  SelfAwarenessSystem,
  MetacognitiveMonitoringSystem,
  ReflectiveProcessingSystem,
  MindwanderingMetacognitionSystem,
  AffectiveMetacognitionSystem
} from './metacognition-systems';

export class MetacognitionSelfReflectionSystem {
  private selfAwareness: SelfAwarenessSystem;
  private monitoring: MetacognitiveMonitoringSystem;
  private reflection: ReflectiveProcessingSystem;
  private mindwandering: MindwanderingMetacognitionSystem;
  private affective: AffectiveMetacognitionSystem;

  private currentSelfAwarenessLevel: number = 0.6;
  private avgMonitoringAccuracy: number = 0.6;
  private avgReflectionDepth: number = 0.5;
  private mindwanderingFrequency: number = 0;
  private emotionalMetacognitionLevel: number = 0.5;
  private overallMetacognitiveAbility: number = 0.6;

  constructor() {
    this.selfAwareness = new SelfAwarenessSystem();
    this.monitoring = new MetacognitiveMonitoringSystem();
    this.reflection = new ReflectiveProcessingSystem();
    this.mindwandering = new MindwanderingMetacognitionSystem();
    this.affective = new AffectiveMetacognitionSystem();
  }

  assessSelfAwareness(type: string, recognition: number, introspection: number, perspective: number, coherence: number): void {
    this.selfAwareness.assessSelfAwareness(type, recognition, introspection, perspective, coherence);
    this.currentSelfAwarenessLevel = this.selfAwareness.getAverageSelfAwareness();
  }

  monitorProcess(processType: string, accuracy: number, calibration: number, errorDetection: number, strategy: number): void {
    this.monitoring.monitorProcess(processType, accuracy, calibration, errorDetection, strategy);
    this.avgMonitoringAccuracy = this.monitoring.getAverageMonitoringAccuracy();
  }

  reflect(type: string, depth: number, insight: number, meaning: number, transformative: number): void {
    this.reflection.reflect(type, depth, insight, meaning, transformative);
    this.avgReflectionDepth = this.reflection.getAverageReflectionDepth();
  }

  detectMindwandering(deviation: number, quality: string, lag: number, efficiency: number): void {
    this.mindwandering.detectMindwandering(deviation, quality, lag, efficiency);
    this.mindwanderingFrequency = this.mindwandering.getMindwanderingFrequency();
  }

  assessAffectiveMetacognition(awareness: number, regulation: number, empathy: number, integration: number): void {
    this.affective.assessAffectiveMetacognition(awareness, regulation, empathy, integration);
    this.emotionalMetacognitionLevel = this.affective.getAverageAffectiveMetacognition();
  }

  updateMetrics(): void {
    this.currentSelfAwarenessLevel = this.selfAwareness.getAverageSelfAwareness();
    this.avgMonitoringAccuracy = this.monitoring.getAverageMonitoringAccuracy();
    this.avgReflectionDepth = this.reflection.getAverageReflectionDepth();
    this.mindwanderingFrequency = this.mindwandering.getMindwanderingFrequency();
    this.emotionalMetacognitionLevel = this.affective.getAverageAffectiveMetacognition();
    this.overallMetacognitiveAbility = (this.currentSelfAwarenessLevel + this.avgMonitoringAccuracy + this.avgReflectionDepth) / 3;
  }

  getMetacognitionState(): MetacognitionState {
    this.updateMetrics();
    return {
      current_self_awareness_level: this.currentSelfAwarenessLevel,
      average_monitoring_accuracy: this.avgMonitoringAccuracy,
      average_reflection_depth: this.avgReflectionDepth,
      mindwandering_frequency: this.mindwanderingFrequency,
      emotional_metacognition_level: this.emotionalMetacognitionLevel,
      overall_metacognitive_ability: this.overallMetacognitiveAbility,
      timestamp_ms: Date.now()
    };
  }

  getMetacognitionMetrics(): MetacognitionMetrics {
    return {
      metacognitive_accuracy: this.avgMonitoringAccuracy,
      self_reflection_quality: this.avgReflectionDepth,
      insight_generation_rate: this.avgReflectionDepth * 0.8,
      error_correction_rate: this.avgMonitoringAccuracy * 0.9,
      affective_metacognition_level: this.emotionalMetacognitionLevel,
      cognitive_flexibility_awareness: this.currentSelfAwarenessLevel * 0.8,
      self_improvement_trajectory: this.overallMetacognitiveAbility * (0.7 + Math.random() * 0.3)
    };
  }

  resetMetacognitionState(): void {
    this.currentSelfAwarenessLevel = 0.6;
    this.avgMonitoringAccuracy = 0.6;
    this.avgReflectionDepth = 0.5;
    this.mindwanderingFrequency = 0;
    this.emotionalMetacognitionLevel = 0.5;
    this.overallMetacognitiveAbility = 0.6;
  }
}

export {
  SelfAwarenessSystem,
  MetacognitiveMonitoringSystem,
  ReflectiveProcessingSystem,
  MindwanderingMetacognitionSystem,
  AffectiveMetacognitionSystem
} from './metacognition-systems';
export * from './types';
