import { PlanningState, PlanningMetrics } from './types';
import {
  GoalRepresentationSystem,
  PlanStructureSystem,
  ProgressTrackingSystem,
  GoalConflictSystem,
  MotivationDynamicsSystem,
  GoalAchievementSystem
} from './planning-systems';

export class PlanningGoalPursuitSystem {
  private goalRep: GoalRepresentationSystem;
  private planStr: PlanStructureSystem;
  private progress: ProgressTrackingSystem;
  private conflict: GoalConflictSystem;
  private motivation: MotivationDynamicsSystem;
  private achievement: GoalAchievementSystem;

  private activeGoals: number = 0;
  private avgImportance: number = 0.5;
  private avgFeasibility: number = 0.6;
  private avgProgress: number = 0;
  private avgMotivation: number = 0.5;
  private conflictFrequency: number = 0;
  private achievementRate: number = 0;

  constructor() {
    this.goalRep = new GoalRepresentationSystem();
    this.planStr = new PlanStructureSystem();
    this.progress = new ProgressTrackingSystem();
    this.conflict = new GoalConflictSystem();
    this.motivation = new MotivationDynamicsSystem();
    this.achievement = new GoalAchievementSystem();
  }

  createGoal(individual: string, desc: string, type: string, importance: number, feasibility: number, timeframe: number): void {
    this.goalRep.createGoal(individual, desc, type, importance, feasibility, timeframe);
    this.activeGoals++;
    this.avgImportance = this.goalRep.getAverageImportance();
  }

  createPlan(goalId: string, complexity: number, depth: number, clarity: number, flex: number, contingency: number): void {
    this.planStr.createPlan(goalId, complexity, depth, clarity, flex, contingency);
  }

  trackProgress(planId: string, progress: number, time: number, resources: number, satisfaction: number, difficulty: number): void {
    this.progress.trackProgress(planId, progress, time, resources, satisfaction, difficulty);
    this.avgProgress = this.progress.getAverageProgress();
  }

  identifyConflict(individual: string, goalA: string, goalB: string, type: string, intensity: number, strategy: string): void {
    this.conflict.identifyConflict(individual, goalA, goalB, type, intensity, strategy);
    this.conflictFrequency++;
  }

  recordMotivation(goalId: string, initial: number, current: number, commitment: number, efficacy: number): void {
    this.motivation.recordMotivationDynamics(goalId, initial, current, commitment, efficacy);
    this.avgMotivation = this.motivation.getAverageMotivation();
  }

  recordAchievement(planId: string, goalId: string, status: string, quality: number, timeEff: number, resEff: number, satisfaction: number): void {
    this.achievement.recordAchievement(planId, goalId, status, quality, timeEff, resEff, satisfaction);
    this.achievementRate = this.achievement.getAchievementRate();
  }

  updateMetrics(): void {
    this.avgImportance = this.goalRep.getAverageImportance();
    this.avgProgress = this.progress.getAverageProgress();
    this.avgMotivation = this.motivation.getAverageMotivation();
    this.achievementRate = this.achievement.getAchievementRate();
  }

  getState(): PlanningState {
    this.updateMetrics();
    return {
      active_goals: this.activeGoals,
      average_goal_importance: this.avgImportance,
      average_goal_feasibility: this.avgFeasibility,
      average_progress_percentage: this.avgProgress * 100,
      average_motivation_level: this.avgMotivation,
      goal_conflict_frequency: this.conflictFrequency,
      achievement_rate: this.achievementRate,
      timestamp_ms: Date.now()
    };
  }

  getMetrics(): PlanningMetrics {
    return {
      planning_quality: (this.planStr.getAverageClarity() + this.avgFeasibility) / 2,
      goal_achievement_rate: this.achievementRate,
      plan_completion_efficiency: this.avgProgress * (this.avgMotivation),
      motivation_maintenance_level: this.avgMotivation,
      conflict_resolution_effectiveness: 1 - this.conflict.getAverageConflictIntensity(),
      goal_adaptation_rate: 0.5 + Math.random() * 0.3,
      temporal_estimation_accuracy: 0.6 + Math.random() * 0.3
    };
  }

  resetState(): void {
    this.activeGoals = 0;
    this.avgImportance = 0.5;
    this.avgFeasibility = 0.6;
    this.avgProgress = 0;
    this.avgMotivation = 0.5;
    this.conflictFrequency = 0;
    this.achievementRate = 0;
  }
}

export {
  GoalRepresentationSystem,
  PlanStructureSystem,
  ProgressTrackingSystem,
  GoalConflictSystem,
  MotivationDynamicsSystem,
  GoalAchievementSystem
} from './planning-systems';
export * from './types';
