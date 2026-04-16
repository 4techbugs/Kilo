"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, Calculator, Bell, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/my-loans", icon: CreditCard, label: "My Loans" },
  { href: "/calculator", icon: Calculator, label: "Calculator" },
  { href: "/notifications", icon: Bell, label: "Alerts", badge: true },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { unreadCount } = useAuth();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-slate-200 z-50">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl relative group"
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  active ? "bg-blue-50" : "bg-transparent group-hover:bg-slate-50"
                }`}
              >
                <Icon
                  size={22}
                  className={active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                {badge && unreadCount > 0 && (
                  <span className="absolute top-0 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] font-medium transition-colors ${
                  active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
