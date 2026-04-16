"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
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
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader title="EMI Calculator" subtitle="Plan your repayment" showBack={false} />

      <div className="px-4 pt-4 space-y-4">
        {/* Loan Amount */}
        <div className="bg-white rounded-3xl p-5 card-shadow">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-700">Loan Amount</label>
            <div className="bg-purple-700 text-white px-4 py-1.5 rounded-xl font-black text-base">
              ₹{fmt(amount)}
            </div>
          </div>
          <input
            type="range" min={5000} max={400000} step={5000} value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full"
            style={{
              background: `linear-gradient(to right, #6B21A8 0%, #6B21A8 ${((amount - 5000) / (400000 - 5000)) * 100}%, #E2D9F3 ${((amount - 5000) / (400000 - 5000)) * 100}%, #E2D9F3 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>₹5,000</span><span>₹4,00,000</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="bg-white rounded-3xl p-5 card-shadow">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-700">Interest Rate (Monthly)</label>
            <div className="bg-blue-600 text-white px-3 py-1.5 rounded-xl font-black text-base">
              {rate}%
            </div>
          </div>
          <input
            type="range" min={0.5} max={4} step={0.1} value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full"
            style={{
              background: `linear-gradient(to right, #2563EB 0%, #2563EB ${((rate - 0.5) / (4 - 0.5)) * 100}%, #DBEAFE ${((rate - 0.5) / (4 - 0.5)) * 100}%, #DBEAFE 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0.5%</span><span>4%</span>
          </div>
        </div>

        {/* Tenure */}
        <div className="bg-white rounded-3xl p-5 card-shadow">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-700">Loan Tenure</label>
            <div className="bg-green-600 text-white px-3 py-1.5 rounded-xl font-black text-base">
              {tenure} Mo
            </div>
          </div>
          <input
            type="range" min={1} max={60} step={1} value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full"
            style={{
              background: `linear-gradient(to right, #16A34A 0%, #16A34A ${((tenure - 1) / (60 - 1)) * 100}%, #DCFCE7 ${((tenure - 1) / (60 - 1)) * 100}%, #DCFCE7 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 Month</span><span>60 Months</span>
          </div>
        </div>

        {/* Result */}
        <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-5 text-white">
          <p className="text-purple-200 text-sm mb-1">Your Monthly EMI</p>
          <p className="text-5xl font-black mb-4">₹{fmt(emi)}</p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Principal Amount", value: `₹${fmt(amount)}`, pct: `${principalPct}%` },
              { label: "Total Interest", value: `₹${fmt(totalInterest)}`, pct: `${interestPct}%` },
              { label: "Processing Fee (2%)", value: `₹${fmt(Math.round(amount * 0.02))}`, pct: "" },
              { label: "Total Payable", value: `₹${fmt(totalAmount)}`, pct: "" },
            ].map(({ label, value, pct }) => (
              <div key={label} className="bg-white/10 rounded-2xl p-3">
                <p className="text-purple-200 text-xs">{label}</p>
                <p className="text-white font-bold text-sm mt-1">{value}</p>
                {pct && <p className="text-purple-300 text-xs">{pct} of total</p>}
              </div>
            ))}
          </div>

          {/* Visual split */}
          <div className="mt-4">
            <div className="flex rounded-full overflow-hidden h-3">
              <div className="bg-green-400 transition-all" style={{ width: `${principalPct}%` }} />
              <div className="bg-orange-400 transition-all" style={{ width: `${interestPct}%` }} />
            </div>
            <div className="flex justify-between text-xs text-purple-200 mt-1">
              <span>● Principal {principalPct}%</span>
              <span>● Interest {interestPct}%</span>
            </div>
          </div>
        </div>

        {/* Amortization Table */}
        <div className="bg-white rounded-3xl p-5 card-shadow">
          <h3 className="text-gray-800 font-bold text-sm mb-3">
            Amortization Schedule {tenure > 12 && "(First 12 months)"}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-50">
                  <th className="text-purple-700 font-semibold py-2 px-2 text-left rounded-l-xl">Mo</th>
                  <th className="text-purple-700 font-semibold py-2 px-2 text-right">EMI</th>
                  <th className="text-purple-700 font-semibold py-2 px-2 text-right">Principal</th>
                  <th className="text-purple-700 font-semibold py-2 px-2 text-right">Interest</th>
                  <th className="text-purple-700 font-semibold py-2 px-2 text-right rounded-r-xl">Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map(({ month, emi: e, principal, interest, balance }) => (
                  <tr key={month} className="border-b border-gray-50 last:border-0">
                    <td className="py-2 px-2 text-gray-500">{month}</td>
                    <td className="py-2 px-2 text-gray-900 font-medium text-right">₹{fmt(e)}</td>
                    <td className="py-2 px-2 text-green-600 font-medium text-right">₹{fmt(principal)}</td>
                    <td className="py-2 px-2 text-orange-500 font-medium text-right">₹{fmt(interest)}</td>
                    <td className="py-2 px-2 text-gray-700 font-medium text-right">₹{fmt(balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <a
          href="/apply-loan"
          className="block w-full gradient-purple text-white font-bold py-4 rounded-2xl text-center active:scale-95 shadow-lg shadow-purple-200"
        >
          Apply for ₹{fmt(amount)} Loan →
        </a>
      </div>

      <BottomNav />
    </div>
  );
}
