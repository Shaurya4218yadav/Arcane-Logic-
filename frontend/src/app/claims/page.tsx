"use client";

import React, { useState, useEffect } from "react";
import { getMyClaims, createManualClaim, isLoggedIn } from "@/lib/api";
import { CHENNAI_ZONES } from "@/lib/constants";
import { Loader2, FileCheck2, AlertTriangle, CheckCircle2, Clock, ShieldAlert, MapPin, Zap } from "lucide-react";

interface ClaimItem {
  id: number;
  status: string;
  risk_score: number;
  payout: number;
}

export default function ClaimsPage() {
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [manualZone, setManualZone] = useState("Adyar");
  const [filing, setFiling] = useState(false);
  const [filedResult, setFiledResult] = useState<string | null>(null);

  const ZONE_COORDS: Record<string, [number, number]> = {
    "Adyar": [13.0067, 80.2206],
    "Velachery": [12.9758, 80.2205],
    "T. Nagar": [13.0418, 80.2341],
    "Anna Nagar": [13.0860, 80.2101],
    "Tambaram": [12.9249, 80.1000],
    "Perungudi": [12.9611, 80.2470],
    "Sholinganallur": [12.9010, 80.2279],
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      setNotLoggedIn(true);
      setLoading(false);
      return;
    }
    loadClaims();
  }, []);

  async function loadClaims() {
    try {
      const data = await getMyClaims();
      setClaims(data);
    } catch {
      // No claims — fallback demo data
      setClaims([
        { id: 1, status: "APPROVED", risk_score: 12, payout: 420 },
        { id: 2, status: "VERIFY", risk_score: 45, payout: 0 },
        { id: 3, status: "APPROVED", risk_score: 18, payout: 350 },
        { id: 4, status: "REJECT", risk_score: 72, payout: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleManualClaim() {
    setFiling(true);
    setFiledResult(null);
    try {
      const coords = ZONE_COORDS[manualZone] || ZONE_COORDS["Adyar"];
      const result = await createManualClaim(coords[0], coords[1], "WEATHER");
      setClaims(prev => [{ id: result.id, status: result.status, risk_score: result.risk_score, payout: result.payout }, ...prev]);
      setFiledResult(`Auto Adjustment #${result.id}: ${result.status} — ${result.audit_reason || ""}`);
    } catch (err: unknown) {
      setFiledResult(`Error: ${err instanceof Error ? err.message : "Failed to file claim"}`);
    } finally {
      setFiling(false);
    }
  }

  const totalPaid = claims.filter(c => c.status === "APPROVED").reduce((sum, c) => sum + c.payout, 0);
  const approvedCount = claims.filter(c => c.status === "APPROVED").length;
  const avgRisk = claims.length > 0 ? Math.round(claims.reduce((sum, c) => sum + c.risk_score, 0) / claims.length) : 0;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "APPROVED": return { icon: <CheckCircle2 className="h-4 w-4" />, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" };
      case "VERIFY": return { icon: <Clock className="h-4 w-4" />, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" };
      case "REJECT": return { icon: <ShieldAlert className="h-4 w-4" />, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" };
      case "PENDING": return { icon: <Clock className="h-4 w-4" />, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" };
      default: return { icon: <Clock className="h-4 w-4" />, color: "text-slate-400", bg: "bg-slate-800 border-slate-700" };
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (notLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <AlertTriangle className="h-10 w-10 text-amber-400" />
        <p className="text-slate-400 text-sm">Please register first to view claims.</p>
        <a href="/register" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm">
          Register Now
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Claims Management</h1>
        <p className="text-sm text-slate-400 mt-1">Track all your Auto Adjustments and Income Stabilization Payments.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider mb-1">Total Income Stabilized</p>
          <p className="text-2xl font-bold font-mono text-emerald-400">₹{totalPaid.toLocaleString("en-IN")}</p>
        </div>
        <div className="p-5 rounded-2xl border border-blue-500/20 bg-blue-500/5">
          <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-1">Approved Auto Adjustments</p>
          <p className="text-2xl font-bold font-mono text-blue-400">{approvedCount}</p>
        </div>
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-800/30">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Avg Risk Score</p>
          <p className="text-2xl font-bold font-mono text-slate-300">{avgRisk}</p>
        </div>
      </div>

      {/* Manual Claim Trigger */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-lg p-6">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-cyan-400" />
          Manual Claim Trigger
        </h2>
        <p className="text-xs text-slate-500 mb-4">File a manual Auto Adjustment request for your current location. The Trust Engine will validate automatically.</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1">
            <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
            <select
              value={manualZone}
              onChange={(e) => setManualZone(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
            >
              {CHENNAI_ZONES.map(z => (
                <option key={z} value={z}>{z}, Chennai</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleManualClaim}
            disabled={filing}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {filing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck2 className="h-4 w-4" />}
            File Auto Adjustment
          </button>
        </div>

        {filedResult && (
          <div className={`mt-4 p-4 rounded-xl border text-xs ${
            filedResult.startsWith("Error") 
              ? "border-rose-500/20 bg-rose-500/5 text-rose-400" 
              : "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
          }`}>
            {filedResult}
          </div>
        )}
      </div>

      {/* Claims Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/60">
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-slate-400" />
            All Auto Adjustments
          </h2>
        </div>

        {claims.length === 0 ? (
          <div className="p-12 text-center">
            <FileCheck2 className="h-10 w-10 text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No claims yet. They will appear here when disruptions are detected.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {claims.map((claim, idx) => {
              const cfg = getStatusConfig(claim.status);
              return (
                <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-9 w-9 rounded-lg ${cfg.bg} border flex items-center justify-center ${cfg.color}`}>
                      {cfg.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">Auto Adjustment #{claim.id}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Risk Score: <span className="font-mono">{claim.risk_score}</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${cfg.bg} border ${cfg.color} text-[10px] font-bold uppercase tracking-wider mb-1`}>
                      {cfg.icon}
                      {claim.status}
                    </div>
                    <p className="font-mono text-sm font-bold text-slate-200">
                      {claim.payout > 0 ? `₹${claim.payout.toLocaleString("en-IN")}` : "—"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
