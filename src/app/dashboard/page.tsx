"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import BottomNav from "@/components/BottomNav";
import {
  Bell, ChevronRight, Zap, TrendingUp, CreditCard,
  Calculator, FileText, Headphones, Gift, Star, Wallet, ArrowUpRight
} from "lucide-react";

const QUICK_ACTIONS = [
  { icon: Zap, label: "Apply\nLoan", href: "/apply-loan", color: "bg-blue-50 text-blue-600", iconBg: "bg-blue-100" },
  { icon: CreditCard, label: "My\nLoans", href: "/my-loans", color: "bg-slate-50 text-slate-600", iconBg: "bg-slate-100" },
  { icon: Calculator, label: "EMI\nCalc", href: "/calculator", color: "bg-emerald-50 text-emerald-600", iconBg: "bg-emerald-100" },
  { icon: TrendingUp, label: "Credit\nScore", href: "/profile", color: "bg-orange-50 text-orange-600", iconBg: "bg-orange-100" },
  { icon: FileText, label: "Documents", href: "/kyc", color: "bg-rose-50 text-rose-600", iconBg: "bg-rose-100" },
  { icon: Headphones, label: "Support", href: "/faq", color: "bg-cyan-50 text-cyan-600", iconBg: "bg-cyan-100" },
  { icon: Gift, label: "Offers", href: "/apply-loan", color: "bg-violet-50 text-violet-600", iconBg: "bg-violet-100" },
  { icon: Star, label: "Refer &\nEarn", href: "#", color: "bg-amber-50 text-amber-600", iconBg: "bg-amber-100" },
];

