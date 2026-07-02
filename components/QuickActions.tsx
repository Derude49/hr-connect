"use client";

import { useRouter } from "next/navigation";
import { UserPlus, Briefcase, FileText, BarChart3 } from "lucide-react";

const actions = [
  {
    label: "Add Employee",
    icon: UserPlus,
    href: "/employees/onboarding",
  },
  {
    label: "Post Job",
    icon: Briefcase,
    href: "/jobs",
  },
  {
    label: "Run Payroll",
    icon: FileText,
    href: "/payroll",
  },
  {
    label: "Reports",
    icon: BarChart3,
    href: "/performance",
  },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ label, icon: Icon, href }) => (
          <button
            key={label}
            onClick={() => router.push(href)}
            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 py-6 text-sm font-medium hover:bg-slate-50 transition"
          >
            <Icon className="h-5 w-5 text-slate-700" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}