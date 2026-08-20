import {
  ConceptualRepresentation,
  RelationalStructure,
  LogicalReasoning,
  InferentialCapacity,
  KnowledgeUpdate
} from './types';

export class ConceptualRepresentationSystem {
  private concepts: Map<string, ConceptualRepresentation> = new Map();
  private history: Array<{ timestamp: number; conceptId: string }> = [];

  representConcept(name: string, abstraction: number, prototype: number, features: number, exemplar: number): ConceptualRepresentation {
    const conceptId = `con_${Date.now()}`;
    const concept: ConceptualRepresentation = {
      concept_id: conceptId,
      concept_name: name,
      abstraction_level: Math.max(0, Math.min(1, abstraction)),
      prototype_similarity: Math.max(0, Math.min(1, prototype)),
      feature_completeness: Math.max(0, Math.min(1, features)),
      exemplar_connectivity: Math.max(0, Math.min(1, exemplar))
    };
    this.concepts.set(conceptId, concept);
    this.history.push({ timestamp: Date.now(), conceptId });
    if (this.history.length > 500) this.history.shift();
    return concept;
  }

  getConcept(conceptId: string): ConceptualRepresentation | null {
    return this.concepts.get(conceptId) || null;
  }

  getAverageAbstractionLevel(): number {
    if (this.concepts.size === 0) return 0.5;
    const total = Array.from(this.concepts.values()).reduce((sum, c) => sum + c.abstraction_level, 0);
    return total / this.concepts.size;
  }
}

export class RelationalStructureSystem {
  private relations: Map<string, RelationalStructure> = new Map();

  defineRelation(source: string, target: string, type: string, strength: number, directionality: string): RelationalStructure {
    const relationId = `rel_${Date.now()}`;
    const relation: RelationalStructure = {
      relation_id: relationId,
      source_concept: source,
      target_concept: target,
      relation_type: type,
      relation_strength: Math.max(0, Math.min(1, strength)),
      directionality: directionality
    };
    this.relations.set(relationId, relation);
    return relation;
  }

  getRelation(relationId: string): RelationalStructure | null {
    return this.relations.get(relationId) || null;
  }

  getAverageRelationStrength(): number {
    if (this.relations.size === 0) return 0.6;
    const total = Array.from(this.relations.values()).reduce((sum, r) => sum + r.relation_strength, 0);
    return total / this.relations.size;
  }
}

export class LogicalReasoningSystem {
  private reasonings: Map<string, LogicalReasoning> = new Map();

  performReasoning(type: string, premiseValidity: number, conclusionValidity: number, soundness: number, confidence: number): LogicalReasoning {
    const reasoningId = `reas_${Date.now()}`;
    const reasoning: LogicalReasoning = {
      reasoning_id: reasoningId,
      reasoning_type: type,
      premise_validity: Math.max(0, Math.min(1, premiseValidity)),
      conclusion_validity: Math.max(0, Math.min(1, conclusionValidity)),
      soundness_rating: Math.max(0, Math.min(1, soundness)),
      confidence_level: Math.max(0, Math.min(1, confidence))
    };
    this.reasonings.set(reasoningId, reasoning);
    return reasoning;
  }

  getReasoning(reasoningId: string): LogicalReasoning | null {
    return this.reasonings.get(reasoningId) || null;
  }

  getAverageReasoningValidity(): number {
    if (this.reasonings.size === 0) return 0.6;
    const total = Array.from(this.reasonings.values()).reduce((sum, r) => sum + (r.premise_validity + r.conclusion_validity) / 2, 0);
    return total / this.reasonings.size;
  }
}

export class InferentialCapacitySystem {
  private inferences: Map<string, InferentialCapacity> = new Map();

  makeInference(type: string, complexity: number, reliability: number, integration: number): InferentialCapacity {
    const inferenceId = `inf_${Date.now()}`;
    const inference: InferentialCapacity = {
      inference_id: inferenceId,
      inference_type: type,
      inference_complexity: Math.max(0, Math.min(1, complexity)),
      inference_reliability: Math.max(0, Math.min(1, reliability)),
      information_integration: Math.max(0, Math.min(1, integration))
    };
    this.inferences.set(inferenceId, inference);
    return inference;
  }

  getInference(inferenceId: string): InferentialCapacity | null {
    return this.inferences.get(inferenceId) || null;
  }

  getAverageInferenceReliability(): number {
    if (this.inferences.size === 0) return 0.6;
    const total = Array.from(this.inferences.values()).reduce((sum, i) => sum + i.inference_reliability, 0);
    return total / this.inferences.size;
  }
}

export class KnowledgeUpdateSystem {
  private updates: Map<string, KnowledgeUpdate> = new Map();

  updateKnowledge(revision: string, consistency: number, integration: number, coherence: number, learning: number): KnowledgeUpdate {
    const updateId = `upd_${Date.now()}`;
    const update: KnowledgeUpdate = {
      update_id: updateId,
      knowledge_revision: revision,
      consistency_maintenance: Math.max(0, Math.min(1, consistency)),
      integration_smoothness: Math.max(0, Math.min(1, integration)),
      belief_coherence: Math.max(0, Math.min(1, coherence)),
      learning_from_conflict: Math.max(0, Math.min(1, learning))
    };
    this.updates.set(updateId, update);
    return update;
  }

  getUpdate(updateId: string): KnowledgeUpdate | null {
    return this.updates.get(updateId) || null;
  }

  getAverageConsistencyMaintenance(): number {
    if (this.updates.size === 0) return 0.7;
    const total = Array.from(this.updates.values()).reduce((sum, u) => sum + u.consistency_maintenance, 0);
    return total / this.updates.size;
  }
}
