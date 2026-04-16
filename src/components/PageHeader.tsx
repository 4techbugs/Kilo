"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, showBack = true, rightElement }: PageHeaderProps) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-purple-50 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
}
