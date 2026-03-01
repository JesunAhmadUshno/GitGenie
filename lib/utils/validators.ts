// Validation utilities

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate GitHub username
 */
export function isValidGitHubUsername(username: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i.test(username)
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  strength: 'weak' | 'medium' | 'strong'
  requirements: {
    minLength: boolean
    hasUpperCase: boolean
    hasLowerCase: boolean
    hasNumbers: boolean
    hasSpecialChars: boolean
  }
} {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const metRequirements = Object.values(requirements).filter(Boolean).length

  let strength: 'weak' | 'medium' | 'strong' = 'weak'
  if (metRequirements >= 4) strength = 'strong'
  else if (metRequirements >= 3) strength = 'medium'

  return {
    isValid: requirements.minLength && requirements.hasUpperCase && requirements.hasNumbers,
    strength,
    requirements,
  }
}

/**
 * Validate JWT token format
 */
export function isValidJWT(token: string): boolean {
  const parts = token.split('.')
  return parts.length === 3 && parts.every((part) => part.length > 0)
}

/**
 * Validate date
 */
export function isValidDate(date: unknown): boolean {
  if (!(date instanceof Date)) return false
  return !isNaN(date.getTime())
}

/**
 * Validate ISO date string
 */
export function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString)
  return isValidDate(date) && dateString === date.toISOString()
}

/**
 * Validate username (3-39 characters, alphanumeric + hyphen)
 */
export function isValidUsername(username: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{1,37}[a-z0-9])?$/i.test(username) && username.length >= 3
}

/**
 * Validate bio/description
 */
export function isValidBio(bio: string): boolean {
  return bio.length <= 500 && bio.trim().length > 0
}

/**
 * Validate HTTP status code
 */
export function isSuccessStatus(status: number): boolean {
  return status >= 200 && status < 300
}

/**
 * Validate response object
 */
export function isValidResponse<T>(
  response: unknown
): response is { success: boolean; data?: T; error?: string } {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    typeof (response as Record<string, unknown>).success === 'boolean'
  )
}

/**
 * Validate achievement type
 */
export function isValidAchievementType(type: string): boolean {
  const validTypes = [
    'QUICK_DRAW',
    'PULL_SHARK',
    'YOLO',
    'PAIR_EXTRAORDINAIRE',
    'GALAXY_BRAIN',
    'STARSTRUCK',
    'PUBLIC_SPONSOR',
    'HEART_ON_YOUR_SLEEVE',
  ]
  return validTypes.includes(type)
}

/**
 * Validate progress value (0-100)
 */
export function isValidProgress(progress: number): boolean {
  return Number.isInteger(progress) && progress >= 0 && progress <= 100
}

/**
 * Generic array validation
 */
export function isNonEmptyArray<T>(value: unknown): value is T[] {
  return Array.isArray(value) && value.length > 0
}

/**
 * Validate object has required fields
 */
export function hasRequiredFields<T extends Record<string, unknown>>(
  obj: unknown,
  requiredFields: (keyof T)[]
): obj is T {
  if (typeof obj !== 'object' || obj === null) return false
  return requiredFields.every((field) => field in obj)
}
