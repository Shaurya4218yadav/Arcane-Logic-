"use client";

import React, { useState, useEffect } from "react";
import AdminMetricsComponent from "@/components/AdminMetrics";
import HistoryTable from "@/components/HistoryTable";
import { getAdminMetrics, getAuditTrail } from "@/lib/api";
import { Loader2, Users, ShieldCheck, Activity } from "lucide-react";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [audit, setAudit] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, a] = await Promise.all([
          getAdminMetrics(),
          getAuditTrail(10)
        ]);
        setMetrics(m);
        // Map audit to HistoryItem format
        setAudit(a.map((item: any) => ({
          date: new Date(item.created_at).toLocaleDateString(),
          event: item.decision === "APPROVED" ? "Automatic Payout" : "Flagged Investigation",
          zone: "Chennai",
          score: item.trust_score,
          payout: item.decision === "APPROVED" ? "₹450" : "Blocked",
          status: item.decision === "APPROVED" ? "paid" : "flagged",
          audit_reason: item.reason
        })));
      } catch (error) {
        console.error("Admin data load failed", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Insurer Command Center</h1>
          <p className="text-slate-400 mt-1">Global oversight of claim integrity and portfolio performance.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span className="text-xs font-medium text-green-400">System Healthy</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-400">AI Monitor Active</span>
          </div>
        </div>
      </div>

      <AdminMetricsComponent metrics={metrics} />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-100">Live Audit Stream</h2>
          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All Logs</button>
        </div>
        <HistoryTable items={audit} />
      </div>
    </div>
  );
}
