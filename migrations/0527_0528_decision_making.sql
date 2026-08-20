-- M174: Decision Making System
-- Migration 527_528

-- M174 State Table
CREATE TABLE IF NOT EXISTS m174_decision_making_state (
  id BIGSERIAL PRIMARY KEY,
  option_evaluation_quality DECIMAL(3,2) CHECK (option_evaluation_quality >= 0 AND option_evaluation_quality <= 1),
  risk_assessment_accuracy DECIMAL(3,2) CHECK (risk_assessment_accuracy >= 0 AND risk_assessment_accuracy <= 1),
  preference_formation_strength DECIMAL(3,2) CHECK (preference_formation_strength >= 0 AND preference_formation_strength <= 1),
  decision_selection_quality DECIMAL(3,2) CHECK (decision_selection_quality >= 0 AND decision_selection_quality <= 1),
  decision_effectiveness DECIMAL(3,2) CHECK (decision_effectiveness >= 0 AND decision_effectiveness <= 1),
  decision_speed_quality DECIMAL(3,2) CHECK (decision_speed_quality >= 0 AND decision_speed_quality <= 1),
  decision_cognition_integration DECIMAL(3,2) CHECK (decision_cognition_integration >= 0 AND decision_cognition_integration <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m174_decision_making_state_created_at ON m174_decision_making_state(created_at);
CREATE INDEX idx_m174_decision_making_state_metadata ON m174_decision_making_state USING GIN(metadata);

-- M174 Metrics Table
CREATE TABLE IF NOT EXISTS m174_decision_making_metrics (
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

CREATE INDEX idx_m174_decision_making_metrics_created_at ON m174_decision_making_metrics(created_at);
CREATE INDEX idx_m174_decision_making_metrics_metadata ON m174_decision_making_metrics USING GIN(metadata);
