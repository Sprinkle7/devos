-- M164: Learning and Memory Consolidation System
-- Migration 0507_0508

-- M164 State Table
CREATE TABLE IF NOT EXISTS m164_learning_memory_state (
  id BIGSERIAL PRIMARY KEY,
  total_learning_acquisitions INT DEFAULT 0,
  learning_efficiency_level DECIMAL(3,2) CHECK (learning_efficiency_level >= 0 AND learning_efficiency_level <= 1),
  memory_consolidation_strength DECIMAL(3,2) CHECK (memory_consolidation_strength >= 0 AND memory_consolidation_strength <= 1),
  retrieval_optimization_quality DECIMAL(3,2) CHECK (retrieval_optimization_quality >= 0 AND retrieval_optimization_quality <= 1),
  learning_transfer_capacity DECIMAL(3,2) CHECK (learning_transfer_capacity >= 0 AND learning_transfer_capacity <= 1),
  memory_retention_quality DECIMAL(3,2) CHECK (memory_retention_quality >= 0 AND memory_retention_quality <= 1),
  learning_performance_level DECIMAL(3,2) CHECK (learning_performance_level >= 0 AND learning_performance_level <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m164_state_created_at ON m164_learning_memory_state(created_at);
CREATE INDEX idx_m164_state_metadata ON m164_learning_memory_state USING GIN(metadata);

-- M164 Metrics Table
CREATE TABLE IF NOT EXISTS m164_learning_memory_metrics (
  id BIGSERIAL PRIMARY KEY,
  learning_acquisition_rate DECIMAL(3,2) CHECK (learning_acquisition_rate >= 0 AND learning_acquisition_rate <= 1),
  memory_consolidation_efficiency DECIMAL(3,2) CHECK (memory_consolidation_efficiency >= 0 AND memory_consolidation_efficiency <= 1),
  retrieval_success_rate DECIMAL(3,2) CHECK (retrieval_success_rate >= 0 AND retrieval_success_rate <= 1),
  learning_retention_durability DECIMAL(3,2) CHECK (learning_retention_durability >= 0 AND learning_retention_durability <= 1),
  transfer_learning_capacity DECIMAL(3,2) CHECK (transfer_learning_capacity >= 0 AND transfer_learning_capacity <= 1),
  knowledge_integration_depth DECIMAL(3,2) CHECK (knowledge_integration_depth >= 0 AND knowledge_integration_depth <= 1),
  overall_learning_strength DECIMAL(3,2) CHECK (overall_learning_strength >= 0 AND overall_learning_strength <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m164_metrics_created_at ON m164_learning_memory_metrics(created_at);
CREATE INDEX idx_m164_metrics_metadata ON m164_learning_memory_metrics USING GIN(metadata);
