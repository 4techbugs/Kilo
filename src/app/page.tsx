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
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-[260px] text-center">
        <div className="flex flex-col items-center gap-5 fade-in">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-2.5xl font-black text-indigo-600">KB</span>
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2.5xl font-bold text-white tracking-tight">KreditBee</h1>
            <p className="text-indigo-200 text-sm font-medium">Smart Loans. Simple Life.</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-indigo-300/70 text-xs leading-relaxed">
            Instant personal loans up to ₹4 Lakh<br />
            Approved in minutes. Disbursed in hours.
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5">
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full loading-dot" />
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full loading-dot" />
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full loading-dot" />
        </div>
      </div>
    </div>
  );
}