"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/PageHeader";
import BottomNav from "@/components/BottomNav";
import { Bell, CreditCard, Tag, AlertCircle, Zap } from "lucide-react";

const TYPE_CONFIG = {
  loan: { icon: CreditCard, color: "bg-purple-100 text-purple-600" },
  payment: { icon: Zap, color: "bg-green-100 text-green-600" },
  offer: { icon: Tag, color: "bg-orange-100 text-orange-600" },
  alert: { icon: AlertCircle, color: "bg-blue-100 text-blue-600" },
};

export default function NotificationsPage() {
  const router = useRouter();
  const { isAuthenticated, notifications, markAllRead, unreadCount } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader
        title="Notifications"
        showBack={false}
        rightElement={
          unreadCount > 0 ? (
            <button
              onClick={markAllRead}
              className="text-purple-600 text-xs font-semibold px-3 py-1.5 bg-purple-50 rounded-xl"
            >
              Mark all read
            </button>
          ) : undefined
        }
      />

      {unreadCount > 0 && (
        <div className="mx-4 mt-3 bg-purple-50 border border-purple-100 rounded-2xl px-4 py-2.5 flex items-center gap-2">
          <Bell size={14} className="text-purple-600" />
          <span className="text-purple-700 text-xs font-medium">{unreadCount} unread notifications</span>
        </div>
      )}

      <div className="px-4 pt-3 space-y-2">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4">
              <Bell size={36} className="text-purple-300" />
            </div>
            <h3 className="text-gray-700 font-bold text-lg mb-2">No Notifications</h3>
            <p className="text-gray-400 text-sm">You&apos;re all caught up!</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const { icon: Icon, color } = TYPE_CONFIG[notif.type];
            return (
              <div
                key={notif.id}
                className={`bg-white rounded-2xl p-4 flex gap-3 card-shadow relative ${
                  !notif.read ? "border-l-4 border-purple-500" : ""
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className={`text-sm font-semibold ${notif.read ? "text-gray-700" : "text-gray-900"}`}>
                      {notif.title}
                    </p>
                    {!notif.read && (
                      <div className="w-2 h-2 bg-purple-600 rounded-full shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">{notif.message}</p>
                  <p className="text-gray-300 text-xs mt-1.5">{notif.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
}
