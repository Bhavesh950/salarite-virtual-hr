'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Calendar,
  Bot,
  Activity,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { user, tasks, isSimulationRunning, setIsSimulationRunning } = useApp();

  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;

  const mainNavItems = [
    {
      label: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Tasks',
      href: '/tasks',
      icon: CheckSquare,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      label: 'Candidates',
      href: '/candidates',
      icon: Users,
    },
    {
      label: 'Interviews',
      href: '/interviews',
      icon: Calendar,
    },
    {
      label: 'AI Virtual HR',
      href: '/ai-hr',
      icon: Bot,
      highlight: true,
    },
  ];

  const workspaceNavItems = [
    {
      label: 'Activity',
      href: '/activity',
      icon: Activity,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard' && (pathname === '/' || pathname === '/dashboard')) return true;
    return pathname.startsWith(href) && href !== '/';
  };

  return (
    <aside
      id="main-sidebar"
      className="w-64 h-screen bg-white border-r border-slate-200/80 flex flex-col shrink-0 select-none z-30"
    >
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
        <Link
          href="/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 group"
          id="sidebar-brand-link"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:bg-indigo-900 transition-colors">
            <Bot className="w-4.5 h-4.5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900 text-base tracking-tight leading-none">
                Salarite
              </span>
            </div>
            <span className="text-[11px] font-medium text-indigo-600 tracking-wide block mt-0.5">
              AI Virtual HR
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                id={`sidebar-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                  active
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active
                        ? 'text-indigo-300'
                        : item.highlight
                        ? 'text-indigo-600 group-hover:text-indigo-700'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${
                      active ? 'bg-slate-800 text-indigo-200' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.highlight && !active && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Workspace Section */}
        <div>
          <div className="px-3 mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              WORKSPACE
            </span>
          </div>
          <div className="space-y-1">
            {workspaceNavItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  id={`sidebar-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        active ? 'text-indigo-300' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Real-time simulation status toggle */}
        <div className="px-3 pt-2">
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Live HR Agent
              </span>
              <button
                type="button"
                id="toggle-simulation-btn"
                onClick={() => setIsSimulationRunning((prev) => !prev)}
                className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isSimulationRunning ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
                title={isSimulationRunning ? 'Pause live simulation' : 'Resume live simulation'}
              >
                <span
                  className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isSimulationRunning ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              {isSimulationRunning
                ? 'Simulating background resume screening & status updates.'
                : 'Background simulation is paused.'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom User Profile */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white text-xs font-medium flex items-center justify-center border border-slate-800 shadow-xs shrink-0">
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate tracking-tight">
              {user.name}
            </p>
            <p className="text-xs text-slate-500 truncate">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
