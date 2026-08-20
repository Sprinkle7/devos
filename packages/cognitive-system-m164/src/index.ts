import { LearningMemoryState, LearningMemoryMetrics } from './types';

class LearningAcquisitionSystem {
  private acquisitions: Map<string, any> = new Map();
  registerLearning(learningType: string, encodingStrength: number): any {
    const id = `la_${Date.now()}`;
    const item = { id, learning_type: learningType, encoding_strength: Math.max(0, Math.min(1, encodingStrength)) };
    this.acquisitions.set(id, item);
    return item;
  }
  getAverageEncoding(): number {
    if (this.acquisitions.size === 0) return 0.6;
    const total = Array.from(this.acquisitions.values()).reduce((sum, a) => sum + a.encoding_strength, 0);
    return total / this.acquisitions.size;
  }
}

class MemoryConsolidationSystem {
  private consolidations: Map<string, any> = new Map();
  registerConsolidation(phase: string, strength: number): any {
    const id = `mc_${Date.now()}`;
    const item = { id, phase, synaptic_strengthening: Math.max(0, Math.min(1, strength)) };
    this.consolidations.set(id, item);
    return item;
  }
  getAverageConsolidation(): number {
    if (this.consolidations.size === 0) return 0.6;
    const total = Array.from(this.consolidations.values()).reduce((sum, c) => sum + c.synaptic_strengthening, 0);
    return total / this.consolidations.size;
  }
}

class RetrievalOptimizationSystem {
  private retrievals: Map<string, any> = new Map();
  registerRetrieval(type: string, accessibility: number): any {
    const id = `ro_${Date.now()}`;
    const item = { id, retrieval_type: type, recall_accessibility: Math.max(0, Math.min(1, accessibility)) };
    this.retrievals.set(id, item);
    return item;
  }
  getAverageRetrieval(): number {
    if (this.retrievals.size === 0) return 0.6;
    const total = Array.from(this.retrievals.values()).reduce((sum, r) => sum + r.recall_accessibility, 0);
    return total / this.retrievals.size;
  }
}

class LearningTransferSystem {
  private transfers: Map<string, any> = new Map();
  registerTransfer(domain: string, nearTransfer: number): any {
    const id = `lt_${Date.now()}`;
    const item = { id, domain, near_transfer_strength: Math.max(0, Math.min(1, nearTransfer)) };
    this.transfers.set(id, item);
    return item;
  }
  getAverageTransfer(): number {
    if (this.transfers.size === 0) return 0.6;
    const total = Array.from(this.transfers.values()).reduce((sum, t) => sum + t.near_transfer_strength, 0);
    return total / this.transfers.size;
  }
}

export class LearningMemorySystem {
  private learning: LearningAcquisitionSystem;
  private consolidation: MemoryConsolidationSystem;
  private retrieval: RetrievalOptimizationSystem;
  private transfer: LearningTransferSystem;
  private totalAcquisitions: number = 0;
  private learningEfficiency: number = 0.6;
  private consolidationStrength: number = 0.6;
  private retrievalQuality: number = 0.6;
  private transferCapacity: number = 0.6;

  constructor() {
    this.learning = new LearningAcquisitionSystem();
    this.consolidation = new MemoryConsolidationSystem();
    this.retrieval = new RetrievalOptimizationSystem();
    this.transfer = new LearningTransferSystem();
  }

  registerLearning(learningType: string, encodingStrength: number): void {
    this.learning.registerLearning(learningType, encodingStrength);
    this.totalAcquisitions++;
    this.learningEfficiency = this.learning.getAverageEncoding();
  }

  registerConsolidation(phase: string, strength: number): void {
    this.consolidation.registerConsolidation(phase, strength);
    this.consolidationStrength = this.consolidation.getAverageConsolidation();
  }

  registerRetrieval(type: string, accessibility: number): void {
    this.retrieval.registerRetrieval(type, accessibility);
    this.retrievalQuality = this.retrieval.getAverageRetrieval();
  }

  registerTransfer(domain: string, nearTransfer: number): void {
    this.transfer.registerTransfer(domain, nearTransfer);
    this.transferCapacity = this.transfer.getAverageTransfer();
  }

  updateMetrics(): void {
    this.learningEfficiency = this.learning.getAverageEncoding();
    this.consolidationStrength = this.consolidation.getAverageConsolidation();
    this.retrievalQuality = this.retrieval.getAverageRetrieval();
    this.transferCapacity = this.transfer.getAverageTransfer();
  }

  getLearningMemoryState(): LearningMemoryState {
    this.updateMetrics();
    return {
      total_learning_acquisitions: this.totalAcquisitions,
      learning_efficiency_level: this.learningEfficiency,
      memory_consolidation_strength: this.consolidationStrength,
      retrieval_optimization_quality: this.retrievalQuality,
      learning_transfer_capacity: this.transferCapacity,
      memory_retention_quality: (this.consolidationStrength + this.retrievalQuality) / 2,
      learning_performance_level: (this.learningEfficiency + this.consolidationStrength) / 2,
      timestamp_ms: Date.now()
    };
  }

  getLearningMemoryMetrics(): LearningMemoryMetrics {
    return {
      learning_acquisition_rate: this.learningEfficiency,
      memory_consolidation_efficiency: this.consolidationStrength,
      retrieval_success_rate: this.retrievalQuality,
      learning_retention_durability: (this.consolidationStrength + this.retrievalQuality) / 2,
      transfer_learning_capacity: this.transferCapacity,
      knowledge_integration_depth: (this.learningEfficiency + this.transferCapacity) / 2,
      overall_learning_strength: (this.learningEfficiency + this.consolidationStrength + this.transferCapacity) / 3
    };
  }
}

export * from './types';
