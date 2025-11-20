import { describe, it, expect } from 'vitest'

import {
  validateEmail,
  validatePassword,
  validateTaskTitle,
  validateTaskDescription,
} from './validators'

describe('validateEmail', () => {
  it('should validate correct email', () => {
    expect(validateEmail('test@example.com')).toBe(true)
    expect(validateEmail('user.name@domain.co.uk')).toBe(true)
  })

  it('should reject invalid email', () => {
    expect(validateEmail('invalid')).toBe(false)
    expect(validateEmail('test@')).toBe(false)
    expect(validateEmail('@example.com')).toBe(false)
  })
})

describe('validatePassword', () => {
  it('should accept valid password', () => {
    expect(validatePassword('ValidPass123')).toBeNull()
  })

  it('should reject short password', () => {
    expect(validatePassword('Short1')).toBe(
      'Password must be at least 8 characters long'
    )
  })

  it('should require uppercase letter', () => {
    expect(validatePassword('lowercase123')).toBe(
      'Password must contain at least one uppercase letter'
    )
  })

  it('should require lowercase letter', () => {
    expect(validatePassword('UPPERCASE123')).toBe(
      'Password must contain at least one lowercase letter'
    )
  })

  it('should require number', () => {
    expect(validatePassword('NoNumbers')).toBe(
      'Password must contain at least one number'
    )
  })
})

describe('validateTaskTitle', () => {
  it('should accept valid title', () => {
    expect(validateTaskTitle('Valid Task Title')).toBeNull()
  })

  it('should reject empty title', () => {
    expect(validateTaskTitle('')).toBe('Title is required')
    expect(validateTaskTitle('   ')).toBe('Title is required')
  })

  it('should reject short title', () => {
    expect(validateTaskTitle('ab')).toBe(
      'Title must be at least 3 characters long'
    )
  })

  it('should reject long title', () => {
    const longTitle = 'a'.repeat(256)
    expect(validateTaskTitle(longTitle)).toBe(
      'Title must not exceed 255 characters'
    )
  })
})

describe('validateTaskDescription', () => {
  it('should accept valid description', () => {
    expect(validateTaskDescription('Valid description')).toBeNull()
    expect(validateTaskDescription('')).toBeNull()
  })

  it('should reject long description', () => {
    const longDescription = 'a'.repeat(1001)
    expect(validateTaskDescription(longDescription)).toBe(
      'Description must not exceed 1000 characters'
    )
  })
})
