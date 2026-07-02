"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, Trash2, ShieldCheck } from "lucide-react";
import { employees as seedEmployees, EmergencyContact } from "@/lib/mock-data";
import { getAllEmployees, updateEmployee } from "@/lib/storage";

export default function EditEmployeePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const allEmployees = typeof window !== "undefined" ? getAllEmployees(seedEmployees) : seedEmployees;
  const employee = allEmployees.find((e) => e.id === params.id);

  const [legalName, setLegalName] = useState(employee?.name ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(employee?.dateOfBirth ?? "");
  const [gender, setGender] = useState(employee?.gender ?? "");
  const [nationality, setNationality] = useState("American");
  const [personalEmail, setPersonalEmail] = useState(employee?.personalEmail ?? "");
  const [mobilePhone, setMobilePhone] = useState(employee?.mobilePhone ?? "");
  const [mailingAddress, setMailingAddress] = useState(employee?.mailingAddress ?? "");
  const [contacts, setContacts] = useState<EmergencyContact[]>(employee?.emergencyContacts ?? []);
  const [profileVisible, setProfileVisible] = useState(true);
  const [contactPrivate, setContactPrivate] = useState(false);

  if (!employee) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-700">Employee not found</p>
        <Link href="/employees" className="mt-4 inline-block text-sm font-medium text-blue-600">
          ← Back to Directory
        </Link>
      </div>
    );
  }

  function handleSave() {
    updateEmployee(employee!.id, {
      name: legalName,
      dateOfBirth,
      gender,
      personalEmail,
      mobilePhone,
      mailingAddress,
      emergencyContacts: contacts,
    });
    router.push(`/employees/${employee!.id}`);
  }

  function removeContact(index: number) {
    setContacts((prev) => prev.filter((_, i) => i !== index));
  }

  function addContact() {
    setContacts((prev) => [...prev, { name: "New Contact", relationship: "—", phone: "—" }]);
  }

  return (
    <>
      <p className="mb-4 text-sm text-slate-400">
        <Link href="/employees" className="hover:text-slate-600">Directory</Link>
        <span className="mx-2">/</span>
        <Link href={`/employees/${employee.id}`} className="hover:text-slate-600">{employee.name}</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-slate-600">Edit Profile</span>
      </p>

      <h1 className="mb-6 text-3xl font-bold">Edit Profile</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-xl bg-blue-100 text-xl font-bold text-blue-700">
                {employee.avatarInitials ?? employee.name.split(" ").map((n) => n[0]).join("")}
                <button aria-label="Change photo" className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
                    <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-bold">{legalName || employee.name}</h2>
                <p className="text-sm text-slate-500">
                  {employee.role} | {employee.department}
                </p>
                <button className="mt-1 text-sm font-medium text-blue-600">Upload New Photo</button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/employees/${employee.id}`}
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700"
              >
                Cancel
              </Link>
              <button
                onClick={handleSave}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Personal Information</h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Legal Name</label>
                <input
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  aria-label="Legal Name"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  aria-label="Date of Birth"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  aria-label="Gender"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nationality</label>
                <input
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  aria-label="Nationality"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Contact Details</h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Personal Email</label>
                <input
                  value={personalEmail}
                  onChange={(e) => setPersonalEmail(e.target.value)}
                  aria-label="Personal Enail"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Mobile Phone</label>
                <input
                  value={mobilePhone}
                  onChange={(e) => setMobilePhone(e.target.value)}
                  aria-label="Mobile Phone"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Mailing Address</label>
                <textarea
                  value={mailingAddress}
                  onChange={(e) => setMailingAddress(e.target.value)}
                  rows={2}
                  aria-label="Mailing Address"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Emergency Contacts</h2>
              <button onClick={addContact} className="text-sm font-medium text-blue-600">
                + Add Contact
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold tracking-wide text-slate-400">
                  <th className="py-2">NAME</th>
                  <th className="py-2">RELATIONSHIP</th>
                  <th className="py-2">PHONE</th>
                  <th className="py-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c, i) => (
                  <tr key={`${c.name}-${i}`} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 font-medium text-slate-800">{c.name}</td>
                    <td className="py-3 text-slate-600">{c.relationship}</td>
                    <td className="py-3 text-slate-600">{c.phone}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => removeContact(i)} aria-label={`Remove ${c.name}`}>
                        <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl bg-slate-900 p-5 text-white">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-base font-bold">Identity Verification</h3>
              <span className="rounded-md bg-green-600 px-2 py-1 text-xs font-semibold">VERIFIED</span>
            </div>
            <p className="text-sm text-slate-300">
              Identification documents were successfully verified on Oct 12, 2023.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-slate-400" />
              <span>Passport #***892 — Valid until 2028</span>
            </div>
            <button className="mt-4 w-full rounded-lg bg-slate-700 py-2.5 text-sm font-semibold">
              Re-verify Identity
            </button>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-bold">Privacy Settings</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Profile Visibility</p>
                <p className="text-xs text-slate-400">Allow coworkers to see your details</p>
              </div>
              <button
                onClick={() => setProfileVisible((v) => !v)}
                aria-label={`Prifile visibility: ${profileVisible ? "on" : "off"}`}
                className={`h-6 w-11 rounded-full transition ${profileVisible ? "bg-blue-600" : "bg-slate-200"}`}
              >
                <span
                  className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white transition ${
                    profileVisible ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Contact Visibility</p>
                <p className="text-xs text-slate-400">Keep phone number private</p>
              </div>
              <button
                onClick={() => setContactPrivate((v) => !v)}
                aria-label={`Contact visibility: ${contactPrivate ? "on" : "off"}`}
                className={`h-6 w-11 rounded-full transition ${contactPrivate ? "bg-blue-600" : "bg-slate-200"}`}
              >
                <span
                  className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white transition ${
                    contactPrivate ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <p className="mt-5 mb-2 text-xs font-semibold tracking-wide text-slate-400">NOTIFICATIONS</p>
            <div className="space-y-2 text-sm text-slate-700">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked /> Email updates for payroll
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked /> SMS for emergency alerts
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> In-app performance reviews
              </label>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
            Need to change your role or department? Please contact the{" "}
            <span className="font-medium text-blue-600">Admin Center</span> to request a structural update.
          </div>
        </div>
      </div>
    </>
  );
}