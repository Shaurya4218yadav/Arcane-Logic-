import React, { useState, useEffect, useRef } from "react";

const cx = (...c) => c.filter(Boolean).join(" ");

// ── Data ──────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["Dashboard", "Simulate", "History", "Settings"];

const SIMULATION_STEPS = [
    "Detecting disruption...",
    "Validating signals...",
    "Calculating trust score...",
    "Finalising payout eligibility...",
];

const HISTORY = [
    { date: "Mar 14", event: "Heavy rain – Adyar zone", score: 91, payout: "₹150", status: "paid" },
    { date: "Mar 07", event: "Extreme heat alert – Tambaram", score: 62, payout: "—", status: "review" },
    { date: "Feb 28", event: "Heavy rain – Anna Nagar zone", score: 88, payout: "₹90", status: "paid" },
    { date: "Feb 19", event: "Area shutdown – T. Nagar", score: 45, payout: "—", status: "flagged" },
];

function getTier(score) {
    if (score >= 85) return { label: "High", text: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-500" };
    if (score >= 50) return { label: "Medium", text: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-500" };
    return { label: "Low", text: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-500" };
}

function Spinner({ sz = 4 }) {
    return (
        <svg className={`h-${sz} w-${sz} animate-spin text-slate-500`} viewBox="0 0 24 24" fill="none">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
    );
}

function CountUp({ to, prefix = "₹", ms = 900 }) {
    const [v, setV] = useState(0);
    useEffect(() => {
        const t0 = performance.now();
        const tick = (now) => {
            const p = Math.min((now - t0) / ms, 1);
            setV(Math.round((1 - Math.pow(1 - p, 3)) * to));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [to, ms]);
    return <>{prefix}{v.toLocaleString("en-IN")}</>;
}

function StatusPill({ status }) {
    const map = {
        paid: { label: "Paid", cls: "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" },
        review: { label: "Review", cls: "text-amber-400 bg-amber-400/10 border border-amber-400/20" },
        flagged: { label: "Flagged", cls: "text-red-400 bg-red-400/10 border border-red-400/20" },
    }[status];
    return (
        <span className={cx("inline-flex items-center rounded px-2.5 py-0.5 text-[10px] font-medium tracking-wide uppercase", map.cls)}>
            {map.label}
        </span>
    );
}

function TrustLabel({ score }) {
    const t = getTier(score);
    return (
        <span className={cx("inline-flex items-center gap-1.5 rounded px-2.5 py-0.5 text-[10px] font-medium border uppercase tracking-wider", t.text, t.bg, t.border)}>
            <span className={cx("h-1.5 w-1.5 rounded-full", t.dot)} />
            {t.label} Trust
        </span>
    );
}

function HistoryRow({ item }) {
    return (
        <div className="flex items-center gap-4 border-b border-white/5 px-6 py-4.5 last:border-0 hover:bg-white/[0.02] transition-colors">
            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-slate-200 truncate">{item.event}</p>
                <p className="text-xs text-slate-500 mt-1">{item.date}</p>
            </div>
            <TrustLabel score={item.score} />
            <span className="font-mono text-[13px] font-medium text-slate-300 w-16 text-right shrink-0">{item.payout}</span>
            <div className="w-20 text-right">
                <StatusPill status={item.status} />
            </div>
        </div>
    );
}

function Dashboard() {
    return (
        <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
            <div className="flex items-end justify-between mb-2">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest">System Online · Updated 2 mins ago</p>
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Arjun K. <span className="text-slate-500 font-normal">· ID #DL-2847</span></h1>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500 mb-1">Coverage Status</p>
                    <p className="text-sm font-medium text-slate-300">Active until Sunday</p>
                </div>
            </div>

            {/* Primary metric — Weekly Earnings */}
            <div className="rounded-md border border-white/5 bg-[#0b0f1a] shadow-sm">
                <div className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <p className="text-[11px] font-semibold text-slate-500 mb-3 uppercase tracking-widest">Weekly Earnings</p>
                            <div className="flex items-end gap-5">
                                <p className="font-mono text-[64px] font-bold text-slate-50 tracking-tight leading-none">
                                    <CountUp to={4200} />
                                </p>
                                <div className="mb-2">
                                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded border border-emerald-400/20">↑ ₹452 vs last week</span>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block w-px h-[88px] bg-white/5 mx-4"></div>
                        <div className="md:text-right">
                            <p className="text-[11px] font-semibold text-slate-500 mb-3 uppercase tracking-widest">Protected Income</p>
                            <p className="font-mono text-4xl font-semibold text-slate-200 mb-2 leading-none">
                                <CountUp to={1260} />
                            </p>
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-white/5 px-2.5 py-1.5 rounded inline-block">Max 30% income protection</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trust Score */}
                <div className="rounded-md border border-white/5 bg-[#0b0f1a] shadow-sm flex flex-col">
                    <div className="p-6 border-b border-white/5">
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-[13px] font-semibold text-slate-200">Trust Score (Fraud Risk Engine)</h2>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">High tier</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">Calculated using device, behavior, network, and peer signals</p>
                    </div>
                    <div className="p-6 flex-1">
                        <div className="flex items-end gap-3 mb-8">
                            <p className="font-mono text-[40px] font-bold text-emerald-400 leading-none">88</p>
                            <p className="text-xs text-slate-500 pb-1 font-medium">/ 100</p>
                        </div>
                        
                        <div className="space-y-4">
                            {[
                                { label: "Motion", val: 85, color: "bg-emerald-500" },
                                { label: "Behavior", val: 90, color: "bg-emerald-500" },
                                { label: "Cluster", val: 80, color: "bg-emerald-500" },
                                { label: "Environment", val: 95, color: "bg-emerald-500" },
                                { label: "Network", val: 70, color: "bg-amber-500" },
                            ].map(s => (
                                <div key={s.label} className="flex items-center gap-4">
                                    <div className="w-24 shrink-0">
                                        <p className="text-xs font-medium text-slate-400">{s.label}</p>
                                    </div>
                                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className={cx("h-full rounded-full opacity-90", s.color)} style={{ width: `${s.val}%` }} />
                                    </div>
                                    <span className="font-mono text-[11px] font-semibold text-slate-300 w-8 text-right shrink-0">{s.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Co-Premium Visibility */}
                <div className="rounded-md border border-white/5 bg-[#0b0f1a] shadow-sm flex flex-col">
                    <div className="p-6 border-b border-white/5">
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-[13px] font-semibold text-slate-200">Weekly Premium Breakdown</h2>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">Active</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">Coverage against weather and area disruptions</p>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                        <div className="mb-6">
                            <p className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">Total Premium</p>
                            <div className="flex items-baseline gap-1.5">
                                <p className="font-mono text-3xl font-bold text-slate-100 leading-none">₹50</p>
                                <p className="text-xs text-slate-500 font-medium">/ week</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-auto">
                            <div className="flex items-center justify-between p-4 rounded border border-white/[0.08] bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                    <p className="text-[13px] font-medium text-slate-200">You Pay</p>
                                </div>
                                <p className="font-mono text-lg font-bold text-white">₹35</p>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded border border-white/5 bg-transparent opacity-75">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                                    <p className="text-[13px] font-medium text-slate-300">Platform Pays</p>
                                </div>
                                <p className="font-mono text-base font-medium text-slate-300">₹15</p>
                            </div>
                        </div>

                        <div className="mt-6 flex items-start gap-3 p-4 rounded bg-blue-500/5 border border-blue-500/10">
                            <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs text-blue-200/80 leading-relaxed font-medium">
                                Platform co-contribution improves rider retention and reduces cost for workers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* History */}
            <div className="rounded-md border border-white/5 bg-[#0b0f1a] shadow-sm">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-[13px] font-semibold text-slate-200">Recent Disruptions</h2>
                        <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider">Showing history from the last 30 days</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] text-slate-500 mb-1 uppercase tracking-wider font-semibold">Last payout</p>
                        <p className="text-[13px] font-bold text-emerald-400 font-mono">₹150</p>
                    </div>
                </div>
                <div className="divide-y divide-white/5">
                    {HISTORY.map(item => <HistoryRow key={item.date + item.event} item={item} />)}
                </div>
            </div>

        </div>
    );
}

function VideoVerificationModal({ score, onSubmit, onDismiss }) {
    const [state, setState] = useState("idle");

    const STEPS = [
        { key: "uploading", label: "Uploading securely...", ms: 1400 },
        { key: "validating", label: "Validating metadata...", ms: 1200 },
        { key: "liveness", label: "Running liveness checks...", ms: 1300 },
        { key: "verified", label: "Verification successful", ms: 1000 },
        { key: "released", label: "Payout released", ms: 0 },
    ];

    function start() {
        let i = 0;
        const next = () => {
            setState(STEPS[i].key);
            if (STEPS[i].ms > 0 && i < STEPS.length - 1) { i++; setTimeout(next, STEPS[i].ms); }
        };
        next();
    }

    const processing = ["uploading", "validating", "liveness"].includes(state);
    const stepI = ["uploading", "validating", "liveness"].indexOf(state);
    const stepLabel = STEPS.find(s => s.key === state)?.label ?? "";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050711]/90" style={{ backdropFilter: "blur(4px)" }}>
            <div className="w-full max-w-md rounded-md border border-white/10 bg-[#0b0f1a] shadow-[0_16px_48px_-12px_rgba(0,0,0,1)] overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-100">Verification Required</h3>
                        <p className="text-xs text-slate-400 mt-1.5">Upload a short video to confirm presence</p>
                    </div>
                    <div className="px-3 py-1.5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500/80">Score</span>
                        <span className="font-mono text-sm font-bold text-amber-400">{score}</span>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className={cx(
                        "rounded-md border border-dashed p-8 text-center transition-all duration-300",
                        state === "released" ? "border-emerald-500/40 bg-emerald-500/5" :
                        state === "verified" ? "border-emerald-500/20 bg-emerald-500/5" :
                        processing ? "border-blue-500/30 bg-blue-500/5" :
                        "border-white/15 bg-white/[0.02]"
                    )}>
                        {state === "idle" && (
                            <div className="space-y-3">
                                <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center mx-auto mb-4">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                                        <path d="M10 8l6 4-6 4V8z"></path>
                                    </svg>
                                </div>
                                <p className="text-[13px] font-medium text-slate-200">5-second video proof</p>
                                <p className="text-xs text-slate-500 max-w-[220px] mx-auto">Please record a short video showing your current surroundings.</p>
                                <p className="text-[10px] text-slate-600 font-mono mt-4 pt-4 border-t border-white/5">MP4 / MOV · Max 30 MB</p>
                            </div>
                        )}
                        {processing && (
                            <div className="flex flex-col items-center justify-center py-6 gap-5">
                                <Spinner sz={6} />
                                <div className="space-y-2">
                                    <p className="text-[13px] font-medium text-slate-200">{stepLabel}</p>
                                    <div className="flex gap-1.5 justify-center mt-2">
                                        {["uploading", "validating", "liveness"].map((k, i) => (
                                            <div key={k} className={cx(
                                                "h-1 rounded-full transition-all duration-500",
                                                stepI >= i ? "bg-blue-500 w-6" : "bg-white/10 w-3"
                                            )} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {state === "verified" && (
                            <div className="space-y-2 py-6">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-[13px] font-semibold text-emerald-400">Verification successful</p>
                                <p className="text-xs text-slate-400">Processing payout criteria...</p>
                            </div>
                        )}
                        {state === "released" && (
                            <div className="space-y-3 py-6">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                    <p className="font-mono text-lg font-bold text-emerald-500">₹</p>
                                </div>
                                <p className="text-[13px] font-semibold text-emerald-400">Verification successful → payout released</p>
                                <p className="text-xs font-medium text-emerald-500/70 inline-flex items-center gap-1.5">
                                    Amount credited via UPI
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        {state === "idle" && (
                            <button onClick={start} className="flex-1 rounded-[4px] bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors">
                                Upload 5-sec Video
                            </button>
                        )}
                        {(processing || state === "verified") && (
                            <div className="flex-1 rounded-[4px] bg-white/5 border border-white/5 py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
                                <Spinner sz={3} /> Processing
                            </div>
                        )}
                        {state === "released" && (
                            <button onClick={onSubmit} className="flex-1 rounded-[4px] bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors text-center w-full block">
                                View Result
                            </button>
                        )}
                        <button onClick={onDismiss} disabled={processing}
                            className={cx(
                                "px-6 py-2.5 rounded-[4px] border text-xs font-semibold transition-colors",
                                processing ? "border-transparent bg-transparent text-slate-600 cursor-not-allowed" : "border-white/10 bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
                            )}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Simulate() {
    const [phase, setPhase] = useState("idle");
    const [stepIdx, setStep] = useState(0);
    const [result, setResult] = useState(null);
    const [showVid, setVid] = useState(false);
    const [sel, setSel] = useState(0);
    const timer = useRef(null);

    const scenarios = [
        { label: "Heavy Rain", icon: "🌧️", detail: "Delivery halted due to conditions", payout: "₹150", signals: { motion: 88, behavior: 93, cluster: 87, environment: 94, network: 70 } },
        { label: "Extreme Heat", icon: "🌡️", detail: "Advisory issued · unsafe conditions", payout: null, signals: { motion: 60, behavior: 65, cluster: 58, environment: 66, network: 80 } },
        { label: "Network Anomaly", icon: "📡", detail: "Suspicious routing detected", payout: null, signals: { motion: 85, behavior: 90, cluster: 80, environment: 95, network: 30 } },
    ];

    function computeScore(s) {
        return Math.round(s.motion * 0.20 + s.behavior * 0.30 + s.cluster * 0.20 + s.environment * 0.15 + s.network * 0.15);
    }

    function run() {
        setPhase("loading"); setStep(0); setResult(null);
        let i = 0;
        timer.current = setInterval(() => {
            i++;
            if (i < SIMULATION_STEPS.length) setStep(i);
            else {
                clearInterval(timer.current);
                const r = scenarios[sel];
                const score = computeScore(r.signals);
                const res = { ...r, score };
                setResult(res);
                if (score >= 50 && score <= 85) { setVid(true); setPhase("verify"); }
                else setPhase("result");
            }
        }, 800);
    }

    useEffect(() => () => clearInterval(timer.current), []);

    const isPaid = result?.payout != null;
    const isNetFlagged = result?.signals?.network < 40;
    
    // According to instruction: earnings protection text changes to "Income Loss Compensated"
    const finalStatusText = isNetFlagged ? "Review Required" : (isPaid ? "Income Loss Compensated" : "Threshold Not Met");
    const colorClass = isNetFlagged ? "text-amber-400" : (isPaid ? "text-emerald-400" : "text-slate-400");
    const bgClass = isNetFlagged ? "bg-amber-400/5 border-amber-400/20" : (isPaid ? "bg-emerald-400/5 border-emerald-400/20" : "bg-white/5 border-white/10");

    const t = result ? getTier(result.score) : null;
    const reset = () => { setPhase("idle"); setResult(null); setVid(false); };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {showVid && result && (
                <VideoVerificationModal score={result.score}
                    onSubmit={() => { setVid(false); setPhase("result"); }}
                    onDismiss={() => { setVid(false); setPhase("idle"); setResult(null); }}
                />
            )}

            <div className="animate-fade-in">
                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-slate-100 tracking-tight">Check Disruption Impact</h1>
                    <p className="mt-1 text-[13px] text-slate-400 max-w-xl">Evaluate live conditions and signal integrity to determine protective payout eligibility.</p>
                </div>

                <div className="rounded-md border border-white/5 bg-[#0b0f1a] shadow-sm p-6 md:p-8">
                    {phase === "idle" && (
                        <div>
                            <p className="text-[11px] font-semibold text-slate-500 mb-4 uppercase tracking-wider">Select Disruption Scenario</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {scenarios.map((s, i) => (
                                    <button key={s.label}
                                        onClick={() => { setSel(i); setResult(null); }}
                                        className={cx(
                                            "rounded border p-4 text-left transition-all",
                                            sel === i
                                                ? "border-blue-500 bg-blue-500/5 text-slate-200"
                                                : "border-white/10 bg-transparent text-slate-400 hover:border-white/20 hover:text-slate-200"
                                        )}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xl">{s.icon}</span>
                                            <div className={cx("w-3 h-3 rounded-full border flex items-center justify-center", sel === i ? "border-blue-500" : "border-white/20")}>
                                                {sel === i && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                            </div>
                                        </div>
                                        <span className="block text-[13px] font-semibold mb-1 text-slate-200">{s.label}</span>
                                        <span className="block text-xs opacity-75 leading-relaxed text-slate-400">{s.detail}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                                <button onClick={run} className="rounded-[4px] bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors">
                                    Check Disruption Impact
                                </button>
                            </div>
                        </div>
                    )}

                    {phase === "loading" && (
                        <div className="py-16 flex flex-col items-center justify-center">
                            <Spinner sz={6} />
                            <div className="mt-6 text-center">
                                <p className="text-[13px] font-medium text-slate-200 mb-2">{SIMULATION_STEPS[stepIdx]}</p>
                                <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase font-semibold">Step {stepIdx + 1} of {SIMULATION_STEPS.length}</p>
                            </div>
                            <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden mt-6">
                                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${((stepIdx + 1) / SIMULATION_STEPS.length) * 100}%` }} />
                            </div>
                        </div>
                    )}

                    {phase === "result" && result && t && (
                        <div className="animate-fade-in space-y-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
                                <div>
                                    <h2 className="text-[15px] font-semibold text-slate-100">Earnings Protection Result</h2>
                                    <p className="text-xs text-slate-400 mt-1">Processed for <span className="text-slate-300 font-medium">{scenarios[sel].label}</span> scenario</p>
                                </div>
                                <button onClick={reset} className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white border border-white/10 bg-white/5 px-3 py-1.5 rounded transition-colors">
                                    New Check
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row items-start gap-8">
                                <div className="w-full md:w-36 shrink-0">
                                    <p className="text-[11px] font-semibold text-slate-500 mb-3 uppercase tracking-wider">Final Score</p>
                                    <div className="flex items-baseline gap-2 mb-3">
                                        <p className={cx("font-mono text-5xl font-bold leading-none", t.text)}>{result.score}</p>
                                        <span className="text-xs font-semibold text-slate-500">/100</span>
                                    </div>
                                    <TrustLabel score={result.score} />
                                </div>
                                <div className={cx("flex-1 rounded-md border p-5 w-full", bgClass)}>
                                    <div className="flex items-start gap-3">
                                        {isNetFlagged && (
                                            <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        )}
                                        {isPaid && !isNetFlagged && (
                                            <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                        {!isNetFlagged && !isPaid && (
                                            <svg className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                            </svg>
                                        )}
                                        <div>
                                            <p className={cx("text-[13px] font-bold mb-1 uppercase tracking-wide", colorClass)}>
                                                {finalStatusText}
                                            </p>
                                            <p className={cx("text-xs leading-relaxed", isNetFlagged ? "text-amber-500/80" : "text-slate-400")}>
                                                {isNetFlagged 
                                                    ? "Suspicious network detected (possible VPN/proxy). Trust score penalized. Manual review required." 
                                                    : (isPaid ? `Qualified for ${result.payout} compensation payload. Scheduled for instant transfer.` : "Event conditions did not meet minimum threshold for payout.")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Signal Validation */}
                            <div className="pt-2">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Signal Validation</p>
                                    <p className="text-[10px] font-medium text-slate-500 border border-white/5 bg-white/[0.02] px-2 py-1 rounded">No single signal can trigger payout</p>
                                </div>
                                <div className="rounded-md border border-white/5 overflow-hidden">
                                    <div className="divide-y divide-white/5 bg-[#0b0f1a]">
                                        {[
                                            { label: "Motion Score", val: result.signals?.motion },
                                            { label: "Behavior Score", val: result.signals?.behavior },
                                            { label: "Cluster Score", val: result.signals?.cluster },
                                            { label: "Environment Score", val: result.signals?.environment },
                                            { label: "Network Score", val: result.signals?.network, flagIfLow: true },
                                        ].map(({ label, val, flagIfLow }) => {
                                            const isLow = flagIfLow && val < 40;
                                            return (
                                                <div key={label} className="flex items-center justify-between p-3.5 hover:bg-white/[0.01]">
                                                    <p className="text-xs font-semibold text-slate-400 w-36">{label}</p>
                                                    <div className="flex-1 px-6">
                                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                            <div className={cx("h-full rounded-full", isLow ? "bg-amber-500" : "bg-emerald-500")}
                                                                style={{ width: `${val}%` }} />
                                                        </div>
                                                    </div>
                                                    <p className={cx("font-mono text-xs w-10 text-right", isLow ? "text-amber-400 font-bold" : "text-slate-300 font-semibold")}>{val}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function VayuGuard() {
    const [page, setPage] = useState("Dashboard");

    return (
        <div className="min-h-screen bg-[#0b0f1a] text-slate-300 font-sans selection:bg-blue-500/30">
            {/* Navbar */}
            <nav className="border-b border-white/5 bg-[#0b0f1a]/95 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-[1040px] mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2.5">
                            <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-[1px]"></div>
                            </div>
                            <span className="text-[13px] font-semibold text-white tracking-tight">VayuGuard Internal</span>
                        </div>
                        <div className="hidden md:flex items-center gap-1">
                            {NAV_LINKS.map(link => (
                                <button key={link} onClick={() => setPage(link)}
                                    className={cx(
                                        "px-3 py-1.5 text-xs font-semibold rounded transition-colors",
                                        page === link ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                                    )}>
                                    {link}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-semibold text-slate-200">Arjun K.</p>
                            <p className="text-[10px] text-slate-500 font-mono tracking-wide mt-0.5">DL-2847</p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-[#0b0f1a] border border-white/10 flex items-center justify-center text-xs font-bold text-slate-300 shadow-sm">
                            AK
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-[1040px] mx-auto px-6 py-10">
                {page === "Dashboard" && <Dashboard />}
                {page === "Simulate" && <Simulate />}
                {(page === "History" || page === "Settings") && (
                    <div className="py-24 text-center border border-dashed border-white/10 rounded-md max-w-2xl mx-auto mt-8 bg-white/[0.01]">
                        <p className="text-sm font-semibold text-slate-300 mb-1">{page} module</p>
                        <p className="text-xs text-slate-500">Not configured for this demonstrator environment.</p>
                    </div>
                )}
            </main>
        </div>
    );
}