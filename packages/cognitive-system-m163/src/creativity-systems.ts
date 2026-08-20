import { CreativeProcess, NoveltyGeneration, DivergentThinking, ConvergentIntegration } from './types';

export class CreativeProcessSystem {
  private processes: Map<string, CreativeProcess> = new Map();
  private history: Array<{ timestamp: number; processId: string }> = [];

  registerCreativeProcess(creativeDomain: string, ideaFluency: number, ideaFlexibility: number, originalSynthesis: number, creativeElaboration: number): CreativeProcess {
    const processId = `cp_${Date.now()}`;
    const process: CreativeProcess = {
      process_id: processId,
      creative_domain: creativeDomain,
      idea_fluency: Math.max(0, Math.min(1, ideaFluency)),
      idea_flexibility: Math.max(0, Math.min(1, ideaFlexibility)),
      original_synthesis: Math.max(0, Math.min(1, originalSynthesis)),
      creative_elaboration: Math.max(0, Math.min(1, creativeElaboration))
    };
    this.processes.set(processId, process);
    this.history.push({ timestamp: Date.now(), processId });
    if (this.history.length > 500) this.history.shift();
    return process;
  }

  getProcess(processId: string): CreativeProcess | null {
    return this.processes.get(processId) || null;
  }

  getAverageCreativeFluency(): number {
    if (this.processes.size === 0) return 0.6;
    const total = Array.from(this.processes.values()).reduce((sum, p) => sum + p.idea_fluency, 0);
    return total / this.processes.size;
  }
}

export class NoveltyGenerationSystem {
  private novelties: Map<string, NoveltyGeneration> = new Map();

  registerNovelty(noveltyType: string, uniquenessLevel: number, creativeCombination: number, innovationPotential: number, conceptualDistance: number): NoveltyGeneration {
    const noveltyId = `ng_${Date.now()}`;
    const novelty: NoveltyGeneration = {
      novelty_id: noveltyId,
      novelty_type: noveltyType,
      uniqueness_level: Math.max(0, Math.min(1, uniquenessLevel)),
      creative_combination: Math.max(0, Math.min(1, creativeCombination)),
      innovation_potential: Math.max(0, Math.min(1, innovationPotential)),
      conceptual_distance: Math.max(0, Math.min(1, conceptualDistance))
    };
    this.novelties.set(noveltyId, novelty);
    return novelty;
  }

  getNovelty(noveltyId: string): NoveltyGeneration | null {
    return this.novelties.get(noveltyId) || null;
  }

  getAverageUniqueness(): number {
    if (this.novelties.size === 0) return 0.6;
    const total = Array.from(this.novelties.values()).reduce((sum, n) => sum + n.uniqueness_level, 0);
    return total / this.novelties.size;
  }
}

export class DivergentThinkingSystem {
  private thinkings: Map<string, DivergentThinking> = new Map();

  registerDivergentThinking(thinkingDomain: string, alternativeGeneration: number, perspectiveMultiplicity: number, constraintTranscendence: number, associativeRichness: number): DivergentThinking {
    const thinkingId = `dt_${Date.now()}`;
    const thinking: DivergentThinking = {
      thinking_id: thinkingId,
      thinking_domain: thinkingDomain,
      alternative_generation: Math.max(0, Math.min(1, alternativeGeneration)),
      perspective_multiplicity: Math.max(0, Math.min(1, perspectiveMultiplicity)),
      constraint_transcendence: Math.max(0, Math.min(1, constraintTranscendence)),
      associative_richness: Math.max(0, Math.min(1, associativeRichness))
    };
    this.thinkings.set(thinkingId, thinking);
    return thinking;
  }

  getThinking(thinkingId: string): DivergentThinking | null {
    return this.thinkings.get(thinkingId) || null;
  }

  getAverageAlternativeGeneration(): number {
    if (this.thinkings.size === 0) return 0.6;
    const total = Array.from(this.thinkings.values()).reduce((sum, t) => sum + t.alternative_generation, 0);
    return total / this.thinkings.size;
  }
}

export class ConvergentIntegrationSystem {
  private integrations: Map<string, ConvergentIntegration> = new Map();

  registerConvergentIntegration(integrationType: string, ideaEvaluation: number, qualityDiscrimination: number, practicalFeasibility: number, coherentSynthesis: number): ConvergentIntegration {
    const integrationId = `ci_${Date.now()}`;
    const integration: ConvergentIntegration = {
      integration_id: integrationId,
      integration_type: integrationType,
      idea_evaluation: Math.max(0, Math.min(1, ideaEvaluation)),
      quality_discrimination: Math.max(0, Math.min(1, qualityDiscrimination)),
      practical_feasibility: Math.max(0, Math.min(1, practicalFeasibility)),
      coherent_synthesis: Math.max(0, Math.min(1, coherentSynthesis))
    };
    this.integrations.set(integrationId, integration);
    return integration;
  }

  getIntegration(integrationId: string): ConvergentIntegration | null {
    return this.integrations.get(integrationId) || null;
  }

  getAverageQuality(): number {
    if (this.integrations.size === 0) return 0.6;
    const total = Array.from(this.integrations.values()).reduce((sum, i) => sum + i.quality_discrimination, 0);
    return total / this.integrations.size;
  }
}
