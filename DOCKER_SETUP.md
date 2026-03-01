# Docker Setup Guide

This guide covers setting up and running GitGenie using Docker for both local development and production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Production Deployment](#production-deployment)
4. [Common Commands](#common-commands)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Docker:** [Install Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Docker Compose:** Included with Docker Desktop
- **Git:** For cloning the repository

Verify installation:
```bash
docker --version
docker-compose --version
```

---

## Local Development

### Quick Start

1. **Start Services:**
   ```bash
   docker-compose up -d
   ```

2. **Check Status:**
   ```bash
   docker-compose ps
   ```

   Expected output:
   ```
   CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS        PORTS
   xxx            postgres:15-alpine  "docker-entrypoint..."  2 seconds ago   Up 2 seconds  5432/5432
   yyy            redis:7-alpine     "redis-server"           2 seconds ago   Up 2 seconds  6379/6379
   ```

3. **Access Services:**
   - **PostgreSQL:** localhost:5432
     - Username: `gitgenie_user`
     - Password: `gitgenie_password`
     - Database: `gitgenie_dev`
   
   - **Redis:** localhost:6379
   
   - **Adminer (Database UI):** http://localhost:8080
     - **System:** PostgreSQL
     - **Server:** postgres
     - **Username:** gitgenie_user
     - **Password:** gitgenie_password
     - **Database:** gitgenie_dev

4. **Initialize Database:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start Application:**
   ```bash
   # Terminal 1: Frontend
   npm run dev
   
   # Terminal 2: Backend
   npm run server:dev
   ```

   Application runs at:
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:3001
   - **Backend Health:** http://localhost:3001/health

### Environment Variables for Development

Create `.env.local`:
```env
# Database
DATABASE_URL=postgresql://gitgenie_user:gitgenie_password@localhost:5432/gitgenie_dev

# Redis
REDIS_URL=redis://localhost:6379

# GitHub OAuth (get from https://github.com/settings/developers)
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# Authentication
JWT_SECRET=dev_jwt_secret_change_in_production
SESSION_SECRET=dev_session_secret_change_in_production

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
API_ORIGIN=http://localhost:3000

# Node Environment
NODE_ENV=development
```

### Useful Local Development Commands

**View Service Logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f postgres
docker-compose logs -f redis
```

**Connect to PostgreSQL:**
```bash
docker exec -it gitgenie_postgres psql -U gitgenie_user -d gitgenie_dev
```

**Connect to Redis:**
```bash
docker exec -it gitgenie_redis redis-cli
```

**Stop Services:**
```bash
docker-compose down

# With volume cleanup (WARNING: Deletes database data)
docker-compose down -v
```

**Restart Services:**
```bash
docker-compose restart

# Specific service
docker-compose restart postgres
```

**Rebuild Services:**
```bash
docker-compose up --build
```

---

## Production Deployment

### Environment Setup

1. **Create `.env.production`:**
   ```env
   # Database (use managed database in production)
   DATABASE_URL=postgresql://user:password@db.production.example.com:5432/gitgenie

   # Redis (use managed cache in production)
   REDIS_URL=redis://:password@cache.production.example.com:6379

   # GitHub OAuth
   GITHUB_CLIENT_ID=production_client_id
   GITHUB_CLIENT_SECRET=production_client_secret

   # Authentication (generate strong secrets)
   JWT_SECRET=$(openssl rand -base64 32)
   SESSION_SECRET=$(openssl rand -base64 32)

   # API Configuration
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   API_ORIGIN=https://yourdomain.com

   # Node Environment
   NODE_ENV=production
   ```

2. **Generate Secure Secrets:**
   ```bash
   # Generate JWT_SECRET
   openssl rand -base64 32

   # Generate SESSION_SECRET
   openssl rand -base64 32
   ```

### Deploy with Docker Compose

1. **Pull Latest Code:**
   ```bash
   git clone https://github.com/yourusername/gitgenie.git
   cd gitgenie
   git pull origin main
   ```

2. **Build Images:**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

3. **Start Services:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Run Migrations:**
   ```bash
   docker exec gitgenie_backend_prod npx prisma migrate deploy
   ```

5. **Verify Health:**
   ```bash
   # Check container status
   docker-compose -f docker-compose.prod.yml ps

   # Check backend health
   curl http://localhost:3001/health

   # Check frontend
   curl http://localhost:3000
   ```

### Production Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 Nginx/Load Balancer                      │
│              (Reverse Proxy, SSL/TLS)                    │
└──────────────┬──────────────────────────┬────────────────┘
               │                          │
        ┌──────▼─────┐            ┌──────▼─────┐
        │  Frontend   │            │  Backend    │
        │ (Next.js)   │            │ (Express)   │
        │ :3000       │            │ :3001       │
        └──────┬─────┘            └──────┬─────┘
               │                          │
               └──────────────┬───────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
             ┌──────▼───────┐    ┌──────▼─────┐
             │  PostgreSQL  │    │  Redis     │
             │  (Database)  │    │  (Cache)   │
             └──────────────┘    └────────────┘
```

### Deployment Platforms

**Option 1: Railway.app (Recommended)**
- Automatically builds Docker images
- Built-in PostgreSQL and Redis add-ons
- Deploy with `railway link` and `railway up`

**Option 2: DigitalOcean App Platform**
- Supports Docker Compose files
- Managed databases available
- Automatic HTTPS

**Option 3: AWS ECS**
- Multi-container Docker deployments
- RDS for PostgreSQL
- ElastiCache for Redis

**Option 4: Self-Hosted (VPS)**
- Full control, more configuration
- Use nginx as reverse proxy
- Use Certbot for SSL/TLS
- Manual database backups

### Monitoring and Maintenance

**View Logs:**
```bash
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

**Backup Database:**
```bash
docker exec gitgenie_postgres_prod pg_dump -U gitgenie_user gitgenie_dev > backup.sql
```

**Restore Database:**
```bash
docker exec -i gitgenie_postgres_prod psql -U gitgenie_user gitgenie_dev < backup.sql
```

**Update Application:**
```bash
git pull origin main
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
docker exec gitgenie_backend_prod npx prisma migrate deploy
```

---

## Common Commands

### Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Run database migrations
docker exec gitgenie_postgres psql -U gitgenie_user -d gitgenie_dev -f migration.sql

# Seed database
npm run db:seed
```

### Production

```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down

# Apply migrations
docker exec gitgenie_backend_prod npx prisma migrate deploy

# Prune unused images
docker image prune -a

# Prune all unused resources
docker system prune -a
```

### Container Management

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# View container logs
docker logs -f <container_id>

# Execute command in container
docker exec -it <container_id> /bin/sh

# Stop container
docker stop <container_id>

# Remove container
docker rm <container_id>

# View container resource usage
docker stats
```

---

## Troubleshooting

### Services Won't Start

**Issue:** `docker-compose up` fails
**Solution:**
```bash
# Check for port conflicts
netstat -an | grep 5432      # PostgreSQL
netstat -an | grep 6379      # Redis
netstat -an | grep 3000      # Frontend
netstat -an | grep 3001      # Backend

# Free port (Windows)
netsh int ipv4 show tcpconnections

# Restart Docker daemon
systemctl restart docker
```

### Database Connection Issues

**Issue:** `Cannot connect to PostgreSQL`
**Solution:**
```bash
# Check container logs
docker-compose logs postgres

# Verify health
docker-compose ps postgres

# Connect directly
docker exec -it gitgenie_postgres psql -U gitgenie_user -c "\l"

# Reset database
docker-compose down -v
docker-compose up -d
npm run db:push
```

### Redis Connection Failed

**Issue:** `Cannot connect to Redis`
**Solution:**
```bash
# Check Redis status
docker-compose ps redis

# View logs
docker-compose logs redis

# Test connection
docker exec -it gitgenie_redis redis-cli ping
# Expected: PONG

# Reset Redis
docker-compose restart redis
```

### Out of Disk Space

**Issue:** `no space left on device`
**Solution:**
```bash
# View Docker disk usage
docker system df

# Remove unused volumes
docker volume prune

# Remove unused images
docker image prune -a

# Remove unused networks
docker network prune

# Full cleanup
docker system prune -a --volumes
```

### Slow Database Queries

**Issue:** Application running slowly
**Solution:**
```bash
# Check PostgreSQL logs
docker-compose logs postgres | grep "duration"

# Connect and analyze
docker exec -it gitgenie_postgres psql -U gitgenie_user -d gitgenie_dev

# Inside psql:
# \dt                    - Show tables
# \di                    - Show indexes
# EXPLAIN ANALYZE ...    - Analyze query performance
```

### Container Exits Immediately

**Issue:** Container starts but exits
**Solution:**
```bash
# Check exit logs
docker compose logs backend
docker compose logs frontend

# Check environment variables
docker exec -it gitgenie_backend_prod env | grep -i database

# Check file permissions
docker exec -it gitgenie_backend_prod ls -la
```

---

## Security Best Practices

1. **Change Default Passwords:**
   - Never use default credentials in production
   - Use strong, randomly generated secrets

2. **Use Environment Variables:**
   - Store secrets in `.env.production`
   - Never commit secrets to Git

3. **Enable SSL/TLS:**
   - Use Let's Encrypt for free HTTPS
   - Configure with Nginx reverse proxy

4. **Limit Container Permissions:**
   - Run as non-root user (implemented in Dockerfiles)
   - Use read-only filesystems where possible

5. **Keep Images Updated:**
   - Regularly pull latest base images
   - Monitor security advisories

6. **Network Security:**
   - Use Docker networks instead of exposing all ports
   - Use Docker Secrets for sensitive data
   - Implement firewall rules on host

7. **Backup Strategy:**
   - Regular automated backups
   - Test restore procedures
   - Store backups off-site

---

## Performance Optimization

### Resource Limits

Add to docker-compose.yml:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### Multi-stage Builds

Already implemented to minimize image sizes:
- Reduces frontend image from ~500MB to ~150MB
- Reduces backend image from ~400MB to ~120MB

### Caching Strategy

```bash
# Build with cache
docker build --cache-from myimage:latest .

# Disable cache if needed
docker build --no-cache .
```

### Logging Configuration

Limit log sizes in docker-compose.yml:
```yaml
services:
  postgres:
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "3"
```

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Security](https://docs.docker.com/engine/security/)

