import { GoalRepresentation, PlanningExecution, CognitiveControl, WorkingMemoryManagement, ExecutiveFunctionState, ExecutiveFunctionMetrics } from './types';

class GoalRepresentationSystem {
  private goals: Map<string, any> = new Map();
  registerGoal(goalType: string, clarity: number): any {
    const id = `gr_${Date.now()}`;
    const item = { id, goal_type: goalType, goal_clarity: Math.max(0, Math.min(1, clarity)), hierarchy_level: Math.max(0, Math.min(1, Math.random())), temporal_structure: Math.max(0, Math.min(1, Math.random())), goal_commitment: Math.max(0, Math.min(1, Math.random())) };
    this.goals.set(id, item);
    return item;
  }
  getAverageGoal(): number {
    if (this.goals.size === 0) return 0.6;
    const total = Array.from(this.goals.values()).reduce((sum, g) => sum + g.goal_clarity, 0);
    return total / this.goals.size;
  }
}

class PlanningExecutionSystem {
  private plans: Map<string, any> = new Map();
  registerPlan(planType: string, strategy: number): any {
    const id = `pe_${Date.now()}`;
    const item = { id, plan_type: planType, strategy_development: Math.max(0, Math.min(1, strategy)), step_sequencing: Math.max(0, Math.min(1, Math.random())), contingency_planning: Math.max(0, Math.min(1, Math.random())), execution_coordination: Math.max(0, Math.min(1, Math.random())) };
    this.plans.set(id, item);
    return item;
  }
  getAveragePlan(): number {
    if (this.plans.size === 0) return 0.6;
    const total = Array.from(this.plans.values()).reduce((sum, p) => sum + p.strategy_development, 0);
    return total / this.plans.size;
  }
}

class CognitiveControlSystem {
  private controls: Map<string, any> = new Map();
  registerControl(controlDomain: string, inhibition: number): any {
    const id = `cc_${Date.now()}`;
    const item = { id, control_domain: controlDomain, inhibition_strength: Math.max(0, Math.min(1, inhibition)), interference_suppression: Math.max(0, Math.min(1, Math.random())), response_flexibility: Math.max(0, Math.min(1, Math.random())), control_adjustment: Math.max(0, Math.min(1, Math.random())) };
    this.controls.set(id, item);
    return item;
  }
  getAverageControl(): number {
    if (this.controls.size === 0) return 0.6;
    const total = Array.from(this.controls.values()).reduce((sum, c) => sum + c.inhibition_strength, 0);
    return total / this.controls.size;
  }
}

class WorkingMemoryManagementSystem {
  private memories: Map<string, any> = new Map();
  registerMemory(memoryType: string, holding: number): any {
    const id = `wmm_${Date.now()}`;
    const item = { id, memory_type: memoryType, information_holding: Math.max(0, Math.min(1, holding)), mental_manipulation: Math.max(0, Math.min(1, Math.random())), focus_maintenance: Math.max(0, Math.min(1, Math.random())), dual_task_performance: Math.max(0, Math.min(1, Math.random())) };
    this.memories.set(id, item);
    return item;
  }
  getAverageMemory(): number {
    if (this.memories.size === 0) return 0.6;
    const total = Array.from(this.memories.values()).reduce((sum, m) => sum + m.information_holding, 0);
    return total / this.memories.size;
  }
}

export class ExecutiveFunctionSystem {
  private goalRepresentation: GoalRepresentationSystem;
  private planningExecution: PlanningExecutionSystem;
  private cognitiveControl: CognitiveControlSystem;
  private workingMemoryManagement: WorkingMemoryManagementSystem;
  private goalQuality: number = 0.6;
  private planningEffectiveness: number = 0.6;
  private controlStrength: number = 0.6;
  private memoryQuality: number = 0.6;

  constructor() {
    this.goalRepresentation = new GoalRepresentationSystem();
    this.planningExecution = new PlanningExecutionSystem();
    this.cognitiveControl = new CognitiveControlSystem();
    this.workingMemoryManagement = new WorkingMemoryManagementSystem();
  }

  registerGoal(goalType: string, clarity: number): void {
    this.goalRepresentation.registerGoal(goalType, clarity);
    this.goalQuality = this.goalRepresentation.getAverageGoal();
  }

  registerPlan(planType: string, strategy: number): void {
    this.planningExecution.registerPlan(planType, strategy);
    this.planningEffectiveness = this.planningExecution.getAveragePlan();
  }

  registerControl(controlDomain: string, inhibition: number): void {
    this.cognitiveControl.registerControl(controlDomain, inhibition);
    this.controlStrength = this.cognitiveControl.getAverageControl();
  }

  registerMemory(memoryType: string, holding: number): void {
    this.workingMemoryManagement.registerMemory(memoryType, holding);
    this.memoryQuality = this.workingMemoryManagement.getAverageMemory();
  }

  updateMetrics(): void {
    this.goalQuality = this.goalRepresentation.getAverageGoal();
    this.planningEffectiveness = this.planningExecution.getAveragePlan();
    this.controlStrength = this.cognitiveControl.getAverageControl();
    this.memoryQuality = this.workingMemoryManagement.getAverageMemory();
  }

  getExecutiveFunctionState(): ExecutiveFunctionState {
    this.updateMetrics();
    return {
      goal_representation_quality: this.goalQuality,
      planning_execution_effectiveness: this.planningEffectiveness,
      cognitive_control_strength: this.controlStrength,
      working_memory_management_quality: this.memoryQuality,
      executive_coordination_effectiveness: (this.goalQuality + this.planningEffectiveness + this.controlStrength) / 3,
      cognitive_flexibility_strength: (this.controlStrength + this.memoryQuality) / 2,
      executive_cognition_integration: (this.goalQuality + this.planningEffectiveness + this.controlStrength + this.memoryQuality) / 4,
      timestamp_ms: Date.now()
    };
  }

  getExecutiveFunctionMetrics(): ExecutiveFunctionMetrics {
    return {
      goal_clarity_strength: this.goalQuality,
      planning_quality_rating: this.planningEffectiveness,
      cognitive_control_effectiveness: this.controlStrength,
      working_memory_capacity_strength: this.memoryQuality,
      task_completion_efficiency: (this.planningEffectiveness + this.controlStrength) / 2,
      adaptive_response_quality: (this.controlStrength + this.memoryQuality) / 2,
      overall_executive_strength: (this.goalQuality + this.planningEffectiveness + this.controlStrength + this.memoryQuality) / 4
    };
  }
}

export * from './types';
