/**
 * Local Storage Service
 * Stores user achievements and data in browser
 */

import type { Achievement } from './achievements'

const STORAGE_PREFIX = 'gitgenie_'

interface UserDataV1 {
  username: string
  avatar: string
  name: string
  bio: string
  achievements: Achievement[]
  lastUpdated: string
  viewedProfiles: string[]
}

/**
 * Save user achievements
 */
export function saveUserAchievements(username: string, achievements: Achievement[]): void {
  if (typeof window === 'undefined') return

  const key = `${STORAGE_PREFIX}achievements_${username}`
  localStorage.setItem(key, JSON.stringify(achievements))
}

/**
 * Get user achievements from storage
 */
export function getUserAchievements(username: string): Achievement[] | null {
  if (typeof window === 'undefined') return null

  const key = `${STORAGE_PREFIX}achievements_${username}`
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

/**
 * Save full user data
 */
export function saveUserData(userData: UserDataV1): void {
  if (typeof window === 'undefined') return

  const key = `${STORAGE_PREFIX}user_${userData.username}`
  localStorage.setItem(key, JSON.stringify(userData))
}

/**
 * Get user data from storage
 */
export function getUserData(username: string): UserDataV1 | null {
  if (typeof window === 'undefined') return null

  const key = `${STORAGE_PREFIX}user_${username}`
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

/**
 * Save current user (for quick access)
 */
export function setCurrentUser(username: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${STORAGE_PREFIX}current_user`, username)
}

/**
 * Get current user
 */
export function getCurrentUser(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(`${STORAGE_PREFIX}current_user`)
}

/**
 * Save viewed profiles (for leaderboard)
 */
export function addViewedProfile(username: string): void {
  if (typeof window === 'undefined') return

  const key = `${STORAGE_PREFIX}viewed_profiles`
  const profiles = JSON.parse(localStorage.getItem(key) || '[]')

  if (!profiles.includes(username)) {
    profiles.push(username)
    localStorage.setItem(key, JSON.stringify(profiles.slice(-50))) // Keep last 50
  }
}

/**
 * Get viewed profiles
 */
export function getViewedProfiles(): string[] {
  if (typeof window === 'undefined') return []

  const key = `${STORAGE_PREFIX}viewed_profiles`
  return JSON.parse(localStorage.getItem(key) || '[]')
}

/**
 * Clear all user data (for privacy)
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return

  const keys = Object.keys(localStorage).filter((key) => key.startsWith(STORAGE_PREFIX))
  keys.forEach((key) => localStorage.removeItem(key))
}

/**
 * Clear specific user data
 */
export function clearUserData(username: string): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem(`${STORAGE_PREFIX}achievements_${username}`)
  localStorage.removeItem(`${STORAGE_PREFIX}user_${username}`)
}

/**
 * Check if data is fresh (less than 1 hour old)
 */
export function isDataFresh(username: string, maxAgeMinutes: number = 60): boolean {
  const userData = getUserData(username)
  if (!userData) return false

  const lastUpdated = new Date(userData.lastUpdated)
  const now = new Date()
  const ageMinutes = (now.getTime() - lastUpdated.getTime()) / (1000 * 60)

  return ageMinutes < maxAgeMinutes
}

/**
 * Export user data as JSON
 */
export function exportUserData(username: string): string {
  const userData = getUserData(username)
  if (!userData) return '{}'

  return JSON.stringify(userData, null, 2)
}

/**
 * Import user data from JSON
 */
export function importUserData(jsonData: string): boolean {
  try {
    const userData = JSON.parse(jsonData) as UserDataV1
    saveUserData(userData)
    return true
  } catch {
    return false
  }
}
