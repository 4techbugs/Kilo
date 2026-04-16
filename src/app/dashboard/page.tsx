"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import BottomNav from "@/components/BottomNav";
import {
  Bell, ChevronRight, Zap, TrendingUp, CreditCard,
  Calculator, FileText, Headphones, Gift, Star
} from "lucide-react";

const QUICK_ACTIONS = [
  { icon: Zap, label: "Apply\nLoan", href: "/apply-loan", color: "bg-purple-100 text-purple-700" },
  { icon: CreditCard, label: "My\nLoans", href: "/my-loans", color: "bg-blue-100 text-blue-700" },
  { icon: Calculator, label: "EMI\nCalc", href: "/calculator", color: "bg-green-100 text-green-700" },
  { icon: TrendingUp, label: "Credit\nScore", href: "/profile", color: "bg-orange-100 text-orange-700" },
  { icon: FileText, label: "Documents", href: "/kyc", color: "bg-pink-100 text-pink-700" },
  { icon: Headphones, label: "Support", href: "/faq", color: "bg-teal-100 text-teal-700" },
  { icon: Gift, label: "Offers", href: "/apply-loan", color: "bg-red-100 text-red-700" },
  { icon: Star, label: "Refer &\nEarn", href: "#", color: "bg-yellow-100 text-yellow-700" },
];

const LOAN_TYPES = [
  { label: "Personal Loan", desc: "Up to ₹4 Lakh", rate: "Starting 1.5%/mo", icon: "💼", color: "from-purple-500 to-purple-700" },
  { label: "Salary Advance", desc: "Up to ₹25,000", rate: "0 interest first draw", icon: "💰", color: "from-green-500 to-green-700" },
  { label: "Education Loan", desc: "Up to ₹2 Lakh", rate: "Starting 1.2%/mo", icon: "🎓", color: "from-blue-500 to-blue-700" },
  { label: "Medical Loan", desc: "Up to ₹1 Lakh", rate: "Emergency disbursal", icon: "🏥", color: "from-red-500 to-red-700" },
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

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Top Header */}
      <div className="gradient-purple px-5 pt-12 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-10 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />

        <div className="flex items-center justify-between mb-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center">
              <span className="text-lg font-black text-purple-700">KB</span>
            </div>
            <div>
              <p className="text-purple-200 text-xs font-medium">{greeting()},</p>
              <p className="text-white text-base font-bold leading-tight">
                {user.name || `+91 ${user.mobile}`}
              </p>
            </div>
          </div>
          <Link href="/notifications" className="relative p-2">
            <Bell size={22} className="text-white" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>

        {/* Credit card style */}
        <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-3xl p-5 relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-purple-200 text-xs font-medium">Available Credit Limit</p>
              <p className="text-white text-3xl font-black mt-1">
                ₹{fmt(user.creditLimit - totalOutstanding)}
              </p>
              <p className="text-purple-200 text-xs mt-0.5">of ₹{fmt(user.creditLimit)} total</p>
            </div>
            <div className="bg-white/20 rounded-2xl px-3 py-1.5">
              <p className="text-white text-xs font-semibold">Credit Score</p>
              <p className="text-white text-xl font-black text-right">{user.creditScore}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="bg-white/20 rounded-full h-2">
              <div
                className="bg-green-400 h-2 rounded-full transition-all"
                style={{ width: `${Math.max(5, ((user.creditLimit - totalOutstanding) / user.creditLimit) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-purple-200 text-xs">Outstanding</p>
              <p className="text-white text-sm font-bold">₹{fmt(totalOutstanding)}</p>
            </div>
            <Link
              href="/apply-loan"
              className="bg-white text-purple-700 font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-1 active:scale-95"
            >
              Apply Now <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Complete KYC Banner */}
      {!user.kycComplete && (
        <div className="mx-4 -mt-4 bg-yellow-50 border border-yellow-300 rounded-2xl p-4 flex items-center gap-3 z-10 relative shadow-sm">
          <div className="text-2xl">⚠️</div>
          <div className="flex-1">
            <p className="text-yellow-800 font-semibold text-sm">Complete Your KYC</p>
            <p className="text-yellow-700 text-xs mt-0.5">Verify your identity to unlock full loan access</p>
          </div>
          <Link href="/kyc" className="bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shrink-0">
            Complete
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="px-4 mt-5">
        <h3 className="text-gray-800 font-bold text-base mb-3">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ icon: Icon, label, href, color }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-1.5 bg-white rounded-2xl py-3 px-1 card-shadow active:scale-95"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
              <span className="text-[10px] font-medium text-gray-600 text-center whitespace-pre-line leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Active Loans */}
      {activeLoans.length > 0 && (
        <div className="px-4 mt-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-gray-800 font-bold text-base">Active Loans</h3>
            <Link href="/my-loans" className="text-purple-600 text-xs font-semibold flex items-center gap-0.5">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          {activeLoans.slice(0, 2).map((loan) => (
            <div key={loan.id} className="bg-white rounded-2xl p-4 mb-3 card-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-gray-500 text-xs font-medium">{loan.loanType}</p>
                  <p className="text-gray-900 text-lg font-black">₹{fmt(loan.amount)}</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">Active</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-gray-50 rounded-xl p-2 text-center">
                  <p className="text-gray-500 text-[10px]">Monthly EMI</p>
                  <p className="text-gray-900 font-bold text-sm">₹{fmt(loan.emi)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2 text-center">
                  <p className="text-gray-500 text-[10px]">Tenure</p>
                  <p className="text-gray-900 font-bold text-sm">{loan.tenure}M</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2 text-center">
                  <p className="text-gray-500 text-[10px]">Due Date</p>
                  <p className="text-gray-900 font-bold text-xs">{loan.nextDueDate}</p>
                </div>
              </div>
              {/* Progress */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Paid: ₹{fmt(loan.totalPaid)}</span>
                  <span>Outstanding: ₹{fmt(loan.outstandingAmount)}</span>
                </div>
                <div className="bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full"
                    style={{ width: `${Math.max(2, (loan.totalPaid / loan.amount) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loan Products */}
      <div className="px-4 mt-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-gray-800 font-bold text-base">Loan Products</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {LOAN_TYPES.map(({ label, desc, rate, icon, color }) => (
            <Link
              key={label}
              href={`/apply-loan?type=${encodeURIComponent(label)}`}
              className={`shrink-0 w-36 bg-gradient-to-br ${color} rounded-2xl p-4 text-white`}
            >
              <div className="text-3xl mb-3">{icon}</div>
              <p className="font-bold text-sm leading-tight">{label}</p>
              <p className="text-white/80 text-xs mt-1">{desc}</p>
              <div className="bg-white/20 rounded-lg px-2 py-1 mt-2 inline-block">
                <p className="text-white text-[10px] font-semibold">{rate}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Special Offer Banner */}
      <div className="px-4 mt-5">
        <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl p-4 flex items-center gap-4">
          <div className="text-4xl">🎁</div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Refer & Earn ₹500!</p>
            <p className="text-white/80 text-xs mt-0.5">Invite friends and earn cashback on their first loan</p>
          </div>
          <ChevronRight size={20} className="text-white" />
        </div>
      </div>

      {/* Marquee */}
      <div className="mx-4 mt-4 bg-purple-50 border border-purple-100 rounded-2xl px-4 py-2.5 overflow-hidden">
        <p className="text-purple-700 text-xs font-medium">
          🔔 Special offer: Get personal loan at 0% interest for first 3 months! Apply before April 30, 2026. T&C apply.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
