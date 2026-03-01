/**
 * Achievement Detection Engine (Client-side)
 * Detects achievements based on GitHub user data
 */

import {
  getGitHubUser,
  getGitHubRepos,
  getGitHubPullRequests,
  getGitHubIssues,
  getUserFollowers,
} from './github'

export type AchievementType =
  | 'quick_draw'
  | 'pull_shark'
  | 'yolo'
  | 'pair_extraordinaire'
  | 'galaxy_brain'
  | 'startstruck'
  | 'public_sponsor'
  | 'heart_on_your_sleeve'

export interface Achievement {
  id: AchievementType
  name: string
  description: string
  icon: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  progress: number
  unlocked: boolean
  unlockedAt?: Date
}

/**
 * Detect all achievements for a user
 */
export async function detectAchievements(username: string): Promise<Achievement[]> {
  const user = await getGitHubUser(username)
  if (!user) return getEmptyAchievements()

  const repos = await getGitHubRepos(username)
  const prs = await getGitHubPullRequests(username)
  const issues = await getGitHubIssues(username)
  const followers = await getUserFollowers(username)

  const achievements: Record<AchievementType, Achievement> = {
    quick_draw: detectQuickDraw(issues),
    pull_shark: detectPullShark(prs),
    yolo: detectYOLO(prs),
    pair_extraordinaire: detectPairExtraordinaire(prs),
    galaxy_brain: detectGalaxyBrain(issues),
    startstruck: detectStarStruck(repos),
    public_sponsor: detectPublicSponsor(user),
    heart_on_your_sleeve: detectHeartOnYourSleeve(followers),
  }

  return Object.values(achievements)
}

/**
 * QuickDraw: Close an issue in under 5 minutes
 * Detected by: Issue closed very quickly (heuristic: assume fast closures on old issues)
 */
function detectQuickDraw(issues: any[]): Achievement {
  const baseAchievement = {
    id: 'quick_draw' as const,
    name: 'QuickDraw',
    description: 'Close an issue in under 5 minutes',
    icon: '⚡',
    rarity: 'rare' as const,
  }

  // Heuristic: If user has many closed issues, likely has quick-closed some
  const closedIssues = issues.filter((i) => i.closed_at)
  const hasQuickCloses = closedIssues.length > 5 // Estimate

  return {
    ...baseAchievement,
    progress: Math.min(100, closedIssues.length * 20),
    unlocked: hasQuickCloses,
    unlockedAt: hasQuickCloses ? new Date() : undefined,
  }
}

/**
 * PullShark: Merge 2+ pull requests
 */
function detectPullShark(prs: any[]): Achievement {
  const mergedPRs = prs.filter((pr) => pr.merged_at)

  return {
    id: 'pull_shark' as const,
    name: 'Pull Shark',
    description: 'Merge 2+ pull requests',
    icon: '🦈',
    rarity: 'uncommon' as const,
    progress: Math.min(100, (mergedPRs.length / 2) * 100),
    unlocked: mergedPRs.length >= 2,
    unlockedAt: mergedPRs.length >= 2 ? new Date() : undefined,
  }
}

/**
 * YOLO: Have a PR merged without review
 * Heuristic: PRs from new accounts or single-commit PRs
 */
function detectYOLO(prs: any[]): Achievement {
  const yoloPRs = prs.filter((pr) => pr.merged_at && pr.review_comments === 0)

  return {
    id: 'yolo' as const,
    name: 'YOLO',
    description: 'PR merged without review',
    icon: '🎉',
    rarity: 'epic' as const,
    progress: Math.min(100, (yoloPRs.length / 1) * 100),
    unlocked: yoloPRs.length >= 1,
    unlockedAt: yoloPRs.length >= 1 ? new Date() : undefined,
  }
}

/**
 * PairExtraordinaire: Co-authored commits
 * Heuristic: Based on username patterns or commit message analysis
 */
function detectPairExtraordinaire(_prs: any[]): Achievement {
  // This would require deeper commit analysis not available in basic API
  // Estimate based on collaborative activity

  return {
    id: 'pair_extraordinaire' as const,
    name: 'Pair Extraordinaire',
    description: 'Co-author commits with others',
    icon: '🤝',
    rarity: 'rare' as const,
    progress: 0,
    unlocked: false, // Requires deeper analysis
  }
}

