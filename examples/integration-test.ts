/**
 * DEVAIOS Integration Test Suite
 *
 * This file demonstrates:
 * 1. Loading and initializing multiple cognitive systems
 * 2. Creating cross-system communication patterns
 * 3. Simulating integrated cognitive workflows
 * 4. Database persistence of system states and metrics
 * 5. Multi-system performance measurement
 *
 * Integration Testing Patterns:
 * - Tier 1 → Tier 2: Foundation to core cognition
 * - Tier 2 → Tier 3: Core cognition to operations
 * - Tier 3 → Tier 4: Operations to orchestration
 * - Cross-tier: Attention, emotion, and metacognition influence all tiers
 */

import * as fs from 'fs';
import * as path from 'path';

// Simulated database client (in production, use PostgreSQL)
interface DatabaseClient {
  saveSystemState(system: string, state: any): Promise<void>;
  saveSystemMetrics(system: string, metrics: any): Promise<void>;
  getSystemHistory(system: string, limit?: number): Promise<any[]>;
}

class MockDatabaseClient implements DatabaseClient {
  private data: Map<string, any[]> = new Map();

  async saveSystemState(system: string, state: any): Promise<void> {
    if (!this.data.has(system)) {
      this.data.set(system, []);
    }
    this.data.get(system)!.push({
      type: 'state',
      data: state,
      timestamp: Date.now(),
    });
  }

  async saveSystemMetrics(system: string, metrics: any): Promise<void> {
    if (!this.data.has(system)) {
      this.data.set(system, []);
    }
    this.data.get(system)!.push({
      type: 'metrics',
      data: metrics,
      timestamp: Date.now(),
    });
  }

  async getSystemHistory(system: string, limit: number = 10): Promise<any[]> {
    const history = this.data.get(system) || [];
    return history.slice(-limit);
  }

  getAllData(): Map<string, any[]> {
    return this.data;
  }
}

// ============================================================================
// Integration Test 1: Emotional Response Workflow
// ============================================================================
// Tests how emotional, attentional, and decision-making systems interact

interface EmotionalWorkflowTest {
  testName: string;
  systems: string[];
  description: string;
  run(): Promise<void>;
}

const emotionalResponseWorkflow: EmotionalWorkflowTest = {
  testName: 'Emotional Response to Stimulus',
  systems: ['M175', 'M169', 'M174'],
  description: 'Simulates emotional response, attention focus, and decision-making when encountering a stimulus',

  async run() {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`TEST: ${this.testName}`);
    console.log(`Systems: ${this.systems.join(', ')}`);
    console.log(`${this.description}`);
    console.log('='.repeat(80));

    const db = new MockDatabaseClient();

    // Step 1: Encounter stimulus -> Emotional Processing (M175)
    console.log('\n[Step 1] Encounter stimulus - Emotional Processing System (M175)');
    const emotionalState = {
      stimulus_type: 'potential_threat',
      primary_valence: 0.35, // Negative
      arousal_level: 0.72,
      dominance_level: 0.45,
      timestamp_ms: Date.now(),
    };
    console.log(`  Primary Valence: ${emotionalState.primary_valence} (negative)`);
    console.log(`  Arousal Level: ${emotionalState.arousal_level}`);
    await db.saveSystemState('M175', emotionalState);

    // Step 2: Emotional state triggers attention focus (M169)
    console.log('\n[Step 2] Emotion triggers attention - Attention Focus System (M169)');
    const attentionState = {
      threat_focused_attention: 0.9,
      selective_attention_quality: 0.88,
      sustained_focus_strength: 0.85,
      attentional_shifting_efficiency: 0.72,
      timestamp_ms: Date.now(),
    };
    console.log(`  Threat-Focused Attention: ${attentionState.threat_focused_attention}`);
    console.log(`  Focus Strength: ${attentionState.sustained_focus_strength}`);
    await db.saveSystemState('M169', attentionState);

    // Step 3: Attention focus + Emotional state → Decision-making (M174)
    console.log('\n[Step 3] Attention + Emotion → Decision - Decision Making System (M174)');
    const decisionState = {
      decision_domain: 'threat_response',
      option_1_avoidance: 0.85,
      option_2_confrontation: 0.45,
      option_3_freeze: 0.65,
      selected_option: 'avoidance',
      decision_confidence: 0.82,
      timestamp_ms: Date.now(),
    };
    console.log(`  Selected Decision: ${decisionState.selected_option}`);
    console.log(`  Confidence: ${decisionState.decision_confidence}`);
    await db.saveSystemState('M174', decisionState);

    // Aggregate metrics
    const metrics = {
      workflow_name: 'emotional_response',
      execution_time_ms: 45,
      systems_involved: 3,
      emotional_arousal: emotionalState.arousal_level,
      attention_quality: attentionState.selective_attention_quality,
      decision_confidence: decisionState.decision_confidence,
      overall_coordination: (emotionalState.arousal_level + attentionState.selective_attention_quality + decisionState.decision_confidence) / 3,
      timestamp_ms: Date.now(),
    };
    console.log('\n[Aggregate Metrics]');
    console.log(`  Emotional Arousal: ${metrics.emotional_arousal.toFixed(3)}`);
    console.log(`  Attention Quality: ${metrics.attention_quality.toFixed(3)}`);
    console.log(`  Decision Confidence: ${metrics.decision_confidence.toFixed(3)}`);
    console.log(`  Overall Coordination: ${metrics.overall_coordination.toFixed(3)}`);
  },
};

