"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  FileUp,
  ChevronRight,
  RefreshCw,
  Info,
  ClipboardList,
  Check,
} from "lucide-react";

const DRAFT_STORAGE_KEY = "hr_connect_leave_draft";
const REQUESTS_STORAGE_KEY = "hr_connect_leave_requests";

type LeaveDraft = {
  employeeName: string;
  employeeRole: string;
  leaveType: string;
  urgency: string;
  startDate: string;
  endDate: string;
  reason: string;
  uploadedFile: string | null;
};

type LeaveRequest = {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarBg: string;
  leaveType: string;
  typeColor: string;
  dates: string;
  duration: string;
  status: string;
};

const DEFAULT_DRAFT: LeaveDraft = {
  employeeName: "",
  employeeRole: "",
  leaveType: "",
  urgency: "Standard",
  startDate: "",
  endDate: "",
  reason: "",
  uploadedFile: null,
};

const AVATAR_BACKGROUNDS = [
  "bg-blue-100 text-blue-800",
  "bg-purple-100 text-purple-800",
  "bg-emerald-100 text-emerald-800",
  "bg-slate-200 text-slate-800",
  "bg-rose-100 text-rose-800",
];

const LEAVE_TYPE_MAP: Record<
  string,
  { label: string; typeColor: string }
> = {
  ANNUAL: { label: "Annual Leave", typeColor: "bg-blue-500" },
  SICK: { label: "Sick Leave", typeColor: "bg-rose-500" },
  PERSONAL: { label: "Personal Leave", typeColor: "bg-slate-400" },
  MATERNITY: { label: "Maternity Leave", typeColor: "bg-slate-400" },
};

function getSavedDraft(): LeaveDraft {
  if (typeof window === "undefined") return DEFAULT_DRAFT;
  const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
  if (!saved) return { ...DEFAULT_DRAFT };
  return { ...DEFAULT_DRAFT, ...JSON.parse(saved) };
}

