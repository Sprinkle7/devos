import { SensorimotorSchema, ProprioceptiveAwareness, MotorPlanning, SomaticAwareness } from './types';

export class SensorimotorSchemaSystem {
  private schemas: Map<string, SensorimotorSchema> = new Map();
  private history: Array<{ timestamp: number; schemaId: string }> = [];

  registerSchema(actionType: string, sensoryPred: number, motorExec: number, feedbackInt: number, learningEff: number): SensorimotorSchema {
    const schemaId = `schema_${Date.now()}`;
    const schema: SensorimotorSchema = {
      schema_id: schemaId,
      action_type: actionType,
      sensory_prediction: Math.max(0, Math.min(1, sensoryPred)),
      motor_execution: Math.max(0, Math.min(1, motorExec)),
      feedback_integration: Math.max(0, Math.min(1, feedbackInt)),
      learning_efficiency: Math.max(0, Math.min(1, learningEff))
    };
    this.schemas.set(schemaId, schema);
    this.history.push({ timestamp: Date.now(), schemaId });
    if (this.history.length > 500) this.history.shift();
    return schema;
  }

  getSchema(schemaId: string): SensorimotorSchema | null {
    return this.schemas.get(schemaId) || null;
  }

  getAverageSensoriomotorQuality(): number {
    if (this.schemas.size === 0) return 0.6;
    const total = Array.from(this.schemas.values()).reduce((sum, s) => sum + s.motor_execution, 0);
    return total / this.schemas.size;
  }
}

export class ProprioceptiveAwarenessSystem {
  private awarenesses: Map<string, ProprioceptiveAwareness> = new Map();

  registerAwareness(bodyPart: string, positionAcc: number, movementMon: number, kinestheticViv: number, posturalCoh: number): ProprioceptiveAwareness {
    const awarenessId = `prop_${Date.now()}`;
    const awareness: ProprioceptiveAwareness = {
      awareness_id: awarenessId,
      body_part: bodyPart,
      position_accuracy: Math.max(0, Math.min(1, positionAcc)),
      movement_monitoring: Math.max(0, Math.min(1, movementMon)),
      kinesthetic_vividness: Math.max(0, Math.min(1, kinestheticViv)),
      postural_coherence: Math.max(0, Math.min(1, posturalCoh))
    };
    this.awarenesses.set(awarenessId, awareness);
    return awareness;
  }

  getAwareness(awarenessId: string): ProprioceptiveAwareness | null {
    return this.awarenesses.get(awarenessId) || null;
  }

  getAverageProprioceptiveAccuracy(): number {
    if (this.awarenesses.size === 0) return 0.6;
    const total = Array.from(this.awarenesses.values()).reduce((sum, a) => sum + a.position_accuracy, 0);
    return total / this.awarenesses.size;
  }
}

export class MotorPlanningSystem {
  private plans: Map<string, MotorPlanning> = new Map();

  formMotorPlan(actionGoal: string, trajectoryPrec: number, movementSmooth: number, motorEff: number, adaptationCap: number): MotorPlanning {
    const planId = `plan_${Date.now()}`;
    const plan: MotorPlanning = {
      plan_id: planId,
      action_goal: actionGoal,
      trajectory_precision: Math.max(0, Math.min(1, trajectoryPrec)),
      movement_smoothness: Math.max(0, Math.min(1, movementSmooth)),
      motor_efficiency: Math.max(0, Math.min(1, motorEff)),
      adaptation_capacity: Math.max(0, Math.min(1, adaptationCap))
    };
    this.plans.set(planId, plan);
    return plan;
  }

  getPlan(planId: string): MotorPlanning | null {
    return this.plans.get(planId) || null;
  }

  getAverageMotorPlanningQuality(): number {
    if (this.plans.size === 0) return 0.6;
    const total = Array.from(this.plans.values()).reduce((sum, p) => sum + p.trajectory_precision, 0);
    return total / this.plans.size;
  }
}

export class SomaticAwarenessSystem {
  private awarenesses: Map<string, SomaticAwareness> = new Map();

  registerSomaticAwareness(bodySensation: string, sensationClarity: number, embodiedUnderstanding: number, visceralAwareness: number, integratedBodySense: number): SomaticAwareness {
    const somaticId = `somatic_${Date.now()}`;
    const awareness: SomaticAwareness = {
      somatic_id: somaticId,
      body_sensation: bodySensation,
      sensation_clarity: Math.max(0, Math.min(1, sensationClarity)),
      embodied_understanding: Math.max(0, Math.min(1, embodiedUnderstanding)),
      visceral_awareness: Math.max(0, Math.min(1, visceralAwareness)),
      integrated_body_sense: Math.max(0, Math.min(1, integratedBodySense))
    };
    this.awarenesses.set(somaticId, awareness);
    return awareness;
  }

  getAwareness(somaticId: string): SomaticAwareness | null {
    return this.awarenesses.get(somaticId) || null;
  }

  getAverageSomaticDepth(): number {
    if (this.awarenesses.size === 0) return 0.6;
    const total = Array.from(this.awarenesses.values()).reduce((sum, a) => sum + a.embodied_understanding, 0);
    return total / this.awarenesses.size;
  }
}