const LOAN_TYPES = [
  { label: "Personal Loan", desc: "Up to ₹4 Lakh", rate: "Starting 1.5%/mo", icon: "💼", gradient: "from-slate-600 to-slate-800" },
  { label: "Salary Advance", desc: "Up to ₹25,000", rate: "0 interest first draw", icon: "💰", gradient: "from-emerald-500 to-emerald-700" },
  { label: "Education Loan", desc: "Up to ₹2 Lakh", rate: "Starting 1.2%/mo", icon: "🎓", gradient: "from-blue-500 to-blue-700" },
  { label: "Medical Loan", desc: "Up to ₹1 Lakh", rate: "Emergency disbursal", icon: "🏥", gradient: "from-rose-500 to-rose-700" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loans, unreadCount } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const activeLoans = loans.filter((l) => l.status === "active");
  const totalOutstanding = activeLoans.reduce((s, l) => s + l.outstandingAmount, 0);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const fmt = (n: number) => n.toLocaleString("en-IN");
  const creditUsedPercent = user.creditLimit > 0 ? Math.max(5, ((totalOutstanding / user.creditLimit) * 100)) : 5;
  const creditAvailablePercent = 100 - creditUsedPercent;

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Hero Header */}
      <div className="gradient-hero px-5 pt-10 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/3" />
        <div className="absolute top-20 right-8 w-20 h-20 bg-white/5 rounded-full" />

        <div className="flex items-center justify-between mb-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <span className="text-lg font-black text-white">KB</span>
            </div>
            <div>
              <p className="text-blue-200 text-xs font-medium">{greeting()},</p>
              <p className="text-white text-base font-semibold leading-tight">
                {user.name || `+91 ${user.mobile}`}
              </p>
            </div>
          </div>
          <Link href="/notifications" className="relative p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <Bell size={20} className="text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>

        {/* Credit Card */}
        <div className="relative">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="text-blue-200 text-xs font-medium">Available Credit Limit</p>
                <p className="text-white text-3xl font-bold mt-1 tracking-tight">
                  ₹{fmt(user.creditLimit - totalOutstanding)}
                </p>
                <p className="text-blue-200/80 text-xs mt-1">of ₹{fmt(user.creditLimit)} total limit</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
                <p className="text-white/80 text-[10px] font-medium">Credit Score</p>
                <p className="text-white text-2xl font-bold text-right leading-none">{user.creditScore}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${creditUsedPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <p className="text-blue-200/80 text-[10px]">{creditUsedPercent.toFixed(0)}% used</p>
                <p className="text-blue-200/80 text-[10px]">{creditAvailablePercent.toFixed(0)}% available</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-200/80 text-xs">Outstanding</p>
                <p className="text-white text-sm font-semibold">₹{fmt(totalOutstanding)}</p>
              </div>
              <Link
                href="/apply-loan"
                className="bg-white text-blue-700 font-semibold text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:scale-105 active:scale-95"
              >
                Apply Now <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Banner */}
      {!user.kycComplete && (
        <div className="mx-4 -mt-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="text-2xl">⚡</div>
          <div className="flex-1">
            <p className="text-amber-800 font-semibold text-sm">Complete Your KYC</p>
            <p className="text-amber-700 text-xs mt-0.5">Verify your identity to unlock full loan access</p>
          </div>
          <Link href="/kyc" className="bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-xl shrink-0">
            Verify
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-800 font-bold text-base">Quick Actions</h3>
          <ChevronRight size={18} className="text-slate-400" />
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {QUICK_ACTIONS.map(({ icon: Icon, label, href, color, iconBg }, idx) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 bg-white rounded-2xl py-3 px-1 card-elevated hover:-translate-y-0.5"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
                <Icon size={18} />
              </div>
              <span className="text-[10px] font-medium text-slate-600 text-center whitespace-pre-line leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Active Loans */}
      {activeLoans.length > 0 && (
        <div className="px-4 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-slate-800 font-bold text-base">Active Loans</h3>
            <Link href="/my-loans" className="text-blue-600 text-xs font-semibold flex items-center gap-0.5">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          {activeLoans.slice(0, 2).map((loan, idx) => (
            <div key={loan.id} className="bg-white rounded-2xl p-4 mb-3 card-elevated slide-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-500 text-xs font-medium">{loan.loanType}</p>
                  <p className="text-slate-900 text-xl font-bold mt-0.5">₹{fmt(loan.amount)}</p>
                </div>
                <span className="badge badge-success">Active</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-slate-400 text-[10px] font-medium">Monthly EMI</p>
                  <p className="text-slate-900 font-bold text-sm mt-1">₹{fmt(loan.emi)}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-slate-400 text-[10px] font-medium">Tenure</p>
                  <p className="text-slate-900 font-bold text-sm mt-1">{loan.tenure}M</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-slate-400 text-[10px] font-medium">Due Date</p>
                  <p className="text-slate-900 font-bold text-xs mt-1">{loan.nextDueDate}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span className="font-medium">Paid: ₹{fmt(loan.totalPaid)}</span>
                  <span className="font-medium">Outstanding: ₹{fmt(loan.outstandingAmount)}</span>
                </div>
                <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.max(2, (loan.totalPaid / loan.amount) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loan Products */}
      <div className="px-4 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-slate-800 font-bold text-base">Explore Loans</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {LOAN_TYPES.map(({ label, desc, rate, icon, gradient }, idx) => (
            <Link
              key={label}
              href={`/apply-loan?type=${encodeURIComponent(label)}`}
              className={`shrink-0 w-40 bg-gradient-to-br ${gradient} rounded-2xl p-4 text-white slide-in-up`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="text-3xl mb-3">{icon}</div>
              <p className="font-semibold text-sm leading-tight">{label}</p>
              <p className="text-white/80 text-xs mt-1.5">{desc}</p>
              <div className="bg-white/20 rounded-lg px-2 py-1 mt-3 inline-block">
                <p className="text-white text-[10px] font-semibold">{rate}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Special Offer */}
      <div className="px-4 mt-6">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-amber-500/25">
          <div className="text-4xl">🎁</div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Refer & Earn ₹500!</p>
            <p className="text-white/80 text-xs mt-1">Invite friends and earn cashback on their first loan</p>
          </div>
          <div className="bg-white/20 p-2 rounded-xl">
            <ChevronRight size={20} className="text-white" />
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="mx-4 mt-4 mb-6 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
        <p className="text-blue-700 text-xs font-medium">
          📢 Special offer: Get personal loan at 0% interest for first 3 months! Apply before April 30, 2026. T&C apply.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
