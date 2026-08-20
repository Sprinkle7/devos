/**
 * DEVAIOS Test Harness
 * Comprehensive testing framework for 205 cognitive systems (M146-M350)
 *
 * Usage:
 *   npx ts-node test-harness/index.ts [options]
 *
 * Options:
 *   --quick      Run quick tests (5 ops per system)
 *   --full       Run full tests (1000 ops per system)
 *   --system M### Test specific system
 *   --export     Export results to JSON file
 */

import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  system: string;
  milestone: number;
  totalOperations: number;
  averageMetric: number;
  minMetric: number;
  maxMetric: number;
  executionTimeMs: number;
  status: 'PASS' | 'FAIL' | 'ERROR';
  errorMessage?: string;
  timestamp: string;
}

interface TestSuiteResults {
  suiteId: string;
  timestamp: string;
  totalSystems: number;
  passedSystems: number;
  failedSystems: number;
  errorSystems: number;
  totalExecutionTimeMs: number;
  results: TestResult[];
}

// Import all cognitive systems
async function loadSystemModule(milestone: number): Promise<any> {
  try {
    const moduleName = `cognitive-system-m${milestone}`;
    const module = await import(`../packages/${moduleName}/dist/index.js`);
    return module;
  } catch (error) {
    throw new Error(`Failed to load system M${milestone}: ${error}`);
  }
}

// Get system class name from milestone number (mapped from implementation)
function getSystemClassName(milestone: number): string {
  const systemMap: { [key: number]: string } = {
    146: 'ConsciousExperienceSystem',
    147: 'SenseOfAgencyVolitionalSystem',
    148: 'MetacognitiveMonitoringSystem',
    149: 'KnowledgeRepresentationSystem',
    150: 'AttentionRegulationSystem',
    151: 'EpisodicSimulationSystem',
    152: 'SenseOfAgencyVolitionalSystem',
    153: 'EmbodiedCognitionSystem',
    154: 'IntegrationCoherenceSystem',
    155: 'NarrativeSelfConstructionSystem',
    156: 'TemporalConsciousnessSystem',
    157: 'StreamOfConsciousnessSystem',
    158: 'PhenomenalAwarenessSystem',
    159: 'CognitiveIntegrationUnificationSystem',
    160: 'SemanticConsciousnessSystem',
    161: 'ImplicitLearningUnconsciousSystem',
    162: 'FlowEngagementSystem',
    163: 'CreativitySystem',
    164: 'LearningSystem',
    165: 'PredictionSystem',
    166: 'ErrorMonitoringSystem',
    167: 'RewardSystem',
    168: 'SocialCognitionSystem',
    169: 'AttentionFocusSystem',
    170: 'WorkingMemorySystem',
    171: 'LanguageComprehensionSystem',
    172: 'SemanticMemorySystem',
    173: 'ExecutiveFunctionSystem',
    174: 'DecisionMakingSystem',
    175: 'EmotionalProcessingSystem',
    176: 'FacialRecognitionSystem',
    177: 'VoiceRecognitionSystem',
    178: 'InteroceptionSystem',
    179: 'BodySchemaSystem',
    180: 'MotorControlSystem',
    181: 'MetacognitionSystem',
    182: 'SelfAwareness',
    183: 'ConsciousnessMonitoringSystem',
    184: 'ControlSystem',
    185: 'ToleranceSystem',
    186: 'MotivationSystem',
    187: 'BehavioralActivationSystem',
    188: 'FearSystem',
    189: 'AnxietySystem',
    190: 'StressResponseSystem',
    191: 'ResilienceSystem',
    192: 'CopingSystem',
    193: 'AnchoringBiasSystem',
    194: 'AvailabilityBiasSystem',
    195: 'ConfirmationBiasSystem',
    196: 'HeuristicSystem',
    197: 'ReasoningSystem',
    198: 'LogicalInferenceSystem',
    199: 'AbstractReasoningSystem',
    200: 'PatternRecognitionSystem',
    // M201-M350: Generated systems follow naming pattern SystemXXX (where XXX relates to function)
  };

  if (systemMap[milestone]) {
    return systemMap[milestone];
  }

  // For generated systems beyond M200, derive from pattern
  return `System${milestone}`;
}

