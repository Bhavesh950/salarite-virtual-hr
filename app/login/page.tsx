'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, ArrowRight, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useApp();
  const [email, setEmail] = useState('demo@salarite.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      addToast({
        type: 'success',
        title: 'Welcome Back!',
        message: 'Signed in successfully as Demo Employer.',
      });
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white shadow-md mb-4">
          <Bot className="w-6 h-6 text-indigo-300" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Salarite Virtual HR
        </h2>
        <p className="mt-1 text-xs font-medium text-indigo-600 tracking-wide">
          AI-POWERED RECRUITMENT & OPERATIONS
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          <form className="space-y-4.5" onSubmit={handleSignIn}>
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
                  placeholder="demo@salarite.com"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Password
                </label>
                <span className="text-xs text-slate-400">Default: demo123</span>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="login-submit-button"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-indigo-900 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all shadow-xs"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                {!loading && <ArrowRight className="w-4 h-4 text-indigo-300" />}
              </button>
            </div>
          </form>

          {/* Demo credentials box */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600">
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Demo Credentials
              </p>
              <div className="mt-2 space-y-1 font-mono text-[11px] text-slate-600">
                <p>
                  <span className="text-slate-400">Email:</span> demo@salarite.com
                </p>
                <p>
                  <span className="text-slate-400">Password:</span> demo123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
