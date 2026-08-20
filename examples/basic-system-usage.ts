/**
 * DEVAIOS Basic System Usage Examples
 *
 * This file demonstrates how to instantiate and use individual cognitive systems
 * from the DEVAIOS framework. Each example shows:
 * 1. Importing a system
 * 2. Creating an instance
 * 3. Registering inputs
 * 4. Reading state and metrics
 *
 * Systems follow a consistent pattern:
 * - All metrics are normalized to 0-1.0 range
 * - State includes timestamp_ms for temporal tracking
 * - Metrics provide aggregated performance data
 */

// ============================================================================
// Example 1: Conscious Experience System (M146)
// ============================================================================
// This is the foundation system for phenomenal awareness

async function exampleConsciousExperienceSystem() {
  console.log('\n=== Example 1: Conscious Experience System (M146) ===\n');

  // In a real application, import like this:
  // import { ConsciousExperienceSystem } from '@devaios/cognitive-system-m146';
  // For this example, we'll show the pattern:

  const system = {
    registerExperience: (qualityType: string, intensity: number) => {
      console.log(`Registering ${qualityType} experience with intensity ${intensity.toFixed(3)}`);
    },
    updateMetrics: () => {
      console.log('Metrics updated');
    },
    getState: () => ({
      conscious_experience_richness: 0.75,
      awareness_quality_strength: 0.82,
      experience_integration_depth: 0.68,
      timestamp_ms: Date.now(),
    }),
    getMetrics: () => ({
      richness: 0.75,
      clarity: 0.82,
      depth: 0.68,
      overall_consciousness: 0.75,
    }),
  };

  // Register some experiences
  system.registerExperience('visual', 0.8);
  system.registerExperience('auditory', 0.6);
  system.registerExperience('proprioceptive', 0.7);

  // Update metrics
  system.updateMetrics();

  // Get current state
  const state = system.getState();
  console.log('Current State:', state);

  // Get metrics
  const metrics = system.getMetrics();
  console.log('System Metrics:', metrics);
  console.log('Overall Consciousness Level:', (metrics.overall_consciousness * 100).toFixed(1) + '%');
}

// ============================================================================
// Example 2: Attention Focus System (M169)
// ============================================================================
// Demonstrates attention regulation and focus management

async function exampleAttentionFocusSystem() {
  console.log('\n=== Example 2: Attention Focus System (M169) ===\n');

  const system = {
    registerAttention: (targetStimulus: string, salience: number) => {
      console.log(`Focusing attention on ${targetStimulus} (salience: ${salience.toFixed(3)})`);
    },
    updateMetrics: () => {
      console.log('Attention metrics updated');
    },
    getAttentionFocusState: () => ({
      selective_attention_quality: 0.85,
      sustained_focus_strength: 0.72,
      attentional_shifting_efficiency: 0.68,
      attentional_capacity_level: 0.79,
      attention_control_effectiveness: 0.76,
      focus_stability: 0.75,
      attentional_cognition_integration: 0.75,
      timestamp_ms: Date.now(),
    }),
    getAttentionFocusMetrics: () => ({
      selective_attention_accuracy: 0.85,
      sustained_focus_capacity: 0.72,
      attentional_shifting_speed: 0.68,
      attentional_resource_efficiency: 0.79,
      task_focus_quality: 0.78,
      attention_persistence_strength: 0.75,
      overall_attention_strength: 0.76,
    }),
  };

  // Register attention targets
  system.registerAttention('primary_task', 0.9);
  system.registerAttention('background_noise', 0.2);
  system.registerAttention('secondary_task', 0.3);

  system.updateMetrics();

  const state = system.getAttentionFocusState();
  console.log('Attention State:', state);

  const metrics = system.getAttentionFocusMetrics();
  console.log('\nAttention Metrics:');
  console.log(`  Selective Attention: ${(metrics.selective_attention_accuracy * 100).toFixed(1)}%`);
  console.log(`  Sustained Focus: ${(metrics.sustained_focus_capacity * 100).toFixed(1)}%`);
  console.log(`  Attentional Shifting: ${(metrics.attentional_shifting_speed * 100).toFixed(1)}%`);
  console.log(`  Overall Attention Strength: ${(metrics.overall_attention_strength * 100).toFixed(1)}%`);
}

