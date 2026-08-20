import {
  AttentionalControl,
  ConflictMonitoring,
  FocusMaintenanceRegulation,
  AlertnessModulation
} from './types';

export class AttentionalControlSystem {
  private controls: Map<string, AttentionalControl> = new Map();
  private history: Array<{ timestamp: number; controlId: string }> = [];

  controlAttention(stimulus: string, inhibition: number, alignment: number, responseInhibition: number): AttentionalControl {
    const controlId = `ctrl_${Date.now()}`;
    const effectiveness = (inhibition + alignment + responseInhibition) / 3;
    const control: AttentionalControl = {
      control_id: controlId,
      target_stimulus: stimulus,
      inhibition_strength: Math.max(0, Math.min(1, inhibition)),
      goal_alignment: Math.max(0, Math.min(1, alignment)),
      response_inhibition: Math.max(0, Math.min(1, responseInhibition)),
      control_effectiveness: effectiveness
    };
    this.controls.set(controlId, control);
    this.history.push({ timestamp: Date.now(), controlId });
    if (this.history.length > 500) this.history.shift();
    return control;
  }

  getControl(controlId: string): AttentionalControl | null {
    return this.controls.get(controlId) || null;
  }

  getAverageControlEffectiveness(): number {
    if (this.controls.size === 0) return 0.6;
    const total = Array.from(this.controls.values()).reduce((sum, c) => sum + c.control_effectiveness, 0);
    return total / this.controls.size;
  }
}

export class ConflictMonitoringSystem {
  private conflicts: Map<string, ConflictMonitoring> = new Map();

  detectConflict(type: string, level: number, errorLikelihood: number, adaptation: number): ConflictMonitoring {
    const conflictId = `conf_${Date.now()}`;
    const conflict: ConflictMonitoring = {
      conflict_id: conflictId,
      conflict_type: type,
      conflict_level: Math.max(0, Math.min(1, level)),
      error_likelihood: Math.max(0, Math.min(1, errorLikelihood)),
      adaptation_strength: Math.max(0, Math.min(1, adaptation))
    };
    this.conflicts.set(conflictId, conflict);
    return conflict;
  }

  getConflict(conflictId: string): ConflictMonitoring | null {
    return this.conflicts.get(conflictId) || null;
  }

  getConflictDetectionRate(): number {
    return this.conflicts.size;
  }
}

export class FocusMaintenanceRegulationSystem {
  private maintenances: Map<string, FocusMaintenanceRegulation> = new Map();

  maintainFocus(task: string, duration: number, stability: number, resistance: number, effort: number): FocusMaintenanceRegulation {
    const maintenanceId = `maint_${Date.now()}`;
    const maintenance: FocusMaintenanceRegulation = {
      maintenance_id: maintenanceId,
      task_type: task,
      sustained_focus_duration: duration,
      focus_stability: Math.max(0, Math.min(1, stability)),
      distraction_resistance: Math.max(0, Math.min(1, resistance)),
      effort_investment: Math.max(0, Math.min(1, effort))
    };
    this.maintenances.set(maintenanceId, maintenance);
    return maintenance;
  }

  getMaintenance(maintenanceId: string): FocusMaintenanceRegulation | null {
    return this.maintenances.get(maintenanceId) || null;
  }

  getAverageFocusStability(): number {
    if (this.maintenances.size === 0) return 0.6;
    const total = Array.from(this.maintenances.values()).reduce((sum, m) => sum + m.focus_stability, 0);
    return total / this.maintenances.size;
  }
}

export class AlertnessModulationSystem {
  private alertnesses: Map<string, AlertnessModulation> = new Map();

  modulateAertness(baseline: number, responsiveness: number, fatigue: number, arousal: number): AlertnessModulation {
    const alertnessId = `alert_${Date.now()}`;
    const alertness: AlertnessModulation = {
      alertness_id: alertnessId,
      baseline_alertness: Math.max(0, Math.min(1, baseline)),
      task_demand_responsiveness: Math.max(0, Math.min(1, responsiveness)),
      fatigue_resistance: Math.max(0, Math.min(1, fatigue)),
      arousal_optimization: Math.max(0, Math.min(1, arousal))
    };
    this.alertnesses.set(alertnessId, alertness);
    return alertness;
  }

  getAertness(alertnessId: string): AlertnessModulation | null {
    return this.alertnesses.get(alertnessId) || null;
  }

  getAverageAlertnessLevel(): number {
    if (this.alertnesses.size === 0) return 0.6;
    const total = Array.from(this.alertnesses.values()).reduce((sum, a) => sum + a.baseline_alertness, 0);
    return total / this.alertnesses.size;
  }
}
