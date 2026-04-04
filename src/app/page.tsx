"use client";

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Zap, 
  CreditCard,
  Lock
} from 'lucide-react';

export default function VayuGuardDashboard() {
  const [simulationActive, setSimulationActive] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);

  const triggerSimulation = () => {
    setSimulationActive(true);
    setSimulationStep(1); // Analyzing Disruption
    
    setTimeout(() => {
      setSimulationStep(2); // Earnings dropped
    }, 2000);
    
    setTimeout(() => {
      setSimulationStep(3); // Gap covered
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-cyan-500/30">
      {/* Navbar Minimal */}
      <nav className="border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              VayuGuard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-400">Active Protection</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        
        {/* Hero Section */}
        <header className="space-y-6 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Income Stabilization</span> Engine for Gig Workers
          </h1>
          <p className="text-xl text-slate-400 font-medium">
            Not just insurance. We guarantee minimum earnings during disruptions.
          </p>
        </header>

        {/* Dashboard Metrics */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Activity className="h-6 w-6 text-cyan-400" />
              Live Dashboard
            </h2>
            <p className="text-sm text-slate-400">Your income is stabilized against disruptions in real-time</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Guaranteed Income Floor" 
              value="₹1,200" 
              trend="+₹50 target met"
              icon={<ShieldCheck className="h-5 w-5 text-emerald-400" />}
              color="emerald"
            />
            <MetricCard 
              title="Predicted Earnings" 
              value="₹1,450" 
              trend="Expected this week"
              icon={<TrendingUp className="h-5 w-5 text-blue-400" />}
              color="blue"
            />
            <MetricCard 
              title="Current Earnings" 
              value="₹840" 
              trend="Impacted by severe rain"
              icon={<TrendingDown className="h-5 w-5 text-amber-400" />}
              color="amber"
            />
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <MetricCard 
                title="Gap Covered" 
                value="₹360" 
                trend="Income Stabilization Payment"
                icon={<Zap className="h-5 w-5 text-cyan-400" />}
                color="cyan"
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Simulation & Auto Adjustment */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-rose-400" />
                Disruption Simulator
              </h2>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
              {/* background element */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 space-y-8">
                {!simulationActive ? (
                  <div className="text-center space-y-6 py-8">
                    <p className="text-slate-400">Trigger a disruption to see the Auto Adjustment engine in action.</p>
                    <button 
                      onClick={triggerSimulation}
                      className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-colors shadow-lg shadow-white/10"
                    >
                      Simulate Weather Disruption
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 py-2">
                    <ProcessStep 
                      active={simulationStep >= 1} 
                      title="Analyzing Disruption Impact" 
                      desc="Real-time localized severe rain detected."
                    />
                    <div className="h-8 border-l border-slate-700 ml-5 -my-4"></div>
                    <ProcessStep 
                      active={simulationStep >= 2} 
                      title="Earnings dropped below guaranteed floor" 
                      desc="Worker was unable to complete standard shift."
                    />
                    <div className="h-8 border-l border-slate-700 ml-5 -my-4"></div>
                    <ProcessStep 
                      active={simulationStep >= 3} 
                      title="Gap calculated and covered" 
                      desc="Income Stabilization Payment Triggered instantly."
                      success
                    />
                    
                    {simulationStep === 3 && (
                      <button 
                        onClick={() => {setSimulationActive(false); setSimulationStep(0);}}
                        className="mt-6 text-sm text-cyan-400 hover:text-cyan-300 font-medium pl-14"
                      >
                        Reset System
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="space-y-8">
            {/* Trust Engine & Diff */}
            <section className="bg-gradient-to-br from-slate-900 to-slate-800/50 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Lock className="h-5 w-5 text-indigo-400" />
                How VayuGuard Is Different
              </h3>
              <ul className="space-y-4">
                <ListItem text="Predicts expected weekly earnings" />
                <ListItem text="Guarantees a minimum income floor" />
                <ListItem text="Automatically bridges income gaps during disruptions" />
                <ListItem text="Uses multi-layer trust validation to prevent abuse" highlight />
              </ul>
              
              <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300">Trust Engine</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-[250px]">Ensures fair payouts using behavioral, device, network, and peer validation</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-indigo-400" />
                  </div>
                </div>
              </div>
            </section>

            {/* Premium Section */}
            <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-slate-400" />
                  Weekly Protection Plan
                </h3>
                <p className="text-sm text-slate-500 mt-1">Co-funded protection model for worker stability</p>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-xl">₹35<span className="text-sm text-slate-500 font-normal"> / you pay</span></div>
                <div className="text-sm text-emerald-400 font-medium">+ ₹15 platform pays</div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, value, trend, icon, color }: any) {
  const colorMap: any = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
  };
  
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between h-full hover:border-slate-700 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl ${colorMap[color]}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-slate-300">{title}</span>
      </div>
      <div>
        <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>
        <div className="text-xs text-slate-500">{trend}</div>
      </div>
    </div>
  );
}

function ProcessStep({ active, title, desc, success = false }: any) {
  return (
    <div className={`flex items-start gap-4 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-30'}`}>
      <div className={`mt-1 flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ring-4 ring-slate-950 ${success ? 'bg-emerald-500 text-slate-900' : (active ? 'bg-cyan-500 text-slate-900' : 'bg-slate-800 text-slate-500')}`}>
        {success ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-current"></div>}
      </div>
      <div>
        <h4 className={`text-base font-semibold ${success ? 'text-emerald-400' : 'text-slate-200'}`}>{title}</h4>
        <p className="text-sm text-slate-500 mt-1">{desc}</p>
      </div>
    </div>
  );
}

function ListItem({ text, highlight }: any) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 className={`h-5 w-5 mt-0.5 flex-shrink-0 ${highlight ? 'text-indigo-400' : 'text-slate-600'}`} />
      <span className={highlight ? 'text-slate-200 font-medium' : 'text-slate-400'}>{text}</span>
    </li>
  );
}
