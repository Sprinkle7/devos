import { CreativityState, CreativityMetrics } from './types';
import {
  CreativeProcessSystem,
  NoveltyGenerationSystem,
  DivergentThinkingSystem,
  ConvergentIntegrationSystem
} from './creativity-systems';

export class CreativityNoveltySystem {
  private creativeProcess: CreativeProcessSystem;
  private noveltyGeneration: NoveltyGenerationSystem;
  private divergentThinking: DivergentThinkingSystem;
  private convergentIntegration: ConvergentIntegrationSystem;

  private overallCreativeCapacity: number = 0.6;
  private ideaGenerationFluency: number = 0.6;
  private noveltyGenerationStrength: number = 0.6;
  private divergentThinkingDepth: number = 0.6;
  private convergentIntegrationQuality: number = 0.6;
  private creativeOutputQuality: number = 0.6;
  private innovationReadiness: number = 0.6;

  constructor() {
    this.creativeProcess = new CreativeProcessSystem();
    this.noveltyGeneration = new NoveltyGenerationSystem();
    this.divergentThinking = new DivergentThinkingSystem();
    this.convergentIntegration = new ConvergentIntegrationSystem();
  }

  registerCreativeProcess(creativeDomain: string, ideaFluency: number, ideaFlexibility: number, originalSynthesis: number, creativeElaboration: number): void {
    this.creativeProcess.registerCreativeProcess(creativeDomain, ideaFluency, ideaFlexibility, originalSynthesis, creativeElaboration);
    this.ideaGenerationFluency = this.creativeProcess.getAverageCreativeFluency();
  }

  registerNovelty(noveltyType: string, uniquenessLevel: number, creativeCombination: number, innovationPotential: number, conceptualDistance: number): void {
    this.noveltyGeneration.registerNovelty(noveltyType, uniquenessLevel, creativeCombination, innovationPotential, conceptualDistance);
    this.noveltyGenerationStrength = this.noveltyGeneration.getAverageUniqueness();
  }

  registerDivergentThinking(thinkingDomain: string, alternativeGeneration: number, perspectiveMultiplicity: number, constraintTranscendence: number, associativeRichness: number): void {
    this.divergentThinking.registerDivergentThinking(thinkingDomain, alternativeGeneration, perspectiveMultiplicity, constraintTranscendence, associativeRichness);
    this.divergentThinkingDepth = this.divergentThinking.getAverageAlternativeGeneration();
  }

  registerConvergentIntegration(integrationType: string, ideaEvaluation: number, qualityDiscrimination: number, practicalFeasibility: number, coherentSynthesis: number): void {
    this.convergentIntegration.registerConvergentIntegration(integrationType, ideaEvaluation, qualityDiscrimination, practicalFeasibility, coherentSynthesis);
    this.convergentIntegrationQuality = this.convergentIntegration.getAverageQuality();
  }

  updateMetrics(): void {
    this.ideaGenerationFluency = this.creativeProcess.getAverageCreativeFluency();
    this.noveltyGenerationStrength = this.noveltyGeneration.getAverageUniqueness();
    this.divergentThinkingDepth = this.divergentThinking.getAverageAlternativeGeneration();
    this.convergentIntegrationQuality = this.convergentIntegration.getAverageQuality();
    this.overallCreativeCapacity = (this.ideaGenerationFluency + this.noveltyGenerationStrength + this.divergentThinkingDepth) / 3;
    this.creativeOutputQuality = (this.noveltyGenerationStrength + this.convergentIntegrationQuality) / 2;
    this.innovationReadiness = (this.overallCreativeCapacity + this.creativeOutputQuality) / 2;
  }

  getCreativityState(): CreativityState {
    this.updateMetrics();
    return {
      overall_creative_capacity: this.overallCreativeCapacity,
      idea_generation_fluency: this.ideaGenerationFluency,
      novelty_generation_strength: this.noveltyGenerationStrength,
      divergent_thinking_depth: this.divergentThinkingDepth,
      convergent_integration_quality: this.convergentIntegrationQuality,
      creative_output_quality: this.creativeOutputQuality,
      innovation_readiness: this.innovationReadiness,
      timestamp_ms: Date.now()
    };
  }

  getCreativityMetrics(): CreativityMetrics {
    return {
      creative_fluency_rate: this.ideaGenerationFluency,
      novelty_generation_capacity: this.noveltyGenerationStrength,
      divergent_thinking_flexibility: this.divergentThinkingDepth,
      convergent_thinking_quality: this.convergentIntegrationQuality,
      idea_elaboration_depth: (this.ideaGenerationFluency + this.divergentThinkingDepth) / 2,
      creative_synthesis_coherence: this.creativeOutputQuality,
      overall_creativity_strength: this.overallCreativeCapacity
    };
  }

  resetCreativityState(): void {
    this.overallCreativeCapacity = 0.6;
    this.ideaGenerationFluency = 0.6;
    this.noveltyGenerationStrength = 0.6;
    this.divergentThinkingDepth = 0.6;
    this.convergentIntegrationQuality = 0.6;
    this.creativeOutputQuality = 0.6;
    this.innovationReadiness = 0.6;
  }
}

export {
  CreativeProcessSystem,
  NoveltyGenerationSystem,
  DivergentThinkingSystem,
  ConvergentIntegrationSystem
} from './creativity-systems';
export * from './types';
