import { KnowledgeState, KnowledgeMetrics } from './types';
import {
  ConceptualRepresentationSystem,
  RelationalStructureSystem,
  LogicalReasoningSystem,
  InferentialCapacitySystem,
  KnowledgeUpdateSystem
} from './reasoning-systems';

export class KnowledgeRepresentationReasoningSystem {
  private conceptual: ConceptualRepresentationSystem;
  private relational: RelationalStructureSystem;
  private reasoning: LogicalReasoningSystem;
  private inferential: InferentialCapacitySystem;
  private knowledge: KnowledgeUpdateSystem;

  private totalConceptsRepresented: number = 0;
  private avgAbstractionLevel: number = 0.5;
  private avgRelationStrength: number = 0.6;
  private reasoningValidityAverage: number = 0.6;
  private inferentialCapacityLevel: number = 0.6;
  private knowledgeConsistencyScore: number = 0.7;
  private knowledgeIntegrationRate: number = 0.6;

  constructor() {
    this.conceptual = new ConceptualRepresentationSystem();
    this.relational = new RelationalStructureSystem();
    this.reasoning = new LogicalReasoningSystem();
    this.inferential = new InferentialCapacitySystem();
    this.knowledge = new KnowledgeUpdateSystem();
  }

  representConcept(name: string, abstraction: number, prototype: number, features: number, exemplar: number): void {
    this.conceptual.representConcept(name, abstraction, prototype, features, exemplar);
    this.totalConceptsRepresented++;
    this.avgAbstractionLevel = this.conceptual.getAverageAbstractionLevel();
  }

  defineRelation(source: string, target: string, type: string, strength: number, directionality: string): void {
    this.relational.defineRelation(source, target, type, strength, directionality);
    this.avgRelationStrength = this.relational.getAverageRelationStrength();
  }

  performReasoning(type: string, premise: number, conclusion: number, soundness: number, confidence: number): void {
    this.reasoning.performReasoning(type, premise, conclusion, soundness, confidence);
    this.reasoningValidityAverage = this.reasoning.getAverageReasoningValidity();
  }

  makeInference(type: string, complexity: number, reliability: number, integration: number): void {
    this.inferential.makeInference(type, complexity, reliability, integration);
    this.inferentialCapacityLevel = this.inferential.getAverageInferenceReliability();
  }

  updateKnowledge(revision: string, consistency: number, integration: number, coherence: number, learning: number): void {
    this.knowledge.updateKnowledge(revision, consistency, integration, coherence, learning);
    this.knowledgeConsistencyScore = this.knowledge.getAverageConsistencyMaintenance();
  }

  updateMetrics(): void {
    this.avgAbstractionLevel = this.conceptual.getAverageAbstractionLevel();
    this.avgRelationStrength = this.relational.getAverageRelationStrength();
    this.reasoningValidityAverage = this.reasoning.getAverageReasoningValidity();
    this.inferentialCapacityLevel = this.inferential.getAverageInferenceReliability();
    this.knowledgeConsistencyScore = this.knowledge.getAverageConsistencyMaintenance();
  }

  getKnowledgeState(): KnowledgeState {
    this.updateMetrics();
    return {
      total_concepts_represented: this.totalConceptsRepresented,
      average_abstraction_level: this.avgAbstractionLevel,
      average_relation_strength: this.avgRelationStrength,
      reasoning_validity_average: this.reasoningValidityAverage,
      inferential_capacity_level: this.inferentialCapacityLevel,
      knowledge_consistency_score: this.knowledgeConsistencyScore,
      knowledge_integration_rate: this.knowledgeIntegrationRate,
      timestamp_ms: Date.now()
    };
  }

  getKnowledgeMetrics(): KnowledgeMetrics {
    return {
      knowledge_completeness: Math.min(1, this.totalConceptsRepresented / 500),
      conceptual_clarity: this.avgAbstractionLevel,
      relational_coherence: this.avgRelationStrength,
      reasoning_quality: this.reasoningValidityAverage,
      inference_reliability: this.inferentialCapacityLevel,
      knowledge_flexibility: (this.avgAbstractionLevel + this.avgRelationStrength) / 2,
      adaptive_reasoning_rate: this.knowledgeIntegrationRate
    };
  }

  resetKnowledgeState(): void {
    this.totalConceptsRepresented = 0;
    this.avgAbstractionLevel = 0.5;
    this.avgRelationStrength = 0.6;
    this.reasoningValidityAverage = 0.6;
    this.inferentialCapacityLevel = 0.6;
    this.knowledgeConsistencyScore = 0.7;
    this.knowledgeIntegrationRate = 0.6;
  }
}

export {
  ConceptualRepresentationSystem,
  RelationalStructureSystem,
  LogicalReasoningSystem,
  InferentialCapacitySystem,
  KnowledgeUpdateSystem
} from './reasoning-systems';
export * from './types';
