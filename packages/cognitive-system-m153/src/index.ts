import { EmbodiedState, EmbodiedMetrics } from './types';
import {
  SensorimotorSchemaSystem,
  ProprioceptiveAwarenessSystem,
  MotorPlanningSystem,
  SomaticAwarenessSystem
} from './sensorimotor-systems';

export class EmbodiedCognitionSystem {
  private sensorimotor: SensorimotorSchemaSystem;
  private proprioceptive: ProprioceptiveAwarenessSystem;
  private motorPlanning: MotorPlanningSystem;
  private somatic: SomaticAwarenessSystem;

  private totalSensorimotorInteractions: number = 0;
  private avgMotorExecution: number = 0.6;
  private avgFeedbackIntegration: number = 0.6;
  private proprioceptiveAccuracy: number = 0.6;
  private motorPlanningEfficiency: number = 0.6;
  private embodiedCognitionIntegration: number = 0.6;
  private somaticAwarenessDepth: number = 0.6;

  constructor() {
    this.sensorimotor = new SensorimotorSchemaSystem();
    this.proprioceptive = new ProprioceptiveAwarenessSystem();
    this.motorPlanning = new MotorPlanningSystem();
    this.somatic = new SomaticAwarenessSystem();
  }

  registerSensorimotorSchema(actionType: string, sensoryPred: number, motorExec: number, feedbackInt: number, learningEff: number): void {
    this.sensorimotor.registerSchema(actionType, sensoryPred, motorExec, feedbackInt, learningEff);
    this.totalSensorimotorInteractions++;
    this.avgMotorExecution = this.sensorimotor.getAverageSensoriomotorQuality();
  }

  registerProprioceptiveAwareness(bodyPart: string, positionAcc: number, movementMon: number, kinestheticViv: number, posturalCoh: number): void {
    this.proprioceptive.registerAwareness(bodyPart, positionAcc, movementMon, kinestheticViv, posturalCoh);
    this.proprioceptiveAccuracy = this.proprioceptive.getAverageProprioceptiveAccuracy();
  }

  formMotorPlan(actionGoal: string, trajectoryPrec: number, movementSmooth: number, motorEff: number, adaptationCap: number): void {
    this.motorPlanning.formMotorPlan(actionGoal, trajectoryPrec, movementSmooth, motorEff, adaptationCap);
    this.motorPlanningEfficiency = this.motorPlanning.getAverageMotorPlanningQuality();
  }

  registerSomaticAwareness(bodySensation: string, sensationClarity: number, embodiedUnderstanding: number, visceralAwareness: number, integratedBodySense: number): void {
    this.somatic.registerSomaticAwareness(bodySensation, sensationClarity, embodiedUnderstanding, visceralAwareness, integratedBodySense);
    this.somaticAwarenessDepth = this.somatic.getAverageSomaticDepth();
  }

  updateMetrics(): void {
    this.avgMotorExecution = this.sensorimotor.getAverageSensoriomotorQuality();
    this.proprioceptiveAccuracy = this.proprioceptive.getAverageProprioceptiveAccuracy();
    this.motorPlanningEfficiency = this.motorPlanning.getAverageMotorPlanningQuality();
    this.somaticAwarenessDepth = this.somatic.getAverageSomaticDepth();
    this.embodiedCognitionIntegration = (this.avgMotorExecution + this.proprioceptiveAccuracy + this.motorPlanningEfficiency + this.somaticAwarenessDepth) / 4;
    this.avgFeedbackIntegration = (this.avgMotorExecution + this.proprioceptiveAccuracy) / 2;
  }

  getEmbodiedState(): EmbodiedState {
    this.updateMetrics();
    return {
      total_sensorimotor_interactions: this.totalSensorimotorInteractions,
      average_motor_execution_quality: this.avgMotorExecution,
      average_feedback_integration: this.avgFeedbackIntegration,
      proprioceptive_accuracy_level: this.proprioceptiveAccuracy,
      motor_planning_efficiency: this.motorPlanningEfficiency,
      embodied_cognition_integration: this.embodiedCognitionIntegration,
      somatic_awareness_depth: this.somaticAwarenessDepth,
      timestamp_ms: Date.now()
    };
  }

  getEmbodiedMetrics(): EmbodiedMetrics {
    return {
      sensorimotor_learning_rate: (this.avgMotorExecution + this.avgFeedbackIntegration) / 2,
      motor_control_precision: this.avgMotorExecution,
      proprioceptive_calibration_quality: this.proprioceptiveAccuracy,
      embodied_understanding_depth: this.somaticAwarenessDepth,
      action_perception_coupling_strength: (this.avgMotorExecution + this.proprioceptiveAccuracy) / 2,
      adaptive_motor_capability: this.motorPlanningEfficiency,
      somatic_integration_coherence: (this.somaticAwarenessDepth + this.proprioceptiveAccuracy) / 2
    };
  }

  resetEmbodiedState(): void {
    this.totalSensorimotorInteractions = 0;
    this.avgMotorExecution = 0.6;
    this.avgFeedbackIntegration = 0.6;
    this.proprioceptiveAccuracy = 0.6;
    this.motorPlanningEfficiency = 0.6;
    this.embodiedCognitionIntegration = 0.6;
    this.somaticAwarenessDepth = 0.6;
  }
}

export {
  SensorimotorSchemaSystem,
  ProprioceptiveAwarenessSystem,
  MotorPlanningSystem,
  SomaticAwarenessSystem
} from './sensorimotor-systems';
export * from './types';
