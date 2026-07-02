"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  BadgeCheck,
} from "lucide-react";

interface UserAccount {
  fullName: string;
  email: string;
  employeeId: string;
  password: string;
}

export default function AuthPage() {
  const router = useRouter();

  const [view, setView] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);
  const [fullName, setFullName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const inputWrapperClass =
    "relative flex items-center rounded-md border border-slate-200 bg-white transition focus-within:border-blue-600";

  const inputClass =
    "w-full rounded-md bg-transparent py-2 pl-11 pr-3 text-sm outline-none placeholder:text-slate-400";

  const passwordInputClass =
    "w-full rounded-md bg-transparent py-2 pl-11 pr-11 text-sm outline-none placeholder:text-slate-400";

  const iconClass =
    "pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400";

  const eyeButtonClass =
    "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600";

  const getAccounts = (): UserAccount[] => {
    const saved = localStorage.getItem("hrConnectAccounts");
    return saved ? JSON.parse(saved) : [];
  };

  const saveAccount = (newAccount: UserAccount) => {
    const accounts = getAccounts();
    accounts.push(newAccount);
    localStorage.setItem("hrConnectAccounts", JSON.stringify(accounts));
  };

  const isEmailTaken = (emailToCheck: string): boolean => {
    const accounts = getAccounts();
    return accounts.some(
      (acc) => acc.email.toLowerCase() === emailToCheck.toLowerCase(),
    );
  };

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const accounts = getAccounts();
    const user = accounts.find(
      (acc) =>
        acc.email.toLowerCase() === email.toLowerCase() &&
        acc.password === password,
    );

    if (user) {
      setMessage({
        type: "success",
        text: `Welcome back, ${user.fullName.split(" ")[0]}!`,
      });

      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem(
        "hrConnectSession",
        JSON.stringify({
          authenticated: true,
          loginTime: Date.now(),
          email: user.email,
        }),
      );

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      setMessage({ type: "error", text: "Invalid email or password." });
    }

    setIsLoading(false);
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (!agreeTerms) {
      setMessage({
        type: "error",
        text: "Please agree to the Terms of Service and Privacy Policy.",
      });
      setIsLoading(false);
      return;
    }

    if (isEmailTaken(email)) {
      setMessage({
        type: "error",
        text: "An account with this email already exists. Please use a different email or login.",
      });
      setIsLoading(false);
      return;
    }

    const newAccount: UserAccount = {
      fullName,
      email,
      employeeId,
      password,
    };

    saveAccount(newAccount);

    setMessage({
      type: "success",
      text: "Account created successfully! Redirecting to login...",
    });

    setTimeout(() => {
      setView("login");
      setFullName("");
      setEmployeeId("");
      setAgreeTerms(false);
      setMessage(null);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-900">
      <div className="relative hidden w-7/12 flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
          style={{
            backgroundImage:
              view === "login"
                ? "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200')"
                : "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200')",
          }}
        />

        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
            <span className="text-2xl font-bold text-slate-950">HR</span>
          </div>
          <span className="text-2xl font-bold tracking-wider">CONNECT</span>
        </div>

        <div className="relative z-10 max-w-xl">
          {view === "login" ? (
            <>
              <h1 className="text-5xl font-semibold tracking-tighter">
                Welcome Back
              </h1>
              <p className="mt-4 text-xl text-slate-300">
                Sign in to access your HR dashboard
              </p>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-semibold tracking-tighter">
                Join the Team
              </h1>
              <p className="mt-4 text-xl text-slate-300">
                Create your account and get started
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col justify-center bg-white px-6 py-12 sm:px-16 md:px-24 lg:w-5/12">
        <div className="mx-auto w-full max-w-md space-y-8">
          {message && (
            <div
              className={`rounded-2xl p-4 text-sm ${
                message.type === "success"
                  ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                  : "border border-red-100 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {view === "login" ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">
                  Sign In
                </h2>
                <p className="mt-2 text-slate-600">Access your HR dashboard</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email Address
                  </label>
                  <div className={inputWrapperClass}>
                    <Mail className={iconClass} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={inputClass}
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Password
                  </label>
                  <div className={inputWrapperClass}>
                    <Lock className={iconClass} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={passwordInputClass}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={eyeButtonClass}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 py-2 cursor-pointer font-semibold text-white transition-all hover:bg-black disabled:bg-slate-700"
                >
                  {isLoading ? "Signing in..." : "SIGN IN TO PORTAL"}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>

              <p className="text-center text-sm text-slate-600">
                Do not have an account?{" "}
                <button
                  onClick={() => setView("register")}
                  className="font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Sign up here
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">
                  Create Account
                </h2>
                <p className="mt-2 text-slate-600">Join HR Connect today</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Full Name
                  </label>
                  <div className={inputWrapperClass}>
                    <User className={iconClass} />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className={inputClass}
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Work Email
                  </label>
                  <div className={inputWrapperClass}>
                    <Mail className={iconClass} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={inputClass}
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Employee ID
                  </label>
                  <div className={inputWrapperClass}>
                    <BadgeCheck className={iconClass} />
                    <input
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      required
                      className={inputClass}
                      placeholder="EMP-12345"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Create Password
                  </label>
                  <div className={inputWrapperClass}>
                    <Lock className={iconClass} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={passwordInputClass}
                      placeholder="Create password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={eyeButtonClass}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm leading-snug text-slate-600"
                  >
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-md bg-slate-900 cursor-pointer py-2 font-semibold text-white transition hover:bg-slate-900 disabled:bg-slate-400"
                >
                  {isLoading ? "Creating Account..." : "CREATE ACCOUNT"}
                </button>
              </form>

              <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <button
                  onClick={() => setView("login")}
                  className="font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}