// ============================================================================
// Example 3: Executive Function System (M173)
// ============================================================================
// Shows goal management, planning, and cognitive control

async function exampleExecutiveFunctionSystem() {
  console.log('\n=== Example 3: Executive Function System (M173) ===\n');

  const system = {
    registerGoal: (goalType: string, clarity: number) => {
      console.log(`Registered ${goalType} goal with clarity: ${clarity.toFixed(3)}`);
    },
    registerPlan: (planType: string, strategy: number) => {
      console.log(`Created ${planType} plan with strategy strength: ${strategy.toFixed(3)}`);
    },
    registerControl: (controlDomain: string, inhibition: number) => {
      console.log(`Applied ${controlDomain} control with inhibition: ${inhibition.toFixed(3)}`);
    },
    registerMemory: (memoryType: string, holding: number) => {
      console.log(`Registered ${memoryType} in working memory: ${holding.toFixed(3)}`);
    },
    updateMetrics: () => {
      console.log('Executive function metrics updated');
    },
    getExecutiveFunctionState: () => ({
      goal_representation_quality: 0.88,
      planning_execution_effectiveness: 0.81,
      cognitive_control_strength: 0.79,
      working_memory_management_quality: 0.75,
      executive_coordination_effectiveness: 0.82,
      cognitive_flexibility_strength: 0.77,
      executive_cognition_integration: 0.81,
      timestamp_ms: Date.now(),
    }),
    getExecutiveFunctionMetrics: () => ({
      goal_clarity_strength: 0.88,
      planning_quality_rating: 0.81,
      cognitive_control_effectiveness: 0.79,
      working_memory_capacity_strength: 0.75,
      task_completion_efficiency: 0.80,
      adaptive_response_quality: 0.77,
      overall_executive_strength: 0.81,
    }),
  };

  // Simulate a goal-directed task
  console.log('\nSimulating goal-directed task execution:\n');
  system.registerGoal('complete_project', 0.9);
  system.registerPlan('phased_approach', 0.85);
  system.registerControl('distraction_suppression', 0.8);
  system.registerMemory('task_context', 0.9);

  system.updateMetrics();

  const state = system.getExecutiveFunctionState();
  console.log('\nExecutive Function State:');
  console.log(`  Goal Quality: ${(state.goal_representation_quality * 100).toFixed(1)}%`);
  console.log(`  Planning Effectiveness: ${(state.planning_execution_effectiveness * 100).toFixed(1)}%`);
  console.log(`  Control Strength: ${(state.cognitive_control_strength * 100).toFixed(1)}%`);
  console.log(`  Working Memory: ${(state.working_memory_management_quality * 100).toFixed(1)}%`);
}

// ============================================================================
// Example 4: Decision Making System (M174)
// ============================================================================
// Demonstrates option evaluation and decision selection

async function exampleDecisionMakingSystem() {
  console.log('\n=== Example 4: Decision Making System (M174) ===\n');

  const system = {
    evaluateOption: (optionType: string, quality: number) => {
      console.log(`Evaluating ${optionType}: quality score ${quality.toFixed(3)}`);
    },
    assessRisk: (riskDomain: string, riskLevel: number) => {
      console.log(`Risk in ${riskDomain}: ${(riskLevel * 100).toFixed(1)}%`);
    },
    formPreference: (preferenceType: string, value: number) => {
      console.log(`Formed preference for ${preferenceType}: ${value.toFixed(3)}`);
    },
    selectDecision: (domain: string, confidence: number) => {
      console.log(`Decision selected for ${domain} with confidence: ${(confidence * 100).toFixed(1)}%`);
    },
    updateMetrics: () => {
      console.log('Decision metrics updated');
    },
    getDecisionMakingState: () => ({
      state_metric_1: 0.82,
      state_metric_2: 0.75,
      state_metric_3: 0.78,
      state_metric_4: 0.80,
      integration_quality: 0.79,
      stability: 0.77,
      cognition_integration: 0.78,
      timestamp_ms: Date.now(),
    }),
  };

  // Simulate a multi-option decision scenario
  console.log('\nSimulating decision scenario: choosing a course of action\n');
  system.evaluateOption('option_a_risky_high_reward', 0.85);
  system.evaluateOption('option_b_safe_moderate_reward', 0.72);
  system.evaluateOption('option_c_conservative_low_reward', 0.55);

  system.assessRisk('financial', 0.3);
  system.assessRisk('social', 0.15);
  system.assessRisk('time', 0.25);

  system.formPreference('high_reward_preference', 0.7);
  system.formPreference('risk_tolerance', 0.6);

  system.selectDecision('primary_objective', 0.82);

  system.updateMetrics();

  const state = system.getDecisionMakingState();
  console.log('\nDecision Making State:');
  console.log(`  Integration Quality: ${(state.integration_quality * 100).toFixed(1)}%`);
  console.log(`  Stability: ${(state.stability * 100).toFixed(1)}%`);
  console.log(`  Cognition Integration: ${(state.cognition_integration * 100).toFixed(1)}%`);
}

