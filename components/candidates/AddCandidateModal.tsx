'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { useApp } from '@/context/AppContext';
import { UserPlus, Sparkles } from 'lucide-react';

export function AddCandidateModal() {
  const { isAddCandidateModalOpen, setIsAddCandidateModalOpen, addCandidate } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [appliedFor, setAppliedFor] = useState('Python Developer');
  const [experience, setExperience] = useState('3 years');
  const [skillsStr, setSkillsStr] = useState('Python, FastAPI, Docker');
  const [notes, setNotes] = useState('');

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!name.trim() || !email.trim()) return;

  const skills = skillsStr
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    const newCandidate = await addCandidate({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+91 98000 00000',
      appliedFor,
      experience,
      skills,
      notes: notes.trim(),
    });

    if (!newCandidate) return;

    setName('');
    setEmail('');
    setPhone('');
    setAppliedFor('Python Developer');
    setExperience('3 years');
    setSkillsStr('Python, FastAPI, Docker');
    setNotes('');

    setIsAddCandidateModalOpen(false);
  } catch (error) {
    console.error('Failed to add candidate:', error);
  }
};

  return (
    <Modal
      id="add-candidate-modal"
      isOpen={isAddCandidateModalOpen}
      onClose={() => setIsAddCandidateModalOpen(false)}
      title="Add Candidate to Pipeline"
      subtitle="Register a new applicant into Salarite ATS for automated AI screening."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cand-name-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="cand-name-input"
            type="text"
            required
            placeholder="e.g. Tanvi Deshmukh"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cand-email-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="cand-email-input"
              type="email"
              required
              placeholder="e.g. tanvi@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="cand-phone-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Phone Number
            </label>
            <input
              id="cand-phone-input"
              type="tel"
              placeholder="+91 98765 00000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cand-role-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Applied Position <span className="text-rose-500">*</span>
            </label>
            <select
              id="cand-role-select"
              value={appliedFor}
              onChange={(e) => setAppliedFor(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
            >
              <option value="Python Developer">Python Developer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Senior Backend Engineer">Senior Backend Engineer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="HR Operations Specialist">HR Operations Specialist</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
            </select>
          </div>

          <div>
            <label htmlFor="cand-exp-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Years of Experience
            </label>
            <input
              id="cand-exp-input"
              type="text"
              placeholder="e.g. 4 years"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label htmlFor="cand-skills-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Key Skills (comma separated)
          </label>
          <input
            id="cand-skills-input"
            type="text"
            placeholder="e.g. TypeScript, React, Next.js, Node.js"
            value={skillsStr}
            onChange={(e) => setSkillsStr(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
          />
        </div>

        <div>
          <label htmlFor="cand-notes-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Initial Notes / Referral Source
          </label>
          <textarea
            id="cand-notes-input"
            rows={2}
            placeholder="Inbound applicant or internal employee referral..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white resize-none"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => setIsAddCandidateModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="submit-add-candidate-btn"
            className="px-5 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-indigo-900 rounded-xl transition-colors shadow-xs flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-indigo-300" />
            <span>Add Candidate</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
