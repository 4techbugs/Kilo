"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Phone, ArrowRight, ShieldCheck, ChevronLeft, RefreshCw, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Step = "mobile" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const startOtpTimer = () => {
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return interval;
  };

  const handleMobileSubmit = async () => {
    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      setMobileError("Enter a valid 10-digit mobile number");
      return;
    }
    setMobileError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setTimer(30);
    setCanResend(false);
    setStep("otp");
    startOtpTimer();
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      otpRefs.current[nextIndex]?.focus();
      return;
    }
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setOtpError("Enter the 6-digit OTP");
      return;
    }
    setOtpError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    login(mobile);
    router.replace("/dashboard");
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setTimer(30);
    setCanResend(false);
    startOtpTimer();
    otpRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="gradient-hero px-5 pt-10 pb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/3" />
        <div className="absolute top-16 right-10 w-16 h-16 bg-white/5 rounded-full" />

        {step === "otp" && (
          <button
            onClick={() => { setStep("mobile"); setOtp(["", "", "", "", "", ""]); }}
            className="mb-4 flex items-center gap-1 text-blue-200 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
        )}

        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
            <span className="text-xl font-black text-white">KB</span>
          </div>
          <span className="text-white text-xl font-bold">KreditBee</span>
        </div>
        <h2 className="text-white text-2xl font-semibold mt-5">
          {step === "mobile" ? "Welcome Back!" : "Verify OTP"}
        </h2>
        <p className="text-blue-200 text-sm mt-1.5">
          {step === "mobile"
            ? "Enter your mobile number to continue"
            : `OTP sent to +91 ${mobile}`}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-[24px] -mt-4 px-5 pt-8 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {step === "mobile" ? (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2.5 block">
                Mobile Number
              </label>
              <div className="flex items-center gap-3 border-2 border-slate-200 rounded-2xl px-4 py-4 focus-within:border-blue-400 focus-within:shadow-sm focus-within:shadow-blue-100/50 transition-all bg-white">
                <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
                  <span className="text-lg">🇮🇳</span>
                  <span className="text-slate-600 font-medium text-sm">+91</span>
                </div>
                <Phone size={18} className="text-slate-400" />
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                    setMobileError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleMobileSubmit()}
                  placeholder="Enter 10-digit number"
                  className="flex-1 bg-transparent text-slate-900 text-base font-medium placeholder:text-slate-300 outline-none"
                />
              </div>
              {mobileError && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1.5">
                  <span className="text-xs">⚠</span> {mobileError}
                </p>
              )}
            </div>

            <button
              onClick={handleMobileSubmit}
              disabled={loading || mobile.length !== 10}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex gap-1.5">
                  <span className="w-2 h-2 bg-white rounded-full loading-dot" />
                  <span className="w-2 h-2 bg-white rounded-full loading-dot" />
                  <span className="w-2 h-2 bg-white rounded-full loading-dot" />
                </span>
              ) : (
                <>
                  Get OTP <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Security note */}
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3.5">
              <div className="bg-emerald-100 p-2 rounded-xl">
                <ShieldCheck size={18} className="text-emerald-600" />
              </div>
              <p className="text-emerald-700 text-xs leading-relaxed">
                Your data is 100% secure. We use 256-bit SSL encryption to protect your information.
              </p>
            </div>

            <p className="text-center text-xs text-slate-500 leading-relaxed">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 font-semibold">Terms of Service</Link>{" "}
              &{" "}
              <Link href="/privacy" className="text-blue-600 font-semibold">Privacy Policy</Link>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-4 block">
                Enter 6-digit OTP
              </label>
              <div className="flex gap-2 justify-between">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="tel"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="otp-input"
                  />
                ))}
              </div>
              {otpError && (
                <p className="text-red-500 text-xs mt-3 flex items-center gap-1.5">
                  <span className="text-xs">⚠</span> {otpError}
                </p>
              )}
            </div>

            {/* Resend */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">
                {canResend ? "Didn't receive OTP?" : `Resend in ${timer}s`}
              </span>
              <button
                onClick={handleResend}
                disabled={!canResend}
                className={`flex items-center gap-1.5 font-semibold transition-colors ${
                  canResend ? "text-blue-600 hover:text-blue-700" : "text-slate-300 cursor-not-allowed"
                }`}
              >
                <RefreshCw size={14} />
                Resend OTP
              </button>
            </div>

            <button
              onClick={handleOtpVerify}
              disabled={loading || otp.join("").length !== 6}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex gap-1.5">
                  <span className="w-2 h-2 bg-white rounded-full loading-dot" />
                  <span className="w-2 h-2 bg-white rounded-full loading-dot" />
                  <span className="w-2 h-2 bg-white rounded-full loading-dot" />
                </span>
              ) : (
                <>
                  Verify & Continue <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-slate-400">
              <Lock size={14} />
              <p className="text-xs">Demo: Enter any 6-digit OTP to proceed</p>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { icon: "⚡", label: "Instant\nApproval", bg: "bg-blue-50" },
            { icon: "💰", label: "Up to ₹4\nLakh", bg: "bg-emerald-50" },
            { icon: "📱", label: "100%\nDigital", bg: "bg-violet-50" },
          ].map(({ icon, label, bg }) => (
            <div key={label} className={`text-center ${bg} rounded-2xl p-4`}>
              <div className="text-2xl mb-1.5">{icon}</div>
              <p className="text-xs text-slate-600 font-medium whitespace-pre-line">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
