export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter'
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number'
  }
  return null
}

export const validateTaskTitle = (title: string): string | null => {
  if (title.trim().length === 0) {
    return 'Title is required'
  }
  if (title.length < 3) {
    return 'Title must be at least 3 characters long'
  }
  if (title.length > 255) {
    return 'Title must not exceed 255 characters'
  }
  return null
}

export const validateTaskDescription = (description: string): string | null => {
  if (description.length > 1000) {
    return 'Description must not exceed 1000 characters'
  }
  return null
}

export const validateDueDate = (dueDate: string): string | null => {
  const date = new Date(dueDate)
  const now = new Date()

  if (isNaN(date.getTime())) {
    return 'Invalid date format'
  }

  if (date < now) {
    return 'Due date cannot be in the past'
  }

  return null
}
