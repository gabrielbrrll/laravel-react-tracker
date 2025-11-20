/* eslint-disable no-unused-vars */
import { createContext, useContext, ReactNode } from 'react'

import { useAuth as useAuthHook } from '@/hooks/useAuth'

import type { User } from '@/api/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (_email: string, _password: string) => Promise<boolean>
  register: (
    _name: string,
    _email: string,
    _password: string
  ) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthHook()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
