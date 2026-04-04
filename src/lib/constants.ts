// VayuGuard Constants — Chennai-focused data and configuration

import { Scenario, HistoryItem } from "./types";

export const NAV_LINKS = ["Dashboard", "Disruption Impact", "History"] as const;

// Chennai disruption scenarios
export const SCENARIOS: Scenario[] = [
  {
    id: "flood",
    label: "Chennai Flood Alert",
    icon: "🌧️",
    zone: "Adyar",
    detail: "Heavy rain >15mm/hr — Adyar zone flooding",
    disruption_type: "flood",
    lat: 13.0067,
    lon: 80.2206,
  },
  {
    id: "heat",
    label: "Extreme Heat Advisory",
    icon: "🌡️",
    zone: "Tambaram",
    detail: "Temperature >45°C — unsafe outdoor conditions",
    disruption_type: "heat",
    lat: 12.9249,
    lon: 80.1000,
  },
  {
    id: "waterlog",
    label: "Water Logging Alert",
    icon: "🌊",
    zone: "Velachery",
    detail: "Severe waterlogging — roads impassable",
    disruption_type: "waterlog",
    lat: 12.9758,
    lon: 80.2205,
  },
];

// Zero-Touch Claims Pipeline steps
export const PIPELINE_STEPS = [
  { engine: "Event Engine", label: "Detecting disruption..." },
  { engine: "Risk Engine", label: "Evaluating severity..." },
  { engine: "Earnings Engine", label: "Calculating earnings gap..." },
  { engine: "Trust Engine", label: "Validating authenticity..." },
  { engine: "Claims Engine", label: "Processing Auto Adjustment..." },
];

// Demo history for Chennai
export const HISTORY_DATA: HistoryItem[] = [
  {
    date: "Mar 28",
    event: "Heavy rain — Adyar zone",
    zone: "Adyar",
    score: 91,
    payout: "₹420",
    status: "paid",
    audit_reason: "Auto Adjustment approved: Rain 18mm > 15mm threshold + 52% platform drop + inactivity deviation 61% + trust score 91",
  },
  {
    date: "Mar 21",
    event: "Extreme heat alert — Tambaram",
    zone: "Tambaram",
    score: 62,
    payout: "₹280",
    status: "review",
    audit_reason: "Auto Adjustment verify: Temp 46°C > 45°C threshold + 35% platform drop + trust score 62 — video verification required",
  },
  {
    date: "Mar 14",
    event: "Water logging — Velachery",
    zone: "Velachery",
    score: 88,
    payout: "₹350",
    status: "paid",
    audit_reason: "Auto Adjustment approved: Rain 22mm > 15mm + waterlogging confirmed + 48% platform drop + trust score 88",
  },
  {
    date: "Mar 07",
    event: "Coordinated anomaly — T. Nagar",
    zone: "T. Nagar",
    score: 38,
    payout: "—",
    status: "flagged",
    audit_reason: "Auto Adjustment flagged: 4 claims in 7 days + coordinated pattern detected + trust score 38 — manual review required",
  },
];

// Trust signal labels
export const TRUST_SIGNAL_LABELS: Record<string, string> = {
  motion: "Motion Validation",
  behavior: "Behavioral Patterns",
  cluster: "Hyperlocal Cluster (500m)",
  environment: "Environmental Check",
  network: "Network Validation",
  coordinated: "Coordinated Fraud Detection",
};

// Chennai zones
export const CHENNAI_ZONES = [
  "Adyar",
  "Velachery",
  "T. Nagar",
  "Anna Nagar",
  "Tambaram",
  "Perungudi",
  "Sholinganallur",
];
