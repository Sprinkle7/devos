import { CognitiveSystemM145State, CognitiveSystemM145Metrics } from "./types";

class CoreSubsystem {
  private data = new Map<string, { id: string; value: number }>();

  registerItem(value: number) {
    const id = "m145_" + Date.now();
    this.data.set(id, { id, value: Math.max(0, Math.min(1, value)) });
  }

  getAverage(): number {
    if (this.data.size === 0) return 0.6;
    const total = Array.from(this.data.values()).reduce((sum, item) => sum + item.value, 0);
    return total / this.data.size;
  }
}

export class CognitiveSystemM145 {
  private core = new CoreSubsystem();
  private metric = 0.6;

  registerItem(value: number): void {
    this.core.registerItem(value);
    this.metric = this.core.getAverage();
  }

  updateMetrics(): void {
    this.metric = this.core.getAverage();
  }

  getState(): CognitiveSystemM145State {
    this.updateMetrics();
    return {
      metric_1: this.metric,
      metric_2: this.metric,
      metric_3: this.metric,
      timestamp_ms: Date.now(),
    };
  }

  getMetrics(): CognitiveSystemM145Metrics {
    return {
      strength: this.metric,
      efficiency: this.metric,
      quality: this.metric,
      overall: this.metric,
    };
  }
}

export * from "./types";
