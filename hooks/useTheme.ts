'use client'

import { useEffect } from 'react'
import { useUIStore } from '@/store/uiStore'

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useUIStore()

  useEffect(() => {
    const element = document.documentElement
    if (theme === 'dark') {
      element.classList.add('dark')
      element.setAttribute('data-theme', 'dark')
    } else {
      element.classList.remove('dark')
      element.setAttribute('data-theme', 'light')
    }
  }, [theme])

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
  }
}

export function useToast() {
  const { addToast, removeToast, clearToasts, toasts } = useUIStore()

  return {
    toasts,
    success: (message: string, duration = 5000) =>
      addToast({ type: 'success', message, duration }),
    error: (message: string, duration = 5000) => addToast({ type: 'error', message, duration }),
    info: (message: string, duration = 5000) => addToast({ type: 'info', message, duration }),
    warning: (message: string, duration = 5000) =>
      addToast({ type: 'warning', message, duration }),
    removeToast,
    clearToasts,
  }
}

export function useSidebar() {
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useUIStore()

  return {
    isOpen: sidebarOpen,
    setOpen: setSidebarOpen,
    toggle: toggleSidebar,
  }
}
