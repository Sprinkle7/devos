import {
  PhenomenalExperience,
  WakefulnessState,
  BodyAwareness,
  AffectiveConsciousness,
  UnifiedConsciousness
} from './types';

export class PhenomenalExperienceSystem {
  private experiences: Map<string, PhenomenalExperience> = new Map();
  private history: Array<{ timestamp: number; experienceId: string }> = [];

  generateExperience(modality: string, intensity: number, richness: number, valence: number, unity: number): PhenomenalExperience {
    const experienceId = `exp_${Date.now()}`;
    const experience: PhenomenalExperience = {
      experience_id: experienceId,
      modality: modality,
      qualia_intensity: Math.max(0, Math.min(1, intensity)),
      sensory_richness: Math.max(0, Math.min(1, richness)),
      affect_valence: Math.max(-1, Math.min(1, valence)),
      unity_of_experience: Math.max(0, Math.min(1, unity))
    };
    this.experiences.set(experienceId, experience);
    this.history.push({ timestamp: Date.now(), experienceId });
    if (this.history.length > 500) this.history.shift();
    return experience;
  }

  getExperience(experienceId: string): PhenomenalExperience | null {
    return this.experiences.get(experienceId) || null;
  }

  getAveragePhenomenalIntensity(): number {
    if (this.experiences.size === 0) return 0.6;
    const total = Array.from(this.experiences.values()).reduce((sum, e) => sum + e.qualia_intensity, 0);
    return total / this.experiences.size;
  }
}

export class WakefulnessStateSystem {
  private states: Map<string, WakefulnessState> = new Map();

  assessWakefulness(level: number, alertness: number, state: string, attentionSpan: number, clarity: number): WakefulnessState {
    const stateId = `wake_${Date.now()}`;
    const wakefulness: WakefulnessState = {
      state_id: stateId,
      consciousness_level: Math.max(0, Math.min(1, level)),
      alertness: Math.max(0, Math.min(1, alertness)),
      arousal_state: state,
      attention_span: Math.max(0, Math.min(1, attentionSpan)),
      clarity_of_mind: Math.max(0, Math.min(1, clarity))
    };
    this.states.set(stateId, wakefulness);
    return wakefulness;
  }

  getWakefulness(stateId: string): WakefulnessState | null {
    return this.states.get(stateId) || null;
  }

  getAverageConsciousnessLevel(): number {
    if (this.states.size === 0) return 0.7;
    const total = Array.from(this.states.values()).reduce((sum, s) => sum + s.consciousness_level, 0);
    return total / this.states.size;
  }
}

export class BodyAwarenessSystem {
  private awarenesses: Map<string, BodyAwareness> = new Map();

  assessBodyAwareness(sensitivity: number, interoceptive: number, feltSense: number, presence: number): BodyAwareness {
    const awarenessId = `body_${Date.now()}`;
    const awareness: BodyAwareness = {
      awareness_id: awarenessId,
      somatic_sensitivity: Math.max(0, Math.min(1, sensitivity)),
      interoceptive_accuracy: Math.max(0, Math.min(1, interoceptive)),
      felt_sense_quality: Math.max(0, Math.min(1, feltSense)),
      embodied_presence: Math.max(0, Math.min(1, presence))
    };
    this.awarenesses.set(awarenessId, awareness);
    return awareness;
  }

  getBodyAwareness(awarenessId: string): BodyAwareness | null {
    return this.awarenesses.get(awarenessId) || null;
  }

  getAverageEmbodiedPresence(): number {
    if (this.awarenesses.size === 0) return 0.6;
    const total = Array.from(this.awarenesses.values()).reduce((sum, a) => sum + a.embodied_presence, 0);
    return total / this.awarenesses.size;
  }
}

export class AffectiveConsciousnessSystem {
  private affects: Map<string, AffectiveConsciousness> = new Map();

  assessAffectiveConsciousness(intensity: number, clarity: number, differentiation: number, richness: number): AffectiveConsciousness {
    const affectId = `aff_${Date.now()}`;
    const affect: AffectiveConsciousness = {
      affect_id: affectId,
      emotional_intensity: Math.max(0, Math.min(1, intensity)),
      emotional_clarity: Math.max(0, Math.min(1, clarity)),
      affective_differentiation: Math.max(0, Math.min(1, differentiation)),
      felt_quality_richness: Math.max(0, Math.min(1, richness))
    };
    this.affects.set(affectId, affect);
    return affect;
  }

  getAffectiveConsciousness(affectId: string): AffectiveConsciousness | null {
    return this.affects.get(affectId) || null;
  }

  getAverageAffectiveDepth(): number {
    if (this.affects.size === 0) return 0.5;
    const total = Array.from(this.affects.values()).reduce((sum, a) => sum + a.emotional_intensity, 0);
    return total / this.affects.size;
  }
}

export class UnifiedConsciousnessSystem {
  private unified: Map<string, UnifiedConsciousness> = new Map();

  assessUnifiedConsciousness(binding: number, coherence: number, totality: number, subject: number): UnifiedConsciousness {
    const unityId = `unity_${Date.now()}`;
    const unity: UnifiedConsciousness = {
      unity_id: unityId,
      binding_strength: Math.max(0, Math.min(1, binding)),
      coherence_level: Math.max(0, Math.min(1, coherence)),
      integrated_totality: Math.max(0, Math.min(1, totality)),
      singular_subject_quality: Math.max(0, Math.min(1, subject))
    };
    this.unified.set(unityId, unity);
    return unity;
  }

  getUnifiedConsciousness(unityId: string): UnifiedConsciousness | null {
    return this.unified.get(unityId) || null;
  }

  getAverageUnityStrength(): number {
    if (this.unified.size === 0) return 0.7;
    const total = Array.from(this.unified.values()).reduce((sum, u) => sum + (u.binding_strength + u.coherence_level) / 2, 0);
    return total / this.unified.size;
  }
}
