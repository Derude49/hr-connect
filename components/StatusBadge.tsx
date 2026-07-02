const statusStyles = {
  Active: "bg-green-50 text-green-700",
  Suspended: "bg-amber-50 text-amber-700",
  Resigned: "bg-red-50 text-red-700",
};

export default function StatusBadge({ status }: { status: keyof typeof statusStyles }) {
  return (
    <span className={`rounded-md px-2 py-1 text-xs font-semibold uppercase ${statusStyles[status]}`}>
      {status}
    </span>
  );
}