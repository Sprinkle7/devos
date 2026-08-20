import { LanguageCommunicationState, LanguageCommunicationMetrics } from './types';
import {
  LanguageComprehensionSystem,
  LanguageProductionSystem,
  SemanticRepresentationSystem,
  ConversationDynamicsSystem,
  DiscourseStructureSystem,
  MultimodalIntegrationSystem
} from './language-systems';

export class LanguageCommunicationSystem {
  private comprehension: LanguageComprehensionSystem;
  private production: LanguageProductionSystem;
  private semantic: SemanticRepresentationSystem;
  private conversation: ConversationDynamicsSystem;
  private discourse: DiscourseStructureSystem;
  private multimodal: MultimodalIntegrationSystem;

  private totalUtterancesProcessed: number = 0;
  private avgComprehensionAccuracy: number = 0.7;
  private avgProductionFluency: number = 0.7;
  private avgSemanticRichness: number = 0.6;
  private conversationEngagementLevel: number = 0.6;
  private discourseCoherenceAverage: number = 0.6;
  private multimodalIntegrationLevel: number = 0.6;

  constructor() {
    this.comprehension = new LanguageComprehensionSystem();
    this.production = new LanguageProductionSystem();
    this.semantic = new SemanticRepresentationSystem();
    this.conversation = new ConversationDynamicsSystem();
    this.discourse = new DiscourseStructureSystem();
    this.multimodal = new MultimodalIntegrationSystem();
  }

  comprehendText(input: string, semantic: number, syntactic: number, pragmatic: number, ambiguity: number): void {
    this.comprehension.comprehendText(input, semantic, syntactic, pragmatic, ambiguity);
    this.totalUtterancesProcessed++;
    this.avgComprehensionAccuracy = this.comprehension.getAverageComprehensionAccuracy();
  }

  produceLanguage(meaning: string, lexical: number, syntactic: number, phonological: number, pragmatic: number): void {
    this.production.produceLanguage(meaning, lexical, syntactic, phonological, pragmatic);
    this.avgProductionFluency = this.production.getAverageProductionFluency();
  }

  representSemantic(word: string, richness: number, metaphorical: number, relatedness: number, frequency: number): void {
    this.semantic.representSemantic(word, richness, metaphorical, relatedness, frequency);
    this.avgSemanticRichness = this.semantic.getAverageSemanticRichness();
  }

  initiateConversation(smoothness: number, understanding: number, coherence: number, tone: number): void {
    this.conversation.initiateConversation(smoothness, understanding, coherence, tone);
    this.conversationEngagementLevel = this.conversation.getAverageMutualUnderstanding();
  }

  analyzeDiscourse(length: number, coherence: number, cohesion: number, argumentative: number, narrative: string): void {
    this.discourse.analyzeDiscourse(length, coherence, cohesion, argumentative, narrative);
    this.discourseCoherenceAverage = this.discourse.getAverageCoherence();
  }

  integrateModalities(modalities: string[], coherence: number, congruence: number, effectiveness: number): void {
    this.multimodal.integrateModalities(modalities, coherence, congruence, effectiveness);
    this.multimodalIntegrationLevel = this.multimodal.getAverageIntegrationLevel();
  }

  updateMetrics(): void {
    this.avgComprehensionAccuracy = this.comprehension.getAverageComprehensionAccuracy();
    this.avgProductionFluency = this.production.getAverageProductionFluency();
    this.avgSemanticRichness = this.semantic.getAverageSemanticRichness();
    this.conversationEngagementLevel = this.conversation.getAverageMutualUnderstanding();
    this.discourseCoherenceAverage = this.discourse.getAverageCoherence();
    this.multimodalIntegrationLevel = this.multimodal.getAverageIntegrationLevel();
  }

  getLanguageCommunicationState(): LanguageCommunicationState {
    this.updateMetrics();
    return {
      total_utterances_processed: this.totalUtterancesProcessed,
      average_comprehension_accuracy: this.avgComprehensionAccuracy,
      average_production_fluency: this.avgProductionFluency,
      average_semantic_richness: this.avgSemanticRichness,
      conversation_engagement_level: this.conversationEngagementLevel,
      discourse_coherence_average: this.discourseCoherenceAverage,
      multimodal_integration_level: this.multimodalIntegrationLevel,
      timestamp_ms: Date.now()
    };
  }

  getLanguageCommunicationMetrics(): LanguageCommunicationMetrics {
    return {
      comprehension_to_production_ratio: (this.avgComprehensionAccuracy + this.avgProductionFluency) / 2,
      semantic_precision: this.avgSemanticRichness,
      pragmatic_sensitivity: (this.avgComprehensionAccuracy + this.avgProductionFluency) / 2 * 0.8,
      conversational_fluency: this.conversationEngagementLevel,
      discourse_quality: this.discourseCoherenceAverage,
      communicative_intent_alignment: (this.avgProductionFluency + this.multimodalIntegrationLevel) / 2,
      linguistic_creativity: this.avgSemanticRichness * 0.7 + Math.random() * 0.3
    };
  }

  resetLanguageState(): void {
    this.totalUtterancesProcessed = 0;
    this.avgComprehensionAccuracy = 0.7;
    this.avgProductionFluency = 0.7;
    this.avgSemanticRichness = 0.6;
    this.conversationEngagementLevel = 0.6;
    this.discourseCoherenceAverage = 0.6;
    this.multimodalIntegrationLevel = 0.6;
  }
}

export {
  LanguageComprehensionSystem,
  LanguageProductionSystem,
  SemanticRepresentationSystem,
  ConversationDynamicsSystem,
  DiscourseStructureSystem,
  MultimodalIntegrationSystem
} from './language-systems';
export * from './types';
