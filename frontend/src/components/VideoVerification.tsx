"use client";

import React, { useState } from "react";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";

interface VideoVerificationProps {
  score: number;
  onVerified: () => void;
  onDismiss: () => void;
}

const VERIFY_STEPS = [
  { key: "uploading", label: "Uploading securely...", ms: 1400 },
  { key: "validating", label: "Validating metadata...", ms: 1200 },
  { key: "liveness", label: "Running liveness checks...", ms: 1300 },
  { key: "verified", label: "Verification successful", ms: 1000 },
  { key: "released", label: "Income Stabilization Payment released", ms: 0 },
];

export default function VideoVerification({ score, onVerified, onDismiss }: VideoVerificationProps) {
  const [state, setState] = useState<string>("idle");

  function start() {
    let i = 0;
    const next = () => {
      setState(VERIFY_STEPS[i].key);
      if (VERIFY_STEPS[i].ms > 0 && i < VERIFY_STEPS.length - 1) {
        i++;
        setTimeout(next, VERIFY_STEPS[i].ms);
      }
    };
    next();
  }

  const processing = ["uploading", "validating", "liveness"].includes(state);
  const stepI = ["uploading", "validating", "liveness"].indexOf(state);
  const stepLabel = VERIFY_STEPS.find((s) => s.key === state)?.label ?? "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/60 flex justify-between items-start">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Verification Required</h3>
            <p className="text-xs text-slate-400 mt-1.5">Upload a short video to confirm presence</p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500/80">Score</span>
            <span className="font-mono text-sm font-bold text-amber-400">{score}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Upload Area */}
          <div
            className={`rounded-xl border border-dashed p-8 text-center transition-all duration-300 ${
              state === "released"
                ? "border-emerald-500/40 bg-emerald-500/5"
                : state === "verified"
                ? "border-emerald-500/20 bg-emerald-500/5"
                : processing
                ? "border-blue-500/30 bg-blue-500/5"
                : "border-slate-700 bg-slate-800/30"
            }`}
          >
            {state === "idle" && (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-200">5-second video proof</p>
                <p className="text-xs text-slate-500 max-w-[220px] mx-auto">
                  Record a short video showing your current surroundings.
                </p>
                <p className="text-[10px] text-slate-600 font-mono mt-4 pt-4 border-t border-slate-800">
                  MP4 / MOV · Max 30 MB
                </p>
              </div>
            )}

            {processing && (
              <div className="flex flex-col items-center justify-center py-6 gap-5">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-200">{stepLabel}</p>
                  <div className="flex gap-1.5 justify-center mt-2">
                    {["uploading", "validating", "liveness"].map((k, i) => (
                      <div
                        key={k}
                        className={`h-1 rounded-full transition-all duration-500 ${
                          stepI >= i ? "bg-blue-500 w-6" : "bg-slate-700 w-3"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {state === "verified" && (
              <div className="space-y-2 py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-emerald-400">Verification successful</p>
                <p className="text-xs text-slate-400">Processing Auto Adjustment criteria...</p>
              </div>
            )}

            {state === "released" && (
              <div className="space-y-3 py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <p className="font-mono text-lg font-bold text-emerald-500">₹</p>
                </div>
                <p className="text-sm font-semibold text-emerald-400">
                  Verification successful → Income Stabilization Payment released
                </p>
                <p className="text-xs text-emerald-500/70">Amount credited via UPI</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {state === "idle" && (
              <button
                onClick={start}
                className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                Upload 5-sec Video
              </button>
            )}
            {(processing || state === "verified") && (
              <div className="flex-1 rounded-xl bg-slate-800 border border-slate-700 py-3 flex items-center justify-center gap-2 text-sm font-semibold text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" /> Processing
              </div>
            )}
            {state === "released" && (
              <button
                onClick={onVerified}
                className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
              >
                View Result
              </button>
            )}
            <button
              onClick={onDismiss}
              disabled={processing}
              className={`px-6 py-3 rounded-xl border text-sm font-semibold transition-colors ${
                processing
                  ? "border-transparent bg-transparent text-slate-600 cursor-not-allowed"
                  : "border-slate-700 bg-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
