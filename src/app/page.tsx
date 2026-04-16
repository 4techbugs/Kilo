"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SplashPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-[280px] text-center">
        <div className="flex flex-col items-center gap-6 fade-in">
          <div className="w-20 h-20 bg-white rounded-[22px] flex items-center justify-center shadow-2xl">
            <span className="text-3xl font-black text-blue-700">KB</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">KreditBee</h1>
            <p className="text-blue-200 text-sm font-medium">Smart Loans. Simple Life.</p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-blue-300/70 text-xs leading-relaxed">
            Instant personal loans up to ₹4 Lakh<br />
            Approved in minutes. Disbursed in hours.
          </p>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5">
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full loading-dot" />
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full loading-dot" />
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full loading-dot" />
        </div>
      </div>
    </div>
  );
}