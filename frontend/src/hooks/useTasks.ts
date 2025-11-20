import { useState, useCallback } from 'react'

import { tasksAPI } from '@/api/tasks'

import type { Task, TaskFilters, TaskStatistics } from '@/api/types'

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [statistics, setStatistics] = useState<TaskStatistics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async (filters?: TaskFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await tasksAPI.getTasks(filters)
      setTasks(response.data)
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || 'Failed to fetch tasks'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStatistics = useCallback(async () => {
    try {
      const stats = await tasksAPI.getStatistics()
      setStatistics(stats)
    } catch (err) {
      console.error('Failed to fetch statistics:', err)
    }
  }, [])

  const createTask = async (
    data: Omit<Task, 'id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      setError(null)
      const newTask = await tasksAPI.createTask(data)
      setTasks((prev) => [newTask, ...prev])
      await fetchStatistics()
      return true
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || 'Failed to create task'
      setError(errorMessage)
      return false
    }
  }

  const updateTask = async (
    id: number,
    data: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>
  ) => {
    try {
      setError(null)
      const updatedTask = await tasksAPI.updateTask(id, data)
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      )
      await fetchStatistics()
      return true
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || 'Failed to update task'
      setError(errorMessage)
      return false
    }
  }

  const deleteTask = async (id: number) => {
    try {
      setError(null)
      await tasksAPI.deleteTask(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
      await fetchStatistics()
      return true
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || 'Failed to delete task'
      setError(errorMessage)
      return false
    }
  }

  return {
    tasks,
    statistics,
    loading,
    error,
    fetchTasks,
    fetchStatistics,
    createTask,
    updateTask,
    deleteTask,
  }
}
