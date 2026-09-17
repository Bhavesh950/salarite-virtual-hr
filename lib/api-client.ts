import { Task, Candidate, Interview, ActivityItem, ChatMessage } from '@/types';
import {
  INITIAL_TASKS,
  INITIAL_CANDIDATES,
  INITIAL_INTERVIEWS,
  INITIAL_ACTIVITIES,
  INITIAL_CHAT_MESSAGES,
} from './mock-data';

/**
 * Salarite Virtual HR - API Client
 *
 * Prepared for future FastAPI + MySQL backend integration.
 * In production/real mode, these methods point to `/api/v1/*` endpoints.
 * Currently backed by in-memory mock repository with simulated async latency.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
const SIMULATE_LATENCY = 150; // ms

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const apiClient = {
  tasks: {
    async list(): Promise<Task[]> {
      await delay(SIMULATE_LATENCY);
      return [...INITIAL_TASKS];
    },
    async create(payload: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
      await delay(SIMULATE_LATENCY);
      const newTask: Task = {
        ...payload,
        id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };
      return newTask;
    },
    async updateStatus(id: string, status: Task['status']): Promise<{ id: string; status: Task['status'] }> {
      await delay(SIMULATE_LATENCY);
      return { id, status };
    },
    async delete(id: string): Promise<{ success: boolean; id: string }> {
      await delay(SIMULATE_LATENCY);
      return { success: true, id };
    },
  },

  candidates: {
    async list(): Promise<Candidate[]> {
      await delay(SIMULATE_LATENCY);
      return [...INITIAL_CANDIDATES];
    },
    async create(payload: Omit<Candidate, 'id' | 'appliedDate'>): Promise<Candidate> {
      await delay(SIMULATE_LATENCY);
      const newCandidate: Candidate = {
        ...payload,
        id: `CAN-${Math.floor(100 + Math.random() * 900)}`,
        appliedDate: 'Just now',
      };
      return newCandidate;
    },
    async updateStatus(id: string, status: Candidate['status']): Promise<{ id: string; status: Candidate['status'] }> {
      await delay(SIMULATE_LATENCY);
      return { id, status };
    },
  },

  interviews: {
    async list(): Promise<Interview[]> {
      await delay(SIMULATE_LATENCY);
      return [...INITIAL_INTERVIEWS];
    },
    async schedule(payload: Omit<Interview, 'id'>): Promise<Interview> {
      await delay(SIMULATE_LATENCY);
      const newInterview: Interview = {
        ...payload,
        id: `INT-${Math.floor(100 + Math.random() * 900)}`,
      };
      return newInterview;
    },
    async updateStatus(id: string, status: Interview['status']): Promise<{ id: string; status: Interview['status'] }> {
      await delay(SIMULATE_LATENCY);
      return { id, status };
    },
  },

  activities: {
    async list(): Promise<ActivityItem[]> {
      await delay(SIMULATE_LATENCY);
      return [...INITIAL_ACTIVITIES];
    },
    async log(payload: Omit<ActivityItem, 'id' | 'timestamp'>): Promise<ActivityItem> {
      await delay(SIMULATE_LATENCY);
      const newActivity: ActivityItem = {
        ...payload,
        id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: 'Just now',
      };
      return newActivity;
    },
  },

  ai: {
    async chat(message: string, context?: Record<string, unknown>): Promise<{ reply: string; action?: Record<string, unknown> }> {
      await delay(SIMULATE_LATENCY * 2);
      return {
        reply: `Virtual HR received: "${message}". Processed with current recruitment pipeline context.`,
      };
    },
  },
};
