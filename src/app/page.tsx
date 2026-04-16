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
    <div className="min-h-screen gradient-purple flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Logo */}
      <div className="flex flex-col items-center gap-4 fade-in">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
          <span className="text-4xl font-black text-purple-700">KB</span>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-black text-white tracking-tight">KreditBee</h1>
          <p className="text-purple-200 text-base mt-1 font-medium">Smart Loans. Simple Life.</p>
        </div>
      </div>

      {/* Tagline */}
      <div className="mt-12 text-center px-8 fade-in">
        <p className="text-white/80 text-sm leading-relaxed">
          Instant personal loans up to ₹4 Lakh<br />
          Approved in minutes. Disbursed in hours.
        </p>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-16 flex gap-2">
        <div className="w-2 h-2 bg-white/60 rounded-full loading-dot" />
        <div className="w-2 h-2 bg-white/60 rounded-full loading-dot" />
        <div className="w-2 h-2 bg-white/60 rounded-full loading-dot" />
      </div>
    </div>
  );
}
