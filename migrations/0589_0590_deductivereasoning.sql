-- M205: DeductiveReasoning System
-- Migration 589_590

-- M205 State Table
CREATE TABLE IF NOT EXISTS m205_deductivereasoning_state (
  id BIGSERIAL PRIMARY KEY,
  metric_1 DECIMAL(3,2) CHECK (metric_1 >= 0 AND metric_1 <= 1),
  metric_2 DECIMAL(3,2) CHECK (metric_2 >= 0 AND metric_2 <= 1),
  metric_3 DECIMAL(3,2) CHECK (metric_3 >= 0 AND metric_3 <= 1),
  integration DECIMAL(3,2) CHECK (integration >= 0 AND integration <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m205_deductivereasoning_state_created_at ON m205_deductivereasoning_state(created_at);
CREATE INDEX idx_m205_deductivereasoning_state_metadata ON m205_deductivereasoning_state USING GIN(metadata);

-- M205 Metrics Table
CREATE TABLE IF NOT EXISTS m205_deductivereasoning_metrics (
  id BIGSERIAL PRIMARY KEY,
  strength DECIMAL(3,2) CHECK (strength >= 0 AND strength <= 1),
  efficiency DECIMAL(3,2) CHECK (efficiency >= 0 AND efficiency <= 1),
  quality DECIMAL(3,2) CHECK (quality >= 0 AND quality <= 1),
  overall_strength DECIMAL(3,2) CHECK (overall_strength >= 0 AND overall_strength <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m205_deductivereasoning_metrics_created_at ON m205_deductivereasoning_metrics(created_at);
CREATE INDEX idx_m205_deductivereasoning_metrics_metadata ON m205_deductivereasoning_metrics USING GIN(metadata);
