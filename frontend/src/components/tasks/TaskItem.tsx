/* eslint-disable no-unused-vars */
import { CheckCircle, Pencil, Play, Trash2 } from 'lucide-react'
import { memo, useState } from 'react'

import { Badge } from '@/components/common/Badge'
import { HighlightedText } from '@/components/common/HighlightedText'
import { formatDate } from '@/utils/formatters'

import type { Task } from '@/api/types'
import type { DisplayOptions } from '@/components/tasks/TaskFilters'

interface TaskItemProps {
  task: Task
  isPending: boolean
  searchTerm?: string
  displayOptions: DisplayOptions
  onEdit: (_task: Task) => void
  onDelete: (_taskId: number) => void
  onStatusChange: (_taskId: number, _status: Task['status']) => void
}

const TaskItemComponent = ({
  task,
  isPending,
  searchTerm,
  displayOptions,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return

    setIsDeleting(true)
    try {
      await onDelete(task.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleStatusChange = async (newStatus: Task['status']) => {
    setIsUpdatingStatus(true)
    try {
      await onStatusChange(task.id, newStatus)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const getNextStatus = (): Task['status'] | null => {
    switch (task.status) {
      case 'pending':
        return 'in_progress'
      case 'in_progress':
        return 'completed'
      default:
        return null
    }
  }

  const nextStatus = getNextStatus()

  return (
    <div
      className={`group border-b border-gray-200 px-6 py-4 hover:bg-gray-50 ${
        isPending ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-900">
            <HighlightedText text={task.title} searchTerm={searchTerm} />
          </h3>
          {task.description && (
            <p className="mt-1 text-sm text-gray-500">
              <HighlightedText
                text={task.description}
                searchTerm={searchTerm}
              />
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {displayOptions.showStatus && task.status && (
              <Badge variant={getStatusBadgeVariant(task.status)}>
                {task.status.replace('_', ' ')}
              </Badge>
            )}
            {displayOptions.showPriority && task.priority && (
              <Badge variant={getPriorityBadgeVariant(task.priority)}>
                {task.priority}
              </Badge>
            )}
            {displayOptions.showDueDate && task.due_date && (
              <span className="text-xs text-gray-500">
                Due: {formatDate(task.due_date)}
              </span>
            )}
          </div>
        </div>

        <div className="ml-4 flex flex-shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {nextStatus && (
            <button
              type="button"
              onClick={() => handleStatusChange(nextStatus)}
              disabled={isUpdatingStatus || isDeleting || isPending}
              className="rounded p-1.5 text-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
              title={
                nextStatus === 'in_progress' ? 'Start task' : 'Complete task'
              }
            >
              {isUpdatingStatus ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
              ) : nextStatus === 'in_progress' ? (
                <Play className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => onEdit(task)}
            disabled={isDeleting || isUpdatingStatus || isPending}
            className="rounded p-1.5 text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="Edit task"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || isUpdatingStatus || isPending}
            className="rounded p-1.5 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="Delete task"
          >
            {isDeleting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

TaskItemComponent.displayName = 'TaskItem'

export const TaskItem = memo(TaskItemComponent)
