import { useCallback, useRef, useState } from 'react'

import { tasksAPI } from '@/api/tasks'
import { useOptimistic } from '@/hooks/useOptimistic'

import type { Task, TaskFilters } from '@/api/types'

interface TaskResult {
  success: boolean
  error?: string
}

export const useTasks = () => {
  const {
    state: tasks,
    setState: setTasks,
    applyOptimistic,
    isOptimistic,
  } = useOptimistic<Task[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingTaskIds, setPendingTaskIds] = useState<Set<number>>(new Set())

  const tempIdCounter = useRef(-1)

  const generateTempId = () => {
    return tempIdCounter.current--
  }

  const fetchTasks = useCallback(
    async (filters?: TaskFilters) => {
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
    },
    [setTasks]
  )

  const createTask = async (
    data: Omit<Task, 'id' | 'created_at' | 'updated_at'>,
    filters?: TaskFilters
  ): Promise<TaskResult> => {
    const tempId = generateTempId()

    setPendingTaskIds((prev) => new Set(prev).add(tempId))

    const optimisticTask: Task = {
      ...data,
      id: tempId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const optimisticState = [optimisticTask, ...tasks]

    const { success } = await applyOptimistic(
      optimisticState,
      () => tasksAPI.createTask(data),
      {
        onSuccess: async () => {
          setPendingTaskIds((prev) => {
            const next = new Set(prev)
            next.delete(tempId)
            return next
          })
          await fetchTasks(filters)
        },
        onError: (err) => {
          setPendingTaskIds((prev) => {
            const next = new Set(prev)
            next.delete(tempId)
            return next
          })

          const errorMessage =
            (err as unknown as { response?: { data?: { message?: string } } })
              .response?.data?.message || 'Failed to create task'
          setError(errorMessage)
        },
      }
    )

    return {
      success,
      error: success ? undefined : error || undefined,
    }
  }

  const updateTask = async (
    id: number,
    data: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>,
    filters?: TaskFilters
  ): Promise<TaskResult> => {
    setPendingTaskIds((prev) => new Set(prev).add(id))

    const optimisticState = tasks.map((t) =>
      t.id === id ? { ...t, ...data } : t
    )

    const { success } = await applyOptimistic(
      optimisticState,
      () => tasksAPI.updateTask(id, data),
      {
        onSuccess: async () => {
          setPendingTaskIds((prev) => {
            const next = new Set(prev)
            next.delete(id)
            return next
          })
          await fetchTasks(filters)
        },
        onError: (err) => {
          setPendingTaskIds((prev) => {
            const next = new Set(prev)
            next.delete(id)
            return next
          })

          const errorMessage =
            (err as unknown as { response?: { data?: { message?: string } } })
              .response?.data?.message || 'Failed to update task'
          setError(errorMessage)
        },
      }
    )

    return {
      success,
      error: success ? undefined : error || undefined,
    }
  }

  const deleteTask = async (id: number): Promise<boolean> => {
    const optimisticState = tasks.filter((t) => t.id !== id)

    const { success } = await applyOptimistic(
      optimisticState,
      () => tasksAPI.deleteTask(id),
      {
        onError: (err) => {
          const errorMessage =
            (err as unknown as { response?: { data?: { message?: string } } })
              .response?.data?.message || 'Failed to delete task'
          setError(errorMessage)
        },
      }
    )

    return success
  }

  return {
    tasks,
    loading,
    error,
    isOptimistic,
    pendingTaskIds,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  }
}
