import { PhenomenalAwarenessState, PhenomenalAwarenessMetrics } from './types';
import {
  PhenomenalContentSystem,
  AwarenessQualitySystem,
  SubjectiveExperienceSystem,
  ConsciousBindingSystem
} from './awareness-systems';

export class PhenomenalAwarenessSystem {
  private phenomenalContent: PhenomenalContentSystem;
  private awarenessQuality: AwarenessQualitySystem;
  private subjectiveExperience: SubjectiveExperienceSystem;
  private consciousBinding: ConsciousBindingSystem;

  private overallPhenomenalConsciousness: number = 0.6;
  private phenomenalContentRichness: number = 0.6;
  private awarenessQualityLevel: number = 0.6;
  private subjectiveExperienceVividness: number = 0.6;
  private consciousBindingStrength: number = 0.6;
  private phenomenalClarity: number = 0.6;
  private awarenessDepth: number = 0.6;

  constructor() {
    this.phenomenalContent = new PhenomenalContentSystem();
    this.awarenessQuality = new AwarenessQualitySystem();
    this.subjectiveExperience = new SubjectiveExperienceSystem();
    this.consciousBinding = new ConsciousBindingSystem();
  }

  registerPhenomenalContent(experienceModality: string, contentRichness: number, qualitativeCharacter: number, phenomenalIntensity: number, contentClarity: number): void {
    this.phenomenalContent.registerPhenomenalContent(experienceModality, contentRichness, qualitativeCharacter, phenomenalIntensity, contentClarity);
    this.phenomenalContentRichness = this.phenomenalContent.getAverageContentRichness();
  }

  registerAwarenessQuality(awarenessMode: string, phenomenalConsciousness: number, accessConsciousness: number, selfAwarenessLevel: number, metaAwareness: number): void {
    this.awarenessQuality.registerAwarenessQuality(awarenessMode, phenomenalConsciousness, accessConsciousness, selfAwarenessLevel, metaAwareness);
    this.awarenessQualityLevel = this.awarenessQuality.getAveragePhenomenalConsciousness();
  }

  registerSubjectiveExperience(experienceType: string, subjectiveQuality: number, emotionalTone: number, presenceIntensity: number, experienceCoherence: number): void {
    this.subjectiveExperience.registerSubjectiveExperience(experienceType, subjectiveQuality, emotionalTone, presenceIntensity, experienceCoherence);
    this.subjectiveExperienceVividness = this.subjectiveExperience.getAverageSubjectiveQuality();
  }

  registerConsciousBinding(boundElements: string[], bindingStrength: number, unifiedRepresentation: number, phenomenalUnity: number, integratedExperience: number): void {
    this.consciousBinding.registerConsciousBinding(boundElements, bindingStrength, unifiedRepresentation, phenomenalUnity, integratedExperience);
    this.consciousBindingStrength = this.consciousBinding.getAverageBindingStrength();
  }

  updateMetrics(): void {
    this.phenomenalContentRichness = this.phenomenalContent.getAverageContentRichness();
    this.awarenessQualityLevel = this.awarenessQuality.getAveragePhenomenalConsciousness();
    this.subjectiveExperienceVividness = this.subjectiveExperience.getAverageSubjectiveQuality();
    this.consciousBindingStrength = this.consciousBinding.getAverageBindingStrength();
    this.overallPhenomenalConsciousness = (this.awarenessQualityLevel + this.phenomenalContentRichness) / 2;
    this.phenomenalClarity = (this.phenomenalContentRichness + this.awarenessQualityLevel) / 2;
    this.awarenessDepth = (this.overallPhenomenalConsciousness + this.consciousBindingStrength + this.subjectiveExperienceVividness) / 3;
  }

  getPhenomenalAwarenessState(): PhenomenalAwarenessState {
    this.updateMetrics();
    return {
      overall_phenomenal_consciousness: this.overallPhenomenalConsciousness,
      phenomenal_content_richness: this.phenomenalContentRichness,
      awareness_quality_level: this.awarenessQualityLevel,
      subjective_experience_vividness: this.subjectiveExperienceVividness,
      conscious_binding_strength: this.consciousBindingStrength,
      phenomenal_clarity: this.phenomenalClarity,
      awareness_depth: this.awarenessDepth,
      timestamp_ms: Date.now()
    };
  }

  getPhenomenalAwarenessMetrics(): PhenomenalAwarenessMetrics {
    return {
      phenomenal_consciousness_richness: this.overallPhenomenalConsciousness,
      content_quality_depth: this.phenomenalContentRichness,
      awareness_mode_differentiation: this.awarenessQualityLevel,
      subjective_experience_quality: this.subjectiveExperienceVividness,
      binding_coherence_strength: this.consciousBindingStrength,
      phenomenal_clarity_level: this.phenomenalClarity,
      overall_phenomenal_depth: this.awarenessDepth
    };
  }

  resetPhenomenalAwarenessState(): void {
    this.overallPhenomenalConsciousness = 0.6;
    this.phenomenalContentRichness = 0.6;
    this.awarenessQualityLevel = 0.6;
    this.subjectiveExperienceVividness = 0.6;
    this.consciousBindingStrength = 0.6;
    this.phenomenalClarity = 0.6;
    this.awarenessDepth = 0.6;
  }
}

export {
  PhenomenalContentSystem,
  AwarenessQualitySystem,
  SubjectiveExperienceSystem,
  ConsciousBindingSystem
} from './awareness-systems';
export * from './types';
