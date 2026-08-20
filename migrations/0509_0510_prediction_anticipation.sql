-- M165: Prediction and Anticipation System
-- Migration 0509_0510

-- M165 State Table
CREATE TABLE IF NOT EXISTS m165_prediction_anticipation_state (
  id BIGSERIAL PRIMARY KEY,
  overall_prediction_accuracy DECIMAL(3,2) CHECK (overall_prediction_accuracy >= 0 AND overall_prediction_accuracy <= 1),
  predictive_modeling_quality DECIMAL(3,2) CHECK (predictive_modeling_quality >= 0 AND predictive_modeling_quality <= 1),
  anticipatory_coding_strength DECIMAL(3,2) CHECK (anticipatory_coding_strength >= 0 AND anticipatory_coding_strength <= 1),
  future_simulation_depth DECIMAL(3,2) CHECK (future_simulation_depth >= 0 AND future_simulation_depth <= 1),
  adaptive_prediction_capacity DECIMAL(3,2) CHECK (adaptive_prediction_capacity >= 0 AND adaptive_prediction_capacity <= 1),
  prediction_confidence_level DECIMAL(3,2) CHECK (prediction_confidence_level >= 0 AND prediction_confidence_level <= 1),
  anticipation_readiness DECIMAL(3,2) CHECK (anticipation_readiness >= 0 AND anticipation_readiness <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m165_state_created_at ON m165_prediction_anticipation_state(created_at);
CREATE INDEX idx_m165_state_metadata ON m165_prediction_anticipation_state USING GIN(metadata);

-- M165 Metrics Table
CREATE TABLE IF NOT EXISTS m165_prediction_anticipation_metrics (
  id BIGSERIAL PRIMARY KEY,
  prediction_accuracy_rate DECIMAL(3,2) CHECK (prediction_accuracy_rate >= 0 AND prediction_accuracy_rate <= 1),
  predictive_modeling_efficiency DECIMAL(3,2) CHECK (predictive_modeling_efficiency >= 0 AND predictive_modeling_efficiency <= 1),
  anticipatory_precision DECIMAL(3,2) CHECK (anticipatory_precision >= 0 AND anticipatory_precision <= 1),
  future_simulation_capability DECIMAL(3,2) CHECK (future_simulation_capability >= 0 AND future_simulation_capability <= 1),
  adaptive_learning_rate DECIMAL(3,2) CHECK (adaptive_learning_rate >= 0 AND adaptive_learning_rate <= 1),
  error_correction_speed DECIMAL(3,2) CHECK (error_correction_speed >= 0 AND error_correction_speed <= 1),
  overall_prediction_strength DECIMAL(3,2) CHECK (overall_prediction_strength >= 0 AND overall_prediction_strength <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m165_metrics_created_at ON m165_prediction_anticipation_metrics(created_at);
CREATE INDEX idx_m165_metrics_metadata ON m165_prediction_anticipation_metrics USING GIN(metadata);
