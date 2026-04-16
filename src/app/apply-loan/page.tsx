"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/PageHeader";
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
    <div className="min-h-screen bg-slate-50 pb-36">
      <PageHeader title="Apply for Loan" subtitle="Quick & Easy Process" />

      {step === "processing" && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-800 font-semibold text-lg">Processing your application...</p>
          <p className="text-slate-500 text-sm">This will only take a moment</p>
        </div>
      )}

      <div className="px-4 pt-4">
        {/* Loan Type */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-slate-700 mb-2.5 block">Loan Type</label>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {LOAN_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setLoanType(type)}
                className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                  loanType === type
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Slider */}
        <div className="bg-white rounded-3xl p-5 mb-5 card-elevated">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-slate-700">Loan Amount</label>
            <div className="bg-blue-600 text-white px-4 py-1.5 rounded-xl font-bold text-lg">
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
            className="w-full mt-3"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${sliderPercent}%, #E2E8F0 ${sliderPercent}%, #E2E8F0 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
            <span>₹{fmt(MIN_AMOUNT)}</span>
            <span>₹{fmt(MAX_AMOUNT)}</span>
          </div>
        </div>

        {/* Tenure */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-semibold text-slate-700">Tenure</label>
            <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold">{tenure} Months</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {TENURES.map((t) => (
              <button
                key={t}
                onClick={() => setTenure(t)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                  tenure === t
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                }`}
              >
                {t}M
              </button>
            ))}
          </div>
        </div>

        {/* EMI Summary Card */}
        <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 mb-5 card-elevated">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-100 p-1.5 rounded-lg">
              <Info size={16} className="text-blue-600" />
            </div>
            <span className="text-sm font-bold text-slate-700">Loan Summary</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Monthly EMI", value: `₹${fmt(emi)}`, highlight: true },
              { label: "Interest Rate", value: `${rate}% / month` },
              { label: "Processing Fee", value: `₹${fmt(processingFee)}` },
              { label: "Total Interest", value: `₹${fmt(totalInterest)}` },
              { label: "Total Repayment", value: `₹${fmt(totalRepay)}` },
              { label: "Tenure", value: `${tenure} Months` },
            ].map(({ label, value, highlight }) => (
              <div key={label} className={`rounded-2xl p-3 ${highlight ? "bg-blue-50 col-span-2" : "bg-slate-50"}`}>
                <p className="text-slate-500 text-xs font-medium">{label}</p>
                <p className={`font-bold mt-0.5 ${highlight ? "text-blue-700 text-xl" : "text-slate-900 text-sm"}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Purpose */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-slate-700 mb-2.5 block">Loan Purpose</label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 bg-white focus:border-blue-400 focus:shadow-sm focus:shadow-blue-100/50 transition-all"
          >
            <option value="">Select purpose</option>
            {["Home Renovation", "Medical Emergency", "Education", "Travel", "Wedding", "Debt Consolidation", "Business", "Other"].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Eligibility Check */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="bg-emerald-100 p-1.5 rounded-lg shrink-0">
              <CheckCircle size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-emerald-800 font-semibold text-sm">You are pre-approved!</p>
              <p className="text-emerald-700 text-xs mt-0.5">
                Based on your profile, you&apos;re eligible for up to ₹{fmt(user.creditLimit)} at special rates.
              </p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mb-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <div
              onClick={() => setAgree(!agree)}
              className={`w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                agree ? "bg-blue-600 border-blue-600" : "border-slate-300"
              }`}
            >
              {agree && <CheckCircle size={12} className="text-white" />}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              I agree to the{" "}
              <a href="/terms" className="text-blue-600 font-semibold">Terms & Conditions</a>,{" "}
              <a href="/privacy" className="text-blue-600 font-semibold">Privacy Policy</a>, and
              authorize KreditBee to fetch my credit report. I confirm that the information provided is accurate.
            </p>
          </label>
        </div>

        {/* Security */}
        <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
          <Lock size={14} />
          <span>256-bit SSL encrypted. Your data is safe with us.</span>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-slate-200 px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        {step === "review" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-3">
            <p className="text-amber-800 text-xs font-semibold">📋 Please review all details before confirming</p>
            <p className="text-amber-700 text-xs mt-1">Amount: ₹{fmt(amount)} | EMI: ₹{fmt(emi)}/mo | Tenure: {tenure}M</p>
          </div>
        )}
        <button
          onClick={handleApply}
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {step === "form" ? "Check Eligibility & Apply" : "Confirm & Submit Application"}
          {step === "form" ? <ArrowRight size={18} /> : <ArrowRight size={18} />}
        </button>
        {step === "review" && (
          <button 
            onClick={() => setStep("form")} 
            className="w-full text-center text-slate-500 text-sm mt-3 py-1.5 flex items-center justify-center gap-1 hover:text-slate-700"
          >
            <ArrowLeft size={14} /> Edit Details
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
