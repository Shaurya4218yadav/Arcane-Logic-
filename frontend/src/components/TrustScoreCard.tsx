"use client";

import React from "react";
import { Lock } from "lucide-react";
import type { TrustSignals } from "@/lib/types";
import { TRUST_SIGNAL_LABELS } from "@/lib/constants";

interface TrustScoreCardProps {
  overall: number;
  signals: TrustSignals;
  tier: string;
}

function getTierStyle(tier: string) {
  switch (tier) {
    case "HIGH":
      return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "High Trust", dot: "bg-emerald-500" };
    case "MEDIUM":
      return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Medium Trust", dot: "bg-amber-500" };
    default:
      return { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", label: "Low Trust", dot: "bg-rose-500" };
  }
}

function getBarColor(val: number) {
  if (val >= 80) return "bg-emerald-500";
  if (val >= 60) return "bg-amber-500";
  return "bg-rose-500";
}

export default function TrustScoreCard({ overall, signals, tier }: TrustScoreCardProps) {
  const style = getTierStyle(tier);

  const signalEntries = Object.entries(signals) as [keyof TrustSignals, number][];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Lock className="h-4 w-4 text-indigo-400" />
            Trust Score (Fraud Risk Engine)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">6-layer cross-signal validation</p>
        </div>
        <div className={`px-2.5 py-1 rounded-lg ${style.bg} border ${style.border}`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${style.text}`}>
            {style.label}
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Overall Score */}
        <div className="flex items-end gap-3 mb-8">
          <p className={`font-mono text-5xl font-bold leading-none ${style.text}`}>
            {Math.round(overall)}
          </p>
          <p className="text-sm text-slate-500 pb-1 font-medium">/ 100</p>
        </div>

        {/* Signal Breakdown */}
        <div className="space-y-3.5">
          {signalEntries.map(([key, val]) => (
            <div key={key} className="flex items-center gap-4">
              <div className="w-40 shrink-0">
                <p className="text-xs font-medium text-slate-400">
                  {TRUST_SIGNAL_LABELS[key] || key}
                </p>
              </div>
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getBarColor(val)}`}
                  style={{ width: `${val}%` }}
                />
              </div>
              <span className={`font-mono text-xs w-8 text-right shrink-0 font-semibold ${
                val < 50 ? "text-rose-400" : val < 70 ? "text-amber-400" : "text-slate-300"
              }`}>
                {Math.round(val)}
              </span>
            </div>
          ))}
        </div>

        {/* Tier explanation */}
        <div className="mt-6 pt-4 border-t border-slate-800/60">
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {tier === "HIGH" && "✓ Instant Income Stabilization Payment — no verification required"}
            {tier === "MEDIUM" && "⚠ Partial payout — video verification required before full release"}
            {tier === "LOW" && "✕ Claim flagged — manual review required before any payout"}
          </p>
        </div>
      </div>
    </div>
  );
}
