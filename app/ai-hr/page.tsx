'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { AIChat } from '@/components/ai/AIChat';
import { Bot, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AIHRPage() {
  const { aiStatus } = useApp();

  return (
    <AppShell
      title="AI Virtual HR"
      subtitle="Your intelligent HR assistant"
    >
      <div className="space-y-6">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                AI Virtual HR
              </h2>
              <span
                id="ai-status-badge-header"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ● Online
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Your intelligent HR assistant for candidate evaluation, task execution, and interview coordination.
            </p>
          </div>
        </div>

        {/* Main AI Chat & Side Panel */}
        <AIChat />
      </div>
    </AppShell>
  );
}
