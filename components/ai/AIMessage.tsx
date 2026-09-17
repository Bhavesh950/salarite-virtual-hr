'use client';

import React from 'react';
import Link from 'next/link';
import { ChatMessage, InterviewMode } from '@/types';
import { Bot, User, Mic, Video, MessageSquare, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

interface AIMessageProps {
  message: ChatMessage;
  onSelectMode?: (mode: InterviewMode) => void;
  onQuickAction?: (action: string) => void;
}

export function AIMessage({ message, onSelectMode, onQuickAction }: AIMessageProps) {
  const isAI = message.sender === 'ai';

  return (
    <div
      id={`chat-msg-${message.id}`}
      className={`flex gap-3 max-w-2xl ${isAI ? 'self-start' : 'self-end flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
          isAI
            ? 'bg-slate-900 text-indigo-300 border border-slate-800'
            : 'bg-indigo-600 text-white'
        }`}
      >
        {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Bubble and Action Content */}
      <div className={`space-y-2.5 ${isAI ? 'items-start' : 'items-end flex flex-col'}`}>
        {/* Main Text Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isAI
              ? 'bg-white border border-slate-200/90 text-slate-800 shadow-xs'
              : 'bg-slate-900 text-white shadow-xs'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>

        {/* Mode Selector Buttons if AI requested interview mode */}
        {isAI && message.modeOptions && onSelectMode && (
          <div className="flex flex-wrap gap-2 pt-1 animate-in fade-in duration-200">
            <button
              type="button"
              id="chat-select-mode-voice"
              onClick={() => onSelectMode('Voice')}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-slate-800 text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Mic className="w-3.5 h-3.5 text-amber-600" />
              <span>Voice</span>
            </button>
            <button
              type="button"
              id="chat-select-mode-video"
              onClick={() => onSelectMode('Video')}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-800 text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Video className="w-3.5 h-3.5 text-indigo-600" />
              <span>Video</span>
            </button>
            <button
              type="button"
              id="chat-select-mode-chat"
              onClick={() => onSelectMode('Chat')}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-800 text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chat</span>
            </button>
          </div>
        )}

        {/* Action Confirmation Card */}
        {isAI && message.actionCard && (
          <div
            id={`action-card-${message.id}`}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs max-w-sm w-full space-y-3 animate-in fade-in duration-200"
          >
            {message.actionCard.type === 'interview_confirm' && (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Interview Scheduled
                  </span>
                  {message.actionCard.mode && (
                    <StatusBadge status={message.actionCard.mode} type="mode" />
                  )}
                </div>

                <div className="text-xs space-y-1 text-slate-600">
                  <p>
                    <strong className="text-slate-900">Candidate:</strong>{' '}
                    {message.actionCard.candidate}
                  </p>
                  <p>
                    <strong className="text-slate-900">Date:</strong> {message.actionCard.date}
                  </p>
                  <p>
                    <strong className="text-slate-900">Time:</strong> {message.actionCard.time}
                  </p>
                  <p>
                    <strong className="text-slate-900">Mode:</strong> {message.actionCard.mode}
                  </p>
                </div>

                <Link
                  id="view-interview-action-btn"
                  href="/interviews"
                  className="w-full py-2 px-3 text-xs font-medium text-white bg-slate-900 hover:bg-indigo-900 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>View Interview</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
                </Link>
              </>
            )}

            {message.actionCard.type === 'task_confirm' && (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Task Queued
                  </span>
                  {message.actionCard.priority && (
                    <StatusBadge status={message.actionCard.priority} type="priority" />
                  )}
                </div>

                <div className="text-xs space-y-1 text-slate-600">
                  <p>
                    <strong className="text-slate-900">Task:</strong>{' '}
                    {message.actionCard.taskTitle}
                  </p>
                  <p>
                    <strong className="text-slate-900">Candidate:</strong>{' '}
                    {message.actionCard.candidate}
                  </p>
                  <p>
                    <strong className="text-slate-900">Assigned:</strong> Virtual HR
                  </p>
                </div>

                <Link
                  href="/tasks"
                  className="w-full py-2 px-3 text-xs font-medium text-white bg-slate-900 hover:bg-indigo-900 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View in Tasks</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
                </Link>
              </>
            )}
          </div>
        )}

        {/* Quick reply chips */}
        {isAI && message.quickReplies && message.quickReplies.length > 0 && onQuickAction && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {message.quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => onQuickAction(reply)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors border border-slate-200/50"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-slate-400 font-mono px-1">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
