"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface UserAccount {
  fullName: string;
  email: string;
  employeeId: string;
  password: string;
}

export default function AuthPage() {
  const router = useRouter();
  
  const [view, setView] = useState<'login' | 'register'>('login');
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAccounts = (): UserAccount[] => {
    const saved = localStorage.getItem('hrConnectAccounts');
    return saved ? JSON.parse(saved) : [];
  };

  const saveAccount = (newAccount: UserAccount) => {
    const accounts = getAccounts();
    accounts.push(newAccount);
    localStorage.setItem('hrConnectAccounts', JSON.stringify(accounts));
  };

  // Check if email already exists
  const isEmailTaken = (emailToCheck: string): boolean => {
    const accounts = getAccounts();
    return accounts.some(acc => acc.email.toLowerCase() === emailToCheck.toLowerCase());
  };

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const accounts = getAccounts();
    const user = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password);

    if (user) {
      setMessage({ type: 'success', text: `Welcome back, ${user.fullName.split(' ')[0]}!` });
      localStorage.setItem('currentUser', JSON.stringify(user));

      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } else {
      setMessage({ type: 'error', text: 'Invalid email or password.' });
    }

    setIsLoading(false);
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (!agreeTerms) {
      setMessage({ type: 'error', text: "Please agree to the Terms of Service and Privacy Policy." });
      setIsLoading(false);
      return;
    }

    // Check for duplicate email
    if (isEmailTaken(email)) {
      setMessage({ type: 'error', text: "An account with this email already exists. Please use a different email or login." });
      setIsLoading(false);
      return;
    }

    const newAccount: UserAccount = {
      fullName,
      email,
      employeeId,
      password
    };

    saveAccount(newAccount);
    
    setMessage({ type: 'success', text: 'Account created successfully! Redirecting to login...' });

    setTimeout(() => {
      setView('login');
      // Clear registration fields
      setFullName('');
      setEmployeeId('');
      setAgreeTerms(false);
      setMessage(null);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-900">
      {/* Left Brand Side - unchanged */}
      <div className="relative hidden w-7/12 flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity" 
          style={{ 
            backgroundImage: view === 'login' 
              ? "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200')"
              : "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200')"
          }} 
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-9 w-9 bg-white rounded-xl flex items-center justify-center">
            <span className="text-slate-950 font-bold text-2xl">HR</span>
          </div>
          <span className="text-2xl font-bold tracking-wider">CONNECT</span>
        </div>

        <div className="relative z-10 max-w-xl">
          {view === 'login' ? (
            <>
              <h1 className="text-5xl font-semibold tracking-tighter">Welcome Back</h1>
              <p className="text-xl text-slate-300 mt-4">Sign in to access your HR dashboard</p>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-semibold tracking-tighter">Join the Team</h1>
              <p className="text-xl text-slate-300 mt-4">Create your account and get started</p>
            </>
          )}
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex w-full flex-col justify-center bg-white px-6 py-12 sm:px-16 md:px-24 lg:w-5/12">
        <div className="mx-auto w-full max-w-md space-y-8">
          {message && (
            <div className={`p-4 rounded-2xl text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              {message.text}
            </div>
          )}

          {view === 'login' ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">Sign In</h2>
                <p className="text-slate-600 mt-2">Access your HR dashboard</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                      className="w-full pl-12 py-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 transition" placeholder="you@company.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                      className="w-full pl-12 py-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 transition" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-slate-400">
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                    Remember me
                  </label>
                  <button type="button" className="text-blue-600 hover:underline text-sm">Forgot password?</button>
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-700 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all">
                  {isLoading ? "Signing in..." : "SIGN IN TO PORTAL"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <p className="text-center text-sm text-slate-600">
                Do not have an account?{' '}
                <button onClick={() => setView('register')} className="text-blue-600 font-semibold hover:underline">
                  Sign up here
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">Create Account</h2>
                <p className="text-slate-600 mt-2">Join HR Connect today</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600" placeholder="John Doe" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Work Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600" placeholder="john@company.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Employee ID</label>
                  <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600" placeholder="EMP-12345" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Create Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600" placeholder="Create password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-400">
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <input type="checkbox" id="terms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-1" />
                  <label htmlFor="terms" className="text-sm text-slate-600 leading-snug">
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-2xl font-semibold transition">
                  {isLoading ? "Creating Account..." : "CREATE ACCOUNT"}
                </button>
              </form>

              <p className="text-center text-sm text-slate-600">
                Already have an account?{' '}
                <button onClick={() => setView('login')} className="text-blue-600 font-semibold hover:underline">Sign in</button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}