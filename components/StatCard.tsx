interface StatCardProps {
  label: string;
  value: string;
  accentColor: string;
  badge: { text: string; tone: "blue" | "green" | "red" };
}

const toneStyles = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-rose-50 text-rose-700",
};

const accentStyles: Record<string, string> = {
  blue: "border-l-blue-500",
  green: "border-l-emerald-500",
  red: "border-l-rose-500",
  slate: "border-l-slate-900",
};

export default function StatCard({ label, value, accentColor, badge }: Readonly<StatCardProps>) {
  return (
    <div
      className={`flex h-30 flex-col justify-between rounded-xl border border-slate-100 border-l-4 bg-white p-6 shadow-sm ${
        accentStyles[accentColor] ?? "border-l-slate-900"
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
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
