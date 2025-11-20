import { describe, it, expect } from 'vitest'

import { formatDate, formatStatus, formatPriority } from './formatters'

describe('formatDate', () => {
  it('should format date correctly', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('Jan')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('should return "No due date" for null', () => {
    expect(formatDate(null)).toBe('No due date')
  })
})

describe('formatStatus', () => {
  it('should format single word status', () => {
    expect(formatStatus('pending')).toBe('Pending')
  })

  it('should format multi-word status with underscore', () => {
    expect(formatStatus('in_progress')).toBe('In Progress')
  })

  it('should format completed status', () => {
    expect(formatStatus('completed')).toBe('Completed')
  })
})

describe('formatPriority', () => {
  it('should capitalize priority', () => {
    expect(formatPriority('low')).toBe('Low')
    expect(formatPriority('medium')).toBe('Medium')
    expect(formatPriority('high')).toBe('High')
  })
})