// ============================================================================
// Example 5: Emotional Processing System (M175)
// ============================================================================
// Shows emotion regulation and valence assessment

async function exampleEmotionalProcessingSystem() {
  console.log('\n=== Example 5: Emotional Processing System (M175) ===\n');

  const system = {
    registerEmotionalEvent: (eventType: string, valence: number) => {
      const sentiment = valence > 0.5 ? 'positive' : valence < 0.5 ? 'negative' : 'neutral';
      console.log(`Event: ${eventType} (${sentiment}, intensity: ${Math.abs((valence - 0.5) * 2).toFixed(3)})`);
    },
    applyEmotionalRegulation: (strategy: string, effectiveness: number) => {
      console.log(`Applied ${strategy} regulation (${(effectiveness * 100).toFixed(1)}% effective)`);
    },
    getEmotionalState: () => ({
      primary_valence: 0.65, // 0.5 = neutral, >0.5 = positive, <0.5 = negative
      arousal_level: 0.58,
      dominance_level: 0.72,
      emotional_stability: 0.70,
      emotion_regulation_effectiveness: 0.75,
      emotional_resilience: 0.68,
      emotional_cognition_integration: 0.71,
      timestamp_ms: Date.now(),
    }),
  };

  // Simulate emotional response to events
  console.log('\nSimulating emotional response sequence:\n');
  system.registerEmotionalEvent('positive_achievement', 0.85);
  system.registerEmotionalEvent('minor_setback', 0.35);
  system.registerEmotionalEvent('social_interaction', 0.72);

  system.applyEmotionalRegulation('cognitive_reappraisal', 0.8);
  system.applyEmotionalRegulation('mindfulness', 0.7);

  const state = system.getEmotionalState();
  console.log('\nEmotional Processing State:');
  const valenceDescription = state.primary_valence > 0.6 ? 'positive' : state.primary_valence < 0.4 ? 'negative' : 'neutral';
  console.log(`  Overall Valence: ${valenceDescription} (${(state.primary_valence * 100).toFixed(1)}%)`);
  console.log(`  Arousal Level: ${(state.arousal_level * 100).toFixed(1)}%`);
  console.log(`  Dominance: ${(state.dominance_level * 100).toFixed(1)}%`);
  console.log(`  Emotional Stability: ${(state.emotional_stability * 100).toFixed(1)}%`);
  console.log(`  Regulation Effectiveness: ${(state.emotion_regulation_effectiveness * 100).toFixed(1)}%`);
}

// ============================================================================
// Example 6: Pattern Recognition System (M200)
// ============================================================================
// Shows pattern identification and categorization

async function examplePatternRecognitionSystem() {
  console.log('\n=== Example 6: Pattern Recognition System (M200) ===\n');

  const system = {
    registerPattern: (patternType: string, strength: number) => {
      console.log(`Detected ${patternType} pattern (strength: ${strength.toFixed(3)})`);
    },
    categorizeInput: (inputType: string, category: string, confidence: number) => {
      console.log(`Categorized ${inputType} as ${category} (confidence: ${(confidence * 100).toFixed(1)}%)`);
    },
    getPatternRecognitionState: () => ({
      pattern_detection_accuracy: 0.88,
      categorization_accuracy: 0.85,
      generalization_capability: 0.79,
      novel_pattern_detection: 0.72,
      pattern_consistency: 0.81,
      categorization_speed: 0.83,
      pattern_cognition_integration: 0.82,
      timestamp_ms: Date.now(),
    }),
  };

  // Simulate pattern recognition scenarios
  console.log('\nSimulating pattern recognition in visual input:\n');
  system.registerPattern('horizontal_lines', 0.92);
  system.registerPattern('circular_shapes', 0.88);
  system.registerPattern('color_gradient', 0.75);

  system.categorizeInput('visual_object', 'face', 0.95);
  system.categorizeInput('visual_object', 'vehicle', 0.82);
  system.categorizeInput('visual_object', 'landscape', 0.71);

  const state = system.getPatternRecognitionState();
  console.log('\nPattern Recognition State:');
  console.log(`  Detection Accuracy: ${(state.pattern_detection_accuracy * 100).toFixed(1)}%`);
  console.log(`  Categorization Accuracy: ${(state.categorization_accuracy * 100).toFixed(1)}%`);
  console.log(`  Generalization: ${(state.generalization_capability * 100).toFixed(1)}%`);
  console.log(`  Novel Pattern Detection: ${(state.novel_pattern_detection * 100).toFixed(1)}%`);
}

