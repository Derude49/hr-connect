/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, ShieldAlert, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      alert("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    // 1. Handle actual registration logic here (API call, State mutation, etc.)
    console.log("Account Created:", { fullName, email, employeeId, password });

    // 2. Directs back to the login page after successful registration
    router.push('/login'); 
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-900 selection:bg-blue-500/30">
      
      {/* LEFT SIDE: Hero Brand Section */}
      <div className="relative hidden w-[40%] flex-col justify-between overflow-hidden bg-[#071122] p-12 text-white lg:flex">
        
        {/* Blueprint/Grid Pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Content Top */}
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            {/* Custom Logo Node Icon */}
            <div className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute h-2 w-2 rounded-full bg-white -translate-y-2"></span>
              <span className="absolute h-2 w-2 rounded-full bg-white -translate-x-2"></span>
              <span className="absolute h-2 w-2 rounded-full bg-white translate-x-2"></span>
              <span className="absolute h-2 w-2 rounded-full bg-white translate-y-2"></span>
              <span className="h-3 w-3 rounded-full bg-blue-500"></span>
            </div>
            <span className="text-xl font-bold tracking-wider">HR Connect</span>
          </div>
        </div>

        {/* Content Middle */}
        <div className="relative z-10 space-y-6 mt-auto mb-6">
          <div className="space-y-3 max-w-sm">
            <h1 className="text-4xl font-bold tracking-tight leading-tight">
              Join Your Team.
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Experience the future of enterprise human resources. Seamlessly manage your career, benefits, and workplace collaboration in one central portal.
            </p>
          </div>

          // eslint-disable-next-line react/jsx-no-comment-textnodes
          {/* Futuristic Data Dashboard Mockup Image Layer */}
          // eslint-disable-next-line react/jsx-no-comment-textnodes
          <div className="relative rounded-lg border border-white/10 bg-slate-900/50 p-2 overflow-hidden shadow-2xl backdrop-blur-sm">
            // eslint-disable-next-line @next/next/no-img-element, @next/next/no-img-element
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" 
              alt="Data Dashboard Mockup" 
              className="rounded opacity-80 mix-blend-screen filter hue-rotate-180 contrast-125"
            />
          </div>
        </div>

        {/* Space fallback element to cleanly match layout bottom */}
        <div className="text-xs text-slate-500 font-light"></div>
      </div>

      {/* RIGHT SIDE: Interactive Registration Form Panel */}
      <div className="flex w-full flex-col justify-between bg-white px-6 py-10 sm:px-16 md:px-24 lg:w-[60%] xl:px-32">
        
        {/* Hidden top utility spacer to visually balance design vertically */}
        <div className="hidden sm:block h-4"></div>

        <div className="mx-auto w-full max-w-lg space-y-8">
          
          {/* Header Texts */}
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              Create an account
            </h2>
            <p className="text-sm text-slate-500 font-light">
              Welcome! Please enter your details to register as an employee.
            </p>
          </div>

          {/* Form Step Indicators UI Primitive */}
          <div className="flex items-center gap-6 text-xs font-medium border-b border-slate-100 pb-4 select-none">
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white font-bold">1</span>
              <span>Identity</span>
            </div>
            <div className="h-px w-8 bg-slate-200"></div>
            <div className="flex items-center gap-2 text-slate-400 font-light">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[10px]">2</span>
              <span>Security</span>
            </div>
            <div className="h-px w-8 bg-slate-200"></div>
            <div className="flex items-center gap-2 text-slate-400 font-light">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[10px]">3</span>
              <span>Verification</span>
            </div>
          </div>

          {/* Registration Input Core Form */}
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            
            {/* Full Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 tracking-wide">
                Full Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full rounded border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Work Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 tracking-wide">
                Work Email
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
                  placeholder="j.doe@company.com"
                  required
                />
              </div>
            </div>

            {/* Employee ID Input */}
            <div className="space-y-1.5">
              <label htmlFor="employeeId" className="block text-xs font-semibold text-slate-700 tracking-wide">
                Employee ID
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <ShieldAlert className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="employeeId"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="block w-full rounded border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
                  placeholder="EMP-000-00"
                  required
                />
              </div>
            </div>

            {/* Create Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 tracking-wide">
                Create Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-light pt-0.5">
                Minimum 8 characters with at least one number and special character.
              </p>
            </div>

            {/* Legal / Policy Checkbox */}
            <div className="flex items-start pt-2">
              <input
                id="agree-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#09152e] focus:ring-slate-500 accent-[#09152e]"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-xs text-slate-600 font-light leading-normal select-none">
                I agree to the <Link href="#" className="font-normal text-blue-600 hover:underline">Terms of Service</Link> and <Link href="#" className="font-normal text-blue-600 hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            {/* Replaced Action Button: Sign Up to direct user back */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded bg-[#09152e] py-3 text-sm font-medium text-white shadow-md hover:bg-[#122246] active:scale-[0.99] transition-all"
            >
              SIGN UP
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Navigation link block back to page 1 */}
          <div className="text-center text-sm font-light text-slate-600">
            Already have an account?{' '}
            <button 
              onClick={() => router.push('/login')} 
              className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition"
            >
              Log in
            </button>
          </div>

        </div>

        {/* Footer Subtext Brand Node */}
        <div className="flex items-center justify-between text-[10px] tracking-wider text-slate-400 font-light uppercase border-t border-slate-100 pt-6 mt-12">
          <span>Secured by Enterprise Shield</span>
          <div className="flex gap-3">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>

      </div>

    </div>
  );
}