// VayuGuard API Client — talks to FastAPI backend

import type { EarningsDashboard, SimulationResult, AuditEntry } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("vg_api_key") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

// --- Auth ---

export async function registerUser(phone: string, platform: string = "deliver") {
  return apiFetch<{ api_key: string; user: any }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ phone, platform }),
  });
}

// --- Earnings ---

export async function getEarningsDashboard(zone: string = "Adyar", disruption_type: string = "none") {
  return apiFetch<EarningsDashboard>(
    `/earnings/dashboard?zone=${encodeURIComponent(zone)}&disruption_type=${encodeURIComponent(disruption_type)}`
  );
}

// --- Simulation ---

export async function runSimulation(scenario: string, zone: string = "Adyar", lat?: number, lon?: number) {
  return apiFetch<SimulationResult>("/simulation/run", {
    method: "POST",
    body: JSON.stringify({ scenario, zone, lat, lon }),
  });
}

// --- Audit ---

export async function getAuditTrail(limit: number = 20) {
  return apiFetch<AuditEntry[]>(`/audit/trail?limit=${limit}`);
}

// --- Health ---

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
