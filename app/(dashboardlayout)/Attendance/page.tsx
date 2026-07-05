'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface AttendanceRecord {
  id: number;
  name: string;
  role: string;
  date: string;
  clockIn: string;
  clockOut: string;
  hours: string;
  status: string;
}

interface StatCardProps {
  label: string;
  value: string;
  accentColor: string;
  badge: { text: string; tone: 'blue' | 'green' | 'red' | 'amber' | 'purple' };
}

const toneStyles = {
  blue:   'bg-blue-50 text-blue-700',
  green:  'bg-green-50 text-green-700',
  red:    'bg-red-50 text-red-700',
  amber:  'bg-amber-50 text-amber-700',
  purple: 'bg-purple-50 text-purple-700',
};

function StatCard({ label, value, accentColor, badge }: StatCardProps) {
  return (
    <div
      className="rounded-xl border-l-4 bg-white p-5 shadow-sm"
      style={{ borderLeftColor: accentColor }}
    >
      <p className="text-xs font-semibold tracking-wide text-slate-400">{label}</p>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        <span className={`rounded-md px-2 py-1 text-xs font-semibold ${toneStyles[badge.tone]}`}>
          {badge.text}
        </span>
      </div>
    </div>
  );
}

const employeeList = [
  { name: "Sarah Jenkins", role: "Marketing Team" },
  { name: "Marcus Vane",   role: "Operations" },
  { name: "Leo Zhang",     role: "Engineering" },
  { name: "Amira Osei",    role: "HR & Admin" },
  { name: "David Kimani",  role: "Design Team" },
  { name: "Priya Nair",    role: "Sales" },
  { name: "James Mwangi",  role: "Finance" },
];

const departments = ["Marketing Team", "Operations", "Engineering", "HR & Admin", "Design Team", "Sales", "Finance"];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

const avatarColors: Record<string, string> = {
  "Marketing Team": "bg-pink-100 text-pink-700",
  "Operations":     "bg-orange-100 text-orange-700",
  "Engineering":    "bg-blue-100 text-blue-700",
  "HR & Admin":     "bg-purple-100 text-purple-700",
  "Design Team":    "bg-teal-100 text-teal-700",
  "Sales":          "bg-green-100 text-green-700",
  "Finance":        "bg-amber-100 text-amber-700",
};

const defaultData: AttendanceRecord[] = [
  { id: 1, name: "Sarah Jenkins", role: "Marketing Team", date: "Oct 25, 2023", clockIn: "08:45 AM", clockOut: "05:30 PM", hours: "8h 45m", status: "Present" },
  { id: 2, name: "Marcus Vane",   role: "Operations",     date: "Oct 25, 2023", clockIn: "09:12 AM", clockOut: "06:05 PM", hours: "8h 53m", status: "Remote"  },
  { id: 3, name: "Leo Zhang",     role: "Engineering",    date: "Oct 25, 2023", clockIn: "09:45 AM", clockOut: "06:30 PM", hours: "8h 45m", status: "Late"    },
];

export default function AttendanceLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState('2023-10-25');
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [newAttendance, setNewAttendance] = useState({
    name: '',
    role: 'Marketing Team',
    clockIn: '',
    clockOut: '',
    status: 'Present'
  });

// Lazy initializer — runs once, no useEffect needed for loading
const [records, setRecords] = useState<AttendanceRecord[]>(() => {
  try {
    const saved = localStorage.getItem('attendanceRecords');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fall through to default
  }
  return defaultData;
});

