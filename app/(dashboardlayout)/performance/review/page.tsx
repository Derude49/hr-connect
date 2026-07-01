"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  Star,
  FileText,
  Flag,
  Target,
} from "lucide-react";

const REVIEWS_STORAGE_KEY = "hr_connect_performance_reviews";

type ReviewFormData = {
  ratings: {
    technical: number;
    delivery: number;
    strategic: number;
  };
  summary: string;
  achievements: string;
  improvements: string;
};

const DEFAULT_REVIEW_FORM: ReviewFormData = {
  ratings: { technical: 0, delivery: 0, strategic: 0 },
  summary: "",
  achievements: "",
  improvements: "",
};

const EMPLOYEE_PROFILES = [
  {
    id: "emp-1",
    initials: "JL",
    name: "Jonathan Lee",
    role: "Senior Frontend Engineer",
    department: "ENGINEERING • REMOTE",
    avatarBg: "bg-blue-100 text-blue-800",
    reviewer: "Sarah Jenkins (Manager)",
    isCurrentUser: true,
  },
  {
    id: "emp-2",
    initials: "SM",
    name: "Sofia Mendez",
    role: "Product Designer",
    department: "DESIGN • SAN FRANCISCO",
    avatarBg: "bg-purple-100 text-purple-800",
    reviewer: "Sarah Jenkins (Manager)",
    isCurrentUser: false,
  },
  {
    id: "emp-3",
    initials: "DC",
    name: "David Chen",
    role: "Data Scientist",
    department: "DATA • NEW YORK",
    avatarBg: "bg-emerald-100 text-emerald-800",
    reviewer: "Sarah Jenkins (Manager)",
    isCurrentUser: false,
  },
] as const;

const EMPLOYEE_PROFILE_MAP = Object.fromEntries(
  EMPLOYEE_PROFILES.map((profile) => [profile.id, profile]),
);

const COMPETENCIES = [
  {
    key: "technical" as const,
    title: "Technical Proficiency",
    description:
      "Ability to apply industry-standard design tools and accessibility frameworks.",
  },
  {
    key: "delivery" as const,
    title: "Project Delivery",
    description:
      "Consistency in meeting project milestones and adherence to design timelines.",
  },
  {
    key: "strategic" as const,
    title: "Strategic Thinking",
    description:
      "Contribution to high-level product strategy and long-term vision alignment.",
  },
];

function getAllSavedReviews(): Record<string, ReviewFormData> {
  if (typeof window === "undefined") return {};
  const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
  return saved ? JSON.parse(saved) : {};
}

function getSavedReview(employeeId: string): ReviewFormData {
  const saved = getAllSavedReviews()[employeeId];
  if (!saved) return { ...DEFAULT_REVIEW_FORM, ratings: { ...DEFAULT_REVIEW_FORM.ratings } };
  return {
    ...saved,
    ratings: { ...saved.ratings },
  };
}

function persistReview(employeeId: string, data: ReviewFormData) {
  const all = getAllSavedReviews();
  all[employeeId] = data;
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(all));
}

function deleteSavedReview(employeeId: string) {
  const all = getAllSavedReviews();
  delete all[employeeId];
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(all));
}

function formsEqual(a: ReviewFormData, b: ReviewFormData) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default function PerformanceReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 p-6 md:p-8 flex items-center justify-center text-sm text-slate-500">
          Loading review...
        </div>
      }
    >
      <PerformanceReviewContent />
    </Suspense>
  );
}

function PerformanceReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("employee");
  const profile = employeeId ? EMPLOYEE_PROFILE_MAP[employeeId] : null;

  const [savedSnapshot, setSavedSnapshot] = useState<ReviewFormData>(
    DEFAULT_REVIEW_FORM,
  );
  const [ratings, setRatings] = useState(DEFAULT_REVIEW_FORM.ratings);
  const [summary, setSummary] = useState("");
  const [achievements, setAchievements] = useState("");
  const [improvements, setImprovements] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null,
  );
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  const getCurrentForm = useCallback(
    (): ReviewFormData => ({
      ratings: { ...ratings },
      summary,
      achievements,
      improvements,
    }),
    [ratings, summary, achievements, improvements],
  );

  const applyFormData = useCallback((data: ReviewFormData) => {
    setRatings({ ...data.ratings });
    setSummary(data.summary);
    setAchievements(data.achievements);
    setImprovements(data.improvements);
    setSavedSnapshot({
      ...data,
      ratings: { ...data.ratings },
    });
  }, []);

  useEffect(() => {
    if (!employeeId || !profile) {
      setIsLoaded(true);
      return;
    }

    const saved = getSavedReview(employeeId);
    applyFormData(saved);
    setIsLoaded(true);
  }, [employeeId, profile, applyFormData]);

  const checkIsFormDirty = useCallback(() => {
    return !formsEqual(getCurrentForm(), savedSnapshot);
  }, [getCurrentForm, savedSnapshot]);

  const handleSaveDraft = useCallback(() => {
    if (!employeeId) return;
    const payload = getCurrentForm();
    persistReview(employeeId, payload);
    setSavedSnapshot({
      ...payload,
      ratings: { ...payload.ratings },
    });
    window.alert("Draft saved successfully.");
  }, [employeeId, getCurrentForm]);

  const resetFormToSaved = useCallback(() => {
    setRatings({ ...savedSnapshot.ratings });
    setSummary(savedSnapshot.summary);
    setAchievements(savedSnapshot.achievements);
    setImprovements(savedSnapshot.improvements);
  }, [savedSnapshot]);

  const attemptNavigation = useCallback(
    (href: string) => {
      if (checkIsFormDirty()) {
        setPendingNavigation(href);
        setShowUnsavedModal(true);
        return;
      }
      router.push(href);
    },
    [checkIsFormDirty, router],
  );

  const completePendingNavigation = useCallback(() => {
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
    setPendingNavigation(null);
    setShowUnsavedModal(false);
  }, [pendingNavigation, router]);

  const handleSaveAndLeave = () => {
    if (!employeeId) return;
    const payload = getCurrentForm();
    persistReview(employeeId, payload);
    setSavedSnapshot({
      ...payload,
      ratings: { ...payload.ratings },
    });
    completePendingNavigation();
  };

  const handleDiscardAndLeave = () => {
    resetFormToSaved();
    completePendingNavigation();
  };

  const handleDiscardChanges = () => {
    if (checkIsFormDirty()) {
      const confirmed = window.confirm(
        "Discard all unsaved changes and revert to the last saved draft?",
      );
      if (!confirmed) return;
    }
    resetFormToSaved();
  };

  const handleDeleteSavedDraft = () => {
    if (!employeeId) return;
    const confirmed = window.confirm(
      `Delete all saved review data for ${profile?.name}? This cannot be undone.`,
    );
    if (!confirmed) return;

    deleteSavedReview(employeeId);
    applyFormData({ ...DEFAULT_REVIEW_FORM, ratings: { ...DEFAULT_REVIEW_FORM.ratings } });
    window.alert("Saved review data deleted.");
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (checkIsFormDirty()) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [checkIsFormDirty]);

  const handleSetRating = (
    competencyKey: "technical" | "delivery" | "strategic",
    score: number,
  ) => {
    setRatings((prev) => ({ ...prev, [competencyKey]: score }));
  };

  useEffect(() => {
    if (isLoaded && (!employeeId || !profile)) {
      router.replace("/performance/reviews");
    }
  }, [isLoaded, employeeId, profile, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-8 flex items-center justify-center text-sm text-slate-500">
        Loading review...
      </div>
    );
  }

  if (!employeeId || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-8 flex items-center justify-center text-sm text-slate-500">
        Redirecting to review targets...
      </div>
    );
  }

  const isDirty = checkIsFormDirty();
  const ratedCount = Object.values(ratings).filter((score) => score > 0).length;
  const narrativeStarted =
    summary.trim().length > 0 ||
    achievements.trim().length > 0 ||
    improvements.trim().length > 0;
  const completionPercent = Math.round(
    ((ratedCount / 3) * 40 +
      (narrativeStarted ? 35 : 0) +
      (summary.trim().length > 20 ? 25 : 0)) /
      1,
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 space-y-6 text-slate-900">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => attemptNavigation("/performance")}
          className="hover:text-slate-600 transition-colors cursor-pointer"
        >
          Performance
        </button>
        <span className="text-slate-300 font-normal">&gt;</span>
        <button
          type="button"
          onClick={() => attemptNavigation("/performance/reviews")}
          className="hover:text-slate-600 transition-colors cursor-pointer"
        >
          Review Targets
        </button>
        <span className="text-slate-300 font-normal">&gt;</span>
        <span className="text-slate-500">{profile.name}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Annual Performance Review — {profile.name}
          </h1>
          <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
            Complete the FY24 review for {profile.name}. Drafts are saved per
            employee and persist until you delete them.
          </p>
          {isDirty && (
            <p className="text-xs font-semibold text-amber-600">
              Unsaved changes — save your draft before leaving this page.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-5 py-2.5 text-xs font-bold text-white bg-slate-950 rounded-lg hover:bg-slate-900 active:scale-95 transition-all cursor-pointer"
          >
            Submit Review
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col space-y-5">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border-2 border-white shadow-xs ${profile.avatarBg}`}
              >
                {profile.initials}
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-slate-800 leading-tight">
                  {profile.name}
                </h3>
                <p className="text-xs text-slate-400 font-semibold">
                  {profile.role}
                </p>
                <span className="inline-block text-[9px] font-bold text-blue-600 tracking-wider">
                  {profile.department}
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs font-semibold">
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-400">Reviewer</span>
                <span className="text-slate-700">{profile.reviewer}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-400">Due Date</span>
                <span className="text-rose-600 font-bold">Oct 15, 2024</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-400">Status</span>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                  {isDirty ? "Unsaved Changes" : "In Progress"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] text-white p-6 rounded-xl shadow-sm flex flex-col space-y-6">
            <div className="space-y-2">
              <h2 className="text-sm font-bold tracking-tight">
                Submission Progress
              </h2>
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>
                  {ratedCount}/3 competencies rated
                </span>
                <span className="font-bold text-white">
                  {Math.min(completionPercent, 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(completionPercent, 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 text-xs font-semibold">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-3" />
                </div>
                <span className="text-slate-300">Personal Information</span>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    ratedCount === 3
                      ? "bg-emerald-500 text-white"
                      : "border-2 border-slate-600 bg-slate-900"
                  }`}
                >
                  {ratedCount === 3 ? (
                    <Check className="w-3.5 h-3.5 stroke-3" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </div>
                <span
                  className={
                    ratedCount === 3 ? "text-slate-300" : "text-white font-bold"
                  }
                >
                  Technical KPI Ratings
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    narrativeStarted
                      ? "bg-emerald-500 text-white"
                      : "border-2 border-slate-600 bg-slate-900"
                  }`}
                >
                  {narrativeStarted ? (
                    <Check className="w-3.5 h-3.5 stroke-3" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </div>
                <span
                  className={
                    narrativeStarted
                      ? "text-slate-300"
                      : "text-white font-bold"
                  }
                >
                  Self-Assessment Narrative
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Star className="w-5 h-5 fill-blue-600" />
              </div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800">
                KPI Rating & Competencies
              </h2>
            </div>

            <div className="space-y-6">
              {COMPETENCIES.map((comp) => {
                const currentScore = ratings[comp.key];

                return (
                  <div
                    key={comp.key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1 max-w-md">
                      <h3 className="text-sm font-bold text-slate-800">
                        {comp.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        {comp.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 self-start sm:self-center">
                      {[1, 2, 3, 4, 5].map((starNum) => {
                        const isFilled = starNum <= currentScore;

                        return (
                          <button
                            key={starNum}
                            type="button"
                            onClick={() => handleSetRating(comp.key, starNum)}
                            className={`p-0.5 transition-all hover:scale-110 active:scale-90 cursor-pointer ${
                              isFilled
                                ? "text-blue-600 hover:text-blue-700"
                                : "text-slate-200 hover:text-slate-400"
                            }`}
                            title={`Rate ${starNum} out of 5`}
                          >
                            <Star
                              className={`w-5 h-5 ${
                                isFilled
                                  ? "fill-blue-600 text-blue-600"
                                  : "text-slate-200"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800">
                Self-Assessment & Achievements
              </h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                  <label htmlFor="summary">
                    Executive Summary of Performance
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold lowercase">
                    {summary.length} / 2000 characters
                  </span>
                </div>
                <textarea
                  id="summary"
                  maxLength={2000}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Briefly summarize your impact over the last 12 months..."
                  rows={4}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/20 resize-none font-medium leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="achievements"
                    className="text-xs font-bold uppercase tracking-wider text-slate-400"
                  >
                    Key Achievements
                  </label>
                  <textarea
                    id="achievements"
                    value={achievements}
                    onChange={(e) => setAchievements(e.target.value)}
                    placeholder="List 3-5 measurable wins (e.g. 'Reduced churn by 12% via UX redesign')..."
                    rows={4}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/20 resize-none font-medium leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="improvements"
                    className="text-xs font-bold uppercase tracking-wider text-slate-400"
                  >
                    Areas for Improvement
                  </label>
                  <textarea
                    id="improvements"
                    value={improvements}
                    onChange={(e) => setImprovements(e.target.value)}
                    placeholder="Identify professional growth areas or skills you wish to strengthen..."
                    rows={4}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/20 resize-none font-medium leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Flag className="w-5 h-5 fill-blue-600 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800">
                Future Development Goals
              </h2>
            </div>

            <div className="border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-10 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-xs text-blue-600">
                <Target className="w-5 h-5" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="text-sm font-bold text-slate-800">
                  No goals defined yet for the next period
                </h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  Add objectives for FY25 to align with the roadmap.
                </p>
              </div>
              <button
                type="button"
                onClick={() => attemptNavigation("/performance/goals")}
                className="px-4 py-2 text-xs font-bold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 active:scale-95 transition-all cursor-pointer"
              >
                + Add Performance Goal
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 mt-4 pb-12">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer active:scale-95"
              >
                Discard Unsaved Changes
              </button>
              <button
                type="button"
                onClick={handleDeleteSavedDraft}
                className="text-xs font-bold text-rose-400 hover:text-rose-600 transition-colors cursor-pointer active:scale-95"
              >
                Delete Saved Draft
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2.5 text-xs font-bold text-white bg-slate-950 rounded-lg hover:bg-slate-900 active:scale-95 transition-all cursor-pointer"
              >
                Submit Final Review
              </button>
            </div>
          </div>
        </div>
      </div>

      {showUnsavedModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl border border-slate-100 shadow-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Unsaved Changes</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              You have unsaved changes for {profile.name}&apos;s review. Save
              your work before leaving, or discard the changes and continue.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPendingNavigation(null);
                  setShowUnsavedModal(false);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDiscardAndLeave}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Discard & Leave
              </button>
              <button
                type="button"
                onClick={handleSaveAndLeave}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Save & Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
