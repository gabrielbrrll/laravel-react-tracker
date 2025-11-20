import { useEffect } from 'react'

import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useTasks } from '@/hooks/useTasks'

export const Dashboard = () => {
  const { user, logout } = useAuth()
  const { tasks, statistics, loading, fetchTasks, fetchStatistics } = useTasks()
  const { error: showError } = useToast()

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchTasks(), fetchStatistics()])
      } catch {
        showError('Failed to load dashboard data')
      }
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      showError('Logout failed')
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'in_progress':
        return 'info'
      default:
        return 'default'
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'danger'
      case 'medium':
        return 'warning'
      default:
        return 'default'
    }
  }

  if (loading && tasks.length === 0) {
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
        {statistics && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {statistics.total}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="mt-2 text-3xl font-bold text-yellow-600">
                {statistics.pending}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {statistics.in_progress}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {statistics.completed}
              </p>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Tasks</h2>
          </div>
          {tasks.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">
                No tasks yet. Create one to get started!
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li key={task.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-gray-900">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {task.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant={getPriorityBadgeVariant(task.priority)}>
                          {task.priority}
                        </Badge>
                        {task.due_date && (
                          <span className="text-xs text-gray-500">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
