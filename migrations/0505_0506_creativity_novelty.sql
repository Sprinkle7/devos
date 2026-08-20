-- M163: Creativity and Novelty Generation System
-- Migration 0505_0506

-- M163 State Table
CREATE TABLE IF NOT EXISTS m163_creativity_state (
  id BIGSERIAL PRIMARY KEY,
  total_creative_processes INT DEFAULT 0,
  novelty_generation_capacity DECIMAL(3,2) CHECK (novelty_generation_capacity >= 0 AND novelty_generation_capacity <= 1),
  divergent_thinking_strength DECIMAL(3,2) CHECK (divergent_thinking_strength >= 0 AND divergent_thinking_strength <= 1),
  convergent_integration_quality DECIMAL(3,2) CHECK (convergent_integration_quality >= 0 AND convergent_integration_quality <= 1),
  creative_synthesis_depth DECIMAL(3,2) CHECK (creative_synthesis_depth >= 0 AND creative_synthesis_depth <= 1),
  innovation_readiness DECIMAL(3,2) CHECK (innovation_readiness >= 0 AND innovation_readiness <= 1),
  creative_cognition_integration DECIMAL(3,2) CHECK (creative_cognition_integration >= 0 AND creative_cognition_integration <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m163_state_created_at ON m163_creativity_state(created_at);
CREATE INDEX idx_m163_state_metadata ON m163_creativity_state USING GIN(metadata);

-- M163 Metrics Table
CREATE TABLE IF NOT EXISTS m163_creativity_metrics (
  id BIGSERIAL PRIMARY KEY,
  creative_generation_rate DECIMAL(3,2) CHECK (creative_generation_rate >= 0 AND creative_generation_rate <= 1),
  novelty_production_quality DECIMAL(3,2) CHECK (novelty_production_quality >= 0 AND novelty_production_quality <= 1),
  divergent_thinking_capacity DECIMAL(3,2) CHECK (divergent_thinking_capacity >= 0 AND divergent_thinking_capacity <= 1),
  convergent_thinking_effectiveness DECIMAL(3,2) CHECK (convergent_thinking_effectiveness >= 0 AND convergent_thinking_effectiveness <= 1),
  creative_problem_solving_ability DECIMAL(3,2) CHECK (creative_problem_solving_ability >= 0 AND creative_problem_solving_ability <= 1),
  idea_integration_efficiency DECIMAL(3,2) CHECK (idea_integration_efficiency >= 0 AND idea_integration_efficiency <= 1),
  overall_creative_strength DECIMAL(3,2) CHECK (overall_creative_strength >= 0 AND overall_creative_strength <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m163_metrics_created_at ON m163_creativity_metrics(created_at);
CREATE INDEX idx_m163_metrics_metadata ON m163_creativity_metrics USING GIN(metadata);