// Save whenever records change
useEffect(() => {
  try {
    localStorage.setItem('attendanceRecords', JSON.stringify(records));
  } catch {
    console.error('Failed to save records');
  }
}, [records]);

  // Save to localStorage only after initial load
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('attendanceRecords', JSON.stringify(records));
    } catch {
      console.error('Failed to save records');
    }
  }, [records, isLoaded]);

  const handleEmployeeSelect = (selectedName: string) => {
    const employee = employeeList.find(e => e.name === selectedName);
    setNewAttendance({
      ...newAttendance,
      name: selectedName,
      role: employee ? employee.role : newAttendance.role,
    });
  };

  const filteredData = records.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateHours = (clockIn: string, clockOut: string): string => {
    if (!clockIn || !clockOut) return "Pending";
    return "8h 30m";
  };

  const handleMarkAttendance = () => {
    if (!newAttendance.name || !newAttendance.clockIn) {
      alert("Please fill required fields");
      return;
    }
    const newRecord: AttendanceRecord = {
      id: Date.now(),
      name: newAttendance.name,
      role: newAttendance.role,
      date: new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      clockIn: newAttendance.clockIn,
      clockOut: newAttendance.clockOut || "Pending",
      hours: calculateHours(newAttendance.clockIn, newAttendance.clockOut),
      status: newAttendance.status
    };
    setRecords(prev => [newRecord, ...prev]);
    setIsMarkModalOpen(false);
    setNewAttendance({ name: '', role: 'Marketing Team', clockIn: '', clockOut: '', status: 'Present' });
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this record?")) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4 md:p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Attendance Log</h1>
            <p className="text-gray-600 mt-1">Monitor daily attendance, track work hours, and manage team presence.</p>
          </div>

          <Dialog open={isMarkModalOpen} onOpenChange={setIsMarkModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 px-6 py-2.5 text-base font-medium">
                <Plus className="w-5 h-5" />
                Mark Attendance
              </Button>
            </DialogTrigger>

            <DialogContent
  className="sm:max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200"
  onInteractOutside={(e) => e.preventDefault()}
  onEscapeKeyDown={(e) => e.preventDefault()}
>
  <DialogHeader>
    <DialogTitle className="text-lg font-semibold text-gray-900">Mark Attendance</DialogTitle>
  </DialogHeader>
  <div className="space-y-5 py-4">

    {/* Employee Name */}
    <div>
      <Label className="text-sm font-medium text-gray-700">Employee Name</Label>
      <Select value={newAttendance.name} onValueChange={handleEmployeeSelect}>
        <SelectTrigger className="mt-2 h-11 bg-white border-gray-300 rounded-xl">
          <SelectValue placeholder="Select employee..." />
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="z-[200] bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          {employeeList.map(emp => (
            <SelectItem
              key={emp.name}
              value={emp.name}
              className="py-2 cursor-pointer hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColors[emp.role] ?? 'bg-gray-100 text-gray-600'}`}>
                  {getInitials(emp.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 leading-tight">{emp.name}</p>
                  <p className="text-xs text-gray-400 leading-tight mt-0.5">{emp.role}</p>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Department */}
    <div>
      <Label className="text-sm font-medium text-gray-700">Department</Label>
      <Select value={newAttendance.role} onValueChange={(value) => setNewAttendance({ ...newAttendance, role: value })}>
        <SelectTrigger className="mt-2 h-11 bg-white border-gray-300 rounded-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="z-[200] bg-white border border-gray-200 rounded-xl shadow-lg"
        >
          {departments.map(dept => (
            <SelectItem
              key={dept}
              value={dept}
              className="cursor-pointer hover:bg-gray-50 rounded-lg"
            >
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Status */}
    <div>
      <Label className="text-sm font-medium text-gray-700">Status</Label>
      <Select value={newAttendance.status} onValueChange={(value) => setNewAttendance({ ...newAttendance, status: value })}>
        <SelectTrigger className="mt-2 h-11 bg-white border-gray-300 rounded-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="z-[200] bg-white border border-gray-200 rounded-xl shadow-lg"
        >
          <SelectItem value="Present" className="cursor-pointer hover:bg-gray-50 rounded-lg">✅ Present</SelectItem>
          <SelectItem value="Late" className="cursor-pointer hover:bg-gray-50 rounded-lg">⏰ Late</SelectItem>
          <SelectItem value="Remote" className="cursor-pointer hover:bg-gray-50 rounded-lg">🏠 Remote</SelectItem>
          <SelectItem value="On Leave" className="cursor-pointer hover:bg-gray-50 rounded-lg">🌴 On Leave</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Clock In / Clock Out */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="text-sm font-medium text-gray-700">Clock In</Label>
        <Input
          type="time"
          value={newAttendance.clockIn}
          onChange={(e) => setNewAttendance({ ...newAttendance, clockIn: e.target.value })}
          className="mt-2 h-11 bg-white border-gray-300 rounded-xl"
        />
      </div>
      <div>
        <Label className="text-sm font-medium text-gray-700">Clock Out</Label>
        <Input
          type="time"
          value={newAttendance.clockOut}
          onChange={(e) => setNewAttendance({ ...newAttendance, clockOut: e.target.value })}
          className="mt-2 h-11 bg-white border-gray-300 rounded-xl"
        />
      </div>
    </div>

    <Button onClick={handleMarkAttendance} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold">
      Save Attendance
    </Button>
  </div>
</DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="TOTAL PRESENT TODAY" value="142 / 156" accentColor="#10b981" badge={{ text: '↑ 91% today',     tone: 'green'  }} />
          <StatCard label="LATE ARRIVALS"        value="08"        accentColor="#f59e0b" badge={{ text: '↑ 2 vs yesterday', tone: 'amber'  }} />
          <StatCard label="AVG. WORK HOURS"      value="8.2h"      accentColor="#3b82f6" badge={{ text: '↑ 0.4h this week', tone: 'blue'   }} />
          <StatCard label="ON LEAVE"             value="06"        accentColor="#a855f7" badge={{ text: 'Planned today',    tone: 'purple' }} />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input placeholder="Search employee name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-11 h-11" />
          </div>
          <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full md:w-52 h-11" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 h-11">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Present">Present</SelectItem>
              <SelectItem value="Late">Late</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="On Leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl overflow-hidden border shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">EMPLOYEE NAME</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">DATE</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">CLOCK IN</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">CLOCK OUT</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">TOTAL HOURS</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-600">STATUS</th>
                <th className="text-right py-4 px-6 font-medium text-sm">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-medium">{record.name}</div>
                    <div className="text-xs text-gray-500">{record.role}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{record.date}</td>
                  <td className="py-4 px-6 text-sm font-medium">{record.clockIn}</td>
                  <td className="py-4 px-6 text-sm font-medium">{record.clockOut}</td>
                  <td className="py-4 px-6 text-sm font-medium">{record.hours}</td>
                  <td className="py-4 px-6">
                    <Badge variant={record.status === "Present" ? "default" : "secondary"}>{record.status}</Badge>
                  </td>
                  <td className="py-4 px-6 text-right text-sm">
                    <button className="text-blue-600 hover:text-blue-700 mr-3"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(record.id)} className="text-red-600 hover:text-red-700"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <p className="text-sm">No records found.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}