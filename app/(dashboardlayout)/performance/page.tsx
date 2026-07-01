"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  BarChart3,
  AlertTriangle,
  ClipboardList,
  Clock,
  MoreVertical,
  Plus,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  ChevronDown, // Imported for the dropdown indicator
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

const INITIAL_FEEDBACK_DATA = [
  {
    id: "feed-1",
    author: "Sarah Jenkins",
    role: "Manager",
    time: "Yesterday",
    message:
      "Outstanding delivery on the Q3 roadmap. The technical documentation was particularly impressive this cycle.",
    dotColor: "bg-blue-600 border-blue-200",
  },
  {
    id: "feed-2",
    author: "Marcus Wu",
    role: "Peer",
    time: "3 days ago",
    message:
      "Always ready to jump in and help with debugging. Great team player during the server migration last week!",
    dotColor: "bg-slate-400 border-slate-200",
  },
  {
    id: "feed-3",
    author: "Elena Rodriguez",
    role: "Peer",
    time: "Aug 12",
    message:
      "The presentation on micro-frontends was excellent. Clear, concise, and very actionable for the whole team.",
    dotColor: "bg-slate-400 border-slate-200",
  },
];

const LEADERBOARD_DATA = [
  {
    id: "emp-1",
    name: "Jonathan Lee",
    role: "Senior Frontend Engineer",
    score: 4.8,
    progress: 92,
    lastReview: "Aug 05, 2024",
    initials: "JL",
    avatarBg: "bg-blue-100 text-blue-800",
  },
  {
    id: "emp-2",
    name: "Sofia Mendez",
    role: "Product Designer",
    score: 4.5,
    progress: 85,
    lastReview: "Jul 28, 2024",
    initials: "SM",
    avatarBg: "bg-purple-100 text-purple-800",
  },
  {
    id: "emp-3",
    name: "David Chen",
    role: "Data Scientist",
    score: 3.9,
    progress: 60,
    lastReview: "Aug 10, 2024",
    initials: "DC",
    avatarBg: "bg-emerald-100 text-emerald-800",
  },
];

// 1. DATA DICTIONARY: Multi-Quarter Datasets
const QUARTER_DATA_MAP: Record<string, { label: string; value: number }[]> = {
  "Q3 2024": [
    { label: "1 - Poor", value: 4 },
    { label: "2 - Fair", value: 12 },
    { label: "3 - Good", value: 38 },
    { label: "4 - V. Good", value: 29 },
    { label: "5 - Excellent", value: 16 },
  ],
  "Q2 2024": [
    { label: "1 - Poor", value: 2 },
    { label: "2 - Fair", value: 8 },
    { label: "3 - Good", value: 30 },
    { label: "4 - V. Good", value: 42 }, // Peak value changes to 42
    { label: "5 - Excellent", value: 10 },
  ],
  "Q1 2024": [
    { label: "1 - Poor", value: 6 },
    { label: "2 - Fair", value: 15 },
    { label: "3 - Good", value: 25 },
    { label: "4 - V. Good", value: 35 },
    { label: "5 - Excellent", value: 20 },
  ],
  "Q4 2023": [
    { label: "1 - Poor", value: 1 },
    { label: "2 - Fair", value: 10 },
    { label: "3 - Good", value: 45 }, // Peak value changes to 45
    { label: "4 - V. Good", value: 20 },
    { label: "5 - Excellent", value: 15 },
  ],
};

