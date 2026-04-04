"use client";

import React from "react";
import { ShieldCheck, TrendingUp, TrendingDown, Zap } from "lucide-react";

interface EarningsFloorCardProps {
  predicted: number;
  floor: number;
  current: number;
  gap: number;
  disruption_active: boolean;
  disruption_type: string;
}

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function EarningsFloorCard({
  predicted,
  floor,
  current,
  gap,
  disruption_active,
  disruption_type,
}: EarningsFloorCardProps) {
  const floorPct = Math.min((floor / predicted) * 100, 100);
  const currentPct = Math.min((current / predicted) * 100, 100);
  const belowFloor = current < floor;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            Dynamic Earnings Floor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Income stabilization — guaranteed minimum</p>
        </div>
        {disruption_active && (
          <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider">
              {disruption_type.replace("_", " ")} active
            </span>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-slate-800/60">
        <MetricCell
          label="Predicted Earnings"
          value={formatINR(predicted)}
          icon={<TrendingUp className="h-4 w-4 text-blue-400" />}
          color="blue"
        />
        <MetricCell
          label="Guaranteed Floor"
          value={formatINR(floor)}
          icon={<ShieldCheck className="h-4 w-4 text-emerald-400" />}
          color="emerald"
        />
        <MetricCell
          label="Current Earnings"
          value={formatINR(current)}
          icon={<TrendingDown className="h-4 w-4 text-amber-400" />}
          color={belowFloor ? "rose" : "slate"}
          highlight={belowFloor}
        />
        <MetricCell
          label="Gap Covered"
          value={gap > 0 ? formatINR(gap) : "—"}
          icon={<Zap className="h-4 w-4 text-cyan-400" />}
          color="cyan"
          highlight={gap > 0}
        />
      </div>

      {/* Visual Bar */}
      <div className="px-6 py-4 border-t border-slate-800/60">
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2">
          <span>₹0</span>
          <span>Predicted: {formatINR(predicted)}</span>
        </div>
        <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
          {/* Predicted = full bar */}
          <div className="absolute inset-0 bg-blue-500/10 rounded-full" />
          {/* Current earnings */}
          <div
            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${
              belowFloor ? "bg-gradient-to-r from-rose-500 to-amber-500" : "bg-gradient-to-r from-emerald-500 to-cyan-500"
            }`}
            style={{ width: `${currentPct}%` }}
          />
          {/* Floor marker */}
          <div
            className="absolute top-0 h-full w-0.5 bg-emerald-400"
            style={{ left: `${floorPct}%` }}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-slate-400">Floor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${belowFloor ? "bg-rose-500" : "bg-cyan-500"}`} />
            <span className="text-[10px] text-slate-400">Current</span>
          </div>
          {gap > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] text-cyan-400 font-medium">Income Stabilization Payment: {formatINR(gap)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCell({
  label,
  value,
  icon,
  color,
  highlight = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div className={`p-5 ${highlight ? "bg-slate-800/30" : ""}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className={`font-mono text-2xl font-bold tracking-tight ${
        color === "rose" ? "text-rose-400" :
        color === "cyan" ? "text-cyan-400" :
        color === "emerald" ? "text-emerald-400" :
        color === "blue" ? "text-blue-400" :
        color === "amber" ? "text-amber-400" :
        "text-slate-200"
      }`}>
        {value}
      </p>
    </div>
  );
}
