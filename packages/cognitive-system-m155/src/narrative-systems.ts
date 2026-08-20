import { IdentityNarrative, SelfMemoryIntegration, PersonalValueStructure, LifeStoryConstruction } from './types';

export class IdentityNarrativeSystem {
  private narratives: Map<string, IdentityNarrative> = new Map();
  private history: Array<{ timestamp: number; narrativeId: string }> = [];

  constructNarrative(selfConcept: string, narrativeCoherence: number, autobiographicalContinuity: number, identityStability: number, narrativeIntegration: number): IdentityNarrative {
    const narrativeId = `id_${Date.now()}`;
    const narrative: IdentityNarrative = {
      narrative_id: narrativeId,
      self_concept: selfConcept,
      narrative_coherence: Math.max(0, Math.min(1, narrativeCoherence)),
      autobiographical_continuity: Math.max(0, Math.min(1, autobiographicalContinuity)),
      identity_stability: Math.max(0, Math.min(1, identityStability)),
      narrative_integration: Math.max(0, Math.min(1, narrativeIntegration))
    };
    this.narratives.set(narrativeId, narrative);
    this.history.push({ timestamp: Date.now(), narrativeId });
    if (this.history.length > 500) this.history.shift();
    return narrative;
  }

  getNarrative(narrativeId: string): IdentityNarrative | null {
    return this.narratives.get(narrativeId) || null;
  }

  getAverageNarrativeCoherence(): number {
    if (this.narratives.size === 0) return 0.6;
    const total = Array.from(this.narratives.values()).reduce((sum, n) => sum + n.narrative_coherence, 0);
    return total / this.narratives.size;
  }
}

export class SelfMemoryIntegrationSystem {
  private integrations: Map<string, SelfMemoryIntegration> = new Map();

  integrateMemory(memoryType: string, episodicContribution: number, semanticCoherence: number, selfRelevance: number, narrativeBinding: number): SelfMemoryIntegration {
    const integrationId = `mem_${Date.now()}`;
    const integration: SelfMemoryIntegration = {
      integration_id: integrationId,
      memory_type: memoryType,
      episodic_contribution: Math.max(0, Math.min(1, episodicContribution)),
      semantic_coherence: Math.max(0, Math.min(1, semanticCoherence)),
      self_relevance: Math.max(0, Math.min(1, selfRelevance)),
      narrative_binding: Math.max(0, Math.min(1, narrativeBinding))
    };
    this.integrations.set(integrationId, integration);
    return integration;
  }

  getIntegration(integrationId: string): SelfMemoryIntegration | null {
    return this.integrations.get(integrationId) || null;
  }

  getAverageMemoryIntegration(): number {
    if (this.integrations.size === 0) return 0.6;
    const total = Array.from(this.integrations.values()).reduce((sum, i) => sum + i.narrative_binding, 0);
    return total / this.integrations.size;
  }
}

export class PersonalValueStructureSystem {
  private values: Map<string, PersonalValueStructure> = new Map();

  registerValue(valueDomain: string, valueCentrality: number, identityCongruence: number, behavioralAlignment: number, motivationalStrength: number): PersonalValueStructure {
    const valueId = `val_${Date.now()}`;
    const value: PersonalValueStructure = {
      value_id: valueId,
      value_domain: valueDomain,
      value_centrality: Math.max(0, Math.min(1, valueCentrality)),
      identity_congruence: Math.max(0, Math.min(1, identityCongruence)),
      behavioral_alignment: Math.max(0, Math.min(1, behavioralAlignment)),
      motivational_strength: Math.max(0, Math.min(1, motivationalStrength))
    };
    this.values.set(valueId, value);
    return value;
  }

  getValue(valueId: string): PersonalValueStructure | null {
    return this.values.get(valueId) || null;
  }

  getAverageValueCentrality(): number {
    if (this.values.size === 0) return 0.6;
    const total = Array.from(this.values.values()).reduce((sum, v) => sum + v.value_centrality, 0);
    return total / this.values.size;
  }
}

export class LifeStoryConstructionSystem {
  private stories: Map<string, LifeStoryConstruction> = new Map();

  constructLifeStory(narrativeArc: string, thematicCoherence: number, causalExplanation: number, futureProjection: number, meaningConstruction: number): LifeStoryConstruction {
    const storyId = `story_${Date.now()}`;
    const story: LifeStoryConstruction = {
      story_id: storyId,
      narrative_arc: narrativeArc,
      thematic_coherence: Math.max(0, Math.min(1, thematicCoherence)),
      causal_explanation: Math.max(0, Math.min(1, causalExplanation)),
      future_projection: Math.max(0, Math.min(1, futureProjection)),
      meaning_construction: Math.max(0, Math.min(1, meaningConstruction))
    };
    this.stories.set(storyId, story);
    return story;
  }

  getStory(storyId: string): LifeStoryConstruction | null {
    return this.stories.get(storyId) || null;
  }

  getAverageStoryCoherence(): number {
    if (this.stories.size === 0) return 0.6;
    const total = Array.from(this.stories.values()).reduce((sum, s) => sum + s.thematic_coherence, 0);
    return total / this.stories.size;
  }
}
