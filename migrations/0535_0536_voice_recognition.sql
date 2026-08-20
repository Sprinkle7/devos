-- M178: Voice Recognition System
-- Migration 535_536

-- M178 State Table
CREATE TABLE IF NOT EXISTS m178_voice_recognition_state (
  id BIGSERIAL PRIMARY KEY,
  prosody_analysis_quality DECIMAL(3,2) CHECK (prosody_analysis_quality >= 0 AND prosody_analysis_quality <= 1),
  voice_characteristics_accuracy DECIMAL(3,2) CHECK (voice_characteristics_accuracy >= 0 AND voice_characteristics_accuracy <= 1),
  speech_content_analysis_quality DECIMAL(3,2) CHECK (speech_content_analysis_quality >= 0 AND speech_content_analysis_quality <= 1),
  vocal_emotion_integration_quality DECIMAL(3,2) CHECK (vocal_emotion_integration_quality >= 0 AND vocal_emotion_integration_quality <= 1),
  voice_recognition_accuracy DECIMAL(3,2) CHECK (voice_recognition_accuracy >= 0 AND voice_recognition_accuracy <= 1),
  speech_understanding_depth DECIMAL(3,2) CHECK (speech_understanding_depth >= 0 AND speech_understanding_depth <= 1),
  vocal_emotion_cognition_integration DECIMAL(3,2) CHECK (vocal_emotion_cognition_integration >= 0 AND vocal_emotion_cognition_integration <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m178_voice_recognition_state_created_at ON m178_voice_recognition_state(created_at);
CREATE INDEX idx_m178_voice_recognition_state_metadata ON m178_voice_recognition_state USING GIN(metadata);

-- M178 Metrics Table
CREATE TABLE IF NOT EXISTS m178_voice_recognition_metrics (
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

CREATE INDEX idx_m178_voice_recognition_metrics_created_at ON m178_voice_recognition_metrics(created_at);
CREATE INDEX idx_m178_voice_recognition_metrics_metadata ON m178_voice_recognition_metrics USING GIN(metadata);
