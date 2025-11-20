/* eslint-disable no-unused-vars */
import { useState, memo } from 'react'

import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { HighlightedText } from '@/components/common/HighlightedText'
import { formatDate } from '@/utils/formatters'

import type { Task } from '@/api/types'

interface TaskItemProps {
  task: Task
  isPending: boolean
  searchTerm?: string
  onEdit: (_task: Task) => void
  onDelete: (_taskId: number) => void
  onStatusChange: (_taskId: number, _status: Task['status']) => void
}

const TaskItemComponent = ({
  task,
  isPending,
  searchTerm,
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
      className={`border-b border-gray-200 px-6 py-4 hover:bg-gray-50 ${
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
            {task.status && (
              <Badge variant={getStatusBadgeVariant(task.status)}>
                {task.status.replace('_', ' ')}
              </Badge>
            )}
            {task.priority && (
              <Badge variant={getPriorityBadgeVariant(task.priority)}>
                {task.priority}
              </Badge>
            )}
            {task.due_date && (
              <span className="text-xs text-gray-500">
                Due: {formatDate(task.due_date)}
              </span>
            )}
          </div>
        </div>

        <div className="ml-4 flex flex-shrink-0 gap-2">
          {nextStatus && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleStatusChange(nextStatus)}
              disabled={isUpdatingStatus || isDeleting || isPending}
              loading={isUpdatingStatus}
            >
              {nextStatus === 'in_progress' ? 'Start' : 'Complete'}
            </Button>
          )}
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(task)}
            disabled={isDeleting || isUpdatingStatus || isPending}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={handleDelete}
            disabled={isDeleting || isUpdatingStatus || isPending}
            loading={isDeleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

TaskItemComponent.displayName = 'TaskItem'

export const TaskItem = memo(TaskItemComponent)
