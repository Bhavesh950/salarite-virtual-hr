'use client';

import React, { useState } from 'react';
import { Search, Bell, Menu, Sparkles, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
}

export function Header({ title, subtitle, onOpenMobileMenu }: HeaderProps) {
  const { user, aiStatus, activities, addToast } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header
      id="main-app-header"
      className="h-16 px-6 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-20"
    >
      {/* Left Title & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-toggle"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 id="header-page-title" className="text-lg font-semibold text-slate-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 hidden sm:block tracking-normal">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Virtual HR Live Pill */}
        <div
          id="header-ai-status-pill"
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
        >
          <span className="flex h-2 w-2 relative">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                aiStatus === 'processing' ? 'bg-indigo-400' : 'bg-emerald-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                aiStatus === 'processing' ? 'bg-indigo-600' : 'bg-emerald-500'
              }`}
            />
          </span>
          <span>Virtual HR {aiStatus === 'processing' ? 'Processing' : 'Online'}</span>
        </div>

        {/* Search input */}
        <div className="relative hidden sm:block w-48 md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="header-search-input"
            type="text"
            placeholder="Search candidates, tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="header-notifications-button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
          </button>

          {showNotifications && (
            <div
              id="notifications-dropdown-menu"
              className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">Recent Notifications</span>
                <span className="text-[11px] text-slate-400">Live feed</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {activities.slice(0, 4).map((act) => (
                  <div key={act.id} className="p-3 text-xs hover:bg-slate-50 transition-colors">
                    <p className="font-medium text-slate-800">{act.action}</p>
                    <p className="text-slate-500 mt-0.5 truncate">{act.description}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{act.timestamp}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    addToast({
                      type: 'info',
                      title: 'Notifications Cleared',
                      message: 'All notifications marked as read.',
                    });
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div
          id="header-user-avatar-badge"
          className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-semibold flex items-center justify-center border border-slate-800 shadow-xs cursor-pointer select-none"
          title={`${user.name} (${user.role})`}
        >
          {user.avatar}
        </div>
      </div>
    </header>
  );
}
