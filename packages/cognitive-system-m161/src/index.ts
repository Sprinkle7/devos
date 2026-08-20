import { ImplicitLearningState, ImplicitLearningMetrics } from './types';
import {
  ImplicitLearningSystem,
  UnconsciousProcessingSystem,
  HabitFormationSystem,
  PreconsciousActivationSystem
} from './implicit-systems';

export class ImplicitLearningUnconsciousSystem {
  private implicitLearning: ImplicitLearningSystem;
  private unconsciousProcessing: UnconsciousProcessingSystem;
  private habitFormation: HabitFormationSystem;
  private preconsciousActivation: PreconsciousActivationSystem;

  private totalImplicitAcquisitions: number = 0;
  private patternLearningStrength: number = 0.6;
  private unconsciousProcessingDepth: number = 0.6;
  private habitFormationLevel: number = 0.6;
  private preconsciousActivationStrength: number = 0.6;
  private implicitPerformanceLevel: number = 0.6;
  private unconsciousSkillDevelopment: number = 0.6;

  constructor() {
    this.implicitLearning = new ImplicitLearningSystem();
    this.unconsciousProcessing = new UnconsciousProcessingSystem();
    this.habitFormation = new HabitFormationSystem();
    this.preconsciousActivation = new PreconsciousActivationSystem();
  }

  registerImplicitLearning(learningDomain: string, patternExtraction: number, statisticalLearning: number, unconsciousAcquisition: number, implicitSkillDevelopment: number): void {
    this.implicitLearning.registerImplicitLearning(learningDomain, patternExtraction, statisticalLearning, unconsciousAcquisition, implicitSkillDevelopment);
    this.totalImplicitAcquisitions++;
    this.patternLearningStrength = this.implicitLearning.getAveragePatternLearning();
  }

  registerUnconsciousProcessing(processingType: string, automaticActivation: number, processingEfficiency: number, unconsciousInference: number, implicitRepresentation: number): void {
    this.unconsciousProcessing.registerUnconsciousProcessing(processingType, automaticActivation, processingEfficiency, unconsciousInference, implicitRepresentation);
    this.unconsciousProcessingDepth = this.unconsciousProcessing.getAverageProcessingEfficiency();
  }

  registerHabitFormation(behaviorType: string, automaticityLevel: number, habitStrength: number, contextualCueing: number, behavioralFluency: number): void {
    this.habitFormation.registerHabitFormation(behaviorType, automaticityLevel, habitStrength, contextualCueing, behavioralFluency);
    this.habitFormationLevel = this.habitFormation.getAverageHabitStrength();
  }

  registerPreconsciousActivation(stimulusType: string, primingStrength: number, semanticActivation: number, affectivePriming: number, activationPersistence: number): void {
    this.preconsciousActivation.registerPreconsciousActivation(stimulusType, primingStrength, semanticActivation, affectivePriming, activationPersistence);
    this.preconsciousActivationStrength = this.preconsciousActivation.getAveragePrimingStrength();
  }

  updateMetrics(): void {
    this.patternLearningStrength = this.implicitLearning.getAveragePatternLearning();
    this.unconsciousProcessingDepth = this.unconsciousProcessing.getAverageProcessingEfficiency();
    this.habitFormationLevel = this.habitFormation.getAverageHabitStrength();
    this.preconsciousActivationStrength = this.preconsciousActivation.getAveragePrimingStrength();
    this.implicitPerformanceLevel = (this.patternLearningStrength + this.habitFormationLevel) / 2;
    this.unconsciousSkillDevelopment = (this.patternLearningStrength + this.unconsciousProcessingDepth) / 2;
  }

  getImplicitLearningState(): ImplicitLearningState {
    this.updateMetrics();
    return {
      total_implicit_acquisitions: this.totalImplicitAcquisitions,
      pattern_learning_strength: this.patternLearningStrength,
      unconscious_processing_depth: this.unconsciousProcessingDepth,
      habit_formation_level: this.habitFormationLevel,
      preconscious_activation_strength: this.preconsciousActivationStrength,
      implicit_performance_level: this.implicitPerformanceLevel,
      unconscious_skill_development: this.unconsciousSkillDevelopment,
      timestamp_ms: Date.now()
    };
  }

  getImplicitLearningMetrics(): ImplicitLearningMetrics {
    return {
      implicit_learning_rate: (this.patternLearningStrength + Math.min(1, this.totalImplicitAcquisitions / 100)) / 2,
      pattern_recognition_capacity: this.patternLearningStrength,
      unconscious_processing_efficiency: this.unconsciousProcessingDepth,
      habit_formation_speed: this.habitFormationLevel,
      preconscious_sensitivity: this.preconsciousActivationStrength,
      implicit_skill_acquisition: this.implicitPerformanceLevel,
      unconscious_learning_depth: this.unconsciousSkillDevelopment
    };
  }

  resetImplicitLearningState(): void {
    this.totalImplicitAcquisitions = 0;
    this.patternLearningStrength = 0.6;
    this.unconsciousProcessingDepth = 0.6;
    this.habitFormationLevel = 0.6;
    this.preconsciousActivationStrength = 0.6;
    this.implicitPerformanceLevel = 0.6;
    this.unconsciousSkillDevelopment = 0.6;
  }
}

export {
  ImplicitLearningSystem,
  UnconsciousProcessingSystem,
  HabitFormationSystem,
  PreconsciousActivationSystem
} from './implicit-systems';
export * from './types';
