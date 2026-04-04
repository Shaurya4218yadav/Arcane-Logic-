"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface UpiPayoutBannerProps {
  amount: number;
  auditReason: string;
}

export default function UpiPayoutBanner({ amount, auditReason }: UpiPayoutBannerProps) {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 overflow-hidden animate-in fade-in duration-500">
      {/* UPI Success */}
      <div className="p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-7 w-7 text-emerald-500" />
        </div>
        <p className="font-mono text-2xl font-bold text-emerald-400 mb-1">
          ₹{amount} credited to your account
        </p>
        <p className="text-sm text-emerald-500/70">Income Stabilization Payment via UPI</p>
      </div>

      {/* Audit Trail */}
      <div className="px-6 py-4 border-t border-emerald-500/10 bg-emerald-500/[0.02]">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Compliance & Audit Trail
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">{auditReason}</p>
      </div>
    </div>
  );
}
