'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Task,
  Candidate,
  Interview,
  ActivityItem,
  ChatMessage,
  ToastNotification,
  TaskStatus,
  CandidateStatus,
  InterviewStatus,
  InterviewMode,
  TaskPriority,
} from '@/types';
import {
  INITIAL_TASKS,
  INITIAL_CANDIDATES,
  INITIAL_INTERVIEWS,
  INITIAL_ACTIVITIES,
  INITIAL_CHAT_MESSAGES,
  AI_CURRENT_TASKS,
} from '@/lib/mock-data';

const API_URL = "http://127.0.0.1:8000"; 

interface AppContextType {
  user: {
    name: string;
    role: string;
    email: string;
    avatar: string;
  };
  tasks: Task[];
  candidates: Candidate[];
  interviews: Interview[];
  activities: ActivityItem[];
  chatMessages: ChatMessage[];
  aiWorkingTasks: typeof AI_CURRENT_TASKS;
  aiStatus: 'online' | 'processing' | 'idle';
  toasts: ToastNotification[];
  isSimulationRunning: boolean;
  setIsSimulationRunning: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Modals & Panels
  selectedCandidate: Candidate | null;
  setSelectedCandidate: (candidate: Candidate | null) => void;
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (val: boolean) => void;
  isInterviewModalOpen: boolean;
  setIsInterviewModalOpen: (val: boolean) => void;
  isAddCandidateModalOpen: boolean;
  setIsAddCandidateModalOpen: (val: boolean) => void;



  // Actions
  addTask: (data: {
    title: string;
    description: string;
    candidateName: string;
    candidateId?: string;
    priority: TaskPriority;
    assignedTo?: string;
    dueDate: string;
  }) => Promise<Task | null>;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  deleteTask: (taskId: string) => void;

  addCandidate: (data: {
    name: string;
    email: string;
    phone: string;
    appliedFor: string;
    skills: string[];
    experience: string;
    notes?: string;
 }) => Promise<Candidate>;
  updateCandidateStatus: (candidateId: string, newStatus: CandidateStatus) => void;

  scheduleInterview: (data: {
  candidateId: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  mode: InterviewMode;
  notes?: string;
}) => Promise<Interview | null>;
  updateInterviewStatus: (interviewId: string, newStatus: InterviewStatus) => void;

