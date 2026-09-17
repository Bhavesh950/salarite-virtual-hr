'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ActivityItem } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Calendar, CheckSquare, Users, Bot, Filter } from 'lucide-react';

export function ActivityTimeline() {
  const { activities } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'interview' | 'task' | 'candidate' | 'ai'>('all');

  const filtered = activities.filter((act) => {
    if (filterType === 'all') return true;
    return act.type === filterType;
  });

  const getActionIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'interview':
        return <Calendar className="w-4 h-4 text-indigo-600" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-emerald-600" />;
      case 'candidate':
        return <Users className="w-4 h-4 text-sky-600" />;
      case 'ai':
      default:
        return <Bot className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl w-fit">
        {(['all', 'interview', 'task', 'candidate', 'ai'] as const).map((type) => {
          const isSelected = filterType === type;
          const label = {
            all: 'All Activities',
            interview: 'Interviews',
            task: 'Tasks',
            candidate: 'Candidates',
            ai: 'Virtual HR Actions',
          }[type];

          return (
            <button
              key={type}
              id={`activity-filter-${type}`}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Timeline Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="relative border-l border-slate-200 ml-3.5 space-y-6">
          {filtered.map((item, index) => (
            <div key={item.id} id={`activity-item-${item.id}`} className="relative pl-6 group">
              {/* Dot Icon */}
              <div className="absolute -left-3.5 top-0.5 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                {getActionIcon(item.type)}
              </div>

              {/* Card */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-xs transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">{item.action}</span>
                    {item.status && (
                      <span className="text-[10px] font-medium px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60">
                        {item.status}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{item.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
