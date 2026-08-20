import {
  GoalRepresentation,
  PlanStructure,
  ProgressTracking,
  GoalConflict,
  MotivationDynamics,
  GoalAchievement
} from './types';

export class GoalRepresentationSystem {
  private goals: Map<string, GoalRepresentation> = new Map();
  private history: Array<{ timestamp: number; goalId: string }> = [];

  createGoal(individual: string, description: string, type: string, importance: number, feasibility: number, timeframe: number): GoalRepresentation {
    const goalId = `goal_${Date.now()}`;
    const goal: GoalRepresentation = {
      goal_id: goalId,
      individual: individual,
      goal_description: description,
      goal_type: type,
      goal_importance: Math.max(0, Math.min(1, importance)),
      goal_feasibility: Math.max(0, Math.min(1, feasibility)),
      temporal_scope: timeframe
    };
    this.goals.set(goalId, goal);
    this.history.push({ timestamp: Date.now(), goalId });
    if (this.history.length > 500) this.history.shift();
    return goal;
  }

  getGoal(goalId: string): GoalRepresentation | null {
    return this.goals.get(goalId) || null;
  }

  getAverageImportance(): number {
    if (this.goals.size === 0) return 0.5;
    const total = Array.from(this.goals.values()).reduce((sum, g) => sum + g.goal_importance, 0);
    return total / this.goals.size;
  }
}

export class PlanStructureSystem {
  private plans: Map<string, PlanStructure> = new Map();

  createPlan(goalId: string, complexity: number, depth: number, clarity: number, flexibility: number, contingency: number): PlanStructure {
    const planId = `plan_${Date.now()}`;
    const plan: PlanStructure = {
      plan_id: planId,
      goal_id: goalId,
      plan_complexity: Math.max(0, Math.min(1, complexity)),
      hierarchical_depth: depth,
      step_clarity: Math.max(0, Math.min(1, clarity)),
      plan_flexibility: Math.max(0, Math.min(1, flexibility)),
      contingency_planning: Math.max(0, Math.min(1, contingency))
    };
    this.plans.set(planId, plan);
    return plan;
  }

  getPlan(planId: string): PlanStructure | null {
    return this.plans.get(planId) || null;
  }

  getAverageClarity(): number {
    if (this.plans.size === 0) return 0.6;
    const total = Array.from(this.plans.values()).reduce((sum, p) => sum + p.step_clarity, 0);
    return total / this.plans.size;
  }
}

export class ProgressTrackingSystem {
  private tracking: Map<string, ProgressTracking> = new Map();

  trackProgress(planId: string, progress: number, timeElapsed: number, resources: number, satisfaction: number, difficulty: number): ProgressTracking {
    const trackingId = `track_${Date.now()}`;
    const track: ProgressTracking = {
      tracking_id: trackingId,
      plan_id: planId,
      progress_percentage: Math.max(0, Math.min(100, progress)),
      time_elapsed: timeElapsed,
      resources_invested: Math.max(0, Math.min(1, resources)),
      satisfaction_with_progress: Math.max(0, Math.min(1, satisfaction)),
      difficulty_encountered: Math.max(0, Math.min(1, difficulty))
    };
    this.tracking.set(trackingId, track);
    return track;
  }

  getTracking(trackingId: string): ProgressTracking | null {
    return this.tracking.get(trackingId) || null;
  }

  getAverageProgress(): number {
    if (this.tracking.size === 0) return 0;
    const total = Array.from(this.tracking.values()).reduce((sum, t) => sum + t.progress_percentage, 0);
    return total / this.tracking.size / 100;
  }
}

export class GoalConflictSystem {
  private conflicts: Map<string, GoalConflict> = new Map();

  identifyConflict(individual: string, goalA: string, goalB: string, type: string, intensity: number, strategy: string): GoalConflict {
    const conflictId = `conflict_${Date.now()}`;
    const conflict: GoalConflict = {
      conflict_id: conflictId,
      individual: individual,
      goal_a: goalA,
      goal_b: goalB,
      conflict_type: type,
      conflict_intensity: Math.max(0, Math.min(1, intensity)),
      resolution_strategy: strategy
    };
    this.conflicts.set(conflictId, conflict);
    return conflict;
  }

  getConflict(conflictId: string): GoalConflict | null {
    return this.conflicts.get(conflictId) || null;
  }

  getAverageConflictIntensity(): number {
    if (this.conflicts.size === 0) return 0;
    const total = Array.from(this.conflicts.values()).reduce((sum, c) => sum + c.conflict_intensity, 0);
    return total / this.conflicts.size;
  }
}

export class MotivationDynamicsSystem {
  private dynamics: Map<string, MotivationDynamics> = new Map();

  recordMotivationDynamics(goalId: string, initialMotivation: number, currentMotivation: number, commitment: number, efficacy: number): MotivationDynamics {
    const trajectory = currentMotivation > initialMotivation ? 'increasing' : (currentMotivation < initialMotivation ? 'decreasing' : 'stable');
    const dynamicsId = `dyn_${Date.now()}`;
    const dynamic: MotivationDynamics = {
      dynamics_id: dynamicsId,
      goal_id: goalId,
      initial_motivation: Math.max(0, Math.min(1, initialMotivation)),
      current_motivation: Math.max(0, Math.min(1, currentMotivation)),
      motivation_trajectory: trajectory,
      commitment_level: Math.max(0, Math.min(1, commitment)),
      self_efficacy: Math.max(0, Math.min(1, efficacy))
    };
    this.dynamics.set(dynamicsId, dynamic);
    return dynamic;
  }

  getDynamics(dynamicsId: string): MotivationDynamics | null {
    return this.dynamics.get(dynamicsId) || null;
  }

  getAverageMotivation(): number {
    if (this.dynamics.size === 0) return 0.5;
    const total = Array.from(this.dynamics.values()).reduce((sum, d) => sum + d.current_motivation, 0);
    return total / this.dynamics.size;
  }
}

export class GoalAchievementSystem {
  private achievements: Map<string, GoalAchievement> = new Map();

  recordAchievement(planId: string, goalId: string, status: string, quality: number, timeEfficiency: number, resourceEfficiency: number, satisfaction: number): GoalAchievement {
    const achievementId = `achieve_${Date.now()}`;
    const achievement: GoalAchievement = {
      achievement_id: achievementId,
      plan_id: planId,
      goal_id: goalId,
      achievement_status: status,
      outcome_quality: Math.max(0, Math.min(1, quality)),
      time_efficiency: Math.max(0, Math.min(1, timeEfficiency)),
      resource_efficiency: Math.max(0, Math.min(1, resourceEfficiency)),
      satisfaction_with_outcome: Math.max(0, Math.min(1, satisfaction))
    };
    this.achievements.set(achievementId, achievement);
    return achievement;
  }

  getAchievement(achievementId: string): GoalAchievement | null {
    return this.achievements.get(achievementId) || null;
  }

  getAchievementRate(): number {
    if (this.achievements.size === 0) return 0;
    const completed = Array.from(this.achievements.values()).filter(a => a.achievement_status === 'completed').length;
    return completed / this.achievements.size;
  }
}
