/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { Bell, HelpCircle, Plus, Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AttendancePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">HR</span>
              </div>
              <span className="font-semibold text-2xl tracking-tight text-gray-900">Connect</span>
            </div>

            {/* Search Bar */}
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search employee or records..."
                className="w-full bg-gray-100 border border-gray-200 pl-11 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            <button className="text-gray-500 hover:text-gray-700 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-700 transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium text-sm text-gray-900">Alex Sterling</p>
                <p className="text-xs text-gray-500 -mt-0.5">ADMIN</p>
              </div>
              // eslint-disable-next-line react/jsx-no-comment-textnodes
              <div className="w-9 h-9 bg-gray-300 rounded-full overflow-hidden border-2 border-white shadow">
                // eslint-disable-next-line @next/next/no-img-element, @next/next/no-img-element
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Alex Sterling" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900">Attendance</h1>
            <p className="text-gray-600 mt-1">Monday, June 29, 2026 • 09:45 AM</p>
          </div>

          {/* Floating Action Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all hover:scale-105">
            <Plus className="w-7 h-7" />
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Present Today</p>
                <p className="text-5xl font-semibold text-gray-900 mt-3">1,184</p>
                <p className="text-emerald-600 text-sm font-medium mt-1">95% Attendance Rate</p>
              </div>
              <CheckCircle className="w-14 h-14 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Late Arrivals</p>
                <p className="text-5xl font-semibold text-amber-600 mt-3">47</p>
              </div>
              <AlertTriangle className="w-14 h-14 text-amber-500" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">On Leave</p>
                <p className="text-5xl font-semibold text-blue-600 mt-3">29</p>
              </div>
              <Clock className="w-14 h-14 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Employees</p>
                <p className="text-5xl font-semibold text-gray-900 mt-3">1,245</p>
              </div>
              <Users className="w-14 h-14 text-gray-400" />
            </div>
          </div>
        </div>

        {/* You can add more sections like Today's Attendance Table here */}
      </div>
    </div>
  );
}