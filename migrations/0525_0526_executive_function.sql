-- M173: Executive Function System
-- Migration 525_526

-- M173 State Table
CREATE TABLE IF NOT EXISTS m173_executive_function_state (
  id BIGSERIAL PRIMARY KEY,
  goal_representation_quality DECIMAL(3,2) CHECK (goal_representation_quality >= 0 AND goal_representation_quality <= 1),
  planning_execution_effectiveness DECIMAL(3,2) CHECK (planning_execution_effectiveness >= 0 AND planning_execution_effectiveness <= 1),
  cognitive_control_strength DECIMAL(3,2) CHECK (cognitive_control_strength >= 0 AND cognitive_control_strength <= 1),
  working_memory_management_quality DECIMAL(3,2) CHECK (working_memory_management_quality >= 0 AND working_memory_management_quality <= 1),
  executive_coordination_effectiveness DECIMAL(3,2) CHECK (executive_coordination_effectiveness >= 0 AND executive_coordination_effectiveness <= 1),
  cognitive_flexibility_strength DECIMAL(3,2) CHECK (cognitive_flexibility_strength >= 0 AND cognitive_flexibility_strength <= 1),
  executive_cognition_integration DECIMAL(3,2) CHECK (executive_cognition_integration >= 0 AND executive_cognition_integration <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m173_executive_function_state_created_at ON m173_executive_function_state(created_at);
CREATE INDEX idx_m173_executive_function_state_metadata ON m173_executive_function_state USING GIN(metadata);

-- M173 Metrics Table
CREATE TABLE IF NOT EXISTS m173_executive_function_metrics (
  id BIGSERIAL PRIMARY KEY,
  metric_1 DECIMAL(3,2) CHECK (metric_1 >= 0 AND metric_1 <= 1),
  metric_2 DECIMAL(3,2) CHECK (metric_2 >= 0 AND metric_2 <= 1),
  metric_3 DECIMAL(3,2) CHECK (metric_3 >= 0 AND metric_3 <= 1),
  metric_4 DECIMAL(3,2) CHECK (metric_4 >= 0 AND metric_4 <= 1),
  metric_5 DECIMAL(3,2) CHECK (metric_5 >= 0 AND metric_5 <= 1),
  metric_6 DECIMAL(3,2) CHECK (metric_6 >= 0 AND metric_6 <= 1),
  overall_strength DECIMAL(3,2) CHECK (overall_strength >= 0 AND overall_strength <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m173_executive_function_metrics_created_at ON m173_executive_function_metrics(created_at);
CREATE INDEX idx_m173_executive_function_metrics_metadata ON m173_executive_function_metrics USING GIN(metadata);
