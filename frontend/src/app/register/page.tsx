"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, createPolicy, getPreviewPremium } from "@/lib/api";
import { CHENNAI_ZONES, DELIVERY_PLATFORMS } from "@/lib/constants";
import { ShieldCheck, Phone, MapPin, CheckCircle2, Loader2, ArrowRight, Smartphone } from "lucide-react";

type Step = 1 | 2 | 3;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [phone, setPhone] = useState("");
  const [platform, setPlatform] = useState("");
  const [zone, setZone] = useState("Adyar");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [premiumPreview, setPremiumPreview] = useState<number | null>(null);
  const [premiumReasoning, setPremiumReasoning] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = () => {
    if (phone.length < 10) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    setError("");
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    // Simulated OTP verification for demo
    if (otp.length === 4) {
      setError("");
      setStep(2);
    } else {
      setError("Enter a 4-digit OTP");
    }
  };

  const handleZoneSelect = async (z: string) => {
    setZone(z);
    try {
      const preview = await getPreviewPremium(z);
      setPremiumPreview(preview.dynamic_premium);
      setPremiumReasoning(preview.premium_reasoning);
    } catch {
      // Fallback premium calculation
      const basePremiums: Record<string, number> = {
        "Adyar": 52, "Velachery": 58, "T. Nagar": 45, "Anna Nagar": 47,
        "Tambaram": 48, "Perungudi": 55, "Sholinganallur": 53,
      };
      setPremiumPreview(basePremiums[z] || 50);
      setPremiumReasoning(`${z}: zone-based risk assessment`);
    }
  };

  const handleGoToStep3 = () => {
    if (!platform) {
      setError("Select your delivery platform");
      return;
    }
    setError("");
    setStep(3);
  };

  const handleActivate = async () => {
    setLoading(true);
    setError("");
    try {
      const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
      await registerUser(formattedPhone, platform, "Chennai", zone);
      await createPolicy(premiumPreview || 50, 1000);
      router.push("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      if (message.includes("400")) {
        setError("Phone already registered. Redirecting to dashboard...");
        setTimeout(() => router.push("/"), 1500);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-6">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Join VayuGuard</h1>
          <p className="text-sm text-slate-400 mt-2">Protect up to 30% of your weekly income for ₹35</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= s
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                  : "bg-slate-800 text-slate-500 border border-slate-700"
              }`}>
                {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
              </div>
              {s < 3 && <div className={`h-0.5 w-8 rounded ${step > s ? "bg-cyan-500" : "bg-slate-800"}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-lg p-6">

          {/* Step 1: Phone + OTP */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-cyan-400" />
                  Verify Your Phone
                </h2>
                <p className="text-xs text-slate-500 mt-1">Quick OTP verification to create your account</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Phone Number</label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-400">+91</div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="9876543210"
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-600 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    />
                  </div>
                </div>

                {!otpSent ? (
                  <button onClick={handleSendOtp} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2">
                    Send OTP <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Enter OTP</label>
                      <div className="flex gap-2 items-center">
                        <Smartphone className="h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          maxLength={4}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                          placeholder="1234"
                          className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-600 text-sm text-center tracking-[0.5em] font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                        />
                      </div>
                      <p className="text-[10px] text-emerald-400 mt-1">✓ OTP sent to +91{phone} (demo: enter any 4 digits)</p>
                    </div>
                    <button onClick={handleVerifyOtp} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all">
                      Verify & Continue
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Platform + Zone */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-cyan-400" />
                  Your Delivery Profile
                </h2>
                <p className="text-xs text-slate-500 mt-1">Select your platform and operating zone for AI-accurate premium</p>
              </div>

              {/* Platform */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Delivery Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  {DELIVERY_PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setPlatform(p.id); setError(""); }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        platform === p.id
                          ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                          : "border-slate-800 bg-slate-800/20 hover:border-slate-700"
                      }`}
                    >
                      <span className="text-lg">{p.icon}</span>
                      <p className="text-xs font-medium text-slate-300 mt-1">{p.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Zone */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Operating Zone (Chennai)</label>
                <div className="grid grid-cols-2 gap-2">
                  {CHENNAI_ZONES.map((z) => (
                    <button
                      key={z}
                      onClick={() => handleZoneSelect(z)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        zone === z
                          ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                          : "border-slate-800 bg-slate-800/20 hover:border-slate-700"
                      }`}
                    >
                      <p className="text-xs font-medium text-slate-300">{z}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Premium Preview */}
              {premiumPreview && (
                <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">AI Premium Preview</span>
                    <span className="font-mono text-lg font-bold text-white">₹{Math.round(premiumPreview)}<span className="text-xs text-slate-500 font-normal">/week</span></span>
                  </div>
                  <p className="text-[10px] text-blue-300/70 leading-relaxed">{premiumReasoning}</p>
                  <div className="flex justify-between text-[10px] text-slate-500 pt-1 border-t border-blue-500/10">
                    <span>You pay: <span className="text-blue-400 font-medium">₹35</span></span>
                    <span>Platform pays: <span className="text-slate-400 font-medium">₹{Math.round(premiumPreview) - 35 > 0 ? Math.round(premiumPreview) - 35 : 15}</span></span>
                  </div>
                </div>
              )}

              <button onClick={handleGoToStep3} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2">
                Review Plan <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  Activate Your Protection
                </h2>
                <p className="text-xs text-slate-500 mt-1">Review your plan details and activate with one tap</p>
              </div>

              {/* Summary */}
              <div className="space-y-3">
                <SummaryRow label="Phone" value={`+91 ${phone}`} />
                <SummaryRow label="Platform" value={DELIVERY_PLATFORMS.find(p => p.id === platform)?.label || platform} />
                <SummaryRow label="Zone" value={`${zone}, Chennai`} />
                <SummaryRow label="Weekly Premium" value={`₹${premiumPreview ? Math.round(premiumPreview) : 50}/week`} highlight />
                <SummaryRow label="Your Share" value="₹35/week" />
                <SummaryRow label="Platform Subsidy" value={`₹${(premiumPreview ? Math.round(premiumPreview) : 50) - 35 > 0 ? (premiumPreview ? Math.round(premiumPreview) : 50) - 35 : 15}/week`} />
                <SummaryRow label="Coverage" value="Up to 30% of weekly earnings" />
              </div>

              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                <p className="text-xs text-emerald-400 font-medium">✓ Zero-touch claims — automatic payouts during disruptions</p>
                <p className="text-xs text-emerald-400/70 mt-1">✓ Co-funded protection model for worker stability</p>
              </div>

              <button
                onClick={handleActivate}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Activating...</>
                ) : (
                  <>Activate Protection Plan <ShieldCheck className="h-4 w-4" /></>
                )}
              </button>
            </div>
          )}

          {error && (
            <p className="mt-4 text-xs text-rose-400 font-medium text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 px-1 border-b border-slate-800/50 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-sm font-medium ${highlight ? "text-cyan-400" : "text-slate-200"}`}>{value}</span>
    </div>
  );
}
