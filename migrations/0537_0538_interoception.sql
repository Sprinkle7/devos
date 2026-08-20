-- M179: Interoception System
-- Migration 537_538

-- M179 State Table
CREATE TABLE IF NOT EXISTS m179_interoception_state (
  id BIGSERIAL PRIMARY KEY,
  cardiac_interoception_accuracy DECIMAL(3,2) CHECK (cardiac_interoception_accuracy >= 0 AND cardiac_interoception_accuracy <= 1),
  respiratory_interoception_accuracy DECIMAL(3,2) CHECK (respiratory_interoception_accuracy >= 0 AND respiratory_interoception_accuracy <= 1),
  visceral_interoception_accuracy DECIMAL(3,2) CHECK (visceral_interoception_accuracy >= 0 AND visceral_interoception_accuracy <= 1),
  body_state_integration_quality DECIMAL(3,2) CHECK (body_state_integration_quality >= 0 AND body_state_integration_quality <= 1),
  interoceptive_awareness_strength DECIMAL(3,2) CHECK (interoceptive_awareness_strength >= 0 AND interoceptive_awareness_strength <= 1),
  physiological_monitoring_accuracy DECIMAL(3,2) CHECK (physiological_monitoring_accuracy >= 0 AND physiological_monitoring_accuracy <= 1),
  interoception_cognition_integration DECIMAL(3,2) CHECK (interoception_cognition_integration >= 0 AND interoception_cognition_integration <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m179_interoception_state_created_at ON m179_interoception_state(created_at);
CREATE INDEX idx_m179_interoception_state_metadata ON m179_interoception_state USING GIN(metadata);

-- M179 Metrics Table
CREATE TABLE IF NOT EXISTS m179_interoception_metrics (
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

CREATE INDEX idx_m179_interoception_metrics_created_at ON m179_interoception_metrics(created_at);
CREATE INDEX idx_m179_interoception_metrics_metadata ON m179_interoception_metrics USING GIN(metadata);
