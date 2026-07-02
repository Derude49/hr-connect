"use client";

import Link from "next/link";
import { Search, UserPlus, ChevronLeft, ChevronRight, X } from "lucide-react";
import { employees as seedEmployees, Employee } from "@/lib/mock-data";
import { getAllEmployees } from "@/lib/storage";
import StatusBadge from "@/components/StatusBadge";
import { useState, useMemo, useEffect } from "react";

const PAGE_SIZE = 5;

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  
const [employees, setEmployees] = useState<Employee[]>(seedEmployees);
useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setEmployees(getAllEmployees(seedEmployees));
}, []);

  const departments = useMemo(
    () => Array.from(new Set(employees.map((e) => e.department))).sort(),
    [employees]
  );
  const roles = useMemo(
    () => Array.from(new Set(employees.map((e) => e.role))).sort(),
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        term === "" ||
        emp.name.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.employeeId.toLowerCase().includes(term);

      const matchesDepartment = department === "" || emp.department === department;
      const matchesRole = role === "" || emp.role === role;

      return matchesSearch && matchesDepartment && matchesRole;
    });
  }, [searchTerm, department, role, employees]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const hasActiveFilters = searchTerm !== "" || department !== "" || role !== "";

  function clearFilters() {
    setSearchTerm("");
    setDepartment("");
    setRole("");
    setPage(1);
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Directory</h1>
          <p className="mt-1 text-slate-500">
            Manage all organization personnel from a central dashboard.
          </p>
        </div>
        <Link
          href="/employees/onboarding"
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <UserPlus className="h-4 w-4" />
          Add New Employee
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-5">
        <div className="col-span-3 rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, or ID..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
            value={department}
            onChange={(e) => {
                setDepartment(e.target.value);
                setPage(1);
            }}
            aria-label="Filter by department"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
            value={role}
            onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
            }}
            aria-label="Filter by role"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
            >
            
              <option value="">All Roles</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-slate-900 p-5 text-white">
          <p className="text-xs font-semibold tracking-wide text-slate-400">
            TOTAL PERSONNEL
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold">{employees.length.toLocaleString()}</p>
            <span className="text-sm font-medium text-green-400">↗ +12%</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs font-semibold tracking-wide text-slate-400">
              <th className="w-12 px-6 py-4">
                <input type="checkbox" aria-label="Select all employees" />
              </th>
              <th className="px-4 py-4">NAME / AVATAR</th>
              <th className="px-4 py-4">EMPLOYEE ID</th>
              <th className="px-4 py-4">DEPARTMENT</th>
              <th className="px-4 py-4">ROLE</th>
              <th className="px-4 py-4">TYPE</th>
              <th className="px-4 py-4">STATUS</th>
              <th className="px-4 py-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                  No employees match your search or filters.
                </td>
              </tr>
            ) : (
              paginatedEmployees.map((emp) => (
                <tr key={emp.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-6 py-4">
                    <input type="checkbox" aria-label={`Select ${emp.name}`} />
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/employees/${emp.id}`} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                        {emp.avatarInitials ?? emp.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{emp.name}</p>
                        <p className="text-xs text-slate-400">{emp.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{emp.employeeId}</td>
                  <td className="px-4 py-4 text-slate-600">{emp.department}</td>
                  <td className="px-4 py-4 text-slate-600">{emp.role}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                      {emp.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={emp.status} />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link href={`/employees/${emp.id}`} className="text-sm font-medium text-blue-600">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-4 text-sm text-slate-500">
          <p>
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredEmployees.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
              {"-"}
              {Math.min(currentPage * PAGE_SIZE, filteredEmployees.length)}
            </span>{" "}
            of <span className="font-semibold text-slate-900">{filteredEmployees.length}</span>{" "}
            employees
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`rounded-lg px-3 py-1.5 font-medium ${
                  p === currentPage
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}