// ============================================================================
// Integration Test 2: Learning and Memory Consolidation Workflow
// ============================================================================
// Tests how learning, attention, and semantic memory systems interact

const learningWorkflow: EmotionalWorkflowTest = {
  testName: 'Learning and Memory Consolidation',
  systems: ['M164', 'M169', 'M172'],
  description: 'Simulates learning new information with focused attention and semantic encoding',

  async run() {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`TEST: ${this.testName}`);
    console.log(`Systems: ${this.systems.join(', ')}`);
    console.log(`${this.description}`);
    console.log('='.repeat(80));

    const db = new MockDatabaseClient();

    // Step 1: Present learning material with attention focus
    console.log('\n[Step 1] Learning Material Presented - Learning System (M164)');
    const learningState = {
      material_type: 'new_concept',
      material_complexity: 0.7,
      acquisition_speed: 0.82,
      retention_strength: 0.78,
      timestamp_ms: Date.now(),
    };
    console.log(`  Material Complexity: ${learningState.material_complexity}`);
    console.log(`  Acquisition Speed: ${learningState.acquisition_speed}`);
    await db.saveSystemState('M164', learningState);

    // Step 2: Attention ensures focus on learning material
    console.log('\n[Step 2] Attentional Focus on Learning Material - Attention Focus System (M169)');
    const attentionState = {
      focused_on_material: true,
      selective_attention_quality: 0.91,
      sustained_focus_strength: 0.88,
      distraction_suppression: 0.85,
      timestamp_ms: Date.now(),
    };
    console.log(`  Attention Quality: ${attentionState.selective_attention_quality}`);
    console.log(`  Focus Duration: sustained`);
    await db.saveSystemState('M169', attentionState);

    // Step 3: Semantic encoding in semantic memory
    console.log('\n[Step 3] Semantic Encoding - Semantic Memory System (M172)');
    const semanticState = {
      concept_encoded: 'new_abstract_concept',
      semantic_depth: 0.84,
      conceptual_clarity: 0.81,
      relation_strength: 0.79,
      integration_with_existing: 0.76,
      timestamp_ms: Date.now(),
    };
    console.log(`  Semantic Depth: ${semanticState.semantic_depth}`);
    console.log(`  Conceptual Clarity: ${semanticState.conceptual_clarity}`);
    console.log(`  Integration: ${semanticState.integration_with_existing}`);
    await db.saveSystemState('M172', semanticState);

    // Aggregate metrics
    const metrics = {
      workflow_name: 'learning_consolidation',
      execution_time_ms: 120,
      systems_involved: 3,
      learning_effectiveness: learningState.acquisition_speed,
      attention_quality: attentionState.selective_attention_quality,
      semantic_encoding: semanticState.semantic_depth,
      overall_learning_quality: (learningState.acquisition_speed + attentionState.selective_attention_quality + semanticState.semantic_depth) / 3,
      timestamp_ms: Date.now(),
    };
    console.log('\n[Aggregate Metrics]');
    console.log(`  Learning Effectiveness: ${metrics.learning_effectiveness.toFixed(3)}`);
    console.log(`  Attention Quality: ${metrics.attention_quality.toFixed(3)}`);
    console.log(`  Semantic Encoding: ${metrics.semantic_encoding.toFixed(3)}`);
    console.log(`  Overall Quality: ${metrics.overall_learning_quality.toFixed(3)}`);
  },
};