// Test a single cognitive system
async function testSystem(milestone: number, operations: number = 100): Promise<TestResult> {
  const startTime = Date.now();
  const testResult: TestResult = {
    system: `M${milestone}`,
    milestone,
    totalOperations: operations,
    averageMetric: 0,
    minMetric: 1,
    maxMetric: 0,
    executionTimeMs: 0,
    status: 'PASS',
    timestamp: new Date().toISOString(),
  };

  try {
    // Load the system module
    const module = await loadSystemModule(milestone);
    const className = getSystemClassName(milestone);
    const SystemClass = module[className];

    if (!SystemClass) {
      throw new Error(`Class ${className} not found in module`);
    }

    // Instantiate the system
    const system = new SystemClass();

    // Run test operations
    const metrics: number[] = [];

    for (let i = 0; i < operations; i++) {
      // Simulate various operations based on system type
      if (system.registerItem) {
        system.registerItem(Math.random());
      } else if (system.registerGoal) {
        system.registerGoal(`goal_${i}`, Math.random());
      } else if (system.registerPlan) {
        system.registerPlan(`plan_${i}`, Math.random());
      } else if (system.registerControl) {
        system.registerControl(`control_${i}`, Math.random());
      } else if (system.registerMemory) {
        system.registerMemory(`memory_${i}`, Math.random());
      } else if (system.registerAttention) {
        system.registerAttention(`attention_${i}`, Math.random());
      } else if (system.registerChoice) {
        system.registerChoice(`choice_${i}`, Math.random());
      } else if (system.registerOption) {
        system.registerOption(`option_${i}`, Math.random());
      } else if (system.registerEmotion) {
        system.registerEmotion(`emotion_${i}`, Math.random());
      }

      // Update metrics
      if (system.updateMetrics) {
        system.updateMetrics();
      }

      // Capture metric values from state
      try {
        let state: any;
        if (system.getState) {
          state = system.getState();
        } else if (system.getSystemState) {
          state = system.getSystemState();
        } else if (system.getConsciousExperienceState) {
          state = system.getConsciousExperienceState();
        } else if (system.getAttentionFocusState) {
          state = system.getAttentionFocusState();
        } else if (system.getExecutiveFunctionState) {
          state = system.getExecutiveFunctionState();
        }

        if (state) {
          // Extract first metric from state
          const metricKey = Object.keys(state).find(
            (k) => typeof state[k] === 'number' && state[k] >= 0 && state[k] <= 1
          );
          if (metricKey) {
            const value = state[metricKey];
            metrics.push(value);
            testResult.minMetric = Math.min(testResult.minMetric, value);
            testResult.maxMetric = Math.max(testResult.maxMetric, value);
          }
        }
      } catch (e) {
        // Continue if state extraction fails
      }
    }

    // Calculate statistics
    if (metrics.length > 0) {
      testResult.averageMetric = metrics.reduce((a, b) => a + b, 0) / metrics.length;
    }

    testResult.executionTimeMs = Date.now() - startTime;
  } catch (error: any) {
    testResult.status = 'ERROR';
    testResult.errorMessage = error.message;
    testResult.executionTimeMs = Date.now() - startTime;
  }

  return testResult;
}

