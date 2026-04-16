"use client";

import React, { useState } from "react";
import DisruptionSimulator from "@/components/DisruptionSimulator";
import VideoVerification from "@/components/VideoVerification";
import UpiPayoutBanner from "@/components/UpiPayoutBanner";
import EarningsFloorCard from "@/components/EarningsFloorCard";
import { runSimulation } from "@/lib/api";
import type { SimulationResult, PipelineStep } from "@/lib/types";
import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react";
import { PIPELINE_STEPS } from "@/lib/constants";

export default function DisruptionImpactPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [activeSteps, setActiveSteps] = useState<PipelineStep[]>([]);
  const [showVideo, setShowVideo] = useState(false);
  const [videoVerified, setVideoVerified] = useState(false);

  const handleRunSimulation = async (scenario: string, zone: string, lat: number, lon: number) => {
    setIsSimulating(true);
    setSimulationResult(null);
    setActiveSteps([]);
    setShowVideo(false);
    setVideoVerified(false);

    try {
      const result = await runSimulation(scenario, zone, lat, lon);
      
      // Animate steps coming in one by one
      for (let i = 0; i < result.steps.length; i++) {
        await new Promise((r) => setTimeout(r, 1200)); // Delay between steps
        setActiveSteps((prev) => [...prev, result.steps[i]]);
      }

      setSimulationResult(result);
      setIsSimulating(false);

      if (result.payout_eligible && result.payout > 0) {
        // Trigger simulated instant payout
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/payouts/trigger`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ worker_id: 101, amount: result.payout })
          });
        } catch (e) {
          console.error("Payout trigger failed", e);
        }
      }

      if (result.requires_verification) {
        setTimeout(() => setShowVideo(true), 1500);
      }
    } catch (err) {
      console.error("Simulation failed", err);
      setIsSimulating(false);
    }
  };

  const isComplete = simulationResult !== null && !isSimulating;
  const showBanner = isComplete && simulationResult.payout_eligible && (!simulationResult.requires_verification || videoVerified);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Simulator Trigger & Results */}
      <div className="lg:col-span-5 space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Disruption Impact</h1>
          <p className="text-sm text-slate-400 mt-1">Simulate Chennai-specific scenarios and observe the Zero-Touch Auto Adjustment pipeline.</p>
        </div>

        <DisruptionSimulator
          onSimulationComplete={() => {}}
          isSimulating={isSimulating}
          setIsSimulating={setIsSimulating}
          runApiSimulation={handleRunSimulation}
        />

        {showBanner && simulationResult && (
          <div className="pt-4">
            <UpiPayoutBanner
              amount={simulationResult.payout}
              auditReason={simulationResult.audit_reason}
            />
          </div>
        )}

        {isComplete && !simulationResult.payout_eligible && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-6 animate-in fade-in duration-500">
            <p className="font-semibold text-rose-400 mb-2">Auto Adjustment Denied</p>
            <p className="text-sm text-slate-400 mb-4">{simulationResult.audit_reason}</p>
          </div>
        )}
      </div>

      {/* Right Column: Pipeline Viewer */}
      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-lg p-6 min-h-[500px]">
          <h3 className="text-sm font-semibold text-slate-200 mb-6 border-b border-slate-800/60 pb-4">
            Zero-Touch Pipeline Execution
          </h3>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
            {PIPELINE_STEPS.map((baseStep, idx) => {
              const activeStep = activeSteps.find(s => s.engine === baseStep.engine);
              const isActive = activeStep !== undefined;
              const isCurrent = isSimulating && activeSteps.length === idx;
              
              return (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-slate-800 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10 transition-colors duration-500">
                    {isActive ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    ) : (
                      <CircleDashed className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  
                  <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border transition-all duration-500 ${
                    isActive ? "border-slate-700 bg-slate-800/40" : 
                    isCurrent ? "border-blue-500/30 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]" : 
                    "border-slate-800/50 bg-slate-900/50 opacity-50"
                  }`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-bold ${isActive ? "text-slate-200" : isCurrent ? "text-blue-400" : "text-slate-500"}`}>
                        {baseStep.engine}
                      </h4>
                      {isActive && activeStep.status && (
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          activeStep.status === "approved" || activeStep.status === "triggered" ? "bg-emerald-500/10 text-emerald-400" :
                          activeStep.status === "verify" || activeStep.status === "medium" ? "bg-amber-500/10 text-amber-400" :
                          activeStep.status === "assessed" || activeStep.status === "gap_detected" ? "bg-blue-500/10 text-blue-400" :
                          "bg-slate-800 text-slate-400"
                        }`}>
                          {activeStep.status}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{isActive && activeStep ? (
                      <span className="font-mono text-slate-300">
                        {JSON.stringify(activeStep.data).substring(0, 100)}...
                      </span>
                    ) : baseStep.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {!isSimulating && activeSteps.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] rounded-2xl z-20">
              <p className="text-sm text-slate-400 font-medium tracking-wide">Waiting for disruption trigger...</p>
            </div>
          )}
        </div>
      </div>

      {showVideo && simulationResult && (
        <VideoVerification
          score={simulationResult.trust_result.overall}
          onVerified={() => {
            setVideoVerified(true);
            setShowVideo(false);
          }}
          onDismiss={() => setShowVideo(false)}
        />
      )}
    </div>
  );
}