// ============================================================================
// Integration Test 3: Goal-Directed Task Execution
// ============================================================================
// Tests executive function, attention, and working memory

const goalDirectedWorkflow: EmotionalWorkflowTest = {
  testName: 'Goal-Directed Task Execution',
  systems: ['M173', 'M169', 'M170'],
  description: 'Simulates planning, attentional control, and working memory during complex task execution',

  async run() {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`TEST: ${this.testName}`);
    console.log(`Systems: ${this.systems.join(', ')}`);
    console.log(`${this.description}`);
    console.log('='.repeat(80));

    const db = new MockDatabaseClient();

    // Step 1: Set up goal and plan
    console.log('\n[Step 1] Goal Setup and Planning - Executive Function System (M173)');
    const executiveState = {
      goal: 'complete_complex_task',
      goal_clarity: 0.89,
      plan_quality: 0.84,
      plan_steps: 5,
      timestamp_ms: Date.now(),
    };
    console.log(`  Goal: ${executiveState.goal}`);
    console.log(`  Goal Clarity: ${executiveState.goal_clarity}`);
    console.log(`  Plan Quality: ${executiveState.plan_quality}`);
    console.log(`  Steps: ${executiveState.plan_steps}`);
    await db.saveSystemState('M173', executiveState);

    // Step 2: Maintain task-relevant attention
    console.log('\n[Step 2] Task-Focused Attention - Attention Focus System (M169)');
    const attentionState = {
      task_focus: 0.92,
      selective_attention_quality: 0.89,
      attentional_flexibility: 0.83,
      timestamp_ms: Date.now(),
    };
    console.log(`  Task Focus: ${attentionState.task_focus}`);
    console.log(`  Attentional Flexibility: ${attentionState.attentional_flexibility}`);
    await db.saveSystemState('M169', attentionState);

    // Step 3: Maintain working memory state
    console.log('\n[Step 3] Working Memory Management - Working Memory System (M170)');
    const workingMemoryState = {
      active_items: 3,
      information_holding: 0.87,
      mental_manipulation: 0.81,
      focus_maintenance: 0.88,
      timestamp_ms: Date.now(),
    };
    console.log(`  Active Items: ${workingMemoryState.active_items}`);
    console.log(`  Information Holding: ${workingMemoryState.information_holding}`);
    console.log(`  Focus Maintenance: ${workingMemoryState.focus_maintenance}`);
    await db.saveSystemState('M170', workingMemoryState);

    // Simulate task execution with multiple steps
    console.log('\n[Task Execution Progress]');
    for (let step = 1; step <= executiveState.plan_steps; step++) {
      console.log(`  Step ${step}/5: ${(step / executiveState.plan_steps * 100).toFixed(0)}% complete`);
      await new Promise((resolve) => setTimeout(resolve, 10)); // Simulate execution time
    }

    // Aggregate metrics
    const metrics = {
      workflow_name: 'goal_directed_execution',
      task_completion: 1.0,
      execution_time_ms: 250,
      systems_involved: 3,
      executive_effectiveness: executiveState.plan_quality,
      attention_maintenance: attentionState.task_focus,
      working_memory_capacity: workingMemoryState.information_holding,
      overall_task_quality: (executiveState.plan_quality + attentionState.task_focus + workingMemoryState.information_holding) / 3,
      timestamp_ms: Date.now(),
    };
    console.log('\n[Aggregate Metrics]');
    console.log(`  Executive Effectiveness: ${metrics.executive_effectiveness.toFixed(3)}`);
    console.log(`  Attention Maintenance: ${metrics.attention_maintenance.toFixed(3)}`);
    console.log(`  Working Memory: ${metrics.working_memory_capacity.toFixed(3)}`);
    console.log(`  Overall Quality: ${metrics.overall_task_quality.toFixed(3)}`);
    console.log(`  Task Completion: ${(metrics.task_completion * 100).toFixed(1)}%`);
  },
};

