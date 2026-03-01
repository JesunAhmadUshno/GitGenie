// Application constants

export const ACHIEVEMENTS = {
  QUICK_DRAW: {
    id: 'QUICK_DRAW',
    name: 'QuickDraw',
    description: 'Create and close an issue within 5 minutes',
    icon: '⚡',
    color: '#F59E0B',
    requirements: {
      timeLimit: 300, // 5 minutes in seconds
      action: 'issue_closure',
    },
  },
  PULL_SHARK: {
    id: 'PULL_SHARK',
    name: 'Pull Shark',
    description: 'Create and merge 2 pull requests',
    icon: '🦈',
    color: '#06B6D4',
    requirements: {
      minMergedPRs: 2,
      action: 'pr_merge',
    },
  },
  YOLO: {
    id: 'YOLO',
    name: 'YOLO',
    description: 'Merge a pull request without a review',
    icon: '🎯',
    color: '#10B981',
    requirements: {
      noReviews: true,
      action: 'pr_merge',
    },
  },
  PAIR_EXTRAORDINAIRE: {
    id: 'PAIR_EXTRAORDINAIRE',
    name: 'Pair Extraordinaire',
    description: 'Co-author a commit with another user',
    icon: '👥',
    color: '#A855F7',
    requirements: {
      minCoAuthors: 1,
      action: 'commit_coauthor',
    },
  },
  GALAXY_BRAIN: {
    id: 'GALAXY_BRAIN',
    name: 'Galaxy Brain',
    description: 'Have 2+ answers marked as solutions in discussions',
    icon: '🧠',
    color: '#EC4899',
    requirements: {
      minAcceptedAnswers: 2,
      action: 'discussion_answer',
    },
  },
  STARSTRUCK: {
    id: 'STARSTRUCK',
    name: 'StarStruck',
    description: 'Accumulate 16 stars on a repository',
    icon: '⭐',
    color: '#FBBF24',
    requirements: {
      minStars: 16,
      action: 'star_added',
    },
  },
  PUBLIC_SPONSOR: {
    id: 'PUBLIC_SPONSOR',
    name: 'Public Sponsor',
    description: 'Sponsor an open source contributor',
    icon: '💝',
    color: '#00D9FF',
    requirements: {
      activeSponsorship: true,
      action: 'sponsorship',
    },
  },
  HEART_ON_YOUR_SLEEVE: {
    id: 'HEART_ON_YOUR_SLEEVE',
    name: 'Heart On Your Sleeve',
    description: 'Created a repository that has multiple hearts',
    icon: '💖',
    color: '#EF4444',
    requirements: {
      minProfileStars: 1,
      action: 'profile_star',
    },
  },
} as const

export const ACHIEVEMENT_IDS = Object.values(ACHIEVEMENTS).map((a) => a.id)

export const PAGES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  LEADERBOARD: '/leaderboard',
  GUIDES: '/guides',
  SETTINGS: '/settings',
} as const

export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_CALLBACK: '/api/auth/callback',
  AUTH_ME: '/api/auth/me',

  // Users
  GET_USER: (username: string) => `/api/users/${username}`,
  UPDATE_PROFILE: '/api/users/profile',
  GET_USER_ACHIEVEMENTS: (username: string) => `/api/users/${username}/achievements`,

  // Achievements
  GET_ACHIEVEMENTS: '/api/achievements',
  GET_ACHIEVEMENT: (id: string) => `/api/achievements/${id}`,
  CHECK_ACHIEVEMENT: (id: string) => `/api/achievements/${id}/check`,
  GET_ACHIEVEMENT_GUIDE: (id: string) => `/api/achievements/${id}/guide`,

  // Leaderboard
  GET_LEADERBOARD: '/api/leaderboard',
  GET_LEADERBOARD_FRIENDS: '/api/leaderboard/friends',

  // Activity
  GET_ACTIVITY_FEED: '/api/activity/feed',
  GET_NOTIFICATIONS: '/api/activity/notifications',

  // Social
  FOLLOW_USER: (username: string) => `/api/users/${username}/follow`,
  UNFOLLOW_USER: (username: string) => `/api/users/${username}/unfollow`,
} as const

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You must be logged in to perform this action',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  SERVER_ERROR: 'An error occurred. Please try again later',
  NETWORK_ERROR: 'Unable to connect to the server',
  INVALID_INPUT: 'Please check your input and try again',
} as const

export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully',
  ACHIEVEMENT_UNLOCKED: 'Achievement unlocked!',
  COPIED_TO_CLIPBOARD: 'Copied to clipboard',
  FOLLOWED_USER: 'User followed successfully',
  UNFOLLOWED_USER: 'User unfollowed successfully',
} as const

export const LIMITS = {
  MAX_BIO_LENGTH: 500,
  MAX_USERNAME_LENGTH: 39,
  PAGE_SIZE: 20,
  MAX_NOTIFICATIONS: 50,
  API_RATE_LIMIT: 100, // requests per minute
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
} as const

export const TIMING = {
  TOAST_DURATION: 5000, // 5 seconds
  DEBOUNCE_DELAY: 300, // milliseconds
  THROTTLE_LIMIT: 500, // milliseconds
  ANIMATION_DURATION: 300, // milliseconds
} as const

export const GITHUB_CONSTANTS = {
  API_BASE_URL: 'https://api.github.com',
  API_VERSION: 'application/vnd.github.v3+json',
  RATE_LIMIT_WINDOW: 3600, // 1 hour in seconds
} as const
