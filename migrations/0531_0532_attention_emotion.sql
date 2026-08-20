-- M176: Attention to Emotion System
-- Migration 531_532

-- M176 State Table
CREATE TABLE IF NOT EXISTS m176_attention_emotion_state (
  id BIGSERIAL PRIMARY KEY,
  emotional_salience_detection DECIMAL(3,2) CHECK (emotional_salience_detection >= 0 AND emotional_salience_detection <= 1),
  biased_processing_strength DECIMAL(3,2) CHECK (biased_processing_strength >= 0 AND biased_processing_strength <= 1),
  emotional_focus_quality DECIMAL(3,2) CHECK (emotional_focus_quality >= 0 AND emotional_focus_quality <= 1),
  affective_influence_strength DECIMAL(3,2) CHECK (affective_influence_strength >= 0 AND affective_influence_strength <= 1),
  emotion_attention_integration DECIMAL(3,2) CHECK (emotion_attention_integration >= 0 AND emotion_attention_integration <= 1),
  affective_processing_speed DECIMAL(3,2) CHECK (affective_processing_speed >= 0 AND affective_processing_speed <= 1),
  emotion_attention_cognition_integration DECIMAL(3,2) CHECK (emotion_attention_cognition_integration >= 0 AND emotion_attention_cognition_integration <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m176_attention_emotion_state_created_at ON m176_attention_emotion_state(created_at);
CREATE INDEX idx_m176_attention_emotion_state_metadata ON m176_attention_emotion_state USING GIN(metadata);

-- M176 Metrics Table
CREATE TABLE IF NOT EXISTS m176_attention_emotion_metrics (
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

CREATE INDEX idx_m176_attention_emotion_metrics_created_at ON m176_attention_emotion_metrics(created_at);
CREATE INDEX idx_m176_attention_emotion_metrics_metadata ON m176_attention_emotion_metrics USING GIN(metadata);
