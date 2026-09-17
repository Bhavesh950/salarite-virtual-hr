'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { InterviewTable } from '@/components/interviews/InterviewTable';
import { useApp } from '@/context/AppContext';
import { CalendarPlus } from 'lucide-react';

export default function InterviewsPage() {
  const { setIsInterviewModalOpen } = useApp();

  return (
    <AppShell
      title="Interviews"
      subtitle="Schedule and manage candidate interviews."
    >
      <div className="space-y-6">
        {/* Page Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Interviews
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Schedule and manage candidate interviews across Voice, Video, and Chat.
            </p>
          </div>

          <button
            id="btn-top-schedule-interview"
            onClick={() => setIsInterviewModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-indigo-900 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CalendarPlus className="w-4 h-4 text-indigo-300" />
            <span>+ Schedule Interview</span>
          </button>
        </div>

        {/* Interviews Table */}
        <InterviewTable />
      </div>
    </AppShell>
  );
}
