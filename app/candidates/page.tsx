'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { CandidateTable } from '@/components/candidates/CandidateTable';
import { useApp } from '@/context/AppContext';
import { UserPlus } from 'lucide-react';

export default function CandidatesPage() {
  const { setIsAddCandidateModalOpen } = useApp();

  return (
    <AppShell
      title="Candidates"
      subtitle="Manage your recruitment pipeline."
    >
      <div className="space-y-6">
        {/* Page Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Candidates
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage your recruitment pipeline and candidate profiles.
            </p>
          </div>

          <button
            id="btn-top-add-candidate"
            onClick={() => setIsAddCandidateModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-indigo-900 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4 text-indigo-300" />
            <span>+ Add Candidate</span>
          </button>
        </div>

        {/* Candidate Table */}
        <CandidateTable />
      </div>
    </AppShell>
  );
}
