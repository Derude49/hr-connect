const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700",
  Suspended: "bg-amber-50 text-amber-700",
  Resigned: "bg-rose-50 text-rose-700",
};

export default function StatusBadge({ status }: { status: keyof typeof statusStyles }) {
  return (
    <span className={`rounded-md px-2 py-1 text-xs font-semibold uppercase ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
