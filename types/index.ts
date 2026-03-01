// Core type definitions for GitGenie

export type AchievementType =
  | 'QUICK_DRAW'
  | 'PULL_SHARK'
  | 'YOLO'
  | 'PAIR_EXTRAORDINAIRE'
  | 'GALAXY_BRAIN'
  | 'STARSTRUCK'
  | 'PUBLIC_SPONSOR'
  | 'HEART_ON_YOUR_SLEEVE'

export type ActivityAction =
  | 'ACHIEVEMENT_UNLOCKED'
  | 'PR_CREATED'
  | 'PR_MERGED'
  | 'ISSUE_CREATED'
  | 'ISSUE_CLOSED'
  | 'DISCUSSION_ANSWERED'
  | 'STAR_ADDED'
  | 'SPONSORSHIP_ACTIVE'

export interface User {
  id: string
  githubId: number
  githubUsername: string
  githubProfileUrl: string
  email?: string | null
  avatarUrl?: string | null
  bio?: string | null
  location?: string | null
  websiteUrl?: string | null
  theme: string
  emailNotifications: boolean
  publicProfile: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Achievement {
  id: string
  userId: string
  type: AchievementType
  progress: number
  unlockedAt?: Date | null
  metadata?: Record<string, unknown> | null
  createdAt: Date
  updatedAt: Date
}

export interface ActivityLog {
  id: string
  userId: string
  action: ActivityAction
  description?: string | null
  payload?: Record<string, unknown> | null
  githubEventId?: string | null
  githubEventType?: string | null
  createdAt: Date
}

export interface Follow {
  id: string
  followerId: string
  followingId: string
  createdAt: Date
}

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Achievement metadata
export interface AchievementMeta {
  [key: string]: unknown
}

export interface QuickDrawMeta extends AchievementMeta {
  issueId: number
  createdAt: Date
  closedAt: Date
  timeMinutes: number
}

export interface PullSharkMeta extends AchievementMeta {
  mergedPRCount: number
  prs: Array<{
    number: number
    title: string
    mergedAt: Date
  }>
}

export interface YOLOMeta extends AchievementMeta {
  prNumber: number
  title: string
  mergedAt: Date
  hasReviews: boolean
}

export interface PairExtraordinaireMeta extends AchievementMeta {
  coAuthors: Array<{
    username: string
    githubId: number
  }>
  commits: number
}

export interface GalaxyBrainMeta extends AchievementMeta {
  acceptedAnswers: number
  discussions: Array<{
    id: string
    title: string
  }>
}

export interface StarStruckMeta extends AchievementMeta {
  starCount: number
  repositoryUrl: string
}

export interface PublicSponsorMeta extends AchievementMeta {
  sponsoredUsername: string
  sponsorshipDate: Date
  monthlyAmount: number | null
}

export interface HeartOnYourSleeveMeta extends AchievementMeta {
  profileStarCount: number
}

// Auth types
export interface AuthSession {
  user: User
  token: string
  expiresAt: Date
}

export interface GitHubUser {
  id: number
  login: string
  name?: string
  email?: string
  avatar_url: string
  bio?: string
  location?: string
  blog?: string
  public_repos: number
  followers: number
  following: number
}
