'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  PhoneOff,
  Bot,
  User,
  MessageSquare,
  ArrowLeft,
  Settings,
  Sparkles,
  Send,
  CheckCircle2,
} from 'lucide-react';

interface InterviewRoomProps {
  params: Promise<{ id: string }>;
}

export default function InterviewRoomPage({ params }: InterviewRoomProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { interviews, candidates, addToast, updateInterviewStatus } = useApp();

  const interviewId = resolvedParams.id;
  const interview = interviews.find((i) => i.id === interviewId) || interviews[0];
  const candidate = candidates.find(
    (c) =>
      c.id === interview?.candidateId ||
      c.name.toLowerCase() === interview?.candidateName.toLowerCase()
  ) || candidates[0];

  const mode = interview?.mode || 'Video';

  // Room controls state
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [roomMessages, setRoomMessages] = useState<
    { sender: 'AI Virtual HR' | 'Candidate' | 'Employer'; text: string; time: string }[]
  >([
    {
      sender: 'AI Virtual HR',
      text: `Welcome to the interview session with ${interview.candidateName} for the ${interview.position} role. System latency: 12ms. Automated transcript active.`,
      time: '11:00 AM',
    },
    {
      sender: 'Candidate',
      text: "Hello! Thank you for having me. I'm ready to begin.",
      time: '11:01 AM',
    },
  ]);

  const handleEndInterview = () => {
    updateInterviewStatus(interview.id, 'Completed');
    addToast({
      type: 'info',
      title: 'Interview Ended',
      message: `Interview with ${interview.candidateName} concluded. AI evaluation report will be ready shortly.`,
    });
    router.push('/interviews');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setRoomMessages((prev) => [
      ...prev,
      {
        sender: 'Employer',
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setChatInput('');

    // Simulate candidate reply in chat mode
    setTimeout(() => {
      setRoomMessages((prev) => [
        ...prev,
        {
          sender: 'Candidate',
          text: 'Understood. In my previous role I architected a similar solution handling over 10k requests per minute.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
      {/* Top Header */}
      <header className="h-16 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/interviews"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to ATS</span>
          </Link>

          <div className="h-4 w-px bg-slate-800" />

          <div>
            <h1 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
              <span>Salarite Interview Room</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h1>
            <p className="text-[11px] text-slate-400">
              Candidate: {interview.candidateName} · {interview.position}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={mode} type="mode" />
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>Virtual HR Co-Pilot Listening</span>
          </div>
        </div>
      </header>

      {/* Main Stage Area */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center relative overflow-hidden">
        {/* VIDEO MODE INTERFACE */}
        {mode === 'Video' && (
          <div className="w-full max-w-5xl h-[65vh] grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Candidate Stage */}
            <div className="relative bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
              <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-2xl font-bold text-slate-300 shadow-inner">
                {interview.candidateName.charAt(0)}
              </div>
              <p className="text-sm font-semibold text-white mt-4">{interview.candidateName}</p>
              <span className="text-xs text-slate-400 mt-0.5">{interview.position}</span>

              {/* Status pill overlay */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-xs border border-slate-800 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Candidate Feed Active</span>
              </div>
            </div>

            {/* Employer / Virtual HR Stage */}
            <div className="relative bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
              {cameraActive ? (
                <div className="flex flex-col items-center justify-center text-center p-6">
                  <div className="w-20 h-20 rounded-2xl bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 flex items-center justify-center mb-3">
                    <Bot className="w-10 h-10" />
                  </div>
                  <h3 className="text-base font-semibold text-white">Video Interview</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Your interview room is ready. Virtual HR is actively logging notes and
                    transcribing key answers.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <VideoOff className="w-12 h-12 mb-2 text-slate-600" />
                  <span className="text-xs">Camera is turned off</span>
                </div>
              )}

              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-xs border border-slate-800 text-xs text-slate-300">
                <span>Demo Employer (You)</span>
              </div>
            </div>
          </div>
        )}

        {/* VOICE MODE INTERFACE */}
        {mode === 'Voice' && (
          <div className="w-full max-w-2xl h-[55vh] bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center justify-center p-8 text-center shadow-2xl relative">
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-32 h-32 rounded-full bg-indigo-950/40 border-2 border-indigo-500/30 animate-ping absolute" />
              <div className="w-28 h-28 rounded-full bg-slate-800 border-2 border-indigo-500 flex items-center justify-center text-3xl font-bold text-white relative z-10 shadow-lg">
                <Mic className="w-12 h-12 text-indigo-400" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              Voice Interview Call in Progress
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Connected with {interview.candidateName} · Audio stream encrypted
            </p>

            <div className="mt-8 flex items-center gap-1.5 h-8">
              {[40, 75, 20, 90, 60, 30, 85, 45, 100, 50, 70, 35].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-indigo-500 rounded-full transition-all duration-200"
                  style={{ height: `${micActive ? h : 15}%` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* CHAT MODE INTERFACE */}
        {mode === 'Chat' && (
          <div className="w-full max-w-3xl h-[65vh] bg-slate-900 rounded-2xl border border-slate-800 flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-white">
                  Real-Time Assessment Transcript
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Live Structured Chat Q&A</span>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-slate-950/50">
              {roomMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3.5 rounded-xl text-xs max-w-lg leading-relaxed ${
                    msg.sender === 'AI Virtual HR'
                      ? 'bg-slate-900 border border-slate-800 text-slate-300'
                      : msg.sender === 'Candidate'
                      ? 'bg-slate-800 text-slate-100'
                      : 'bg-indigo-600 text-white ml-auto'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 opacity-70 text-[10px]">
                    <span className="font-semibold">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type question or prompt for candidate..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <footer className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-4 px-6">
        {/* Toggle Microphone */}
        <button
          type="button"
          onClick={() => {
            setMicActive(!micActive);
            addToast({
              type: 'info',
              title: micActive ? 'Microphone Muted' : 'Microphone Unmuted',
              message: micActive ? 'Audio input is muted.' : 'Audio input is active.',
            });
          }}
          className={`p-3.5 rounded-xl border transition-all ${
            micActive
              ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
              : 'bg-rose-500/20 border-rose-500 text-rose-400'
          }`}
          title={micActive ? 'Mute microphone' : 'Unmute microphone'}
        >
          {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* Toggle Camera (applicable in Video mode) */}
        {mode === 'Video' && (
          <button
            type="button"
            onClick={() => {
              setCameraActive(!cameraActive);
              addToast({
                type: 'info',
                title: cameraActive ? 'Camera Disabled' : 'Camera Enabled',
                message: cameraActive ? 'Video stream stopped.' : 'Video stream started.',
              });
            }}
            className={`p-3.5 rounded-xl border transition-all ${
              cameraActive
                ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                : 'bg-rose-500/20 border-rose-500 text-rose-400'
            }`}
            title={cameraActive ? 'Turn off camera' : 'Turn on camera'}
          >
            {cameraActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
        )}

        {/* Screen Share */}
        <button
          type="button"
          onClick={() => {
            setScreenShareActive(!screenShareActive);
            addToast({
              type: 'info',
              title: screenShareActive ? 'Screen Share Stopped' : 'Screen Share Started',
              message: screenShareActive ? 'Presenter mode exited.' : 'Sharing screen to candidate.',
            });
          }}
          className={`p-3.5 rounded-xl border transition-all ${
            screenShareActive
              ? 'bg-indigo-600 border-indigo-500 text-white'
              : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
          }`}
          title="Toggle screen share"
        >
          <MonitorUp className="w-5 h-5" />
        </button>

        {/* End Interview */}
        <button
          type="button"
          id="btn-end-interview"
          onClick={handleEndInterview}
          className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-2"
        >
          <PhoneOff className="w-4 h-4" />
          <span>End Interview</span>
        </button>
      </footer>
    </div>
  );
}
