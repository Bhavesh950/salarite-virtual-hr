import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id: string;
  title: string;
  value: string | number;
  smallText: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  highlight?: boolean;
}

export function StatCard({ id, title, value, smallText, icon: Icon, trend, highlight }: StatCardProps) {
  return (
    <div
      id={id}
      className={`bg-white rounded-xl p-5 border transition-all duration-200 hover:shadow-sm ${
        highlight ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-slate-200/80'
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 tracking-tight">{title}</p>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight text-slate-900">{value}</span>
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <span
          className={`text-xs ${
            trend === 'up'
              ? 'text-emerald-600 font-medium'
              : trend === 'down'
              ? 'text-rose-600 font-medium'
              : 'text-slate-500'
          }`}
        >
          {smallText}
        </span>
      </div>
    </div>
  );
}
