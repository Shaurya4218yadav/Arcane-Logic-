"use client";

import React, { useState, useEffect } from "react";
import HistoryTable from "@/components/HistoryTable";
import { getAuditTrail } from "@/lib/api";
import { HISTORY_DATA } from "@/lib/constants";
import { Loader2, ShieldCheck, Download } from "lucide-react";
import type { HistoryItem } from "@/lib/types";

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>(HISTORY_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const auditLogs = await getAuditTrail();
        if (auditLogs && auditLogs.length > 0) {
          // Map backend AuditLog to frontend HistoryItem
          const mapped = auditLogs.map((log) => ({
            date: new Date(log.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
            event: "Disruption Event (from API)", // We could extract better info if we joined tables
            zone: "Chennai", // Defaulting as audit_log doesn't store zone directly
            score: log.trust_score,
            payout: log.decision === "APPROVED" ? "₹X" : "—", // Simplification for demo
            status: log.decision === "APPROVED" ? "paid" : log.decision === "FLAGGED" ? "flagged" : "review",
            audit_reason: log.reason
          }));
          // Combine API data with demo data
          setItems([...mapped, ...HISTORY_DATA]);
        }
      } catch (err) {
        console.error("Failed to fetch audit trail", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Compliance & Audit Trail</h1>
          <p className="text-sm text-slate-400 mt-1">Full transparent history of all Income Stabilization Auto Adjustments.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-300 transition-colors border border-slate-700">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">Total Protected Flow</p>
          <p className="text-2xl font-bold font-mono text-emerald-400">₹1,050</p>
        </div>
        <div className="p-5 rounded-2xl border border-blue-500/20 bg-blue-500/5">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Auto Adjustments</p>
          <p className="text-2xl font-bold font-mono text-blue-400">3</p>
        </div>
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-800/30">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Avg Trust Score</p>
          <p className="text-2xl font-bold font-mono text-slate-300">83.5</p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <HistoryTable items={items as any} />
      )}
      
      <div className="mt-8 p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200">Regulatory Compliance</p>
          <p className="text-xs text-slate-500 mt-0.5">All Auto Adjustments maintain a secure immutable log of decision criteria and environmental triggers.</p>
        </div>
      </div>
    </div>
  );
}
