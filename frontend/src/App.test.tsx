import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByText(/Task Tracker/i)).toBeInTheDocument()
  })

  it('displays the subtitle', () => {
    render(<App />)
    expect(
      screen.getByText(/React \+ Vite \+ Laravel Application/i)
    ).toBeInTheDocument()
  })
})
