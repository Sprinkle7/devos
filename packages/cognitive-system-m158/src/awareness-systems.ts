import { PhenomenalContent, AwarenessQuality, SubjectiveExperience, ConsciousBinding } from './types';

export class PhenomenalContentSystem {
  private contents: Map<string, PhenomenalContent> = new Map();
  private history: Array<{ timestamp: number; contentId: string }> = [];

  registerPhenomenalContent(experienceModality: string, contentRichness: number, qualitativeCharacter: number, phenomenalIntensity: number, contentClarity: number): PhenomenalContent {
    const contentId = `pc_${Date.now()}`;
    const content: PhenomenalContent = {
      content_id: contentId,
      experience_modality: experienceModality,
      content_richness: Math.max(0, Math.min(1, contentRichness)),
      qualitative_character: Math.max(0, Math.min(1, qualitativeCharacter)),
      phenomenal_intensity: Math.max(0, Math.min(1, phenomenalIntensity)),
      content_clarity: Math.max(0, Math.min(1, contentClarity))
    };
    this.contents.set(contentId, content);
    this.history.push({ timestamp: Date.now(), contentId });
    if (this.history.length > 500) this.history.shift();
    return content;
  }

  getContent(contentId: string): PhenomenalContent | null {
    return this.contents.get(contentId) || null;
  }

  getAverageContentRichness(): number {
    if (this.contents.size === 0) return 0.6;
    const total = Array.from(this.contents.values()).reduce((sum, c) => sum + c.content_richness, 0);
    return total / this.contents.size;
  }
}

export class AwarenessQualitySystem {
  private qualities: Map<string, AwarenessQuality> = new Map();

  registerAwarenessQuality(awarenessMode: string, phenomenalConsciousness: number, accessConsciousness: number, selfAwarenessLevel: number, metaAwareness: number): AwarenessQuality {
    const qualityId = `aq_${Date.now()}`;
    const quality: AwarenessQuality = {
      quality_id: qualityId,
      awareness_mode: awarenessMode,
      phenomenal_consciousness: Math.max(0, Math.min(1, phenomenalConsciousness)),
      access_consciousness: Math.max(0, Math.min(1, accessConsciousness)),
      self_awareness_level: Math.max(0, Math.min(1, selfAwarenessLevel)),
      meta_awareness: Math.max(0, Math.min(1, metaAwareness))
    };
    this.qualities.set(qualityId, quality);
    return quality;
  }

  getQuality(qualityId: string): AwarenessQuality | null {
    return this.qualities.get(qualityId) || null;
  }

  getAveragePhenomenalConsciousness(): number {
    if (this.qualities.size === 0) return 0.6;
    const total = Array.from(this.qualities.values()).reduce((sum, q) => sum + q.phenomenal_consciousness, 0);
    return total / this.qualities.size;
  }
}

export class SubjectiveExperienceSystem {
  private experiences: Map<string, SubjectiveExperience> = new Map();

  registerSubjectiveExperience(experienceType: string, subjectiveQuality: number, emotionalTone: number, presenceIntensity: number, experienceCoherence: number): SubjectiveExperience {
    const experienceId = `se_${Date.now()}`;
    const experience: SubjectiveExperience = {
      experience_id: experienceId,
      experience_type: experienceType,
      subjective_quality: Math.max(0, Math.min(1, subjectiveQuality)),
      emotional_tone: Math.max(-1, Math.min(1, emotionalTone)),
      presence_intensity: Math.max(0, Math.min(1, presenceIntensity)),
      experience_coherence: Math.max(0, Math.min(1, experienceCoherence))
    };
    this.experiences.set(experienceId, experience);
    return experience;
  }

  getExperience(experienceId: string): SubjectiveExperience | null {
    return this.experiences.get(experienceId) || null;
  }

  getAverageSubjectiveQuality(): number {
    if (this.experiences.size === 0) return 0.6;
    const total = Array.from(this.experiences.values()).reduce((sum, e) => sum + e.subjective_quality, 0);
    return total / this.experiences.size;
  }
}

export class ConsciousBindingSystem {
  private bindings: Map<string, ConsciousBinding> = new Map();

  registerConsciousBinding(boundElements: string[], bindingStrength: number, unifiedRepresentation: number, phenomenalUnity: number, integratedExperience: number): ConsciousBinding {
    const bindingId = `cb_${Date.now()}`;
    const binding: ConsciousBinding = {
      binding_id: bindingId,
      bound_elements: boundElements,
      binding_strength: Math.max(0, Math.min(1, bindingStrength)),
      unified_representation: Math.max(0, Math.min(1, unifiedRepresentation)),
      phenomenal_unity: Math.max(0, Math.min(1, phenomenalUnity)),
      integrated_experience: Math.max(0, Math.min(1, integratedExperience))
    };
    this.bindings.set(bindingId, binding);
    return binding;
  }

  getBinding(bindingId: string): ConsciousBinding | null {
    return this.bindings.get(bindingId) || null;
  }

  getAverageBindingStrength(): number {
    if (this.bindings.size === 0) return 0.6;
    const total = Array.from(this.bindings.values()).reduce((sum, b) => sum + b.binding_strength, 0);
    return total / this.bindings.size;
  }
}
