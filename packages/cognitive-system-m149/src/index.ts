import { AttentionRegulationState, AttentionRegulationMetrics } from './types';
import {
  AttentionalControlSystem,
  ConflictMonitoringSystem,
  FocusMaintenanceRegulationSystem,
  AlertnessModulationSystem
} from './regulation-systems';

export class AttentionRegulationSystem {
  private control: AttentionalControlSystem;
  private conflict: ConflictMonitoringSystem;
  private maintenance: FocusMaintenanceRegulationSystem;
  private alertness: AlertnessModulationSystem;

  private avgControlEffectiveness: number = 0.6;
  private conflictDetectionRate: number = 0;
  private avgFocusStability: number = 0.6;
  private avgDistractionResistance: number = 0.6;
  private alertnessLevel: number = 0.6;
  private regulatoryCapacity: number = 0.6;
  private cognitiveControlInvestment: number = 0.5;

  constructor() {
    this.control = new AttentionalControlSystem();
    this.conflict = new ConflictMonitoringSystem();
    this.maintenance = new FocusMaintenanceRegulationSystem();
    this.alertness = new AlertnessModulationSystem();
  }

  controlAttention(stimulus: string, inhibition: number, alignment: number, response: number): void {
    this.control.controlAttention(stimulus, inhibition, alignment, response);
    this.avgControlEffectiveness = this.control.getAverageControlEffectiveness();
  }

  detectConflict(type: string, level: number, error: number, adaptation: number): void {
    this.conflict.detectConflict(type, level, error, adaptation);
    this.conflictDetectionRate = this.conflict.getConflictDetectionRate();
  }

  maintainFocus(task: string, duration: number, stability: number, resistance: number, effort: number): void {
    this.maintenance.maintainFocus(task, duration, stability, resistance, effort);
    this.avgFocusStability = this.maintenance.getAverageFocusStability();
    this.avgDistractionResistance = resistance;
  }

  modulateAertness(baseline: number, responsiveness: number, fatigue: number, arousal: number): void {
    this.alertness.modulateAertness(baseline, responsiveness, fatigue, arousal);
    this.alertnessLevel = this.alertness.getAverageAlertnessLevel();
  }

  updateMetrics(): void {
    this.avgControlEffectiveness = this.control.getAverageControlEffectiveness();
    this.avgFocusStability = this.maintenance.getAverageFocusStability();
    this.alertnessLevel = this.alertness.getAverageAlertnessLevel();
  }

  getAttentionRegulationState(): AttentionRegulationState {
    this.updateMetrics();
    return {
      average_control_effectiveness: this.avgControlEffectiveness,
      conflict_detection_rate: this.conflictDetectionRate,
      average_focus_stability: this.avgFocusStability,
      average_distraction_resistance: this.avgDistractionResistance,
      alertness_level: this.alertnessLevel,
      regulatory_capacity: this.regulatoryCapacity,
      cognitive_control_investment: this.cognitiveControlInvestment,
      timestamp_ms: Date.now()
    };
  }

  getAttentionRegulationMetrics(): AttentionRegulationMetrics {
    return {
      attention_regulation_efficiency: (this.avgControlEffectiveness + this.avgFocusStability) / 2,
      conflict_resolution_capability: this.avgControlEffectiveness,
      sustained_attention_quality: this.avgFocusStability,
      interference_suppression_strength: this.avgDistractionResistance,
      adaptive_regulation_rate: this.regulatoryCapacity * 0.8,
      fatigue_management_effectiveness: this.alertnessLevel * 0.7,
      goal_directed_attention_rate: (this.avgControlEffectiveness + this.avgFocusStability) / 2
    };
  }

  resetAttentionRegulationState(): void {
    this.avgControlEffectiveness = 0.6;
    this.conflictDetectionRate = 0;
    this.avgFocusStability = 0.6;
    this.avgDistractionResistance = 0.6;
    this.alertnessLevel = 0.6;
    this.regulatoryCapacity = 0.6;
    this.cognitiveControlInvestment = 0.5;
  }
}

export {
  AttentionalControlSystem,
  ConflictMonitoringSystem,
  FocusMaintenanceRegulationSystem,
  AlertnessModulationSystem
} from './regulation-systems';
export * from './types';
