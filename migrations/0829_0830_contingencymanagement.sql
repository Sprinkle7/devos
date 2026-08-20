-- M325: ContingencyManagement System
-- Migration 829_830

CREATE TABLE IF NOT EXISTS m325_contingencymanagement_state (
  id BIGSERIAL PRIMARY KEY,
  metric_1 DECIMAL(3,2) CHECK (metric_1 >= 0 AND metric_1 <= 1),
  metric_2 DECIMAL(3,2) CHECK (metric_2 >= 0 AND metric_2 <= 1),
  metric_3 DECIMAL(3,2) CHECK (metric_3 >= 0 AND metric_3 <= 1),
  metric_4 DECIMAL(3,2) CHECK (metric_4 >= 0 AND metric_4 <= 1),
  integration DECIMAL(3,2) CHECK (integration >= 0 AND integration <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_m325_contingencymanagement_state_created_at ON m325_contingencymanagement_state(created_at);
CREATE INDEX idx_m325_contingencymanagement_state_metadata ON m325_contingencymanagement_state USING GIN(metadata);

CREATE TABLE IF NOT EXISTS m325_contingencymanagement_metrics (
  id BIGSERIAL PRIMARY KEY,
  strength DECIMAL(3,2) CHECK (strength >= 0 AND strength <= 1),
  efficiency DECIMAL(3,2) CHECK (efficiency >= 0 AND efficiency <= 1),
  quality DECIMAL(3,2) CHECK (quality >= 0 AND quality <= 1),
  overall_strength DECIMAL(3,2) CHECK (overall_strength >= 0 AND overall_strength <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_m325_contingencymanagement_metrics_created_at ON m325_contingencymanagement_metrics(created_at);
CREATE INDEX idx_m325_contingencymanagement_metrics_metadata ON m325_contingencymanagement_metrics USING GIN(metadata);
