"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Calendar,
  FileX,
  Wallet,
  LineChart,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
  { label: "Employees", icon: Users, href: "/employees" },
  { label: "Attendance", icon: Calendar, href: "/attendance" },
  { label: "Leave", icon: FileX, href: "/leave" },
  { label: "Payroll", icon: Wallet, href: "/payroll" },
  { label: "Performance", icon: LineChart, href: "/performance" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

function handleLogout() {
  localStorage.removeItem("hrConnectSession");
  router.push("/");
}

  return (
    <aside className="flex h-screen w-72 flex-col justify-between bg-slate-900 text-slate-300">
      <div>
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <LayoutGrid className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">HR Portal</p>
            <p className="text-xs tracking-wide text-slate-400">
              ENTERPRISE ADMIN
            </p>
          </div>
        </div>

        <nav className="mt-2 flex flex-col gap-1 px-3">
          {navItems.map(({ label, icon: Icon, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4">
        <button
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-semibold text-slate-900 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}