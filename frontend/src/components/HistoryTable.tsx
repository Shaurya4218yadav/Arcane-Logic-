"use client";

import React, { useState } from "react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import type { HistoryItem } from "@/lib/types";

interface HistoryTableProps {
  items: HistoryItem[];
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    paid: { label: "Paid", cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    review: { label: "Review", cls: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    flagged: { label: "Flagged", cls: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  };
  const s = map[status] || map.paid;
  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase border ${s.cls}`}>
      {s.label}
    </span>
  );
}

function TrustBadge({ score }: { score: number }) {
  const color = score >= 85 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    : score >= 50 ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
    : "text-rose-400 bg-rose-500/10 border-rose-500/20";
  const label = score >= 85 ? "High" : score >= 50 ? "Medium" : "Low";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold border uppercase tracking-wider ${color}`}>
      {label} · {score}
    </span>
  );
}

function HistoryRow({ item }: { item: HistoryItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-slate-800/60 last:border-0">
      <div
        className="flex items-center gap-4 px-6 py-4 hover:bg-slate-800/20 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">{item.event}</p>
          <p className="text-xs text-slate-500 mt-0.5">{item.date} · {item.zone}</p>
        </div>
        <TrustBadge score={item.score} />
        <span className="font-mono text-sm font-semibold text-slate-300 w-16 text-right shrink-0">
          {item.payout}
        </span>
        <div className="w-20 text-right">
          <StatusPill status={item.status} />
        </div>
        <div className="w-5 shrink-0 text-slate-500">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>

      {/* Audit Trail (expandable) */}
      {expanded && (
        <div className="px-6 pb-4">
          <div className="ml-0 p-4 rounded-xl bg-slate-800/30 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Compliance & Audit Trail
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">{item.audit_reason}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HistoryTable({ items }: HistoryTableProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            Recent Disruptions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Click any row to view audit trail</p>
        </div>
        {items.length > 0 && items[0].status === "paid" && (
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Last payout</p>
            <p className="text-sm font-bold text-emerald-400 font-mono">{items[0].payout}</p>
          </div>
        )}
      </div>

      {/* Rows */}
      <div>
        {items.map((item, i) => (
          <HistoryRow key={`${item.date}-${item.event}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}
