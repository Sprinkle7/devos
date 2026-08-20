-- M198: AnxietyRegulation System
-- Migration 575_576

-- M198 State Table
CREATE TABLE IF NOT EXISTS m198_anxietyregulation_state (
  id BIGSERIAL PRIMARY KEY,
  metric_1 DECIMAL(3,2) CHECK (metric_1 >= 0 AND metric_1 <= 1),
  metric_2 DECIMAL(3,2) CHECK (metric_2 >= 0 AND metric_2 <= 1),
  metric_3 DECIMAL(3,2) CHECK (metric_3 >= 0 AND metric_3 <= 1),
  integration DECIMAL(3,2) CHECK (integration >= 0 AND integration <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m198_anxietyregulation_state_created_at ON m198_anxietyregulation_state(created_at);
CREATE INDEX idx_m198_anxietyregulation_state_metadata ON m198_anxietyregulation_state USING GIN(metadata);

-- M198 Metrics Table
CREATE TABLE IF NOT EXISTS m198_anxietyregulation_metrics (
  id BIGSERIAL PRIMARY KEY,
  strength DECIMAL(3,2) CHECK (strength >= 0 AND strength <= 1),
  efficiency DECIMAL(3,2) CHECK (efficiency >= 0 AND efficiency <= 1),
  quality DECIMAL(3,2) CHECK (quality >= 0 AND quality <= 1),
  overall_strength DECIMAL(3,2) CHECK (overall_strength >= 0 AND overall_strength <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m198_anxietyregulation_metrics_created_at ON m198_anxietyregulation_metrics(created_at);
CREATE INDEX idx_m198_anxietyregulation_metrics_metadata ON m198_anxietyregulation_metrics USING GIN(metadata);
