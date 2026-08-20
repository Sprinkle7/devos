import { SemanticConsciousnessState, SemanticConsciousnessMetrics } from './types';
import {
  SemanticContentSystem,
  PropositionalContentSystem,
  ConceptualStructureSystem,
  SemanticBindingSystem
} from './semantic-systems';

export class SemanticConsciousnessSystem {
  private semanticContent: SemanticContentSystem;
  private propositionalContent: PropositionalContentSystem;
  private conceptualStructure: ConceptualStructureSystem;
  private semanticBinding: SemanticBindingSystem;

  private overallSemanticConsciousness: number = 0.6;
  private semanticContentClarity: number = 0.6;
  private propositionalContentRichness: number = 0.6;
  private conceptualStructureCoherence: number = 0.6;
  private semanticBindingStrength: number = 0.6;
  private meaningfulExperienceLevel: number = 0.6;
  private semanticAwarenessDepth: number = 0.6;

  constructor() {
    this.semanticContent = new SemanticContentSystem();
    this.propositionalContent = new PropositionalContentSystem();
    this.conceptualStructure = new ConceptualStructureSystem();
    this.semanticBinding = new SemanticBindingSystem();
  }

  registerSemanticContent(semanticDomain: string, conceptualClarity: number, semanticRichness: number, meaningCoherence: number, semanticAccessibility: number): void {
    this.semanticContent.registerSemanticContent(semanticDomain, conceptualClarity, semanticRichness, meaningCoherence, semanticAccessibility);
    this.semanticContentClarity = this.semanticContent.getAverageSemanticClarity();
  }

  registerProposition(proposition: string, truthValueClarity: number, propositionalCoherence: number, beliefStrength: number, propositionalConfidence: number): void {
    this.propositionalContent.registerProposition(proposition, truthValueClarity, propositionalCoherence, beliefStrength, propositionalConfidence);
    this.propositionalContentRichness = this.propositionalContent.getAveragePropositionalCoherence();
  }

  registerConceptualStructure(conceptCategory: string, structureComplexity: number, categoricalCoherence: number, abstractionLevel: number, relationalDensity: number): void {
    this.conceptualStructure.registerConceptualStructure(conceptCategory, structureComplexity, categoricalCoherence, abstractionLevel, relationalDensity);
    this.conceptualStructureCoherence = this.conceptualStructure.getAverageCategoricalCoherence();
  }

  bindConcepts(boundConcepts: string[], semanticConnectionStrength: number, meaningIntegration: number, semanticCoherence: number, conceptualUnity: number): void {
    this.semanticBinding.bindConcepts(boundConcepts, semanticConnectionStrength, meaningIntegration, semanticCoherence, conceptualUnity);
    this.semanticBindingStrength = this.semanticBinding.getAverageSemanticCoherence();
  }

  updateMetrics(): void {
    this.semanticContentClarity = this.semanticContent.getAverageSemanticClarity();
    this.propositionalContentRichness = this.propositionalContent.getAveragePropositionalCoherence();
    this.conceptualStructureCoherence = this.conceptualStructure.getAverageCategoricalCoherence();
    this.semanticBindingStrength = this.semanticBinding.getAverageSemanticCoherence();
    this.overallSemanticConsciousness = (this.semanticContentClarity + this.propositionalContentRichness + this.conceptualStructureCoherence) / 3;
    this.meaningfulExperienceLevel = (this.semanticContentClarity + this.semanticBindingStrength) / 2;
    this.semanticAwarenessDepth = (this.overallSemanticConsciousness + this.semanticBindingStrength) / 2;
  }

  getSemanticConsciousnessState(): SemanticConsciousnessState {
    this.updateMetrics();
    return {
      overall_semantic_consciousness: this.overallSemanticConsciousness,
      semantic_content_clarity: this.semanticContentClarity,
      propositional_content_richness: this.propositionalContentRichness,
      conceptual_structure_coherence: this.conceptualStructureCoherence,
      semantic_binding_strength: this.semanticBindingStrength,
      meaningful_experience_level: this.meaningfulExperienceLevel,
      semantic_awareness_depth: this.semanticAwarenessDepth,
      timestamp_ms: Date.now()
    };
  }

  getSemanticConsciousnessMetrics(): SemanticConsciousnessMetrics {
    return {
      semantic_consciousness_quality: this.overallSemanticConsciousness,
      content_semantic_richness: this.semanticContentClarity,
      propositional_consciousness_clarity: this.propositionalContentRichness,
      conceptual_understanding_depth: this.conceptualStructureCoherence,
      semantic_integration_coherence: this.semanticBindingStrength,
      meaningful_content_accessibility: this.meaningfulExperienceLevel,
      overall_semantic_depth: this.semanticAwarenessDepth
    };
  }

  resetSemanticConsciousnessState(): void {
    this.overallSemanticConsciousness = 0.6;
    this.semanticContentClarity = 0.6;
    this.propositionalContentRichness = 0.6;
    this.conceptualStructureCoherence = 0.6;
    this.semanticBindingStrength = 0.6;
    this.meaningfulExperienceLevel = 0.6;
    this.semanticAwarenessDepth = 0.6;
  }
}

export {
  SemanticContentSystem,
  PropositionalContentSystem,
  ConceptualStructureSystem,
  SemanticBindingSystem
} from './semantic-systems';
export * from './types';
