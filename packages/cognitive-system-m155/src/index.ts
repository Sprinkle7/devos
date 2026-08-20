import { NarrativeSelfState, NarrativeSelfMetrics } from './types';
import {
  IdentityNarrativeSystem,
  SelfMemoryIntegrationSystem,
  PersonalValueStructureSystem,
  LifeStoryConstructionSystem
} from './narrative-systems';

export class NarrativeSelfConstructionSystem {
  private identityNarrative: IdentityNarrativeSystem;
  private selfMemory: SelfMemoryIntegrationSystem;
  private personalValues: PersonalValueStructureSystem;
  private lifeStory: LifeStoryConstructionSystem;

  private overallNarrativeCoherence: number = 0.6;
  private selfConceptStability: number = 0.6;
  private autobiographicalMemoryIntegration: number = 0.6;
  private identityNarrativeStrength: number = 0.6;
  private valueSystemCoherence: number = 0.6;
  private lifeStoryCoherence: number = 0.6;
  private temporalContinuity: number = 0.6;

  constructor() {
    this.identityNarrative = new IdentityNarrativeSystem();
    this.selfMemory = new SelfMemoryIntegrationSystem();
    this.personalValues = new PersonalValueStructureSystem();
    this.lifeStory = new LifeStoryConstructionSystem();
  }

  constructIdentityNarrative(selfConcept: string, narrativeCoherence: number, autobiographicalContinuity: number, identityStability: number, narrativeIntegration: number): void {
    this.identityNarrative.constructNarrative(selfConcept, narrativeCoherence, autobiographicalContinuity, identityStability, narrativeIntegration);
    this.overallNarrativeCoherence = this.identityNarrative.getAverageNarrativeCoherence();
    this.selfConceptStability = identityStability;
  }

  integrateMemory(memoryType: string, episodicContribution: number, semanticCoherence: number, selfRelevance: number, narrativeBinding: number): void {
    this.selfMemory.integrateMemory(memoryType, episodicContribution, semanticCoherence, selfRelevance, narrativeBinding);
    this.autobiographicalMemoryIntegration = this.selfMemory.getAverageMemoryIntegration();
  }

  registerPersonalValue(valueDomain: string, valueCentrality: number, identityCongruence: number, behavioralAlignment: number, motivationalStrength: number): void {
    this.personalValues.registerValue(valueDomain, valueCentrality, identityCongruence, behavioralAlignment, motivationalStrength);
    this.valueSystemCoherence = this.personalValues.getAverageValueCentrality();
  }

  constructLifeStory(narrativeArc: string, thematicCoherence: number, causalExplanation: number, futureProjection: number, meaningConstruction: number): void {
    this.lifeStory.constructLifeStory(narrativeArc, thematicCoherence, causalExplanation, futureProjection, meaningConstruction);
    this.lifeStoryCoherence = this.lifeStory.getAverageStoryCoherence();
  }

  updateMetrics(): void {
    this.overallNarrativeCoherence = this.identityNarrative.getAverageNarrativeCoherence();
    this.autobiographicalMemoryIntegration = this.selfMemory.getAverageMemoryIntegration();
    this.valueSystemCoherence = this.personalValues.getAverageValueCentrality();
    this.lifeStoryCoherence = this.lifeStory.getAverageStoryCoherence();
    this.identityNarrativeStrength = (this.overallNarrativeCoherence + this.selfConceptStability) / 2;
    this.temporalContinuity = (this.autobiographicalMemoryIntegration + this.overallNarrativeCoherence) / 2;
  }

  getNarrativeSelfState(): NarrativeSelfState {
    this.updateMetrics();
    return {
      overall_narrative_coherence: this.overallNarrativeCoherence,
      self_concept_stability: this.selfConceptStability,
      autobiographical_memory_integration: this.autobiographicalMemoryIntegration,
      identity_narrative_strength: this.identityNarrativeStrength,
      value_system_coherence: this.valueSystemCoherence,
      life_story_coherence: this.lifeStoryCoherence,
      temporal_continuity: this.temporalContinuity,
      timestamp_ms: Date.now()
    };
  }

  getNarrativeSelfMetrics(): NarrativeSelfMetrics {
    return {
      narrative_coherence_quality: this.overallNarrativeCoherence,
      autobiographical_continuity_strength: this.autobiographicalMemoryIntegration,
      identity_stability_level: this.selfConceptStability,
      self_memory_integration_depth: this.autobiographicalMemoryIntegration,
      value_identity_alignment: this.valueSystemCoherence,
      life_story_meaningfulness: this.lifeStoryCoherence,
      narrative_self_coherence: (this.overallNarrativeCoherence + this.identityNarrativeStrength + this.temporalContinuity) / 3
    };
  }

  resetNarrativeSelfState(): void {
    this.overallNarrativeCoherence = 0.6;
    this.selfConceptStability = 0.6;
    this.autobiographicalMemoryIntegration = 0.6;
    this.identityNarrativeStrength = 0.6;
    this.valueSystemCoherence = 0.6;
    this.lifeStoryCoherence = 0.6;
    this.temporalContinuity = 0.6;
  }
}

export {
  IdentityNarrativeSystem,
  SelfMemoryIntegrationSystem,
  PersonalValueStructureSystem,
  LifeStoryConstructionSystem
} from './narrative-systems';
export * from './types';
