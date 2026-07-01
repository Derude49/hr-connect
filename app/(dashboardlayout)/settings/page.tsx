"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  Building2,
  Shield,
  Bell,
  FileText,
  Lock,
  Info,
  FileUp,
  ChevronDown,
  Plus,
  SlidersHorizontal,
  Trash2,
  Mail,
  MessageSquare,
  Plane,
  Coins,
  Globe, // Imported for IP Whitelisting card header
} from "lucide-react";

const SETTINGS_CATEGORIES = [
  { id: "general", label: "General Company", icon: Building2 },
  { id: "rbac", label: "Role & Access (RBAC)", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "rules", label: "Leave & Salary Rules", icon: FileText },
  { id: "security", label: "Security & Auth", icon: Lock },
];

const DEFAULT_GLOBAL_SETTINGS = {
  legalName: "HR Connect Enterprises",
  domainName: "hrconnect.corp",
  industry: "Technology",
  logoUploaded: false,
  timezone: "(UTC+05:30) Mumbai",
  dateFormat: "DD/MM/YYYY",
  emailDigest: true,
  smsAlerts: false,
  annualLeaveCredit: 21,
  carryForwardLimit: 5,
  allowHalfDay: false,
  payrollCycleDate: "25th of every month",
  currency: "INR (₹)",
  enableOvertime: true,
  // 1. DYNAMIC SECURITY DEFAULTS
  twoFactorEnabled: true,
  sessionTimeout: "30 Minutes",
  whitelistedIps: ["192.168.1.1"],
};

const INITIAL_ROLES_DATA = [
  {
    id: "role-1",
    name: "Super Admin",
    description: "Unrestricted platform access",
    assignedCount: 3,
    permissions: ["ALL_ACCESS"],
    dotColor: "bg-blue-500",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-100",
  },
  {
    id: "role-2",
    name: "Department Head",
    description: "Access to team-specific data",
    assignedCount: 12,
    permissions: ["VIEW_TEAM", "APPROVE_LEAVE"],
    dotColor: "bg-slate-800",
    badgeColor: "bg-slate-50 text-slate-700 border-slate-200",
  },
];

