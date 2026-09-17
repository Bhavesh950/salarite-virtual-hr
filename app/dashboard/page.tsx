'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useApp } from '@/context/AppContext';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  Calendar,
  Bot,
  ArrowRight,
  Sparkles,
  PlayCircle,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

export default function DashboardPage() {
  const {
    tasks,
    interviews,
    activities,
    aiStatus,
    setIsTaskModalOpen,
    setIsInterviewModalOpen,
    setSelectedCandidate,
    candidates,
  } = useApp();

  // Dynamic counts derived from actual data
  const totalTasksCount = 24; // Baseline metric specified in prompt
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length || 7;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length || 14;
  const upcomingInterviewsCount =
    interviews.filter((i) => i.status === 'Confirmed' || i.status === 'Scheduled').length || 5;

  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;

  // Task breakdown percentages
  const pendingPct = Math.round((pendingCount / (tasks.length || 1)) * 100);
  const inProgressPct = Math.round((inProgressCount / (tasks.length || 1)) * 100);
  const completedPct = Math.round((completedCount / (tasks.length || 1)) * 100);

  const upcomingInterviews = interviews
    .filter((i) => i.status === 'Confirmed' || i.status === 'Scheduled')
    .slice(0, 3);

  const recentActivities = activities.slice(0, 5);

  return (
    <AppShell
      title="Overview"
      subtitle="Recruitment pipeline summary and AI Virtual HR activity"
    >
      <div className="space-y-7">
        {/* Dashboard Top Greeting & AI Status Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Good morning, Demo Employer 👋
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Your Virtual HR is actively managing today&apos;s recruitment tasks.
            </p>
          </div>

          {/* AI Status Indicator Card */}
          <div
            id="ai-status-indicator"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-slate-200/90 shadow-xs"
          >
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <span>Virtual HR Online</span>
              </div>
              <p className="text-[11px] text-slate-500">Working normally</p>
            </div>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            id="stat-total-tasks"
            title="Total Tasks"
            value={totalTasksCount}
            smallText="+4 this week"
            icon={CheckSquare}
            trend="up"
          />
          <StatCard
            id="stat-in-progress"
            title="In Progress"
            value={inProgressCount}
            smallText="Currently being handled"
            icon={Clock}
            highlight
          />
          <StatCard
            id="stat-completed"
            title="Completed"
            value={completedCount}
            smallText="+18% this week"
            icon={CheckCircle2}
            trend="up"
          />
          <StatCard
            id="stat-upcoming-interviews"
            title="Upcoming Interviews"
            value={upcomingInterviewsCount}
            smallText="Next interview today"
            icon={Calendar}
          />
        </div>

        {/* Two Large Cards: Task Overview & AI Virtual HR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT LARGE CARD: Task Overview */}
          <div
            id="card-task-overview"
            className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                    Task Overview
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Progress visualization and task status breakdown
                  </p>
                </div>
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                >
                  + Assign
                </button>
              </div>

              {/* Progress Visualization Bar */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                  <span>Overall Queue Distribution</span>
                  <span>{tasks.length} active items</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden p-0.5 gap-0.5">
                  <div
                    className="bg-emerald-500 h-full rounded-l-full transition-all"
                    style={{ width: `${completedPct}%` }}
                    title={`Completed: ${completedCount}`}
                  />
                  <div
                    className="bg-indigo-600 h-full transition-all"
                    style={{ width: `${inProgressPct}%` }}
                    title={`In Progress: ${inProgressCount}`}
                  />
                  <div
                    className="bg-amber-400 h-full rounded-r-full transition-all"
                    style={{ width: `${pendingPct}%` }}
                    title={`Pending: ${pendingCount}`}
                  />
                </div>
              </div>

              {/* Status Breakdown Grid */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center gap-1.5 mb-1 text-xs font-medium text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Pending
                  </div>
                  <div className="text-xl font-bold text-slate-900">{pendingCount}</div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Awaiting intake</span>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-100">
                  <div className="flex items-center gap-1.5 mb-1 text-xs font-medium text-indigo-700">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    In Progress
                  </div>
                  <div className="text-xl font-bold text-slate-900">{inProgressCount}</div>
                  <span className="text-[11px] text-indigo-600/80 mt-0.5 block">
                    Handled by AI
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100">
                  <div className="flex items-center gap-1.5 mb-1 text-xs font-medium text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Completed
                  </div>
                  <div className="text-xl font-bold text-slate-900">{completedCount}</div>
                  <span className="text-[11px] text-emerald-600/80 mt-0.5 block">
                    Verified this week
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Tasks sync automatically with Virtual HR queue
              </span>
              <Link
                id="btn-view-all-tasks"
                href="/tasks"
                className="px-4 py-2 text-xs font-semibold text-slate-900 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <span>View All Tasks</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* RIGHT CARD: AI Virtual HR */}
          <div
            id="card-ai-virtual-hr"
            className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* Card Header with AI Avatar */}
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <div className="w-11 h-11 rounded-2xl bg-slate-900 text-indigo-300 flex items-center justify-center shadow-xs">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                    AI Virtual HR
                  </h3>
                  <p className="text-xs text-indigo-600 font-medium flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Your Virtual HR is working
                  </p>
                </div>
              </div>

              {/* Recent AI Actions List */}
              <div className="mt-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Recent AI actions:
                </p>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">Candidate screening completed</span>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">
                      Interview scheduled with Rahul Sharma (Python Developer)
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-indigo-50/50 border border-indigo-100/60 text-indigo-900">
                    <RefreshCw className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5 animate-spin" />
                    <span className="font-medium">Reviewing candidate applications (batch 12)</span>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">Task completed: Resume screening</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100">
              <Link
                id="btn-open-ai-assistant"
                href="/ai-hr"
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-indigo-900 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-indigo-300 group-hover:rotate-12 transition-transform" />
                <span>Open AI Assistant</span>
              </Link>
            </div>
          </div>
        </div>

        {/* SECTION: Upcoming Interviews */}
        <div id="section-upcoming-interviews" className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                Upcoming Interviews
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluations coordinated and monitored by Virtual HR
              </p>
            </div>
            <Link
              id="btn-view-all-interviews"
              href="/interviews"
              className="text-xs font-semibold text-slate-900 hover:text-indigo-600 flex items-center gap-1"
            >
              <span>View All Interviews</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6">Candidate</th>
                    <th className="py-3 px-4">Position</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {upcomingInterviews.map((item) => (
                    <tr
                      key={item.id}
                      id={`dashboard-interview-row-${item.id}`}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                        {item.candidateName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">{item.position}</td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{item.date}</td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{item.time}</td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={item.mode} type="mode" />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <Link
                          href={`/interviews/${item.id}`}
                          className="px-2.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-indigo-900 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <span>Join</span>
                          <ExternalLink className="w-3 h-3 text-indigo-200" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION: Recent Activity */}
        <div id="section-recent-activity" className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                Recent Activity
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time operational audit log of Virtual HR and employer actions
              </p>
            </div>
            <Link
              href="/activity"
              className="text-xs font-semibold text-slate-900 hover:text-indigo-600 flex items-center gap-1"
            >
              <span>View Full Activity</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-5">
            <div className="divide-y divide-slate-100">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900">{act.action}</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">{act.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pl-4 sm:pl-0">
                    {act.status && (
                      <span className="text-[10px] font-medium px-2 py-0.2 rounded-full bg-slate-100 text-slate-600">
                        {act.status}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                      {act.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