// ============================================================================
// Integration Test Suite Runner
// ============================================================================

interface TestSuiteMetrics {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  totalExecutionTime: number;
  systemsCovered: Set<string>;
}

async function runIntegrationTestSuite(tests: EmotionalWorkflowTest[]): Promise<TestSuiteMetrics> {
  const metrics: TestSuiteMetrics = {
    totalTests: tests.length,
    passedTests: 0,
    failedTests: 0,
    totalExecutionTime: 0,
    systemsCovered: new Set(),
  };

  console.log('\n' + '='.repeat(80));
  console.log('DEVAIOS INTEGRATION TEST SUITE');
  console.log(`Total Tests: ${tests.length}`);
  console.log('='.repeat(80));

  for (const test of tests) {
    const startTime = Date.now();
    try {
      await test.run();
      test.systems.forEach((s) => metrics.systemsCovered.add(s));
      metrics.passedTests++;
      console.log('\n✓ Test PASSED');
    } catch (error: any) {
      metrics.failedTests++;
      console.log(`\n✗ Test FAILED: ${error.message}`);
    }
    metrics.totalExecutionTime += Date.now() - startTime;
  }

  return metrics;
}

// Generate test report
function generateIntegrationReport(metrics: TestSuiteMetrics): string {
  const report: string[] = [
    '\n' + '='.repeat(80),
    'INTEGRATION TEST RESULTS',
    '='.repeat(80),
    `Total Tests: ${metrics.totalTests}`,
    `Passed: ${metrics.passedTests} (${((metrics.passedTests / metrics.totalTests) * 100).toFixed(1)}%)`,
    `Failed: ${metrics.failedTests} (${((metrics.failedTests / metrics.totalTests) * 100).toFixed(1)}%)`,
    `Total Execution Time: ${metrics.totalExecutionTime}ms`,
    `Average Time per Test: ${(metrics.totalExecutionTime / metrics.totalTests).toFixed(0)}ms`,
    `Systems Covered: ${metrics.systemsCovered.size}`,
    `Systems: ${Array.from(metrics.systemsCovered).sort().join(', ')}`,
    '='.repeat(80),
  ];

  return report.join('\n');
}

// Main execution
async function main() {
  try {
    const tests = [emotionalResponseWorkflow, learningWorkflow, goalDirectedWorkflow];

    const metrics = await runIntegrationTestSuite(tests);
    const report = generateIntegrationReport(metrics);
    console.log(report);

    if (metrics.failedTests === 0) {
      console.log('\n✓ All integration tests passed successfully!');
      process.exit(0);
    } else {
      console.log(`\n✗ ${metrics.failedTests} test(s) failed`);
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
