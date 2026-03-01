# 🚀 GitGenie - Implementation Guide & Getting Started

**Version:** 1.0  
**Target Start Date:** March 1, 2026  
**Framework:** Next.js + Express.js + PostgreSQL

---

## 📋 Table of Contents

1. [Pre-Development Checklist](#pre-development-checklist)
2. [Environment Setup](#environment-setup)
3. [Project Initialization](#project-initialization)
4. [Folder Structure](#folder-structure)
5. [Development Workflow](#development-workflow)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Key Implementation Tasks](#key-implementation-tasks)

---

## ✅ Pre-Development Checklist

### Tools & Software
- [ ] Node.js 18+ installed
- [ ] npm or yarn package manager
- [ ] Git configured
- [ ] GitHub account (personal + test account)
- [ ] PostgreSQL installed locally or Docker
- [ ] Redis installed locally or Docker
- [ ] Docker Desktop (recommended)
- [ ] VS Code with extensions:
  - [ ] ES Lint
  - [ ] Prettier
  - [ ] Thunder Client or Postman (API testing)
  - [ ] GitLens
  - [ ] Tailwind CSS IntelliSense
  - [ ] Thunder Database (PostgreSQL viewer)

### GitHub Setup
- [ ] Main GitHub account ready (JesunAhmadUshno)
- [ ] Test GitHub account created
- [ ] Personal Access Token generated (for API testing)
- [ ] Repository created (GitGenie)
- [ ] Repository description updated
- [ ] GitHub Pages enabled (for future hosting)

### Documentation
- [ ] Read through PROJECT_ARCHITECTURE.md
- [ ] Read through DESIGN_SYSTEM.md
- [ ] Create .env.example template
- [ ] Create CONTRIBUTING.md
- [ ] Create CHANGELOG.md

---

## 🛠️ Environment Setup

### 1. Install Dependencies

```bash
# Create project directory
mkdir gitgenie
cd gitgenie

# Initialize Node project
npm init -y

# Install core dependencies
npm install next react react-dom axios prisma @prisma/client

# Install styling
npm install tailwindcss postcss autoprefixer
npm install framer-motion three @react-three/fiber @react-three/drei

# Install utilities
npm install zustand js-cookie next-auth clsx tailwind-merge

# Install dev dependencies
npm install --save-dev typescript @types/node @types/react
npm install --save-dev eslint prettier eslint-config-next
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev vitest playwright

# Backend dependencies (Express server)
npm install express cors dotenv helmet express-ratelimit
npm install bcryptjs jsonwebtoken passport passport-github2
npm install socket.io bull redis prisma
npm install winston sentry/node
```

### 2. Environment Variables Setup

Create `.env.local`:
```bash
# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/callback/github

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gitgenie_dev
REDIS_URL=redis://localhost:6379

# API
NEXT_PUBLIC_API_URL=http://localhost:3000
API_SECRET=your_secret_key_here

# Authentication
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here

# Third-party APIs
SENTRY_DSN=your_sentry_dsn

# Environment
NODE_ENV=development
DEBUG=true
```

### 3. Database Setup (Docker Compose)

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: gitgenie_postgres
    environment:
      POSTGRES_USER: gitgenie_user
      POSTGRES_PASSWORD: gitgenie_password
      POSTGRES_DB: gitgenie_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - gitgenie_network

  redis:
    image: redis:7-alpine
    container_name: gitgenie_redis
    ports:
      - "6379:6379"
    networks:
      - gitgenie_network

  adminer:
    image: adminer
    container_name: gitgenie_adminer
    ports:
      - "8080:8080"
    networks:
      - gitgenie_network

volumes:
  postgres_data:

networks:
  gitgenie_network:
    driver: bridge
```

Run:
```bash
docker-compose up -d
```

---

## 📁 Project Initialization

### 1. Next.js Setup

```bash
npx create-next-app@latest . --typescript --tailwind --eslint
# Follow prompts:
# - Use TypeScript? Yes
# - Use Tailwind CSS? Yes
# - Use ESLint? Yes
# - Use `src/` directory? No
# - Use App Router? Yes
# - Use Turbopack? No
# - Customize alias paths? No
```

### 2. Tailwind Configuration

Update `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#A855F7',
        secondary: '#EC4899',
        accent: '#00D9FF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { 'box-shadow': '0 0 20px rgba(168,85,247,0.3)' },
          '50%': { 'box-shadow': '0 0 40px rgba(168,85,247,0.6)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

### 3. TypeScript Configuration

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"],
      "@/hooks/*": ["./hooks/*"],
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

---

## 📂 Folder Structure

```
gitgenie/
├── .github/
│   └── workflows/
│       ├── test.yml
│       ├── build.yml
│       └── deploy.yml
│
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home/landing page
│   └── (authenticated)/
│       ├── dashboard/
│       │   └── page.tsx           # Main dashboard
│       ├── profile/
│       │   ├── page.tsx
│       │   └── [username]/
│       │       └── page.tsx       # User profile
│       ├── leaderboard/
│       │   └── page.tsx
│       ├── guides/
│       │   ├── page.tsx
│       │   └── [achievement]/
│       │       └── page.tsx
│       └── settings/
│           └── page.tsx
│
│
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   │
│   ├── Achievement/
│   │   ├── AchievementBadge.tsx
│   │   ├── AchievementGrid.tsx
│   │   ├── AchievementModal.tsx
│   │   └── ProgressRing.tsx
│   │
│   ├── Dashboard/
│   │   ├── StatsOverview.tsx
│   │   ├── QuickActions.tsx
│   │   ├── AchievementOverview.tsx
│   │   └── ActivityFeed.tsx
│   │
│   ├── Leaderboard/
│   │   ├── LeaderboardTable.tsx
│   │   ├── UserCard.tsx
│   │   └── Filters.tsx
│   │
│   ├── UI/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Spinner.tsx
│   │   └── Skeleton.tsx
│   │
│   └── Shared/
│       ├── ThemeToggle.tsx
│       ├── UserMenu.tsx
│       └── NotificationCenter.tsx
│
├── lib/
│   ├── api/
│   │   ├── github.ts             # GitHub API integration
│   │   ├── auth.ts               # Auth helpers
│   │   └── achievements.ts       # Achievement logic
│   │
│   ├── utils/
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   │
│   └── db/
│       ├── client.ts             # Prisma client
│       └── queries.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useAchievements.ts
│   ├── useUser.ts
│   ├── useLeaderboard.ts
│   ├── useLocalStorage.ts
│   └── useTheme.ts
│
├── store/
│   ├── authStore.ts
│   ├── uiStore.ts
│   └── achievementStore.ts
│
├── types/
│   ├── index.ts
│   ├── achievement.ts
│   ├── user.ts
│   └── auth.ts
│
├── styles/
│   ├── globals.css
│   ├── animations.css
│   └── variables.css
│
├── public/
│   ├── badges/
│   ├── icons/
│   └── images/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── server/
│   ├── index.ts                  # Express server entry
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── achievements.ts
│   │   ├── users.ts
│   │   └── leaderboard.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errors.ts
│   │   └── logging.ts
│   │
│   ├── services/
│   │   ├── achiev ementsService.ts
│   │   ├── githubService.ts
│   │   ├── leaderboardService.ts
│   │   └── notificationService.ts
│   │
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   │
│   └── config/
│       ├── database.ts
│       ├── redis.ts
│       └── oauth.ts
│
├── .env.example
├── .env.local
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── package.json
├── package-lock.json
├── docker-compose.yml
├── Dockerfile
├── README.md
├── PROJECT_ARCHITECTURE.md
├── DESIGN_SYSTEM.md
└── IMPLEMENTATION_GUIDE.md (this file)
```

---

## 💻 Development Workflow

### 1. Daily Development Process

```bash
# Start project
docker-compose up -d              # Start PostgreSQL & Redis
npm run dev                       # Start Next.js dev server

# In another terminal
npm run server:dev                # Start Express backend

# In browser
open http://localhost:3000        # Frontend
open http://localhost:3001        # Backend API
```

### 2. Git Workflow

```bash
# Create feature branch
git checkout -b feature/achievement-tracking

# Make changes, commit frequently
git add .
git commit -m "feat: add achievement detection"

# Push and create PR
git push origin feature/achievement-tracking

# After review and CI passes
git merge --squash feature/achievement-tracking
git push origin main
```

### 3. Code Quality

```bash
# Lint
npm run lint

# Format
npm run format

# Type check
npm run type-check

# Test
npm run test
npm run test:unit
npm run test:e2e
```

---

## 🗄️ Database Schema (Prisma)

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User management
model User {
  id String @id @default(cuid())
  
  // GitHub info
  githubId Int @unique
  githubUsername String @unique
  githubProfile String
  email String? @unique
  avatarUrl String?
  
  // Profile
  bio String?
  location String?
  websiteUrl String?
  
  // Settings
  theme String @default("dark")
  emailNotifications Boolean @default(true)
  publicProfile Boolean @default(true)
  
  // Relations
  achievements Achievement[]
  followers Follow[] @relation("follower")
  following Follow[] @relation("following")
  activityLogs ActivityLog[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([githubUsername])
}

// Achievement tracking
model Achievement {
  id String @id @default(cuid())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String
  
  type String // ENUM: QUICK_DRAW, PULL_SHARK, YOLO, PAIR_EXTRAORDINAIRE, GALAXY_BRAIN, STARSTRUCK, PUBLIC_SPONSOR, HEART_ON_YOUR_SLEEVE
  
  progress Int @default(0) // 0-100%
  unlockedAt DateTime?
  
  metadata Json? // Extra data per achievement
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([userId, type])
  @@index([userId])
  @@index([type])
  @@index([unlockedAt])
}

// Social following
model Follow {
  id String @id @default(cuid())
  
  follower User @relation("follower", fields: [followerId], references: [id], onDelete: Cascade)
  followerId String
  
  following User @relation("following", fields: [followingId], references: [id], onDelete: Cascade)
  followingId String
  
  createdAt DateTime @default(now())
  
  @@unique([followerId, followingId])
  @@index([followerId])
  @@index([followingId])
}

// Activity log
model ActivityLog {
  id String @id @default(cuid())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String
  
  action String // Event type
  description String?
  payload Json? // Extra data
  
  githubEventId String? // GitHub event ID
  githubEventType String? // PR, Issue, Discussion, etc.
  
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([action])
  @@index([createdAt])
}

// Session management
model Session {
  id String @id @default(cuid())
  
  userId String
  token String @unique
  expiresAt DateTime
  
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([expiresAt])
}
```

### Database Migrations

```bash
# Create migration
npx prisma migrate dev --name init

# Push schema to database
npx prisma db push

# View database
npx prisma studio
```

---

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/github          # Initiate GitHub login
GET /api/auth/callback/github  # GitHub callback
POST /api/auth/logout          # Logout
GET /api/auth/me               # Current user info
```

### Achievements
```
GET /api/achievements                    # Get all achievements for user
GET /api/achievements/:id                # Get specific achievement details
POST /api/achievements/:id/check         # Check/refresh achievement
GET /api/achievements/:id/guide          # Get guide for achievement
PUT /api/achievements/:id/update         # Update achievement progress
```

### Users
```
GET /api/users/:username               # Get user profile
GET /api/users/:username/achievements  # Get user's achievements
PUT /api/users/profile                 # Update own profile
GET /api/users/:username/follow        # Check follow status
POST /api/users/:username/follow       # Follow user
DELETE /api/users/:username/follow     # Unfollow user
```

### Leaderboard
```
GET /api/leaderboard                   # Get global leaderboard
GET /api/leaderboard?sort=streak       # Leaderboard by metric
GET /api/leaderboard/friends           # Friend leaderboard
GET /api/leaderboard/:achievementType  # Achievement-specific leaderboard
```

### Activity
```
GET /api/activity/feed                 # Activity feed
GET /api/activity/feed?user=:username  # User activity feed
GET /api/activity/notifications        # User notifications
```

---

## 🎯 Key Implementation Tasks

### Phase 1: Foundation (Priority: HIGH)

#### Task 1: Project Setup
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Tailwind CSS with custom theme
- [ ] Configure ESLint & Prettier
- [ ] Set up environment variables
- [ ] Initialize Prisma with PostgreSQL
- [ ] Create folder structure
- [ ] Set up Git repository

**Estimated Time:** 4-6 hours

#### Task 2: GitHub OAuth Setup
- [ ] Register GitHub OAuth application
- [ ] Implement OAuth callback handler
- [ ] Set up session/token management
- [ ] Create authentication middleware
- [ ] Test login flow end-to-end

**Estimated Time:** 6-8 hours

#### Task 3: Database & User Profiles
- [ ] Create Prisma schema
- [ ] Migration: Initialize database
- [ ] Create user creation flow
- [ ] Implement user profile update endpoint
- [ ] Create basic profile UI

**Estimated Time:** 5-8 hours

**Phase 1 Total:** ~15-22 hours

### Phase 2: Core Features (Priority: HIGH)

#### Task 4: Achievement Tracking System
- [ ] Implement achievement detection logic
- [ ] Create achievement monitor service
- [ ] Set up GitHub API event polling
- [ ] Create achievement progress tracking
- [ ] Test detection for each achievement type

**Estimated Time:** 12-16 hours

#### Task 5: Interactive Dashboard
- [ ] Create achievement badge component
- [ ] Build achievement grid layout
- [ ] Implement progress ring visualization
- [ ] Add stats overview section
- [ ] Create real-time notification system
- [ ] Add animation for badge unlocks

**Estimated Time:** 10-14 hours

#### Task 6: Leaderboard System
- [ ] Design leaderboard table/card layout
- [ ] Implement leaderboard query/caching
- [ ] Add sorting & filtering
- [ ] Create user profile cards
- [ ] Implement real-time rank updates

**Estimated Time:** 8-12 hours

**Phase 2 Total:** ~30-42 hours

### Phase 3: Polish & Interactivity (Priority: MEDIUM)

#### Task 7: Advanced Animations
- [ ] Implement Framer Motion animations
- [ ] Add Three.js 3D badge effects
- [ ] Create particle/confetti system
- [ ] Add page transition animations
- [ ] Implement loading skeletons

**Estimated Time:** 12-16 hours

#### Task 8: Real-time Synchronization
- [ ] Set up Socket.io server
- [ ] Implement achievement unlock broadcast
- [ ] Add real-time leaderboard updates
- [ ] Create activity feed streaming
- [ ] Test real-time features

**Estimated Time:** 10-14 hours

#### Task 9: Guide System
- [ ] Create guide template component
- [ ] Write guides for each achievement
- [ ] Add code snippets with copy functionality
- [ ] Implement step-by-step tutorial
- [ ] Add video embedding (YouTube)

**Estimated Time:** 10-14 hours

**Phase 3 Total:** ~32-44 hours

### Phase 4: Community Features (Priority: MEDIUM)

#### Task 10: Social Features
- [ ] Implement follow system
- [ ] Add achievement sharing (social media)
- [ ] Create user network visualization
- [ ] Add team features
- [ ] Implement messaging system (future)

**Estimated Time:** 12-16 hours

#### Task 11: Community Hub
- [ ] Create featured achievements page
- [ ] Build success stories section
- [ ] Implement community challenges
- [ ] Add user verification badges
- [ ] Create partner/sponsor listings

**Estimated Time:** 8-12 hours

**Phase 4 Total:** ~20-28 hours

### Phase 5-6: Launch & Optimization

- Testing, performance optimization, deployment
- Security audit, GDPR compliance
- Marketing materials, documentation
- Launch marketing campaign

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// Example: tests/unit/lib/achievements.test.ts
import { detectQuickDraw, detectPullShark } from '@/lib/achievements'
import { it, expect, describe } from 'vitest'

describe('Achievement Detection', () => {
  it('should detect QuickDraw', () => {
    const issue = { createdAt: new Date(), closedAt: new Date(Date.now() + 4 * 60000) }
    expect(detectQuickDraw(issue)).toBe(true)
  })
})
```

### Integration Tests
```bash
npm run test:integration
# Test API endpoints, database queries
```

### E2E Tests
```bash
npm run test:e2e
# Test complete user flows in browser
```

---

## 🚀 Quick Start Commands

```bash
# Development
npm run dev              # Start Next.js dev server
npm run server:dev      # Start Express backend
docker-compose up       # Start database & Redis

# Quality
npm run lint            # Check code quality
npm run format          # Format code
npm run type-check      # TypeScript check

# Testing
npm run test            # Run all tests
npm run test:unit       # Unit tests only
npm run test:e2e        # E2E tests

# Database
npx prisma studio      # Open database GUI
npx prisma migrate dev  # Create migration

# Building
npm run build           # Production build

# Production
npm start               # Start production server
```

---

**End of Implementation Guide**

*Follow this guide sequentially. Adjust timelines based on your pace and expertise level.*
