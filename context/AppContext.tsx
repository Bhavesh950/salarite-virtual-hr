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
  positions: string[];
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
 }) => Promise<Candidate | null>;

 updateCandidateStatus: (
  candidateId: string,
  newStatus: CandidateStatus
) => Promise<void>;

  updateCandidate: (
  candidateId: string,
  data: {
    name: string;
    email: string;
    phone: string;
    position: string;
    experience: string;
    skills: string;
    notes: string;
  }
) => Promise<boolean>;

deleteCandidate: (candidateId: string) => Promise<boolean>;

 scheduleInterview: (data: {
  candidateId: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  mode: InterviewMode;
  notes?: string;
}) => Promise<Interview | null>;

updateInterview: (
  interviewId: string,
  data: {
    candidate_id: number;
    interview_date: string;
    mode: InterviewMode;
    status: InterviewStatus;
    notes?: string;
    position: string;
  }
) => Promise<any>;
  deleteInterview: (interviewId: string) => Promise<void>;
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
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
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
    try {
      // =========================
      // LOAD ALL DATA
      // =========================
      const [tasksRes, candidatesRes, interviewsRes , positionsRes] = await Promise.all([
        fetch(`${API_URL}/tasks/`),
        fetch(`${API_URL}/candidates/`),
        fetch(`${API_URL}/interviews/`),
        fetch(`${API_URL}/positions/`)
      ]);

      if (!tasksRes.ok) {
        throw new Error("Failed to fetch tasks");
      }

      if (!candidatesRes.ok) {
        throw new Error("Failed to fetch candidates");
      }

      if (!interviewsRes.ok) {
        throw new Error("Failed to fetch interviews");
      }

      const tasksData = await tasksRes.json();
      const candidatesData = await candidatesRes.json();
      const interviewsData = await interviewsRes.json();
      const positionsData = await positionsRes.json();
      setPositions(positionsData);

      console.log("Tasks from API:", tasksData);
      console.log("Candidates from API:", candidatesData);
      console.log("Interviews from API:", interviewsData);

      // =========================
      // SET TASKS
      // =========================
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

      // =========================
      // SET CANDIDATES
      // =========================
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

      // =========================
      // SET INTERVIEWS
      // =========================
      setInterviews(
        interviewsData.map((i: any) => {
          const candidate = candidatesData.find(
            (c: any) => String(c.id) === String(i.candidate_id)
          );

          const interviewDate = new Date(i.interview_date);

          return {
            id: String(i.id),
            candidateId: String(i.candidate_id),
            candidateName: candidate?.name || "Unknown Candidate",
            position: i.position || candidate?.position || "Unknown Position",

            date: interviewDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),

            time: interviewDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),

            mode: i.mode,
            status: i.status,
            interviewer: i.interviewer || "Virtual HR",
            notes: i.notes || "",
          };
        })
      );

    } catch (error) {
      console.error("API Load Error:", error);
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
  const errorData = await response.json().catch(() => null);

  throw new Error(
    errorData?.detail || 'Failed to create candidate'
  );
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
  console.error("Candidate creation failed:", error);

  const errorMessage =
    error instanceof Error
      ? error.message
      : "Unable to add the candidate.";

  const isDuplicate =
    errorMessage.toLowerCase().includes("already exists") ||
    errorMessage.toLowerCase().includes("email");

  addToast({
    type: "info",
    title: isDuplicate
      ? "Candidate Already Exists"
      : "Unable to Add Candidate",
    message: isDuplicate
      ? "A candidate with this email address is already registered."
      : errorMessage,
  });

  return null;
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

const updateCandidate = useCallback(
  async (
    candidateId: string,
    data: {
      name: string;
      email: string;
      phone: string;
      position: string;
      experience: string;
      skills: string;
      notes: string;
    }
  ) => {
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
            name: data.name,
            email: data.email,
            phone: data.phone,
            position: data.position,
            experience: data.experience,
            skills: data.skills,
            notes: data.notes,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail || "Failed to update candidate"
        );
      }

      const updatedCandidate = await response.json();

      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidateId
            ? {
                ...c,
                name: updatedCandidate.name,
                email: updatedCandidate.email,
                phone: updatedCandidate.phone || "",
                appliedFor: updatedCandidate.position,
                experience: updatedCandidate.experience || "",
                skills: updatedCandidate.skills
                  ? updatedCandidate.skills
                      .split(",")
                      .map((s: string) => s.trim())
                      .filter(Boolean)
                  : [],
                notes: updatedCandidate.notes || "",
              }
            : c
        )
      );

      addToast({
        type: "success",
        title: "Candidate Updated",
        message: `${updatedCandidate.name} updated successfully.`,
      });

      return true;
    } catch (error) {
      console.error("Candidate update failed:", error);

      addToast({
        type: "error",
        title: "Update Failed",
        message:
          error instanceof Error
            ? error.message
            : "Unable to update candidate.",
      });

      return false;
    }
  },
  [addToast]
);


