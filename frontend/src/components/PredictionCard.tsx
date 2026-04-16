"use client";

import React from "react";
import { Brain, TrendingUp, Calendar } from "lucide-react";

export default function PredictionCard({ predicted_earnings }: { predicted_earnings: number }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
        <Brain className="w-24 h-24 text-blue-500" />
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <TrendingUp className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-100">Intelligent Forecast</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-400">Next Week Predicted Earnings</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-white">₹{predicted_earnings.toLocaleString()}</span>
            <span className="text-xs font-medium text-green-400 px-2 py-0.5 bg-green-400/10 rounded-full">+4% vs last week</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">Stable income guaranteed by VayuGuard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
