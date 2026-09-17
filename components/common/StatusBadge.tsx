import React from 'react';
import { TaskStatus, CandidateStatus, InterviewStatus, InterviewMode, TaskPriority } from '@/types';
import { Mic, Video, MessageSquare, Clock, CheckCircle2, PlayCircle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: TaskStatus | CandidateStatus | InterviewStatus | TaskPriority | InterviewMode | string;
  type?: 'task' | 'candidate' | 'interview' | 'priority' | 'mode';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, type = 'task', size = 'sm' }: StatusBadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm font-medium';

  // Mode Badges with icons
  if (type === 'mode' || status === 'Voice' || status === 'Video' || status === 'Chat') {
    switch (status) {
      case 'Voice':
        return (
          <span
            id={`badge-mode-${status.toLowerCase()}`}
            className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-amber-50 text-amber-800 border border-amber-200/60 ${sizeClasses}`}
          >
            <Mic className="w-3.5 h-3.5 text-amber-600" />
            <span>Voice</span>
          </span>
        );
      case 'Video':
        return (
          <span
            id={`badge-mode-${status.toLowerCase()}`}
            className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60 ${sizeClasses}`}
          >
            <Video className="w-3.5 h-3.5 text-indigo-600" />
            <span>Video</span>
          </span>
        );
      case 'Chat':
        return (
          <span
            id={`badge-mode-${status.toLowerCase()}`}
            className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60 ${sizeClasses}`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chat</span>
          </span>
        );
    }
  }

  // Priority Badges
  if (type === 'priority') {
    switch (status) {
      case 'High':
        return (
          <span
            id={`badge-priority-${status.toLowerCase()}`}
            className={`inline-flex items-center gap-1 rounded-md font-medium bg-rose-50 text-rose-700 border border-rose-200/60 ${sizeClasses}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            High
          </span>
        );
      case 'Medium':
        return (
          <span
            id={`badge-priority-${status.toLowerCase()}`}
            className={`inline-flex items-center gap-1 rounded-md font-medium bg-amber-50 text-amber-700 border border-amber-200/60 ${sizeClasses}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span
            id={`badge-priority-${status.toLowerCase()}`}
            className={`inline-flex items-center gap-1 rounded-md font-medium bg-slate-100 text-slate-700 border border-slate-200/60 ${sizeClasses}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Low
          </span>
        );
    }
  }

  // Task Statuses
  if (type === 'task') {
    switch (status) {
      case 'Pending':
        return (
          <span
            id={`badge-task-${status.toLowerCase().replace(' ', '-')}`}
            className={`inline-flex items-center gap-1.5 rounded-md font-medium bg-amber-50 text-amber-800 border border-amber-200/80 ${sizeClasses}`}
          >
            <Clock className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
      case 'In Progress':
        return (
          <span
            id={`badge-task-${status.toLowerCase().replace(' ', '-')}`}
            className={`inline-flex items-center gap-1.5 rounded-md font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/80 ${sizeClasses}`}
          >
            <PlayCircle className="w-3 h-3 text-indigo-600 animate-pulse" />
            In Progress
          </span>
        );
      case 'Completed':
        return (
          <span
            id={`badge-task-${status.toLowerCase().replace(' ', '-')}`}
            className={`inline-flex items-center gap-1.5 rounded-md font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${sizeClasses}`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
    }
  }

  // Candidate Statuses
  if (type === 'candidate') {
    switch (status) {
      case 'New':
        return (
          <span
            id={`badge-cand-${status.toLowerCase()}`}
            className={`inline-flex items-center rounded-md font-medium bg-sky-50 text-sky-700 border border-sky-200/70 ${sizeClasses}`}
          >
            New
          </span>
        );
      case 'Screening':
        return (
          <span
            id={`badge-cand-${status.toLowerCase()}`}
            className={`inline-flex items-center rounded-md font-medium bg-amber-50 text-amber-800 border border-amber-200/70 ${sizeClasses}`}
          >
            Screening
          </span>
        );
      case 'Interview':
        return (
          <span
            id={`badge-cand-${status.toLowerCase()}`}
            className={`inline-flex items-center rounded-md font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/70 ${sizeClasses}`}
          >
            Interview
          </span>
        );
      case 'Selected':
        return (
          <span
            id={`badge-cand-${status.toLowerCase()}`}
            className={`inline-flex items-center rounded-md font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/70 ${sizeClasses}`}
          >
            Selected
          </span>
        );
      case 'Rejected':
        return (
          <span
            id={`badge-cand-${status.toLowerCase()}`}
            className={`inline-flex items-center rounded-md font-medium bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}
          >
            Rejected
          </span>
        );
    }
  }

  // Interview Statuses
  switch (status) {
    case 'Confirmed':
      return (
        <span
          id={`badge-int-${status.toLowerCase()}`}
          className={`inline-flex items-center gap-1 rounded-md font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Confirmed
        </span>
      );
    case 'Scheduled':
      return (
        <span
          id={`badge-int-${status.toLowerCase()}`}
          className={`inline-flex items-center gap-1 rounded-md font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/80 ${sizeClasses}`}
        >
          <Clock className="w-3 h-3 text-indigo-600" />
          Scheduled
        </span>
      );
    case 'Completed':
      return (
        <span
          id={`badge-int-${status.toLowerCase()}`}
          className={`inline-flex items-center rounded-md font-medium bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}
        >
          Completed
        </span>
      );
    default:
      return (
        <span
          id={`badge-default-${status}`}
          className={`inline-flex items-center rounded-md font-medium bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}
        >
          {status}
        </span>
      );
  }
}
