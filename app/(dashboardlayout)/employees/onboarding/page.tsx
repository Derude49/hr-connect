"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Employee } from "@/lib/mock-data";
import { saveEmployee } from "@/lib/storage";

interface OnboardingData {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  jobTitle: string;
  department: string;
  employmentType: string;
  startDate: string;
  email: string;
  phone: string;
  address: string;
}

const steps = [
  { number: 1, label: "Personal Info", tag: "REQUIRED" },
  { number: 2, label: "Job Details", tag: "INTERNAL" },
  { number: 3, label: "Contact & Address", tag: "VERIFICATION" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    jobTitle: "",
    department: "",
    employmentType: "",
    startDate: "",
    email: "",
    phone: "",
    address: "",
  });

  function update(field: keyof OnboardingData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function isStepValid(): boolean {
  if (step === 1) {
    return data.fullName.trim() !== "" && data.gender !== "" && data.dateOfBirth !== "" && data.nationality.trim() !== "";
  }
  if (step === 2) {
    return data.jobTitle.trim() !== "" && data.department.trim() !== "" && data.employmentType !== "" && data.startDate !== "";
  }
  if (step === 3) {
    return data.email.trim() !== "" && data.phone.trim() !== "" && data.address.trim() !== "";
  }
  return false;
}

function handleContinue() {
  if (!isStepValid()) {
    alert("Please fill in all fields before continuing.");
    return;
  }

  if (step < 3) {
    setStep(step + 1);
  } else {
    const newEmployee: Employee = {
      id: data.fullName.toLowerCase().trim().replace(/\s+/g, "-") || `employee-${Date.now()}`,
      name: data.fullName,
      email: data.email,
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      department: data.department,
      role: data.jobTitle,
      type: (data.employmentType as Employee["type"]) || "Full-time",
      status: "Active",
    };

    saveEmployee(newEmployee);
    alert(`Employee "${data.fullName}" onboarded successfully!`);
    router.push("/employees");
  }
}

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <div className="grid grid-cols-[280px_1fr] overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Sidebar steps */}
      <div className="flex flex-col justify-between border-r border-slate-100 bg-slate-50 p-6">
        <div>
          <h2 className="mb-6 text-xl font-bold">Onboarding</h2>
          <div className="space-y-0">
            {steps.map((s, i) => (
              <div key={s.number} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      s.number === step
                        ? "bg-blue-600 text-white"
                        : s.number < step
                        ? "bg-green-600 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {s.number < step ? <Check className="h-4 w-4" /> : s.number}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="h-10 w-px bg-slate-200" />
                  )}
                </div>
                <div className="pb-8 pt-1">
                  <p
                    className={`text-sm font-semibold ${
                      s.number === step ? "text-blue-600" : "text-slate-700"
                    }`}
                  >
                    {s.label}
                  </p>
                  <p className="text-xs text-slate-400">{s.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-700">Auto-save is enabled</p>
          <p className="mt-1 text-xs text-blue-600">
            Your progress is being saved as you type.
          </p>
        </div>
      </div>

      {/* Form content */}
      <div className="p-8">
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold">Personal Information</h1>
            <p className="mt-1 text-slate-500">
              Provide the foundational details for the new employee record.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <input
                  value={data.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="e.g. Alexander Pierce"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Gender
                </label>
                <select
                  value={data.gender}
                  onChange={(e) => update("gender", e.target.value)}
                  aria-label="Gender"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">Select Option</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={data.dateOfBirth}
                  onChange={(e) => update("dateOfBirth", e.target.value)}
                  aria-label="Date of Birth"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Nationality
                </label>
                <input
                  value={data.nationality}
                  onChange={(e) => update("nationality", e.target.value)}
                  placeholder="e.g. United Kingdom"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-12">
              <Camera className="h-7 w-7 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">Upload Employee Photo</p>
              <p className="text-xs text-slate-400">JPEG, PNG up to 5MB</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold">Job Details</h1>
            <p className="mt-1 text-slate-500">
              Define the employee&apos;s role and employment terms.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Job Title
                </label>
                <input
                  value={data.jobTitle}
                  onChange={(e) => update("jobTitle", e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Department
                </label>
                <input
                  value={data.department}
                  onChange={(e) => update("department", e.target.value)}
                  placeholder="e.g. Engineering"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Employment Type
                </label>
                <select
                  value={data.employmentType}
                  onChange={(e) => update("employmentType", e.target.value)}
                  aria-label="Employment Type"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">Select Option</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={data.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                  aria-label="Start Date"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold">Contact & Address</h1>
            <p className="mt-1 text-slate-500">
              Final step — verify how to reach the new employee.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Work Email
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="e.g. a.pierce@hrconnect.ai"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Phone Number
                </label>
                <input
                  value={data.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="e.g. +1 (555) 012-3456"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Mailing Address
                </label>
                <textarea
                  value={data.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Street, City, State, ZIP"
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            <Link
              href="/employees"
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              onClick={handleContinue}
              disabled={!isStepValid()}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
            >
              {step === 3 ? "Finish & Create Profile" : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}