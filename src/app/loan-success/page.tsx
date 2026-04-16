"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle, Home, CreditCard } from "lucide-react";

export default function LoanSuccessPage() {
  const router = useRouter();
  const { loans, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  const latestLoan = loans[0];
  const fmt = (n: number) => n.toLocaleString("en-IN");

  if (!latestLoan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5 pb-10 pt-16">
      {/* Success Animation */}
      <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mb-6 fade-in">
        <CheckCircle size={64} className="text-green-500" strokeWidth={1.5} />
      </div>

      <h1 className="text-2xl font-black text-gray-900 text-center mb-2">Application Submitted!</h1>
      <p className="text-gray-500 text-center text-sm mb-8 max-w-xs leading-relaxed">
        Your loan application has been received and is under review. You&apos;ll receive the funds within 2-4 hours.
      </p>

      {/* Loan Details Card */}
      <div className="w-full bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-5 text-white mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-purple-200 text-xs">Loan Amount</p>
            <p className="text-3xl font-black mt-1">₹{fmt(latestLoan.amount)}</p>
          </div>
          <div className="bg-green-400 text-white text-xs font-bold px-3 py-1 rounded-full">
            Approved ✓
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Monthly EMI", value: `₹${fmt(latestLoan.emi)}` },
            { label: "Tenure", value: `${latestLoan.tenure} Months` },
            { label: "Loan ID", value: latestLoan.id },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/10 rounded-xl p-2.5">
              <p className="text-purple-200 text-[10px]">{label}</p>
              <p className="text-white font-bold text-xs mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="w-full mb-6">
        <h3 className="text-gray-800 font-bold text-sm mb-3">What&apos;s Next?</h3>
        <div className="space-y-3">
          {[
            { step: "1", label: "Application Received", desc: "We've received your application", done: true },
            { step: "2", label: "Document Verification", desc: "KYC and documents being verified", done: true },
            { step: "3", label: "Credit Assessment", desc: "Your credit profile is being assessed", active: true },
            { step: "4", label: "Fund Disbursal", desc: "Money transferred to your account", done: false },
          ].map(({ step, label, desc, done, active }) => (
            <div key={step} className="flex gap-3 items-start">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                done ? "bg-green-500 text-white" : active ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-400"
              }`}>
                {done ? "✓" : step}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${done || active ? "text-gray-900" : "text-gray-400"}`}>{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="w-full space-y-3">
        <Link
          href="/my-loans"
          className="w-full gradient-purple text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95"
        >
          <CreditCard size={18} />
          Track Your Loan
        </Link>
        <Link
          href="/dashboard"
          className="w-full bg-purple-50 text-purple-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
