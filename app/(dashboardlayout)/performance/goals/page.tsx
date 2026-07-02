"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Trash2,
  Plus,
  Users,
} from "lucide-react";
import {
  assignEmployeeToGoal,
  DepartmentGoal,
  getEmployees,
  initializeGoals,
  migrateLegacyReviewStorage,
  saveGoals,
  unassignEmployeeFromGoal,
} from "@/lib/performance-store";

export default function GoalsPage() {
  const [goals, setGoals] = useState<DepartmentGoal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [animate, setAnimate] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState<DepartmentGoal["status"]>("IN PROGRESS");
  const [newProgress, setNewProgress] = useState(0);
  const [newAssignedEmployeeIds, setNewAssignedEmployeeIds] = useState<string[]>([
    getEmployees()[0]?.id ?? "emp-1",
  ]);

  const employees = getEmployees();

  const refreshGoals = () => {
    migrateLegacyReviewStorage();
    setGoals(initializeGoals());
  };

  useEffect(() => {
    refreshGoals();
    const timer = setTimeout(() => setAnimate(true), 50);
    const handleFocus = () => refreshGoals();
    window.addEventListener("focus", handleFocus);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handleDeleteGoal = (targetId: string) => {
    const updated = goals.filter((goal) => goal.id !== targetId);
    setGoals(updated);
    saveGoals(updated);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim() || !newDescription.trim()) return;
    if (newAssignedEmployeeIds.length === 0) {
      window.alert("Assign at least one employee to this goal.");
      return;
    }

    const newGoalObj: DepartmentGoal = {
      id: `goal-${Date.now()}`,
      status: newStatus,
      title: newTitle,
      description: newDescription,
      progress: newProgress,
      assignedEmployeeIds: newAssignedEmployeeIds,
    };

    const updatedGoalsList = [...goals, newGoalObj];
    setGoals(updatedGoalsList);
    saveGoals(updatedGoalsList);

    setNewTitle("");
    setNewDescription("");
    setNewStatus("IN PROGRESS");
    setNewProgress(0);
    setNewAssignedEmployeeIds([employees[0]?.id ?? "emp-1"]);
    setIsModalOpen(false);
  };

  const toggleAssignee = (goalId: string, employeeId: string, isAssigned: boolean) => {
    const updated =
      isAssigned
        ? unassignEmployeeFromGoal(goalId, employeeId)
        : assignEmployeeToGoal(goalId, employeeId);
    setGoals(updated);
  };

  const toggleNewGoalAssignee = (employeeId: string) => {
    setNewAssignedEmployeeIds((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId],
    );
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
            Manage goals, progress, and employee assignments synced across the
            performance dashboard and review forms.
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
                className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-5 hover:border-slate-200 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
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

                  <div className="w-full lg:w-56 space-y-2">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ease-out ${progressBgClass}`}
                        style={{ width: `${animate ? goal.progress : 0}%` }}
                      />
                    </div>
                    <div className="text-[11px] font-bold text-slate-500 text-right">
                      {goal.progress}% complete
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer active:scale-90 self-start"
                    title="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>
                      Assigned Employees ({goal.assignedEmployeeIds.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {employees.map((employee) => {
                      const isAssigned = goal.assignedEmployeeIds.includes(
                        employee.id,
                      );

                      return (
                        <button
                          key={employee.id}
                          type="button"
                          onClick={() =>
                            toggleAssignee(goal.id, employee.id, isAssigned)
                          }
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-md border transition-colors cursor-pointer ${
                            isAssigned
                              ? "bg-blue-50 text-blue-700 border-blue-100"
                              : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {employee.initials} · {employee.name}
                        </button>
                      );
                    })}
                  </div>
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
          <div className="bg-white w-full max-w-md rounded-xl border border-slate-100 shadow-xl overflow-hidden flex flex-col p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
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
                    onChange={(e) =>
                      setNewStatus(e.target.value as DepartmentGoal["status"])
                    }
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

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assigned Employees * (minimum 1)
                </label>
                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-3 space-y-2">
                  {employees.map((employee) => (
                    <label
                      key={employee.id}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={newAssignedEmployeeIds.includes(employee.id)}
                        onChange={() => toggleNewGoalAssignee(employee.id)}
                        className="rounded border-slate-300"
                      />
                      <span>{employee.name}</span>
                    </label>
                  ))}
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
