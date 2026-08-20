import { AgencyState, AgencyMetrics } from './types';
import {
  VoluntaryActionSystem,
  SenseOfAgencySystem,
  MotorIntentionSystem,
  ExecutiveFunctionSystem
} from './agency-systems';

export class SenseOfAgencyVolitionalSystem {
  private action: VoluntaryActionSystem;
  private agency: SenseOfAgencySystem;
  private intention: MotorIntentionSystem;
  private executive: ExecutiveFunctionSystem;

  private totalActionsInitiated: number = 0;
  private avgAgency: number = 0.6;
  private avgVolition: number = 0.6;
  private executiveLevel: number = 0.6;
  private intentionality: number = 0.6;
  private freeWill: number = 0.6;
  private controlEffectiveness: number = 0.6;

  constructor() {
    this.action = new VoluntaryActionSystem();
    this.agency = new SenseOfAgencySystem();
    this.intention = new MotorIntentionSystem();
    this.executive = new ExecutiveFunctionSystem();
  }

  initiateAction(desc: string, clarity: number, auth: number, control: number, delib: number): void {
    this.action.initiateAction(desc, clarity, auth, control, delib);
    this.totalActionsInitiated++;
    this.controlEffectiveness = this.action.getAverageControlStrength();
  }

  assessAgency(actionId: string, strength: number, resp: number, vol: number, free: number): void {
    this.agency.assessAgency(actionId, strength, resp, vol, free);
    this.avgAgency = this.agency.getAverageAgencyStrength();
  }

  formIntention(goal: string, strength: number, commit: number, ready: number, spec: number): void {
    this.intention.formIntention(goal, strength, commit, ready, spec);
    this.intentionality = this.intention.getAverageIntentionStrength();
  }

  executeFunction(type: string, quality: number, efficacy: number, directedness: number): void {
    this.executive.executeFunction(type, quality, efficacy, directedness);
    this.executiveLevel = this.executive.getAverageExecutiveQuality();
  }

  updateMetrics(): void {
    this.avgAgency = this.agency.getAverageAgencyStrength();
    this.intentionality = this.intention.getAverageIntentionStrength();
    this.executiveLevel = this.executive.getAverageExecutiveQuality();
    this.avgVolition = (this.intentionality + this.avgAgency) / 2;
  }

  getAgencyState(): AgencyState {
    this.updateMetrics();
    return {
      total_actions_initiated: this.totalActionsInitiated,
      average_sense_of_agency: this.avgAgency,
      average_volitional_strength: this.avgVolition,
      executive_function_level: this.executiveLevel,
      intentionality_clarity: this.intentionality,
      free_will_experience_level: this.freeWill,
      action_control_effectiveness: this.controlEffectiveness,
      timestamp_ms: Date.now()
    };
  }

  getAgencyMetrics(): AgencyMetrics {
    return {
      agency_coherence: this.avgAgency,
      volitional_control_strength: this.avgVolition,
      intention_action_alignment: (this.intentionality + this.controlEffectiveness) / 2,
      executive_efficiency: this.executiveLevel,
      sense_of_responsibility: this.avgAgency * 0.9,
      action_initiation_propensity: Math.min(1, this.totalActionsInitiated / 100),
      autonomous_control_rate: (this.avgAgency + this.avgVolition) / 2
    };
  }

  resetAgencyState(): void {
    this.totalActionsInitiated = 0;
    this.avgAgency = 0.6;
    this.avgVolition = 0.6;
    this.executiveLevel = 0.6;
    this.intentionality = 0.6;
    this.freeWill = 0.6;
    this.controlEffectiveness = 0.6;
  }
}

export {
  VoluntaryActionSystem,
  SenseOfAgencySystem,
  MotorIntentionSystem,
  ExecutiveFunctionSystem
} from './agency-systems';
export * from './types';
