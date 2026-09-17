'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Task, TaskStatus } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Search,
  CheckCircle2,
  Clock,
  PlayCircle,
  Trash2,
  Bot,
  User,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

export function TaskTable() {
  const { tasks, updateTaskStatus, deleteTask, candidates, setSelectedCandidate } = useApp();

  const [activeFilter, setActiveFilter] = useState<'All' | TaskStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs: ('All' | TaskStatus)[] = ['All', 'Pending', 'In Progress', 'Completed'];

  const filteredTasks = tasks.filter((t) => {
    const matchesFilter = activeFilter === 'All' || t.status === activeFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCandidateClick = (candidateName: string) => {
    const matched = candidates.find(
      (c) => c.name.toLowerCase() === candidateName.toLowerCase()
    );
    if (matched) {
      setSelectedCandidate(matched);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto">
          {filterTabs.map((tab) => {
            const count =
              tab === 'All' ? tasks.length : tasks.filter((t) => t.status === tab).length;
            const isSelected = activeFilter === tab;

            return (
              <button
                key={tab}
                id={`task-filter-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-slate-800 text-indigo-200' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="task-search-input"
            type="text"
            placeholder="Search tasks, candidate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Task Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-800">No tasks found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No tasks matching "${searchQuery}". Try modifying your search query.`
                : 'No tasks currently exist in this category.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table id="tasks-table" className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Task</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTasks.map((task) => {
                  const isVirtualHR = task.assignedTo.toLowerCase().includes('virtual');

                  return (
                    <tr
                      key={task.id}
                      id={`task-row-${task.id}`}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Task Title & Description */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-semibold text-slate-900 leading-snug">
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="text-slate-500 text-[11px] line-clamp-1 mt-0.5 max-w-md">
                            {task.description}
                          </div>
                        )}
                        {task.progress !== undefined && task.status === 'In Progress' && (
                          <div className="mt-1.5 flex items-center gap-2 max-w-[160px]">
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {task.progress}%
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Candidate */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleCandidateClick(task.candidateName)}
                          className="font-medium text-slate-700 hover:text-indigo-600 hover:underline flex items-center gap-1 group/cand"
                        >
                          <span>{task.candidateName}</span>
                          {candidates.some(
                            (c) => c.name.toLowerCase() === task.candidateName.toLowerCase()
                          ) && (
                            <ExternalLink className="w-3 h-3 text-slate-400 group-hover/cand:text-indigo-600 opacity-0 group-hover/cand:opacity-100 transition-opacity" />
                          )}
                        </button>
                      </td>

                      {/* Assigned To */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100/80 border border-slate-200/50 text-slate-700 font-medium">
                          {isVirtualHR ? (
                            <Bot className="w-3.5 h-3.5 text-indigo-600" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          <span>{task.assignedTo}</span>
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={task.priority} type="priority" />
                      </td>

                      {/* Status with quick change dropdown */}
                      <td className="py-3.5 px-4">
                        <div className="relative inline-block group/status">
                          <select
                            id={`task-status-select-${task.id}`}
                            value={task.status}
                            onChange={(e) =>
                              updateTaskStatus(task.id, e.target.value as TaskStatus)
                            }
                            className="text-xs font-medium pl-2 pr-6 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900 cursor-pointer hover:border-slate-300"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {task.dueDate}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <button
                          type="button"
                          id={`task-delete-btn-${task.id}`}
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-70 group-hover:opacity-100"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
