-- M168: Social Cognition and Theory of Mind System
-- Migration 0515_0516

-- M168 State Table
CREATE TABLE IF NOT EXISTS m168_social_cognition_state (
  id BIGSERIAL PRIMARY KEY,
  mental_state_reading_accuracy DECIMAL(3,2) CHECK (mental_state_reading_accuracy >= 0 AND mental_state_reading_accuracy <= 1),
  perspective_taking_capacity DECIMAL(3,2) CHECK (perspective_taking_capacity >= 0 AND perspective_taking_capacity <= 1),
  social_inference_quality DECIMAL(3,2) CHECK (social_inference_quality >= 0 AND social_inference_quality <= 1),
  social_coordination_effectiveness DECIMAL(3,2) CHECK (social_coordination_effectiveness >= 0 AND social_coordination_effectiveness <= 1),
  theory_of_mind_sophistication DECIMAL(3,2) CHECK (theory_of_mind_sophistication >= 0 AND theory_of_mind_sophistication <= 1),
  social_understanding_depth DECIMAL(3,2) CHECK (social_understanding_depth >= 0 AND social_understanding_depth <= 1),
  social_cognition_integration DECIMAL(3,2) CHECK (social_cognition_integration >= 0 AND social_cognition_integration <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m168_state_created_at ON m168_social_cognition_state(created_at);
CREATE INDEX idx_m168_state_metadata ON m168_social_cognition_state USING GIN(metadata);

-- M168 Metrics Table
CREATE TABLE IF NOT EXISTS m168_social_cognition_metrics (
  id BIGSERIAL PRIMARY KEY,
  mental_state_attribution_accuracy DECIMAL(3,2) CHECK (mental_state_attribution_accuracy >= 0 AND mental_state_attribution_accuracy <= 1),
  perspective_taking_flexibility DECIMAL(3,2) CHECK (perspective_taking_flexibility >= 0 AND perspective_taking_flexibility <= 1),
  social_prediction_accuracy DECIMAL(3,2) CHECK (social_prediction_accuracy >= 0 AND social_prediction_accuracy <= 1),
  behavioral_understanding_quality DECIMAL(3,2) CHECK (behavioral_understanding_quality >= 0 AND behavioral_understanding_quality <= 1),
  empathetic_accuracy_rate DECIMAL(3,2) CHECK (empathetic_accuracy_rate >= 0 AND empathetic_accuracy_rate <= 1),
  social_coordination_efficiency DECIMAL(3,2) CHECK (social_coordination_efficiency >= 0 AND social_coordination_efficiency <= 1),
  overall_theory_of_mind_strength DECIMAL(3,2) CHECK (overall_theory_of_mind_strength >= 0 AND overall_theory_of_mind_strength <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m168_metrics_created_at ON m168_social_cognition_metrics(created_at);
CREATE INDEX idx_m168_metrics_metadata ON m168_social_cognition_metrics USING GIN(metadata);