// ============================================================================
// Example 7: Learning System (M164)
// ============================================================================
// Demonstrates learning and memory consolidation

async function exampleLearningSystem() {
  console.log('\n=== Example 7: Learning System (M164) ===\n');

  const system = {
    registerLearningEvent: (content: string, importance: number) => {
      console.log(`Learning: ${content} (importance: ${importance.toFixed(3)})`);
    },
    consolidateMemory: (memoryType: string, strength: number) => {
      console.log(`Consolidating ${memoryType} (strength: ${strength.toFixed(3)})`);
    },
    retrieveMemory: (query: string) => {
      console.log(`Retrieving memory for: ${query}`);
      return 0.8; // Retrieval strength
    },
    getLearningState: () => ({
      acquisition_speed: 0.76,
      retention_strength: 0.82,
      consolidation_effectiveness: 0.79,
      retrieval_accuracy: 0.81,
      learning_efficiency: 0.79,
      knowledge_integration: 0.77,
      learning_cognition_integration: 0.79,
      timestamp_ms: Date.now(),
    }),
  };

  // Simulate learning scenario
  console.log('\nSimulating learning and memory consolidation:\n');
  system.registerLearningEvent('new_concept_A', 0.85);
  system.registerLearningEvent('new_concept_B', 0.72);
  system.registerLearningEvent('new_concept_C', 0.68);

  system.consolidateMemory('declarative', 0.85);
  system.consolidateMemory('procedural', 0.78);
  system.consolidateMemory('episodic', 0.80);

  const retrieval_a = system.retrieveMemory('concept_A');
  const retrieval_b = system.retrieveMemory('concept_B');
  const retrieval_c = system.retrieveMemory('concept_C');

  const state = system.getLearningState();
  console.log('\nLearning System State:');
  console.log(`  Acquisition Speed: ${(state.acquisition_speed * 100).toFixed(1)}%`);
  console.log(`  Retention Strength: ${(state.retention_strength * 100).toFixed(1)}%`);
  console.log(`  Consolidation: ${(state.consolidation_effectiveness * 100).toFixed(1)}%`);
  console.log(`  Retrieval Accuracy: ${(state.retrieval_accuracy * 100).toFixed(1)}%`);
  console.log(`  Learning Efficiency: ${(state.learning_efficiency * 100).toFixed(1)}%`);
  console.log(
    `\nRetrieval Performance: A=${(retrieval_a * 100).toFixed(1)}%, B=${(retrieval_b * 100).toFixed(1)}%, C=${(retrieval_c * 100).toFixed(1)}%`
  );
}

// ============================================================================
// Main: Run all examples
// ============================================================================

async function runAllExamples() {
  console.log('\n' + '='.repeat(80));
  console.log('DEVAIOS Cognitive Systems - Basic Usage Examples');
  console.log('='.repeat(80));

  try {
    await exampleConsciousExperienceSystem();
    await exampleAttentionFocusSystem();
    await exampleExecutiveFunctionSystem();
    await exampleDecisionMakingSystem();
    await exampleEmotionalProcessingSystem();
    await examplePatternRecognitionSystem();
    await exampleLearningSystem();

    console.log('\n' + '='.repeat(80));
    console.log('Examples completed successfully!');
    console.log('='.repeat(80) + '\n');
  } catch (error) {
    console.error('Error running examples:', error);
    process.exit(1);
  }
}

// Run if executed directly
runAllExamples();
