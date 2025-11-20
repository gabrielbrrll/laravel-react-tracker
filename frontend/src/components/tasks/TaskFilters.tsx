/* eslint-disable no-unused-vars */
import { useState } from 'react'

import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'

import type { TaskFilters as TaskFiltersType } from '@/api/types'

interface TaskFiltersProps {
  filters: TaskFiltersType
  onFilterChange: (_filters: TaskFiltersType) => void
  onReset: () => void
  isLoading?: boolean
}

export const TaskFilters = ({
  filters,
  onFilterChange,
  onReset,
  isLoading = false,
}: TaskFiltersProps) => {
  const [pendingFilters, setPendingFilters] = useState<TaskFiltersType>(filters)

  const hasChanges =
    pendingFilters.search !== filters.search ||
    pendingFilters.status !== filters.status ||
    pendingFilters.priority !== filters.priority ||
    pendingFilters.sort_by !== filters.sort_by ||
    pendingFilters.sort_order !== filters.sort_order

  const handleApply = () => {
    onFilterChange(pendingFilters)
  }

  const handleReset = () => {
    const defaultFilters: TaskFiltersType = {
      sort_by: 'created_at',
      sort_order: 'desc',
    }
    setPendingFilters(defaultFilters)
    onReset()
  }

  const hasActiveFilters =
    filters.status || filters.priority || filters.search || filters.sort_by

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {isLoading && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          )}
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button variant="primary" size="sm" onClick={handleApply}>
              Apply
            </Button>
          )}
          {hasActiveFilters && (
            <Button variant="secondary" size="sm" onClick={handleReset}>
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Input
            label="Search"
            type="text"
            value={pendingFilters.search || ''}
            onChange={(e) =>
              setPendingFilters({
                ...pendingFilters,
                search: e.target.value || undefined,
              })
            }
            placeholder="Search tasks..."
          />
        </div>

        <div>
          <label
            htmlFor="status-filter"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status-filter"
            value={pendingFilters.status || 'all'}
            onChange={(e) =>
              setPendingFilters({
                ...pendingFilters,
                status:
                  e.target.value === 'all'
                    ? undefined
                    : (e.target.value as TaskFiltersType['status']),
              })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="priority-filter"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Priority
          </label>
          <select
            id="priority-filter"
            value={pendingFilters.priority || 'all'}
            onChange={(e) =>
              setPendingFilters({
                ...pendingFilters,
                priority:
                  e.target.value === 'all'
                    ? undefined
                    : (e.target.value as TaskFiltersType['priority']),
              })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="sort-by-filter"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Sort By
          </label>
          <div className="flex gap-2">
            <select
              id="sort-by-filter"
              value={pendingFilters.sort_by || 'created_at'}
              onChange={(e) =>
                setPendingFilters({
                  ...pendingFilters,
                  sort_by: e.target.value as TaskFiltersType['sort_by'],
                })
              }
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="created_at">Created Date</option>
              <option value="due_date">Due Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="title">Title</option>
            </select>
            <button
              type="button"
              onClick={() =>
                setPendingFilters({
                  ...pendingFilters,
                  sort_order:
                    pendingFilters.sort_order === 'asc' ? 'desc' : 'asc',
                })
              }
              className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              title={`Sort ${pendingFilters.sort_order === 'asc' ? 'ascending' : 'descending'}`}
            >
              {pendingFilters.sort_order === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
