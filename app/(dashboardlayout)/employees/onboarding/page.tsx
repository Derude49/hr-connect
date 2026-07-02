"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, Camera } from "lucide-react";
import Link from "next/link";
import Select from "react-select";
import { Employee } from "@/lib/mock-data";
import { saveEmployee } from "@/lib/storage";

// ── Nationality data ──────────────────────────────────────────────
const NATIONALITIES = [
  { label: "Afghan", value: "Afghan", code: "AF", phone: "+93" },
  { label: "Albanian", value: "Albanian", code: "AL", phone: "+355" },
  { label: "Algerian", value: "Algerian", code: "DZ", phone: "+213" },
  { label: "American", value: "American", code: "US", phone: "+1" },
  { label: "Angolan", value: "Angolan", code: "AO", phone: "+244" },
  { label: "Argentine", value: "Argentine", code: "AR", phone: "+54" },
  { label: "Australian", value: "Australian", code: "AU", phone: "+61" },
  { label: "Austrian", value: "Austrian", code: "AT", phone: "+43" },
  { label: "Bangladeshi", value: "Bangladeshi", code: "BD", phone: "+880" },
  { label: "Belgian", value: "Belgian", code: "BE", phone: "+32" },
  { label: "Bolivian", value: "Bolivian", code: "BO", phone: "+591" },
  { label: "Brazilian", value: "Brazilian", code: "BR", phone: "+55" },
  { label: "British", value: "British", code: "GB", phone: "+44" },
  { label: "Bulgarian", value: "Bulgarian", code: "BG", phone: "+359" },
  { label: "Cameroonian", value: "Cameroonian", code: "CM", phone: "+237" },
  { label: "Canadian", value: "Canadian", code: "CA", phone: "+1" },
  { label: "Chilean", value: "Chilean", code: "CL", phone: "+56" },
  { label: "Chinese", value: "Chinese", code: "CN", phone: "+86" },
  { label: "Colombian", value: "Colombian", code: "CO", phone: "+57" },
  { label: "Congolese", value: "Congolese", code: "CD", phone: "+243" },
  { label: "Croatian", value: "Croatian", code: "HR", phone: "+385" },
  { label: "Cuban", value: "Cuban", code: "CU", phone: "+53" },
  { label: "Czech", value: "Czech", code: "CZ", phone: "+420" },
  { label: "Danish", value: "Danish", code: "DK", phone: "+45" },
  { label: "Dutch", value: "Dutch", code: "NL", phone: "+31" },
  { label: "Ecuadorian", value: "Ecuadorian", code: "EC", phone: "+593" },
  { label: "Egyptian", value: "Egyptian", code: "EG", phone: "+20" },
  { label: "Emirati", value: "Emirati", code: "AE", phone: "+971" },
  { label: "Ethiopian", value: "Ethiopian", code: "ET", phone: "+251" },
  { label: "Finnish", value: "Finnish", code: "FI", phone: "+358" },
  { label: "French", value: "French", code: "FR", phone: "+33" },
  { label: "Ghanaian", value: "Ghanaian", code: "GH", phone: "+233" },
  { label: "Greek", value: "Greek", code: "GR", phone: "+30" },
  { label: "Guatemalan", value: "Guatemalan", code: "GT", phone: "+502" },
  { label: "Hungarian", value: "Hungarian", code: "HU", phone: "+36" },
  { label: "Indian", value: "Indian", code: "IN", phone: "+91" },
  { label: "Indonesian", value: "Indonesian", code: "ID", phone: "+62" },
  { label: "Iranian", value: "Iranian", code: "IR", phone: "+98" },
  { label: "Iraqi", value: "Iraqi", code: "IQ", phone: "+964" },
  { label: "Irish", value: "Irish", code: "IE", phone: "+353" },
  { label: "Israeli", value: "Israeli", code: "IL", phone: "+972" },
  { label: "Italian", value: "Italian", code: "IT", phone: "+39" },
  { label: "Ivorian", value: "Ivorian", code: "CI", phone: "+225" },
  { label: "Jamaican", value: "Jamaican", code: "JM", phone: "+1876" },
  { label: "Japanese", value: "Japanese", code: "JP", phone: "+81" },
  { label: "Jordanian", value: "Jordanian", code: "JO", phone: "+962" },
  { label: "Kazakhstani", value: "Kazakhstani", code: "KZ", phone: "+7" },
  { label: "Kenyan", value: "Kenyan", code: "KE", phone: "+254" },
  { label: "Lebanese", value: "Lebanese", code: "LB", phone: "+961" },
  { label: "Libyan", value: "Libyan", code: "LY", phone: "+218" },
  { label: "Malagasy", value: "Malagasy", code: "MG", phone: "+261" },
  { label: "Malaysian", value: "Malaysian", code: "MY", phone: "+60" },
  { label: "Malian", value: "Malian", code: "ML", phone: "+223" },
  { label: "Mexican", value: "Mexican", code: "MX", phone: "+52" },
  { label: "Moroccan", value: "Moroccan", code: "MA", phone: "+212" },
  { label: "Mozambican", value: "Mozambican", code: "MZ", phone: "+258" },
  { label: "Namibian", value: "Namibian", code: "NA", phone: "+264" },
  { label: "Nepalese", value: "Nepalese", code: "NP", phone: "+977" },
  { label: "New Zealander", value: "New Zealander", code: "NZ", phone: "+64" },
  { label: "Nigerian", value: "Nigerian", code: "NG", phone: "+234" },
  { label: "Norwegian", value: "Norwegian", code: "NO", phone: "+47" },
  { label: "Pakistani", value: "Pakistani", code: "PK", phone: "+92" },
  { label: "Peruvian", value: "Peruvian", code: "PE", phone: "+51" },
  { label: "Philippine", value: "Philippine", code: "PH", phone: "+63" },
  { label: "Polish", value: "Polish", code: "PL", phone: "+48" },
  { label: "Portuguese", value: "Portuguese", code: "PT", phone: "+351" },
  { label: "Romanian", value: "Romanian", code: "RO", phone: "+40" },
  { label: "Russian", value: "Russian", code: "RU", phone: "+7" },
  { label: "Rwandan", value: "Rwandan", code: "RW", phone: "+250" },
  { label: "Saudi", value: "Saudi", code: "SA", phone: "+966" },
  { label: "Senegalese", value: "Senegalese", code: "SN", phone: "+221" },
  { label: "Serbian", value: "Serbian", code: "RS", phone: "+381" },
  { label: "Singaporean", value: "Singaporean", code: "SG", phone: "+65" },
  { label: "Somali", value: "Somali", code: "SO", phone: "+252" },
  { label: "South African", value: "South African", code: "ZA", phone: "+27" },
  { label: "South Korean", value: "South Korean", code: "KR", phone: "+82" },
  { label: "Spanish", value: "Spanish", code: "ES", phone: "+34" },
  { label: "Sri Lankan", value: "Sri Lankan", code: "LK", phone: "+94" },
  { label: "Sudanese", value: "Sudanese", code: "SD", phone: "+249" },
  { label: "Swedish", value: "Swedish", code: "SE", phone: "+46" },
  { label: "Swiss", value: "Swiss", code: "CH", phone: "+41" },
  { label: "Syrian", value: "Syrian", code: "SY", phone: "+963" },
  { label: "Taiwanese", value: "Taiwanese", code: "TW", phone: "+886" },
  { label: "Tanzanian", value: "Tanzanian", code: "TZ", phone: "+255" },
  { label: "Thai", value: "Thai", code: "TH", phone: "+66" },
  { label: "Tunisian", value: "Tunisian", code: "TN", phone: "+216" },
  { label: "Turkish", value: "Turkish", code: "TR", phone: "+90" },
  { label: "Ugandan", value: "Ugandan", code: "UG", phone: "+256" },
  { label: "Ukrainian", value: "Ukrainian", code: "UA", phone: "+380" },
  { label: "Uruguayan", value: "Uruguayan", code: "UY", phone: "+598" },
  { label: "Venezuelan", value: "Venezuelan", code: "VE", phone: "+58" },
  { label: "Vietnamese", value: "Vietnamese", code: "VN", phone: "+84" },
  { label: "Yemeni", value: "Yemeni", code: "YE", phone: "+967" },
  { label: "Zambian", value: "Zambian", code: "ZM", phone: "+260" },
  { label: "Zimbabwean", value: "Zimbabwean", code: "ZW", phone: "+263" },
];

