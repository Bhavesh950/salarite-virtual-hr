'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { useApp } from '@/context/AppContext';
import { TaskPriority } from '@/types';
import { Sparkles, Bot, Calendar, AlertCircle } from 'lucide-react';

export function TaskModal() {
  const { isTaskModalOpen, setIsTaskModalOpen, addTask, candidates } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [candidateName, setCandidateName] = useState('Rahul Sharma');
  const [priority, setPriority] = useState<TaskPriority>('High');
  const [assignedTo, setAssignedTo] = useState('Virtual HR');
  const [dueDate, setDueDate] = useState('Today');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title');
      return;
    }

    const matchedCandidate = candidates.find((c) => c.name === candidateName);

    addTask({
      title: title.trim(),
      description: description.trim() || 'Recruitment task assigned by employer.',
      candidateName: candidateName || 'Multiple Candidates',
      candidateId: matchedCandidate?.id,
      priority,
      assignedTo: assignedTo || 'Virtual HR',
      dueDate,
    });

    // Reset and close
    setTitle('');
    setDescription('');
    setError('');
    setIsTaskModalOpen(false);
  };

  return (
    <Modal
      id="assign-task-modal"
      isOpen={isTaskModalOpen}
      onClose={() => setIsTaskModalOpen(false)}
      title="Assign Task to Virtual HR"
      subtitle="The AI Virtual HR will automatically queue and execute this recruitment operation."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Task Title */}
        <div>
          <label htmlFor="task-title-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Task Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="task-title-input"
            type="text"
            required
            placeholder="e.g. Screen Rahul Sharma's resume"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="task-desc-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            id="task-desc-input"
            rows={3}
            placeholder="Provide specific guidelines, evaluation criteria or focus areas..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Candidate & Priority grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-candidate-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Candidate
            </label>
            <select
              id="task-candidate-select"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
            >
              <option value="Multiple Candidates">Multiple Candidates</option>
              {candidates.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.appliedFor})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="task-priority-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Priority
            </label>
            <select
              id="task-priority-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Assign To & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-assign-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Assign To
            </label>
            <div className="relative">
              <input
                id="task-assign-input"
                type="text"
                readOnly
                value={assignedTo}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-700 cursor-not-allowed font-medium"
              />
              <Bot className="w-4 h-4 text-indigo-600 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Default assignee: Virtual HR</p>
          </div>

          <div>
            <label htmlFor="task-due-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Due Date
            </label>
            <select
              id="task-due-select"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
            >
              <option value="Today">Today</option>
              <option value="Tomorrow">Tomorrow</option>
              <option value="In 2 days">In 2 days</option>
              <option value="End of week">End of week</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            id="cancel-task-btn"
            onClick={() => setIsTaskModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="submit-assign-task-btn"
            className="px-5 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-indigo-900 rounded-xl transition-colors shadow-xs flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>Assign Task</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
