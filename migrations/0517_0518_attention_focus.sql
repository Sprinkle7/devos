-- M169: Attention and Focus System
-- Migration 517_518

-- M169 State Table
CREATE TABLE IF NOT EXISTS m169_attention_focus_state (
  id BIGSERIAL PRIMARY KEY,
  selective_attention_quality DECIMAL(3,2) CHECK (selective_attention_quality >= 0 AND selective_attention_quality <= 1),
  sustained_focus_strength DECIMAL(3,2) CHECK (sustained_focus_strength >= 0 AND sustained_focus_strength <= 1),
  attentional_shifting_efficiency DECIMAL(3,2) CHECK (attentional_shifting_efficiency >= 0 AND attentional_shifting_efficiency <= 1),
  attentional_capacity_level DECIMAL(3,2) CHECK (attentional_capacity_level >= 0 AND attentional_capacity_level <= 1),
  attention_control_effectiveness DECIMAL(3,2) CHECK (attention_control_effectiveness >= 0 AND attention_control_effectiveness <= 1),
  focus_stability DECIMAL(3,2) CHECK (focus_stability >= 0 AND focus_stability <= 1),
  attentional_cognition_integration DECIMAL(3,2) CHECK (attentional_cognition_integration >= 0 AND attentional_cognition_integration <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m169_attention_focus_state_created_at ON m169_attention_focus_state(created_at);
CREATE INDEX idx_m169_attention_focus_state_metadata ON m169_attention_focus_state USING GIN(metadata);

-- M169 Metrics Table
CREATE TABLE IF NOT EXISTS m169_attention_focus_metrics (
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

CREATE INDEX idx_m169_attention_focus_metrics_created_at ON m169_attention_focus_metrics(created_at);
CREATE INDEX idx_m169_attention_focus_metrics_metadata ON m169_attention_focus_metrics USING GIN(metadata);
