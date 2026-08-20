-- M171: Language Processing System
-- Migration 521_522

-- M171 State Table
CREATE TABLE IF NOT EXISTS m171_language_processing_state (
  id BIGSERIAL PRIMARY KEY,
  phonetic_processing_quality DECIMAL(3,2) CHECK (phonetic_processing_quality >= 0 AND phonetic_processing_quality <= 1),
  syntactic_processing_accuracy DECIMAL(3,2) CHECK (syntactic_processing_accuracy >= 0 AND syntactic_processing_accuracy <= 1),
  semantic_processing_depth DECIMAL(3,2) CHECK (semantic_processing_depth >= 0 AND semantic_processing_depth <= 1),
  pragmatic_understanding_quality DECIMAL(3,2) CHECK (pragmatic_understanding_quality >= 0 AND pragmatic_understanding_quality <= 1),
  language_comprehension_strength DECIMAL(3,2) CHECK (language_comprehension_strength >= 0 AND language_comprehension_strength <= 1),
  language_production_quality DECIMAL(3,2) CHECK (language_production_quality >= 0 AND language_production_quality <= 1),
  language_cognition_integration DECIMAL(3,2) CHECK (language_cognition_integration >= 0 AND language_cognition_integration <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m171_language_processing_state_created_at ON m171_language_processing_state(created_at);
CREATE INDEX idx_m171_language_processing_state_metadata ON m171_language_processing_state USING GIN(metadata);

-- M171 Metrics Table
CREATE TABLE IF NOT EXISTS m171_language_processing_metrics (
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

CREATE INDEX idx_m171_language_processing_metrics_created_at ON m171_language_processing_metrics(created_at);
CREATE INDEX idx_m171_language_processing_metrics_metadata ON m171_language_processing_metrics USING GIN(metadata);