const RATINGS_DATA = [
  { label: "1 - Poor", value: 4 },
  { label: "2 - Fair", value: 12 },
  { label: "3 - Good", value: 38 },
  { label: "4 - V. Good", value: 29 },
  { label: "5 - Excellent", value: 16 },
];

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  // General Company Settings States
  const [legalName, setLegalName] = useState(DEFAULT_GLOBAL_SETTINGS.legalName);
  const [domainName, setDomainName] = useState(
    DEFAULT_GLOBAL_SETTINGS.domainName,
  );
  const [industry, setIndustry] = useState(DEFAULT_GLOBAL_SETTINGS.industry);
  const [logoUploaded, setLogoUploaded] = useState(
    DEFAULT_GLOBAL_SETTINGS.logoUploaded,
  );

  // Localization Settings States
  const [timezone, setTimezone] = useState(DEFAULT_GLOBAL_SETTINGS.timezone);
  const [dateFormat, setDateFormat] = useState(
    DEFAULT_GLOBAL_SETTINGS.dateFormat,
  );

  // Notification States
  const [emailDigest, setEmailDigest] = useState(
    DEFAULT_GLOBAL_SETTINGS.emailDigest,
  );
  const [smsAlerts, setSmsAlerts] = useState(DEFAULT_GLOBAL_SETTINGS.smsAlerts);

  // Leave & Salary Rules States
  const [annualLeaveCredit, setAnnualLeaveCredit] = useState(
    DEFAULT_GLOBAL_SETTINGS.annualLeaveCredit,
  );
  const [carryForwardLimit, setCarryForwardLimit] = useState(
    DEFAULT_GLOBAL_SETTINGS.carryForwardLimit,
  );
  const [allowHalfDay, setAllowHalfDay] = useState(
    DEFAULT_GLOBAL_SETTINGS.allowHalfDay,
  );
  const [payrollCycleDate, setPayrollCycleDate] = useState(
    DEFAULT_GLOBAL_SETTINGS.payrollCycleDate,
  );
  const [currency, setCurrency] = useState(DEFAULT_GLOBAL_SETTINGS.currency);
  const [enableOvertime, setEnableOvertime] = useState(
    DEFAULT_GLOBAL_SETTINGS.enableOvertime,
  );

  // 2. SECURITY & AUTHENTICATION STATES
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    DEFAULT_GLOBAL_SETTINGS.twoFactorEnabled,
  );
  const [sessionTimeout, setSessionTimeout] = useState(
    DEFAULT_GLOBAL_SETTINGS.sessionTimeout,
  );
  const [whitelistedIps, setWhitelistedIps] = useState<string[]>(
    DEFAULT_GLOBAL_SETTINGS.whitelistedIps,
  );
  const [newIpInput, setNewIpInput] = useState(""); // Holds active typing inside IP text input

  // RBAC System States
  const [roles, setRoles] = useState(INITIAL_ROLES_DATA);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [newRoleAssigned, setNewRoleAssigned] = useState(1);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Adjust Permissions States
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<
    (typeof INITIAL_ROLES_DATA)[0] | null
  >(null);
  const [editPermissions, setEditPermissions] = useState<string[]>([]);

  const [animate, setAnimate] = useState(false);

  const maxRatingValue = Math.max(...RATINGS_DATA.map((item) => item.value));

  useEffect(() => {
    // 3. LOAD SYNCHRONIZED STATES ON MOUNT (Including new Security configurations)
    const savedSettings = localStorage.getItem("hr_connect_global_settings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setLegalName(parsed.legalName);
      setDomainName(parsed.domainName);
      setIndustry(parsed.industry);
      setLogoUploaded(parsed.logoUploaded);
      setTimezone(parsed.timezone);
      setDateFormat(parsed.dateFormat);

      setEmailDigest(
        parsed.emailDigest !== undefined
          ? parsed.emailDigest
          : DEFAULT_GLOBAL_SETTINGS.emailDigest,
      );
      setSmsAlerts(
        parsed.smsAlerts !== undefined
          ? parsed.smsAlerts
          : DEFAULT_GLOBAL_SETTINGS.smsAlerts,
      );

      setAnnualLeaveCredit(
        parsed.annualLeaveCredit !== undefined
          ? parsed.annualLeaveCredit
          : DEFAULT_GLOBAL_SETTINGS.annualLeaveCredit,
      );
      setCarryForwardLimit(
        parsed.carryForwardLimit !== undefined
          ? parsed.carryForwardLimit
          : DEFAULT_GLOBAL_SETTINGS.carryForwardLimit,
      );
      setAllowHalfDay(
        parsed.allowHalfDay !== undefined
          ? parsed.allowHalfDay
          : DEFAULT_GLOBAL_SETTINGS.allowHalfDay,
      );
      setPayrollCycleDate(
        parsed.payrollCycleDate !== undefined
          ? parsed.payrollCycleDate
          : DEFAULT_GLOBAL_SETTINGS.payrollCycleDate,
      );
      setCurrency(
        parsed.currency !== undefined
          ? parsed.currency
          : DEFAULT_GLOBAL_SETTINGS.currency,
      );
      setEnableOvertime(
        parsed.enableOvertime !== undefined
          ? parsed.enableOvertime
          : DEFAULT_GLOBAL_SETTINGS.enableOvertime,
      );

      // Load security states with standard fallback defaults
      setTwoFactorEnabled(
        parsed.twoFactorEnabled !== undefined
          ? parsed.twoFactorEnabled
          : DEFAULT_GLOBAL_SETTINGS.twoFactorEnabled,
      );
      setSessionTimeout(
        parsed.sessionTimeout !== undefined
          ? parsed.sessionTimeout
          : DEFAULT_GLOBAL_SETTINGS.sessionTimeout,
      );
      setWhitelistedIps(
        parsed.whitelistedIps !== undefined
          ? parsed.whitelistedIps
          : DEFAULT_GLOBAL_SETTINGS.whitelistedIps,
      );
    } else {
      localStorage.setItem(
        "hr_connect_global_settings",
        JSON.stringify(DEFAULT_GLOBAL_SETTINGS),
      );
    }

    const savedRoles = localStorage.getItem("hr_connect_rbac_roles_v2");
    if (savedRoles) {
      setRoles(JSON.parse(savedRoles));
    } else {
      localStorage.setItem(
        "hr_connect_rbac_roles_v2",
        JSON.stringify(INITIAL_ROLES_DATA),
      );
    }

    const animationTimer = setTimeout(() => {
      setAnimate(true);
    }, 50);

    return () => clearTimeout(animationTimer);
  }, []);

  const handleSimulateLogoUpload = () => {
    setLogoUploaded(!logoUploaded);
  };

  const handleTogglePermission = (permissionTag: string) => {
    if (selectedPermissions.includes(permissionTag)) {
      setSelectedPermissions(
        selectedPermissions.filter((p) => p !== permissionTag),
      );
    } else {
      setSelectedPermissions([...selectedPermissions, permissionTag]);
    }
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRoleName.trim() || !newRoleDescription.trim()) return;

    const newRoleObj = {
      id: `role-${Date.now()}`,
      name: newRoleName,
      description: newRoleDescription,
      assignedCount: newRoleAssigned,
      permissions:
        selectedPermissions.length > 0 ? selectedPermissions : ["VIEW_TEAM"],
      dotColor: "bg-slate-800",
      badgeColor: "bg-slate-50 text-slate-700 border-slate-200",
    };

    const updatedRolesList = [...roles, newRoleObj];

    setRoles(updatedRolesList);
    localStorage.setItem(
      "hr_connect_rbac_roles_v2",
      JSON.stringify(updatedRolesList),
    );

    setNewRoleName("");
    setNewRoleDescription("");
    setNewRoleAssigned(1);
    setSelectedPermissions([]);

    setIsRoleModalOpen(false);
  };

  const handleDeleteRole = (targetId: string, roleName: string) => {
    if (targetId === "role-1") {
      window.alert(
        "SECURITY ERROR: The 'Super Admin' role is a default system override and cannot be deleted.",
      );
      return;
    }

    const confirmMessage = `Are you sure you want to permanently delete the "${roleName}" security role? \n\nThis action cannot be undone.`;
    const hasConfirmed = window.confirm(confirmMessage);

    if (hasConfirmed) {
      const updatedList = roles.filter((role) => role.id !== targetId);
      setRoles(updatedList);
      localStorage.setItem(
        "hr_connect_rbac_roles_v2",
        JSON.stringify(updatedList),
      );
    }
  };

  const handleOpenEditModal = (role: (typeof INITIAL_ROLES_DATA)[0]) => {
    setSelectedRoleForEdit(role);
    setEditPermissions(role.permissions);
  };

  const handleToggleEditPermission = (permissionTag: string) => {
    if (editPermissions.includes(permissionTag)) {
      setEditPermissions(editPermissions.filter((p) => p !== permissionTag));
    } else {
      setEditPermissions([...editPermissions, permissionTag]);
    }
  };

  const handleSaveEditPermissions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleForEdit) return;

    const updatedList = roles.map((role) => {
      if (role.id === selectedRoleForEdit.id) {
        return {
          ...role,
          permissions:
            editPermissions.length > 0 ? editPermissions : ["VIEW_TEAM"],
        };
      }
      return role;
    });

    setRoles(updatedList);
    localStorage.setItem(
      "hr_connect_rbac_roles_v2",
      JSON.stringify(updatedList),
    );

    setSelectedRoleForEdit(null);
    setEditPermissions([]);
  };

  // 4. INTERACTION HANDLER: Adds a new IP string to the whitelisting array state
  const handleAddIpAddress = () => {
    if (!newIpInput.trim()) return;

    // Simple structural string pattern check to make sure it looks like an IP
    if (!newIpInput.includes(".")) {
      window.alert("VALIDATION ERROR: Please enter a valid IP address.");
      return;
    }

    // Append to array state
    setWhitelistedIps([...whitelistedIps, newIpInput.trim()]);
    setNewIpInput(""); // Clear the input field
  };

  // 5. INTERACTION HANDLER: Removes an IP string from the array state
  const handleRemoveIpAddress = (targetIp: string) => {
    setWhitelistedIps(whitelistedIps.filter((ip) => ip !== targetIp));
  };

  const getSavedSettings = () => {
    const saved = localStorage.getItem("hr_connect_global_settings");
    return saved ? JSON.parse(saved) : DEFAULT_GLOBAL_SETTINGS;
  };

  // 6. DIRTINESS EVALUATOR: Extended to compare the security settings as well
  const checkIsFormDirty = () => {
    const saved = getSavedSettings();
    return (
      legalName !== saved.legalName ||
      domainName !== saved.domainName ||
      industry !== saved.industry ||
      logoUploaded !== saved.logoUploaded ||
      timezone !== saved.timezone ||
      dateFormat !== saved.dateFormat ||
      emailDigest !==
        (saved.emailDigest ?? DEFAULT_GLOBAL_SETTINGS.emailDigest) ||
      smsAlerts !== (saved.smsAlerts ?? DEFAULT_GLOBAL_SETTINGS.smsAlerts) ||
      annualLeaveCredit !==
        (saved.annualLeaveCredit ??
          DEFAULT_GLOBAL_SETTINGS.annualLeaveCredit) ||
      carryForwardLimit !==
        (saved.carryForwardLimit ??
          DEFAULT_GLOBAL_SETTINGS.carryForwardLimit) ||
      allowHalfDay !==
        (saved.allowHalfDay ?? DEFAULT_GLOBAL_SETTINGS.allowHalfDay) ||
      payrollCycleDate !==
        (saved.payrollCycleDate ?? DEFAULT_GLOBAL_SETTINGS.payrollCycleDate) ||
      currency !== (saved.currency ?? DEFAULT_GLOBAL_SETTINGS.currency) ||
      enableOvertime !==
        (saved.enableOvertime ?? DEFAULT_GLOBAL_SETTINGS.enableOvertime) ||
      // Compare security states
      twoFactorEnabled !==
        (saved.twoFactorEnabled ?? DEFAULT_GLOBAL_SETTINGS.twoFactorEnabled) ||
      sessionTimeout !==
        (saved.sessionTimeout ?? DEFAULT_GLOBAL_SETTINGS.sessionTimeout) ||
      JSON.stringify(whitelistedIps) !==
        JSON.stringify(
          saved.whitelistedIps ?? DEFAULT_GLOBAL_SETTINGS.whitelistedIps,
        )
    );
  };

  // 7. EXTENDED MANUAL SAVE: Writes your security inputs to the unified storage key
  const handleSaveAllConfigurations = () => {
    const payload = {
      legalName,
      domainName,
      industry,
      logoUploaded,
      timezone,
      dateFormat,
      emailDigest,
      smsAlerts,
      annualLeaveCredit,
      carryForwardLimit,
      allowHalfDay,
      payrollCycleDate,
      currency,
      enableOvertime,
      // Saved fields
      twoFactorEnabled,
      sessionTimeout,
      whitelistedIps,
    };

    localStorage.setItem("hr_connect_global_settings", JSON.stringify(payload));
    window.alert("SUCCESS: System configurations saved successfully!");
  };

  // 8. EXTENDED DISCARD: Restores last-saved security inputs
  const handleDiscardChanges = () => {
    const savedSettings = localStorage.getItem("hr_connect_global_settings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);

      setLegalName(parsed.legalName);
      setDomainName(parsed.domainName);
      setIndustry(parsed.industry);
      setLogoUploaded(parsed.logoUploaded);
      setTimezone(parsed.timezone);
      setDateFormat(parsed.dateFormat);

      setEmailDigest(
        parsed.emailDigest !== undefined
          ? parsed.emailDigest
          : DEFAULT_GLOBAL_SETTINGS.emailDigest,
      );
      setSmsAlerts(
        parsed.smsAlerts !== undefined
          ? parsed.smsAlerts
          : DEFAULT_GLOBAL_SETTINGS.smsAlerts,
      );

      setAnnualLeaveCredit(
        parsed.annualLeaveCredit !== undefined
          ? parsed.annualLeaveCredit
          : DEFAULT_GLOBAL_SETTINGS.annualLeaveCredit,
      );
      setCarryForwardLimit(
        parsed.carryForwardLimit !== undefined
          ? parsed.carryForwardLimit
          : DEFAULT_GLOBAL_SETTINGS.carryForwardLimit,
      );
      setAllowHalfDay(
        parsed.allowHalfDay !== undefined
          ? parsed.allowHalfDay
          : DEFAULT_GLOBAL_SETTINGS.allowHalfDay,
      );
      setPayrollCycleDate(
        parsed.payrollCycleDate !== undefined
          ? parsed.payrollCycleDate
          : DEFAULT_GLOBAL_SETTINGS.payrollCycleDate,
      );
      setCurrency(
        parsed.currency !== undefined
          ? parsed.currency
          : DEFAULT_GLOBAL_SETTINGS.currency,
      );
      setEnableOvertime(
        parsed.enableOvertime !== undefined
          ? parsed.enableOvertime
          : DEFAULT_GLOBAL_SETTINGS.enableOvertime,
      );

      setTwoFactorEnabled(
        parsed.twoFactorEnabled !== undefined
          ? parsed.twoFactorEnabled
          : DEFAULT_GLOBAL_SETTINGS.twoFactorEnabled,
      );
      setSessionTimeout(
        parsed.sessionTimeout !== undefined
          ? parsed.sessionTimeout
          : DEFAULT_GLOBAL_SETTINGS.sessionTimeout,
      );
      setWhitelistedIps(
        parsed.whitelistedIps !== undefined
          ? parsed.whitelistedIps
          : DEFAULT_GLOBAL_SETTINGS.whitelistedIps,
      );

      window.alert("INFO: All unsaved modifications have been discarded.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 space-y-6 text-slate-900">
      {/* SECTION 1: HEADER SECTION BLOCK */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            System Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure your enterprise-wide HR parameters and global policies.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDiscardChanges}
            className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
          >
            Discard Changes
          </button>

          <button
            onClick={handleSaveAllConfigurations}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#0f172a] rounded-lg hover:bg-slate-800 active:scale-95 transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4 text-slate-400" />
            <span>Save All Configurations</span>
          </button>
        </div>
      </div>

      {/* TWO-COLUMN RESPONSIVE LAYOUT SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Settings Categories Menu */}
        <div className="lg:col-span-1 flex flex-col justify-between bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-[480px] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Categories
            </span>

            <div className="space-y-1.5">
              {SETTINGS_CATEGORIES.map((category) => {
                const IconComponent = category.icon;
                const isActive = activeTab === category.id;

                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      if (checkIsFormDirty()) {
                        const hasConfirmed = window.confirm(
                          "WARNING: You have unsaved changes inside your active settings panel.\n\nAre you sure you want to discard them and leave?",
                        );

                        if (!hasConfirmed) {
                          return;
                        }

                        const saved = getSavedSettings();
                        setLegalName(saved.legalName);
                        setDomainName(saved.domainName);
                        setIndustry(saved.industry);
                        setLogoUploaded(saved.logoUploaded);
                        setTimezone(saved.timezone);
                        setDateFormat(saved.dateFormat);
                        setEmailDigest(
                          saved.emailDigest !== undefined
                            ? saved.emailDigest
                            : DEFAULT_GLOBAL_SETTINGS.emailDigest,
                        );
                        setSmsAlerts(
                          saved.smsAlerts !== undefined
                            ? saved.smsAlerts
                            : DEFAULT_GLOBAL_SETTINGS.smsAlerts,
                        );

                        setAnnualLeaveCredit(
                          saved.annualLeaveCredit !== undefined
                            ? saved.annualLeaveCredit
                            : DEFAULT_GLOBAL_SETTINGS.annualLeaveCredit,
                        );
                        setCarryForwardLimit(
                          saved.carryForwardLimit !== undefined
                            ? saved.carryForwardLimit
                            : DEFAULT_GLOBAL_SETTINGS.carryForwardLimit,
                        );
                        setAllowHalfDay(
                          saved.allowHalfDay !== undefined
                            ? saved.allowHalfDay
                            : DEFAULT_GLOBAL_SETTINGS.allowHalfDay,
                        );
                        setPayrollCycleDate(
                          saved.payrollCycleDate !== undefined
                            ? saved.payrollCycleDate
                            : DEFAULT_GLOBAL_SETTINGS.payrollCycleDate,
                        );
                        setCurrency(
                          saved.currency !== undefined
                            ? saved.currency
                            : DEFAULT_GLOBAL_SETTINGS.currency,
                        );
                        setEnableOvertime(
                          saved.enableOvertime !== undefined
                            ? saved.enableOvertime
                            : DEFAULT_GLOBAL_SETTINGS.enableOvertime,
                        );

                        setTwoFactorEnabled(
                          saved.twoFactorEnabled !== undefined
                            ? saved.twoFactorEnabled
                            : DEFAULT_GLOBAL_SETTINGS.twoFactorEnabled,
                        );
                        setSessionTimeout(
                          saved.sessionTimeout !== undefined
                            ? saved.sessionTimeout
                            : DEFAULT_GLOBAL_SETTINGS.sessionTimeout,
                        );
                        setWhitelistedIps(
                          saved.whitelistedIps !== undefined
                            ? saved.whitelistedIps
                            : DEFAULT_GLOBAL_SETTINGS.whitelistedIps,
                        );
                      }

                      setActiveTab(category.id);
                    }}
                    className={`w-full px-4 py-3 rounded-xl flex items-center gap-3.5 text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-50/50 text-blue-700 border border-blue-100/30"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`}
                    />
                    <span className="text-left leading-none">
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Last backup
              </h4>
              <p className="text-[11px] font-bold text-slate-700 mt-1">
                Today at 04:00 AM
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Settings Content Panel */}
        <div className="lg:col-span-2">
          {activeTab === "general" ? (
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-auto lg:h-[480px] flex flex-col justify-between animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                {/* Panel Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-base font-bold tracking-tight text-slate-800">
                    General Company Settings
                  </h2>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-100 text-blue-700 rounded border border-blue-200/50">
                    Global
                  </span>
                </div>

                {/* ROW 1: COMPANY IDENTITY SUB-GRID */}
                <div className="flex flex-col sm:flex-row gap-6 border-b border-slate-100 pb-6">
                  <div className="space-y-1 w-full sm:w-44 flex-shrink-0">
                    <h3 className="text-xs font-bold text-slate-800">
                      Company Identity
                    </h3>
                    <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                      Manage your brand assets and basic profile.
                    </p>
                  </div>

                  <div className="flex-1 flex gap-4 items-stretch">
                    <div
                      onClick={handleSimulateLogoUpload}
                      className="w-20 h-20 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-300 hover:bg-slate-50 transition-all flex-shrink-0 group select-none"
                    >
                      {!logoUploaded ? (
                        <>
                          <FileUp className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[8px] font-bold text-slate-400 tracking-wider mt-1.5 leading-none">
                            CHANGE LOGO
                          </span>
                        </>
                      ) : (
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-xs animate-in zoom-in-95 duration-200">
                          H
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="legalName"
                          className="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                        >
                          Company Legal Name
                        </label>
                        <input
                          id="legalName"
                          type="text"
                          value={legalName}
                          onChange={(e) => setLegalName(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/30 font-semibold text-slate-700"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label
                            htmlFor="domainName"
                            className="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                          >
                            Domain Name
                          </label>
                          <input
                            id="domainName"
                            type="text"
                            value={domainName}
                            onChange={(e) => setDomainName(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/30 font-semibold text-slate-700"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label
                            htmlFor="industry"
                            className="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                          >
                            Industry
                          </label>
                          <div className="relative">
                            <select
                              id="industry"
                              value={industry}
                              onChange={(e) => setIndustry(e.target.value)}
                              className="w-full pl-3 pr-8 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/30 font-semibold text-slate-700 appearance-none cursor-pointer"
                            >
                              <option value="Technology">Technology</option>
                              <option value="Healthcare">Healthcare</option>
                              <option value="Finance">Finance</option>
                              <option value="Education">Education</option>
                            </select>
                            <div className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none">
                              <ChevronDown className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROW 2: LOCALIZATION SUB-GRID */}
                <div className="flex flex-col sm:flex-row gap-6 pb-2">
                  <div className="space-y-1 w-full sm:w-44 flex-shrink-0">
                    <h3 className="text-xs font-bold text-slate-800">
                      Localization
                    </h3>
                    <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                      Set the default regional parameters for your workspace.
                    </p>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="timezone"
                        className="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                      >
                        Default Timezone
                      </label>
                      <div className="relative">
                        <select
                          id="timezone"
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full pl-3 pr-8 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/30 font-semibold text-slate-700 appearance-none cursor-pointer"
                        >
                          <option value="(UTC+05:30) Mumbai">
                            (UTC+05:30) Mumbai
                          </option>
                          <option value="(UTC+03:00) Nairobi">
                            (UTC+03:00) Nairobi
                          </option>
                          <option value="(UTC+00:00) London">
                            (UTC+00:00) London
                          </option>
                          <option value="(UTC-05:00) New York">
                            (UTC-05:00) New York
                          </option>
                        </select>
                        <div className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="dateFormat"
                        className="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                      >
                        Date Format
                      </label>
                      <div className="relative">
                        <select
                          id="dateFormat"
                          value={dateFormat}
                          onChange={(e) => setDateFormat(e.target.value)}
                          className="w-full pl-3 pr-8 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/30 font-semibold text-slate-700 appearance-none cursor-pointer"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                        </select>
                        <div className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "rbac" ? (
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-auto lg:h-[480px] flex flex-col justify-between animate-in fade-in slide-in-from-right-3 duration-200">
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-base font-bold tracking-tight text-slate-800">
                    Role-Based Access Control
                  </h2>
                  <button
                    onClick={() => setIsRoleModalOpen(true)}
                    className="text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer active:scale-95 transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Role</span>
                  </button>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[300px] flex-1 pr-1.5">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 sticky top-0 z-10">
                        <th className="py-2.5 px-4">Role Name</th>
                        <th className="py-2.5 px-4">Assigned To</th>
                        <th className="py-2.5 px-4">Permissions</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {roles.map((row) => (
                        <tr key={row.id} className="align-middle">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-2 h-2 rounded-full ${row.dotColor}`}
                              />
                              <div className="flex flex-col space-y-0.5">
                                <span className="font-bold text-slate-800 leading-tight">
                                  {row.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-semibold">
                                  {row.description}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-semibold">
                            {row.assignedCount} Users
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1.5">
                              {row.permissions.map((perm) => (
                                <span
                                  key={perm}
                                  className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${row.badgeColor}`}
                                >
                                  {perm}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditModal(row)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                                title="Edit permissions"
                              >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteRole(row.id, row.name)
                                }
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer active:scale-90"
                                title="Delete role"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === "notifications" ? (
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-auto lg:h-[480px] flex flex-col justify-between animate-in fade-in slide-in-from-right-3 duration-200">
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-base font-bold tracking-tight text-slate-800">
                    Global Notification Preferences
                  </h2>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between gap-4 shadow-2xs">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100/30">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-xs font-bold text-slate-800">
                          Email Digest
                        </h3>
                        <p className="text-[10px] text-slate-400 font-semibold leading-none">
                          Send daily summaries of attendance and requests.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => setEmailDigest(!emailDigest)}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                        emailDigest ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-200 ${
                          emailDigest ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between gap-4 shadow-2xs">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-slate-50 text-slate-500 rounded-lg border border-slate-100">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-xs font-bold text-slate-800">
                          SMS Alerts
                        </h3>
                        <p className="text-[10px] text-slate-400 font-semibold leading-none">
                          Urgent payroll or policy violation alerts.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => setSmsAlerts(!smsAlerts)}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                        smsAlerts ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-200 ${
                          smsAlerts ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "rules" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto lg:h-[480px] animate-in fade-in slide-in-from-right-3 duration-200">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Plane className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold tracking-tight text-slate-800">
                      Leave Policies
                    </h2>
                  </div>

                  <div className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="annualLeaveCredit"
                        className="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                      >
                        Annual Leave Credit
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="annualLeaveCredit"
                          type="number"
                          min="0"
                          value={annualLeaveCredit}
                          onChange={(e) =>
                            setAnnualLeaveCredit(
                              Math.max(0, parseInt(e.target.value) || 0),
                            )
                          }
                          className="w-20 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/30 font-bold text-slate-700 text-center"
                        />
                        <span className="text-xs text-slate-400 font-semibold lowercase">
                          days per year
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="carryForwardLimit"
                        className="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                      >
                        Carry Forward Limit
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="carryForwardLimit"
                          type="number"
                          min="0"
                          value={carryForwardLimit}
                          onChange={(e) =>
                            setCarryForwardLimit(
                              Math.max(0, parseInt(e.target.value) || 0),
                            )
                          }
                          className="w-20 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/30 font-bold text-slate-700 text-center"
                        />
                        <span className="text-xs text-slate-400 font-semibold lowercase">
                          days max
                        </span>
                      </div>
                    </div>

                    <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none text-xs font-semibold text-slate-600">
                      <input
                        type="checkbox"
                        checked={allowHalfDay}
                        onChange={() => setAllowHalfDay(!allowHalfDay)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Allow half-day leave requests</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <div className="p-2 bg-slate-50 text-slate-500 rounded-lg border border-slate-100">
                      <Coins className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold tracking-tight text-slate-800">
                      Payroll & Salary
                    </h2>
                  </div>

                  <div className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="payrollCycleDate"
                        className="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                      >
                        Payroll Cycle Date
                      </label>
                      <div className="relative max-w-[200px]">
                        <select
                          id="payrollCycleDate"
                          value={payrollCycleDate}
                          onChange={(e) => setPayrollCycleDate(e.target.value)}
                          className="w-full pl-3 pr-8 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/30 font-semibold text-slate-700 appearance-none cursor-pointer"
                        >
                          <option value="25th of every month">
                            25th of every month
                          </option>
                          <option value="Last day of every month">
                            Last day of every month
                          </option>
                          <option value="15th of every month">
                            15th of every month
                          </option>
                        </select>
                        <div className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="currency"
                        className="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                      >
                        Currency
                      </label>
                      <div className="relative max-w-[150px]">
                        <select
                          id="currency"
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full pl-3 pr-8 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/30 font-semibold text-slate-700 appearance-none cursor-pointer"
                        >
                          <option value="INR (₹)">INR (₹)</option>
                          <option value="USD ($)">USD ($)</option>
                          <option value="EUR (€)">EUR (€)</option>
                          <option value="GBP (£)">GBP (£)</option>
                        </select>
                        <div className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none text-xs font-semibold text-slate-600">
                      <input
                        type="checkbox"
                        checked={enableOvertime}
                        onChange={() => setEnableOvertime(!enableOvertime)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Enable Overtime calculation (1.5x)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "security" ? (
            /* 5. DYNAMIC RENDER: Renders "Security & Authentication" panel if activeTab is "security" (The New View) */
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-auto lg:h-[480px] flex flex-col justify-between animate-in fade-in slide-in-from-right-3 duration-200">
              <div className="space-y-5 flex-1 flex flex-col">
                {/* Panel Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-base font-bold tracking-tight text-slate-800">
                    Security & Authentication
                  </h2>
                </div>

                {/* ROW 1: TWO-FACTOR AUTHENTICATION (2FA) */}
                <div className="p-4 bg-white border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100/30 mt-0.5 flex-shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-800 leading-none">
                          Two-Factor Authentication (2FA)
                        </h3>
                        <span className="text-[8px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200/50 px-1.5 py-0.5 rounded uppercase">
                          Enabled
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed max-w-sm">
                        Enforce multi-factor authentication for all
                        administrators and department heads. This adds an extra
                        layer of security to sensitive data.
                      </p>
                    </div>
                  </div>

                  {/* Manage Button */}
                  <button className="px-4 py-2 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer active:scale-95 flex-shrink-0 self-start sm:self-center">
                    Manage 2FA Methods
                  </button>
                </div>

                {/* ROW 2: LOWER GRID (Session Timeout & IP Whitelisting) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                  {/* Card 1: Session Timeout */}
                  <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Session Timeout
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                        Automatically log out users after inactivity.
                      </p>
                    </div>

                    {/* Time selection dropdown */}
                    <div className="relative max-w-[150px]">
                      <select
                        id="sessionTimeout"
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(e.target.value)}
                        className="w-full pl-3 pr-8 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white font-semibold text-slate-700 appearance-none cursor-pointer shadow-2xs"
                      >
                        <option value="15 Minutes">15 Minutes</option>
                        <option value="30 Minutes">30 Minutes</option>
                        <option value="1 Hour">1 Hour</option>
                        <option value="2 Hours">2 Hours</option>
                      </select>
                      <div className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: IP Whitelisting */}
                  <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        IP Whitelisting
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                        Restrict dashboard access to specific IPs.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {/* Active whitelisted IP address tags list */}
                      <div className="flex flex-wrap gap-1.5 max-h-12 overflow-y-auto pr-1">
                        {whitelistedIps.map((ip) => (
                          <div
                            key={ip}
                            className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[9px] font-bold animate-in zoom-in-95 duration-100"
                          >
                            <span>{ip}</span>
                            <button
                              onClick={() => handleRemoveIpAddress(ip)}
                              className="text-blue-500 hover:text-rose-600 font-extrabold text-[10px] cursor-pointer"
                              title="Delete IP address"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Input row containing text field and add button */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newIpInput}
                          onChange={(e) => setNewIpInput(e.target.value)}
                          placeholder="Add IP Address..."
                          className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white font-semibold text-slate-700 shadow-2xs"
                        />
                        <button
                          onClick={handleAddIpAddress}
                          className="p-1.5 bg-[#0f172a] text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer active:scale-95 shadow-sm"
                          title="Add IP"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-[480px] flex flex-col items-center justify-center text-center text-slate-400 text-xs font-medium animate-in fade-in duration-200">
              <span className="font-bold text-slate-300 text-sm">
                Under Construction
              </span>
              <p className="max-w-xs text-[11px] text-slate-400 leading-relaxed mt-1">
                This settings category is currently being formatted by our
                development team.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* GOAL CREATION FORM MODAL OVERLAY */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl border border-slate-100 shadow-xl overflow-hidden flex flex-col p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900">
              Create New Security Role
            </h3>

            <form onSubmit={handleCreateRole} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Role Name
                </label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g., HR Generalist"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Description
                </label>
                <input
                  type="text"
                  required
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  placeholder="e.g., Access to core employee records"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Assigned Users Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newRoleAssigned || ""}
                    onChange={(e) =>
                      setNewRoleAssigned(
                        Math.max(0, parseInt(e.target.value) || 0),
                      )
                    }
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Select Permissions
                  </span>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col space-y-1.5 max-h-24 overflow-y-auto text-[11px] font-semibold text-slate-600">
                    {[
                      "ALL_ACCESS",
                      "VIEW_TEAM",
                      "APPROVE_LEAVE",
                      "VIEW_PAYROLL",
                    ].map((perm) => {
                      const isChecked = selectedPermissions.includes(perm);
                      return (
                        <label
                          key={perm}
                          className="flex items-center gap-2 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleTogglePermission(perm)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span>{perm}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer active:scale-95 transition-all"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADJUST PERMISSIONS MODAL OVERLAY */}
      {selectedRoleForEdit && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-xl border border-slate-100 shadow-xl overflow-hidden flex flex-col p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Adjust Permissions
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">
                Modifying privileges for role:{" "}
                <span className="text-slate-700 font-bold">
                  {selectedRoleForEdit.name}
                </span>
              </p>
            </div>

            <form onSubmit={handleSaveEditPermissions} className="space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Security Privileges
                </span>
                <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-lg border border-slate-100 text-xs font-semibold text-slate-700">
                  {[
                    "ALL_ACCESS",
                    "VIEW_TEAM",
                    "APPROVE_LEAVE",
                    "VIEW_PAYROLL",
                  ].map((perm) => {
                    const isChecked = editPermissions.includes(perm);
                    return (
                      <label
                        key={perm}
                        className="flex items-center gap-2.5 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleEditPermission(perm)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span>{perm}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedRoleForEdit(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
