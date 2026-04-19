"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle, Info, Shield, ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { Suspense } from "react";

const LOAN_TYPES = ["Personal Loan", "Salary Advance", "Education Loan", "Medical Loan", "Home Renovation", "Travel Loan"];
const TENURES = [3, 6, 9, 12, 18, 24, 36];

function ApplyLoanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, applyLoan } = useAuth();

  const defaultType = searchParams.get("type") || "Personal Loan";
  const [loanType, setLoanType] = useState(defaultType);
  const [amount, setAmount] = useState(50000);
  const [tenure, setTenure] = useState(12);
  const [purpose, setPurpose] = useState("");
  const [agree, setAgree] = useState(false);
  const [step, setStep] = useState<"form" | "review" | "processing">("form");
  const [loading, setLoading] = useState(false);

  const MIN_AMOUNT = 5000;
  const MAX_AMOUNT = 400000;

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  const rate = 1.8;
  const emi = Math.round((amount * rate / 100 * Math.pow(1 + rate / 100, tenure)) / (Math.pow(1 + rate / 100, tenure) - 1));
  const totalRepay = emi * tenure;
  const totalInterest = totalRepay - amount;
  const processingFee = Math.round(amount * 0.02);
  const fmt = (n: number) => n.toLocaleString("en-IN");
  const sliderPercent = ((amount - MIN_AMOUNT) / (MAX_AMOUNT - MIN_AMOUNT)) * 100;

  const handleApply = async () => {
    if (step === "form") {
      if (!purpose) { alert("Please select a loan purpose"); return; }
      if (!agree) { alert("Please agree to Terms & Conditions"); return; }
      setStep("review");
      return;
    }
    if (step === "review") {
      setStep("processing");
      setLoading(true);
      await new Promise((r) => setTimeout(r, 2500));
      applyLoan(amount, tenure, loanType);
      router.replace("/loan-success");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-40">
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 px-4 pt-6 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div>
            <h1 className="text-white text-xl font-bold">Apply for Loan</h1>
            <p className="text-indigo-200 text-xs">Quick & Easy Process</p>
          </div>
        </div>
      </div>

      {step === "processing" && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-800 font-semibold text-lg">Processing your application...</p>
          <p className="text-slate-500 text-sm">This will only take a moment</p>
        </div>
      )}

      <div className="px-4 -mt-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="text-sm font-medium text-slate-600 mb-2.5 block">Loan Type</label>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {LOAN_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setLoanType(type)}
                className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium border-2 transition-all ${
                  loanType === type
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-slate-600">Loan Amount</label>
            <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg font-bold text-base">
              ₹{fmt(amount)}
            </div>
          </div>
          <input
            type="range"
            min={MIN_AMOUNT}
            max={MAX_AMOUNT}
            step={5000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full"
            style={{
              background: `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${sliderPercent}%, #E2E8F0 ${sliderPercent}%, #E2E8F0 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>₹{fmt(MIN_AMOUNT)}</span>
            <span>₹{fmt(MAX_AMOUNT)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-slate-600">Tenure</label>
            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-semibold">{tenure} Months</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {TENURES.map((t) => (
              <button
                key={t}
                onClick={() => setTenure(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                  tenure === t
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                {t}M
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Info size={16} />
            <span className="text-sm font-medium">Loan Summary</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-indigo-200 text-xs">Monthly EMI</p>
              <p className="font-bold text-lg mt-0.5">₹{fmt(emi)}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-indigo-200 text-xs">Interest Rate</p>
              <p className="font-bold text-lg mt-0.5">{rate}%/mo</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-indigo-200 text-xs">Processing Fee</p>
              <p className="font-bold text-lg mt-0.5">₹{fmt(processingFee)}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-indigo-200 text-xs">Total Repayment</p>
              <p className="font-bold text-lg mt-0.5">₹{fmt(totalRepay)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="text-sm font-medium text-slate-600 mb-2.5 block">Loan Purpose</label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-700 bg-white text-sm"
          >
            <option value="">Select purpose</option>
            {["Home Renovation", "Medical Emergency", "Education", "Travel", "Wedding", "Debt Consolidation", "Business", "Other"].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
          <div className="flex items-start gap-2.5">
            <div className="bg-emerald-100 p-1 rounded-md shrink-0 mt-0.5">
              <CheckCircle size={14} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-emerald-800 font-semibold text-sm">You are pre-approved!</p>
              <p className="text-emerald-700 text-xs mt-0.5">
                Eligible for up to ₹{fmt(user.creditLimit)} at special rates.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <div
              onClick={() => setAgree(!agree)}
              className={`w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                agree ? "bg-indigo-600 border-indigo-600" : "border-slate-300"
              }`}
            >
              {agree && <CheckCircle size={12} className="text-white" />}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              I agree to the Terms & Conditions, Privacy Policy, and authorize KreditBee to fetch my credit report.
            </p>
          </label>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <Lock size={12} />
          <span>256-bit SSL encrypted</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-slate-200 px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        {step === "review" && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-3">
            <p className="text-amber-800 text-xs font-medium">Review: ₹{fmt(amount)} | EMI: ₹{fmt(emi)}/mo | {tenure}M</p>
          </div>
        )}
        <button
          onClick={handleApply}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-500/25"
        >
          {step === "form" ? "Check Eligibility & Apply" : "Confirm & Submit"}
          <ArrowRight size={18} />
        </button>
        {step === "review" && (
          <button 
            onClick={() => setStep("form")} 
            className="w-full text-center text-slate-500 text-xs mt-2.5 py-1.5 hover:text-slate-700"
          >
            <ArrowLeft size={12} className="inline mr-1" /> Edit Details
          </button>
        )}
      </div>
    </div>
  );
}

export default function ApplyLoanPage() {
  return (
    <Suspense>
      <ApplyLoanContent />
    </Suspense>
  );
}