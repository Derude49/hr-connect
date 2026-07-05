"use client";

import { useEffect, useState } from "react";
import { Search, Bell, HelpCircle } from "lucide-react";

interface Session {
  fullName: string;
  email: string;
}

export default function Topbar() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("hrConnectSession");
    if (raw) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSession(JSON.parse(raw));
    }
  }, []);

  const initials = session?.fullName
    ? session.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AU";

  const displayName = session?.fullName ?? "Admin User";
  const displayRole = session?.email ? "ADMINISTRATOR" : "SUPER ADMINISTRATOR";

  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-4 py-4 text-slate-900 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex w-full items-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 lg:max-w-md">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          placeholder="Search employees, documents, or actions..."
          className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center justify-between gap-4 lg:justify-end lg:gap-5">
        <Bell className="h-5 w-5 text-slate-500 cursor-pointer" />
        <HelpCircle className="h-5 w-5 text-slate-500 cursor-pointer" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold leading-tight text-slate-900">{displayName}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{displayRole}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-sm font-bold text-white">
            {initials}
          </div>
        </div>
      </div>
    </div>
  );
}
