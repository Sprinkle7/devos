// M174: Decision Making System Types
export interface OptionEvaluation {
  optionevaluation_id: string;
  option_type: string;
  option_assessment: number; // 0-1.0
  attribute_analysis: number; // 0-1.0
  value_calculation: number; // 0-1.0
  utility_estimation: number; // 0-1.0
}
export interface RiskAssessment {
  riskassessment_id: string;
  risk_domain: number; // 0-1.0
  risk_detection: number; // 0-1.0
  uncertainty_estimation: number; // 0-1.0
  consequence_prediction: number; // 0-1.0
  risk_tolerance: number; // 0-1.0
}
export interface PreferenceFormation {
  preferenceformation_id: string;
  preference_type: string;
  value_weighting: number; // 0-1.0
  preference_consistency: number; // 0-1.0
  temporal_stability: number; // 0-1.0
  preference_clarity: number; // 0-1.0
}
export interface DecisionSelection {
  decisionselection_id: string;
  selection_domain: number; // 0-1.0
  option_selection_quality: number; // 0-1.0
  decision_confidence: number; // 0-1.0
  commitment_strength: number; // 0-1.0
  post_decision_satisfaction: number; // 0-1.0
}
export interface DecisionMakingSystemState {
  state_metric_1: number; // 0-1.0
  state_metric_2: number; // 0-1.0
  state_metric_3: number; // 0-1.0
  state_metric_4: number; // 0-1.0
  integration_quality: number; // 0-1.0
  stability: number; // 0-1.0
  cognition_integration: number; // 0-1.0
  timestamp_ms: number;
}
export interface DecisionMakingSystemMetrics {
  metric_1: number; // 0-1.0
  metric_2: number; // 0-1.0
  metric_3: number; // 0-1.0
  metric_4: number; // 0-1.0
  metric_5: number; // 0-1.0
  metric_6: number; // 0-1.0
  overall_strength: number; // 0-1.0
}
