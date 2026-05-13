import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiMethods } from '@/lib/api';
import { Task, TaskDocument, TaskChecklistItem } from '@/types/entities';

// Interfaces for API requests
export interface AddTaskRequest {
  title: string;
  description?: string;
  dueDate?: Date;
  estimatedFee?: number;
  outOfPocketExpense?: number;
  taskCategory?: string;
  taskTemplate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: Date;
  estimatedFee?: number;
  outOfPocketExpense?: number;
  taskCategory?: string;
  taskTemplate?: string;
}

export interface AddChecklistItemRequest {
  name: string;
  order?: number;
}

export interface ToggleChecklistRequest {
  completed: boolean;
}

// Hook for fetching tasks for an assignment
export const useFetchAssignmentTasks = (assignmentId: string | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['assignments', assignmentId, 'tasks'],
    queryFn: () => {
      if (!assignmentId) throw new Error('Assignment ID required');
      return apiMethods.get<Task[]>(`/assignments/${assignmentId}/tasks`);
    },
    enabled: enabled && !!assignmentId,
    staleTime: 1000 * 60 * 5,
  });
};

// Hook for searching task templates
export const useSearchTaskTemplates = (query?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['task-templates', query],
    queryFn: () =>
      apiMethods.get<string[]>(`/assignments/task-templates/search`, {
        params: query ? { query } : {},
      }),
    enabled: enabled,
    staleTime: 1000 * 60 * 10,
  });
};

// Hook for adding a task to an assignment
export const useAddTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assignmentId, data }: { assignmentId: string; data: AddTaskRequest }) =>
      apiMethods.post<Task>(`/assignments/${assignmentId}/tasks`, data),
    onSuccess: (_, { assignmentId }) => {
      queryClient.invalidateQueries({ queryKey: ['assignments', assignmentId, 'tasks'] });
    },
  });
};

// Hook for updating a task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assignmentId, taskId, data }: { assignmentId: string; taskId: string; data: UpdateTaskRequest }) =>
      apiMethods.put<Task>(`/assignments/${assignmentId}/tasks/${taskId}`, data),
    onSuccess: (_, { assignmentId }) => {
      queryClient.invalidateQueries({ queryKey: ['assignments', assignmentId, 'tasks'] });
    },
  });
};

// Hook for deleting a task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assignmentId, taskId }: { assignmentId: string; taskId: string }) =>
      apiMethods.delete(`/assignments/${assignmentId}/tasks/${taskId}`),
    onSuccess: (_, { assignmentId }) => {
      queryClient.invalidateQueries({ queryKey: ['assignments', assignmentId, 'tasks'] });
    },
  });
};

// Hook for uploading a task document
export const useUploadTaskDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      assignmentId,
      taskId,
      file,
      description,
    }: {
      assignmentId: string;
      taskId: string;
      file: File;
      description?: string;
    }) => {
      const formData = new FormData();
      formData.append('file', file);
      if (description) formData.append('description', description);
      
      return apiMethods.post<TaskDocument>(`/assignments/${assignmentId}/tasks/${taskId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: (_, { assignmentId, taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['assignments', assignmentId, 'tasks'] });
    },
  });
};

// Hook for adding a checklist item
export const useAddChecklistItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      assignmentId,
      taskId,
      data,
    }: {
      assignmentId: string;
      taskId: string;
      data: AddChecklistItemRequest;
    }) =>
      apiMethods.post<TaskChecklistItem>(
        `/assignments/${assignmentId}/tasks/${taskId}/checklists`,
        data
      ),
    onSuccess: (_, { assignmentId }) => {
      queryClient.invalidateQueries({ queryKey: ['assignments', assignmentId, 'tasks'] });
    },
  });
};

// Hook for toggling a checklist item
export const useToggleChecklistItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      assignmentId,
      taskId,
      itemId,
      data,
    }: {
      assignmentId: string;
      taskId: string;
      itemId: string;
      data: ToggleChecklistRequest;
    }) =>
      apiMethods.patch<TaskChecklistItem>(
        `/assignments/${assignmentId}/tasks/${taskId}/checklists/${itemId}`,
        data
      ),
    onSuccess: (_, { assignmentId }) => {
      queryClient.invalidateQueries({ queryKey: ['assignments', assignmentId, 'tasks'] });
    },
  });
};