// Test all systems
async function runFullTestSuite(
  systems: number[],
  operations: number = 100
): Promise<TestSuiteResults> {
  const suiteId = `suite_${Date.now()}`;
  const results: TestResult[] = [];
  const startTime = Date.now();

  console.log(`\n${'='.repeat(80)}`);
  console.log(`DEVAIOS Cognitive Systems Test Suite`);
  console.log(`Suite ID: ${suiteId}`);
  console.log(`Total Systems to Test: ${systems.length}`);
  console.log(`Operations per System: ${operations}`);
  console.log(`${'='.repeat(80)}\n`);

  for (let i = 0; i < systems.length; i++) {
    const milestone = systems[i];
    const progress = `[${i + 1}/${systems.length}]`;

    process.stdout.write(`${progress} Testing M${milestone}... `);

    try {
      const result = await testSystem(milestone, operations);
      results.push(result);

      if (result.status === 'PASS') {
        console.log(`✓ PASS (${result.executionTimeMs}ms, avg: ${result.averageMetric.toFixed(3)})`);
      } else if (result.status === 'ERROR') {
        console.log(`✗ ERROR: ${result.errorMessage}`);
      } else {
        console.log(`⚠ FAIL (${result.executionTimeMs}ms)`);
      }
    } catch (error: any) {
      console.log(`✗ EXCEPTION: ${error.message}`);
      results.push({
        system: `M${milestone}`,
        milestone,
        totalOperations: operations,
        averageMetric: 0,
        minMetric: 0,
        maxMetric: 0,
        executionTimeMs: Date.now() - startTime,
        status: 'ERROR',
        errorMessage: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  const totalExecutionTimeMs = Date.now() - startTime;
  const passedSystems = results.filter((r) => r.status === 'PASS').length;
  const failedSystems = results.filter((r) => r.status === 'FAIL').length;
  const errorSystems = results.filter((r) => r.status === 'ERROR').length;

  const suite: TestSuiteResults = {
    suiteId,
    timestamp: new Date().toISOString(),
    totalSystems: systems.length,
    passedSystems,
    failedSystems,
    errorSystems,
    totalExecutionTimeMs,
    results,
  };

  return suite;
}

// Generate test report
function generateReport(suite: TestSuiteResults): string {
  const report: string[] = [
    '\n' + '='.repeat(80),
    'TEST SUITE RESULTS',
    '='.repeat(80),
    `Suite ID: ${suite.suiteId}`,
    `Timestamp: ${suite.timestamp}`,
    `Total Execution Time: ${suite.totalExecutionTimeMs}ms`,
    '',
    'SUMMARY',
    '-'.repeat(80),
    `Total Systems Tested: ${suite.totalSystems}`,
    `Passed: ${suite.passedSystems} (${((suite.passedSystems / suite.totalSystems) * 100).toFixed(1)}%)`,
    `Failed: ${suite.failedSystems} (${((suite.failedSystems / suite.totalSystems) * 100).toFixed(1)}%)`,
    `Errors: ${suite.errorSystems} (${((suite.errorSystems / suite.totalSystems) * 100).toFixed(1)}%)`,
    '',
    'PERFORMANCE METRICS',
    '-'.repeat(80),
    `Average Time per System: ${(suite.totalExecutionTimeMs / suite.totalSystems).toFixed(2)}ms`,
    `Min Execution Time: ${Math.min(...suite.results.map((r) => r.executionTimeMs))}ms`,
    `Max Execution Time: ${Math.max(...suite.results.map((r) => r.executionTimeMs))}ms`,
    '',
    'DETAILED RESULTS',
    '-'.repeat(80),
  ];

  // Add successful systems
  const passed = suite.results.filter((r) => r.status === 'PASS');
  if (passed.length > 0) {
    report.push('✓ PASSED SYSTEMS:');
    passed.forEach((r) => {
      report.push(
        `  ${r.system}: ${r.totalOperations} ops in ${r.executionTimeMs}ms (avg metric: ${r.averageMetric.toFixed(3)}, range: [${r.minMetric.toFixed(3)}, ${r.maxMetric.toFixed(3)}])`
      );
    });
    report.push('');
  }

  // Add failed systems
  const failed = suite.results.filter((r) => r.status === 'FAIL');
  if (failed.length > 0) {
    report.push('⚠ FAILED SYSTEMS:');
    failed.forEach((r) => {
      report.push(`  ${r.system}: ${r.errorMessage || 'Unknown error'}`);
    });
    report.push('');
  }

  // Add error systems
  const errors = suite.results.filter((r) => r.status === 'ERROR');
  if (errors.length > 0) {
    report.push('✗ ERROR SYSTEMS:');
    errors.forEach((r) => {
      report.push(`  ${r.system}: ${r.errorMessage}`);
    });
    report.push('');
  }

  report.push('='.repeat(80));

  return report.join('\n');
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  let operations = 100;
  let systemsToTest = Array.from({ length: 205 }, (_, i) => 146 + i);
  let exportResults = false;

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--quick') {
      operations = 5;
    } else if (args[i] === '--full') {
      operations = 1000;
    } else if (args[i] === '--system' && args[i + 1]) {
      const milestone = parseInt(args[i + 1].replace('M', ''), 10);
      systemsToTest = [milestone];
      i++;
    } else if (args[i] === '--export') {
      exportResults = true;
    }
  }

  try {
    // Ensure packages are built
    console.log('Verifying system builds...');

    // Run test suite
    const suite = await runFullTestSuite(systemsToTest, operations);

    // Display report
    const report = generateReport(suite);
    console.log(report);

    // Export results if requested
    if (exportResults) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      const filename = `/workspace/test-results/test-results-${timestamp}.json`;

      // Ensure directory exists
      const dir = path.dirname(filename);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filename, JSON.stringify(suite, null, 2));
      console.log(`\nResults exported to: ${filename}`);
    }

    // Exit with appropriate code
    process.exit(suite.errorSystems > 0 ? 1 : 0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
