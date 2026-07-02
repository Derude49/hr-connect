import StatCard from "@/components/StatCard";
import RecentActivity from "@/components/RecentActivity";
import QuickActions from "@/components/QuickActions";
import Milestones from "@/components/Milestones";
import PayrollStatus from "@/components/PayrollStatus";
import { Calendar, Download } from "lucide-react";
import { employees, leaveRequests } from "@/lib/mock-data";

export default function DashboardPage() {
  const totalEmployees = employees.length;
  const pendingLeave = leaveRequests.filter(r => r.status === "Pending").length;
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enterprise Overview</h1>
          <p className="mt-1 text-slate-500">
            Good morning, here is what is happening across the organization today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium">
            <Calendar className="h-4 w-4" />
            Oct 24, 2023
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            <Download className="h-4 w-4" />
            Export Analytics
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-5">
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

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Employee Distribution</h2>
            <div className="flex h-64 items-end justify-around text-xs text-slate-400">
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
    </>
  );
}