'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function RunPayrollPage() {
  const [startDate, setStartDate] = useState('2023-10-01');
  const [endDate, setEndDate] = useState('2023-10-31');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xl">HR</div>
              <span className="font-semibold text-2xl tracking-tight text-gray-900">Connect</span>
            </div>
            
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search employees or reports..."
                className="w-full pl-10 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-gray-500 hover:text-gray-700">🛎️</button>
            <button className="text-gray-500 hover:text-gray-700">❔</button>
            <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">JD</div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
              Payroll • <span className="text-gray-900 font-medium">Run Payroll</span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900">Run Payroll Configuration</h1>
            <p className="text-gray-700 mt-3 text-lg">
              Configure the current pay cycle, employee eligibility, and specific adjustments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700">
              Save Draft
            </button>
            <button className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-black/90 font-medium">
              Initialize Run
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* 1. Pay Period Selection */}
            <div className="bg-white border rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-semibold text-sm">1</div>
                <h2 className="text-2xl font-semibold text-gray-900">Pay Period Selection</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Pay Cycle Frequency</p>
                  <select className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Monthly (Standard)</option>
                    <option>Bi-Weekly</option>
                    <option>Weekly</option>
                  </select>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Pay Period Range</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-400 font-medium">to</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-5 text-blue-700 text-sm flex gap-3">
                ℹ️ This pay period includes <strong>22 working days</strong> and <strong>2 public holidays</strong> (Oct 9, Oct 23).
              </div>
            </div>

            {/* 2. Employee Selection */}
            <div className="bg-white border rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-semibold text-sm">2</div>
                <h2 className="text-2xl font-semibold text-gray-900">Employee Selection</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-blue-600 rounded-2xl p-6 relative">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">👥</div>
                    <div>
                      <div className="font-semibold text-lg text-gray-900">All Employees</div>
                      <div className="text-gray-600">Include all 1,240 active personnel across all branches.</div>
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">✓</span>
                  </div>
                </div>

                <div className="border border-gray-200 hover:border-gray-300 transition-all rounded-2xl p-6 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🏢</div>
                    <div>
                      <div className="font-semibold text-lg text-gray-900">Specific Department</div>
                      <div className="text-gray-600">Filter the payroll run by departments or cost centers.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm font-medium text-gray-700 mb-3">Selected Departments</p>
                <div className="flex flex-wrap gap-2">
                  {['Engineering', 'Product Design', 'Marketing'].map((dept) => (
                    <div key={dept} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                      {dept} <span className="text-gray-400 cursor-pointer hover:text-red-500">×</span>
                    </div>
                  ))}
                  <button className="border border-dashed border-gray-300 px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
                    + Add Dept
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Adjustments & Deductions */}
            <div className="bg-white border rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-semibold text-sm">3</div>
                <h2 className="text-2xl font-semibold text-gray-900">Adjustments &amp; Deductions</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-2xl p-6">
                  <p className="text-sm text-gray-500">Performance Bonuses</p>
                  <p className="text-4xl font-semibold mt-2 text-gray-900">$0.00</p>
                  <p className="text-sm text-gray-600 mt-1">Applied to Q3 Top Performers (42 employees)</p>
                </div>

                <div className="border border-gray-200 rounded-2xl p-6">
                  <p className="text-sm text-gray-500">Additional Deductions</p>
                  <p className="text-4xl font-semibold mt-2 text-gray-900">$0.00</p>
                  <p className="text-sm text-gray-600 mt-1">Benefit adjustments or loan repayments</p>
                </div>
              </div>

              <div className="mt-8 border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <div className="text-5xl mb-4">📊</div>
                <p className="font-medium text-gray-900">Bulk Upload Adjustments (CSV/XLSX)</p>
                <p className="text-sm text-gray-500 mt-2">Drag and drop file to auto-populate employee-specific variations.</p>
              </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Compliance Check</h3>
                    <p className="text-sm text-gray-600 mt-2">All statutory tax filings for the period are updated and validated for <span className="font-medium">100% compliance</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0 text-2xl">💰</div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Funding Status</h3>
                    <p className="text-sm text-gray-600 mt-2">Company payroll account has sufficient liquidity to cover the estimated $4.33M disbursement.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Timeline</h3>
                    <p className="text-sm text-gray-600 mt-2">Estimated processing time: 4 hours.<br />Funds scheduled to hit employee accounts on Nov 01.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white border rounded-3xl sticky top-8 overflow-hidden shadow-sm">
              <div className="bg-linear-to-br from-zinc-900 to-black text-white p-8">
                <h3 className="text-xl font-semibold">Preview Summary</h3>
                <p className="text-gray-400 text-sm mt-1">Estimated figures for Oct 2023</p>
              </div>

              <div className="p-8 space-y-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Eligible Employees</span>
                  <span className="text-2xl font-bold text-gray-900">1,240</span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Gross Pay</span>
                    <span className="font-medium text-gray-900">$4,250,000.00</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Total Bonuses</span>
                    <span>+$125,400.00</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Total Deductions</span>
                    <span>-$45,200.00</span>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-semibold text-gray-900">ESTIMATED TOTAL</span>
                    <span className="text-4xl font-bold text-emerald-600">$4,330,200.00</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 mt-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+2.4% Increase</span>
                  </div>
                </div>

                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 text-lg">
                  Execute Payroll Run
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Vs Last Month */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-9 h-9 bg-white border rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Vs Last Month</div>
                    <div className="font-semibold text-emerald-600">+2.4% Increase</div>
                  </div>
                  <div className="ml-auto text-emerald-500">
                    <TrendingUp className="w-10 h-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}