// Local number lengths per country code (digits after the country code)
const PHONE_LENGTHS: Record<string, number> = {
  "+254": 9,  // Kenya: 07XX XXX XXX = 9 digits after +254 (drop leading 0)
  "+1": 10,   // USA/Canada
  "+44": 10,  // UK
  "+27": 9,   // South Africa
  "+234": 10, // Nigeria
  "+233": 9,  // Ghana
  "+256": 9,  // Uganda
  "+255": 9,  // Tanzania
  "+250": 9,  // Rwanda
  "+251": 9,  // Ethiopia
  "+91": 10,  // India
  "+86": 11,  // China
  "+81": 10,  // Japan
  "+49": 10,  // Germany
  "+33": 9,   // France
  "+39": 10,  // Italy
  "+34": 9,   // Spain
  "+55": 11,  // Brazil
  "+52": 10,  // Mexico
  "+61": 9,   // Australia
  "+64": 9,   // New Zealand
  "+7": 10,   // Russia/Kazakhstan
  "+82": 10,  // South Korea
  "+60": 9,   // Malaysia
  "+63": 10,  // Philippines
  "+65": 8,   // Singapore
  "+92": 10,  // Pakistan
  "+880": 10, // Bangladesh
  "+971": 9,  // UAE
  "+966": 9,  // Saudi Arabia
  "+20": 10,  // Egypt
  "+212": 9,  // Morocco
  "+213": 9,  // Algeria
  "+216": 8,  // Tunisia
  "+218": 9,  // Libya
  "+221": 9,  // Senegal
  "+237": 9,  // Cameroon
  "+243": 9,  // DRC Congo
  "+244": 9,  // Angola
  "+249": 9,  // Sudan
  "+252": 8,  // Somalia
  "+258": 9,  // Mozambique
  "+260": 9,  // Zambia
  "+263": 9,  // Zimbabwe
  "+264": 9,  // Namibia
};

