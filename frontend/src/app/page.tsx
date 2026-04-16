"use client";

import React, { useState, useEffect } from "react";
import EarningsFloorCard from "@/components/EarningsFloorCard";
import TrustScoreCard from "@/components/TrustScoreCard";
import PremiumCard from "@/components/PremiumCard";
import PredictionCard from "@/components/PredictionCard";
import HistoryTable from "@/components/HistoryTable";
import { getEarningsDashboard, getAuditTrail, runSimulation } from "@/lib/api";
import type { EarningsDashboard, HistoryItem, SimulationResult, TrustResult } from "@/lib/types";
import { HISTORY_DATA } from "@/lib/constants";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<EarningsDashboard | null>(null);
  const [trustData, setTrustData] = useState<TrustResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(HISTORY_DATA);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getEarningsDashboard("Adyar", "none");
        setDashboardData(data);
        
        // Also run a dummy simulation just to get the initial trust score
        try {
          const simRes = await runSimulation("clear", "Adyar");
          setTrustData(simRes.trust_result);
        } catch (e) {
          // If no backend, use default
          setTrustData({
            overall: 91,
            signals: {
              motion: 85,
              behavior: 94,
              cluster: 88,
              environment: 95,
              network: 99,
              coordinated: 86
            },
            tier: "HIGH"
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
        // Fallback demo data if backend isn't running
        setDashboardData({
          predicted_earnings: 4200,
          guaranteed_floor: 3000,
          current_earnings: 4200,
          gap_covered: 0,
          dynamic_premium: 58,
          premium_reasoning: "High flood-risk zone (Adyar) → elevated disruption probability",
          disruption_active: false,
          disruption_type: "none"
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !dashboardData) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Active Protection Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Real-time status of your Income Stabilization and Trust metrics.</p>
      </div>

      <EarningsFloorCard
        predicted={dashboardData.predicted_earnings}
        floor={dashboardData.guaranteed_floor}
        current={dashboardData.current_earnings}
        gap={dashboardData.gap_covered}
        disruption_active={dashboardData.disruption_active}
        disruption_type={dashboardData.disruption_type}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <TrustScoreCard
          overall={trustData?.overall || 91}
          signals={trustData?.signals || {
            motion: 85, behavior: 94, cluster: 88, environment: 95, network: 99, coordinated: 86
          }}
          tier={trustData?.tier || "HIGH"}
        />
        <PremiumCard
          premium={dashboardData.dynamic_premium}
          reasoning={dashboardData.premium_reasoning}
        />
        <PredictionCard predicted_earnings={dashboardData.predicted_earnings} />
      </div>

      <div className="pt-6">
        <HistoryTable items={historyItems} />
      </div>
    </div>
  );
}
