'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, AlertTriangle, Clock, Calendar, Search, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
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

const departments = [
  "Marketing Team", "Operations", "Engineering", 
  "HR & Admin", "Design Team", "Sales", "Finance"
];

export default function AttendanceLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState('2023-10-25');
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [, setIsEditModalOpen] = useState(false);
  const [, setEditingRecord] = useState<AttendanceRecord | null>(null);

  const [newAttendance, setNewAttendance] = useState({
    name: '',
    role: 'Marketing Team',
    clockIn: '',
    clockOut: '',
    status: 'Present'
  });

  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('attendanceRecords');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setRecords(JSON.parse(saved));
    else {
      const defaultData = [
        { id: 1, name: "Sarah Jenkins", role: "Marketing Team", date: "Oct 25, 2023", clockIn: "08:45 AM", clockOut: "05:30 PM", hours: "8h 45m", status: "Present" },
        { id: 2, name: "Marcus Vane", role: "Operations", date: "Oct 25, 2023", clockIn: "09:12 AM", clockOut: "06:05 PM", hours: "8h 53m", status: "Remote" },
        { id: 3, name: "Leo Zhang", role: "Engineering", date: "Oct 25, 2023", clockIn: "09:45 AM", clockOut: "06:30 PM", hours: "8h 45m", status: "Late" },
      ];
      setRecords(defaultData);
      localStorage.setItem('attendanceRecords', JSON.stringify(defaultData));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('attendanceRecords', JSON.stringify(records));
  }, [records]);

  const filteredData = records.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateHours = (clockIn: string, clockOut: string): string => {
    if (!clockIn || !clockOut) return "Pending";
    // Simple calculation - in real app use better time library
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

    setRecords([newRecord, ...records]);
    setIsMarkModalOpen(false);
    setNewAttendance({ name: '', role: 'Marketing Team', clockIn: '', clockOut: '', status: 'Present' });
  };

  const handleEdit = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this record?")) {
      setRecords(records.filter(r => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Attendance Log</h1>
            <p className="text-gray-600 mt-1">Monitor daily attendance, track work hours, and manage team presence.</p>
          </div>

          <Dialog open={isMarkModalOpen} onOpenChange={setIsMarkModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Mark Attendance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mark New Attendance</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div>
                  <Label>Employee Name</Label>
                  <Input value={newAttendance.name} onChange={(e) => setNewAttendance({...newAttendance, name: e.target.value})} placeholder="Full Name" />
                </div>
                <div>
                  <Label>Department</Label>
                  <Select value={newAttendance.role} onValueChange={(value) => setNewAttendance({...newAttendance, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Clock In</Label>
                    <Input type="time" value={newAttendance.clockIn} onChange={(e) => setNewAttendance({...newAttendance, clockIn: e.target.value})} />
                  </div>
                  <div>
                    <Label>Clock Out</Label>
                    <Input type="time" value={newAttendance.clockOut} onChange={(e) => setNewAttendance({...newAttendance, clockOut: e.target.value})} />
                  </div>
                </div>
                <Button onClick={handleMarkAttendance} className="w-full">Save Attendance</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">TOTAL PRESENT TODAY</p>
                  <p className="text-3xl font-bold mt-2">142 / 156</p>
                  <p className="text-emerald-600 text-sm">↑ 91% today</p>
                </div>
                <Users className="text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">LATE ARRIVALS</p>
                  <p className="text-3xl font-bold mt-2 text-amber-600">08</p>
                  <p className="text-amber-600 text-sm">↑ 2 vs yesterday</p>
                </div>
                <AlertTriangle className="text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">AVG. WORK HOURS</p>
                  <p className="text-3xl font-bold mt-2">8.2h</p>
                  <p className="text-emerald-600 text-sm">↑ 0.4h this week</p>
                </div>
                <Clock className="text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">ON LEAVE</p>
                  <p className="text-3xl font-bold mt-2">06</p>
                  <p className="text-purple-600 text-sm">Planned leaves today</p>
                </div>
                <Calendar className="text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <Input placeholder="Search employee name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-11" />
          </div>

          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-3 w-full md:w-52" />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
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

          <Button variant="outline">Export</Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl overflow-hidden border">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-sm">EMPLOYEE NAME</th>
                <th className="text-left py-4 px-6 font-medium text-sm">DATE</th>
                <th className="text-left py-4 px-6 font-medium text-sm">CLOCK IN</th>
                <th className="text-left py-4 px-6 font-medium text-sm">CLOCK OUT</th>
                <th className="text-left py-4 px-6 font-medium text-sm">TOTAL HOURS</th>
                <th className="text-left py-4 px-6 font-medium text-sm">STATUS</th>
                <th className="text-right py-4 px-6 font-medium text-sm">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(record => (
                <tr key={record.id} className="border-t hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-medium">{record.name}</div>
                    <div className="text-xs text-gray-500">{record.role}</div>
                  </td>
                  <td className="py-4 px-6 text-sm">{record.date}</td>
                  <td className="py-4 px-6 text-sm font-medium">{record.clockIn}</td>
                  <td className="py-4 px-6 text-sm font-medium">{record.clockOut}</td>
                  <td className="py-4 px-6 text-sm font-medium">{record.hours}</td>
                  <td className="py-4 px-6">
                    <Badge variant={record.status === "Present" ? "default" : record.status === "Late" ? "destructive" : "secondary"}>{record.status}</Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => handleEdit(record)} className="text-blue-600 hover:text-blue-700 mr-3"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(record.id)} className="text-red-600 hover:text-red-700"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}