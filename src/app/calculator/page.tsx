"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";

export default function CalculatorPage() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(1.8);
  const [tenure, setTenure] = useState(12);

  const monthlyRate = rate / 100;
  const emi = Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1));
  const totalAmount = emi * tenure;
  const totalInterest = totalAmount - amount;
  const fmt = (n: number) => n.toLocaleString("en-IN");

  const principalPct = Math.round((amount / totalAmount) * 100);
  const interestPct = 100 - principalPct;

  const schedule = Array.from({ length: Math.min(tenure, 12) }, (_, i) => {
    const month = i + 1;
    let outstanding = amount;
    for (let j = 0; j < i; j++) {
      const int = outstanding * monthlyRate;
      outstanding -= (emi - int);
    }
    const interest = Math.round(outstanding * monthlyRate);
    const principal = emi - interest;
    const balance = Math.max(0, Math.round(outstanding - principal));
    return { month, emi, principal, interest, balance };
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 px-4 pt-6 pb-8">
        <h1 className="text-white text-xl font-bold">EMI Calculator</h1>
        <p className="text-indigo-200 text-xs">Plan your repayment</p>
      </div>

      <div className="px-4 -mt-4 space-y-3">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate-600">Loan Amount</label>
            <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg font-bold text-base">
              ₹{fmt(amount)}
            </div>
          </div>
          <input
            type="range" min={5000} max={400000} step={5000} value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full"
            style={{
              background: `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${((amount - 5000) / (400000 - 5000)) * 100}%, #E2E8F0 ${((amount - 5000) / (400000 - 5000)) * 100}%, #E2E8F0 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1.5">
            <span>₹5,000</span><span>₹4,00,000</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate-600">Interest Rate (Monthly)</label>
            <div className="bg-violet-600 text-white px-3 py-1 rounded-lg font-bold text-base">
              {rate}%
            </div>
          </div>
          <input
            type="range" min={0.5} max={4} step={0.1} value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full"
            style={{
              background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${((rate - 0.5) / (4 - 0.5)) * 100}%, #E2E8F0 ${((rate - 0.5) / (4 - 0.5)) * 100}%, #E2E8F0 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1.5">
            <span>0.5%</span><span>4%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate-600">Loan Tenure</label>
            <div className="bg-emerald-600 text-white px-3 py-1 rounded-lg font-bold text-base">
              {tenure} Mo
            </div>
          </div>
          <input
            type="range" min={1} max={60} step={1} value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full"
            style={{
              background: `linear-gradient(to right, #10B981 0%, #10B981 ${((tenure - 1) / (60 - 1)) * 100}%, #E2E8F0 ${((tenure - 1) / (60 - 1)) * 100}%, #E2E8F0 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1.5">
            <span>1 Month</span><span>60 Months</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-4 text-white">
          <p className="text-indigo-200 text-xs mb-1">Your Monthly EMI</p>
          <p className="text-4xl font-bold">₹{fmt(emi)}</p>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-white/10 rounded-lg p-2.5">
              <p className="text-indigo-200 text-[10px]">Principal</p>
              <p className="font-semibold text-sm mt-0.5">₹{fmt(amount)}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2.5">
              <p className="text-indigo-200 text-[10px]">Interest</p>
              <p className="font-semibold text-sm mt-0.5">₹{fmt(totalInterest)}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2.5">
              <p className="text-indigo-200 text-[10px]">Processing</p>
              <p className="font-semibold text-sm mt-0.5">₹{fmt(Math.round(amount * 0.02))}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2.5">
              <p className="text-indigo-200 text-[10px]">Total Payable</p>
              <p className="font-semibold text-sm mt-0.5">₹{fmt(totalAmount)}</p>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex rounded-full overflow-hidden h-2">
              <div className="bg-emerald-400 transition-all" style={{ width: `${principalPct}%` }} />
              <div className="bg-amber-400 transition-all" style={{ width: `${interestPct}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-indigo-200 mt-1">
              <span>Principal {principalPct}%</span>
              <span>Interest {interestPct}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-700 font-semibold text-sm mb-3">
            Amortization Schedule {tenure > 12 && "(First 12 months)"}
          </h3>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="text-indigo-700 font-medium py-2 px-2 text-left rounded-l-lg">Mo</th>
                  <th className="text-indigo-700 font-medium py-2 px-2 text-right">EMI</th>
                  <th className="text-indigo-700 font-medium py-2 px-2 text-right">Principal</th>
                  <th className="text-indigo-700 font-medium py-2 px-2 text-right">Interest</th>
                  <th className="text-indigo-700 font-medium py-2 px-2 text-right rounded-r-lg">Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map(({ month, emi: e, principal, interest, balance }) => (
                  <tr key={month} className="border-b border-slate-50 last:border-0">
                    <td className="py-2 px-2 text-slate-500">{month}</td>
                    <td className="py-2 px-2 text-slate-800 font-medium text-right">₹{fmt(e)}</td>
                    <td className="py-2 px-2 text-emerald-600 font-medium text-right">₹{fmt(principal)}</td>
                    <td className="py-2 px-2 text-amber-600 font-medium text-right">₹{fmt(interest)}</td>
                    <td className="py-2 px-2 text-slate-600 font-medium text-right">₹{fmt(balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <a
          href="/apply-loan"
          className="block w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-3.5 rounded-xl text-center shadow-lg shadow-indigo-500/25 mb-4"
        >
          Apply for ₹{fmt(amount)} Loan →
        </a>
      </div>

      <BottomNav />
    </div>
  );
}