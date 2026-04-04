"use client";

import React, { useState } from "react";
import { CloudLightning, Server, ArrowRight, Activity, Cpu, CircleCheck, CheckCircle2 } from "lucide-react";
import { PIPELINE_STEPS, SCENARIOS } from "@/lib/constants";
import type { Scenario, SimulationResult } from "@/lib/types";

interface DisruptionSimulatorProps {
  onSimulationComplete: (result: SimulationResult) => void;
  isSimulating: boolean;
  setIsSimulating: (isSimulating: boolean) => void;
  runApiSimulation: (scenario: string, zone: string, lat: number, lon: number) => Promise<void>;
}

export default function DisruptionSimulator({
  onSimulationComplete,
  isSimulating,
  setIsSimulating,
  runApiSimulation
}: DisruptionSimulatorProps) {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);

  const handleRunSimulation = async (scenario: Scenario) => {
    setActiveScenario(scenario);
    setIsSimulating(true);
    await runApiSimulation(scenario.id, scenario.zone, scenario.lat, scenario.lon);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-1">
          <Activity className="h-4 w-4 text-rose-400" />
          Disruption Simulator
        </h2>
        <p className="text-xs text-slate-500">Select a Chennai scenario to trigger the Zero-Touch Claims pipeline</p>
      </div>

      <div className="space-y-4">
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => handleRunSimulation(scenario)}
            disabled={isSimulating}
            className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all ${
              activeScenario?.id === scenario.id && isSimulating
                ? "border-blue-500/50 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                : "border-slate-800 bg-slate-800/20 hover:border-slate-700 hover:bg-slate-800/40"
            } ${isSimulating ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl shadow-inner border border-slate-700">
                {scenario.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">{scenario.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold text-slate-400 bg-slate-800 border border-slate-700 uppercase">
                    {scenario.zone}
                  </span>
                  <span className="text-xs text-slate-500">{scenario.detail}</span>
                </div>
              </div>
            </div>
            
            {activeScenario?.id === scenario.id && isSimulating ? (
              <div className="flex items-center gap-2 text-blue-400">
                <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                <span className="text-xs font-semibold uppercase tracking-wider">Simulating</span>
              </div>
            ) : (
              <ArrowRight className="h-5 w-5 text-slate-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
