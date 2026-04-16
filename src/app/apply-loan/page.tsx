"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/PageHeader";
import { CheckCircle, Info, Shield } from "lucide-react";
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

  const rate = 1.8; // monthly %
  const emi = Math.round((amount * rate / 100 * Math.pow(1 + rate / 100, tenure)) / (Math.pow(1 + rate / 100, tenure) - 1));
  const totalRepay = emi * tenure;
  const totalInterest = totalRepay - amount;
  const processingFee = Math.round(amount * 0.02);
  const fmt = (n: number) => n.toLocaleString("en-IN");

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
    <div className="min-h-screen bg-white pb-32">
      <PageHeader title="Apply for Loan" subtitle="Quick & Easy Process" />

      {step === "processing" && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-800 font-semibold text-lg">Processing your application...</p>
          <p className="text-gray-500 text-sm">This will only take a moment</p>
        </div>
      )}

      <div className="px-5 pt-4">
        {/* Loan Type */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Loan Type</label>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {LOAN_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setLoanType(type)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                  loanType === type
                    ? "bg-purple-700 border-purple-700 text-white"
                    : "bg-white border-purple-100 text-gray-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Slider */}
        <div className="bg-purple-50 rounded-3xl p-5 mb-5">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-semibold text-gray-700">Loan Amount</label>
            <div className="bg-purple-700 text-white px-4 py-1.5 rounded-xl font-black text-lg">
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
              background: `linear-gradient(to right, #6B21A8 0%, #6B21A8 ${((amount - MIN_AMOUNT) / (MAX_AMOUNT - MIN_AMOUNT)) * 100}%, #E2D9F3 ${((amount - MIN_AMOUNT) / (MAX_AMOUNT - MIN_AMOUNT)) * 100}%, #E2D9F3 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>₹{fmt(MIN_AMOUNT)}</span>
            <span>₹{fmt(MAX_AMOUNT)}</span>
          </div>
        </div>

        {/* Tenure */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-semibold text-gray-700">Tenure</label>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-bold">{tenure} Months</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {TENURES.map((t) => (
              <button
                key={t}
                onClick={() => setTenure(t)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                  tenure === t
                    ? "bg-purple-700 border-purple-700 text-white"
                    : "bg-white border-purple-100 text-gray-600"
                }`}
              >
                {t}M
              </button>
            ))}
          </div>
        </div>

        {/* EMI Summary Card */}
        <div className="bg-white border-2 border-purple-100 rounded-3xl p-5 mb-5 card-shadow">
          <div className="flex items-center gap-2 mb-4">
            <Info size={16} className="text-purple-500" />
            <span className="text-sm font-bold text-gray-700">Loan Summary</span>
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
              <div key={label} className={`rounded-2xl p-3 ${highlight ? "bg-purple-50 col-span-2" : "bg-gray-50"}`}>
                <p className="text-gray-500 text-xs">{label}</p>
                <p className={`font-bold mt-0.5 ${highlight ? "text-purple-700 text-xl" : "text-gray-900 text-sm"}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Purpose */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Loan Purpose</label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full border-2 border-purple-100 rounded-2xl px-4 py-3.5 text-gray-900 bg-white focus:border-purple-500 transition-all"
          >
            <option value="">Select purpose</option>
            {["Home Renovation", "Medical Emergency", "Education", "Travel", "Wedding", "Debt Consolidation", "Business", "Other"].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Eligibility Check */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5">
          <div className="flex items-start gap-3">
            <CheckCircle size={18} className="text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-green-800 font-semibold text-sm">You are pre-approved!</p>
              <p className="text-green-700 text-xs mt-0.5">
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
              className={`w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center ${
                agree ? "bg-purple-700 border-purple-700" : "border-gray-300"
              }`}
            >
              {agree && <CheckCircle size={12} className="text-white" />}
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              I agree to the{" "}
              <a href="/terms" className="text-purple-600 font-medium">Terms & Conditions</a>,{" "}
              <a href="/privacy" className="text-purple-600 font-medium">Privacy Policy</a>, and
              authorize KreditBee to fetch my credit report. I confirm that the information provided is accurate.
            </p>
          </label>
        </div>

        {/* Security */}
        <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
          <Shield size={14} />
          <span>256-bit SSL encrypted. Your data is safe with us.</span>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-purple-50 px-5 py-4">
        {step === "review" && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 mb-3">
            <p className="text-orange-700 text-xs font-semibold">📋 Please review all details before confirming</p>
            <p className="text-orange-600 text-xs mt-0.5">Amount: ₹{fmt(amount)} | EMI: ₹{fmt(emi)}/mo | Tenure: {tenure}M</p>
          </div>
        )}
        <button
          onClick={handleApply}
          disabled={loading}
          className="w-full gradient-purple text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95 shadow-lg shadow-purple-200"
        >
          {step === "form" ? "Check Eligibility & Apply" : "Confirm & Submit Application"}
        </button>
        {step === "review" && (
          <button onClick={() => setStep("form")} className="w-full text-center text-gray-500 text-sm mt-2 py-1">
            ← Edit Details
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
