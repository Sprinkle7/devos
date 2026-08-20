import { SemanticContent, PropositionalContent, ConceptualStructure, SemanticBinding } from './types';

export class SemanticContentSystem {
  private contents: Map<string, SemanticContent> = new Map();
  private history: Array<{ timestamp: number; contentId: string }> = [];

  registerSemanticContent(semanticDomain: string, conceptualClarity: number, semanticRichness: number, meaningCoherence: number, semanticAccessibility: number): SemanticContent {
    const contentId = `sc_${Date.now()}`;
    const content: SemanticContent = {
      content_id: contentId,
      semantic_domain: semanticDomain,
      conceptual_clarity: Math.max(0, Math.min(1, conceptualClarity)),
      semantic_richness: Math.max(0, Math.min(1, semanticRichness)),
      meaning_coherence: Math.max(0, Math.min(1, meaningCoherence)),
      semantic_accessibility: Math.max(0, Math.min(1, semanticAccessibility))
    };
    this.contents.set(contentId, content);
    this.history.push({ timestamp: Date.now(), contentId });
    if (this.history.length > 500) this.history.shift();
    return content;
  }

  getContent(contentId: string): SemanticContent | null {
    return this.contents.get(contentId) || null;
  }

  getAverageSemanticClarity(): number {
    if (this.contents.size === 0) return 0.6;
    const total = Array.from(this.contents.values()).reduce((sum, c) => sum + c.conceptual_clarity, 0);
    return total / this.contents.size;
  }
}

export class PropositionalContentSystem {
  private propositions: Map<string, PropositionalContent> = new Map();

  registerProposition(proposition: string, truthValueClarity: number, propositionalCoherence: number, beliefStrength: number, propositionalConfidence: number): PropositionalContent {
    const propositionalId = `prop_${Date.now()}`;
    const propContent: PropositionalContent = {
      propositional_id: propositionalId,
      proposition: proposition,
      truth_value_clarity: Math.max(0, Math.min(1, truthValueClarity)),
      propositional_coherence: Math.max(0, Math.min(1, propositionalCoherence)),
      belief_strength: Math.max(0, Math.min(1, beliefStrength)),
      propositional_confidence: Math.max(0, Math.min(1, propositionalConfidence))
    };
    this.propositions.set(propositionalId, propContent);
    return propContent;
  }

  getProposition(propositionalId: string): PropositionalContent | null {
    return this.propositions.get(propositionalId) || null;
  }

  getAveragePropositionalCoherence(): number {
    if (this.propositions.size === 0) return 0.6;
    const total = Array.from(this.propositions.values()).reduce((sum, p) => sum + p.propositional_coherence, 0);
    return total / this.propositions.size;
  }
}

export class ConceptualStructureSystem {
  private structures: Map<string, ConceptualStructure> = new Map();

  registerConceptualStructure(conceptCategory: string, structureComplexity: number, categoricalCoherence: number, abstractionLevel: number, relationalDensity: number): ConceptualStructure {
    const structureId = `cstr_${Date.now()}`;
    const structure: ConceptualStructure = {
      structure_id: structureId,
      concept_category: conceptCategory,
      structure_complexity: Math.max(0, Math.min(1, structureComplexity)),
      categorical_coherence: Math.max(0, Math.min(1, categoricalCoherence)),
      abstraction_level: Math.max(0, Math.min(1, abstractionLevel)),
      relational_density: Math.max(0, Math.min(1, relationalDensity))
    };
    this.structures.set(structureId, structure);
    return structure;
  }

  getStructure(structureId: string): ConceptualStructure | null {
    return this.structures.get(structureId) || null;
  }

  getAverageCategoricalCoherence(): number {
    if (this.structures.size === 0) return 0.6;
    const total = Array.from(this.structures.values()).reduce((sum, s) => sum + s.categorical_coherence, 0);
    return total / this.structures.size;
  }
}

export class SemanticBindingSystem {
  private bindings: Map<string, SemanticBinding> = new Map();

  bindConcepts(boundConcepts: string[], semanticConnectionStrength: number, meaningIntegration: number, semanticCoherence: number, conceptualUnity: number): SemanticBinding {
    const bindingId = `sb_${Date.now()}`;
    const binding: SemanticBinding = {
      binding_id: bindingId,
      bound_concepts: boundConcepts,
      semantic_connection_strength: Math.max(0, Math.min(1, semanticConnectionStrength)),
      meaning_integration: Math.max(0, Math.min(1, meaningIntegration)),
      semantic_coherence: Math.max(0, Math.min(1, semanticCoherence)),
      conceptual_unity: Math.max(0, Math.min(1, conceptualUnity))
    };
    this.bindings.set(bindingId, binding);
    return binding;
  }

  getBinding(bindingId: string): SemanticBinding | null {
    return this.bindings.get(bindingId) || null;
  }

  getAverageSemanticCoherence(): number {
    if (this.bindings.size === 0) return 0.6;
    const total = Array.from(this.bindings.values()).reduce((sum, b) => sum + b.semantic_coherence, 0);
    return total / this.bindings.size;
  }
}
