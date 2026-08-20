import { SelectiveAttention, SustainedFocus, AttentionalShifting, AttentionalCapacity, AttentionFocusState, AttentionFocusMetrics } from './types';

class SelectiveAttentionSystem {
  private attentions: Map<string, any> = new Map();
  registerAttention(targetStimulus: string, salience: number): any {
    const id = `sa_${Date.now()}`;
    const item = { id, target_stimulus: targetStimulus, salience_filtering: Math.max(0, Math.min(1, salience)), distraction_suppression: Math.max(0, Math.min(1, Math.random())), attention_selectivity: Math.max(0, Math.min(1, Math.random())), feature_binding: Math.max(0, Math.min(1, Math.random())) };
    this.attentions.set(id, item);
    return item;
  }
  getAverageAttention(): number {
    if (this.attentions.size === 0) return 0.6;
    const total = Array.from(this.attentions.values()).reduce((sum, a) => sum + a.salience_filtering, 0);
    return total / this.attentions.size;
  }
}

class SustainedFocusSystem {
  private focuses: Map<string, any> = new Map();
  registerFocus(focusDomain: string, duration: number): any {
    const id = `sf_${Date.now()}`;
    const item = { id, focus_domain: focusDomain, focus_duration: Math.max(0, Math.min(1, duration)), engagement_level: Math.max(0, Math.min(1, Math.random())), vigilance_maintenance: Math.max(0, Math.min(1, Math.random())), fatigue_resistance: Math.max(0, Math.min(1, Math.random())) };
    this.focuses.set(id, item);
    return item;
  }
  getAverageFocus(): number {
    if (this.focuses.size === 0) return 0.6;
    const total = Array.from(this.focuses.values()).reduce((sum, f) => sum + f.focus_duration, 0);
    return total / this.focuses.size;
  }
}

class AttentionalShiftingSystem {
  private shifts: Map<string, any> = new Map();
  registerShift(shiftType: string, switchingSpeed: number): any {
    const id = `as_${Date.now()}`;
    const item = { id, shift_type: shiftType, switching_speed: Math.max(0, Math.min(1, switchingSpeed)), task_switching_efficiency: Math.max(0, Math.min(1, Math.random())), cognitive_flexibility: Math.max(0, Math.min(1, Math.random())), reorienting_capacity: Math.max(0, Math.min(1, Math.random())) };
    this.shifts.set(id, item);
    return item;
  }
  getAverageShift(): number {
    if (this.shifts.size === 0) return 0.6;
    const total = Array.from(this.shifts.values()).reduce((sum, s) => sum + s.switching_speed, 0);
    return total / this.shifts.size;
  }
}

class AttentionalCapacitySystem {
  private capacities: Map<string, any> = new Map();
  registerCapacity(capacityDomain: string, resourceAvailability: number): any {
    const id = `ac_${Date.now()}`;
    const item = { id, capacity_domain: capacityDomain, resource_availability: Math.max(0, Math.min(1, resourceAvailability)), parallel_processing_strength: Math.max(0, Math.min(1, Math.random())), load_tolerance: Math.max(0, Math.min(1, Math.random())), bottleneck_mitigation: Math.max(0, Math.min(1, Math.random())) };
    this.capacities.set(id, item);
    return item;
  }
  getAverageCapacity(): number {
    if (this.capacities.size === 0) return 0.6;
    const total = Array.from(this.capacities.values()).reduce((sum, c) => sum + c.resource_availability, 0);
    return total / this.capacities.size;
  }
}

export class AttentionFocusSystem {
  private selectiveAttention: SelectiveAttentionSystem;
  private sustainedFocus: SustainedFocusSystem;
  private attentionalShifting: AttentionalShiftingSystem;
  private attentionalCapacity: AttentionalCapacitySystem;
  private selectiveAttentionQuality: number = 0.6;
  private sustainedFocusStrength: number = 0.6;
  private attentionalShiftingEfficiency: number = 0.6;
  private attentionalCapacityLevel: number = 0.6;

  constructor() {
    this.selectiveAttention = new SelectiveAttentionSystem();
    this.sustainedFocus = new SustainedFocusSystem();
    this.attentionalShifting = new AttentionalShiftingSystem();
    this.attentionalCapacity = new AttentionalCapacitySystem();
  }

  registerAttention(targetStimulus: string, salience: number): void {
    this.selectiveAttention.registerAttention(targetStimulus, salience);
    this.selectiveAttentionQuality = this.selectiveAttention.getAverageAttention();
  }

  registerFocus(focusDomain: string, duration: number): void {
    this.sustainedFocus.registerFocus(focusDomain, duration);
    this.sustainedFocusStrength = this.sustainedFocus.getAverageFocus();
  }

  registerShift(shiftType: string, switchingSpeed: number): void {
    this.attentionalShifting.registerShift(shiftType, switchingSpeed);
    this.attentionalShiftingEfficiency = this.attentionalShifting.getAverageShift();
  }

  registerCapacity(capacityDomain: string, resourceAvailability: number): void {
    this.attentionalCapacity.registerCapacity(capacityDomain, resourceAvailability);
    this.attentionalCapacityLevel = this.attentionalCapacity.getAverageCapacity();
  }

  updateMetrics(): void {
    this.selectiveAttentionQuality = this.selectiveAttention.getAverageAttention();
    this.sustainedFocusStrength = this.sustainedFocus.getAverageFocus();
    this.attentionalShiftingEfficiency = this.attentionalShifting.getAverageShift();
    this.attentionalCapacityLevel = this.attentionalCapacity.getAverageCapacity();
  }

  getAttentionFocusState(): AttentionFocusState {
    this.updateMetrics();
    return {
      selective_attention_quality: this.selectiveAttentionQuality,
      sustained_focus_strength: this.sustainedFocusStrength,
      attentional_shifting_efficiency: this.attentionalShiftingEfficiency,
      attentional_capacity_level: this.attentionalCapacityLevel,
      attention_control_effectiveness: (this.selectiveAttentionQuality + this.attentionalShiftingEfficiency) / 2,
      focus_stability: (this.sustainedFocusStrength + this.attentionalCapacityLevel) / 2,
      attentional_cognition_integration: (this.selectiveAttentionQuality + this.sustainedFocusStrength + this.attentionalCapacityLevel) / 3,
      timestamp_ms: Date.now()
    };
  }

  getAttentionFocusMetrics(): AttentionFocusMetrics {
    return {
      selective_attention_accuracy: this.selectiveAttentionQuality,
      sustained_focus_capacity: this.sustainedFocusStrength,
      attentional_shifting_speed: this.attentionalShiftingEfficiency,
      attentional_resource_efficiency: this.attentionalCapacityLevel,
      task_focus_quality: (this.sustainedFocusStrength + this.selectiveAttentionQuality) / 2,
      attention_persistence_strength: (this.sustainedFocusStrength + this.attentionalCapacityLevel) / 2,
      overall_attention_strength: (this.selectiveAttentionQuality + this.sustainedFocusStrength + this.attentionalShiftingEfficiency + this.attentionalCapacityLevel) / 4
    };
  }
}

export * from './types';
