"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Mail, Calendar, Pencil, Download, AlertTriangle, Star, UserX } from "lucide-react";
import { employees as seedEmployees } from "@/lib/mock-data";
import { getAllEmployees, updateEmployee } from "@/lib/storage";
import StatusBadge from "@/components/StatusBadge";

const tabs = ["Personal Information", "Job Details", "Documents", "Employment History"];

export default function EmployeeProfilePage() {
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const router = useRouter();

  const allEmployees =
    typeof window !== "undefined" ? getAllEmployees(seedEmployees) : seedEmployees;
  const employee = allEmployees.find((e) => e.id === params.id);

  if (!employee) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-700">Employee not found</p>
        <p className="mt-1 text-sm text-slate-400">
          No employee matches this profile link.
        </p>
        <Link href="/employees" className="mt-4 inline-block text-sm font-medium text-blue-600">
          ← Back to Directory
        </Link>
      </div>
    );
  }

  function handleDeactivate() {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${employee!.name}? They will lose access to HR Connect and payroll processing will stop for this user.`
    );
    if (!confirmed) return;
    updateEmployee(employee!.id, { status: "Suspended" });
    router.refresh();
  }

  function handleActivate() {
  const confirmed = window.confirm(
    `Activate ${employee!.name}'s account? They will regain access to HR Connect.`
  );
  if (!confirmed) return;
  updateEmployee(employee!.id, { status: "Active" });
  router.refresh();
}

  const initials = employee.avatarInitials ?? employee.name.split(" ").map((n) => n[0]).join("");

  return (
    <>
      {/* Breadcrumb */}
      <p className="mb-4 text-sm text-slate-400">
        <Link href="/employees" className="hover:text-slate-600">Directory</Link>
        <span className="mx-2">›</span>
        <span className="font-semibold text-slate-600">Employee Profile</span>
      </p>

      {/* Header card */}
      <div className="mb-6 flex items-start justify-between rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-start gap-5">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-blue-100 text-2xl font-bold text-blue-700">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{employee.name}</h1>
              <StatusBadge status={employee.status} />
            </div>
            <p className="mt-1 text-slate-500">
              {employee.role} • {employee.department} Department
            </p>
            <div className="mt-3 flex items-center gap-5 text-sm text-slate-500">
              {employee.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {employee.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {employee.email}
              </span>
              {employee.joinedDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Joined {employee.joinedDate}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href={`/employees/${employee.id}/edit`}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Link>
          <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">
            <Download className="h-4 w-4" />
            Download CV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-6 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold transition ${
              activeTab === tab
                ? "border-b-2 border-slate-900 text-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main column */}
        <div className="col-span-2 space-y-6">
          {activeTab === "Personal Information" && (
            <>
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-2 gap-y-5">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-slate-400">WORK EMAIL</p>
                    <p className="mt-1 text-sm text-slate-800">{employee.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-slate-400">PERSONAL EMAIL</p>
                    <p className="mt-1 text-sm text-slate-800">{employee.personalEmail ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-slate-400">MOBILE PHONE</p>
                    <p className="mt-1 text-sm text-slate-800">{employee.mobilePhone ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-slate-400">MAILING ADDRESS</p>
                    <p className="mt-1 text-sm text-slate-800">{employee.mailingAddress ?? "—"}</p>
                  </div>
                </div>
              </div>

              {employee.emergencyContacts && employee.emergencyContacts.length > 0 && (
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-bold">Emergency Contacts</h2>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left text-xs font-semibold tracking-wide text-slate-400">
                        <th className="py-2">NAME</th>
                        <th className="py-2">RELATIONSHIP</th>
                        <th className="py-2">PHONE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employee.emergencyContacts.map((c) => (
                        <tr key={c.name} className="border-b border-slate-50 last:border-0">
                          <td className="py-3 font-medium text-slate-800">{c.name}</td>
                          <td className="py-3 text-slate-600">{c.relationship}</td>
                          <td className="py-3 text-slate-600">{c.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold">Additional Details</h2>
                <div className="grid grid-cols-2 gap-y-5">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-slate-400">DATE OF BIRTH</p>
                    <p className="mt-1 text-sm text-slate-800">{employee.dateOfBirth ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-slate-400">GENDER</p>
                    <p className="mt-1 text-sm text-slate-800">{employee.gender ?? "—"}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "Job Details" && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">Job Details</h2>
              <div className="grid grid-cols-2 gap-y-5">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-slate-400">ROLE</p>
                  <p className="mt-1 text-sm text-slate-800">{employee.role}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-slate-400">DEPARTMENT</p>
                  <p className="mt-1 text-sm text-slate-800">{employee.department}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-slate-400">EMPLOYMENT TYPE</p>
                  <p className="mt-1 text-sm text-slate-800">{employee.type}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-slate-400">EMPLOYEE ID</p>
                  <p className="mt-1 text-sm text-slate-800">{employee.employeeId}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Documents" && (
            <div className="rounded-xl bg-white p-12 text-center text-slate-400 shadow-sm">
              No documents uploaded yet.
            </div>
          )}

          {activeTab === "Employment History" && (
            <div className="rounded-xl bg-white p-12 text-center text-slate-400 shadow-sm">
              No employment history records yet.
            </div>
          )}
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          {employee.availableTimeOffDays !== undefined && (
            <div className="rounded-xl border-l-4 border-l-blue-600 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold tracking-wide text-slate-400">AVAILABLE TIME OFF</p>
              <div className="mt-2 flex items-baseline justify-between">
                <p className="text-3xl font-bold">
                  {employee.availableTimeOffDays} <span className="text-base font-medium text-slate-500">Days</span>
                </p>
                <span className="text-sm font-semibold text-green-600">↑ +2.0</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-2 w-3/4 rounded-full bg-blue-600" />
              </div>
            </div>
          )}

          {employee.performanceRating && (
            <div className="rounded-xl border-l-4 border-l-slate-900 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold tracking-wide text-slate-400">PERFORMANCE RATING</p>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`h-5 w-5 ${i <= 4 ? "fill-blue-500 text-blue-500" : "text-slate-200"}`} />
                ))}
              </div>
              <p className="mt-2 text-2xl font-bold">{employee.performanceRating}</p>
              <p className="mt-1 text-xs text-slate-400">Last review: Dec 2023</p>
            </div>
          )}

          {employee.keySkills && employee.keySkills.length > 0 && (
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-base font-bold">Key Skills</h3>
              <div className="flex flex-wrap gap-2">
                {employee.keySkills.map((skill) => (
                  <span key={skill} className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="rounded-xl bg-red-50 p-5">
            <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Administrative Actions
            </h3>
            <p className="text-sm text-red-600">
              {employee.status === "Suspended"
              ? "This account is currently deactivated. Activate it to restore the employee's access to HR Connect and payroll processing."
              : "Once an account is deactivated, the employee will no longer have access to HR Connect and payroll processing for this user will stop."}
              </p>
              {employee.status === "Suspended" ? (
                <button
                onClick={handleActivate}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-green-300 bg-white px-4 py-2.5 text-sm font-semibold text-green-700"
                >
                  <UserX className="h-4 w-4" />
                  Activate Account
                </button>
                ) : (
                <button
                onClick={handleDeactivate}
                disabled={employee.status === "Resigned"}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <UserX className="h-4 w-4" />
                  {employee.status === "Resigned" ? "Account Resigned" : "Deactivate Account"}
                </button>
              )}
          </div>
        </div>
      </div>
    </>
  );
}