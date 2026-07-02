import React from 'react';
import { ArrowRight, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function RunPayrollPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
              Payroll • <span className="text-gray-900 font-medium">Run Payroll</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Run Payroll Configuration</h1>
            <p className="text-gray-600 mt-2 text-base">Configure the current pay cycle, employee eligibility, and specific adjustments.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium text-gray-700 text-sm">
              Save Draft
            </button>
            <button className="flex-1 md:flex-none px-5 py-2.5 bg-black text-white rounded-xl hover:bg-black/90 font-medium text-sm">
              Initialize Run
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Pay Period Selection */}
            <div className="bg-white border rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center font-semibold text-xs">1</div>
                <h2 className="text-xl font-semibold text-gray-900">Pay Period Selection</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-2">Pay Cycle Frequency</p>
                  <select className="w-full border border-gray-300 rounded-2xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Monthly (Standard)</option>
                    <option>Bi-Weekly</option>
                    <option>Weekly</option>
                  </select>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-700 mb-2">Pay Period Range</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="date"
                      defaultValue="2023-10-01"
                      className="flex-1 border border-gray-300 rounded-2xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-400 font-medium text-sm">to</span>
                    <input
                      type="date"
                      defaultValue="2023-10-31"
                      className="flex-1 border border-gray-300 rounded-2xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-blue-700 text-xs flex gap-2">
                ℹ️ This pay period includes <strong>22 working days</strong> and <strong>2 public holidays</strong>.
              </div>
            </div>

            {/* 2. Employee Selection */}
            <div className="bg-white border rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center font-semibold text-xs">2</div>
                <h2 className="text-xl font-semibold text-gray-900">Employee Selection</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="border-2 border-blue-600 rounded-3xl p-5 relative">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">👥</div>
                    <div>
                      <div className="font-semibold text-base text-gray-900">All Employees</div>
                      <div className="text-xs text-gray-600">Include all 1,240 active personnel.</div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                </div>

                <div className="border border-gray-200 hover:border-gray-300 transition-all rounded-3xl p-5 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🏢</div>
                    <div>
                      <div className="font-semibold text-base text-gray-900">Specific Department</div>
                      <div className="text-xs text-gray-600">Filter by departments or cost centers.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-medium text-gray-700 mb-3">Selected Departments</p>
                <div className="flex flex-wrap gap-2">
                  {['Engineering', 'Product Design', 'Marketing'].map((dept) => (
                    <div key={dept} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1">
                      {dept} <span className="text-gray-400 cursor-pointer hover:text-red-500">×</span>
                    </div>
                  ))}
                  <button className="border border-dashed border-gray-300 px-3 py-1.5 rounded-xl text-xs text-gray-600 hover:bg-gray-50">
                    + Add Dept
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Adjustments & Deductions */}
            <div className="bg-white border rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center font-semibold text-xs">3</div>
                <h2 className="text-xl font-semibold text-gray-900">Adjustments &amp; Deductions</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="border border-gray-200 rounded-3xl p-5">
                  <p className="text-xs text-gray-500">Performance Bonuses</p>
                  <p className="text-3xl font-semibold mt-1 text-gray-900">$0.00</p>
                  <p className="text-xs text-gray-600 mt-1">Applied to Q3 Top Performers (42 employees)</p>
                </div>

                <div className="border border-gray-200 rounded-3xl p-5">
                  <p className="text-xs text-gray-500">Additional Deductions</p>
                  <p className="text-3xl font-semibold mt-1 text-gray-900">$0.00</p>
                  <p className="text-xs text-gray-600 mt-1">Benefit adjustments or loan repayments</p>
                </div>
              </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border rounded-3xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-gray-900">Compliance Check</h3>
                    <p className="text-xs text-gray-600 mt-1">All statutory tax filings for the period are updated and validated for <span className="font-medium">100% compliance</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-3xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0 text-xl">💰</div>
                  <div>
                    <h3 className="font-semibold text-base text-gray-900">Funding Status</h3>
                    <p className="text-xs text-gray-600 mt-1">Company payroll account has sufficient liquidity to cover the estimated $4.33M disbursement.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-3xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-gray-900">Timeline</h3>
                    <p className="text-xs text-gray-600 mt-1">Estimated processing time: 4 hours.<br />Funds scheduled to hit employee accounts on Nov 01.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white border rounded-3xl sticky top-8 overflow-hidden shadow-sm">
              <div className="bg-linear-to-br from-zinc-900 to-black text-white p-6">
                <h3 className="text-lg font-semibold">Preview Summary</h3>
                <p className="text-gray-400 text-xs mt-1">Estimated figures for Oct 2023</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Eligible Employees</span>
                  <span className="text-xl font-bold text-gray-900">1,240</span>
                </div>

                <div className="space-y-3 text-sm">
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

                <div className="pt-5 border-t">
                  <div className="flex justify-between items-end">
                    <span className="font-semibold text-gray-900">ESTIMATED TOTAL</span>
                    <span className="text-3xl font-bold text-emerald-600">$4,330,200.00</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 mt-1 text-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+2.4% Increase</span>
                  </div>
                </div>

                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 text-sm">
                  Execute Payroll Run
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}