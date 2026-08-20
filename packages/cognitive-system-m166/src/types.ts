// M166: Error Monitoring and Correction System Types
export interface ErrorDetection {
  detection_id: string;
  error_type: string;
  error_salience: number; // 0-1.0
  monitoring_sensitivity: number; // 0-1.0
  conflict_detection: number; // 0-1.0
  anomaly_recognition: number; // 0-1.0
}
export interface ErrorEvaluation {
  evaluation_id: string;
  evaluation_domain: string;
  error_severity_assessment: number; // 0-1.0
  consequence_evaluation: number; // 0-1.0
  priority_determination: number; // 0-1.0
  response_urgency: number; // 0-1.0
}
export interface CorrectionImplementation {
  correction_id: string;
  correction_type: string;
  strategy_selection: number; // 0-1.0
  correction_efficiency: number; // 0-1.0
  implementation_success: number; // 0-1.0
  performance_recovery: number; // 0-1.0
}
export interface LearningFromErrors {
  learning_id: string;
  error_learning_type: string;
  error_memory_integration: number; // 0-1.0
  strategy_adaptation: number; // 0-1.0
  future_error_prevention: number; // 0-1.0
  performance_improvement: number; // 0-1.0
}
export interface ErrorMonitoringState {
  error_detection_rate: number; // 0-1.0
  error_monitoring_accuracy: number; // 0-1.0
  error_evaluation_quality: number; // 0-1.0
  correction_effectiveness: number; // 0-1.0
  error_learning_depth: number; // 0-1.0
  performance_adjustment_speed: number; // 0-1.0
  error_management_proficiency: number; // 0-1.0
  timestamp_ms: number;
}
export interface ErrorMonitoringMetrics {
  detection_sensitivity_rate: number; // 0-1.0
  monitoring_accuracy_quality: number; // 0-1.0
  error_evaluation_precision: number; // 0-1.0
  correction_strategy_effectiveness: number; // 0-1.0
  error_recovery_speed: number; // 0-1.0
  learning_from_errors_rate: number; // 0-1.0
  overall_error_management: number; // 0-1.0
}
