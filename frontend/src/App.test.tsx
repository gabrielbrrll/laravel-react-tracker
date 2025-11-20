import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders login page by default', () => {
    render(<App />)
    expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument()
  })

  it('shows login form elements', () => {
    render(<App />)
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })
})
