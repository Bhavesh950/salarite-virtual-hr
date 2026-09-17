'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TaskModal } from '@/components/tasks/TaskModal';
import { InterviewModal } from '@/components/interviews/InterviewModal';
import { CandidateDetailsModal } from '@/components/candidates/CandidateDetailsModal';
import { AddCandidateModal } from '@/components/candidates/AddCandidateModal';
import { NotificationToast } from '@/components/common/NotificationToast';

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav-backdrop"
          className="md:hidden fixed inset-0 z-50 flex bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-72 max-w-[80vw] h-full bg-white shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Header
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Modals & Toasts */}
      <TaskModal />
      <InterviewModal />
      <CandidateDetailsModal />
      <AddCandidateModal />
      <NotificationToast />
    </div>
  );
}
