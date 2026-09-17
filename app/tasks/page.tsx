'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TaskTable } from '@/components/tasks/TaskTable';
import { useApp } from '@/context/AppContext';
import { Plus, Bot } from 'lucide-react';

export default function TasksPage() {
  const { setIsTaskModalOpen, tasks } = useApp();

  return (
    <AppShell
      title="Tasks"
      subtitle="Assign and monitor tasks handled by your Virtual HR."
    >
      <div className="space-y-6">
        {/* Page Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Tasks
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Assign and monitor tasks handled by your Virtual HR.
            </p>
          </div>

          <button
            id="btn-top-assign-task"
            onClick={() => setIsTaskModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-indigo-900 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-indigo-300" />
            <span>+ Assign Task</span>
          </button>
        </div>

        {/* Task Table */}
        <TaskTable />
      </div>
    </AppShell>
  );
}
