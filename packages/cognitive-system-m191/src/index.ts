import {NoveltyPreferenceState, NoveltyPreferenceMetrics} from './types';

class Subsystem {
  private data: Map<string, any> = new Map();
  registerItem(value: number): any {
    const id = `m191_${Date.now()}`;
    const item = { id, value: Math.max(0, Math.min(1, value)) };
    this.data.set(id, item);
    return item;
  }
  getAverage(): number {
    if (this.data.size === 0) return 0.6;
    const total = Array.from(this.data.values()).reduce((sum, d) => sum + d.value, 0);
    return total / this.data.size;
  }
}

export class NoveltyPreference {
  private subsystem: Subsystem;
  private metric: number = 0.6;

  constructor() {
    this.subsystem = new Subsystem();
  }

  registerItem(value: number): void {
    this.subsystem.registerItem(value);
    this.metric = this.subsystem.getAverage();
  }

  updateMetrics(): void {
    this.metric = this.subsystem.getAverage();
  }

  getState(): NoveltyPreferenceState {
    this.updateMetrics();
    return {
      metric_1: this.metric,
      metric_2: this.metric,
      metric_3: this.metric,
      integration: this.metric,
      timestamp_ms: Date.now()
    };
  }

  getMetrics(): NoveltyPreferenceMetrics {
    return {
      strength: this.metric,
      efficiency: this.metric,
      quality: this.metric,
      overall: this.metric
    };
  }
}

export * from './types';