function persistDraft(draft: LeaveDraft) {
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

function clearDraft() {
  localStorage.removeItem(DRAFT_STORAGE_KEY);
}

function formsEqual(a: LeaveDraft, b: LeaveDraft) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function pickAvatarBg(name: string) {
  const index =
    name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    AVATAR_BACKGROUNDS.length;
  return AVATAR_BACKGROUNDS[index];
}

function formatDateRange(start: string, end: string) {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const startLabel = new Date(start).toLocaleDateString("en-US", options);
  const endLabel = new Date(end).toLocaleDateString("en-US", options);
  return `${startLabel} - ${endLabel}`;
}

function calculateDuration(start: string, end: string) {
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  const days = Math.floor((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1;
  return days === 1 ? "1 Day" : `${days} Days`;
}

function getExistingRequests(): LeaveRequest[] {
  const saved = localStorage.getItem(REQUESTS_STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export default function ApplyForLeavePage() {
  const router = useRouter();

  const [savedSnapshot, setSavedSnapshot] = useState<LeaveDraft>(DEFAULT_DRAFT);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [urgency, setUrgency] = useState("Standard");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("Today, 09:42 AM");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null,
  );
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const applyDraft = useCallback((draft: LeaveDraft) => {
    setEmployeeName(draft.employeeName);
    setEmployeeRole(draft.employeeRole);
    setLeaveType(draft.leaveType);
    setUrgency(draft.urgency);
    setStartDate(draft.startDate);
    setEndDate(draft.endDate);
    setReason(draft.reason);
    setUploadedFile(draft.uploadedFile);
    setSavedSnapshot({ ...draft });
  }, []);

  useEffect(() => {
    applyDraft(getSavedDraft());
    setIsLoaded(true);
  }, [applyDraft]);

  const getCurrentForm = useCallback(
    (): LeaveDraft => ({
      employeeName,
      employeeRole,
      leaveType,
      urgency,
      startDate,
      endDate,
      reason,
      uploadedFile,
    }),
    [
      employeeName,
      employeeRole,
      leaveType,
      urgency,
      startDate,
      endDate,
      reason,
      uploadedFile,
    ],
  );

  const checkIsFormDirty = useCallback(() => {
    return !formsEqual(getCurrentForm(), savedSnapshot);
  }, [getCurrentForm, savedSnapshot]);

  const resetFormToSaved = useCallback(() => {
    applyDraft(savedSnapshot);
  }, [applyDraft, savedSnapshot]);

  const handleSaveDraft = useCallback(() => {
    const payload = getCurrentForm();
    persistDraft(payload);
    setSavedSnapshot({ ...payload });
    window.alert("Draft saved. You can return to finish this application later.");
  }, [getCurrentForm]);

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
    handleSaveDraft();
    completePendingNavigation();
  };

  const handleDiscardAndLeave = () => {
    resetFormToSaved();
    completePendingNavigation();
  };

  const handleDiscardChanges = () => {
    if (!checkIsFormDirty()) return;
    const confirmed = window.confirm(
      "Discard unsaved changes and revert to your last saved draft?",
    );
    if (!confirmed) return;
    resetFormToSaved();
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

  const handleSimulateUpload = () => {
    setUploadedFile("medical_certificate.pdf");
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
  };

  const handleRefreshBalance = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    setTimeout(() => {
      setLastUpdated("Today, 03:28 PM");
      setIsRefreshing(false);
    }, 800);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeName.trim()) {
      window.alert("Please enter your full name.");
      return;
    }
    if (!leaveType) {
      window.alert("Please select a leave type.");
      return;
    }
    if (!startDate || !endDate) {
      window.alert("Please select both start and end dates.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      window.alert("End date cannot be before start date.");
      return;
    }
    if (!reason.trim()) {
      window.alert("Please provide a reason for your leave request.");
      return;
    }

    const typeMeta = LEAVE_TYPE_MAP[leaveType];
    const newRequest: LeaveRequest = {
      id: `req-${Date.now()}`,
      name: employeeName.trim(),
      role: employeeRole.trim() || "Employee",
      initials: getInitials(employeeName),
      avatarBg: pickAvatarBg(employeeName),
      leaveType: typeMeta.label,
      typeColor: typeMeta.typeColor,
      dates: formatDateRange(startDate, endDate),
      duration: calculateDuration(startDate, endDate),
      status: "Pending",
    };

    const existing = getExistingRequests();
    const updated = [newRequest, ...existing];
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(updated));

    clearDraft();
    const emptyDraft = { ...DEFAULT_DRAFT };
    setSavedSnapshot(emptyDraft);
    applyDraft(emptyDraft);
    setSubmitSuccess(true);

    window.alert(
      `Leave application submitted for ${newRequest.name}. It is now pending approval on the Leave Management dashboard.`,
    );
    router.push("/leave");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-8 flex items-center justify-center text-sm text-slate-500">
        Loading application form...
      </div>
    );
  }

  const isDirty = checkIsFormDirty();

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 space-y-6 text-slate-900">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => attemptNavigation("/leave")}
          className="hover:text-slate-600 transition-colors cursor-pointer"
        >
          Leave Management
        </button>
        <span className="text-slate-300 font-normal">&gt;</span>
        <span className="text-slate-500">New Application</span>
      </div>

      <div className="space-y-1 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Apply for Leave
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
          Submit your request for time off. Save a draft to continue later, or
          submit to add a pending request to the leave dashboard.
        </p>
        {isDirty && (
          <p className="text-xs font-semibold text-amber-600">
            Unsaved changes — save your draft before leaving this page.
          </p>
        )}
        {submitSuccess && (
          <p className="text-xs font-semibold text-emerald-600">
            Application submitted successfully.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <form
            onSubmit={handleSubmitApplication}
            className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label
                  htmlFor="employeeName"
                  className="text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  Employee Name *
                </label>
                <input
                  id="employeeName"
                  type="text"
                  required
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholder="e.g., Elena Rodriguez"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/50 font-semibold text-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="employeeRole"
                  className="text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  Job Title
                </label>
                <input
                  id="employeeRole"
                  type="text"
                  value={employeeRole}
                  onChange={(e) => setEmployeeRole(e.target.value)}
                  placeholder="e.g., Product Designer"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/50 font-semibold text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label
                  htmlFor="leaveType"
                  className="text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  Leave Type *
                </label>
                <div className="relative">
                  <select
                    id="leaveType"
                    required
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/50 cursor-pointer appearance-none font-semibold text-slate-700"
                  >
                    <option value="" disabled>
                      Select a leave category
                    </option>
                    <option value="ANNUAL">Annual Leave</option>
                    <option value="SICK">Sick Leave</option>
                    <option value="PERSONAL">Personal Leave</option>
                    <option value="MATERNITY">Parental Leave</option>
                  </select>
                  <div className="absolute right-3 top-3 text-slate-400 pointer-events-none">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Urgency
                </span>
                <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-lg h-[42px] items-center">
                  <button
                    type="button"
                    onClick={() => setUrgency("Standard")}
                    className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      urgency === "Standard"
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200/50"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency("Urgent")}
                    className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      urgency === "Urgent"
                        ? "bg-white text-rose-600 shadow-xs border border-slate-200/50"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Urgent
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label
                  htmlFor="startDate"
                  className="text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  Start Date *
                </label>
                <input
                  id="startDate"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/50 font-semibold text-slate-700 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="endDate"
                  className="text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  End Date *
                </label>
                <input
                  id="endDate"
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/50 font-semibold text-slate-700 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="reason"
                className="text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                Reason for Leave *
              </label>
              <textarea
                id="reason"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe the reason for your leave request..."
                rows={4}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/20 resize-none font-semibold text-slate-700 leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Supporting Documents
              </span>
              <div
                onClick={handleSimulateUpload}
                className="border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-6 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                {!uploadedFile ? (
                  <>
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                      <FileUp className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800">
                        Click to upload or drag and drop
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                        Medical certificates, travel docs (Max 10MB)
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-bold animate-in zoom-in-95 duration-200">
                    <span>{uploadedFile}</span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="w-4 h-4 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800 flex items-center justify-center font-bold text-[10px] cursor-pointer"
                      title="Remove file"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                Discard Unsaved Changes
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-all active:scale-95"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#0f172a] rounded-lg hover:bg-slate-800 cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span>Submit Application</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1 flex flex-col space-y-6">
          <div className="bg-[#0b1329] text-white p-6 rounded-xl border border-slate-800/80 shadow-lg flex flex-col justify-between h-[450px] relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="absolute -right-4 -top-4 pointer-events-none text-slate-800/30 rotate-12 z-0">
              <ClipboardList className="w-28 h-28 stroke-[1]" />
            </div>

            <div className="relative z-10">
              <h2 className="text-base font-bold tracking-tight text-white">
                Leave Balance
              </h2>
            </div>

            <div className="space-y-3.5 my-2 relative z-10">
              <div className="bg-white/[0.04] border border-white/[0.08] p-4 rounded-xl flex flex-col space-y-2 backdrop-blur-md shadow-md shadow-black/20 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
                <div className="flex items-baseline justify-between text-xs font-semibold text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Annual Leave
                  </span>
                  <span className="text-white font-bold">
                    <span className="text-base">14.5</span> Days
                  </span>
                </div>
                <div className="w-full bg-slate-950/40 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-300/80 rounded-full"
                    style={{ width: "48%" }}
                  />
                </div>
                <div className="text-[9px] text-slate-400 font-semibold">
                  Expires in 122 days
                </div>
              </div>

              <div className="bg-white/[0.04] border border-white/[0.08] p-4 rounded-xl flex flex-col space-y-2 backdrop-blur-md shadow-md shadow-black/20 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
                <div className="flex items-baseline justify-between text-xs font-semibold text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Sick Leave
                  </span>
                  <span className="text-white font-bold">
                    <span className="text-base">08</span> Days
                  </span>
                </div>
                <div className="w-full bg-slate-950/40 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: "53%" }}
                  />
                </div>
              </div>

              <div className="bg-white/[0.04] border border-white/[0.08] p-4 rounded-xl flex flex-col space-y-2 backdrop-blur-md shadow-md shadow-black/20 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
                <div className="flex items-baseline justify-between text-xs font-semibold text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Personal Leave
                  </span>
                  <span className="text-white font-bold">
                    <span className="text-base">03</span> Days
                  </span>
                </div>
                <div className="w-full bg-slate-950/40 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-400/50 rounded-full"
                    style={{ width: "20%" }}
                  />
                </div>
              </div>
            </div>

            <div className="-mx-6 -mb-6 bg-slate-950/30 border-t border-slate-800/60 px-6 py-4 flex items-center justify-between text-[10px] text-slate-400 font-semibold mt-2 relative z-10">
              <span>Last updated: {lastUpdated}</span>
              <button
                type="button"
                onClick={handleRefreshBalance}
                className="p-1 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer active:scale-95 text-slate-400"
                title="Refresh balances"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-400" : ""}`}
                />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Info className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold tracking-tight text-slate-800">
                Company Guidelines
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Requests for more than 5 days must be submitted{" "}
                  <span className="font-bold text-slate-800">2 weeks</span> in
                  advance.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Medical certificate is{" "}
                  <span className="font-bold text-slate-800">mandatory</span>{" "}
                  for sick leave exceeding 2 consecutive days.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Approval usually takes{" "}
                  <span className="font-bold text-slate-800">24-48 hours</span>{" "}
                  from your direct manager.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-2.5 text-xs font-bold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-all cursor-pointer active:scale-95 text-center mt-2"
            >
              View Full Policy
            </button>
          </div>
        </div>
      </div>

      {showUnsavedModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl border border-slate-100 shadow-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Unsaved Changes</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              You have unsaved changes on this leave application. Save your
              draft before leaving, or discard the changes and continue.
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
