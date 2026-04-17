// VayuGuard TypeScript types

export interface TrustSignals {
  motion: number;
  behavior: number;
  cluster: number;
  environment: number;
  network: number;
  coordinated: number;
}

export interface TrustResult {
  overall: number;
  signals: TrustSignals;
  tier: "HIGH" | "MEDIUM" | "LOW";
}

export interface EarningsDashboard {
  predicted_earnings: number;
  guaranteed_floor: number;
  current_earnings: number;
  gap_covered: number;
  dynamic_premium: number;
  premium_reasoning: string;
  disruption_active: boolean;
  disruption_type: string;
}

export interface PipelineStep {
  step: number;
  engine: string;
  label: string;
  status: string;
  data: Record<string, any>;
}

export interface SimulationResult {
  steps: PipelineStep[];
  trust_result: TrustResult;
  earnings_before: number;
  earnings_after: number;
  floor: number;
  gap: number;
  payout: number;
  payout_eligible: boolean;
  requires_verification: boolean;
  audit_reason: string;
  upi_message: string;
}

export interface AuditEntry {
  id: number;
  claim_id: number;
  reason: string;
  decision: string;
  trust_score: number;
  signals_snapshot: TrustSignals;
  created_at: string;
}

export interface HistoryItem {
  date: string;
  event: string;
  zone: string;
  score: number;
  payout: string;
  status: "paid" | "review" | "flagged";
  audit_reason: string;
}

export type NavPage = "Dashboard" | "Disruption Impact" | "My Plan" | "Claims" | "History";

export interface Scenario {
  id: string;
  label: string;
  icon: string;
  zone: string;
  detail: string;
  disruption_type: string;
  lat: number;
  lon: number;
}

export interface FraudResult {
  is_fraud: boolean;
  fraud_score: number;
  details: {
    weather_mismatch: boolean;
    actual_weather: string;
    speed_anomaly: boolean;
    ml_prediction: string;
  };
}

export interface AdminMetrics {
  total_claims_paid: number;
  total_premiums_collected: number;
  loss_ratio: number;
  fraud_rate: number;
  weekly_prediction: number;
  recent_anomalies: number;
}
