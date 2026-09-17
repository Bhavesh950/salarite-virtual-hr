'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { useApp } from '@/context/AppContext';
import { InterviewMode } from '@/types';
import { InterviewModeSelector } from './InterviewModeSelector';
import { Calendar, Clock, Sparkles } from 'lucide-react';

export function InterviewModal() {
  const { isInterviewModalOpen, setIsInterviewModalOpen, scheduleInterview, candidates } = useApp();

  const [selectedCandidateId, setSelectedCandidateId] = useState(candidates[0]?.id || 'CAN-001');
  const [interviewDate, setInterviewDate] = useState('Tomorrow');
  const [interviewTime, setInterviewTime] = useState('11:00 AM');
  const [interviewMode, setInterviewMode] = useState<InterviewMode>('Video');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

    scheduleInterview({
      candidateId: candidate ? candidate.id : 'CAN-001',
      candidateName: candidate ? candidate.name : 'Selected Candidate',
      position: candidate ? candidate.appliedFor : 'Software Engineer',
      date: interviewDate,
      time: interviewTime,
      mode: interviewMode,
      notes: notes.trim(),
    });

    setIsInterviewModalOpen(false);
  };

  return (
    <Modal
      id="schedule-interview-modal"
      isOpen={isInterviewModalOpen}
      onClose={() => setIsInterviewModalOpen(false)}
      title="Schedule Interview"
      subtitle="Coordinate candidate evaluation round handled by Virtual HR or human interviewer."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4.5">
        {/* Select Candidate */}
        <div>
          <label htmlFor="interview-candidate-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Select Candidate <span className="text-rose-500">*</span>
          </label>
          <select
            id="interview-candidate-select"
            value={selectedCandidateId}
            onChange={(e) => setSelectedCandidateId(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
          >
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.appliedFor} ({c.status})
              </option>
            ))}
          </select>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="interview-date-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Interview Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="interview-date-select"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
              >
                <option value="Today">Today</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="Sep 16, 2026">Sep 16, 2026</option>
                <option value="Sep 17, 2026">Sep 17, 2026</option>
                <option value="Sep 18, 2026">Sep 18, 2026</option>
              </select>
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label htmlFor="interview-time-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Interview Time <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="interview-time-select"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
              >
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="05:00 PM">05:00 PM</option>
              </select>
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Interview Mode Selector (Voice, Video, Chat) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Interview Mode <span className="text-rose-500">*</span>
          </label>
          <InterviewModeSelector
            value={interviewMode}
            onChange={setInterviewMode}
            idPrefix="modal-interview"
          />
        </div>

        {/* Optional Notes */}
        <div>
          <label htmlFor="interview-notes-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Agenda / Interviewer Notes
          </label>
          <textarea
            id="interview-notes-input"
            rows={2}
            placeholder="e.g. Focus on microservices and real-time backend queues."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            id="cancel-interview-btn"
            onClick={() => setIsInterviewModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="submit-schedule-interview-btn"
            className="px-5 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-indigo-900 rounded-xl transition-colors shadow-xs flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>Schedule Interview</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
