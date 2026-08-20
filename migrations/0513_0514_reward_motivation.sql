-- M167: Reward Processing and Motivation System
-- Migration 0513_0514

-- M167 State Table
CREATE TABLE IF NOT EXISTS m167_reward_motivation_state (
  id BIGSERIAL PRIMARY KEY,
  total_reward_experiences INT DEFAULT 0,
  reward_processing_sensitivity DECIMAL(3,2) CHECK (reward_processing_sensitivity >= 0 AND reward_processing_sensitivity <= 1),
  motivational_drive_level DECIMAL(3,2) CHECK (motivational_drive_level >= 0 AND motivational_drive_level <= 1),
  reward_learning_strength DECIMAL(3,2) CHECK (reward_learning_strength >= 0 AND reward_learning_strength <= 1),
  incentive_evaluation_quality DECIMAL(3,2) CHECK (incentive_evaluation_quality >= 0 AND incentive_evaluation_quality <= 1),
  goal_pursuit_intensity DECIMAL(3,2) CHECK (goal_pursuit_intensity >= 0 AND goal_pursuit_intensity <= 1),
  motivation_sustainability_level DECIMAL(3,2) CHECK (motivation_sustainability_level >= 0 AND motivation_sustainability_level <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m167_state_created_at ON m167_reward_motivation_state(created_at);
CREATE INDEX idx_m167_state_metadata ON m167_reward_motivation_state USING GIN(metadata);

-- M167 Metrics Table
CREATE TABLE IF NOT EXISTS m167_reward_motivation_metrics (
  id BIGSERIAL PRIMARY KEY,
  reward_sensitivity_rate DECIMAL(3,2) CHECK (reward_sensitivity_rate >= 0 AND reward_sensitivity_rate <= 1),
  motivational_drive_strength DECIMAL(3,2) CHECK (motivational_drive_strength >= 0 AND motivational_drive_strength <= 1),
  reward_learning_efficiency DECIMAL(3,2) CHECK (reward_learning_efficiency >= 0 AND reward_learning_efficiency <= 1),
  incentive_salience_strength DECIMAL(3,2) CHECK (incentive_salience_strength >= 0 AND incentive_salience_strength <= 1),
  goal_persistence_capacity DECIMAL(3,2) CHECK (goal_persistence_capacity >= 0 AND goal_persistence_capacity <= 1),
  motivation_sustainability_quality DECIMAL(3,2) CHECK (motivation_sustainability_quality >= 0 AND motivation_sustainability_quality <= 1),
  overall_reward_motivation_strength DECIMAL(3,2) CHECK (overall_reward_motivation_strength >= 0 AND overall_reward_motivation_strength <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m167_metrics_created_at ON m167_reward_motivation_metrics(created_at);
CREATE INDEX idx_m167_metrics_metadata ON m167_reward_motivation_metrics USING GIN(metadata);
