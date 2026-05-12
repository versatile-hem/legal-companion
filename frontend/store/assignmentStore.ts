import { create } from 'zustand';
import { Assignment, Task } from '@/types/assignment';
import { apiClient } from '@/lib/api';

export interface FilterState {
  status: string[];
  assignmentType: string[];
  priority: string[];
  dueDate: { from?: Date; to?: Date };
  assignee?: string;
  search: string;
}

export type SortOption = 'dueDate' | 'priority' | 'recent' | 'created' | 'modified' | 'riskScore';

export interface AssignmentStore {
  // List state
  assignments: Assignment[];
  filters: FilterState;
  sortBy: SortOption;
  isLoading: boolean;
  error?: string;

  // Modal state
  modalOpen: boolean;
  currentAssignment?: Assignment;
  draftAssignment: Partial<Assignment>;
  unsavedChanges: boolean;

  // AI state
  aiSuggestions: Array<{
    id: string;
    name: string;
    estimatedHours: number;
    assigneeRole?: string;
  }>;
  aiLoading: boolean;
  riskScore: number;
  estimatedTimeline?: {
    days: number;
    completionDate: Date;
    confidence: number;
  };

  // Pagination
  page: number;
  pageSize: number;
  total: number;

  // Actions
  fetchAssignments: () => Promise<void>;
  setFilter: (key: keyof FilterState, value: any) => void;
  clearFilters: () => void;
  setSortBy: (sort: SortOption) => void;
  openCreateModal: () => void;
  closeModal: () => void;
  updateDraft: (partial: Partial<Assignment>) => void;
  saveAssignment: (assignment: Assignment) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  fetchAISuggestions: (assignment: Partial<Assignment>) => Promise<void>;
  setPage: (page: number) => void;
}

const defaultFilters: FilterState = {
  status: [],
  assignmentType: [],
  priority: [],
  dueDate: {},
  search: '',
};

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  assignments: [],
  filters: defaultFilters,
  sortBy: 'dueDate',
  isLoading: false,
  modalOpen: false,
  draftAssignment: {},
  unsavedChanges: false,
  aiSuggestions: [],
  aiLoading: false,
  riskScore: 0,
  page: 1,
  pageSize: 20,
  total: 0,

  setFilter: (key, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
      page: 1, // Reset to first page when filters change
    }));
  },

  clearFilters: () => {
    set({
      filters: defaultFilters,
      page: 1,
    });
  },

  setSortBy: (sort) => {
    set({ sortBy: sort });
  },

  openCreateModal: () => {
    set({
      modalOpen: true,
      draftAssignment: {},
      unsavedChanges: false,
    });
  },

  closeModal: () => {
    set({
      modalOpen: false,
      draftAssignment: {},
      unsavedChanges: false,
    });
  },

  updateDraft: (partial) => {
    set((state) => ({
      draftAssignment: {
        ...state.draftAssignment,
        ...partial,
      },
      unsavedChanges: true,
    }));
  },

  setPage: (page) => {
    set({ page });
  },

  fetchAssignments: async () => {
    set({ isLoading: true, error: undefined });
    try {
      const { filters, sortBy, page, pageSize } = get();

      // Build query params
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', pageSize.toString());
      params.append('sort', sortBy);

      if (filters.status.length > 0) {
        filters.status.forEach((s) => params.append('status', s));
      }
      if (filters.assignmentType.length > 0) {
        filters.assignmentType.forEach((t) => params.append('type', t));
      }
      if (filters.priority.length > 0) {
        filters.priority.forEach((p) => params.append('priority', p));
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      const response = await apiClient.get(`/assignments?${params.toString()}`);

      set({
        assignments: response.data.data || [],
        total: response.data.total || 0,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch assignments',
        isLoading: false,
      });
    }
  },

  saveAssignment: async (assignment: Assignment) => {
    try {
      const isNew = !assignment.id;
      
      let response;
      if (isNew) {
        response = await apiClient.post('/assignments', assignment);
      } else {
        response = await apiClient.patch(`/assignments/${assignment.id}`, assignment);
      }

      const data = response.data.data || response.data;

      // Update local state
      set((state) => {
        const updated = [...state.assignments];
        if (isNew) {
          updated.unshift(data);
          return { assignments: updated, draftAssignment: {}, unsavedChanges: false };
        } else {
          const index = updated.findIndex((a) => a.id === assignment.id);
          if (index >= 0) {
            updated[index] = data;
          }
          return { assignments: updated, draftAssignment: {}, unsavedChanges: false };
        }
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to save assignment',
      });
      throw error;
    }
  },

  deleteAssignment: async (id: string) => {
    try {
      await apiClient.delete(`/assignments/${id}`);

      set((state) => ({
        assignments: state.assignments.filter((a) => a.id !== id),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete assignment',
      });
      throw error;
    }
  },

  fetchAISuggestions: async (assignment: Partial<Assignment>) => {
    set({ aiLoading: true });
    try {
      const response = await apiClient.post('/ai/suggestions', {
        assignmentType: assignment.assignmentType,
        clientId: assignment.clientId,
        context: assignment.description,
      });

      set({
        aiSuggestions: response.data.tasks || [],
        riskScore: response.data.riskScore || 0,
        estimatedTimeline: response.data.timeline,
        aiLoading: false,
      });
    } catch (error) {
      console.error('AI suggestions error:', error);
      set({ aiLoading: false });
    }
  },
}));
