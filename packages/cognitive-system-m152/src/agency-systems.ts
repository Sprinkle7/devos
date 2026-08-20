import { VoluntaryAction, SenseOfAgency, MotorIntention, ExecutiveFunction } from './types';

export class VoluntaryActionSystem {
  private actions: Map<string, VoluntaryAction> = new Map();
  private history: Array<{ timestamp: number; actionId: string }> = [];

  initiateAction(description: string, clarity: number, authorship: number, control: number, deliberation: number): VoluntaryAction {
    const actionId = `act_${Date.now()}`;
    const action: VoluntaryAction = {
      action_id: actionId,
      action_description: description,
      intention_clarity: Math.max(0, Math.min(1, clarity)),
      action_authorship: Math.max(0, Math.min(1, authorship)),
      sense_of_control: Math.max(0, Math.min(1, control)),
      deliberation_level: Math.max(0, Math.min(1, deliberation))
    };
    this.actions.set(actionId, action);
    this.history.push({ timestamp: Date.now(), actionId });
    if (this.history.length > 500) this.history.shift();
    return action;
  }

  getAction(actionId: string): VoluntaryAction | null {
    return this.actions.get(actionId) || null;
  }

  getAverageControlStrength(): number {
    if (this.actions.size === 0) return 0.6;
    const total = Array.from(this.actions.values()).reduce((sum, a) => sum + a.sense_of_control, 0);
    return total / this.actions.size;
  }
}

export class SenseOfAgencySystem {
  private agencies: Map<string, SenseOfAgency> = new Map();

  assessAgency(actionId: string, strength: number, responsibility: number, volitional: number, freeWill: number): SenseOfAgency {
    const agencyId = `agency_${Date.now()}`;
    const agency: SenseOfAgency = {
      agency_id: agencyId,
      action_id: actionId,
      agency_strength: Math.max(0, Math.min(1, strength)),
      causal_responsibility: Math.max(0, Math.min(1, responsibility)),
      volitional_presence: Math.max(0, Math.min(1, volitional)),
      free_will_perception: Math.max(0, Math.min(1, freeWill))
    };
    this.agencies.set(agencyId, agency);
    return agency;
  }

  getAgency(agencyId: string): SenseOfAgency | null {
    return this.agencies.get(agencyId) || null;
  }

  getAverageAgencyStrength(): number {
    if (this.agencies.size === 0) return 0.6;
    const total = Array.from(this.agencies.values()).reduce((sum, a) => sum + a.agency_strength, 0);
    return total / this.agencies.size;
  }
}

export class MotorIntentionSystem {
  private intentions: Map<string, MotorIntention> = new Map();

  formIntention(goal: string, strength: number, commitment: number, readiness: number, specificity: number): MotorIntention {
    const intentionId = `int_${Date.now()}`;
    const intention: MotorIntention = {
      intention_id: intentionId,
      goal: goal,
      intention_strength: Math.max(0, Math.min(1, strength)),
      commitment_level: Math.max(0, Math.min(1, commitment)),
      action_readiness: Math.max(0, Math.min(1, readiness)),
      implementation_specificity: Math.max(0, Math.min(1, specificity))
    };
    this.intentions.set(intentionId, intention);
    return intention;
  }

  getIntention(intentionId: string): MotorIntention | null {
    return this.intentions.get(intentionId) || null;
  }

  getAverageIntentionStrength(): number {
    if (this.intentions.size === 0) return 0.6;
    const total = Array.from(this.intentions.values()).reduce((sum, i) => sum + i.intention_strength, 0);
    return total / this.intentions.size;
  }
}

export class ExecutiveFunctionSystem {
  private executives: Map<string, ExecutiveFunction> = new Map();

  executeFunction(type: string, quality: number, efficacy: number, directedness: number): ExecutiveFunction {
    const executiveId = `exec_${Date.now()}`;
    const executive: ExecutiveFunction = {
      executive_id: executiveId,
      function_type: type,
      execution_quality: Math.max(0, Math.min(1, quality)),
      decision_efficacy: Math.max(0, Math.min(1, efficacy)),
      goal_directedness: Math.max(0, Math.min(1, directedness))
    };
    this.executives.set(executiveId, executive);
    return executive;
  }

  getExecutive(executiveId: string): ExecutiveFunction | null {
    return this.executives.get(executiveId) || null;
  }

  getAverageExecutiveQuality(): number {
    if (this.executives.size === 0) return 0.6;
    const total = Array.from(this.executives.values()).reduce((sum, e) => sum + e.execution_quality, 0);
    return total / this.executives.size;
  }
}