/**
 * GalaxyBrain: Answer 2+ discussion questions
 * Heuristic: Active in community/issues
 */
function detectGalaxyBrain(issues: any[]): Achievement {
  const answered = issues.length // Rough estimate

  return {
    id: 'galaxy_brain' as const,
    name: 'Galaxy Brain',
    description: 'Answer 2+ discussion questions',
    icon: '🧠',
    rarity: 'epic' as const,
    progress: Math.min(100, (answered / 2) * 100),
    unlocked: answered >= 2,
    unlockedAt: answered >= 2 ? new Date() : undefined,
  }
}

/**
 * StarStruck: Get 16+ repository stars
 */
function detectStarStruck(repos: any[]): Achievement {
  const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)

  return {
    id: 'startstruck' as const,
    name: 'StarStruck',
    description: 'Get 16+ repository stars',
    icon: '⭐',
    rarity: 'epic' as const,
    progress: Math.min(100, (totalStars / 16) * 100),
    unlocked: totalStars >= 16,
    unlockedAt: totalStars >= 16 ? new Date() : undefined,
  }
}

/**
 * PublicSponsor: Become a GitHub Sponsor
 * Heuristic: Check if user has sponsors profile
 */
function detectPublicSponsor(user: any): Achievement {
  // GitHub API doesn't easily expose sponsor status
  // Would need additional API call or GitHub GraphQL

  return {
    id: 'public_sponsor' as const,
    name: 'Public Sponsor',
    description: 'Become a GitHub sponsor',
    icon: '💝',
    rarity: 'legendary' as const,
    progress: 0,
    unlocked: false,
  }
}

/**
 * HeartOnYourSleeve: Receive profile stars
 */
function detectHeartOnYourSleeve(followers: any[]): Achievement {
  return {
    id: 'heart_on_your_sleeve' as const,
    name: 'Heart On Your Sleeve',
    description: 'Receive profile stars from others',
    icon: '💖',
    rarity: 'uncommon' as const,
    progress: Math.min(100, (followers.length / 16) * 100),
    unlocked: followers.length > 0,
    unlockedAt: followers.length > 0 ? new Date() : undefined,
  }
}

/**
 * Get empty achievements for new users
 */
function getEmptyAchievements(): Achievement[] {
  return [
    {
      id: 'quick_draw',
      name: 'QuickDraw',
      description: 'Close an issue in under 5 minutes',
      icon: '⚡',
      rarity: 'rare',
      progress: 0,
      unlocked: false,
    },
    {
      id: 'pull_shark',
      name: 'Pull Shark',
      description: 'Merge 2+ pull requests',
      icon: '🦈',
      rarity: 'uncommon',
      progress: 0,
      unlocked: false,
    },
    {
      id: 'yolo',
      name: 'YOLO',
      description: 'Have a PR merged without review',
      icon: '🎉',
      rarity: 'epic',
      progress: 0,
      unlocked: false,
    },
    {
      id: 'pair_extraordinaire',
      name: 'Pair Extraordinaire',
      description: 'Co-author commits with others',
      icon: '🤝',
      rarity: 'rare',
      progress: 0,
      unlocked: false,
    },
    {
      id: 'galaxy_brain',
      name: 'Galaxy Brain',
      description: 'Answer 2+ discussion questions',
      icon: '🧠',
      rarity: 'epic',
      progress: 0,
      unlocked: false,
    },
    {
      id: 'startstruck',
      name: 'StarStruck',
      description: 'Get 16+ repository stars',
      icon: '⭐',
      rarity: 'epic',
      progress: 0,
      unlocked: false,
    },
    {
      id: 'public_sponsor',
      name: 'Public Sponsor',
      description: 'Become a GitHub sponsor',
      icon: '💝',
      rarity: 'legendary',
      progress: 0,
      unlocked: false,
    },
    {
      id: 'heart_on_your_sleeve',
      name: 'Heart On Your Sleeve',
      description: 'Receive profile stars from others',
      icon: '💖',
      rarity: 'uncommon',
      progress: 0,
      unlocked: false,
    },
  ]
}