export default function PerformancePage() {
  const [goals, setGoals] = useState(INITIAL_GOALS_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState("IN PROGRESS");
  const [newProgress, setNewProgress] = useState(0);

  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACK_DATA);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [newFeedAuthor, setNewFeedbackAuthor] = useState("");
  const [newFeedRole, setNewFeedbackRole] = useState("Peer");
  const [newFeedMessage, setNewFeedbackMessage] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState<
    (typeof LEADERBOARD_DATA)[0] | null
  >(null);

  const [animate, setAnimate] = useState(false);

  // 2. DROPDOWN STATE DEFINITIONS
  const [selectedQuarter, setSelectedQuarter] = useState("Q3 2024");
  const [isQuarterDropdownOpen, setIsQuarterDropdownOpen] = useState(false);

  // 3. DYNAMIC DATA SELECTOR: Reads the dataset array bound to your active state key
  const activeRatingsData = QUARTER_DATA_MAP[selectedQuarter];
  const maxRatingValue = Math.max(
    ...activeRatingsData.map((item) => item.value),
  );

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

    const savedFeedback = localStorage.getItem("hr_connect_feedback");
    if (savedFeedback) {
      setFeedbacks(JSON.parse(savedFeedback));
    } else {
      localStorage.setItem(
        "hr_connect_feedback",
        JSON.stringify(INITIAL_FEEDBACK_DATA),
      );
    }

    const animationTimer = setTimeout(() => {
      setAnimate(true);
    }, 50);

    return () => clearTimeout(animationTimer);
  }, []);

  const handleBoostProgress = (targetId: string) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === targetId) {
        const nextProgress = Math.min(goal.progress + 10, 100);
        let nextStatus = goal.status;
        if (nextProgress === 100) {
          nextStatus = "ACHIEVED";
        } else if (goal.status === "OVERDUE" && nextProgress > 40) {
          nextStatus = "IN PROGRESS";
        }
        return { ...goal, progress: nextProgress, status: nextStatus };
      }
      return goal;
    });

    setGoals(updatedGoals);
    localStorage.setItem("hr_connect_goals", JSON.stringify(updatedGoals));
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

  const handleCreateFeedback = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newFeedAuthor.trim() || !newFeedMessage.trim()) return;

    const newFeedbackObj = {
      id: `feed-${Date.now()}`,
      author: newFeedAuthor,
      role: newFeedRole,
      time: "Just now",
      message: newFeedMessage,
      dotColor:
        newFeedRole === "Manager"
          ? "bg-blue-600 border-blue-200"
          : "bg-slate-400 border-slate-200",
    };

    const updatedFeedbackList = [newFeedbackObj, ...feedbacks];

    setFeedbacks(updatedFeedbackList);
    localStorage.setItem(
      "hr_connect_feedback",
      JSON.stringify(updatedFeedbackList),
    );

    setNewFeedbackAuthor("");
    setNewFeedbackRole("Peer");
    setNewFeedbackMessage("");

    setIsFeedbackModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 space-y-8 text-slate-900">
      {/* SECTION 1: HEADER BLOCK */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Performance Overview
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Analyze team distribution and track individual goal progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 active:scale-95 transition-all cursor-pointer">
            Export Report
          </button>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4" />
            <span>Schedule cycle</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: METRIC KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Team Engagement
            </span>
            <div className="text-3xl font-bold mt-2">94.2%</div>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
            <ArrowUpRight className="w-4 h-4" />
            <span>+2.4% vs LY</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Goal Completion
            </span>
            <div className="text-3xl font-bold mt-2">78/104</div>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
            <Check className="w-4 h-4" />
            <span>Active goals on track</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Avg. Performance Score
            </span>
            <div className="text-3xl font-bold mt-2">4.2/5.0</div>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold">
            <BarChart3 className="w-4 h-4" />
            <span>Stable performance</span>
          </div>
        </div>

        <a
          href="#performance-leaderboard"
          className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-40 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending Reviews
            </span>
            <div className="text-3xl font-bold mt-2">12</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-rose-600 text-sm font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>Overdue by 3+ days</span>
            </div>
            <span className="text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              View team →
            </span>
          </div>
        </a>
      </div>

      {/* SECTION 3: MIDDLE DASHBOARD ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Rating Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-2 flex flex-col h-96">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight">
              Rating Distribution (Team View)
            </h2>

            {/* 4. INTERACTIVE DROPDOWN COMPONENT BLOCK */}
            <div className="relative inline-block text-left">
              <button
                onClick={() => setIsQuarterDropdownOpen(!isQuarterDropdownOpen)}
                className="text-xs font-semibold px-2.5 py-1 bg-slate-50 text-slate-600 rounded-md border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <span>{selectedQuarter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Floating Dropdown Selection List */}
              {isQuarterDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-28 bg-white border border-slate-200 rounded-lg shadow-md z-30 py-1 text-xs font-semibold">
                  {Object.keys(QUARTER_DATA_MAP).map((quarter) => (
                    <button
                      key={quarter}
                      onClick={() => {
                        setSelectedQuarter(quarter);
                        setIsQuarterDropdownOpen(false); // Close dropdown on selection
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      {quarter}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chart mapping reads activeRatingsData */}
          <div className="flex-1 flex items-end justify-between px-6 pt-10 pb-2 bg-slate-50/50 border border-slate-100 rounded-lg h-full gap-2">
            {activeRatingsData.map((item, idx) => {
              const heightPercentage = (item.value / maxRatingValue) * 100;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative"
                >
                  {/* Tooltip */}
                  <div className="absolute -top-7 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex flex-col items-center">
                    <span>{item.value} employees</span>
                    <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-1" />
                  </div>

                  <div className="w-10 sm:w-12 bg-slate-100 h-full rounded-t-lg flex flex-col justify-end overflow-hidden">
                    <div
                      className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-1000 ease-out rounded-t-lg cursor-pointer"
                      style={{ height: `${animate ? heightPercentage : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 px-6 sm:px-8">
            <span>1 - Poor</span>
            <span>2 - Fair</span>
            <span>3 - Good</span>
            <span>4 - V. Good</span>
            <span>5 - Excellent</span>
          </div>
        </div>

        {/* Right Column: Appraisal Cycles */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-1 flex flex-col h-96">
          <h2 className="text-lg font-bold tracking-tight mb-6">
            Appraisal Cycles
          </h2>
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-lg flex items-start gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mt-0.5">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-sm">Annual Review 2024</h3>
                <p className="text-xs text-slate-400 font-medium">
                  Active · Ends Oct 30
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                    Pending
                  </span>
                  <Link
                    href="/performance/reviews"
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded hover:bg-blue-100 hover:text-blue-700 transition-colors"
                  >
                    Self-Review &gt;
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-lg flex items-start gap-3">
              <div className="p-2 bg-slate-100 text-slate-500 rounded-lg mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-sm">Mid-Year Check 2024</h3>
                <p className="text-xs text-slate-400 font-medium">
                  Completed Jul 15
                </p>
                <div className="pt-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">
                    Finalized
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-lg flex items-start gap-3">
              <div className="p-2 bg-slate-100 text-slate-500 rounded-lg mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-sm">Annual Review 2023</h3>
                <p className="text-xs text-slate-400 font-medium">
                  Completed Dec 20, 2023
                </p>
                <div className="pt-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">
                    Finalized
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: LOWER DASHBOARD ROW (GOALS & FEEDBACK) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Wider): Active Department Goals */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">
              Active Department Goals
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Goal</span>
              </button>
              <Link
                href="/performance/goals"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              >
                View All Goals
              </Link>
            </div>
          </div>

          <div className="max-h-[488px] overflow-y-auto pr-1 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal) => {
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
                    className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-48"
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${badgeClasses}`}
                      >
                        {goal.status}
                      </span>
                      <button
                        onClick={() => handleBoostProgress(goal.id)}
                        title="Boost progress by 10%"
                        className="text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg p-1 transition-all cursor-pointer border border-transparent active:scale-90"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1 mt-2">
                      <h3 className="font-bold text-sm tracking-tight text-slate-800 line-clamp-1">
                        {goal.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">
                        {goal.description}
                      </p>
                    </div>

                    <div className="space-y-2 mt-4">
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ease-out ${progressBgClass}`}
                          style={{ width: `${animate ? goal.progress : 0}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <div className="flex -space-x-1.5">
                          <div className="w-5 h-5 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[8px] font-bold text-slate-600">
                            EM
                          </div>
                          <div className="w-5 h-5 rounded-full bg-slate-300 border border-white flex items-center justify-center text-[8px] font-bold text-slate-700">
                            DN
                          </div>
                        </div>
                        <span>
                          {goal.progress}%{" "}
                          {isOverdue
                            ? "- Delayed"
                            : isAchieved
                              ? "Complete"
                              : "Complete"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Feedback */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-1 flex flex-col h-[544px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold tracking-tight text-slate-800">
              Recent Feedback
            </h2>
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="text-blue-600 hover:text-blue-700 transition-colors cursor-pointer active:scale-90 p-0.5"
            >
              <PlusCircle className="w-6 h-6 stroke-[1.75]" />
            </button>
          </div>

          <div className="flex-1 relative space-y-6 overflow-y-auto pr-1 pl-2">
            <div className="absolute left-[16px] top-2 bottom-6 w-0.5 bg-slate-100" />

            {feedbacks.map((feed) => (
              <div
                key={feed.id}
                className="flex gap-3 relative animate-in fade-in slide-in-from-bottom-2 duration-200"
              >
                <div className="w-4 shrink-0 flex justify-center pt-1.5 z-10">
                  <div
                    className={`w-[11px] h-[11px] rounded-full border-2 border-white ${feed.dotColor}`}
                  />
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-800">
                        {feed.author}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {feed.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {feed.time}
                    </span>
                  </div>

                  <p className="text-xs italic text-slate-500 font-medium leading-relaxed">
                    &ldquo;{feed.message}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="w-full mt-6 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
          >
            Request New Feedback
          </button>
        </div>
      </div>

      {/* SECTION 5: PERFORMANCE LEADERBOARD */}
      <div
        id="performance-leaderboard"
        className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col scroll-mt-8"
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-lg font-bold tracking-tight">
            Performance Leaderboard (Direct Reports)
          </h2>
          <div className="flex items-center gap-3">
            <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-6">Employee</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Score</th>
                <th className="py-3 px-6">Goal Progress</th>
                <th className="py-3 px-6">Last Review</th>
                <th className="py-3 px-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {LEADERBOARD_DATA.map((row) => {
                const isHigh = row.score >= 4.5;
                const scoreBadgeClass = isHigh
                  ? "bg-blue-50 text-blue-700 border-blue-100"
                  : "bg-slate-50 text-slate-700 border-slate-100";

                return (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border border-white ${row.avatarBg}`}
                      >
                        {row.initials}
                      </div>
                      <span className="font-semibold text-slate-800">
                        {row.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {row.role}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-md border ${scoreBadgeClass}`}
                      >
                        {row.score.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3 w-40">
                        <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                            style={{ width: `${animate ? row.progress : 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-500">
                          {row.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {row.lastReview}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setSelectedEmployee(row)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                        <Link
                          href={`/performance/review?employee=${row.id}`}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          Review
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Showing 1-3 of 12 employees</span>
          <div className="flex items-center gap-1.5">
            <button className="p-1 border border-slate-200 bg-white rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 border border-slate-200 bg-white rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* GOAL CREATION FORM MODAL OVERLAY */}
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

      {/* RECENT FEEDBACK FORM MODAL OVERLAY */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl border border-slate-100 shadow-xl overflow-hidden flex flex-col p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900">
              Request New Feedback
            </h3>

            <form onSubmit={handleCreateFeedback} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Sender Name
                </label>
                <input
                  type="text"
                  required
                  value={newFeedAuthor}
                  onChange={(e) => setNewFeedbackAuthor(e.target.value)}
                  placeholder="e.g., Sarah Jenkins"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Organizational Role
                </label>
                <select
                  value={newFeedRole}
                  onChange={(e) => setNewFeedbackRole(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/50 cursor-pointer"
                >
                  <option value="Peer">Peer</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Feedback Message
                </label>
                <textarea
                  required
                  value={newFeedMessage}
                  onChange={(e) => setNewFeedbackMessage(e.target.value)}
                  placeholder="Enter the performance feedback message received..."
                  rows={3}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/50 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer active:scale-95 transition-all"
                >
                  Add Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EMPLOYEE DETAILS MODAL OVERLAY */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-sm rounded-xl border border-slate-100 shadow-xl overflow-hidden flex flex-col p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 border-white shadow-xs ${selectedEmployee.avatarBg}`}
              >
                {selectedEmployee.initials}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {selectedEmployee.name}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  {selectedEmployee.role}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Evaluation Score
                </span>
                <div className="text-lg font-bold mt-1 text-slate-800">
                  {selectedEmployee.score.toFixed(1)} / 5.0
                </div>
              </div>
              <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-lg">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Last Reviewed
                </span>
                <div className="text-xs font-bold mt-2 text-slate-500">
                  {selectedEmployee.lastReview}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Goal Completion Rate
              </span>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${selectedEmployee.progress}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {selectedEmployee.progress}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg cursor-pointer active:scale-95 transition-all"
              >
                Close
              </button>
              <Link
                href={`/performance/review?employee=${selectedEmployee.id}`}
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer active:scale-95 transition-all"
              >
                Conduct Review
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
