/**
 * GitHub API Service for GitGenie
 * Fetches data directly from GitHub API
 */

const GITHUB_API = 'https://api.github.com'

interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  name: string
  bio: string
  public_repos: number
  followers: number
  following: number
  created_at: string
}

interface GitHubRepo {
  name: string
  description: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  language: string
  created_at: string
  updated_at: string
  owner: {
    login: string
  }
}

interface PullRequest {
  id: number
  number: number
  title: string
  merged_at: string | null
  created_at: string
}

interface Issue {
  id: number
  number: number
  title: string
  closed_at: string | null
  created_at: string
}

/**
 * Get GitHub user data
 */
export async function getGitHubUser(username: string): Promise<GitHubUser | null> {
  try {
    const res = await fetch(`${GITHUB_API}/users/${username}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

/**
 * Get user's repositories
 */
export async function getGitHubRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`)
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

/**
 * Get user's pull requests
 */
export async function getGitHubPullRequests(username: string): Promise<PullRequest[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/search/issues?q=author:${username}+type:pr&per_page=100&sort=created`
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.items || []
  } catch {
    return []
  }
}

/**
 * Get user's issues
 */
export async function getGitHubIssues(username: string): Promise<Issue[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/search/issues?q=author:${username}+type:issue&per_page=100&sort=created`
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.items || []
  } catch {
    return []
  }
}

/**
 * Get repository details
 */
export async function getRepository(owner: string, repo: string): Promise<GitHubRepo | null> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

/**
 * Check if user follows another user
 */
export async function checkFollows(follower: string, following: string): Promise<boolean> {
  try {
    const res = await fetch(`${GITHUB_API}/users/${follower}/following/${following}`)
    return res.status === 204
  } catch {
    return false
  }
}

/**
 * Get user's followers
 */
export async function getUserFollowers(username: string): Promise<any[]> {
  try {
    const res = await fetch(`${GITHUB_API}/users/${username}/followers?per_page=100`)
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

/**
 * Get rate limit info
 */
export async function getRateLimit(): Promise<{ remaining: number; reset: number } | null> {
  try {
    const res = await fetch(`${GITHUB_API}/rate_limit`)
    if (!res.ok) return null
    const data = await res.json()
    return {
      remaining: data.rate_limit.remaining,
      reset: data.rate_limit.reset,
    }
  } catch {
    return null
  }
}

/**
 * Search GitHub users (for leaderboard)
 */
export async function searchUsers(query: string): Promise<any[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/search/users?q=${encodeURIComponent(query)}&per_page=30&sort=repositories`
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.items || []
  } catch {
    return []
  }
}
