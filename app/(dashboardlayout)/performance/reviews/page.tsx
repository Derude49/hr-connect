"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ClipboardList } from "lucide-react";

const REVIEWS_STORAGE_KEY = "hr_connect_performance_reviews";

const REVIEW_EMPLOYEES = [
  {
    id: "emp-1",
    initials: "JL",
    name: "Jonathan Lee",
    role: "Senior Frontend Engineer",
    department: "Engineering",
    avatarBg: "bg-blue-100 text-blue-800",
    dueDate: "Oct 15, 2024",
  },
  {
    id: "emp-2",
    initials: "SM",
    name: "Sofia Mendez",
    role: "Product Designer",
    department: "Design",
    avatarBg: "bg-purple-100 text-purple-800",
    dueDate: "Oct 15, 2024",
  },
  {
    id: "emp-3",
    initials: "DC",
    name: "David Chen",
    role: "Data Scientist",
    department: "Data",
    avatarBg: "bg-emerald-100 text-emerald-800",
    dueDate: "Oct 18, 2024",
  },
];

function getReviewStatus(employeeId: string): "Not Started" | "In Progress" | "Draft Saved" {
  const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
  if (!saved) return "Not Started";

  const reviews = JSON.parse(saved) as Record<string, unknown>;
  const draft = reviews[employeeId] as
    | {
        summary?: string;
        achievements?: string;
        improvements?: string;
        ratings?: { technical?: number; delivery?: number; strategic?: number };
      }
    | undefined;

  if (!draft) return "Not Started";

  const hasContent =
    Boolean(draft.summary?.trim()) ||
    Boolean(draft.achievements?.trim()) ||
    Boolean(draft.improvements?.trim()) ||
    Object.values(draft.ratings ?? {}).some((score) => (score ?? 0) > 0);

  return hasContent ? "Draft Saved" : "Not Started";
}

export default function PerformanceReviewsListPage() {
  const [statusMap, setStatusMap] = useState<
    Record<string, "Not Started" | "In Progress" | "Draft Saved">
  >({});

  useEffect(() => {
    const map = Object.fromEntries(
      REVIEW_EMPLOYEES.map((employee) => [
        employee.id,
        getReviewStatus(employee.id),
      ]),
    );
    setStatusMap(map);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 space-y-6 text-slate-900">
      <Link
        href="/performance"
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer group w-fit"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to performance overview</span>
      </Link>

      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
        <Link
          href="/performance"
          className="hover:text-slate-600 transition-colors cursor-pointer"
        >
          Performance
        </Link>
        <span className="text-slate-300 font-normal">&gt;</span>
        <span className="text-slate-500">Review Targets</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Annual Review 2024 — Employee Targets
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            Select an employee to open or continue their performance review.
            Each review is saved separately in your browser.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-xs font-semibold text-blue-700">
          <ClipboardList className="w-4 h-4" />
          <span>{REVIEW_EMPLOYEES.length} reviews in this cycle</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REVIEW_EMPLOYEES.map((employee) => {
          const status = statusMap[employee.id] ?? "Not Started";
          const statusClasses =
            status === "Draft Saved"
              ? "bg-emerald-100 text-emerald-700"
              : status === "In Progress"
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-600";

          return (
            <Link
              key={employee.id}
              href={`/performance/review?employee=${employee.id}`}
              className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex flex-col gap-4 group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-xs ${employee.avatarBg}`}
                >
                  {employee.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-slate-800 truncate">
                    {employee.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium truncate">
                    {employee.role}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {employee.department}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold">
                  Due {employee.dueDate}
                </span>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${statusClasses}`}
                >
                  {status}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
