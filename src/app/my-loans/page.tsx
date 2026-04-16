"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, Loan } from "@/context/AuthContext";
import PageHeader from "@/components/PageHeader";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600",
  overdue: "bg-red-100 text-red-700",
};

const STATUS_LABELS = {
  active: "Active",
  closed: "Closed",
  overdue: "Overdue",
};

export default function MyLoansPage() {
  const router = useRouter();
  const { loans, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"active" | "closed">("active");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  const fmt = (n: number) => n.toLocaleString("en-IN");

  const filtered = loans.filter((l) =>
    activeTab === "active" ? l.status === "active" || l.status === "overdue" : l.status === "closed"
  );

  const LoanCard = ({ loan }: { loan: Loan }) => (
    <div className="bg-white rounded-2xl p-4 mb-3 card-shadow border border-gray-50">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-gray-500 text-xs">{loan.loanType}</p>
          <p className="text-gray-900 text-xl font-black">₹{fmt(loan.amount)}</p>
          <p className="text-gray-400 text-xs mt-0.5">ID: {loan.id}</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[loan.status]}`}>
          {STATUS_LABELS[loan.status]}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "EMI", value: `₹${fmt(loan.emi)}` },
          { label: "Tenure", value: `${loan.tenure}M` },
          { label: "Rate", value: `${loan.interestRate}%/mo` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-2 text-center">
            <p className="text-gray-400 text-[10px]">{label}</p>
            <p className="text-gray-800 font-bold text-sm">{value}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Repaid: ₹{fmt(loan.totalPaid)}</span>
          <span>Balance: ₹{fmt(loan.outstandingAmount)}</span>
        </div>
        <div className="bg-gray-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${loan.status === "overdue" ? "bg-red-500" : "bg-purple-500"}`}
            style={{ width: `${Math.max(2, (loan.totalPaid / loan.amount) * 100)}%` }}
          />
        </div>
        <p className="text-gray-400 text-xs mt-1">
          {Math.round((loan.totalPaid / loan.amount) * 100)}% repaid
        </p>
      </div>

      {loan.status === "active" && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 mb-3">
          <p className="text-orange-700 text-xs font-medium">Next EMI due: {loan.nextDueDate}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button className="flex-1 bg-purple-50 text-purple-700 font-semibold text-sm py-2.5 rounded-xl">
          View Details
        </button>
        {loan.status === "active" && (
          <button className="flex-1 gradient-purple text-white font-semibold text-sm py-2.5 rounded-xl">
            Pay EMI
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader title="My Loans" showBack={false} />

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-100 px-4 gap-4">
        {(["active", "closed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all capitalize ${
              activeTab === tab
                ? "border-purple-700 text-purple-700"
                : "border-transparent text-gray-400"
            }`}
          >
            {tab === "active" ? "Active Loans" : "Closed Loans"}
            {tab === "active" && loans.filter((l) => l.status === "active").length > 0 && (
              <span className="ml-2 bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">
                {loans.filter((l) => l.status === "active").length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4">
              <FileText size={36} className="text-purple-300" />
            </div>
            <h3 className="text-gray-700 font-bold text-lg mb-2">No Loans Found</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              {activeTab === "active"
                ? "You don't have any active loans. Apply now to get instant funds!"
                : "You don't have any closed loans yet."}
            </p>
            {activeTab === "active" && (
              <Link
                href="/apply-loan"
                className="gradient-purple text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2"
              >
                Apply for Loan <ChevronRight size={16} />
              </Link>
            )}
          </div>
        ) : (
          filtered.map((loan) => <LoanCard key={loan.id} loan={loan} />)
        )}

        {/* Repayment History (placeholder) */}
        {filtered.length > 0 && (
          <div className="bg-white rounded-2xl p-4 mt-2 card-shadow">
            <h3 className="text-gray-800 font-bold text-sm mb-3">Repayment Schedule</h3>
            <div className="space-y-2">
              {Array.from({ length: 3 }, (_, i) => {
                const loan = filtered[0];
                const d = new Date();
                d.setMonth(d.getMonth() + i + 1);
                return (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-gray-700 text-sm font-medium">EMI #{i + 1}</p>
                      <p className="text-gray-400 text-xs">
                        {d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 font-bold text-sm">₹{(loan.emi).toLocaleString("en-IN")}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${i === 0 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}>
                        {i === 0 ? "Upcoming" : "Scheduled"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
