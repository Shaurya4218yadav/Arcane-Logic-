import { useState, useEffect, useRef } from "react";

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

// ── Helpers ───────────────────────────────────────────────────────────────────
function getTier(score) {
    if (score >= 85) return { label: "High", text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", bar: "bg-emerald-500", dot: "bg-emerald-400", hex: "#10b981" };
    if (score >= 50) return { label: "Medium", text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", bar: "bg-amber-400", dot: "bg-amber-400", hex: "#f59e0b" };
    return { label: "Low", text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", bar: "bg-red-500", dot: "bg-red-400", hex: "#ef4444" };
}

function Spinner({ sz = 4 }) {
    return (
        <svg className={`h-${sz} w-${sz} animate-spin text-slate-400`} viewBox="0 0 24 24" fill="none">
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

// ── Status pill ───────────────────────────────────────────────────────────────
function StatusPill({ status }) {
    const map = {
        paid: { label: "Paid", cls: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" },
        review: { label: "Review", cls: "text-amber-400   bg-amber-500/10   border border-amber-500/20" },
        flagged: { label: "Flagged", cls: "text-red-400     bg-red-500/10     border border-red-500/20" },
    }[status];
    return (
        <span className={cx("inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold", map.cls)}>
            {map.label}
        </span>
    );
}

// ── Trust label ───────────────────────────────────────────────────────────────
function TrustLabel({ score }) {
    const t = getTier(score);
    return (
        <span className={cx("inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold border", t.text, t.bg, t.border)}>
            <span className={cx("h-1.5 w-1.5 rounded-full", t.dot)} />
            {t.label} Trust
        </span>
    );
}

// ── History Row ───────────────────────────────────────────────────────────────
const EV_ICON = { paid: "🌧️", review: "🌡️", flagged: "🚧" };
function HistoryRow({ item }) {
    return (
        <div className="flex items-center gap-4 border-b border-white/4 px-1 py-3 last:border-b-0 transition-colors hover:bg-white/2">
            <span className="text-base w-6 shrink-0">{EV_ICON[item.status]}</span>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 truncate">{item.event}</p>
                <p className="text-xs text-slate-600 mt-0.5">{item.date}</p>
            </div>
            <TrustLabel score={item.score} />
            <span className="font-mono text-sm text-slate-300 w-10 text-right shrink-0">{item.payout}</span>
            <StatusPill status={item.status} />
        </div>
    );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard() {
    return (
        <div className="animate-fade-in">

            {/* Page header — left-aligned, no centering */}
            <div className="mb-8">
                <p className="text-xs text-slate-600 mb-1">Delivery Partner · Arjun K. · ID #DL-2847</p>
                <h1 className="text-2xl font-bold text-white tracking-tight">Earnings Overview</h1>
                <p className="mt-1 text-sm text-slate-500">Updated 2 mins ago · Coverage active until Sunday</p>
            </div>

            {/* Primary metric — full width, larger, stands out */}
            <div className="rounded-lg border border-white/8 p-6 mb-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">This Week's Earnings</p>
                        <p className="font-mono text-5xl font-bold text-white tracking-tight">
                            <CountUp to={4200} />
                        </p>
                        <p className="text-sm text-emerald-400 mt-2 font-medium">↑ ₹452 vs last week</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-600 mb-1">Protected up to</p>
                        <p className="font-mono text-xl font-bold text-slate-200">
                            <CountUp to={1260} />
                        </p>
                        <p className="text-xs text-slate-600 mt-1">Max 30% of earnings</p>
                    </div>
                </div>
            </div>

            {/* Secondary metrics — 3-column, slightly smaller */}
            <div className="grid grid-cols-3 gap-3 mb-7">
                <div className="rounded-lg border border-white/6 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <p className="text-[11px] text-slate-600 mb-2 uppercase tracking-wider">Weekly Premium</p>
                    <p className="font-mono text-2xl font-bold text-slate-100">₹50</p>
                    <p className="text-xs text-slate-600 mt-1.5">You ₹35 + Platform ₹15</p>
                </div>
                <div className="rounded-lg border border-white/6 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <p className="text-[11px] text-slate-600 mb-2 uppercase tracking-wider">Last Payout</p>
                    <p className="font-mono text-2xl font-bold text-emerald-400">₹150</p>
                    <p className="text-xs text-slate-600 mt-1.5">Mar 14 · via UPI</p>
                </div>
                <div className="rounded-lg border border-white/6 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <p className="text-[11px] text-slate-600 mb-2 uppercase tracking-wider">Deliveries This Week</p>
                    <p className="font-mono text-2xl font-bold text-slate-100">47</p>
                    <p className="text-xs text-slate-600 mt-1.5">3 disruption hours logged</p>
                </div>
            </div>

            {/* Trust Score — product-style card */}
            <div className="rounded-lg border border-white/8 p-5 mb-7" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-sm font-semibold text-white">Trust Score <span className="text-slate-600 font-normal text-xs">(Fraud Risk Engine)</span></p>
                        <p className="text-xs text-slate-500 mt-0.5">Based on behavior, device, and network signals</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span className="text-xs text-emerald-400 font-medium">High</span>
                    </div>
                </div>

                <div className="flex items-end gap-4 mb-4">
                    <p className="font-mono text-5xl font-bold text-emerald-400 leading-none">88</p>
                    <div className="pb-1">
                        <p className="text-xs text-slate-600">out of 100</p>
                        <p className="text-xs text-slate-500 mt-0.5">Excellent standing · no flags</p>
                    </div>
                </div>

                {/* Signal breakdown — clean table style */}
                <div className="border-t border-white/6 pt-4 grid grid-cols-2 gap-x-8 gap-y-2.5">
                    {[
                        { label: "Behavior", val: 90, weight: "30%" },
                        { label: "Cluster", val: 80, weight: "20%" },
                        { label: "Motion", val: 85, weight: "20%" },
                        { label: "Environment", val: 95, weight: "15%" },
                        { label: "Network", val: 91, weight: "15%" },
                    ].map(s => (
                        <div key={s.label} className="flex items-center gap-3">
                            <div className="w-20 shrink-0">
                                <p className="text-xs text-slate-500">{s.label}</p>
                                <p className="text-[10px] text-slate-700">{s.weight} weight</p>
                            </div>
                            <div className="flex-1 h-1 bg-white/6 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.val}%` }} />
                            </div>
                            <span className="font-mono text-xs text-emerald-400 font-bold w-6 text-right">{s.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active policy — minimal strip */}
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3 mb-7 flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-blue-400">Weather Disruption Protection — Active</p>
                    <p className="text-xs text-slate-500 mt-0.5">Delivery earnings coverage · Renews Apr 1, 2026 · Covered up to ₹1,260</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400 font-medium">Live</span>
                </div>
            </div>

            {/* Premium breakdown — clean, no gradients */}
            <div className="rounded-lg border border-white/6 overflow-hidden mb-7" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-400">Weekly Premium Breakdown</p>
                    <p className="font-mono text-sm font-bold text-white">₹50 <span className="text-slate-600 font-normal text-xs">/ week</span></p>
                </div>
                <div className="px-5 py-4">
                    {/* Split bar */}
                    <div className="flex h-7 rounded overflow-hidden border border-white/6 mb-4">
                        <div className="flex items-center justify-center text-xs font-semibold text-blue-400 bg-blue-500/12 border-r border-white/6" style={{ width: "70%" }}>
                            You · ₹35
                        </div>
                        <div className="flex items-center justify-center text-xs font-semibold text-slate-400 bg-white/3 flex-1">
                            Platform · ₹15
                        </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Platform co-contributes ₹15/week to keep your premium low. This reduces your out-of-pocket cost by 30%.
                    </p>
                </div>
            </div>

            {/* History — table-like, no card border per row */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent Disruptions</p>
                    <p className="text-xs text-slate-700">Showing last 4 events</p>
                </div>
                <div className="rounded-lg border border-white/6 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
                    {HISTORY.map(item => <HistoryRow key={item.date + item.event} item={item} />)}
                </div>
            </div>

        </div>
    );
}

// ── Video Verification Modal ──────────────────────────────────────────────────
function VideoVerificationModal({ score, onSubmit, onDismiss }) {
    const [state, setState] = useState("idle");

    const STEPS = [
        { key: "uploading", label: "Uploading & encrypting...", ms: 1400 },
        { key: "validating", label: "Validating metadata...", ms: 1200 },
        { key: "liveness", label: "Running liveness checks...", ms: 1300 },
        { key: "verified", label: "Verification successful", ms: 1000 },
        { key: "released", label: "₹150 payout released", ms: 0 },
    ];

    function start() {
        let i = 0;
        const next = () => {
            setState(STEPS[i].key);
            if (STEPS[i].ms > 0 && i < STEPS.length - 1) { i++; setTimeout(next, STEPS[i - 1].ms); }
        };
        next();
    }

    const processing = ["uploading", "validating", "liveness"].includes(state);
    const stepI = ["uploading", "validating", "liveness"].indexOf(state);
    const stepLabel = STEPS.find(s => s.key === state)?.label ?? "";

    return (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(4,6,14,0.88)", backdropFilter: "blur(12px)" }}>
            <div className="w-full max-w-md rounded-lg border border-white/10 shadow-2xl"
                style={{ background: "#0f1525" }}>

                {/* Header */}
                <div className="px-6 py-5 border-b border-white/6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-white">Verification Required</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Trust score in medium range — video proof needed</p>
                        </div>
                        <div className="flex items-center gap-2 rounded border border-amber-500/25 bg-amber-500/8 px-2.5 py-1">
                            <span className="font-mono text-lg font-bold text-amber-400 leading-none">{score}</span>
                            <span className="text-[10px] text-amber-600">/ 100</span>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-5 space-y-5">
                    {/* Upload zone */}
                    <div className={cx(
                        "rounded border-2 border-dashed p-8 text-center transition-all duration-300",
                        state === "released" ? "border-emerald-500/40 bg-emerald-500/5" :
                            state === "verified" ? "border-emerald-500/25 bg-emerald-500/5" :
                                processing ? "border-blue-500/30 bg-blue-500/5" :
                                    "border-white/8 hover:border-white/15"
                    )}>
                        {state === "idle" && (
                            <div className="space-y-1.5">
                                <p className="text-sm font-medium text-slate-300">Upload a 5-second video</p>
                                <p className="text-xs text-slate-600">Show you're on the road and affected by the disruption</p>
                                <p className="text-[10px] text-slate-700 mt-2">MP4 / MOV · Max 30 MB</p>
                            </div>
                        )}
                        {processing && (
                            <div className="flex flex-col items-center gap-3">
                                <Spinner sz={5} />
                                <p className="text-sm text-slate-300">{stepLabel}</p>
                                <div className="flex gap-1.5">
                                    {["uploading", "validating", "liveness"].map((k, i) => (
                                        <div key={k} className={cx(
                                            "h-1 rounded-full transition-all duration-400",
                                            stepI >= i ? "bg-blue-400 w-8" : "bg-white/10 w-4"
                                        )} />
                                    ))}
                                </div>
                            </div>
                        )}
                        {state === "verified" && (
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-emerald-400">Verification successful</p>
                                <p className="text-xs text-slate-500">Processing payout...</p>
                            </div>
                        )}
                        {state === "released" && (
                            <div className="space-y-1.5">
                                <p className="text-xl font-bold text-emerald-400">₹150 payout released</p>
                                <p className="text-xs text-emerald-600 font-medium">Instant payout via UPI</p>
                            </div>
                        )}
                    </div>

                    {/* Step list — shows progress as text */}
                    {(processing || state === "verified") && (
                        <div className="space-y-1.5">
                            {STEPS.slice(0, 4).map((s, i) => {
                                const currentI = ["uploading", "validating", "liveness", "verified"].indexOf(state);
                                const done = i < currentI;
                                const active = i === currentI;
                                return (
                                    <div key={s.key} className="flex items-center gap-2">
                                        <div className={cx("h-1.5 w-1.5 rounded-full shrink-0",
                                            done ? "bg-emerald-500" : active ? "bg-blue-400 animate-pulse" : "bg-white/15")} />
                                        <span className={cx("text-xs", done ? "text-slate-600 line-through" : active ? "text-slate-200" : "text-slate-700")}>
                                            {s.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                        {state === "idle" && (
                            <button onClick={start}
                                className="flex-1 rounded bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors">
                                Upload 5-sec Video
                            </button>
                        )}
                        {(processing || state === "verified") && (
                            <div className="flex-1 rounded bg-white/5 py-2.5 flex items-center justify-center gap-2 text-sm text-slate-500 cursor-not-allowed border border-white/6">
                                <Spinner sz={4} /> {state === "verified" ? "Finalising..." : "Processing..."}
                            </div>
                        )}
                        {state === "released" && (
                            <button onClick={onSubmit}
                                className="flex-1 rounded bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors">
                                View full result
                            </button>
                        )}
                        <button onClick={onDismiss} disabled={processing}
                            className={cx(
                                "rounded border border-white/8 bg-white/3 px-4 py-2.5 text-sm text-slate-400 transition-colors",
                                processing ? "opacity-30 cursor-not-allowed" : "hover:bg-white/6 hover:text-white"
                            )}>
                            Cancel
                        </button>
                    </div>

                    <p className="text-[10px] text-slate-700 text-center">
                        Video stored securely · deleted after 72h · used only for fraud validation
                    </p>
                </div>
            </div>
        </div>
    );
}

// ── Simulate ──────────────────────────────────────────────────────────────────
function Simulate() {
    const [phase, setPhase] = useState("idle");
    const [stepIdx, setStep] = useState(0);
    const [result, setResult] = useState(null);
    const [showVid, setVid] = useState(false);
    const [sel, setSel] = useState(0);
    const timer = useRef(null);

    const scenarios = [
        { label: "Heavy Rain", icon: "🌧️", detail: "Delivery activity halted due to heavy rain", payout: "₹150", signals: { motion: 88, behavior: 93, cluster: 87, environment: 94, network: 91 } },
        { label: "Extreme Heat", icon: "🌡️", detail: "Heat advisory issued · unsafe riding conditions", payout: null, signals: { motion: 60, behavior: 65, cluster: 58, environment: 66, network: 22 } },
        { label: "Area Shutdown", icon: "🚧", detail: "Local zone blocked · delivery access restricted", payout: "₹90", signals: { motion: 75, behavior: 80, cluster: 73, environment: 84, network: 79 } },
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
        }, 900);
    }

    useEffect(() => () => clearInterval(timer.current), []);

    const isPaid = result?.payout != null;
    const t = result ? getTier(result.score) : null;
    const reset = () => { setPhase("idle"); setResult(null); setVid(false); };

    return (
        <>
            {showVid && result && (
                <VideoVerificationModal score={result.score}
                    onSubmit={() => { setVid(false); setPhase("result"); }}
                    onDismiss={() => { setVid(false); setPhase("idle"); setResult(null); }}
                />
            )}

            <div className="animate-fade-in">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Check Disruption Impact</h1>
                    <p className="mt-1 text-sm text-slate-500">Simulate a disruption event to see if your earnings qualify for a protection payout.</p>
                </div>

                {/* Disruption picker — compact, left-aligned */}
                <div className="mb-5">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Select disruption type</p>
                    <div className="grid grid-cols-3 gap-2">
                        {scenarios.map((s, i) => (
                            <button key={s.label}
                                onClick={() => { setSel(i); setPhase("idle"); setResult(null); }}
                                className={cx(
                                    "rounded-lg border p-3.5 text-left transition-all duration-150",
                                    sel === i
                                        ? "border-blue-500/50 bg-blue-500/8 text-white"
                                        : "border-white/6 bg-white/2 text-slate-400 hover:border-white/12 hover:text-slate-200"
                                )}>
                                <span className="block text-xl mb-2 leading-none">{s.icon}</span>
                                <span className="block text-sm font-semibold leading-tight">{s.label}</span>
                                <span className="block text-[10px] mt-1 text-slate-500 leading-snug">{s.detail}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* CTA — flat, no rainbow gradient */}
                <button onClick={run} disabled={phase === "loading"}
                    className={cx(
                        "w-full rounded-lg py-3 text-sm font-semibold transition-all duration-150 mb-5",
                        phase === "loading"
                            ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/6"
                            : "bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700"
                    )}>
                    <span className="flex items-center justify-center gap-2">
                        {phase === "loading" && <Spinner sz={4} />}
                        {phase === "loading" ? SIMULATION_STEPS[stepIdx] : "Run disruption check"}
                    </span>
                </button>

                {/* Loading steps */}
                {phase === "loading" && (
                    <div className="animate-fade-in rounded-lg border border-white/6 bg-white/2 px-4 py-3 mb-5">
                        <div className="flex gap-1.5 mb-2">
                            {SIMULATION_STEPS.map((_, i) => (
                                <div key={i} className={cx("h-0.5 flex-1 rounded-full transition-all duration-500",
                                    i <= stepIdx ? "bg-blue-500" : "bg-white/8")} />
                            ))}
                        </div>
                        <p className="text-xs text-slate-500">Step {stepIdx + 1} of {SIMULATION_STEPS.length}</p>
                    </div>
                )}

                {/* Result */}
                {phase === "result" && result && t && (
                    <div className="animate-fade-in rounded-lg border border-white/8 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>

                        {/* Status bar — thin, colored */}
                        <div className={cx("h-0.5 w-full", isPaid ? "bg-emerald-500" : "bg-red-500")} />

                        <div className="p-5">
                            <p className="text-[10px] font-medium text-slate-600 uppercase tracking-wider mb-4">Earnings Protection Result</p>

                            {/* Score row */}
                            <div className="flex items-start gap-6 mb-5">
                                <div>
                                    <p className={cx("font-mono text-6xl font-bold leading-none", t.text)}>{result.score}</p>
                                    <p className="text-xs text-slate-600 mt-1.5">Trust score / 100</p>
                                    <TrustLabel score={result.score} />
                                </div>
                                <div className={cx("flex-1 rounded-lg border p-4", isPaid ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5")}>
                                    <p className={cx("text-lg font-bold", isPaid ? "text-emerald-400" : "text-red-400")}>
                                        {isPaid ? `${result.payout} payout triggered` : "Flagged for review"}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {isPaid ? "Instant payout via UPI · credited within minutes" : "Manual review of delivery activity initiated"}
                                    </p>
                                </div>
                            </div>

                            {/* Score bar */}
                            <div className="h-1 w-full bg-white/6 rounded-full mb-5">
                                <div className={cx("h-full rounded-full transition-all duration-1000", t.bar)}
                                    style={{ width: `${result.score}%` }} />
                            </div>

                            {/* Signal table */}
                            <div className="rounded-lg border border-white/6 overflow-hidden">
                                <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between bg-white/2">
                                    <p className="text-xs font-semibold text-slate-400">Signal Validation</p>
                                    <p className="text-[10px] text-slate-700">No single signal triggers payout</p>
                                </div>
                                <div className="divide-y divide-white/4">
                                    {[
                                        { label: "Behavior", val: result.signals?.behavior, w: "30%" },
                                        { label: "Motion", val: result.signals?.motion, w: "20%" },
                                        { label: "Cluster", val: result.signals?.cluster, w: "20%" },
                                        { label: "Environment", val: result.signals?.environment, w: "15%" },
                                        { label: "Network", val: result.signals?.network, w: "15%" },
                                    ].map(({ label, val, w }) => {
                                        const isNetFlagged = label === "Network" && val < 40;
                                        return (
                                            <div key={label} className="flex items-center gap-4 px-4 py-2.5">
                                                <div className="w-24 shrink-0">
                                                    <p className="text-xs text-slate-400">{label}</p>
                                                    <p className="text-[10px] text-slate-700">{w} weight</p>
                                                </div>
                                                <div className="flex-1 h-1 bg-white/6 rounded-full overflow-hidden">
                                                    <div className={cx("h-full rounded-full", isNetFlagged ? "bg-red-500" : t.bar)}
                                                        style={{ width: `${val}%` }} />
                                                </div>
                                                <span className={cx("font-mono text-xs font-bold w-6 text-right shrink-0",
                                                    isNetFlagged ? "text-red-400" : t.text)}>{val}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* VPN warning — inline, not a floating card */}
                            {result.signals?.network < 40 && (
                                <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                                    <span className="text-amber-500 text-sm mt-0.5 shrink-0">⚠</span>
                                    <div>
                                        <p className="text-sm font-semibold text-amber-400">Suspicious network detected</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Possible VPN or proxy usage detected. Trust score reduced. Manual review required before any payout is released.</p>
                                    </div>
                                </div>
                            )}

                            <button onClick={reset}
                                className="mt-4 w-full rounded border border-white/8 py-2 text-xs text-slate-500 transition-colors hover:text-slate-300 hover:border-white/15">
                                ← Run another check
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function VayuGuard() {
    const [page, setPage] = useState("Dashboard");

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #0b0f1a; color: #cbd5e1; min-height: 100vh; -webkit-font-smoothing: antialiased; }
        .font-mono { font-family: 'JetBrains Mono', monospace !important; }

        @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease both; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

        /* Opacity helpers */
        .bg-white\\/2  { background-color: rgba(255,255,255,0.02); }
        .bg-white\\/3  { background-color: rgba(255,255,255,0.03); }
        .bg-white\\/4  { background-color: rgba(255,255,255,0.04); }
        .bg-white\\/5  { background-color: rgba(255,255,255,0.05); }
        .bg-white\\/6  { background-color: rgba(255,255,255,0.06); }
        .bg-white\\/8  { background-color: rgba(255,255,255,0.08); }
        .border-white\\/4  { border-color: rgba(255,255,255,0.04); }
        .border-white\\/5  { border-color: rgba(255,255,255,0.05); }
        .border-white\\/6  { border-color: rgba(255,255,255,0.06); }
        .border-white\\/8  { border-color: rgba(255,255,255,0.08); }
        .border-white\\/12 { border-color: rgba(255,255,255,0.12); }
        .border-white\\/15 { border-color: rgba(255,255,255,0.15); }
        .divide-white\\/4 > * + * { border-color: rgba(255,255,255,0.04); }
        .hover\\:bg-white\\/2:hover  { background-color: rgba(255,255,255,0.02); }
        .hover\\:bg-white\\/6:hover  { background-color: rgba(255,255,255,0.06); }
        .hover\\:border-white\\/12:hover { border-color: rgba(255,255,255,0.12); }
        .hover\\:border-white\\/15:hover { border-color: rgba(255,255,255,0.15); }
        .bg-blue-500\\/8    { background-color: rgba(59,130,246,0.08); }
        .bg-blue-500\\/12   { background-color: rgba(59,130,246,0.12); }
        .bg-amber-500\\/5   { background-color: rgba(245,158,11,0.05); }
        .bg-amber-500\\/8   { background-color: rgba(245,158,11,0.08); }
        .bg-emerald-500\\/5 { background-color: rgba(16,185,129,0.05); }
        .bg-emerald-500\\/10{ background-color: rgba(16,185,129,0.10); }
        .bg-amber-500\\/10  { background-color: rgba(245,158,11,0.10); }
        .bg-red-500\\/10    { background-color: rgba(239,68,68,0.10); }
        .bg-red-500\\/5     { background-color: rgba(239,68,68,0.05); }
        .bg-blue-500\\/5    { background-color: rgba(59,130,246,0.05); }
        .border-emerald-500\\/20 { border-color: rgba(16,185,129,0.20); }
        .border-amber-500\\/20   { border-color: rgba(245,158,11,0.20); }
        .border-amber-500\\/25   { border-color: rgba(245,158,11,0.25); }
        .border-red-500\\/20     { border-color: rgba(239,68,68,0.20); }
        .border-blue-500\\/20    { border-color: rgba(59,130,246,0.20); }
        .border-blue-500\\/50    { border-color: rgba(59,130,246,0.50); }
      `}</style>

            <div className="min-h-screen" style={{ background: "#0b0f1a" }}>

                {/* Single subtle glow — top right only, very low opacity */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute -top-32 -right-32 h-[400px] w-[400px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
                </div>

                {/* Navbar — clean, minimal */}
                <nav className="sticky top-0 z-50 border-b border-white/6"
                    style={{ background: "rgba(11,15,26,0.95)", backdropFilter: "blur(16px)" }}>
                    <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
                        {/* Logo — text-first, no gradient icon */}
                        <div className="flex items-center gap-3">
                            <div className="h-7 w-7 rounded-md bg-blue-600 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold text-white">VayuGuard</span>
                            <span className="text-[10px] font-medium text-slate-600 border border-white/8 rounded px-1.5 py-px">Demo</span>
                        </div>

                        {/* Nav — simple underline style */}
                        <div className="flex items-center gap-1">
                            {NAV_LINKS.map(link => (
                                <button key={link} onClick={() => setPage(link)}
                                    className={cx(
                                        "px-3 py-1.5 text-sm rounded transition-colors duration-150",
                                        page === link
                                            ? "text-white bg-white/6"
                                            : "text-slate-500 hover:text-slate-300"
                                    )}>
                                    {link}
                                </button>
                            ))}
                        </div>

                        {/* User — just initials + name */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 hidden sm:block">Arjun K.</span>
                            <div className="h-7 w-7 rounded-md bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                                AK
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Content */}
                <main className="mx-auto max-w-4xl px-6 py-8">
                    {page === "Dashboard" && <Dashboard />}
                    {page === "Simulate" && <Simulate />}
                    {(page === "History" || page === "Settings") && (
                        <div className="animate-fade-in py-24 text-center">
                            <p className="text-2xl font-bold text-white mb-2">{page}</p>
                            <p className="text-sm text-slate-500 mb-6">Under construction for the demo.</p>
                            <button onClick={() => setPage("Dashboard")}
                                className="rounded border border-white/8 px-4 py-2 text-sm text-slate-400 hover:text-white hover:border-white/15 transition-colors">
                                ← Back to Dashboard
                            </button>
                        </div>
                    )}
                </main>

                <footer className="border-t border-white/5 py-4">
                    <p className="text-center text-[11px] text-slate-700">VayuGuard · Delivery Partner Earnings Protection · v1.0</p>
                </footer>
            </div>
        </>
    );
}