/* eslint-disable no-unused-vars */
import { Search } from 'lucide-react'

import type { TaskFilters as TaskFiltersType } from '@/api/types'

export interface DisplayOptions {
  showStatus: boolean
  showPriority: boolean
  showDueDate: boolean
}

interface TaskFiltersProps {
  filters: TaskFiltersType
  searchTerm: string
  displayOptions: DisplayOptions
  onFilterChange: (_filters: TaskFiltersType) => void
  onSearchChange: (_value: string) => void
  onDisplayOptionsChange: (_options: DisplayOptions) => void
  isVisible: boolean
}

export const TaskFilters = ({
  filters,
  searchTerm,
  displayOptions,
  onFilterChange,
  onSearchChange,
  onDisplayOptionsChange,
  isVisible,
}: TaskFiltersProps) => {
  const handlePriorityChange = (priority?: TaskFiltersType['priority']) => {
    const newFilters = { ...filters, priority }
    onFilterChange(newFilters)
  }

  const handleSortChange = (
    sort_by: TaskFiltersType['sort_by'],
    sort_order?: TaskFiltersType['sort_order']
  ) => {
    const newFilters = {
      ...filters,
      sort_by,
      sort_order: sort_order || filters.sort_order,
    }
    onFilterChange(newFilters)
  }

  const toggleSortOrder = () => {
    const newOrder = filters.sort_order === 'asc' ? 'desc' : 'asc'
    handleSortChange(filters.sort_by || 'created_at', newOrder)
  }

  if (!isVisible) return null

  return (
    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="h-9 w-full rounded-lg border border-gray-200 py-2 pl-10 pr-3 text-sm shadow-sm transition-colors hover:border-gray-300 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-0"
          />
        </div>
      </div>

      {/* Priority and Sort By */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Priority */}
        <div>
          <div className="mb-2 text-sm font-medium text-gray-700">Priority</div>
          <div className="inline-flex h-9 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500">
            {[
              { label: 'All', value: undefined },
              { label: 'Low', value: 'low' as const },
              { label: 'Medium', value: 'medium' as const },
              { label: 'High', value: 'high' as const },
            ].map((priority) => {
              const isActive = filters.priority === priority.value
              return (
                <button
                  key={priority.label}
                  type="button"
                  onClick={() => handlePriorityChange(priority.value)}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-gray-900 shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {priority.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Sort By */}
        <div>
          <div className="mb-2 text-sm font-medium text-gray-700">Sort By</div>
          <div className="flex gap-2">
            <select
              value={filters.sort_by || 'created_at'}
              onChange={(e) =>
                handleSortChange(e.target.value as TaskFiltersType['sort_by'])
              }
              className="h-9 flex-1 appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-8 text-sm shadow-sm transition-colors hover:border-gray-300 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
              }}
            >
              <option value="created_at">Created Date</option>
              <option value="due_date">Due Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="title">Title</option>
            </select>
            <button
              type="button"
              onClick={toggleSortOrder}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-0"
              title={`Sort ${filters.sort_order === 'asc' ? 'ascending' : 'descending'}`}
            >
              {filters.sort_order === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Display Options */}
      <div className="mt-4 border-t border-gray-200 pt-4">
        <div className="mb-2 text-sm font-medium text-gray-700">
          Show in Task List
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={displayOptions.showStatus}
              onChange={(e) =>
                onDisplayOptionsChange({
                  ...displayOptions,
                  showStatus: e.target.checked,
                })
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Status</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={displayOptions.showPriority}
              onChange={(e) =>
                onDisplayOptionsChange({
                  ...displayOptions,
                  showPriority: e.target.checked,
                })
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Priority</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={displayOptions.showDueDate}
              onChange={(e) =>
                onDisplayOptionsChange({
                  ...displayOptions,
                  showDueDate: e.target.checked,
                })
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Due Date</span>
          </label>
        </div>
      </div>
    </div>
  )
}
