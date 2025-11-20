export interface User {
  id: number
  name: string
  email: string
}

export interface Task {
  id: number
  title: string
  description: string | null
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  created_at: string
  updated_at: string
}

export interface TaskStatistics {
  total: number
  pending: number
  in_progress: number
  completed: number
  overdue: number
}

export interface TaskFilters {
  status?: 'pending' | 'in_progress' | 'completed'
  priority?: 'low' | 'medium' | 'high'
  search?: string
  sort_by?: 'created_at' | 'due_date' | 'priority' | 'status' | 'title'
  sort_order?: 'asc' | 'desc'
  page?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
