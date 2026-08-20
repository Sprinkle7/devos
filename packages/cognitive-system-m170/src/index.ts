import { WorkingMemoryStorage, MemoryUpdateManipulation, CentralExecutive, WorkingMemoryIntegration, WorkingMemoryState, WorkingMemoryMetrics } from './types';

class WorkingMemoryStorageSystem {
  private storages: Map<string, any> = new Map();
  registerStorage(storageType: string, capacity: number): any {
    const id = `wms_${Date.now()}`;
    const item = { id, storage_type: storageType, buffer_capacity: Math.max(0, Math.min(1, capacity)), information_retention: Math.max(0, Math.min(1, Math.random())), item_quantity: Math.max(0, Math.min(1, Math.random())), maintenance_strength: Math.max(0, Math.min(1, Math.random())) };
    this.storages.set(id, item);
    return item;
  }
  getAverageStorage(): number {
    if (this.storages.size === 0) return 0.6;
    const total = Array.from(this.storages.values()).reduce((sum, s) => sum + s.buffer_capacity, 0);
    return total / this.storages.size;
  }
}

class MemoryUpdateManipulationSystem {
  private updates: Map<string, any> = new Map();
  registerUpdate(updateType: string, manipulationSpeed: number): any {
    const id = `mum_${Date.now()}`;
    const item = { id, update_type: updateType, manipulation_speed: Math.max(0, Math.min(1, manipulationSpeed)), transformation_accuracy: Math.max(0, Math.min(1, Math.random())), operation_complexity: Math.max(0, Math.min(1, Math.random())), update_efficiency: Math.max(0, Math.min(1, Math.random())) };
    this.updates.set(id, item);
    return item;
  }
  getAverageUpdate(): number {
    if (this.updates.size === 0) return 0.6;
    const total = Array.from(this.updates.values()).reduce((sum, u) => sum + u.manipulation_speed, 0);
    return total / this.updates.size;
  }
}

class CentralExecutiveSystem {
  private executives: Map<string, any> = new Map();
  registerExecutive(executiveDomain: string, controlStrength: number): any {
    const id = `ce_${Date.now()}`;
    const item = { id, executive_domain: executiveDomain, control_strength: Math.max(0, Math.min(1, controlStrength)), coordination_quality: Math.max(0, Math.min(1, Math.random())), inhibition_effectiveness: Math.max(0, Math.min(1, Math.random())), executive_capacity: Math.max(0, Math.min(1, Math.random())) };
    this.executives.set(id, item);
    return item;
  }
  getAverageExecutive(): number {
    if (this.executives.size === 0) return 0.6;
    const total = Array.from(this.executives.values()).reduce((sum, e) => sum + e.control_strength, 0);
    return total / this.executives.size;
  }
}

class WorkingMemoryIntegrationSystem {
  private integrations: Map<string, any> = new Map();
  registerIntegration(integrationType: string, linkStrength: number): any {
    const id = `wmi_${Date.now()}`;
    const item = { id, integration_type: integrationType, long_term_link_strength: Math.max(0, Math.min(1, linkStrength)), episodic_binding: Math.max(0, Math.min(1, Math.random())), context_maintenance: Math.max(0, Math.min(1, Math.random())), retrieval_efficiency: Math.max(0, Math.min(1, Math.random())) };
    this.integrations.set(id, item);
    return item;
  }
  getAverageIntegration(): number {
    if (this.integrations.size === 0) return 0.6;
    const total = Array.from(this.integrations.values()).reduce((sum, i) => sum + i.long_term_link_strength, 0);
    return total / this.integrations.size;
  }
}

export class WorkingMemorySystem {
  private workingMemoryStorage: WorkingMemoryStorageSystem;
  private memoryUpdateManipulation: MemoryUpdateManipulationSystem;
  private centralExecutive: CentralExecutiveSystem;
  private workingMemoryIntegration: WorkingMemoryIntegrationSystem;
  private workingMemoryCapacity: number = 0.6;
  private informationRetentionQuality: number = 0.6;
  private manipulationEfficiency: number = 0.6;
  private executiveControlStrength: number = 0.6;

  constructor() {
    this.workingMemoryStorage = new WorkingMemoryStorageSystem();
    this.memoryUpdateManipulation = new MemoryUpdateManipulationSystem();
    this.centralExecutive = new CentralExecutiveSystem();
    this.workingMemoryIntegration = new WorkingMemoryIntegrationSystem();
  }

  registerStorage(storageType: string, capacity: number): void {
    this.workingMemoryStorage.registerStorage(storageType, capacity);
    this.workingMemoryCapacity = this.workingMemoryStorage.getAverageStorage();
  }

  registerUpdate(updateType: string, manipulationSpeed: number): void {
    this.memoryUpdateManipulation.registerUpdate(updateType, manipulationSpeed);
    this.manipulationEfficiency = this.memoryUpdateManipulation.getAverageUpdate();
  }

  registerExecutive(executiveDomain: string, controlStrength: number): void {
    this.centralExecutive.registerExecutive(executiveDomain, controlStrength);
    this.executiveControlStrength = this.centralExecutive.getAverageExecutive();
  }

  registerIntegration(integrationType: string, linkStrength: number): void {
    this.workingMemoryIntegration.registerIntegration(integrationType, linkStrength);
    this.informationRetentionQuality = this.workingMemoryIntegration.getAverageIntegration();
  }

  updateMetrics(): void {
    this.workingMemoryCapacity = this.workingMemoryStorage.getAverageStorage();
    this.manipulationEfficiency = this.memoryUpdateManipulation.getAverageUpdate();
    this.executiveControlStrength = this.centralExecutive.getAverageExecutive();
    this.informationRetentionQuality = this.workingMemoryIntegration.getAverageIntegration();
  }

  getWorkingMemoryState(): WorkingMemoryState {
    this.updateMetrics();
    return {
      working_memory_capacity: this.workingMemoryCapacity,
      information_retention_quality: this.informationRetentionQuality,
      manipulation_efficiency: this.manipulationEfficiency,
      executive_control_strength: this.executiveControlStrength,
      memory_integration_quality: this.informationRetentionQuality,
      working_memory_stability: (this.workingMemoryCapacity + this.informationRetentionQuality) / 2,
      working_memory_cognition_integration: (this.workingMemoryCapacity + this.manipulationEfficiency + this.executiveControlStrength) / 3,
      timestamp_ms: Date.now()
    };
  }

  getWorkingMemoryMetrics(): WorkingMemoryMetrics {
    return {
      storage_capacity_strength: this.workingMemoryCapacity,
      information_retention_rate: this.informationRetentionQuality,
      manipulation_operation_speed: this.manipulationEfficiency,
      executive_control_effectiveness: this.executiveControlStrength,
      memory_update_quality: (this.manipulationEfficiency + this.informationRetentionQuality) / 2,
      working_memory_flexibility: (this.executiveControlStrength + this.manipulationEfficiency) / 2,
      overall_working_memory_strength: (this.workingMemoryCapacity + this.manipulationEfficiency + this.executiveControlStrength + this.informationRetentionQuality) / 4
    };
  }
}

export * from './types';
