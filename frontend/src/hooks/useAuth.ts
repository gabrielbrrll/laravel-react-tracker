import { useState, useEffect } from 'react'

import { authAPI } from '@/api/auth'

import type { User } from '@/api/types'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const userData = await authAPI.getUser()
      setUser(userData)
    } catch {
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      const { user, token } = await authAPI.login(email, password)
      localStorage.setItem('token', token)
      setUser(user)
      return true
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || 'Login failed'
      setError(errorMessage)
      return false
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null)
      const { user, token } = await authAPI.register(name, email, password)
      localStorage.setItem('token', token)
      setUser(user)
      return true
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || 'Registration failed'
      setError(errorMessage)
      return false
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
    }
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }
}