function getPhoneLength(code: string): number {
  return PHONE_LENGTHS[code] ?? 10; // default 10 if country not listed
}

// ── Onboarding form data ──────────────────────────────────────────
interface OnboardingData {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  phoneCode: string;
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

// ── Email validator ───────────────────────────────────────────────
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [emailError, setEmailError] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setPhotoError("Only JPEG and PNG files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("File must be under 5MB.");
      return;
    }
    setPhotoError("");
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  const [data, setData] = useState<OnboardingData>({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    phoneCode: "+254",
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
      return (
        data.fullName.trim() !== "" &&
        data.gender !== "" &&
        data.dateOfBirth !== "" &&
        data.nationality.trim() !== ""
      );
    }
    if (step === 2) {
      return (
        data.jobTitle.trim() !== "" &&
        data.department.trim() !== "" &&
        data.employmentType !== "" &&
        data.startDate !== ""
      );
    }
    if (step === 3) {
      return (
        data.email.trim() !== "" &&
        isValidEmail(data.email) &&
        data.phone.length === getPhoneLength(data.phoneCode) &&
        data.address.trim() !== ""
      );
    }
    return false;
  }

  function handleContinue() {
    if (step === 3 && !isValidEmail(data.email)) {
      setEmailError("Please enter a valid email address (e.g. name@company.com)");
      return;
    }

    if (!isStepValid()) {
      alert("Please fill in all fields before continuing.");
      return;
    }

    if (step < 3) {
      setEmailError("");
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
        mobilePhone: `${data.phoneCode}${data.phone}`,
        nationality: data.nationality,
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
                  {i < steps.length - 1 && <div className="h-10 w-px bg-slate-200" />}
                </div>
                <div className="pb-8 pt-1">
                  <p className={`text-sm font-semibold ${s.number === step ? "text-blue-600" : "text-slate-700"}`}>
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
          <p className="mt-1 text-xs text-blue-600">Your progress is being saved as you type.</p>
        </div>
      </div>

      {/* Form content */}
      <div className="p-8">
        {/* ── Step 1: Personal Info ── */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold">Personal Information</h1>
            <p className="mt-1 text-slate-500">
              Provide the foundational details for the new employee record.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Full Name</label>
                <input
                  value={data.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="e.g. Alexander Pierce"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Gender</label>
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
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Date of Birth</label>
                <input
                  type="date"
                  value={data.dateOfBirth}
                  onChange={(e) => update("dateOfBirth", e.target.value)}
                  aria-label="Date of Birth"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nationality</label>
                <Select
                  options={NATIONALITIES}
                  onChange={(selected) => {
                    if (selected) {
                      update("nationality", selected.value);
                      update("phoneCode", selected.phone);
                    }
                  }}
                  placeholder="Search nationality..."
                  isSearchable
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: "#e2e8f0",
                      borderRadius: "0.5rem",
                      minHeight: "42px",
                      fontSize: "0.875rem",
                    }),
                  }}
                />
              </div>
            </div>

