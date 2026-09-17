'use client';

import React from 'react';
import { Modal } from '@/components/common/Modal';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { CandidateStatus } from '@/types';
import {
  Mail,
  Phone,
  Briefcase,
  Calendar,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export function CandidateDetailsModal() {
  const {
    selectedCandidate,
    setSelectedCandidate,
    updateCandidateStatus,
    tasks,
    interviews,
    activities,
    setIsInterviewModalOpen,
  } = useApp();

  if (!selectedCandidate) return null;

  // Filter tasks, interviews and activities relevant to this candidate
  const candidateTasks = tasks.filter(
    (t) =>
      t.candidateId === selectedCandidate.id ||
      t.candidateName.toLowerCase().includes(selectedCandidate.name.toLowerCase())
  );

  const candidateInterviews = interviews.filter(
    (i) =>
      i.candidateId === selectedCandidate.id ||
      i.candidateName.toLowerCase().includes(selectedCandidate.name.toLowerCase())
  );

  const candidateActivities = activities.filter((a) =>
    a.description.toLowerCase().includes(selectedCandidate.name.toLowerCase())
  );

  const statuses: CandidateStatus[] = ['New', 'Screening', 'Interview', 'Selected', 'Rejected'];

  return (
    <Modal
      id="candidate-details-modal"
      isOpen={!!selectedCandidate}
      onClose={() => setSelectedCandidate(null)}
      title={selectedCandidate.name}
      subtitle={`Applied for ${selectedCandidate.appliedFor}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <StatusBadge status={selectedCandidate.status} type="candidate" size="md" />
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {selectedCandidate.matchScore}% Match Score
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {selectedCandidate.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {selectedCandidate.phone}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {selectedCandidate.experience} experience
              </span>
            </p>
          </div>

          {/* Quick status switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Stage:</span>
            <select
              id="candidate-stage-selector"
              value={selectedCandidate.status}
              onChange={(e) =>
                updateCandidateStatus(selectedCandidate.id, e.target.value as CandidateStatus)
              }
              className="text-xs font-medium px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Verified Skills & Attributes
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {selectedCandidate.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Resume Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Resume Summary & Virtual HR Analysis
            </h4>
            <span className="text-[11px] text-indigo-600 font-medium">Parsed by AI Virtual HR</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
            <p>{selectedCandidate.resumeSnippet}</p>
            <div className="pt-2 border-t border-slate-100 text-slate-600 italic">
              <strong>HR Assessment:</strong> {selectedCandidate.notes}
            </div>
          </div>
        </div>

        {/* Interview History */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Interview History ({candidateInterviews.length})
            </h4>
            <button
              onClick={() => {
                setSelectedCandidate(null);
                setIsInterviewModalOpen(true);
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              <span>+ Schedule round</span>
            </button>
          </div>

          {candidateInterviews.length === 0 ? (
            <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
              No interviews scheduled yet.
            </div>
          ) : (
            <div className="space-y-2">
              {candidateInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <StatusBadge status={interview.mode} type="mode" />
                    <div>
                      <p className="font-semibold text-slate-900">
                        {interview.date} at {interview.time}
                      </p>
                      <p className="text-slate-500 text-[11px]">{interview.interviewer}</p>
                    </div>
                  </div>
                  <StatusBadge status={interview.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Tasks */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Assigned Tasks ({candidateTasks.length})
          </h4>
          {candidateTasks.length === 0 ? (
            <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
              No tasks currently linked to this candidate.
            </div>
          ) : (
            <div className="space-y-2">
              {candidateTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{t.title}</p>
                    <p className="text-[11px] text-slate-500">
                      Assigned to {t.assignedTo} · Due {t.dueDate}
                    </p>
                  </div>
                  <StatusBadge status={t.status} type="task" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Activity Timeline
          </h4>
          <div className="space-y-2 max-h-36 overflow-y-auto">
            {candidateActivities.length === 0 ? (
              <p className="text-xs text-slate-400">No recorded activities yet.</p>
            ) : (
              candidateActivities.map((act) => (
                <div
                  key={act.id}
                  className="text-xs flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 text-slate-600"
                >
                  <span className="text-[11px] text-slate-400 font-mono shrink-0 mt-0.5">
                    {act.timestamp}
                  </span>
                  <div>
                    <span className="font-medium text-slate-800">{act.action}</span>: {act.description}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
