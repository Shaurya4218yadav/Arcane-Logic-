"use client";

import React, { useState, useEffect } from "react";
import { getMyPolicy, createPolicy, getPreviewPremium, isLoggedIn } from "@/lib/api";
import { CHENNAI_ZONES } from "@/lib/constants";
import { ShieldCheck, CreditCard, Info, Loader2, MapPin, CheckCircle2, AlertTriangle } from "lucide-react";

interface PolicyData {
  id: number;
  premium: number;
  coverage: number;
  status: string;
  premium_reasoning: string;
}

export default function PolicyPage() {
  const [policy, setPolicy] = useState<PolicyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [error, setError] = useState("");

  // Premium calculator state
  const [selectedZone, setSelectedZone] = useState("Adyar");
  const [calcPremium, setCalcPremium] = useState<number | null>(null);
  const [calcReasoning, setCalcReasoning] = useState("");
  const [calcLoading, setCalcLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      setNotLoggedIn(true);
      setLoading(false);
      return;
    }
    loadPolicy();
  }, []);

  async function loadPolicy() {
    try {
      const p = await getMyPolicy();
      setPolicy(p);
    } catch {
      // No policy yet — that's fine
    } finally {
      setLoading(false);
    }
  }

  async function handleActivate() {
    setCreating(true);
    setError("");
    try {
      const p = await createPolicy(calcPremium || 50, 1000);
      setPolicy(p);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create policy");
    } finally {
      setCreating(false);
    }
  }

  async function handleZoneCalc(zone: string) {
    setSelectedZone(zone);
    setCalcLoading(true);
    try {
      const preview = await getPreviewPremium(zone);
      setCalcPremium(preview.dynamic_premium);
      setCalcReasoning(preview.premium_reasoning);
    } catch {
      const basePremiums: Record<string, number> = {
        "Adyar": 52, "Velachery": 58, "T. Nagar": 45, "Anna Nagar": 47,
        "Tambaram": 48, "Perungudi": 55, "Sholinganallur": 53,
      };
      setCalcPremium(basePremiums[zone] || 50);
      setCalcReasoning(`${zone}: zone-based risk assessment`);
    } finally {
      setCalcLoading(false);
    }
  }

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
        <p className="text-slate-400 text-sm">Please register first to manage your protection plan.</p>
        <a href="/register" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm">
          Register Now
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">My Protection Plan</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your Weekly Protection Plan and explore zone-based premium pricing.</p>
      </div>

      {/* Active Policy Card */}
      {policy ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-emerald-500/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-emerald-300">Protection Plan Active</h2>
                <p className="text-[10px] text-emerald-500/70 font-mono">Policy #{policy.id}</p>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{policy.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-emerald-500/10">
            <div className="p-6">
              <p className="text-[10px] font-semibold text-emerald-500/70 uppercase tracking-wider mb-1">Weekly Premium</p>
              <p className="font-mono text-2xl font-bold text-emerald-300">₹{Math.round(policy.premium)}</p>
              <p className="text-[10px] text-slate-500 mt-1">You pay ₹35 · Platform pays ₹{Math.round(policy.premium) - 35 > 0 ? Math.round(policy.premium) - 35 : 15}</p>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-semibold text-emerald-500/70 uppercase tracking-wider mb-1">Coverage Limit</p>
              <p className="font-mono text-2xl font-bold text-emerald-300">₹{policy.coverage.toLocaleString("en-IN")}</p>
              <p className="text-[10px] text-slate-500 mt-1">Max payout per disruption event</p>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-semibold text-emerald-500/70 uppercase tracking-wider mb-1">Claim Model</p>
              <p className="font-mono text-lg font-bold text-emerald-300">Zero-Touch</p>
              <p className="text-[10px] text-slate-500 mt-1">Automatic payouts via UPI</p>
            </div>
          </div>

          {policy.premium_reasoning && (
            <div className="px-6 py-4 border-t border-emerald-500/10 flex items-start gap-3">
              <Info className="w-4 h-4 text-emerald-500/50 mt-0.5 shrink-0" />
              <p className="text-xs text-emerald-400/70">{policy.premium_reasoning}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center space-y-4">
          <ShieldCheck className="h-12 w-12 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400">No active protection plan found.</p>
          <p className="text-xs text-slate-500">Use the calculator below to explore premium options, then activate.</p>
        </div>
      )}

      {/* Dynamic Premium Calculator */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/60">
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-blue-400" />
            AI Dynamic Premium Calculator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Select a zone to see how the AI adjusts your premium based on hyper-local risk factors</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Zone Grid */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="h-3 w-3" /> Select Zone
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CHENNAI_ZONES.map((z) => (
                <button
                  key={z}
                  onClick={() => handleZoneCalc(z)}
                  className={`p-3 rounded-xl border text-left transition-all text-sm ${
                    selectedZone === z
                      ? "border-blue-500/50 bg-blue-500/10 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                      : "border-slate-800 bg-slate-800/20 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>

          {/* Result */}
          {calcLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : calcPremium ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-500/5">
                <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-2">Calculated Premium</p>
                <p className="font-mono text-3xl font-bold text-white">₹{Math.round(calcPremium)}</p>
                <p className="text-xs text-slate-500 mt-1">per week</p>
              </div>
              <div className="p-5 rounded-xl border border-slate-800">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Worker Pays</p>
                <p className="font-mono text-2xl font-bold text-blue-400">₹35</p>
                <p className="text-xs text-slate-500 mt-1">fixed contribution</p>
              </div>
              <div className="p-5 rounded-xl border border-slate-800">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Platform Subsidy</p>
                <p className="font-mono text-2xl font-bold text-slate-300">₹{Math.round(calcPremium) - 35 > 0 ? Math.round(calcPremium) - 35 : 15}</p>
                <p className="text-xs text-slate-500 mt-1">co-funded model</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-4">Select a zone to preview AI-calculated premium</p>
          )}

          {calcReasoning && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">AI Reasoning</p>
                <p className="text-xs text-blue-200/80 leading-relaxed">{calcReasoning}</p>
              </div>
            </div>
          )}

          {!policy && calcPremium && (
            <button
              onClick={handleActivate}
              disabled={creating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Activate Protection Plan — ₹{Math.round(calcPremium)}/week
            </button>
          )}

          {error && <p className="text-xs text-rose-400 font-medium text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}
