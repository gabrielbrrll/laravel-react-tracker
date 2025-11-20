import { useEffect, useState, useRef } from 'react'

import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import { TaskFilters } from '@/components/tasks/TaskFilters'
import { TaskForm, TaskFormData } from '@/components/tasks/TaskForm'
import { TaskItem } from '@/components/tasks/TaskItem'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useTasks } from '@/hooks/useTasks'

import type { Task, TaskFilters as TaskFiltersType } from '@/api/types'

export const Dashboard = () => {
  const { user, logout } = useAuth()
  const {
    tasks,
    loading,
    pendingTaskIds,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks()
  const { error: showError, success } = useToast()

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isFiltering, setIsFiltering] = useState(false)
  const [filters, setFilters] = useState<TaskFiltersType>({
    sort_by: 'created_at',
    sort_order: 'desc',
  })
  const isInitialMount = useRef(true)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    setIsFiltering(true)
    loadData().finally(() => setIsFiltering(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const loadData = async () => {
    try {
      await fetchTasks(filters)
    } catch {
      showError('Failed to load dashboard data')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      showError('Logout failed')
    }
  }

  const handleCreateTask = () => {
    setEditingTask(null)
    setShowTaskForm(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleTaskFormSubmit = async (data: TaskFormData) => {
    const result = editingTask
      ? await updateTask(editingTask.id, data, filters)
      : await createTask(data, filters)

    if (result.success) {
      const action = editingTask ? 'updated' : 'created'
      success(`Task ${action} successfully`)
      setShowTaskForm(false)
      setEditingTask(null)
    } else {
      showError(
        result.error || `Failed to ${editingTask ? 'update' : 'create'} task`
      )
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    const result = await deleteTask(taskId)
    if (result) {
      success('Task deleted successfully')
    } else {
      showError('Failed to delete task')
    }
  }

  const handleStatusChange = async (taskId: number, status: Task['status']) => {
    const result = await updateTask(taskId, { status }, filters)
    if (result.success) {
      success('Task status updated')
    } else {
      showError(result.error || 'Failed to update task status')
    }
  }

  const handleFilterChange = (newFilters: TaskFiltersType) => {
    setFilters(newFilters)
  }

  const handleResetFilters = () => {
    setFilters({
      sort_by: 'created_at',
      sort_order: 'desc',
    })
  }

  if (loading && tasks.length === 0 && !isFiltering) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Task Tracker</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name}
              </span>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <TaskFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            isLoading={isFiltering}
          />
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Tasks</h2>
            <Button variant="primary" size="sm" onClick={handleCreateTask}>
              Create Task
            </Button>
          </div>
          {tasks.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">
                No tasks found. Create one to get started!
              </p>
            </div>
          ) : (
            <div>
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isPending={pendingTaskIds.has(task.id)}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleTaskFormSubmit}
          onCancel={() => {
            setShowTaskForm(false)
            setEditingTask(null)
          }}
        />
      )}
    </div>
  )
}