const deleteCandidate = useCallback(
  async (candidateId: string) => {
    try {
      const backendCandidateId = Number(candidateId);

      if (Number.isNaN(backendCandidateId)) {
        throw new Error("Invalid candidate ID");
      }

      const response = await fetch(
        `${API_URL}/candidates/${backendCandidateId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail || "Failed to delete candidate"
        );
      }

      setCandidates((prev) =>
        prev.filter((c) => c.id !== candidateId)
      );

      setSelectedCandidate(null);

      addToast({
        type: "success",
        title: "Candidate Deleted",
        message: "Candidate deleted successfully.",
      });

      return true;
    } catch (error) {
      console.error("Candidate deletion failed:", error);

      addToast({
        type: "error",
        title: "Delete Failed",
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete candidate.",
      });

      return false;
    }
  },
  [addToast]
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
      // -----------------------------------------
      // 1. Convert frontend candidate ID to DB ID
      // -----------------------------------------
      const backendCandidateId = Number(data.candidateId);

      if (Number.isNaN(backendCandidateId)) {
        throw new Error("Invalid candidate ID");
      }

      // -----------------------------------------
      // 2. Convert date + time into datetime
      // -----------------------------------------
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

      // -----------------------------------------
      // 3. Create Interview in backend
      // -----------------------------------------
      const interviewResponse = await fetch(
        `${API_URL}/interviews/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            candidate_id: backendCandidateId,
            position: data.position,
            interview_date: `${interviewDate.getFullYear()}-${String(
              interviewDate.getMonth() + 1
            ).padStart(2, "0")}-${String(interviewDate.getDate()).padStart(2, "0")}T${String(
              interviewDate.getHours()
            ).padStart(2, "0")}:${String(interviewDate.getMinutes()).padStart(2, "0")}:00`,
            interviewer: "Virtual HR + Hiring Lead",
            mode: data.mode,
            status: "Scheduled",
            notes: data.notes || "",
          }),
        }
      );

      if (!interviewResponse.ok) {
        const errorData = await interviewResponse
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail || "Failed to schedule interview"
        );
      }

      const backendInterview = await interviewResponse.json();

      // -----------------------------------------
      // 4. Update Candidate status in BACKEND
      // -----------------------------------------
      const candidateResponse = await fetch(
        `${API_URL}/candidates/${backendCandidateId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Interview",
          }),
        }
      );

      if (!candidateResponse.ok) {
        const errorData = await candidateResponse
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail || "Interview created but candidate status update failed"
        );
      }

      // -----------------------------------------
      // 5. Create frontend Interview object
      // -----------------------------------------
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
          backendInterview.interviewer ||
          "Virtual HR + Hiring Lead",
        notes: backendInterview.notes || data.notes || "",
      };

      // -----------------------------------------
      // 6. Update Interviews UI
      // -----------------------------------------
      setInterviews((prev) => [newInterview, ...prev]);

      // -----------------------------------------
      // 7. Update Candidate UI
      // -----------------------------------------
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

      // -----------------------------------------
      // 8. Activity log
      // -----------------------------------------
      logActivity(
        "Virtual HR scheduled an interview",
        `${data.candidateName} — ${data.position} (${data.mode} Mode)`,
        "interview",
        "Scheduled"
      );

      // -----------------------------------------
      // 9. Success toast
      // -----------------------------------------
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
        message:
          error instanceof Error
            ? error.message
            : "Unable to schedule the interview.",
      });

      return null;
    }
  },
  [addToast, logActivity]
);

const updateInterview = useCallback(
  async (
    interviewId: string,
    data: {
      candidate_id: number;
      interview_date: string;
      mode: InterviewMode;
      status: InterviewStatus;
      notes?: string;
      position: string;
    }
  ) => {
    try {
      // =========================
      // 1. UPDATE INTERVIEW
      // =========================
      const response = await fetch(
        `${API_URL}/interviews/${Number(interviewId)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            candidate_id: data.candidate_id,
            interview_date: data.interview_date,
            position: data.position,
            mode: data.mode,
            status: data.status,
            notes: data.notes || "",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || "Failed to update interview"
        );
      }

      const updated = await response.json();

      // =========================
      // 2. FIND NEW CANDIDATE
      // =========================
      const candidate = candidates.find(
        (c) => String(c.id) === String(data.candidate_id)
      );

      // =========================
      // 3. UPDATE POSITION
      // =========================
      // Position belongs to Candidate, not Interview.
      // If the position was edited, update candidate position too.
      if (candidate) {
        const candidateUpdateResponse = await fetch(
          `${API_URL}/candidates/${Number(data.candidate_id)}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              position: candidate.appliedFor,
            }),
          }
        );

        // We don't fail the whole interview update if
        // candidate position is already the same.
        if (!candidateUpdateResponse.ok) {
          console.warn("Candidate position update failed");
        }
      }

      // =========================
      // 4. UPDATE LOCAL INTERVIEW
      // =========================
      const updatedDate = new Date(data.interview_date);

      setInterviews((prev) =>
  prev.map((i) =>
    i.id === interviewId
      ? {
          ...i,
          candidateId: String(updated.candidate_id),
          position: updated.position || i.position,
          mode: updated.mode,
          status: updated.status,
          notes: updated.notes || "",
          date: new Date(updated.interview_date).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          ),
          time: new Date(updated.interview_date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }
      : i
  )
);

      // =========================
      // 5. UPDATE LOCAL CANDIDATE
      // =========================
      if (candidate) {
  setCandidates((prev) =>
    prev.map((c) =>
      c.id === String(data.candidate_id)
        ? {
            ...c,
            appliedFor: data.position,
          }
        : c
    )
  );
}

      addToast({
        type: "success",
        title: "Interview Updated",
        message: "Interview details updated successfully.",
      });

      return updated;
    } catch (error) {
      console.error("Interview update failed:", error);

      addToast({
        type: "error",
        title: "Update Failed",
        message: "Unable to update interview.",
      });

      return null;
    }
  },
  [candidates, addToast]
);

const deleteInterview = useCallback(
  async (interviewId: string) => {
    try {
      const response = await fetch(
        `${API_URL}/interviews/${Number(interviewId)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete interview");
      }

      setInterviews((prev) =>
        prev.filter((i) => i.id !== interviewId)
      );

      addToast({
        type: "success",
        title: "Interview Deleted",
        message: "Interview deleted successfully.",
      });
    } catch (error) {
      console.error("Interview deletion failed:", error);

      addToast({
        type: "error",
        title: "Delete Failed",
        message: "Unable to delete interview.",
      });
    }
  },
  [addToast]
);

  const updateInterviewStatus = useCallback(
  async (interviewId: string, newStatus: InterviewStatus) => {
    try {
      // 1. Update backend/database
      const response = await fetch(
        `${API_URL}/interviews/${Number(interviewId)}`,
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
          errorData?.detail || "Failed to update interview status"
        );
      }

      // 2. Update frontend state
      setInterviews((prev) =>
        prev.map((i) =>
          i.id === interviewId
            ? { ...i, status: newStatus }
            : i
        )
      );

      // 3. Activity + toast
      const target = interviews.find((i) => i.id === interviewId);

      if (target) {
        logActivity(
          "Interview status updated",
          `${target.candidateName} — Interview is now ${newStatus}`,
          "interview",
          newStatus
        );

        addToast({
          type: "success",
          title: "Interview Status Updated",
          message: `Interview marked as ${newStatus}.`,
        });
      }
    } catch (error) {
      console.error("Interview status update failed:", error);

      addToast({
        type: "error",
        title: "Status Update Failed",
        message:
          error instanceof Error
            ? error.message
            : "Unable to update interview status.",
      });
    }
  },
  [interviews, addToast, logActivity]
);

  const sendUserChatMessage = useCallback(
    (text: string) => {
      const userMessage: ChatMessage = {
        id: `MSG-${Date.now()}`,
        sender: 'user',
        text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setChatMessages((prev) => [...prev, userMessage]);
      setAiStatus('processing');

      const lower = text.toLowerCase();

      setTimeout(() => {
        setAiStatus('online');

        let aiResponse: ChatMessage;

        if (lower.includes('interview')) {
          aiResponse = {
            id: `MSG-${Date.now() + 1}`,
            sender: 'ai',
            text: `Sure. I can help you schedule and manage candidate interviews. Please select the interview mode you want.`,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        } else if (lower.includes('task')) {
          aiResponse = {
            id: `MSG-${Date.now() + 1}`,
            sender: 'ai',
            text: `I can help you create and manage recruitment tasks. You can open the task form to assign a new task.`,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        } else if (lower.includes('candidate')) {
          aiResponse = {
            id: `MSG-${Date.now() + 1}`,
            sender: 'ai',
            text: `I can help you manage candidates, review profiles, and update candidate status.`,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        } else {
          aiResponse = {
            id: `MSG-${Date.now() + 1}`,
            sender: 'ai',
            text: `I'm ready to help with candidates, tasks, and interviews.`,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        }

        setChatMessages((prev) => [...prev, aiResponse]);
      }, 700);
    },
    []
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
        positions,
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
        updateInterview,
        updateCandidate,
        deleteCandidate,  
        deleteInterview
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
