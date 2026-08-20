import { RewardProcessing, MotivationalDrive, RewardLearning, IncentiveEvaluation, RewardMotivationState, RewardMotivationMetrics } from './types';

class RewardProcessingSystem {
  private processings: Map<string, any> = new Map();
  registerReward(rewardType: string, salience: number): any {
    const id = `rp_${Date.now()}`;
    const item = { id, reward_type: rewardType, reward_salience: Math.max(0, Math.min(1, salience)), motivational_value: Math.max(0, Math.min(1, Math.random())), reward_prediction: Math.max(0, Math.min(1, Math.random())), value_coding: Math.max(0, Math.min(1, Math.random())) };
    this.processings.set(id, item);
    return item;
  }
  getAverageRewardProcessing(): number {
    if (this.processings.size === 0) return 0.6;
    const total = Array.from(this.processings.values()).reduce((sum, p) => sum + p.reward_salience, 0);
    return total / this.processings.size;
  }
}

class MotivationalDriveSystem {
  private drives: Map<string, any> = new Map();
  registerDrive(driveType: string, intensity: number): any {
    const id = `md_${Date.now()}`;
    const item = { id, drive_type: driveType, drive_intensity: Math.max(0, Math.min(1, intensity)), goal_directedness: Math.max(0, Math.min(1, Math.random())), persistence_strength: Math.max(0, Math.min(1, Math.random())), motivational_sustainability: Math.max(0, Math.min(1, Math.random())) };
    this.drives.set(id, item);
    return item;
  }
  getAverageDrive(): number {
    if (this.drives.size === 0) return 0.6;
    const total = Array.from(this.drives.values()).reduce((sum, d) => sum + d.drive_intensity, 0);
    return total / this.drives.size;
  }
}

class RewardLearningSystem {
  private learnings: Map<string, any> = new Map();
  registerRewardLearning(domain: string, reinforcement: number): any {
    const id = `rl_${Date.now()}`;
    const item = { id, learning_domain: domain, reinforcement_strength: Math.max(0, Math.min(1, reinforcement)), association_formation: Math.max(0, Math.min(1, Math.random())), behavioral_adaptation: Math.max(0, Math.min(1, Math.random())), reward_generalization: Math.max(0, Math.min(1, Math.random())) };
    this.learnings.set(id, item);
    return item;
  }
  getAverageLearning(): number {
    if (this.learnings.size === 0) return 0.6;
    const total = Array.from(this.learnings.values()).reduce((sum, l) => sum + l.reinforcement_strength, 0);
    return total / this.learnings.size;
  }
}

class IncentiveEvaluationSystem {
  private evaluations: Map<string, any> = new Map();
  registerIncentive(incentiveType: string, attractiveness: number): any {
    const id = `ie_${Date.now()}`;
    const item = { id, incentive_type: incentiveType, incentive_attractiveness: Math.max(0, Math.min(1, attractiveness)), cost_benefit_analysis: Math.max(0, Math.min(1, Math.random())), decision_facilitation: Math.max(0, Math.min(1, Math.random())), approach_motivation: Math.max(0, Math.min(1, Math.random())) };
    this.evaluations.set(id, item);
    return item;
  }
  getAverageEvaluation(): number {
    if (this.evaluations.size === 0) return 0.6;
    const total = Array.from(this.evaluations.values()).reduce((sum, e) => sum + e.incentive_attractiveness, 0);
    return total / this.evaluations.size;
  }
}

export class RewardMotivationSystem {
  private rewardProcessing: RewardProcessingSystem;
  private motivationalDrive: MotivationalDriveSystem;
  private rewardLearning: RewardLearningSystem;
  private incentiveEvaluation: IncentiveEvaluationSystem;
  private totalRewardExperiences: number = 0;
  private rewardProcessingSensitivity: number = 0.6;
  private motivationalDriveLevel: number = 0.6;
  private rewardLearningStrength: number = 0.6;
  private incentiveEvaluationQuality: number = 0.6;

  constructor() {
    this.rewardProcessing = new RewardProcessingSystem();
    this.motivationalDrive = new MotivationalDriveSystem();
    this.rewardLearning = new RewardLearningSystem();
    this.incentiveEvaluation = new IncentiveEvaluationSystem();
  }

  registerReward(rewardType: string, salience: number): void {
    this.rewardProcessing.registerReward(rewardType, salience);
    this.rewardProcessingSensitivity = this.rewardProcessing.getAverageRewardProcessing();
    this.totalRewardExperiences++;
  }

  registerDrive(driveType: string, intensity: number): void {
    this.motivationalDrive.registerDrive(driveType, intensity);
    this.motivationalDriveLevel = this.motivationalDrive.getAverageDrive();
  }

  registerRewardLearning(domain: string, reinforcement: number): void {
    this.rewardLearning.registerRewardLearning(domain, reinforcement);
    this.rewardLearningStrength = this.rewardLearning.getAverageLearning();
  }

  registerIncentive(incentiveType: string, attractiveness: number): void {
    this.incentiveEvaluation.registerIncentive(incentiveType, attractiveness);
    this.incentiveEvaluationQuality = this.incentiveEvaluation.getAverageEvaluation();
  }

  updateMetrics(): void {
    this.rewardProcessingSensitivity = this.rewardProcessing.getAverageRewardProcessing();
    this.motivationalDriveLevel = this.motivationalDrive.getAverageDrive();
    this.rewardLearningStrength = this.rewardLearning.getAverageLearning();
    this.incentiveEvaluationQuality = this.incentiveEvaluation.getAverageEvaluation();
  }

  getRewardMotivationState(): RewardMotivationState {
    this.updateMetrics();
    return {
      total_reward_experiences: this.totalRewardExperiences,
      reward_processing_sensitivity: this.rewardProcessingSensitivity,
      motivational_drive_level: this.motivationalDriveLevel,
      reward_learning_strength: this.rewardLearningStrength,
      incentive_evaluation_quality: this.incentiveEvaluationQuality,
      goal_pursuit_intensity: (this.motivationalDriveLevel + this.incentiveEvaluationQuality) / 2,
      motivation_sustainability_level: (this.rewardLearningStrength + this.motivationalDriveLevel) / 2,
      timestamp_ms: Date.now()
    };
  }

  getRewardMotivationMetrics(): RewardMotivationMetrics {
    return {
      reward_sensitivity_rate: this.rewardProcessingSensitivity,
      motivational_drive_strength: this.motivationalDriveLevel,
      reward_learning_efficiency: this.rewardLearningStrength,
      incentive_salience_strength: this.incentiveEvaluationQuality,
      goal_persistence_capacity: (this.motivationalDriveLevel + this.rewardLearningStrength) / 2,
      motivation_sustainability_quality: (this.rewardLearningStrength + this.motivationalDriveLevel) / 2,
      overall_reward_motivation_strength: (this.rewardProcessingSensitivity + this.motivationalDriveLevel + this.rewardLearningStrength + this.incentiveEvaluationQuality) / 4
    };
  }
}

export * from './types';
