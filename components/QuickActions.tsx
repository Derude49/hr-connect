"use client";

import { useRouter } from "next/navigation";
import { UserPlus, Briefcase, FileText, BarChart3 } from "lucide-react";

const actions = [
  { label: "Add Employee", icon: UserPlus, href: "/employees/onboarding" },
  { label: "Post Job", icon: Briefcase, href: null },
  { label: "Run Payroll", icon: FileText, href: "/payroll" },
  { label: "Reports", icon: BarChart3, href: "/performance" },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-bold tracking-tight text-slate-900">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map(({ label, icon: Icon, href }) => (
          <button
            key={label}
            onClick={() => href && router.push(href)}
            className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 py-6 text-sm font-semibold transition ${
              href
                ? "cursor-pointer hover:bg-slate-50"
                : "cursor-default opacity-60"
            }`}
          >
            <Icon className="h-5 w-5 text-slate-700" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
