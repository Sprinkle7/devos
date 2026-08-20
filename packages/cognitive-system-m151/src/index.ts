import { ConsciousExperienceState, ConsciousExperienceMetrics } from './types';
import {
  PhenomenalExperienceSystem,
  WakefulnessStateSystem,
  BodyAwarenessSystem,
  AffectiveConsciousnessSystem,
  UnifiedConsciousnessSystem
} from './consciousness-systems';

export class ConsciousExperienceSystem {
  private phenomenal: PhenomenalExperienceSystem;
  private wakefulness: WakefulnessStateSystem;
  private bodyAwareness: BodyAwarenessSystem;
  private affectiveConsciousness: AffectiveConsciousnessSystem;
  private unified: UnifiedConsciousnessSystem;

  private totalExperiencesGenerated: number = 0;
  private avgPhenomenalIntensity: number = 0.6;
  private avgConsciousnessLevel: number = 0.7;
  private currentArousalState: string = 'awake';
  private bodyAwarenessLevel: number = 0.6;
  private affectiveConsciousnessDepth: number = 0.5;
  private unifiedConsciousnessQuality: number = 0.7;

  constructor() {
    this.phenomenal = new PhenomenalExperienceSystem();
    this.wakefulness = new WakefulnessStateSystem();
    this.bodyAwareness = new BodyAwarenessSystem();
    this.affectiveConsciousness = new AffectiveConsciousnessSystem();
    this.unified = new UnifiedConsciousnessSystem();
  }

  generateExperience(modality: string, intensity: number, richness: number, valence: number, unity: number): void {
    this.phenomenal.generateExperience(modality, intensity, richness, valence, unity);
    this.totalExperiencesGenerated++;
    this.avgPhenomenalIntensity = this.phenomenal.getAveragePhenomenalIntensity();
  }

  assessWakefulness(level: number, alertness: number, state: string, attention: number, clarity: number): void {
    this.wakefulness.assessWakefulness(level, alertness, state, attention, clarity);
    this.avgConsciousnessLevel = this.wakefulness.getAverageConsciousnessLevel();
    this.currentArousalState = state;
  }

  assessBodyAwareness(sensitivity: number, interoceptive: number, feltSense: number, presence: number): void {
    this.bodyAwareness.assessBodyAwareness(sensitivity, interoceptive, feltSense, presence);
    this.bodyAwarenessLevel = this.bodyAwareness.getAverageEmbodiedPresence();
  }

  assessAffectiveConsciousness(intensity: number, clarity: number, differentiation: number, richness: number): void {
    this.affectiveConsciousness.assessAffectiveConsciousness(intensity, clarity, differentiation, richness);
    this.affectiveConsciousnessDepth = this.affectiveConsciousness.getAverageAffectiveDepth();
  }

  assessUnifiedConsciousness(binding: number, coherence: number, totality: number, subject: number): void {
    this.unified.assessUnifiedConsciousness(binding, coherence, totality, subject);
    this.unifiedConsciousnessQuality = this.unified.getAverageUnityStrength();
  }

  updateMetrics(): void {
    this.avgPhenomenalIntensity = this.phenomenal.getAveragePhenomenalIntensity();
    this.avgConsciousnessLevel = this.wakefulness.getAverageConsciousnessLevel();
    this.bodyAwarenessLevel = this.bodyAwareness.getAverageEmbodiedPresence();
    this.affectiveConsciousnessDepth = this.affectiveConsciousness.getAverageAffectiveDepth();
    this.unifiedConsciousnessQuality = this.unified.getAverageUnityStrength();
  }

  getConsciousExperienceState(): ConsciousExperienceState {
    this.updateMetrics();
    return {
      total_experiences_generated: this.totalExperiencesGenerated,
      average_phenomenal_intensity: this.avgPhenomenalIntensity,
      average_consciousness_level: this.avgConsciousnessLevel,
      current_arousal_state: this.currentArousalState,
      body_awareness_level: this.bodyAwarenessLevel,
      affective_consciousness_depth: this.affectiveConsciousnessDepth,
      unified_consciousness_quality: this.unifiedConsciousnessQuality,
      timestamp_ms: Date.now()
    };
  }

  getConsciousExperienceMetrics(): ConsciousExperienceMetrics {
    return {
      phenomenal_richness: this.avgPhenomenalIntensity,
      consciousness_depth: this.avgConsciousnessLevel,
      wakefulness_stability: (this.avgConsciousnessLevel + 0.7) / 2,
      embodied_presence_strength: this.bodyAwarenessLevel,
      affective_consciousness_intensity: this.affectiveConsciousnessDepth,
      unified_consciousness_strength: this.unifiedConsciousnessQuality,
      experiential_continuity: (this.avgPhenomenalIntensity + this.unifiedConsciousnessQuality) / 2
    };
  }

  resetConsciousExperienceState(): void {
    this.totalExperiencesGenerated = 0;
    this.avgPhenomenalIntensity = 0.6;
    this.avgConsciousnessLevel = 0.7;
    this.currentArousalState = 'awake';
    this.bodyAwarenessLevel = 0.6;
    this.affectiveConsciousnessDepth = 0.5;
    this.unifiedConsciousnessQuality = 0.7;
  }
}

export {
  PhenomenalExperienceSystem,
  WakefulnessStateSystem,
  BodyAwarenessSystem,
  AffectiveConsciousnessSystem,
  UnifiedConsciousnessSystem
} from './consciousness-systems';
export * from './types';
