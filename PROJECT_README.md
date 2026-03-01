# GitGenie - GitHub Achievement Alchemist

> Transform GitHub activity into collectible achievements with an interactive, mind-bending experience.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Key Features](#key-features)
- [Deployment Options](#deployment-options)
- [Documentation](#documentation)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)
- [Community](#community)

---

## Quick Start

### For Local Development

```bash
# 1. Clone repository
git clone https://github.com/yourusername/gitgenie.git
cd gitgenie

# 2. Install dependencies
npm install

# 3. Start Docker services (PostgreSQL, Redis)
docker-compose up -d

# 4. Initialize database
npm run db:push
npm run db:seed

# 5. Run development servers
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run server:dev
```

Access the application:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Database UI:** http://localhost:8080 (Adminer)

### For Production Deployment

**Docker Compose (Recommended for VPS):**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Kubernetes (Recommended for scale):**
```bash
kubectl apply -f k8s/namespace-and-config.yaml
kubectl apply -f k8s/postgres-statefulset.yaml
kubectl apply -f k8s/redis-statefulset.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

---

## Project Overview

### What is GitGenie?

GitGenie is an interactive GitHub achievement platform that transforms GitHub activity into collectible badges and achievements. Users unlock achievements by reaching milestones in their GitHub journey:

- **QuickDraw** - Close an issue in under 5 minutes
- **Pull Shark** - Merge 2+ pull requests
- **YOLO** - Have a PR merged without review
- **Pair Extraordinaire** - Co-author commits with others
- **Galaxy Brain** - Answer 2+ discussion questions
- **StarStruck** - Get 16+ repository stars
- **Public Sponsor** - Become a GitHub sponsor
- **Heart On Your Sleeve** - Receive profile stars from others

### Core Purpose

Gamify GitHub activity with:
- **Real-time achievement unlocks** via GitHub webhook integration
- **Interactive achievement showcase** with animations and effects
- **Leaderboards** showing top GitHub achievers
- **Social features** for following and comparing with friends
- **Activity tracking** for detailed GitHub metrics

---

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (React 18, TypeScript)
- **Styling:** Tailwind CSS with custom theme
- **Animations:** Framer Motion, Three.js, GSAP
- **State Management:** Zustand (global), TanStack Query (server)
- **UI Components:** Custom built (Button, Card, Input, Modal, etc.)

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Authentication:** Passport.js (GitHub OAuth 2.0)
- **Database:** PostgreSQL + Prisma ORM
- **Caching:** Redis
- **Real-time:** Socket.io WebSocket
- **API:** REST + GraphQL ready

### Infrastructure
- **Frontend Hosting:** Vercel (recommended)
- **Backend Hosting:** Railway, DigitalOcean, AWS ECS, or self-hosted
- **Database:** PostgreSQL (managed or self-hosted)
- **Cache:** Redis (managed or self-hosted)
- **Container Registry:** GitHub Container Registry

### DevOps
- **Containerization:** Docker (multi-stage builds)
- **Orchestration:** Kubernetes (k8s manifests included)
- **CI/CD:** GitHub Actions (workflows included)
- **Monitoring:** Prometheus/Grafana ready
- **IaC:** Kubernetes YAML manifests

---

## Key Features

### ✨ Features Implemented

- [x] Responsive design system with animations
- [x] Achievement tracking system
- [x] Landing page with feature showcase
- [x] Type-safe codebase (TypeScript)
- [x] State management (Zustand stores)
- [x] Database schema (Prisma)
- [x] Custom UI components library
- [x] Docker containerization
- [x] Kubernetes deployment manifests
- [x] GitHub Actions CI/CD pipelines

### 🚀 In Development

- [ ] GitHub OAuth authentication
- [ ] API routes and endpoints
- [ ] Achievement detection engine
- [ ] Leaderboard system
- [ ] Real-time updates (Socket.io)
- [ ] User dashboards
- [ ] Remaining UI components
- [ ] Test coverage (unit, integration, E2E)
- [ ] Analytics and monitoring

### 📝 Planned Features

- [ ] GitHub Insights integration
- [ ] Achievement statistics
- [ ] Custom themes and personalization
- [ ] Achievement sharing on social media
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations
- [ ] Admin dashboard for moderation
- [ ] Achievement customization system

---

## Deployment Options

### Option 1: Local Development (Windows/Mac/Linux)

**Best for:** Learning, testing, local development

```bash
# Docker setup
docker-compose up -d
npm install && npm run db:push

# Run both servers
npm run dev # Terminal 1
npm run server:dev # Terminal 2
```

**Resources needed:** 2GB RAM, 4GB disk
**Time to deploy:** 5 minutes
**Cost:** Free (local)

### Option 2: Docker on VPS

**Best for:** Small to medium deployments, full control

```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

**Supported providers:**
- DigitalOcean Droplets
- Linode
- AWS EC2
- Google Cloud Compute
- Hetzner
- Vultr

**Resources needed:** 2GB RAM, 20GB disk
**Time to deploy:** 10-15 minutes
**Cost:** $5-20/month for basic VPS

### Option 3: Railway.app (Recommended for Beginners)

**Best for:** Minimal configuration, automatic deploys

```bash
# Connect to Railway and deploy
railway login
railway link
railway up
```

**What Railway provides:**
- Automatic PostgreSQL and Redis
- Free SSL/TLS
- Automatic deployments from GitHub
- Built-in monitoring
- One-click rollbacks

**Resources:** Managed (scales automatically)
**Time to deploy:** 5 minutes
**Cost:** Free tier + usage-based pricing

### Option 4: Kubernetes (Recommended for Scale)

**Best for:** Production deployments, high availability, autoscaling

```bash
# Deploy to any k8s cluster
kubectl apply -f k8s/namespace-and-config.yaml
kubectl apply -f k8s/postgres-statefulset.yaml
kubectl apply -f k8s/redis-statefulset.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

**Supported providers:**
- EKS (Amazon Elastic Kubernetes Service)
- GKE (Google Kubernetes Engine)
- AKS (Azure Kubernetes Service)
- DigitalOcean Kubernetes
- Self-hosted clusters

**Resources:** 3+ nodes, 8GB+ RAM
**Time to deploy:** 15-20 minutes
**Cost:** $50-200+/month for managed clusters

---

## Documentation

### Quick References
- **[SETUP.md](SETUP.md)** - Initial setup and configuration
- **[DOCKER_SETUP.md](DOCKER_SETUP.md)** - Docker development and deployment
- **[KUBERNETES_DEPLOYMENT.md](KUBERNETES_DEPLOYMENT.md)** - Kubernetes deployment guide

### Project Documentation
- **[PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md)** - System design, tech stack, phases
- **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Color palette, typography, components, animations
- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Database schema, API endpoints, tasks
- **[EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md)** - Strategic overview and success metrics

### API Documentation
- **API Base URL:** `/api/v1`
- **WebSocket URL:** `WebSocket /socket.io`
- **Rate Limit:** 100 requests per 15 minutes per IP

---

## Development Workflow

### Initial Setup

```bash
# Install Node.js 18+ from: https://nodejs.org

# Clone and setup
git clone https://github.com/yourusername/gitgenie.git
cd gitgenie
npm install

# Create environment file
cp .env.example .env.local

# Update GitHub OAuth credentials
# Get from: https://github.com/settings/applications/new
```

### Running Locally

```bash
# Terminal 1: PostgreSQL, Redis, and utilities
docker-compose up -d

# Terminal 2: Frontend development server
npm run dev
# Access at http://localhost:3000

# Terminal 3: Backend development server
npm run server:dev
# Access at http://localhost:3001
```

### Database Management

```bash
# View database
npm run db:studio

# Run migrations
npm run db:push

# Seed data
npm run db:seed

# Generate migrations
npx prisma migrate dev --name describe_your_change
```

### Code Quality

```bash
# Format code
npm run format

# Check types
npm run type-check

# Lint
npm run lint

# Run tests
npm run test
```

### Deployment

```bash
# Build frontend and backend
npm run build

# Build Docker images
docker build -f Dockerfile.frontend -t gitgenie-frontend:latest .
docker build -f Dockerfile.backend -t gitgenie-backend:latest .

# Deploy to Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Deploy to Kubernetes
kubectl apply -f k8s/
```

---

## Contributing

### Setting Up for Contribution

1. **Fork the repository**
   ```bash
   Visit: https://github.com/yourusername/gitgenie/fork
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/yourname/gitgenie.git
   cd gitgenie
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes**
   - Follow the established code style
   - Add tests for new features
   - Update documentation as needed

5. **Test locally**
   ```bash
   npm run lint
   npm run type-check
   npm run test
   ```

6. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Describe your changes
   - Reference any related issues
   - Include screenshots for UI changes

### Code Standards

- **TypeScript:** Strict mode enabled
- **Formatting:** Prettier (2 spaces, single quotes)
- **Linting:** ESLint with React and TypeScript rules
- **Testing:** Vitest for unit tests, Playwright for E2E
- **Documentation:** JSDoc comments for public APIs

---

## Community

### Getting Help

- **GitHub Issues:** [Report bugs or request features](https://github.com/yourusername/gitgenie/issues)
- **Discussions:** [Ask questions and share ideas](https://github.com/yourusername/gitgenie/discussions)
- **Discord:** [Join our Discord server](https://discord.gg/gitgenie)

### Resources

- [Documentation Site](https://docs.gitgenie.dev)
- [Examples & Tutorials](https://github.com/yourusername/gitgenie/wiki)
- [Blog & Announcements](https://blog.gitgenie.dev)
- [Roadmap](https://github.com/yourusername/gitgenie/projects/1)

### Community Channels

- **Twitter:** [@gitgenie_io](https://twitter.com/gitgenie_io)
- **Email:** support@gitgenie.dev
- **GitHub Discussions:** [Community forum](https://github.com/yourusername/gitgenie/discussions)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **GitHub API** for providing achievement data
- **Next.js team** for the amazing framework
- **Tailwind CSS** for the styling utility library
- **Prisma** for the database ORM
- All contributors and community members

---

## Roadmap

### Phase 1: Foundation (Current)
- [x] Project setup and architecture
- [x] Design system and branding
- [x] Database schema design
- [x] Base UI component library
- [ ] GitHub OAuth integration
- [ ] API endpoint implementation

### Phase 2: Core Features
- [ ] Achievement detection engine
- [ ] Real-time leaderboards
- [ ] User dashboards
- [ ] Activity feeds
- [ ] Social features (follow, compare)

### Phase 3: Enhancement
- [ ] Analytics dashboard
- [ ] Advanced filtering and search
- [ ] Achievement customization
- [ ] Social media share integration
- [ ] Email notifications

### Phase 4: Scale & Polish
- [ ] Performance optimization
- [ ] Mobile app (React Native)
- [ ] Third-party API integrations
- [ ] Admin panel
- [ ] Advanced monitoring

### Phase 5: Expansion
- [ ] Alternative GitHub platforms (GitLab, Gitea)
- [ ] API for developers
- [ ] Marketplace for custom achievements
- [ ] Integration with GitHub Actions

### Phase 6: Production
- [ ] Enterprise features
- [ ] Advanced security
- [ ] Compliance certifications
- [ ] Worldwide CDN
- [ ] 99.99% uptime SLA

---

## Connect With Us

<div align="center">

💡 **Have ideas?** [Start a Discussion](https://github.com/yourusername/gitgenie/discussions)

🐛 **Found a bug?** [Report an Issue](https://github.com/yourusername/gitgenie/issues)

📝 **Want to contribute?** [See Contributing Guide](CONTRIBUTING.md)

⭐ **Love the project?** Give it a star!

</div>

---

**GitGenie** - *Transform your GitHub journey into something magical* ✨
