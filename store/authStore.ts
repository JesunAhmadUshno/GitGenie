// Auth store using Zustand

import { create } from 'zustand'
import { User, AuthSession } from '@/types'

interface AuthStore {
  user: User | null
  session: AuthSession | null
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setSession: (session: AuthSession | null) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  logout: () => {
    set({ user: null, session: null, error: null })
  },
}))
