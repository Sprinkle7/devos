-- M172: Semantic Memory System
-- Migration 523_524

-- M172 State Table
CREATE TABLE IF NOT EXISTS m172_semantic_memory_state (
  id BIGSERIAL PRIMARY KEY,
  conceptual_representation_quality DECIMAL(3,2) CHECK (conceptual_representation_quality >= 0 AND conceptual_representation_quality <= 1),
  semantic_network_connectivity DECIMAL(3,2) CHECK (semantic_network_connectivity >= 0 AND semantic_network_connectivity <= 1),
  factual_knowledge_strength DECIMAL(3,2) CHECK (factual_knowledge_strength >= 0 AND factual_knowledge_strength <= 1),
  conceptual_organization_quality DECIMAL(3,2) CHECK (conceptual_organization_quality >= 0 AND conceptual_organization_quality <= 1),
  semantic_knowledge_depth DECIMAL(3,2) CHECK (semantic_knowledge_depth >= 0 AND semantic_knowledge_depth <= 1),
  knowledge_accessibility DECIMAL(3,2) CHECK (knowledge_accessibility >= 0 AND knowledge_accessibility <= 1),
  semantic_cognition_integration DECIMAL(3,2) CHECK (semantic_cognition_integration >= 0 AND semantic_cognition_integration <= 1),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_m172_semantic_memory_state_created_at ON m172_semantic_memory_state(created_at);
CREATE INDEX idx_m172_semantic_memory_state_metadata ON m172_semantic_memory_state USING GIN(metadata);

-- M172 Metrics Table
CREATE TABLE IF NOT EXISTS m172_semantic_memory_metrics (
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

CREATE INDEX idx_m172_semantic_memory_metrics_created_at ON m172_semantic_memory_metrics(created_at);
CREATE INDEX idx_m172_semantic_memory_metrics_metadata ON m172_semantic_memory_metrics USING GIN(metadata);
