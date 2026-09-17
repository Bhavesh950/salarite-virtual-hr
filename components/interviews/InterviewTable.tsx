'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Interview, InterviewStatus } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Video, Mic, MessageSquare, ExternalLink, Calendar, Clock, CheckCircle2 } from 'lucide-react';

export function InterviewTable() {
  const { interviews, updateInterviewStatus, setSelectedCandidate, candidates } = useApp();

  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'All'>('Upcoming');

  const tabs: ('Upcoming' | 'Completed' | 'All')[] = ['Upcoming', 'Completed', 'All'];

  const filteredInterviews = interviews.filter((item) => {
    if (activeTab === 'Upcoming') {
      return item.status === 'Confirmed' || item.status === 'Scheduled' || item.status === 'In Progress';
    }
    if (activeTab === 'Completed') {
      return item.status === 'Completed';
    }
    return true;
  });

  const handleCandidateClick = (candidateName: string) => {
    const matched = candidates.find(
      (c) => c.name.toLowerCase() === candidateName.toLowerCase()
    );
    if (matched) {
      setSelectedCandidate(matched);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl w-fit">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab;
          const count =
            tab === 'All'
              ? interviews.length
              : tab === 'Upcoming'
              ? interviews.filter(
                  (i) => i.status === 'Confirmed' || i.status === 'Scheduled' || i.status === 'In Progress'
                ).length
              : interviews.filter((i) => i.status === 'Completed').length;

          return (
            <button
              key={tab}
              id={`interview-tab-${tab.toLowerCase()}`}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-slate-800 text-indigo-200' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {filteredInterviews.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-800">No interviews found</h4>
            <p className="text-xs text-slate-500 mt-1">
              There are currently no {activeTab.toLowerCase()} candidate interviews.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table id="interviews-table" className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Candidate</th>
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredInterviews.map((interview) => {
                  const isUpcoming =
                    interview.status === 'Confirmed' ||
                    interview.status === 'Scheduled' ||
                    interview.status === 'In Progress';

                  return (
                    <tr
                      key={interview.id}
                      id={`interview-row-${interview.id}`}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Candidate */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <button
                          type="button"
                          onClick={() => handleCandidateClick(interview.candidateName)}
                          className="font-semibold text-slate-900 hover:text-indigo-600 text-left"
                        >
                          {interview.candidateName}
                        </button>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Interviewer: {interview.interviewer}
                        </div>
                      </td>

                      {/* Position */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {interview.position}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        <span className="font-medium text-slate-800">{interview.date}</span>
                      </td>

                      {/* Time */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {interview.time}
                      </td>

                      {/* Mode Badge with icon */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={interview.mode} type="mode" />
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={interview.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isUpcoming ? (
                            <Link
                              id={`join-interview-btn-${interview.id}`}
                              href={`/interviews/${interview.id}`}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs inline-flex items-center gap-1.5"
                            >
                              <span>Join Interview</span>
                              <ExternalLink className="w-3 h-3 text-indigo-200" />
                            </Link>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-100 rounded-md">
                              Completed
                            </span>
                          )}

                          {interview.status !== 'Completed' && (
                            <button
                              type="button"
                              id={`complete-interview-btn-${interview.id}`}
                              onClick={() => updateInterviewStatus(interview.id, 'Completed')}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Mark as completed"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
