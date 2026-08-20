-- M177: Facial Expression Recognition System
-- Migration 533_534

-- M177 State Table
CREATE TABLE IF NOT EXISTS m177_facial_recognition_state (
  id BIGSERIAL PRIMARY KEY,
  facial_feature_detection_accuracy DECIMAL(3,2) CHECK (facial_feature_detection_accuracy >= 0 AND facial_feature_detection_accuracy <= 1),
  expression_categorization_quality DECIMAL(3,2) CHECK (expression_categorization_quality >= 0 AND expression_categorization_quality <= 1),
  micro_expression_detection_sensitivity DECIMAL(3,2) CHECK (micro_expression_detection_sensitivity >= 0 AND micro_expression_detection_sensitivity <= 1),
  facial_emotion_integration_quality DECIMAL(3,2) CHECK (facial_emotion_integration_quality >= 0 AND facial_emotion_integration_quality <= 1),
  facial_recognition_accuracy DECIMAL(3,2) CHECK (facial_recognition_accuracy >= 0 AND facial_recognition_accuracy <= 1),
  expression_understanding_depth DECIMAL(3,2) CHECK (expression_understanding_depth >= 0 AND expression_understanding_depth <= 1),
  facial_emotion_cognition_integration DECIMAL(3,2) CHECK (facial_emotion_cognition_integration >= 0 AND facial_emotion_cognition_integration <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m177_facial_recognition_state_created_at ON m177_facial_recognition_state(created_at);
CREATE INDEX idx_m177_facial_recognition_state_metadata ON m177_facial_recognition_state USING GIN(metadata);

-- M177 Metrics Table
CREATE TABLE IF NOT EXISTS m177_facial_recognition_metrics (
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

CREATE INDEX idx_m177_facial_recognition_metrics_created_at ON m177_facial_recognition_metrics(created_at);
CREATE INDEX idx_m177_facial_recognition_metrics_metadata ON m177_facial_recognition_metrics USING GIN(metadata);
