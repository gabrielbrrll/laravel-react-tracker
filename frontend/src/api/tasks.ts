import apiClient from './axios'

import type {
  Task,
  TaskStatistics,
  TaskFilters,
  PaginatedResponse,
} from './types'

export const tasksAPI = {
  // Get all tasks with filters
  getTasks: async (filters?: TaskFilters): Promise<PaginatedResponse<Task>> => {
    const response = await apiClient.get<PaginatedResponse<Task>>('/tasks', {
      params: filters,
    })
    return response.data
  },

  // Get single task by ID
  getTask: async (id: number): Promise<Task> => {
    const response = await apiClient.get<Task>(`/tasks/${id}`)
    return response.data
  },

  // Create new task
  createTask: async (
    data: Omit<Task, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Task> => {
    const response = await apiClient.post<Task>('/tasks', data)
    return response.data
  },

  // Update existing task
  updateTask: async (
    id: number,
    data: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Task> => {
    const response = await apiClient.put<Task>(`/tasks/${id}`, data)
    return response.data
  },

  // Delete task
  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`)
  },

  // Get task statistics
  getStatistics: async (): Promise<TaskStatistics> => {
    const response = await apiClient.get<TaskStatistics>('/tasks/statistics')
    return response.data
  },
}
