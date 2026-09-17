'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface QuickActionProps {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function QuickAction({ id, label, icon: Icon, onClick }: QuickActionProps) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-700 hover:text-indigo-700 text-xs font-medium transition-all shadow-2xs group whitespace-nowrap"
    >
      <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
      <span>{label}</span>
    </button>
  );
}
