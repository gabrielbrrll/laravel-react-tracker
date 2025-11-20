import { Filter, Plus } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

import { Button } from '@/components/common/Button'
import { Pagination } from '@/components/common/Pagination'
import { Spinner } from '@/components/common/Spinner'
import { StatusTabs } from '@/components/tasks/StatusTabs'
import { TaskFilters } from '@/components/tasks/TaskFilters'
import { TaskForm, TaskFormData } from '@/components/tasks/TaskForm'
import { TaskList } from '@/components/tasks/TaskList'
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
    pagination,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks()
  const { error: showError, success } = useToast()

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isFiltering, setIsFiltering] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [displayOptions, setDisplayOptions] = useState({
    showStatus: true,
    showPriority: true,
    showDueDate: true,
  })
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

    setCurrentPage(1)
    setIsFiltering(true)
    loadData(1).finally(() => setIsFiltering(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const loadData = async (page: number = currentPage) => {
    try {
      await fetchTasks(filters, page)
    } catch {
      showError('Failed to load dashboard data')
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setIsFiltering(true)
    loadData(page).finally(() => setIsFiltering(false))
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
      ? await updateTask(editingTask.id, data)
      : await createTask(data)

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
    const result = await updateTask(taskId, { status })
    if (result.success) {
      success('Task status updated')
      // If we're filtering by status and the new status doesn't match, refetch to update the view
      if (filters.status && filters.status !== status) {
        await loadData(currentPage)
      }
    } else {
      showError(result.error || 'Failed to update task status')
    }
  }

  const handleFilterChange = (newFilters: TaskFiltersType) => {
    setFilters(newFilters)
  }

  const handleStatusFilterChange = (status?: Task['status']) => {
    setFilters({ ...filters, status })
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setFilters({ ...filters, search: value || undefined })
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
        <div className="rounded-lg bg-white shadow">
          {/* Header with Title, Create Button, Filter Icon, and Status Tabs */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Your Tasks
                </h2>
                <button
                  type="button"
                  onClick={handleCreateTask}
                  className="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100"
                  title="Create task"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <StatusTabs
                  activeStatus={filters.status}
                  onChange={handleStatusFilterChange}
                />
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`rounded p-1.5 transition-colors ${
                    showFilters
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Toggle filters"
                >
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Collapsible Filters */}
          <TaskFilters
            filters={filters}
            searchTerm={searchTerm}
            displayOptions={displayOptions}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            onDisplayOptionsChange={setDisplayOptions}
            isVisible={showFilters}
          />
          <TaskList
            tasks={tasks}
            pendingTaskIds={pendingTaskIds}
            searchTerm={filters.search}
            displayOptions={displayOptions}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
          {pagination.total > 0 && (
            <Pagination
              currentPage={pagination.currentPage}
              lastPage={pagination.lastPage}
              total={pagination.total}
              perPage={pagination.perPage}
              onPageChange={handlePageChange}
              isLoading={isFiltering}
            />
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
