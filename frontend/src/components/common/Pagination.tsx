/* eslint-disable no-unused-vars */
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  lastPage: number
  total: number
  perPage: number
  onPageChange: (_page: number) => void
  isLoading?: boolean
}

export const Pagination = ({
  currentPage,
  lastPage,
  total,
  onPageChange,
  isLoading = false,
}: PaginationProps) => {
  if (total === 0) return null

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < lastPage) {
      onPageChange(currentPage + 1)
    }
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (lastPage <= maxVisible) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(lastPage)
      } else if (currentPage >= lastPage - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = lastPage - 2; i <= lastPage; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        pages.push(currentPage)
        pages.push('...')
        pages.push(lastPage)
      }
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center border-t border-gray-200 bg-white px-4 py-4">
      <nav className="flex items-center gap-1">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentPage === 1 || isLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="inline-flex h-10 w-10 items-center justify-center text-sm font-medium text-gray-700"
                >
                  ...
                </span>
              )
            }
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page as number)}
                disabled={isLoading}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'border-gray-200 bg-white text-gray-900 shadow'
                    : 'border-transparent text-gray-700 hover:bg-gray-100'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {page}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === lastPage || isLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  )
}
