import apiClient from './axios'

import type { AuthResponse, User } from './types'

export const authAPI = {
  // Login user
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/login', {
      email,
      password,
    })
    return response.data
  },

  // Register new user
  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/register', {
      name,
      email,
      password,
    })
    return response.data
  },

  // Logout user
  logout: async (): Promise<void> => {
    await apiClient.post('/logout')
  },

  // Get current authenticated user
  getUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/user')
    return response.data
  },
}
