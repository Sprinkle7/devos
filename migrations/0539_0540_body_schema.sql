-- M180: Body Schema System
-- Migration 539_540

-- M180 State Table
CREATE TABLE IF NOT EXISTS m180_body_schema_state (
  id BIGSERIAL PRIMARY KEY,
  somatosensory_representation_accuracy DECIMAL(3,2) CHECK (somatosensory_representation_accuracy >= 0 AND somatosensory_representation_accuracy <= 1),
  postural_representation_quality DECIMAL(3,2) CHECK (postural_representation_quality >= 0 AND postural_representation_quality <= 1),
  motor_execution_quality DECIMAL(3,2) CHECK (motor_execution_quality >= 0 AND motor_execution_quality <= 1),
  body_environment_interaction_quality DECIMAL(3,2) CHECK (body_environment_interaction_quality >= 0 AND body_environment_interaction_quality <= 1),
  body_schema_accuracy DECIMAL(3,2) CHECK (body_schema_accuracy >= 0 AND body_schema_accuracy <= 1),
  motor_control_effectiveness DECIMAL(3,2) CHECK (motor_control_effectiveness >= 0 AND motor_control_effectiveness <= 1),
  body_schema_cognition_integration DECIMAL(3,2) CHECK (body_schema_cognition_integration >= 0 AND body_schema_cognition_integration <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m180_body_schema_state_created_at ON m180_body_schema_state(created_at);
CREATE INDEX idx_m180_body_schema_state_metadata ON m180_body_schema_state USING GIN(metadata);

-- M180 Metrics Table
CREATE TABLE IF NOT EXISTS m180_body_schema_metrics (
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

CREATE INDEX idx_m180_body_schema_metrics_created_at ON m180_body_schema_metrics(created_at);
CREATE INDEX idx_m180_body_schema_metrics_metadata ON m180_body_schema_metrics USING GIN(metadata);
