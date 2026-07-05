"use client";

import { useEffect, useState } from "react";
import { employees as seedEmployees, leaveRequests as seedLeaveRequests } from "@/lib/mock-data";
import { getAllEmployees } from "@/lib/storage";
import StatCard from "@/components/StatCard";
import RecentActivity from "@/components/RecentActivity";
import QuickActions from "@/components/QuickActions";
import Milestones from "@/components/Milestones";
import PayrollStatus from "@/components/PayrollStatus";
import { Calendar, Download } from "lucide-react";

export default function DashboardPage() {
  const [totalEmployees, setTotalEmployees] = useState(seedEmployees.length);
  const [pendingLeave, setPendingLeave] = useState(
    seedLeaveRequests.filter((r) => r.status === "Pending").length
  );
  
  useEffect(() => {
    // Total employees from localStorage + seed data
    const allEmployees = getAllEmployees(seedEmployees);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTotalEmployees(allEmployees.length);

    // Pending leave from the same key the leave page uses
    try {
      const raw = localStorage.getItem("hr_connect_leave_requests");
      if (raw) {
        const leaveData = JSON.parse(raw);
        const pending = leaveData.filter((r: { status: string }) => r.status === "Pending").length;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPendingLeave(pending);
      } else {
        // Fall back to seed data count if leave page hasn't initialized yet
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPendingLeave(seedLeaveRequests.filter((r) => r.status === "Pending").length);
      }
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPendingLeave(seedLeaveRequests.filter((r) => r.status === "Pending").length);
    }
  }, []);

  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-6 text-slate-900 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enterprise Overview</h1>
          <p className="mt-1 text-sm text-slate-500 md:text-base">
            Good morning, here is what is happening across the organization today.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            <Calendar className="h-4 w-4" />
            Oct 24, 2023
          </button>
          <button className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            <Download className="h-4 w-4" />
            Export Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="TOTAL EMPLOYEES"
          value={totalEmployees.toLocaleString()}
          accentColor="blue"
          badge={{ text: "↗ +4%", tone: "blue" }}
        />
        <StatCard
          label="ATTENDANCE RATE"
          value="98.2%"
          accentColor="green"
          badge={{ text: "✓ Target Met", tone: "green" }}
        />
        <StatCard
          label="PENDING LEAVE"
          value={String(pendingLeave)}
          accentColor="red"
          badge={{ text: "! Urgent", tone: "red" }}
        />
        <StatCard
          label="ACTIVE REVIEWS"
          value="45"
          accentColor="slate"
          badge={{ text: "⧗ In Progress", tone: "blue" }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-bold tracking-tight text-slate-900">Employee Distribution</h2>
            <div className="flex h-64 items-end justify-start gap-6 overflow-x-auto text-xs text-slate-400 sm:justify-around sm:gap-0">
              {["Engineering", "Sales", "Marketing", "Operations", "HR", "Finance"].map((d) => (
                <span key={d}>{d.toUpperCase()}</span>
              ))}
            </div>
          </div>
          <RecentActivity />
        </div>

        <div className="space-y-6">
          <QuickActions />
          <Milestones />
          <PayrollStatus />
        </div>
      </div>
    </div>
  );
}
