'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Bot, CheckCircle2, Clock } from 'lucide-react';

export function ProgressCard() {
  const { aiWorkingTasks } = useApp();

  const activeCount = aiWorkingTasks.filter((t) => t.status === 'Active').length;

  return (
    <div id="ai-current-tasks-card" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 tracking-tight">Current Tasks</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Virtual HR is currently working on {activeCount} tasks.
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <Bot className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-3.5">
        {aiWorkingTasks.map((task) => {
          const isDone = task.progress >= 100;

          return (
            <div
              key={task.id}
              id={`ai-task-${task.id}`}
              className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                  {task.title}
                </span>
                <span className="font-mono text-slate-600 font-medium">{task.progress}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isDone ? 'bg-emerald-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate max-w-[180px]">{task.description}</span>
                <span className="shrink-0 font-medium text-slate-400">{task.eta}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
