/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'

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
  const [searchValue, setSearchValue] = useState(filters.search || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        ...filters,
        search: searchValue || undefined,
      })
    }, 300)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  const handleStatusChange = (status: string) => {
    onFilterChange({
      ...filters,
      status:
        status === 'all' ? undefined : (status as TaskFiltersType['status']),
    })
  }

  const handlePriorityChange = (priority: string) => {
    onFilterChange({
      ...filters,
      priority:
        priority === 'all'
          ? undefined
          : (priority as TaskFiltersType['priority']),
    })
  }

  const handleSortChange = (sortBy: string) => {
    onFilterChange({
      ...filters,
      sort_by: sortBy as TaskFiltersType['sort_by'],
    })
  }

  const handleSortOrderChange = () => {
    onFilterChange({
      ...filters,
      sort_order: filters.sort_order === 'asc' ? 'desc' : 'asc',
    })
  }

  const handleReset = () => {
    setSearchValue('')
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
        {hasActiveFilters && (
          <Button variant="secondary" size="sm" onClick={handleReset}>
            Reset
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Input
            label="Search"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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
            value={filters.status || 'all'}
            onChange={(e) => handleStatusChange(e.target.value)}
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
            value={filters.priority || 'all'}
            onChange={(e) => handlePriorityChange(e.target.value)}
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
              value={filters.sort_by || 'created_at'}
              onChange={(e) => handleSortChange(e.target.value)}
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
              onClick={handleSortOrderChange}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              title={`Sort ${filters.sort_order === 'asc' ? 'ascending' : 'descending'}`}
            >
              {filters.sort_order === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