            <label
              htmlFor="onboarding-photo"
              className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 hover:border-blue-400 hover:bg-blue-50 transition"
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="h-24 w-24 rounded-full object-cover border-2 border-blue-400"
                />
              ) : (
                <Camera className="h-7 w-7 text-slate-400" />
              )}
              <p className="text-sm font-semibold text-slate-700">
                {photoPreview ? "Change Photo" : "Upload Employee Photo"}
              </p>
              <p className="text-xs text-slate-400">JPEG, PNG up to 5MB</p>
              {photoError && <p className="text-xs text-red-500">{photoError}</p>}
              <input
                id="onboarding-photo"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* ── Step 2: Job Details ── */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold">Job Details</h1>
            <p className="mt-1 text-slate-500">Define the employee&apos;s role and employment terms.</p>
            <div className="mt-6 grid grid-cols-2 gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Job Title</label>
                <input
                  value={data.jobTitle}
                  onChange={(e) => update("jobTitle", e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Department</label>
                <input
                  value={data.department}
                  onChange={(e) => update("department", e.target.value)}
                  placeholder="e.g. Engineering"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Employment Type</label>
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
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Start Date</label>
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

        {/* ── Step 3: Contact & Address ── */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold">Contact & Address</h1>
            <p className="mt-1 text-slate-500">Final step — verify how to reach the new employee.</p>
            <div className="mt-6 grid grid-cols-2 gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Work Email</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => {
                    update("email", e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  onBlur={() => {
                    if (data.email && !isValidEmail(data.email)) {
                      setEmailError("Please enter a valid email address (e.g. name@company.com)");
                    } else {
                      setEmailError("");
                    }
                  }}
                  placeholder="e.g. a.pierce@hrconnect.ai"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-blue-500 ${
                    emailError ? "border-red-400" : "border-slate-200"
                  }`}
                />
                {emailError && (
                  <p className="mt-1 text-xs text-red-500">{emailError}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Phone Number</label>
                <div className="flex gap-2">
                  <select
                    value={data.phoneCode}
                    onChange={(e) => {
                      update("phoneCode", e.target.value);
                      update("phone", ""); // reset phone when code changes
                    }}
                    aria-label="Phone country code"
                    className="w-28 rounded-lg border border-slate-200 px-2 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    {NATIONALITIES.map((n) => (
                      <option key={`${n.code}-${n.phone}`} value={n.phone}>
                        {n.code} {n.phone}
                      </option>
                    ))}
                  </select>
                  <input
                    value={data.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, ""); // strip non-digits
                      const maxLen = getPhoneLength(data.phoneCode);
                      if (val.length <= maxLen) {
                        update("phone", val);
                      }
                    }}
                    placeholder={`${"0".repeat(getPhoneLength(data.phoneCode))} (${getPhoneLength(data.phoneCode)} digits)`}
                    maxLength={getPhoneLength(data.phoneCode)}
                    className={`flex-1 rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-blue-500 ${
                      data.phone.length > 0 && data.phone.length < getPhoneLength(data.phoneCode)
                        ? "border-red-400"
                        : "border-slate-200"
                    }`}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {data.phoneCode} + {getPhoneLength(data.phoneCode)} digits required
                  {data.phone.length > 0 && (
                    <span className={data.phone.length === getPhoneLength(data.phoneCode) ? " text-green-600" : " text-red-500"}>
                      {" "}— {data.phone.length}/{getPhoneLength(data.phoneCode)} entered
                    </span>
                  )}
                </p>
              </div>
              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Mailing Address</label>
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
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
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