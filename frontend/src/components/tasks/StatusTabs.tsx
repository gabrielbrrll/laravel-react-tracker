import type { Task } from '@/api/types'

interface StatusTabsProps {
  activeStatus?: Task['status']
  // eslint-disable-next-line no-unused-vars
  onChange: (status?: Task['status']) => void
}

export const StatusTabs = ({ activeStatus, onChange }: StatusTabsProps) => {
  const tabs: { label: string; value?: Task['status'] }[] = [
    { label: 'All', value: undefined },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
  ]

  return (
    <div className="inline-flex h-9 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500">
      {tabs.map((tab) => {
        const isActive = activeStatus === tab.value
        return (
          <button
            key={tab.label}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all ${
              isActive
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
