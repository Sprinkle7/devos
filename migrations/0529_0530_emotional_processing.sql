-- M175: Emotional Processing System
-- Migration 529_530

-- M175 State Table
CREATE TABLE IF NOT EXISTS m175_emotional_processing_state (
  id BIGSERIAL PRIMARY KEY,
  emotion_detection_quality DECIMAL(3,2) CHECK (emotion_detection_quality >= 0 AND emotion_detection_quality <= 1),
  emotion_interpretation_accuracy DECIMAL(3,2) CHECK (emotion_interpretation_accuracy >= 0 AND emotion_interpretation_accuracy <= 1),
  emotion_regulation_effectiveness DECIMAL(3,2) CHECK (emotion_regulation_effectiveness >= 0 AND emotion_regulation_effectiveness <= 1),
  emotional_memory_strength DECIMAL(3,2) CHECK (emotional_memory_strength >= 0 AND emotional_memory_strength <= 1),
  emotional_processing_depth DECIMAL(3,2) CHECK (emotional_processing_depth >= 0 AND emotional_processing_depth <= 1),
  emotional_awareness_quality DECIMAL(3,2) CHECK (emotional_awareness_quality >= 0 AND emotional_awareness_quality <= 1),
  emotional_cognition_integration DECIMAL(3,2) CHECK (emotional_cognition_integration >= 0 AND emotional_cognition_integration <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m175_emotional_processing_state_created_at ON m175_emotional_processing_state(created_at);
CREATE INDEX idx_m175_emotional_processing_state_metadata ON m175_emotional_processing_state USING GIN(metadata);

-- M175 Metrics Table
CREATE TABLE IF NOT EXISTS m175_emotional_processing_metrics (
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

CREATE INDEX idx_m175_emotional_processing_metrics_created_at ON m175_emotional_processing_metrics(created_at);
CREATE INDEX idx_m175_emotional_processing_metrics_metadata ON m175_emotional_processing_metrics USING GIN(metadata);
