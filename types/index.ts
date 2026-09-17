export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type CandidateStatus = 'New' | 'Screening' | 'Interview' | 'Selected' | 'Rejected';
export type InterviewMode = 'Voice' | 'Video' | 'Chat';
export type InterviewStatus = 'Confirmed' | 'Scheduled' | 'Completed' | 'In Progress' | 'Cancelled';

export interface Task {
  id: string;
  title: string;
  description: string;
  candidateName: string;
  candidateId?: string;
  assignedTo: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  progress?: number;
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedFor: string;
  status: CandidateStatus;
  interviewStatus?: string;
  experience: string;
  matchScore: number;
  appliedDate: string;
  skills: string[];
  resumeSnippet: string;
  notes: string;
  interviewHistory?: {
    id: string;
    date: string;
    mode: InterviewMode;
    result: string;
  }[];
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  mode: InterviewMode;
  status: InterviewStatus;
  notes?: string;
  interviewer: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  type: 'interview' | 'task' | 'candidate' | 'ai';
  status?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionCard?: {
    type: 'interview_confirm' | 'task_confirm' | 'mode_select' | 'candidate_select';
    candidate?: string;
    position?: string;
    date?: string;
    time?: string;
    mode?: InterviewMode;
    taskTitle?: string;
    priority?: TaskPriority;
    interviewId?: string;
  };
  modeOptions?: boolean;
  quickReplies?: string[];
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
}
