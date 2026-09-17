'use client';

import React from 'react';
import { Mic, Video, MessageSquare } from 'lucide-react';
import { InterviewMode } from '@/types';

interface InterviewModeSelectorProps {
  value: InterviewMode;
  onChange: (mode: InterviewMode) => void;
  idPrefix?: string;
}

export function InterviewModeSelector({ value, onChange, idPrefix = 'mode' }: InterviewModeSelectorProps) {
  const modes: {
    mode: InterviewMode;
    label: string;
    description: string;
    icon: typeof Mic;
    color: string;
  }[] = [
    {
      mode: 'Voice',
      label: 'VOICE',
      description: 'Voice interview',
      icon: Mic,
      color: 'amber',
    },
    {
      mode: 'Video',
      label: 'VIDEO',
      description: 'Video interview',
      icon: Video,
      color: 'indigo',
    },
    {
      mode: 'Chat',
      label: 'CHAT',
      description: 'Chat interview',
      icon: MessageSquare,
      color: 'emerald',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {modes.map((item) => {
        const isSelected = value === item.mode;
        const Icon = item.icon;

        return (
          <button
            key={item.mode}
            type="button"
            id={`${idPrefix}-select-${item.mode.toLowerCase()}`}
            onClick={() => onChange(item.mode)}
            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col items-center sm:items-start text-center sm:text-left ${
              isSelected
                ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
            </div>

            <span className="text-xs font-bold tracking-wider text-slate-900 block uppercase">
              {item.label}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block whitespace-nowrap">
              {item.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
