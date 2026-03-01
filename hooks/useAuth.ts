'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { User } from '@/types'

export function useAuth() {
  const { user, session, isLoading, error, setUser, setSession, setIsLoading, logout } =
    useAuthStore()

  useEffect(() => {
    // Fetch current user on mount
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.data)
          setSession(data.session)
        }
      } catch (err) {
        console.error('Failed to fetch user:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [setUser, setSession, setIsLoading])

  return {
    user,
    session,
    isLoading,
    error,
    isAuthenticated: !!user,
    logout,
  }
}

export function useUser() {
  const { user } = useAuthStore()
  return user as User | null
}
