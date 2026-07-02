import { Employee } from "@/lib/mock-data";

const NEW_EMPLOYEES_KEY = "hr-connect:employees";
const OVERRIDES_KEY = "hr-connect:employee-overrides";

export function getStoredEmployees(): Employee[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NEW_EMPLOYEES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEmployee(employee: Employee) {
  const current = getStoredEmployees();
  localStorage.setItem(NEW_EMPLOYEES_KEY, JSON.stringify([...current, employee]));
}

function getOverrides(): Record<string, Partial<Employee>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function updateEmployee(id: string, changes: Partial<Employee>) {
  const overrides = getOverrides();
  overrides[id] = { ...overrides[id], ...changes };
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
}

export function getAllEmployees(seedEmployees: Employee[]): Employee[] {
  const overrides = getOverrides();
  const stored = getStoredEmployees();
  const merged = [...seedEmployees, ...stored].map((emp) => ({
    ...emp,
    ...(overrides[emp.id] ?? {}),
  }));
  return merged;
}