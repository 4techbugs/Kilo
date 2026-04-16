"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

const FAQS = [
  {
    category: "Loan Application",
    questions: [
      {
        q: "How do I apply for a loan on KreditBee?",
        a: "Download the app, register with your mobile number, complete KYC verification, and apply for a loan. The entire process is digital and takes less than 10 minutes. Once approved, money is disbursed within 2-4 hours.",
      },
      {
        q: "What is the minimum and maximum loan amount?",
        a: "You can borrow as little as ₹1,000 and up to ₹4,00,000 depending on your credit profile, income, and repayment history with us.",
      },
      {
        q: "What documents are required to apply?",
        a: "You need: (1) PAN Card, (2) Aadhaar Card, (3) Active bank account. For higher loan amounts, we may ask for salary slips or bank statements.",
      },
      {
        q: "How long does loan approval take?",
        a: "Most loans are approved within minutes after KYC verification. Complex cases may take up to 24 hours. You'll be notified via SMS and app notification.",
      },
      {
        q: "Can I apply if I have a low CIBIL score?",
        a: "We use multiple data points beyond just CIBIL score. However, a score below 600 may result in rejection or higher interest rates. We recommend maintaining a good repayment history.",
      },
    ],
  },
  {
    category: "Interest & Charges",
    questions: [
      {
        q: "What is the interest rate on KreditBee loans?",
        a: "Interest rates start from 1.5% per month (18% p.a.) and vary based on your credit profile. The exact rate is shown before you confirm your application.",
      },
      {
        q: "What is the processing fee?",
        a: "Processing fee is 2% to 4% of the loan amount plus 18% GST. This is deducted from the loan amount before disbursement.",
      },
      {
        q: "Are there any hidden charges?",
        a: "No hidden charges. All fees including processing fee, interest rate, and late payment charges are clearly disclosed before loan acceptance. You can review the full fee schedule in the app.",
      },
      {
        q: "What happens if I miss an EMI?",
        a: "A late payment fee of ₹500 + 2% per month on the overdue amount is charged. It also negatively impacts your credit score. Please contact support if you're facing repayment difficulties.",
      },
    ],
  },
  {
    category: "Repayment",
    questions: [
      {
        q: "How do I repay my loan?",
        a: "EMIs are auto-debited via NACH mandate from your registered bank account. You can also pay manually through the app using UPI, Net Banking, or Debit Card.",
      },
      {
        q: "Can I prepay or foreclose my loan?",
        a: "Yes! You can prepay or foreclose your loan after 3 EMIs with no prepayment penalty. This helps save on interest charges.",
      },
      {
        q: "Can I change my EMI date?",
        a: "EMI date can be changed once per loan tenure. Contact our support team at least 7 days before your due date to make this change.",
      },
      {
        q: "What if I want to extend my loan tenure?",
        a: "Loan restructuring is possible subject to eligibility. Contact our customer support. Note that extending tenure increases total interest paid.",
      },
    ],
  },
  {
    category: "KYC & Security",
    questions: [
      {
        q: "Why is KYC mandatory?",
        a: "KYC (Know Your Customer) is mandatory as per RBI regulations for all lending institutions. It helps verify your identity and prevents fraud.",
      },
      {
        q: "Is my Aadhaar data safe?",
        a: "Absolutely. We use UIDAI's official Aadhaar authentication API. We never store your full Aadhaar number — only the last 4 digits are retained. All data is encrypted with 256-bit SSL.",
      },
      {
        q: "How is my financial data protected?",
        a: "We use bank-grade security: AES-256 encryption, secure servers, regular audits, and comply with ISO 27001 standards. We never share your data with unauthorized parties.",
      },
    ],
  },
  {
    category: "Account & Support",
    questions: [
      {
        q: "How do I close my KreditBee account?",
        a: "To close your account, ensure all loans are fully repaid, then contact support@kreditbee.in. Account deletion is processed within 30 days.",
      },
      {
        q: "How do I contact customer support?",
        a: "You can reach us at:\n• Email: support@kreditbee.in\n• Phone: 1800-123-4567 (Mon-Sat, 9AM-6PM)\n• In-app chat support (24/7 for basic queries)",
      },
      {
        q: "I didn't receive my OTP. What should I do?",
        a: "Check if your phone has good network signal. OTPs expire in 10 minutes. Try resending after 30 seconds. If issue persists, restart your phone and try again. Contact support if problem continues.",
      },
    ],
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggle = (key: string) => {
    setOpenItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const filtered = FAQS.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      ({ q, a }) =>
        !search ||
        q.toLowerCase().includes(search.toLowerCase()) ||
        a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <PageHeader title="Help & FAQs" subtitle="Find answers quickly" />

      {/* Search */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Contact Card */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-4 text-white mb-4">
        <p className="font-bold text-sm mb-0.5">Still need help?</p>
        <p className="text-purple-200 text-xs mb-3">Our support team is here for you</p>
        <div className="flex gap-2">
          <div className="flex-1 bg-white/20 rounded-xl px-3 py-2 text-center">
            <p className="text-white text-xs font-medium">📞 Call Us</p>
            <p className="text-white/80 text-[10px]">1800-123-4567</p>
          </div>
          <div className="flex-1 bg-white/20 rounded-xl px-3 py-2 text-center">
            <p className="text-white text-xs font-medium">✉️ Email</p>
            <p className="text-white/80 text-[10px]">support@kreditbee.in</p>
          </div>
          <div className="flex-1 bg-white/20 rounded-xl px-3 py-2 text-center">
            <p className="text-white text-xs font-medium">💬 Chat</p>
            <p className="text-white/80 text-[10px]">24/7 Support</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-4xl mb-3">🔍</p>
            <p className="text-gray-600 font-semibold">No results found</p>
            <p className="text-gray-400 text-sm mt-1">Try different keywords</p>
          </div>
        ) : (
          filtered.map(({ category, questions }) => (
            <div key={category} className="bg-white rounded-2xl card-shadow overflow-hidden">
              <div className="px-4 py-3 bg-purple-50 border-b border-purple-100">
                <p className="text-purple-700 font-bold text-sm">{category}</p>
              </div>
              {questions.map(({ q, a }, idx) => {
                const key = `${category}-${idx}`;
                const isOpen = openItems.includes(key);
                return (
                  <div key={key} className={`${idx < questions.length - 1 ? "border-b border-gray-50" : ""}`}>
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between px-4 py-4 text-left gap-3"
                    >
                      <span className="text-gray-800 text-sm font-medium flex-1">{q}</span>
                      {isOpen ? (
                        <ChevronUp size={16} className="text-purple-500 shrink-0" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 fade-in">
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line bg-gray-50 rounded-xl p-3">{a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
