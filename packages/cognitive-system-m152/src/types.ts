// M152: Sense of Agency and Volitional Control System Types

export interface VoluntaryAction {
  action_id: string;
  action_description: string;
  intention_clarity: number; // 0-1.0
  action_authorship: number; // 0-1.0
  sense_of_control: number; // 0-1.0
  deliberation_level: number; // 0-1.0
}

export interface SenseOfAgency {
  agency_id: string;
  action_id: string;
  agency_strength: number; // 0-1.0
  causal_responsibility: number; // 0-1.0
  volitional_presence: number; // 0-1.0
  free_will_perception: number; // 0-1.0
}

export interface MotorIntention {
  intention_id: string;
  goal: string;
  intention_strength: number; // 0-1.0
  commitment_level: number; // 0-1.0
  action_readiness: number; // 0-1.0
  implementation_specificity: number; // 0-1.0
}

export interface ExecutiveFunction {
  executive_id: string;
  function_type: string; // 'planning', 'inhibition', 'switching', 'working-memory'
  execution_quality: number; // 0-1.0
  decision_efficacy: number; // 0-1.0
  goal_directedness: number; // 0-1.0
}

export interface AgencyState {
  total_actions_initiated: number;
  average_sense_of_agency: number; // 0-1.0
  average_volitional_strength: number; // 0-1.0
  executive_function_level: number; // 0-1.0
  intentionality_clarity: number; // 0-1.0
  free_will_experience_level: number; // 0-1.0
  action_control_effectiveness: number; // 0-1.0
  timestamp_ms: number;
}

export interface AgencyMetrics {
  agency_coherence: number; // 0-1.0
  volitional_control_strength: number; // 0-1.0
  intention_action_alignment: number; // 0-1.0
  executive_efficiency: number; // 0-1.0
  sense_of_responsibility: number; // 0-1.0
  action_initiation_propensity: number; // 0-1.0
  autonomous_control_rate: number; // 0-1.0
}
