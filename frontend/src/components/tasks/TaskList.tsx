/* eslint-disable no-unused-vars */
import { TaskItem } from '@/components/tasks/TaskItem'

import type { Task } from '@/api/types'

interface TaskListProps {
  tasks: Task[]
  pendingTaskIds: Set<number>
  onEdit: (_task: Task) => void
  onDelete: (_taskId: number) => void
  onStatusChange: (_taskId: number, _status: Task['status']) => void
}

export const TaskList = ({
  tasks,
  pendingTaskIds,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-gray-500">
          No tasks found. Create one to get started!
        </p>
      </div>
    )
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isPending={pendingTaskIds.has(task.id)}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  )
}
