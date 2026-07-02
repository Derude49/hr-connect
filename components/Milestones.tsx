import { Award, Cake } from "lucide-react";

const milestones = [
  {
    name: "Elena Rodriguez",
    detail: "5th Work Anniversary • Tomorrow",
    icon: Award,
  },
  {
    name: "James Thompson",
    detail: "Birthday • Oct 26",
    icon: Cake,
  },
];

export default function Milestones() {
  return (
    <div className="rounded-xl bg-slate-900 p-6 text-white">
      <h2 className="mb-4 text-lg font-bold">Upcoming Milestones</h2>
      <div className="space-y-4">
        {milestones.map(({ name, detail, icon: Icon }) => (
          <div key={name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-700" />
              <div>
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs text-slate-400">{detail}</p>
              </div>
            </div>
            <Icon className="h-4 w-4 text-slate-400" />
          </div>
        ))}
      </div>
      <button className="mt-5 w-full rounded-lg bg-slate-800 py-2.5 text-sm font-semibold">
        Schedule Wishes
      </button>
    </div>
  );
}