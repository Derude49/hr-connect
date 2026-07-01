"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Trash2,
  Plus,
} from "lucide-react";

const INITIAL_GOALS_DATA = [
  {
    id: "goal-1",
    status: "ACHIEVED",
    title: "Increase System Uptime to 99.9%",
    description: "Core infrastructure optimization project for Q3.",
    progress: 100,
  },
  {
    id: "goal-2",
    status: "IN PROGRESS",
    title: "Automated Payroll Integration",
    description: "Migrate existing manual processes to the new API suite.",
    progress: 65,
  },
  {
    id: "goal-3",
    status: "OVERDUE",
    title: "Security Audit Completion",
    description: "Bi-annual security check and vulnerability assessment.",
    progress: 40,
  },
  {
    id: "goal-4",
    status: "IN PROGRESS",
    title: "Onboarding Refresh",
    description: "Redesigning the first-week experience for new hires.",
    progress: 12,
  },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState(INITIAL_GOALS_DATA);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [animate, setAnimate] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState("IN PROGRESS");
  const [newProgress, setNewProgress] = useState(0);

  useEffect(() => {
    const savedGoals = localStorage.getItem("hr_connect_goals");
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      localStorage.setItem(
        "hr_connect_goals",
        JSON.stringify(INITIAL_GOALS_DATA),
      );
    }

    const timer = setTimeout(() => {
      setAnimate(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleDeleteGoal = (targetId: string) => {
    const updated = goals.filter((goal) => goal.id !== targetId);
    setGoals(updated);
    localStorage.setItem("hr_connect_goals", JSON.stringify(updated));
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim() || !newDescription.trim()) return;

    const newGoalObj = {
      id: `goal-${Date.now()}`,
      status: newStatus,
      title: newTitle,
      description: newDescription,
      progress: newProgress,
    };

    const updatedGoalsList = [...goals, newGoalObj];

    setGoals(updatedGoalsList);
    localStorage.setItem("hr_connect_goals", JSON.stringify(updatedGoalsList));

    setNewTitle("");
    setNewDescription("");
    setNewStatus("IN PROGRESS");
    setNewProgress(0);

    setIsModalOpen(false);
  };

  const filteredGoals = goals.filter((goal) => {
    const matchesSearch =
      goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === "ALL" || goal.status === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 space-y-6 text-slate-900">
      {/* <div className="flex items-center">
        <Link
          href="/performance"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to performance overview</span>
        </Link>
      </div> */}

      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 -mt-2">
        <Link
          href="/performance"
          className="hover:text-slate-600 transition-colors cursor-pointer"
        >
          Performance
        </Link>
        <span className="text-slate-300 font-normal">&gt;</span>
        <span className="text-slate-500">Goals Directory</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Department Goals Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and audit all operational performance objectives.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start">
          {["ALL", "IN PROGRESS", "ACHIEVED", "OVERDUE"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search objectives..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/50"
          />
          <div className="absolute left-3 top-2.5 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredGoals.length > 0 ? (
          filteredGoals.map((goal) => {
            const isOverdue = goal.status === "OVERDUE";
            const isAchieved = goal.status === "ACHIEVED";

            const badgeClasses = isOverdue
              ? "bg-rose-100 text-rose-700"
              : isAchieved
                ? "bg-emerald-100 text-emerald-700"
                : "bg-blue-100 text-blue-700";

            const progressBgClass = isOverdue
              ? "bg-rose-500"
              : isAchieved
                ? "bg-emerald-500"
                : "bg-blue-600";

            return (
              <div
                key={goal.id}
                className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-slate-200 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-200"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${badgeClasses}`}
                    >
                      {goal.status}
                    </span>
                    <h3 className="font-bold text-sm tracking-tight text-slate-800">
                      {goal.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xl">
                    {goal.description}
                  </p>
                </div>

                <div className="w-full sm:w-56 space-y-2">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ease-out ${progressBgClass}`}
                      style={{ width: `${animate ? goal.progress : 0}%` }}
                    />
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 text-right">
                    {goal.progress}%{" "}
                    {isOverdue
                      ? "- Delayed"
                      : isAchieved
                        ? "Complete"
                        : "Complete"}
                  </div>
                </div>

                <div className="flex items-center justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer active:scale-90"
                    title="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-12 rounded-xl border border-slate-100 text-center space-y-2 flex flex-col items-center">
            <span className="text-slate-300 font-bold text-lg">
              No Goals Found
            </span>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              No objectives match your active search terms or selected status
              filters.
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl border border-slate-100 shadow-xl overflow-hidden flex flex-col p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900">
              Create New Goal
            </h3>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Secure Server Access Migration"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Description
                </label>
                <textarea
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Briefly describe the objective of this goal..."
                  rows={3}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/50 cursor-pointer"
                  >
                    <option value="IN PROGRESS">IN PROGRESS</option>
                    <option value="OVERDUE">OVERDUE</option>
                    <option value="ACHIEVED">ACHIEVED</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Initial Progress (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={newProgress || ""}
                    onChange={(e) =>
                      setNewProgress(
                        Math.min(
                          100,
                          Math.max(0, parseInt(e.target.value) || 0),
                        ),
                      )
                    }
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer active:scale-95 transition-all"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
