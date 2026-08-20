-- M166: Error Monitoring and Correction System
-- Migration 0511_0512

-- M166 State Table
CREATE TABLE IF NOT EXISTS m166_error_monitoring_state (
  id BIGSERIAL PRIMARY KEY,
  error_detection_rate DECIMAL(3,2) CHECK (error_detection_rate >= 0 AND error_detection_rate <= 1),
  error_monitoring_accuracy DECIMAL(3,2) CHECK (error_monitoring_accuracy >= 0 AND error_monitoring_accuracy <= 1),
  error_evaluation_quality DECIMAL(3,2) CHECK (error_evaluation_quality >= 0 AND error_evaluation_quality <= 1),
  correction_effectiveness DECIMAL(3,2) CHECK (correction_effectiveness >= 0 AND correction_effectiveness <= 1),
  error_learning_depth DECIMAL(3,2) CHECK (error_learning_depth >= 0 AND error_learning_depth <= 1),
  performance_adjustment_speed DECIMAL(3,2) CHECK (performance_adjustment_speed >= 0 AND performance_adjustment_speed <= 1),
  error_management_proficiency DECIMAL(3,2) CHECK (error_management_proficiency >= 0 AND error_management_proficiency <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m166_state_created_at ON m166_error_monitoring_state(created_at);
CREATE INDEX idx_m166_state_metadata ON m166_error_monitoring_state USING GIN(metadata);

-- M166 Metrics Table
CREATE TABLE IF NOT EXISTS m166_error_monitoring_metrics (
  id BIGSERIAL PRIMARY KEY,
  detection_sensitivity_rate DECIMAL(3,2) CHECK (detection_sensitivity_rate >= 0 AND detection_sensitivity_rate <= 1),
  monitoring_accuracy_quality DECIMAL(3,2) CHECK (monitoring_accuracy_quality >= 0 AND monitoring_accuracy_quality <= 1),
  error_evaluation_precision DECIMAL(3,2) CHECK (error_evaluation_precision >= 0 AND error_evaluation_precision <= 1),
  correction_strategy_effectiveness DECIMAL(3,2) CHECK (correction_strategy_effectiveness >= 0 AND correction_strategy_effectiveness <= 1),
  error_recovery_speed DECIMAL(3,2) CHECK (error_recovery_speed >= 0 AND error_recovery_speed <= 1),
  learning_from_errors_rate DECIMAL(3,2) CHECK (learning_from_errors_rate >= 0 AND learning_from_errors_rate <= 1),
  overall_error_management DECIMAL(3,2) CHECK (overall_error_management >= 0 AND overall_error_management <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m166_metrics_created_at ON m166_error_monitoring_metrics(created_at);
CREATE INDEX idx_m166_metrics_metadata ON m166_error_monitoring_metrics USING GIN(metadata);
