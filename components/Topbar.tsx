import { Search, Bell, HelpCircle } from "lucide-react";

export default function Topbar() {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
      <div className="flex w-full max-w-md items-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          placeholder="Search employees, documents, or actions..."
          className="w-full bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-5">
        <Bell className="h-5 w-5 text-slate-500" />
        <HelpCircle className="h-5 w-5 text-slate-500" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold leading-tight">Admin User</p>
            <p className="text-xs text-slate-400">SUPER ADMINISTRATOR</p>
          </div>
          <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}