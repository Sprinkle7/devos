# DEVAIOS Testing, Examples, and Performance Benchmarking Guide

This guide covers practical tools for testing, demonstrating, and measuring the performance of the DEVAIOS cognitive systems framework.

## Contents

1. [Quick Start](#quick-start)
2. [Test Harness](#test-harness)
3. [Usage Examples](#usage-examples)
4. [Integration Testing](#integration-testing)
5. [Performance Benchmarking](#performance-benchmarking)
6. [Exporting Results](#exporting-results)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Install Dependencies

```bash
cd /workspace
pnpm install
```

### 2. Build All Systems

```bash
pnpm run build
```

### 3. Run Quick Test Suite

```bash
cd test-harness
pnpm run test:quick
```

Expected output:
```
================================================================================
DEVAIOS Cognitive Systems Test Suite
Suite ID: suite_1629312045123
Total Systems to Test: 205
Operations per System: 5
================================================================================

[1/205] Testing M146... ✓ PASS (45ms, avg: 0.65)
[2/205] Testing M147... ✓ PASS (38ms, avg: 0.68)
...
```

---

## Test Harness

The test harness (`test-harness/index.ts`) provides automated testing of all 205 cognitive systems.

### Features

- **Flexible Operation Counts**: Test with custom operation counts
- **Individual System Testing**: Test specific systems by milestone
- **Performance Metrics**: Tracks execution time, metric ranges, accuracy
- **Detailed Reporting**: Shows pass/fail status with error messages
- **JSON Export**: Export results for further analysis

### Usage

#### Run Quick Tests (5 operations per system)
```bash
cd test-harness
pnpm run test:quick
```

#### Run Full Tests (1000 operations per system)
```bash
pnpm run test:full
```

#### Test Specific System (e.g., M150 - Attention Regulation)
```bash
pnpm run test:system M150
```

#### Export Results to JSON
```bash
pnpm run test:all
```

Results are saved to `/workspace/test-results/test-results-YYYY-MM-DD.json`

### Command-Line Options

```bash
npx ts-node test-harness/index.ts [options]

Options:
  --quick          Run quick tests (5 ops per system)
  --full           Run full tests (1000 ops per system)
  --system M###    Test specific system
  --export         Export results to JSON file
```

### Understanding Test Results

Each test result includes:

```
[System] Status (ExecutionTime, avg: AverageMetric)

Example:
[M150] ✓ PASS (42ms, avg: 0.68)

- [M150]: Milestone reference
- ✓: Status indicator (✓ = PASS, ⚠ = FAIL, ✗ = ERROR)
- 42ms: Total execution time for all operations
- 0.68: Average normalized metric value (0-1.0)
```

### Test Summary Report

After all tests complete:

```
================================================================================
TEST SUITE RESULTS
================================================================================
Suite ID: suite_1629312045123
Timestamp: 2026-08-20T10:30:45.123Z
Total Execution Time: 15234ms

SUMMARY
----------------
Total Systems Tested: 205
Passed: 203 (99.0%)
Failed: 2 (1.0%)
Errors: 0 (0.0%)

PERFORMANCE METRICS
----------------
Average Time per System: 74.3ms
Min Execution Time: 18ms
Max Execution Time: 156ms

DETAILED RESULTS
----------------
✓ PASSED SYSTEMS:
  M146: 100 ops in 45ms (avg metric: 0.68, range: [0.55, 0.81])
  M147: 100 ops in 42ms (avg metric: 0.72, range: [0.61, 0.89])
  ...

⚠ FAILED SYSTEMS:
  M182: [error message]

✗ ERROR SYSTEMS:
  M250: Module not found
```

---

## Usage Examples

Examples demonstrate practical patterns for using individual cognitive systems.

### Running Examples

```bash
cd examples

# Run all examples
npx ts-node basic-system-usage.ts

# Run individual examples (edit file to run specific functions)
npx ts-node basic-system-usage.ts
```

### Example 1: Conscious Experience System (M146)

Demonstrates phenomenal awareness and conscious experience.

```typescript
const system = new ConsciousExperienceSystem();
system.registerExperience('visual', 0.8);
system.updateMetrics();
const state = system.getState();
console.log(state.conscious_experience_richness); // 0.75
```

**Key Concepts**:
- Experience quality registration
- Metric normalization (0-1.0)
- State capture with timestamps

### Example 2: Attention Focus System (M169)

Shows attentional control and focus management.

```typescript
const system = new AttentionFocusSystem();
system.registerAttention('primary_task', 0.9);
system.registerAttention('background', 0.2);
system.updateMetrics();
const metrics = system.getAttentionFocusMetrics();
console.log(metrics.overall_attention_strength); // 0.76
```

**Key Concepts**:
- Selective attention to stimuli
- Attention filtering and distraction suppression
- Distributed attention across multiple objects

### Example 3: Executive Function System (M173)

Demonstrates goal management, planning, and control.

```typescript
const system = new ExecutiveFunctionSystem();
system.registerGoal('complete_project', 0.9);
system.registerPlan('phased_approach', 0.85);
system.registerControl('distraction_suppression', 0.8);
system.updateMetrics();
const state = system.getExecutiveFunctionState();
console.log(state.goal_representation_quality); // 0.88
```

**Key Concepts**:
- Hierarchical goal representation
- Multi-step planning
- Cognitive control and inhibition
- Working memory management

### Example 4: Decision Making System (M174)

Shows option evaluation and decision selection.

```typescript
const system = new DecisionMakingSystem();
system.evaluateOption('risky_high_reward', 0.85);
system.evaluateOption('safe_moderate_reward', 0.72);
system.formPreference('reward_seeking', 0.7);
system.selectDecision('primary_objective', 0.82);
```

**Key Concepts**:
- Multi-attribute option evaluation
- Risk assessment
- Preference formation and weighting
- Decision confidence

### Example 5: Emotional Processing System (M175)

Demonstrates emotion regulation and affective responses.

```typescript
const system = new EmotionalProcessingSystem();
system.registerEmotionalEvent('positive_achievement', 0.85);
system.applyEmotionalRegulation('cognitive_reappraisal', 0.8);
const state = system.getEmotionalState();
console.log(state.primary_valence); // 0.65 (positive)
console.log(state.arousal_level); // 0.58
```

**Key Concepts**:
- Valence and arousal representation
- Emotional event processing
- Regulation strategy application
- Emotional resilience

### Example 6: Pattern Recognition System (M200)

Shows pattern detection and categorization.

```typescript
const system = new PatternRecognitionSystem();
system.registerPattern('horizontal_lines', 0.92);
system.categorizeInput('visual_object', 'face', 0.95);
const state = system.getPatternRecognitionState();
console.log(state.pattern_detection_accuracy); // 0.88
```

**Key Concepts**:
- Multi-level pattern detection
- Categorization accuracy
- Generalization capability
- Novel pattern detection

### Example 7: Learning System (M164)

Demonstrates learning and memory consolidation.

```typescript
const system = new LearningSystem();
system.registerLearningEvent('new_concept_A', 0.85);
system.consolidateMemory('declarative', 0.85);
const strength_a = system.retrieveMemory('concept_A');
const state = system.getLearningState();
console.log(state.retention_strength); // 0.82
```

**Key Concepts**:
- Material acquisition and encoding
- Memory consolidation phases
- Retrieval strength tracking
- Learning efficiency measurement

---

## Integration Testing

Integration tests (`examples/integration-test.ts`) demonstrate how multiple systems work together.

### Running Integration Tests

```bash
cd examples
npx ts-node integration-test.ts
```

### Test Scenarios

#### 1. Emotional Response to Stimulus

Tests emotional, attentional, and decision-making systems working together.

```
Step 1: Encounter stimulus → Emotional Processing (M175)
  Primary Valence: 0.35 (negative)
  Arousal Level: 0.72

Step 2: Emotion triggers attention → Attention Focus System (M169)
  Threat-Focused Attention: 0.9
  Focus Strength: 0.85

Step 3: Attention + Emotion → Decision → Decision Making System (M174)
  Selected Decision: avoidance
  Confidence: 0.82

Aggregate Metrics:
  Overall Coordination: 0.79
```

**Systems Involved**: M175 (Emotion), M169 (Attention), M174 (Decision)

#### 2. Learning and Memory Consolidation

Tests learning, attention, and semantic memory systems interacting.

```
Step 1: Learning Material → Learning System (M164)
  Acquisition Speed: 0.82
  Retention: 0.78

Step 2: Maintain Focus → Attention System (M169)
  Attention Quality: 0.91
  Focus Strength: 0.88

Step 3: Semantic Encoding → Semantic Memory (M172)
  Semantic Depth: 0.84
  Conceptual Clarity: 0.81

Overall Learning Quality: 0.84
```

**Systems Involved**: M164 (Learning), M169 (Attention), M172 (Semantic Memory)

#### 3. Goal-Directed Task Execution

Tests executive function, attention, and working memory during task execution.

```
Step 1: Plan Task → Executive Function (M173)
  Goal Clarity: 0.89
  Plan Quality: 0.84
  Steps: 5

Step 2: Maintain Task Focus → Attention (M169)
  Task Focus: 0.92

Step 3: Working Memory Management (M170)
  Information Holding: 0.87
  Focus Maintenance: 0.88

Task Completion: 100%
Overall Quality: 0.88
```

**Systems Involved**: M173 (Executive), M169 (Attention), M170 (Working Memory)

### Integration Test Results

Each test produces:

```
================================================================================
TEST: Test Name
Systems: M###, M###, M###
Description: What the test measures
================================================================================

[Step 1] Description
[Step 2] Description
[Step 3] Description

[Aggregate Metrics]
  Metric A: value
  Metric B: value

✓ Test PASSED
```

---

## Performance Benchmarking

The performance benchmark tool (`examples/performance-benchmark.ts`) measures system efficiency.

### Running Benchmarks

```bash
cd examples
npx ts-node performance-benchmark.ts
```

### What Gets Measured

For each system and operation count:

1. **Throughput**: Operations per second
2. **Latency**: Milliseconds per operation
3. **Consistency**: Standard deviation
4. **Accuracy**: Metrics calculation correctness
5. **Scalability**: Performance across different loads

### Understanding Benchmark Results

```
================================================================================
PERFORMANCE BENCHMARK RESULTS
================================================================================
Suite: DEVAIOS Performance Benchmark Suite
Timestamp: 2026-08-20T10:30:45.123Z
Total Systems Benchmarked: 10

OVERALL PERFORMANCE METRICS
--------
Average Throughput: 85000 ops/sec
Average Latency: 0.012 ms/op
Scalability: EXCELLENT - maintains performance with scale

DETAILED RESULTS
--------

M146:
  Operations | Throughput (ops/sec) | Latency (ms) | Std Dev | Metrics Accuracy
  100        | 89234               | 0.011        | 0.0034  | 97.3%
  1000       | 88456               | 0.011        | 0.0035  | 97.5%
  10000      | 87923               | 0.011        | 0.0036  | 97.4%

PERFORMANCE TIERS
--------
🥇 TOP TIER (3 systems): 89234 ops/sec
    M146 - 89234 ops/sec
    M150 - 88923 ops/sec

🥈 HIGH TIER (3 systems): 82934 ops/sec

🥉 MIDDLE TIER (4 systems): 71234 ops/sec
```

### Performance Interpretation

**Throughput**:
- > 100,000 ops/sec: Excellent (real-time capable)
- 50,000-100,000 ops/sec: Very Good
- 10,000-50,000 ops/sec: Good
- < 10,000 ops/sec: Needs optimization

**Latency**:
- < 0.01ms per operation: Excellent
- 0.01-0.05ms: Very Good
- 0.05-0.1ms: Good
- > 0.1ms: Consider optimization

**Scalability**:
- EXCELLENT: Throughput ratio > 0.8 (100 vs 10000 ops)
- ACCEPTABLE: Throughput ratio 0.5-0.8
- DEGRADING: Throughput ratio < 0.5

---

## Exporting Results

### Test Results Export

Test results are automatically exported when using `--export` flag:

```bash
cd test-harness
pnpm run test:all
```

Creates: `/workspace/test-results/test-results-YYYY-MM-DD.json`

### Benchmark Results Export

Benchmark results are automatically saved to:

```
/workspace/benchmark-results/benchmark-YYYY-MM-DD.json
```

### Result File Structure

**Test Results**:
```json
{
  "suiteId": "suite_1629312045123",
  "timestamp": "2026-08-20T10:30:45.123Z",
  "totalSystems": 205,
  "passedSystems": 203,
  "failedSystems": 0,
  "errorSystems": 2,
  "totalExecutionTimeMs": 15234,
  "results": [
    {
      "system": "M146",
      "milestone": 146,
      "totalOperations": 100,
      "averageMetric": 0.68,
      "minMetric": 0.55,
      "maxMetric": 0.81,
      "executionTimeMs": 45,
      "status": "PASS",
      "timestamp": "2026-08-20T10:30:45.123Z"
    },
    ...
  ]
}
```

**Benchmark Results**:
```json
{
  "suiteName": "DEVAIOS Performance Benchmark Suite",
  "timestamp": "2026-08-20T10:30:45.123Z",
  "totalSystems": 10,
  "results": [
    {
      "system": "M146",
      "milestone": 146,
      "operations": 100,
      "totalTimeMs": 1.2,
      "averageLatencyMs": 0.012,
      "throughputOpsPerSecond": 83333,
      "minLatencyMs": 0.008,
      "maxLatencyMs": 0.018,
      "stdDeviation": 0.0034,
      "metricsAccuracy": 0.973,
      "timestamp": "2026-08-20T10:30:45.123Z"
    },
    ...
  ],
  "overallThroughput": 85000,
  "overallLatency": 0.012,
  "scalabilityAnalysis": "EXCELLENT - maintains performance with scale"
}
```

### Analyzing Results

Common analysis tasks:

**Find Failed Systems**:
```bash
jq '.results[] | select(.status != "PASS") | {system, errorMessage}' test-results-*.json
```

**Get Performance Stats**:
```bash
jq '[.results[].executionTimeMs] | {min: min, max: max, avg: (add/length)}' benchmark-*.json
```

**Export to CSV** (for Excel/Sheets):
```bash
jq -r '.results[] | [.system, .status, .executionTimeMs, .averageMetric] | @csv' test-results-*.json > results.csv
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Module not found" errors

**Cause**: Systems not built
**Solution**:
```bash
cd /workspace
pnpm install
pnpm run build
```

#### Issue: Tests timeout or hang

**Cause**: System under resource pressure
**Solution**:
- Run fewer operations: `pnpm run test:quick`
- Test individual system: `pnpm run test:system M146`
- Check available memory: `free -h`

#### Issue: Inconsistent test results

**Cause**: System resource variation
**Solution**:
- Close other applications
- Run benchmarks multiple times
- Use `--full` for more stable statistics

#### Issue: Export files not created

**Cause**: Directory permission issue
**Solution**:
```bash
mkdir -p /workspace/test-results
mkdir -p /workspace/benchmark-results
chmod 755 /workspace/test-results /workspace/benchmark-results
```

#### Issue: TypeScript compilation errors

**Cause**: TypeScript version mismatch
**Solution**:
```bash
pnpm install typescript@latest
pnpm run build
```

### Debugging Test Failures

To debug a failing system:

```bash
# Test individual system with verbose output
npx ts-node test-harness/index.ts --system M146

# Check system files
ls -la packages/cognitive-system-m146/

# Verify compilation
cd packages/cognitive-system-m146
npx tsc
```

### Performance Debugging

For slow systems:

1. **Check latency distribution**:
   ```bash
   jq '.results[] | select(.system == "M146") | .stdDeviation' benchmark-*.json
   ```

2. **Analyze throughput trends**:
   ```bash
   jq '.results[] | select(.system == "M146") | [.operations, .throughputOpsPerSecond]' benchmark-*.json
   ```

3. **Profile system directly**:
   ```bash
   npx node --prof examples/performance-benchmark.ts
   node --prof-process isolate-*.log > profile.txt
   ```

---

## Summary of Tools

| Tool | Purpose | Command | Output |
|------|---------|---------|--------|
| **Test Harness** | Automated testing of all systems | `pnpm run test:quick` | Pass/Fail status |
| **Examples** | Practical usage patterns | `npx ts-node basic-system-usage.ts` | Demo output |
| **Integration Tests** | Multi-system workflows | `npx ts-node integration-test.ts` | Workflow results |
| **Performance Benchmark** | Throughput and latency measurement | `npx ts-node performance-benchmark.ts` | Performance metrics |

---

## Next Steps

1. **Run test suite**: `pnpm run test:quick` to verify all systems
2. **Review examples**: `npx ts-node basic-system-usage.ts` to understand usage patterns
3. **Run integration tests**: `npx ts-node integration-test.ts` to see multi-system workflows
4. **Benchmark performance**: `npx ts-node performance-benchmark.ts` to measure efficiency
5. **Export results**: Add `--export` flag to save results for analysis

All results are documented and ready for sharing with testers.
