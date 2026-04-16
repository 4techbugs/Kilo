"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/PageHeader";
import BottomNav from "@/components/BottomNav";
import {
  User, Phone, Mail, MapPin, Briefcase, CreditCard,
  Landmark, Shield, FileText, HelpCircle, Star,
  LogOut, ChevronRight, Bell, Lock, Share2, CheckCircle
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, loans } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!user) return null;

  const fmt = (n: number) => n.toLocaleString("en-IN");
  const activeLoans = loans.filter((l) => l.status === "active");
  const totalBorrowed = loans.reduce((s, l) => s + l.amount, 0);

  const MENU_SECTIONS = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Personal Information", href: "/kyc", desc: user.name || "Complete profile" },
        { icon: CreditCard, label: "KYC Documents", href: "/kyc", desc: user.kycComplete ? "Verified ✓" : "Pending" },
        { icon: Landmark, label: "Bank Details", href: "/kyc", desc: user.bankName || "Add bank account" },
        { icon: Briefcase, label: "Employment Details", href: "/kyc", desc: user.employment || "Add details" },
      ],
    },
    {
      title: "Loans",
      items: [
        { icon: FileText, label: "Loan History", href: "/my-loans", desc: `${loans.length} total loans` },
        { icon: Star, label: "Credit Score", href: "/profile", desc: `Score: ${user.creditScore}` },
        { icon: Share2, label: "Refer & Earn", href: "#", desc: "Earn ₹500 per referral" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "FAQs & Help Center", href: "/faq", desc: "Common questions" },
        { icon: Bell, label: "Notifications", href: "/notifications", desc: "Manage alerts" },
        { icon: Lock, label: "Privacy & Security", href: "/privacy", desc: "Your data is safe" },
        { icon: FileText, label: "Terms & Conditions", href: "/terms", desc: "Legal agreements" },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <PageHeader title="My Profile" showBack={false} />

      {/* Profile Hero */}
      <div className="gradient-purple px-5 pt-4 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-black text-purple-700">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-white font-bold text-lg">{user.name || "Complete Your Profile"}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Phone size={12} className="text-purple-300" />
              <span className="text-purple-200 text-sm">+91 {user.mobile}</span>
            </div>
            {user.email && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <Mail size={12} className="text-purple-300" />
                <span className="text-purple-200 text-xs">{user.email}</span>
              </div>
            )}
          </div>
          <Link
            href="/kyc"
            className="bg-white/20 border border-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-xl"
          >
            Edit
          </Link>
        </div>

        {/* KYC Status */}
        <div className={`mt-4 flex items-center gap-2 rounded-xl px-3 py-2 ${user.kycComplete ? "bg-green-500/20" : "bg-yellow-500/20"}`}>
          {user.kycComplete ? (
            <CheckCircle size={16} className="text-green-300" />
          ) : (
            <Shield size={16} className="text-yellow-300" />
          )}
          <span className={`text-xs font-semibold ${user.kycComplete ? "text-green-200" : "text-yellow-200"}`}>
            {user.kycComplete ? "KYC Verified — Full Access Unlocked" : "KYC Pending — Complete to get higher limits"}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-4 -mt-3 bg-white rounded-2xl grid grid-cols-3 divide-x divide-gray-100 card-shadow mb-4">
        {[
          { label: "Credit Limit", value: `₹${fmt(user.creditLimit)}` },
          { label: "Active Loans", value: activeLoans.length.toString() },
          { label: "Credit Score", value: user.creditScore.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center py-3 px-2">
            <p className="text-gray-900 font-black text-base">{value}</p>
            <p className="text-gray-400 text-[10px] text-center mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Credit Score Card */}
      <div className="mx-4 mb-4 bg-white rounded-2xl p-4 card-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-xs font-medium">CIBIL Credit Score</p>
            <p className="text-4xl font-black mt-1 text-purple-700">{user.creditScore}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-green-600 text-xs font-semibold">Excellent</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs">Total Borrowed</p>
            <p className="text-gray-800 font-bold text-sm">₹{fmt(totalBorrowed)}</p>
            <p className="text-gray-400 text-xs mt-2">Last Updated</p>
            <p className="text-gray-600 text-xs">{new Date().toLocaleDateString("en-IN")}</p>
          </div>
        </div>
        {/* Score gauge */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>300</span><span>550</span><span>700</span><span>850</span>
          </div>
          <div className="bg-gradient-to-r from-red-400 via-yellow-400 via-blue-400 to-green-400 rounded-full h-2 relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-purple-700 rounded-full shadow-sm"
              style={{ left: `${((user.creditScore - 300) / 550) * 100}%`, transform: "translate(-50%, -50%)" }}
            />
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-4 space-y-4">
        {MENU_SECTIONS.map(({ title, items }) => (
          <div key={title} className="bg-white rounded-2xl card-shadow overflow-hidden">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-4 pt-3 pb-1">{title}</p>
            {items.map(({ icon: Icon, label, href, desc }, idx) => (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-4 py-3.5 active:bg-gray-50 ${
                  idx < items.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-sm font-medium">{label}</p>
                  <p className="text-gray-400 text-xs truncate">{desc}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 shrink-0" />
              </Link>
            ))}
          </div>
        ))}

        {/* Personal Info Details */}
        {user.name && (
          <div className="bg-white rounded-2xl card-shadow p-4">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Profile Details</p>
            <div className="space-y-3">
              {[
                { icon: User, label: "Full Name", value: user.name },
                { icon: Phone, label: "Mobile", value: `+91 ${user.mobile}` },
                { icon: Mail, label: "Email", value: user.email || "Not added" },
                ...(user.city ? [{ icon: MapPin, label: "City", value: `${user.city}, ${user.state}` }] : []),
                ...(user.employment ? [{ icon: Briefcase, label: "Employment", value: user.employment }] : []),
                ...(user.income ? [{ icon: CreditCard, label: "Income", value: user.income }] : []),
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={16} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs">{label}</p>
                    <p className="text-gray-800 text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        {!showLogoutConfirm ? (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full bg-red-50 border border-red-100 text-red-600 font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95"
          >
            <LogOut size={18} />
            Logout
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-red-800 font-semibold text-sm mb-3 text-center">Confirm Logout?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm">
                Cancel
              </button>
              <button onClick={handleLogout} className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-xl text-sm">
                Yes, Logout
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-gray-300 text-xs pb-4">KreditBee v2.0.0 • NBFC Regulated by RBI</p>
      </div>

      <BottomNav />
    </div>
  );
}
