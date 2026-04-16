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
  { icon: Zap, label: "Apply Loan", href: "/apply-loan", color: "bg-blue-50 text-blue-600", iconBg: "bg-blue-100" },
  { icon: CreditCard, label: "My Loans", href: "/my-loans", color: "bg-slate-50 text-slate-600", iconBg: "bg-slate-100" },
  { icon: Calculator, label: "EMI Calc", href: "/calculator", color: "bg-emerald-50 text-emerald-600", iconBg: "bg-emerald-100" },
  { icon: TrendingUp, label: "Credit Score", href: "/profile", color: "bg-orange-50 text-orange-600", iconBg: "bg-orange-100" },
  { icon: FileText, label: "Documents", href: "/kyc", color: "bg-rose-50 text-rose-600", iconBg: "bg-rose-100" },
  { icon: Headphones, label: "Support", href: "/faq", color: "bg-cyan-50 text-cyan-600", iconBg: "bg-cyan-100" },
  { icon: Gift, label: "Offers", href: "/apply-loan", color: "bg-violet-50 text-violet-600", iconBg: "bg-violet-100" },
  { icon: Star, label: "Refer & Earn", href: "#", color: "bg-amber-50 text-amber-600", iconBg: "bg-amber-100" },
];

const LOAN_TYPES = [
  { label: "Personal Loan", desc: "Up to ₹4 Lakh", rate: "Starting 1.5%/mo", icon: "💼", gradient: "from-slate-600 to-slate-800" },
  { label: "Salary Advance", desc: "Up to ₹25,000", rate: "0 interest", icon: "💰", gradient: "from-emerald-500 to-emerald-700" },
  { label: "Education Loan", desc: "Up to ₹2 Lakh", rate: "Starting 1.2%/mo", icon: "🎓", gradient: "from-blue-500 to-blue-700" },
  { label: "Medical Loan", desc: "Up to ₹1 Lakh", rate: "Emergency", icon: "🏥", gradient: "from-rose-500 to-rose-700" },
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
    <div className="min-h-screen bg-slate-100 pb-24">
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 px-4 pt-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
              <span className="text-base font-black text-white">KB</span>
            </div>
            <div>
              <p className="text-blue-200 text-xs font-medium">{greeting()},</p>
              <p className="text-white text-base font-semibold">
                {user.name || `+91 ${user.mobile}`}
              </p>
            </div>
          </div>
          <Link href="/notifications" className="relative p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
            <Bell size={20} className="text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-200 text-xs font-medium">Available Credit</p>
              <p className="text-white text-2xl font-bold mt-1 tracking-tight">
                ₹{fmt(user.creditLimit - totalOutstanding)}
              </p>
              <p className="text-blue-200/70 text-xs mt-1">of ₹{fmt(user.creditLimit)}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2">
              <p className="text-white/70 text-[10px] font-medium">CIBIL</p>
              <p className="text-white text-xl font-bold text-right leading-none">{user.creditScore}</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="bg-white/15 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full"
                style={{ width: `${creditUsedPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <p className="text-blue-200/70 text-[10px]">{creditUsedPercent.toFixed(0)}% used</p>
              <p className="text-blue-200/70 text-[10px]">{creditAvailablePercent.toFixed(0)}% free</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-200/70 text-xs">Outstanding</p>
              <p className="text-white text-sm font-semibold">₹{fmt(totalOutstanding)}</p>
            </div>
            <Link
              href="/apply-loan"
              className="bg-white text-blue-700 font-semibold text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-blue-50"
            >
              Apply Now <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="-mt-8 px-4">
        {!user.kycComplete && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3">
            <div className="text-xl">⚡</div>
            <div className="flex-1">
              <p className="text-amber-800 font-semibold text-sm">Complete KYC</p>
              <p className="text-amber-700 text-xs">Verify to unlock full access</p>
            </div>
            <Link href="/kyc" className="bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-lg">
              Verify
            </Link>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-slate-800 font-bold text-base">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {QUICK_ACTIONS.map(({ icon: Icon, label, href, iconBg }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 bg-white rounded-xl py-3 shadow-sm"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
                <Icon size={16} />
              </div>
              <span className="text-[10px] font-medium text-slate-600 text-center">{label}</span>
            </Link>
          ))}
        </div>

        {activeLoans.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-slate-800 font-bold text-base">Active Loans</h3>
              <Link href="/my-loans" className="text-blue-600 text-xs font-semibold flex items-center gap-0.5">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            {activeLoans.slice(0, 2).map((loan) => (
              <div key={loan.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-slate-500 text-xs font-medium">{loan.loanType}</p>
                    <p className="text-slate-900 text-xl font-bold mt-0.5">₹{fmt(loan.amount)}</p>
                  </div>
                  <span className="badge badge-success">Active</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                    <p className="text-slate-400 text-[10px] font-medium">EMI</p>
                    <p className="text-slate-900 font-bold text-sm mt-0.5">₹{fmt(loan.emi)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                    <p className="text-slate-400 text-[10px] font-medium">Tenure</p>
                    <p className="text-slate-900 font-bold text-sm mt-0.5">{loan.tenure}M</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                    <p className="text-slate-400 text-[10px] font-medium">Due</p>
                    <p className="text-slate-900 font-bold text-xs mt-0.5">{loan.nextDueDate}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span className="font-medium">Paid: ₹{fmt(loan.totalPaid)}</span>
                    <span className="font-medium">₹{fmt(loan.outstandingAmount)} left</span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${Math.max(2, (loan.totalPaid / loan.amount) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-slate-800 font-bold text-base mb-3">Explore Loans</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {LOAN_TYPES.map(({ label, desc, rate, icon, gradient }) => (
              <Link
                key={label}
                href={`/apply-loan?type=${encodeURIComponent(label)}`}
                className={`shrink-0 w-36 bg-gradient-to-br ${gradient} rounded-xl p-4 text-white`}
              >
                <div className="text-2.5xl mb-2">{icon}</div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-white/70 text-xs mt-1">{desc}</p>
                <div className="bg-white/20 rounded-md px-2 py-1 mt-3 inline-block">
                  <p className="text-white text-[10px] font-semibold">{rate}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 flex items-center gap-3 mb-4">
          <div className="text-3xl">🎁</div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Refer & Earn ₹500!</p>
            <p className="text-white/80 text-xs mt-0.5">Invite friends, earn cashback</p>
          </div>
          <div className="bg-white/20 p-2 rounded-lg">
            <ChevronRight size={18} className="text-white" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 mb-4">
          <p className="text-blue-700 text-xs font-medium">
            📢 Special: 0% interest for first 3 months! Apply before Apr 30. T&C apply.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}