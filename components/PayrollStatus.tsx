export default function PayrollStatus() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold tracking-wide text-slate-500">
          PAYROLL STATUS
        </p>
        <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
          ON TRACK
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-2 w-3/4 rounded-full bg-green-500" />
      </div>
      <p className="mt-3 text-sm text-slate-500">
        Processing for October period is 75% complete. Scheduled for
        disbursement on Oct 31st.
      </p>
    </div>
  );
}