import { ImplicitLearningProcess, UnconsciousProcessing, HabitFormation, PreconsciousActivation } from './types';

export class ImplicitLearningSystem {
  private processes: Map<string, ImplicitLearningProcess> = new Map();
  private history: Array<{ timestamp: number; processId: string }> = [];

  registerImplicitLearning(learningDomain: string, patternExtraction: number, statisticalLearning: number, unconsciousAcquisition: number, implicitSkillDevelopment: number): ImplicitLearningProcess {
    const processId = `il_${Date.now()}`;
    const process: ImplicitLearningProcess = {
      process_id: processId,
      learning_domain: learningDomain,
      pattern_extraction: Math.max(0, Math.min(1, patternExtraction)),
      statistical_learning: Math.max(0, Math.min(1, statisticalLearning)),
      unconscious_acquisition: Math.max(0, Math.min(1, unconsciousAcquisition)),
      implicit_skill_development: Math.max(0, Math.min(1, implicitSkillDevelopment))
    };
    this.processes.set(processId, process);
    this.history.push({ timestamp: Date.now(), processId });
    if (this.history.length > 500) this.history.shift();
    return process;
  }

  getProcess(processId: string): ImplicitLearningProcess | null {
    return this.processes.get(processId) || null;
  }

  getAveragePatternLearning(): number {
    if (this.processes.size === 0) return 0.6;
    const total = Array.from(this.processes.values()).reduce((sum, p) => sum + p.pattern_extraction, 0);
    return total / this.processes.size;
  }
}

export class UnconsciousProcessingSystem {
  private processings: Map<string, UnconsciousProcessing> = new Map();

  registerUnconsciousProcessing(processingType: string, automaticActivation: number, processingEfficiency: number, unconsciousInference: number, implicitRepresentation: number): UnconsciousProcessing {
    const processingId = `up_${Date.now()}`;
    const processing: UnconsciousProcessing = {
      processing_id: processingId,
      processing_type: processingType,
      automatic_activation: Math.max(0, Math.min(1, automaticActivation)),
      processing_efficiency: Math.max(0, Math.min(1, processingEfficiency)),
      unconscious_inference: Math.max(0, Math.min(1, unconsciousInference)),
      implicit_representation: Math.max(0, Math.min(1, implicitRepresentation))
    };
    this.processings.set(processingId, processing);
    return processing;
  }

  getProcessing(processingId: string): UnconsciousProcessing | null {
    return this.processings.get(processingId) || null;
  }

  getAverageProcessingEfficiency(): number {
    if (this.processings.size === 0) return 0.6;
    const total = Array.from(this.processings.values()).reduce((sum, p) => sum + p.processing_efficiency, 0);
    return total / this.processings.size;
  }
}

export class HabitFormationSystem {
  private habits: Map<string, HabitFormation> = new Map();

  registerHabitFormation(behaviorType: string, automaticityLevel: number, habitStrength: number, contextualCueing: number, behavioralFluency: number): HabitFormation {
    const habitId = `hf_${Date.now()}`;
    const habit: HabitFormation = {
      habit_id: habitId,
      behavior_type: behaviorType,
      automaticity_level: Math.max(0, Math.min(1, automaticityLevel)),
      habit_strength: Math.max(0, Math.min(1, habitStrength)),
      contextual_cueing: Math.max(0, Math.min(1, contextualCueing)),
      behavioral_fluency: Math.max(0, Math.min(1, behavioralFluency))
    };
    this.habits.set(habitId, habit);
    return habit;
  }

  getHabit(habitId: string): HabitFormation | null {
    return this.habits.get(habitId) || null;
  }

  getAverageHabitStrength(): number {
    if (this.habits.size === 0) return 0.6;
    const total = Array.from(this.habits.values()).reduce((sum, h) => sum + h.habit_strength, 0);
    return total / this.habits.size;
  }
}

export class PreconsciousActivationSystem {
  private activations: Map<string, PreconsciousActivation> = new Map();

  registerPreconsciousActivation(stimulusType: string, primingStrength: number, semanticActivation: number, affectivePriming: number, activationPersistence: number): PreconsciousActivation {
    const activationId = `pa_${Date.now()}`;
    const activation: PreconsciousActivation = {
      activation_id: activationId,
      stimulus_type: stimulusType,
      priming_strength: Math.max(0, Math.min(1, primingStrength)),
      semantic_activation: Math.max(0, Math.min(1, semanticActivation)),
      affective_priming: Math.max(0, Math.min(1, affectivePriming)),
      activation_persistence: Math.max(0, Math.min(1, activationPersistence))
    };
    this.activations.set(activationId, activation);
    return activation;
  }

  getActivation(activationId: string): PreconsciousActivation | null {
    return this.activations.get(activationId) || null;
  }

  getAveragePrimingStrength(): number {
    if (this.activations.size === 0) return 0.6;
    const total = Array.from(this.activations.values()).reduce((sum, a) => sum + a.priming_strength, 0);
    return total / this.activations.size;
  }
}
