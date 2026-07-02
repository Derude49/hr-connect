import { UserPlus, CheckCircle2, Briefcase, MoreVertical } from "lucide-react";

const activities = [
  {
    icon: UserPlus,
    iconBg: "bg-blue-100 text-blue-600",
    text: (
      <>
        <span className="font-semibold">Sarah Jenkins</span> joined as Senior
        UX Designer in the Product Team.
      </>
    ),
    meta: "2 HOURS AGO • NEW HIRE",
  },
  {
    icon: CheckCircle2,
    iconBg: "bg-green-100 text-green-600",
    text: (
      <>
        <span className="font-semibold">Marcus Wong&apos;s</span> annual
        leave request was approved by Dept Head.
      </>
    ),
    meta: "5 HOURS AGO • LEAVE APPROVAL",
  },
  {
    icon: Briefcase,
    iconBg: "bg-slate-100 text-slate-600",
    text: (
      <>
        <span className="font-semibold">Digital Marketing Team</span> profile
        was updated with a new organization head.
      </>
    ),
    meta: "YESTERDAY • PROFILE UPDATE",
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Recent Activities</h2>
        <button className="text-sm font-medium text-blue-600">
          View History
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-4 py-4">
            <div className={`rounded-lg p-2 ${a.iconBg}`}>
              <a.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-700">{a.text}</p>
              <p className="mt-1 text-xs tracking-wide text-slate-400">
                {a.meta}
              </p>
            </div>
            <MoreVertical className="h-4 w-4 text-slate-400" />
          </div>
        ))}
      </div>
    </div>
  );
}