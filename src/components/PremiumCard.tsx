"use client";

import React from "react";
import { CreditCard, Info } from "lucide-react";

interface PremiumCardProps {
  premium: number;
  reasoning: string;
}

export default function PremiumCard({ premium, reasoning }: PremiumCardProps) {
  const workerPays = 35;
  const platformPays = Math.round(premium - workerPays);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-blue-400" />
            Weekly Protection Plan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">AI-driven dynamic pricing (₹40–₹65)</p>
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Active</span>
        </div>
      </div>

      <div className="p-6">
        {/* Total Premium */}
        <div className="mb-6">
          <p className="text-[10px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">Current Premium</p>
          <div className="flex items-baseline gap-1.5">
            <p className="font-mono text-3xl font-bold text-slate-100 leading-none">₹{Math.round(premium)}</p>
            <p className="text-xs text-slate-500 font-medium">/ week</p>
          </div>
        </div>

        {/* Split */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              <p className="text-sm font-medium text-slate-200">You Pay</p>
            </div>
            <p className="font-mono text-lg font-bold text-white">₹{workerPays}</p>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-transparent">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-slate-500" />
              <p className="text-sm font-medium text-slate-400">Platform Pays</p>
            </div>
            <p className="font-mono text-base font-medium text-slate-300">₹{platformPays > 0 ? platformPays : 15}</p>
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
          <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">AI Premium Reasoning</p>
            <p className="text-xs text-blue-200/80 leading-relaxed">{reasoning}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
