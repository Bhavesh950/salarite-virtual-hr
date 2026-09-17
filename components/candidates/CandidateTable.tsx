'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Candidate, CandidateStatus } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Search, Mail, Phone, Calendar, ArrowUpRight, Eye } from 'lucide-react';

export function CandidateTable() {
  const { candidates, setSelectedCandidate, setIsInterviewModalOpen } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | CandidateStatus>('All');

  const statuses: ('All' | CandidateStatus)[] = [
    'All',
    'New',
    'Screening',
    'Interview',
    'Selected',
    'Rejected',
  ];

  const filteredCandidates = candidates.filter((c) => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.appliedFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto">
          {statuses.map((s) => {
            const count =
              s === 'All' ? candidates.length : candidates.filter((c) => c.status === s).length;
            const isSelected = statusFilter === s;

            return (
              <button
                key={s}
                id={`candidate-filter-${s.toLowerCase()}`}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{s}</span>
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

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="candidate-search-input"
            type="text"
            placeholder="Search name, role, skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {filteredCandidates.length === 0 ? (
          <div className="p-12 text-center">
            <h4 className="text-sm font-semibold text-slate-800">No candidates found</h4>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table id="candidates-table" className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Candidate</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Applied For</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Interview Schedule</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCandidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    id={`candidate-row-${candidate.id}`}
                    onClick={() => setSelectedCandidate(candidate)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    {/* Candidate Name & Match */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold flex items-center justify-center border border-slate-200/60 shrink-0">
                          {candidate.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                            <span>{candidate.name}</span>
                            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                              {candidate.matchScore}%
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">Exp: {candidate.experience}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Information */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-700">{candidate.email}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">{candidate.phone}</div>
                    </td>

                    {/* Applied For & Skills */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{candidate.appliedFor}</div>
                      <div className="flex items-center gap-1 mt-1 overflow-hidden">
                        {candidate.skills.slice(0, 2).map((s) => (
                          <span
                            key={s}
                            className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600"
                          >
                            {s}
                          </span>
                        ))}
                        {candidate.skills.length > 2 && (
                          <span className="text-[10px] text-slate-400">
                            +{candidate.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={candidate.status} type="candidate" />
                    </td>

                    {/* Interview Status */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-600 text-xs flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px]">
                          {candidate.interviewStatus || 'None scheduled'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          id={`view-candidate-btn-${candidate.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCandidate(candidate);
                          }}
                          className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>Details</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
