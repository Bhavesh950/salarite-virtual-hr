  'use client';

  import React, { useState } from 'react';
  import Link from 'next/link';
  import { useApp } from '@/context/AppContext';
  import { Interview, InterviewStatus } from '@/types';
  import { StatusBadge } from '@/components/common/StatusBadge';
  import { Video, Mic, MessageSquare, ExternalLink, Calendar, Clock, CheckCircle2 } from 'lucide-react';

  export function InterviewTable() {
    const {
    interviews,
    updateInterviewStatus,
    updateInterview,
    deleteInterview,
    setSelectedCandidate,
    candidates,
  } = useApp();

    const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'All'>('Upcoming');
    const [editingInterview, setEditingInterview] = useState<Interview | null>(null);

    const [editCandidateId, setEditCandidateId] = useState('');
    const [editPosition, setEditPosition] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editTime, setEditTime] = useState('');
    const [editMode, setEditMode] = useState<Interview['mode']>('Video');
    const [editStatus, setEditStatus] = useState<InterviewStatus>('Scheduled');
    const [editNotes, setEditNotes] = useState('');

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

      {/* EDIT */}
      {/* EDIT */}
  {interview.status !== 'Completed' && (
    <button
      type="button"
      onClick={() => {
        const candidate = candidates.find(
          (c) => String(c.id) === String(interview.candidateId)
        );

        setEditingInterview(interview);
        setEditCandidateId(String(interview.candidateId));
        setEditPosition(interview.position || candidate?.appliedFor || '');
        
        const parsedDate = new Date(
          `${interview.date} ${interview.time}`
        );

        if (!Number.isNaN(parsedDate.getTime())) {
          setEditDate(
            `${parsedDate.getFullYear()}-${String(
              parsedDate.getMonth() + 1
            ).padStart(2, '0')}-${String(
              parsedDate.getDate()
            ).padStart(2, '0')}`
          );

          setEditTime(
            `${String(parsedDate.getHours()).padStart(2, '0')}:${String(
              parsedDate.getMinutes()
            ).padStart(2, '0')}`
          );
        } else {
          setEditDate('');
          setEditTime('');
        }

        setEditMode(interview.mode);
        setEditStatus(interview.status);
        setEditNotes(interview.notes || '');
      }}
      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
      title="Edit interview"
    >
      ✏️
    </button>
  )}

      {/* DELETE */}
      <button
        type="button"
        onClick={() => {
          const confirmed = window.confirm(
            `Delete interview for ${interview.candidateName}?`
          );

          if (confirmed) {
            deleteInterview(interview.id);
          }
        }}
        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        title="Delete interview"
      >
        🗑️
      </button>

      {/* COMPLETE */}
      {interview.status !== 'Completed' && (
        <button
          type="button"
          id={`complete-interview-btn-${interview.id}`}
          onClick={() =>
            updateInterviewStatus(interview.id, 'Completed')
          }
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
              {/* EDIT INTERVIEW MODAL */}
        {editingInterview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">

              <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Edit Interview
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Update interview details
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingInterview(null)}
                  className="text-slate-400 hover:text-slate-700 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-5">

                {/* Candidate + Position */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Candidate
                    </label>

                    <select
                      value={editCandidateId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setEditCandidateId(id);

                        const candidate = candidates.find(
                          (c) => String(c.id) === id
                        );

                        if (candidate) {
                          setEditPosition(candidate.appliedFor);
                        }
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                    >
                      {candidates.map((candidate) => (
                        <option
                          key={candidate.id}
                          value={candidate.id}
                        >
                          {candidate.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Position
                    </label>

                    <input
                      type="text"
                      value={editPosition}
                      onChange={(e) => setEditPosition(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Interview Date
                    </label>

                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Interview Time
                    </label>

                    <input
                      type="time"
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                </div>

                {/* Mode + Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Interview Mode
                    </label>

                    <select
                      value={editMode}
                      onChange={(e) =>
                        setEditMode(e.target.value as Interview['mode'])
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                    >
                      <option value="Video">Video</option>
                      <option value="Voice">Voice</option>
                      <option value="Chat">Chat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Interview Status
                    </label>

                    <select
                      value={editStatus}
                      onChange={(e) =>
                        setEditStatus(e.target.value as InterviewStatus)
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Interview Notes
                  </label>

                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm resize-none"
                    placeholder="Add interview notes..."
                  />
                </div>

              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => setEditingInterview(null)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (!editCandidateId || !editDate || !editTime) {
                      alert('Please fill candidate, date and time.');
                      return;
                    }

                    await updateInterview(editingInterview.id, {
                      candidate_id: Number(editCandidateId),
                      interview_date: `${editDate}T${editTime}:00`,
                      mode: editMode,
                      status: editStatus,
                      notes: editNotes,
                      position: editPosition,
                    });

                    setEditingInterview(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-900 text-white text-sm font-semibold"
                >
                  Save Changes
                </button>

              </div>

            </div>
          </div>
        )}
      </div>
    );
  }