  sendUserChatMessage: (text: string) => void;
  triggerAIAction: (actionType: string, payload?: any) => void;

  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState({
    name: 'Demo Employer',
    role: 'Employer',
    email: 'demo@salarite.com',
    avatar: 'DE',
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [interviews, setInterviews] = useState<Interview[]>(INITIAL_INTERVIEWS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [aiWorkingTasks, setAiWorkingTasks] = useState(AI_CURRENT_TASKS);
  const [aiStatus, setAiStatus] = useState<'online' | 'processing' | 'idle'>('online');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(true);

  // Modal states
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isAddCandidateModalOpen, setIsAddCandidateModalOpen] = useState(false);

  useEffect(() => {
  const loadData = async () => {

    // =========================
    // LOAD TASKS
    // =========================
    try {
      const tasksRes = await fetch(`${API_URL}/tasks/`);

      if (!tasksRes.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const tasksData = await tasksRes.json();

      console.log("Tasks from API:", tasksData);

      setTasks(
        tasksData.map((t: any) => ({
          id: String(t.id),
          title: t.title,
          description: t.description || "",
          candidateName: t.assigned_to || "Unassigned",
          candidateId: undefined,
          assignedTo: t.assigned_to || "Virtual HR",
          priority: t.priority || "Medium",
          status: t.status || "Pending",
          dueDate: "Not specified",
          progress:
            t.status === "Completed"
              ? 100
              : t.status === "In Progress"
              ? 50
              : 0,
          createdAt: "Recently",
        }))
      );

    } catch (error) {
      console.error("Tasks API Error:", error);
    }


    // =========================
    // LOAD CANDIDATES
    // =========================
    try {
      const candidatesRes = await fetch(`${API_URL}/candidates/`);

      if (!candidatesRes.ok) {
        throw new Error("Failed to fetch candidates");
      }

      const candidatesData = await candidatesRes.json();

      console.log("Candidates from API:", candidatesData);

      setCandidates(
        candidatesData.map((c: any) => ({
          id: String(c.id),
          name: c.name,
          email: c.email,
          phone: c.phone || "",
          appliedFor: c.position,
          status: c.status || "New",
          interviewStatus: "Reviewing application",
          experience: c.experience || "Not specified",
          matchScore: c.match_score || 0,
          appliedDate: c.created_at || "Recently",
          skills: c.skills
            ? c.skills
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : [],
          resumeSnippet: c.resume || "",
          notes: c.notes || "",
        }))
      );

    } catch (error) {
      console.error("Candidates API Error:", error);
    }
  };

  loadData();
}, []);
  // Toast helper
  const addToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastNotification = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration ?? 4500;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Activity logger
  const logActivity = useCallback(
    (action: string, description: string, type: ActivityItem['type'], status = 'Done') => {
      const newActivity: ActivityItem = {
        id: `ACT-${Date.now()}`,
        action,
        description,
        timestamp: 'Just now',
        type,
        status,
      };
      setActivities((prev) => [newActivity, ...prev]);
    },
    []
  );

  // Task actions
  // Task actions
  const addTask = useCallback(
  async (data: {
    title: string;
    description: string;
    candidateName: string;
    candidateId?: string;
    priority: TaskPriority;
    assignedTo?: string;
    dueDate: string;
  }) => {
    try {
      const response = await fetch(`${API_URL}/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          assigned_to: data.assignedTo || 'Virtual HR',
          status: 'Pending',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const backendTask = await response.json();

      const newTask: Task = {
        id: String(backendTask.id),
        title: backendTask.title,
        description: backendTask.description,
        candidateName: data.candidateName || 'Multiple',
        candidateId: data.candidateId,
        assignedTo: backendTask.assigned_to || data.assignedTo || 'Virtual HR',
        priority: data.priority,
        status: backendTask.status || 'Pending',
        dueDate: data.dueDate,
        progress: 0,
        createdAt: 'Today, Just now',
      };

      setTasks((prev) => [newTask, ...prev]);

      logActivity(
        'Task assigned to Virtual HR',
        `Assigned '${newTask.title}' for ${newTask.candidateName}`,
        'task',
        'Assigned'
      );

      addToast({
        type: 'success',
        title: 'Task Assigned',
        message: `Task "${newTask.title}" has been assigned to ${newTask.assignedTo}.`,
      });

      return newTask;
    } catch (error) {
      console.error('Task creation failed:', error);

      addToast({
        type: 'error',
        title: 'Task Creation Failed',
        message: 'Unable to create the task.',
      });

      return null;
    }
  },
  [addToast, logActivity]
);

  const updateTaskStatus = useCallback(
  async (taskId: string, newStatus: TaskStatus) => {
    try {
      const backendTaskId = Number(taskId);

      // Existing demo/local task
      if (Number.isNaN(backendTaskId)) {
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id !== taskId) return t;

            const progress =
              newStatus === 'Completed'
                ? 100
                : newStatus === 'In Progress'
                ? 50
                : 0;

            return {
              ...t,
              status: newStatus,
              progress,
            };
          })
        );

        return;
      }

      // Backend task
      const response = await fetch(
        `${API_URL}/tasks/${backendTaskId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail || 'Failed to update task'
        );
      }

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;

          const progress =
            newStatus === 'Completed'
              ? 100
              : newStatus === 'In Progress'
              ? 50
              : 0;

          return {
            ...t,
            status: newStatus,
            progress,
          };
        })
      );

      const target = tasks.find((t) => t.id === taskId);

      if (target) {
        logActivity(
          'Virtual HR updated task status',
          `Moved '${target.title}' to ${newStatus}`,
          'ai',
          newStatus
        );

        addToast({
          type: 'info',
          title: 'Task Status Updated',
          message: `Task is now marked as ${newStatus}.`,
        });
      }

    } catch (error) {
      console.error('Task status update failed:', error);

      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Unable to update the task status.',
      });
    }
  },
  [tasks, addToast, logActivity]
);
  const deleteTask = useCallback(
  async (taskId: string) => {
    try {
      const backendTaskId = Number(taskId);

      // Existing demo/local task
      if (Number.isNaN(backendTaskId)) {
        setTasks((prev) =>
          prev.filter((t) => t.id !== taskId)
        );

        addToast({
          type: 'info',
          title: 'Task Removed',
          message: 'Task was removed from the workspace queue.',
        });

        return;
      }

      // Backend task
      const response = await fetch(
        `${API_URL}/tasks/${backendTaskId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || 'Failed to delete task'
        );
      }

      setTasks((prev) =>
        prev.filter((t) => t.id !== taskId)
      );

      addToast({
        type: 'info',
        title: 'Task Removed',
        message: 'Task was deleted successfully.',
      });

    } catch (error) {
      console.error('Task deletion failed:', error);

      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Unable to delete the task.',
      });
    }
  },
  [addToast]
);

  // Candidate actions
  // Candidate actions
const addCandidate = useCallback(
  async (data: {
    name: string;
    email: string;
    phone: string;
    appliedFor: string;
    skills: string[];
    experience: string;
    notes?: string;
  }) => {
    try {
      const response = await fetch(`${API_URL}/candidates/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          position: data.appliedFor,
          experience: data.experience,
          skills: data.skills.join(', '),
          resume: '',
          notes: data.notes || '',
          match_score: 0,
          status: 'Applied',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create candidate');
      }

      const createdCandidate = await response.json();

      const newCand: Candidate = {
        id: String(createdCandidate.id),
        name: createdCandidate.name,
        email: createdCandidate.email,
        phone: createdCandidate.phone || '',
        appliedFor: createdCandidate.position,
        status: createdCandidate.status || 'New',
        interviewStatus: 'Reviewing application',
        experience: data.experience,
        matchScore: 0,
        appliedDate: 'Just now',
        skills: data.skills || [],
        resumeSnippet: createdCandidate.resume || '',
        notes: data.notes || 'Inbound candidate submission.',
      };

      setCandidates((prev) => [newCand, ...prev]);

      logActivity(
        'Candidate added',
        `Added '${newCand.name}' for ${newCand.appliedFor}`,
        'candidate',
        'Added'
      );

      addToast({
        type: 'success',
        title: 'Candidate Added',
        message: `${newCand.name} has been added successfully.`,
      });

      return newCand;
    } catch (error) {
      console.error('Candidate creation failed:', error);

      addToast({
        type: 'error',
        title: 'Add Candidate Failed',
        message: 'Unable to add the candidate.',
      });

      throw error;
    }
  },
  [addToast, logActivity]
);
  const updateCandidateStatus = useCallback(
  async (candidateId: string, newStatus: CandidateStatus) => {
    try {
      const backendCandidateId = Number(candidateId);

      if (Number.isNaN(backendCandidateId)) {
        throw new Error("Invalid candidate ID");
      }

      const response = await fetch(
        `${API_URL}/candidates/${backendCandidateId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || "Failed to update candidate status"
        );
      }

      const updatedCandidate = await response.json();

      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidateId
            ? {
                ...c,
                status: updatedCandidate.status,
              }
            : c
        )
      );

      const cand = candidates.find((c) => c.id === candidateId);

      if (cand) {
        logActivity(
          "Candidate status updated",
          `${cand.name} moved to ${newStatus}`,
          "candidate",
          newStatus
        );

        addToast({
          type: "info",
          title: "Candidate Updated",
          message: `${cand.name} moved to ${newStatus}.`,
        });
      }
    } catch (error) {
      console.error("Candidate status update failed:", error);

      addToast({
        type: "error",
        title: "Update Failed",
        message: "Unable to update candidate status.",
      });
    }
  },
  [candidates, addToast, logActivity]
);

  // Interview actions
 const scheduleInterview = useCallback(
  async (data: {
    candidateId: string;
    candidateName: string;
    position: string;
    date: string;
    time: string;
    mode: InterviewMode;
    notes?: string;
  }) => {
    try {
      const backendCandidateId = Number(data.candidateId);

      if (Number.isNaN(backendCandidateId)) {
        throw new Error("Invalid candidate ID");
      }

      // Convert Today/Tomorrow/date + time into backend datetime
      let interviewDate = new Date();

      const lowerDate = data.date.toLowerCase();

      if (lowerDate.includes("tomorrow")) {
        interviewDate.setDate(interviewDate.getDate() + 1);
      } else if (!lowerDate.includes("today")) {
        const parsedDate = new Date(data.date);

        if (!Number.isNaN(parsedDate.getTime())) {
          interviewDate = parsedDate;
        }
      }

      // Convert time like "11:00 AM"
      const timeMatch = data.time.match(
        /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
      );

      if (timeMatch) {
        let hours = Number(timeMatch[1]);
        const minutes = Number(timeMatch[2]);
        const period = timeMatch[3].toUpperCase();

        if (period === "PM" && hours !== 12) {
          hours += 12;
        }

        if (period === "AM" && hours === 12) {
          hours = 0;
        }

        interviewDate.setHours(hours, minutes, 0, 0);
      }

      const response = await fetch(`${API_URL}/interviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidate_id: backendCandidateId,
          interview_date: interviewDate.toISOString(),
          interviewer: "Virtual HR + Hiring Lead",
          mode: data.mode,
          status: "Scheduled",
          notes: data.notes || "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail || "Failed to schedule interview"
        );
      }

      const backendInterview = await response.json();

      const newInterview: Interview = {
        id: String(backendInterview.id),
        candidateId: String(backendInterview.candidate_id),
        candidateName: data.candidateName,
        position: data.position,
        date: data.date,
        time: data.time,
        mode: data.mode,
        status: backendInterview.status || "Scheduled",
        interviewer:
          backendInterview.interviewer || "Virtual HR + Hiring Lead",
        notes: backendInterview.notes || data.notes,
      };

      setInterviews((prev) => [newInterview, ...prev]);

      // Update candidate status locally
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === data.candidateId
            ? {
                ...c,
                status: "Interview" as CandidateStatus,
                interviewStatus: `${data.mode} interview on ${data.date} at ${data.time}`,
              }
            : c
        )
      );

      logActivity(
        "Virtual HR scheduled an interview",
        `${data.candidateName} — ${data.position} (${data.mode} Mode)`,
        "interview",
        "Scheduled"
      );

      addToast({
        type: "success",
        title: "Interview Scheduled",
        message: `${data.mode} interview for ${data.candidateName} on ${data.date} at ${data.time} scheduled successfully.`,
      });

      return newInterview;
    } catch (error) {
      console.error("Interview scheduling failed:", error);

      addToast({
        type: "error",
        title: "Interview Scheduling Failed",
        message: "Unable to schedule the interview.",
      });

      return null;
    }
  },
  [addToast, logActivity]
);

  const updateInterviewStatus = useCallback(
    (interviewId: string, newStatus: InterviewStatus) => {
      setInterviews((prev) =>
        prev.map((i) => (i.id === interviewId ? { ...i, status: newStatus } : i))
      );
      const target = interviews.find((i) => i.id === interviewId);
      if (target) {
        logActivity(
          'Interview status updated',
          `${target.candidateName} — Interview is now ${newStatus}`,
          'interview',
          newStatus
        );
        addToast({
          type: 'info',
          title: 'Interview Status',
          message: `Interview marked as ${newStatus}.`,
        });
      }
    },
    [interviews, addToast, logActivity]
  );

  // AI Chat and Interactive Commands
  const sendUserChatMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      const userMsg: ChatMessage = {
        id: `MSG-${Date.now()}`,
        sender: 'user',
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, userMsg]);
      setAiStatus('processing');

      // Intelligent natural language handling for demo employer
      const lower = text.toLowerCase();

      setTimeout(async () => {
        setAiStatus('online');

        if (lower.includes('schedule') && (lower.includes('rahul') || lower.includes('interview'))) {
          // Trigger interview scheduling flow
          if (lower.includes('video') || lower.includes('voice') || lower.includes('chat')) {
            const mode: InterviewMode = lower.includes('voice')
              ? 'Voice'
              : lower.includes('chat')
              ? 'Chat'
              : 'Video';

            const created = await scheduleInterview({
              candidateId: 'CAN-001',
              candidateName: 'Rahul Sharma',
              position: 'Python Developer',
              date: 'Tomorrow',
              time: '11:00 AM',
              mode,
            });
            
            if (!created) {
              return;
            }

            const aiResponse: ChatMessage = {
              id: `MSG-${Date.now() + 1}`,
              sender: 'ai',
              text: `Done! I've scheduled Rahul Sharma's interview for tomorrow at 11:00 AM. Calendar invite and preparation dossier have been automatically sent.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              actionCard: {
                type: 'interview_confirm',
                candidate: 'Rahul Sharma',
                position: 'Python Developer',
                date: 'Tomorrow',
                time: '11:00 AM',
                mode,
                interviewId: created.id,
              },
            };
            setChatMessages((prev) => [...prev, aiResponse]);
          } else {
            const aiResponse: ChatMessage = {
              id: `MSG-${Date.now() + 1}`,
              sender: 'ai',
              text: `Sure. I found Rahul Sharma in your candidate list (Python Developer, 94% match). What interview mode would you like?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                modeOptions: true,
            };
            setChatMessages((prev) => [...prev, aiResponse]);
         }
        }
        else if (lower.includes('assign') || lower.includes('task')) {
          const newTask = await addTask({
            title: 'Review candidate profiles for engineering',
            description: 'Automated AI scoring and profile summarization.',
            candidateName: 'Priya Mehta',
            candidateId: 'CAN-002',
            priority: 'High',
            assignedTo: 'Virtual HR',
            dueDate: 'Tomorrow',
          });
          if (newTask) {
            const aiResponse: ChatMessage = {
              id: `MSG-${Date.now() + 1}`,
              sender: 'ai',
              text: `Task assigned successfully! I have added "${newTask.title}" to my priority queue and will begin processing immediately.`,
              timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              actionCard: {
                type: 'task_confirm',
                taskTitle: newTask.title,
                candidate: newTask.candidateName,
                priority: newTask.priority,
              },
            };
            setChatMessages((prev) => [...prev, aiResponse]);
        } else if (lower.includes('pending') || lower.includes('tasks')) {
          const pendingTasks = tasks.filter((t) => t.status !== 'Completed');
          const aiResponse: ChatMessage = {
            id: `MSG-${Date.now() + 1}`,
            sender: 'ai',
            text: `You currently have ${pendingTasks.length} pending tasks. I am actively screening resumes and coordinating 2 interview schedules. Would you like me to expedite the high-priority screenings?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            quickReplies: ['Yes, expedite high priority', 'Schedule an interview', 'View all tasks'],
          };
          setChatMessages((prev) => [...prev, aiResponse]);
        }
        } else if (lower.includes('add candidate') || lower.includes('candidate')) {
          const aiResponse: ChatMessage = {
            id: `MSG-${Date.now() + 1}`,
            sender: 'ai',
            text: `You can add a candidate manually using the "+ Add Candidate" button, or I can import an applicant from an inbound resume PDF. Would you like to open the candidate registration form?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            quickReplies: ['Open Add Candidate modal', 'Show Candidate List'],
          };
          setChatMessages((prev) => [...prev, aiResponse]);
        } else {
          // General friendly helpful response
          const aiResponse: ChatMessage = {
            id: `MSG-${Date.now() + 1}`,
            sender: 'ai',
            text: `Understood. I am tracking 24 recruitment operations. You can ask me to schedule interviews, check candidates like Rahul Sharma or Priya Mehta, or assign new tasks to my queue.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            quickReplies: ['Schedule an interview', 'Assign a task', 'View pending tasks'],
          };
          setChatMessages((prev) => [...prev, aiResponse]);
        }
      }, 700);
    },
    [tasks, scheduleInterview, addTask]
  );

  const triggerAIAction = useCallback(
    (actionType: string, payload?: any) => {
      if (actionType === 'select_mode') {
        const mode = payload as InterviewMode;
        sendUserChatMessage(`${mode} interview`);
      } else if (actionType === 'open_task_modal') {
        setIsTaskModalOpen(true);
      } else if (actionType === 'open_interview_modal') {
        setIsInterviewModalOpen(true);
      } else if (actionType === 'open_candidate_modal') {
        setIsAddCandidateModalOpen(true);
      }
    },
    [sendUserChatMessage]
  );

  // Real-time employer visibility simulation (simulates Virtual HR task progress)
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      // Pick an in-progress task and increment its progress slightly
      setTasks((prev) => {
        const inProgress = prev.filter((t) => t.status === 'In Progress');
        if (inProgress.length === 0) return prev;

        const randomIndex = Math.floor(Math.random() * inProgress.length);
        const target = inProgress[randomIndex];
        const newProgress = Math.min(100, (target.progress || 50) + 15);

        if (newProgress >= 100) {
          logActivity(
            'Task completed',
            `Virtual HR completed: '${target.title}'`,
            'task',
            'Completed'
          );
          return prev.map((t) =>
            t.id === target.id ? { ...t, status: 'Completed' as TaskStatus, progress: 100 } : t
          );
        }

        return prev.map((t) =>
          t.id === target.id ? { ...t, progress: newProgress } : t
        );
      });

      // Also gently pulse AI current tasks progress
      setAiWorkingTasks((prev) =>
        prev.map((item) => {
          if (item.status === 'Active') {
            const nextP = item.progress >= 95 ? 65 : item.progress + 5;
            return { ...item, progress: nextP };
          }
          return item;
        })
      );
    }, 12000);

    return () => clearInterval(interval);
  }, [isSimulationRunning, logActivity]);

  return (
    <AppContext.Provider
      value={{
        user,
        tasks,
        candidates,
        interviews,
        activities,
        chatMessages,
        aiWorkingTasks,
        aiStatus,
        toasts,
        isSimulationRunning,
        setIsSimulationRunning,
        selectedCandidate,
        setSelectedCandidate,
        isTaskModalOpen,
        setIsTaskModalOpen,
        isInterviewModalOpen,
        setIsInterviewModalOpen,
        isAddCandidateModalOpen,
        setIsAddCandidateModalOpen,
        addTask,
        updateTaskStatus,
        deleteTask,
        addCandidate,
        updateCandidateStatus,
        scheduleInterview,
        updateInterviewStatus,
        sendUserChatMessage,
        triggerAIAction,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
