"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Building2, KeyRound, User, ShieldAlert } from 'lucide-react';

export default function AuthPage() {
  // Toggle between 'login' and 'register' views dynamically
  const [view, setView] = useState<'login' | 'register'>('login');
  
  // Form States
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Logging in with Admin Credentials:", { email, password, rememberMe });
    
    // Switch to registration view directly on submission to demonstrate link flow
    setView('register');
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    console.log("Account Created:", { fullName, email, employeeId, password });
    
    // Go back to login screen on completion
    setView('login');
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-900 selection:bg-blue-500/30">
      
      {/* LEFT SIDE: Brand Hero Panel */}
      <div className="relative hidden w-7/12 flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex transition-all duration-500">
        
        {/* Background Image Grid Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity contrast-125 transition-all duration-700"
          style={{ 
            backgroundImage: view === 'login' 
              ? "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200')"
              : "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200')"
          }}
        />
        
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

        {/* Brand Node Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute h-2 w-2 rounded-full bg-white -translate-y-2"></span>
              <span className="absolute h-2 w-2 rounded-full bg-white -translate-x-2"></span>
              <span className="absolute h-2 w-2 rounded-full bg-white translate-x-2"></span>
              <span className="absolute h-2 w-2 rounded-full bg-white translate-y-2"></span>
              <span className="h-3 w-3 rounded-full bg-blue-500"></span>
            </div>
            <span className="text-xl font-bold tracking-wider uppercase">HR Connect</span>
          </div>
        </div>

        {/* Dynamic Left Content Texts */}
        <div className="relative z-10 max-w-xl pr-6 space-y-4">
          {view === 'login' ? (
            <>
              <h1 className="text-4xl font-semibold tracking-tight leading-tight animate-fade-in">
                Empowering People,<br />Optimizing Enterprise.
              </h1>
              <p className="text-base text-slate-300 leading-relaxed font-light">
                The unified gateway for workforce management, payroll intelligence, and organizational growth. 
                Access your enterprise dashboard and manage human capital with professional precision.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-semibold tracking-tight leading-tight animate-fade-in">
                Join Your Team.<br />Explore the Future.
              </h1>
              <p className="text-base text-slate-300 leading-relaxed font-light">
                Experience the tomorrow of enterprise human resources. Seamlessly manage your career tracking, core benefits configurations, and corporate collaboration all inside one unified system workspace.
              </p>
            </>
          )}
        </div>

        {/* Left Side Panel Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 font-light tracking-wide border-t border-white/10 pt-4">
          <span>&copy; {new Date().getFullYear()} HR Connect Enterprise</span>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span>System Status: <span className="text-emerald-400 font-medium">Operational</span></span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Single-Container Authentication Form Control */}
      <div className="flex w-full flex-col justify-center bg-white px-6 py-12 sm:px-16 md:px-24 lg:w-5/12 xl:px-28">
        <div className="mx-auto w-full max-w-md space-y-8">
          
          {/* ================================================================= */}
          {/* CONDITION A: LOGIN VIEW ROUTE CONTAINER                          */}
          {/* ================================================================= */}
          {view === 'login' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Welcome Back</h2>
                <p className="text-sm text-slate-500 font-light">Please enter your administrative credentials to continue.</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">Email Address</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Mail className="h-4 w-4 text-slate-400" /></div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">Password</label>
                    <button type="button" onClick={() => setView('register')} className="text-xs font-medium text-blue-600 hover:underline">Forgot password?</button>
                  </div>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Lock className="h-4 w-4 text-slate-400" /></div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 accent-slate-900"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 font-light select-none">Keep me logged in for 30 days</label>
                </div>

                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded bg-[#09152e] py-3 text-sm font-medium text-white shadow-md hover:bg-[#122246] active:scale-[0.99] transition-all">
                  SIGN IN TO PORTAL
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider"><span className="bg-white px-3 text-[10px] font-semibold text-slate-400">OR CONTINUE WITH</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setView('register')} className="flex items-center justify-center gap-2 rounded border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
                  <Building2 className="h-3.5 w-3.5 text-slate-500" /> Single Sign-On
                </button>
                <button type="button" onClick={() => setView('register')} className="flex items-center justify-center gap-2 rounded border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
                  <KeyRound className="h-3.5 w-3.5 text-slate-500" /> Security Key
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* CONDITION B: REGISTRATION VIEW ROUTE CONTAINER                     */}
          {/* ================================================================= */}
          {view === 'register' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Create an account</h2>
                <p className="text-sm text-slate-500 font-light">Welcome! Please enter your details to register as an employee.</p>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-medium border-b border-slate-100 pb-3 select-none">
                <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] text-white font-bold">1</span>
                  <span>Identity</span>
                </div>
                <div className="h-px w-6 bg-slate-200"></div>
                <div className="flex items-center gap-1.5 text-slate-400 font-light">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[9px]">2</span>
                  <span>Security</span>
                </div>
                <div className="h-px w-6 bg-slate-200"></div>
                <div className="flex items-center gap-1.5 text-slate-400 font-light">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[9px]">3</span>
                  <span>Verification</span>
                </div>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 tracking-wide">Full Name</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><User className="h-4 w-4 text-slate-400" /></div>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full rounded border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none transition"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="regEmail" className="block text-xs font-semibold text-slate-700 tracking-wide">Work Email</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Mail className="h-4 w-4 text-slate-400" /></div>
                    <input
                      type="email"
                      id="regEmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none transition"
                      placeholder="j.doe@company.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="employeeId" className="block text-xs font-semibold text-slate-700 tracking-wide">Employee ID</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><ShieldAlert className="h-4 w-4 text-slate-400" /></div>
                    <input
                      type="text"
                      id="employeeId"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className="block w-full rounded border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none transition"
                      placeholder="EMP-000-00"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="regPassword" className="block text-xs font-semibold text-slate-700 tracking-wide">Create Password</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Lock className="h-4 w-4 text-slate-400" /></div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="regPassword"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-10 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none transition"
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start pt-1">
                  <input
                    id="agree-terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#09152e] accent-[#09152e]"
                  />
                  <label htmlFor="agree-terms" className="ml-2 block text-xs text-slate-600 font-light leading-none select-none">
                    I agree to the <Link href="#" className="text-blue-600 font-normal hover:underline">Terms of Service</Link> and <Link href="#" className="text-blue-600 font-normal hover:underline">Privacy Policy</Link>.
                  </label>
                </div>

                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded bg-[#09152e] py-3 text-sm font-medium text-white shadow-md hover:bg-[#122246] active:scale-[0.99] transition-all">
                  SIGN UP
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="text-center text-sm font-light text-slate-600 pt-2">
                Already have an account?{' '}
                <button type="button" onClick={() => setView('login')} className="font-medium text-blue-600 hover:underline">Log in</button>
              </div>
            </div>
          )}

          {/* Persistent Panel Helper Footer Link */}
          <div className="pt-6 text-center text-xs font-light text-slate-600 border-t border-slate-100">
            Need assistance?{' '}
            <Link href="#" className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition">
              Contact System Admin
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}