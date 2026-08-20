-- M170: Working Memory System
-- Migration 519_520

-- M170 State Table
CREATE TABLE IF NOT EXISTS m170_working_memory_state (
  id BIGSERIAL PRIMARY KEY,
  working_memory_capacity DECIMAL(3,2) CHECK (working_memory_capacity >= 0 AND working_memory_capacity <= 1),
  information_retention_quality DECIMAL(3,2) CHECK (information_retention_quality >= 0 AND information_retention_quality <= 1),
  manipulation_efficiency DECIMAL(3,2) CHECK (manipulation_efficiency >= 0 AND manipulation_efficiency <= 1),
  executive_control_strength DECIMAL(3,2) CHECK (executive_control_strength >= 0 AND executive_control_strength <= 1),
  memory_integration_quality DECIMAL(3,2) CHECK (memory_integration_quality >= 0 AND memory_integration_quality <= 1),
  working_memory_stability DECIMAL(3,2) CHECK (working_memory_stability >= 0 AND working_memory_stability <= 1),
  working_memory_cognition_integration DECIMAL(3,2) CHECK (working_memory_cognition_integration >= 0 AND working_memory_cognition_integration <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m170_working_memory_state_created_at ON m170_working_memory_state(created_at);
CREATE INDEX idx_m170_working_memory_state_metadata ON m170_working_memory_state USING GIN(metadata);

-- M170 Metrics Table
CREATE TABLE IF NOT EXISTS m170_working_memory_metrics (
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

CREATE INDEX idx_m170_working_memory_metrics_created_at ON m170_working_memory_metrics(created_at);
CREATE INDEX idx_m170_working_memory_metrics_metadata ON m170_working_memory_metrics USING GIN(metadata);
