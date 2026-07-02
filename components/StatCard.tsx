interface StatCardProps {
  label: string;
  value: string;
  accentColor: string;
  badge: { text: string; tone: "blue" | "green" | "red" };
}

const toneStyles = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  red: "bg-red-50 text-red-700",
};

export default function StatCard({ label, value, accentColor, badge }: StatCardProps) {
  return (
    <div
      className="rounded-xl border-l-4 bg-white p-5 shadow-sm"
      style={{ borderLeftColor: accentColor }}
    >
      <p className="text-xs font-semibold tracking-wide text-slate-400">
        {label}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        <span
          className={`rounded-md px-2 py-1 text-xs font-semibold ${toneStyles[badge.tone]}`}
        >
          {badge.text}
        </span>
      </div>
    </div>
  );
}