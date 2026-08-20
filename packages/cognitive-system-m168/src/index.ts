import { MentalStateReading, PerspectiveTaking, SocialInference, SocialCoordination, SocialCognitionState, SocialCognitionMetrics } from './types';

class MentalStateReadingSystem {
  private readings: Map<string, any> = new Map();
  registerMentalStateReading(targetAgent: string, beliefAttribution: number): any {
    const id = `msr_${Date.now()}`;
    const item = { id, target_agent: targetAgent, belief_attribution: Math.max(0, Math.min(1, beliefAttribution)), desire_inference: Math.max(0, Math.min(1, Math.random())), intention_recognition: Math.max(0, Math.min(1, Math.random())), emotional_understanding: Math.max(0, Math.min(1, Math.random())) };
    this.readings.set(id, item);
    return item;
  }
  getAverageMentalStateReading(): number {
    if (this.readings.size === 0) return 0.6;
    const total = Array.from(this.readings.values()).reduce((sum, r) => sum + r.belief_attribution, 0);
    return total / this.readings.size;
  }
}

class PerspectiveTakingSystem {
  private perspectives: Map<string, any> = new Map();
  registerPerspectiveTaking(perspectiveType: string, viewpointAdoption: number): any {
    const id = `pt_${Date.now()}`;
    const item = { id, perspective_type: perspectiveType, viewpoint_adoption: Math.max(0, Math.min(1, viewpointAdoption)), cognitive_distance_bridging: Math.max(0, Math.min(1, Math.random())), empathetic_accuracy: Math.max(0, Math.min(1, Math.random())), perspective_integration: Math.max(0, Math.min(1, Math.random())) };
    this.perspectives.set(id, item);
    return item;
  }
  getAveragePerspectiveTaking(): number {
    if (this.perspectives.size === 0) return 0.6;
    const total = Array.from(this.perspectives.values()).reduce((sum, p) => sum + p.viewpoint_adoption, 0);
    return total / this.perspectives.size;
  }
}

class SocialInferenceSystem {
  private inferences: Map<string, any> = new Map();
  registerSocialInference(inferenceType: string, socialPredictionAccuracy: number): any {
    const id = `si_${Date.now()}`;
    const item = { id, inference_type: inferenceType, social_prediction_accuracy: Math.max(0, Math.min(1, socialPredictionAccuracy)), behavioral_attribution: Math.max(0, Math.min(1, Math.random())), social_reasoning_quality: Math.max(0, Math.min(1, Math.random())), interaction_understanding: Math.max(0, Math.min(1, Math.random())) };
    this.inferences.set(id, item);
    return item;
  }
  getAverageSocialInference(): number {
    if (this.inferences.size === 0) return 0.6;
    const total = Array.from(this.inferences.values()).reduce((sum, i) => sum + i.social_prediction_accuracy, 0);
    return total / this.inferences.size;
  }
}

class SocialCoordinationSystem {
  private coordinations: Map<string, any> = new Map();
  registerSocialCoordination(domain: string, intentionalAlignment: number): any {
    const id = `sc_${Date.now()}`;
    const item = { id, coordination_domain: domain, intentional_alignment: Math.max(0, Math.min(1, intentionalAlignment)), mutual_understanding: Math.max(0, Math.min(1, Math.random())), cooperative_efficiency: Math.max(0, Math.min(1, Math.random())), coordination_smoothness: Math.max(0, Math.min(1, Math.random())) };
    this.coordinations.set(id, item);
    return item;
  }
  getAverageSocialCoordination(): number {
    if (this.coordinations.size === 0) return 0.6;
    const total = Array.from(this.coordinations.values()).reduce((sum, c) => sum + c.intentional_alignment, 0);
    return total / this.coordinations.size;
  }
}

export class SocialCognitionTheoryOfMindSystem {
  private mentalStateReading: MentalStateReadingSystem;
  private perspectiveTaking: PerspectiveTakingSystem;
  private socialInference: SocialInferenceSystem;
  private socialCoordination: SocialCoordinationSystem;
  private mentalStateReadingAccuracy: number = 0.6;
  private perspectiveTakingCapacity: number = 0.6;
  private socialInferenceQuality: number = 0.6;
  private socialCoordinationEffectiveness: number = 0.6;

  constructor() {
    this.mentalStateReading = new MentalStateReadingSystem();
    this.perspectiveTaking = new PerspectiveTakingSystem();
    this.socialInference = new SocialInferenceSystem();
    this.socialCoordination = new SocialCoordinationSystem();
  }

  registerMentalStateReading(targetAgent: string, beliefAttribution: number): void {
    this.mentalStateReading.registerMentalStateReading(targetAgent, beliefAttribution);
    this.mentalStateReadingAccuracy = this.mentalStateReading.getAverageMentalStateReading();
  }

  registerPerspectiveTaking(perspectiveType: string, viewpointAdoption: number): void {
    this.perspectiveTaking.registerPerspectiveTaking(perspectiveType, viewpointAdoption);
    this.perspectiveTakingCapacity = this.perspectiveTaking.getAveragePerspectiveTaking();
  }

  registerSocialInference(inferenceType: string, socialPredictionAccuracy: number): void {
    this.socialInference.registerSocialInference(inferenceType, socialPredictionAccuracy);
    this.socialInferenceQuality = this.socialInference.getAverageSocialInference();
  }

  registerSocialCoordination(domain: string, intentionalAlignment: number): void {
    this.socialCoordination.registerSocialCoordination(domain, intentionalAlignment);
    this.socialCoordinationEffectiveness = this.socialCoordination.getAverageSocialCoordination();
  }

  updateMetrics(): void {
    this.mentalStateReadingAccuracy = this.mentalStateReading.getAverageMentalStateReading();
    this.perspectiveTakingCapacity = this.perspectiveTaking.getAveragePerspectiveTaking();
    this.socialInferenceQuality = this.socialInference.getAverageSocialInference();
    this.socialCoordinationEffectiveness = this.socialCoordination.getAverageSocialCoordination();
  }

  getSocialCognitionState(): SocialCognitionState {
    this.updateMetrics();
    return {
      mental_state_reading_accuracy: this.mentalStateReadingAccuracy,
      perspective_taking_capacity: this.perspectiveTakingCapacity,
      social_inference_quality: this.socialInferenceQuality,
      social_coordination_effectiveness: this.socialCoordinationEffectiveness,
      theory_of_mind_sophistication: (this.mentalStateReadingAccuracy + this.perspectiveTakingCapacity + this.socialInferenceQuality) / 3,
      social_understanding_depth: (this.mentalStateReadingAccuracy + this.socialInferenceQuality) / 2,
      social_cognition_integration: (this.mentalStateReadingAccuracy + this.perspectiveTakingCapacity + this.socialInferenceQuality + this.socialCoordinationEffectiveness) / 4,
      timestamp_ms: Date.now()
    };
  }

  getSocialCognitionMetrics(): SocialCognitionMetrics {
    return {
      mental_state_attribution_accuracy: this.mentalStateReadingAccuracy,
      perspective_taking_flexibility: this.perspectiveTakingCapacity,
      social_prediction_accuracy: this.socialInferenceQuality,
      behavioral_understanding_quality: this.socialInferenceQuality,
      empathetic_accuracy_rate: this.perspectiveTakingCapacity,
      social_coordination_efficiency: this.socialCoordinationEffectiveness,
      overall_theory_of_mind_strength: (this.mentalStateReadingAccuracy + this.perspectiveTakingCapacity + this.socialInferenceQuality + this.socialCoordinationEffectiveness) / 4
    };
  }
}

export * from './types';
