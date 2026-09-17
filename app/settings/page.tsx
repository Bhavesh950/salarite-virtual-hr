'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useApp } from '@/context/AppContext';
import { User, Building, Bell, Bot, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { user, addToast } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [company, setCompany] = useState('Salarite Labs');
  const [interviewReminder, setInterviewReminder] = useState(true);
  const [aiScreeningAutoAccept, setAiScreeningAutoAccept] = useState(true);
  const [aiTone, setAiTone] = useState('Professional & Crisp');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Workspace and AI preferences have been updated.',
    });
  };

  return (
    <AppShell
      title="Settings"
      subtitle="Manage your profile, workspace rules, and Virtual HR preferences."
    >
      <div className="max-w-3xl space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Settings
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure employer preferences and automated Virtual HR workflows.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section: Profile */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <User className="w-4.5 h-4.5 text-indigo-600" />
              <h3 className="text-sm font-semibold text-slate-900">Employer Profile</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section: Workspace */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building className="w-4.5 h-4.5 text-indigo-600" />
              <h3 className="text-sm font-semibold text-slate-900">Workspace & Organization</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Default Timezone
                </label>
                <select
                  defaultValue="Asia/Kolkata (IST)"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
                >
                  <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Notifications */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Bell className="w-4.5 h-4.5 text-indigo-600" />
              <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={interviewReminder}
                  onChange={(e) => setInterviewReminder(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-700">
                  Notify me 15 minutes before any candidate interview starts
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-700">
                  Email me weekly recruitment pipeline digest
                </span>
              </label>
            </div>
          </div>

          {/* Section: AI Assistant Preferences */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Bot className="w-4.5 h-4.5 text-indigo-600" />
              <h3 className="text-sm font-semibold text-slate-900">AI Assistant Preferences</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Virtual HR Conversational Tone
                </label>
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
                >
                  <option value="Professional & Crisp">Professional & Crisp</option>
                  <option value="Empathetic & Warm">Empathetic & Warm</option>
                  <option value="Direct & Minimalist">Direct & Minimalist</option>
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aiScreeningAutoAccept}
                  onChange={(e) => setAiScreeningAutoAccept(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-700">
                  Allow Virtual HR to automatically advance candidates with {'>'}90% match score to interview scheduling
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              id="save-settings-btn"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-indigo-900 rounded-xl transition-colors shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-indigo-300" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
