'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { AIMessage } from './AIMessage';
import { QuickAction } from './QuickAction';
import { ProgressCard } from './ProgressCard';
import {
  Send,
  Mic,
  Bot,
  Sparkles,
  Calendar,
  CheckSquare,
  UserPlus,
  Clock,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { InterviewMode } from '@/types';

export function AIChat() {
  const {
    chatMessages,
    sendUserChatMessage,
    triggerAIAction,
    aiStatus,
    activities,
    setIsTaskModalOpen,
    setIsInterviewModalOpen,
    setIsAddCandidateModalOpen,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    sendUserChatMessage(inputText);
    setInputText('');
  };

  const handleVoiceInputSimulate = () => {
    setIsRecording(true);
    setTimeout(() => {
      setInputText('Schedule an interview with Rahul Sharma tomorrow at 11 AM.');
      setIsRecording(false);
    }, 1500);
  };

  const handleQuickActionClick = (actionName: string) => {
    if (actionName === 'Assign a task' || actionName.includes('task')) {
      setIsTaskModalOpen(true);
    } else if (actionName === 'Schedule an interview' || actionName.includes('interview')) {
      setIsInterviewModalOpen(true);
    } else if (actionName === 'Add candidate' || actionName.includes('candidate')) {
      setIsAddCandidateModalOpen(true);
    } else {
      sendUserChatMessage(actionName);
    }
  };

  const recentAiActivities = activities.slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Chat Area (8 cols on desktop) */}
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden h-[750px]">
        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-indigo-300 flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">Virtual HR Agent</h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.2">
                Your intelligent HR assistant for candidate workflows & scheduling
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono text-slate-400 bg-white px-2.5 py-1 rounded-md border border-slate-200 hidden sm:inline-block">
            FastAPI ready
          </span>
        </div>

        {/* Quick Actions Bar */}
        <div className="px-5 py-3 border-b border-slate-100 bg-white overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
            Quick Actions:
          </span>
          <QuickAction
            id="quick-assign-task"
            label="Assign a task"
            icon={CheckSquare}
            onClick={() => handleQuickActionClick('Assign a task')}
          />
          <QuickAction
            id="quick-schedule-interview"
            label="Schedule an interview"
            icon={Calendar}
            onClick={() => handleQuickActionClick('Schedule an interview')}
          />
          <QuickAction
            id="quick-view-pending"
            label="View pending tasks"
            icon={Clock}
            onClick={() => handleQuickActionClick('View pending tasks')}
          />
          <QuickAction
            id="quick-add-candidate"
            label="Add candidate"
            icon={UserPlus}
            onClick={() => handleQuickActionClick('Add candidate')}
          />
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30">
          {chatMessages.map((msg) => (
            <AIMessage
              key={msg.id}
              message={msg}
              onSelectMode={(mode: InterviewMode) => triggerAIAction('select_mode', mode)}
              onQuickAction={handleQuickActionClick}
            />
          ))}

          {aiStatus === 'processing' && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-11 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
              <span>Virtual HR is thinking & checking pipeline...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <form onSubmit={handleSend} className="relative flex items-center gap-2">
            <button
              type="button"
              id="chat-mic-button"
              onClick={handleVoiceInputSimulate}
              className={`p-2 rounded-xl border transition-colors ${
                isRecording
                  ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="Speak or click to dictate sample command"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              id="ai-chat-input"
              type="text"
              placeholder="Ask your Virtual HR anything (e.g. Schedule an interview with Rahul Sharma)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
            />

            <button
              type="submit"
              id="ai-chat-send-btn"
              disabled={!inputText.trim() || aiStatus === 'processing'}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-indigo-900 text-white disabled:opacity-40 disabled:hover:bg-slate-900 transition-colors shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel (4 cols on desktop) */}
      <div className="lg:col-span-5 xl:col-span-4 space-y-6">
        {/* ProgressCard (Current Tasks) */}
        <ProgressCard />

        {/* Virtual HR Live Activity Card */}
        <div id="ai-live-activity-card" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 tracking-tight">
                Virtual HR Activity
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Live background actions</p>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="space-y-3 divide-y divide-slate-100">
            {recentAiActivities.map((act) => (
              <div key={act.id} className="pt-2.5 first:pt-0 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    {act.action}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{act.timestamp}</span>
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5 ml-3 leading-relaxed">
                  {act.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
