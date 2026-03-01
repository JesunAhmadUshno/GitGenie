# Deployment Checklist & Operations Guide

Complete checklist for deploying GitGenie to production with confidence.

## Pre-Deployment

### Environment Setup

- [ ] **GitHub OAuth Application Created**
  - Visit https://github.com/settings/developers
  - Create OAuth App
  - Get `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
  - Set Authorization callback URL to `https://yourdomain.com/api/auth/callback/github`

- [ ] **Domain and DNS**
  - Domain registered
  - DNS A records pointing to server/load balancer
  - DNS records:
    - `yourdomain.com` → Load Balancer IP
    - `www.yourdomain.com` → Load Balancer IP
    - `api.yourdomain.com` → Load Balancer IP (if separate)

- [ ] **SSL/TLS Certificate**
  - [ ] Let's Encrypt certificate setup (automatic with cert-manager in k8s)
  - [ ] Certificate renewal configured
  - [ ] HTTPS enforced in all routes

- [ ] **Secrets Generated**
  ```bash
  JWT_SECRET=$(openssl rand -base64 32)
  SESSION_SECRET=$(openssl rand -base64 32)
  ```
  - JWT_SECRET stored securely
  - SESSION_SECRET stored securely
  - GitHub Client Secret stored securely

- [ ] **Environment Variables Ready**
  - [ ] DATABASE_URL configured
  - [ ] REDIS_URL configured
  - [ ] NEXT_PUBLIC_API_URL configured
  - [ ] API_ORIGIN configured
  - [ ] NODE_ENV set to "production"
  - [ ] All secrets in environment variables (not in code)

### Docker Setup (if using Docker Compose)

- [ ] **Docker Installed**
  - [ ] Docker daemon running
  - [ ] Docker Compose installed
  - [ ] `docker --version` and `docker-compose --version` verify

- [ ] **Docker Images Built**
  ```bash
  docker-compose -f docker-compose.prod.yml build
  ```
  - [ ] Frontend image built successfully
  - [ ] Backend image built successfully
  - [ ] Images tagged correctly

- [ ] **Docker Registry Access**
  - [ ] Container registry set up (Docker Hub or GitHub Container Registry)
  - [ ] Credentials configured
  - [ ] Images pushed to registry

### Kubernetes Setup (if using Kubernetes)

- [ ] **Kubernetes Cluster Available**
  - [ ] Cluster created (EKS, GKE, AKS, or self-hosted)
  - [ ] kubectl configured to access cluster
  - [ ] `kubectl get nodes` shows healthy nodes
  - [ ] Cluster has 3+ nodes for HA
  - [ ] Sufficient resources (8GB+ RAM, 4+ cores)

- [ ] **Required Add-ons Installed**
  - [ ] NGINX Ingress Controller deployed
  - [ ] Cert Manager deployed
  - [ ] Let's Encrypt ClusterIssuer created
  - [ ] Metrics Server deployed
  - [ ] Storage provisioner configured

- [ ] **Kubernetes Manifests Updated**
  - [ ] Image references updated in deployment files
  - [ ] Domain names updated in ingress configuration
  - [ ] Resource limits reviewed and adjusted

---

## Deployment Phase 1: Database

### PostgreSQL Setup

- [ ] **PostgreSQL Running**
  ```bash
  # For Docker Compose
  docker-compose up -d postgres
  
  # For Kubernetes
  kubectl apply -f k8s/postgres-statefulset.yaml
  kubectl wait --for=condition=ready pod -l app=postgres -n gitgenie
  ```

- [ ] **Database Connection Verified**
  ```bash
  # Test connection
  psql -h localhost -U gitgenie_user -d gitgenie -c "SELECT 1"
  ```

- [ ] **Initial Database Created**
  ```bash
  createdb -h localhost -U gitgenie_user gitgenie_dev
  ```

### Database Migrations

- [ ] **Prisma Migrations Completed**
  ```bash
  npm run db:push
  ```

- [ ] **Seed Data Loaded (Optional)**
  ```bash
  npm run db:seed
  ```

- [ ] **Database Schema Verified**
  ```bash
  npm run db:studio
  # Verify all tables exist:
  # - User
  # - Achievement
  # - ActivityLog
  # - Follow
  # - Session
  ```

- [ ] **Backups Scheduled**
  - [ ] Automated daily backups configured
  - [ ] Backup storage secured
  - [ ] Restore procedure tested

### Redis Setup

- [ ] **Redis Running**
  ```bash
  # For Docker Compose
  docker-compose up -d redis
  
  # For Kubernetes
  kubectl apply -f k8s/redis-statefulset.yaml
  ```

- [ ] **Redis Connection Verified**
  ```bash
  redis-cli ping
  # Expected: PONG
  ```

---

## Deployment Phase 2: Backend

### Backend Deployment

- [ ] **Environment Variables Configured**
  - [ ] DATABASE_URL correct
  - [ ] REDIS_URL correct
  - [ ] JWT_SECRET set
  - [ ] SESSION_SECRET set
  - [ ] GITHUB_CLIENT_ID set
  - [ ] GITHUB_CLIENT_SECRET set

- [ ] **Backend Container Running**
  ```bash
  # For Docker Compose
  docker-compose -f docker-compose.prod.yml up -d backend
  
  # For Kubernetes
  kubectl apply -f k8s/backend-deployment.yaml
  kubectl wait --for=condition=available deployment/backend -n gitgenie
  ```

- [ ] **Health Check Passing**
  ```bash
  curl -f http://localhost:3001/health
  # Expected: 200 OK with {"status": "ok"}
  ```

- [ ] **Database Connection Tested**
  ```bash
  # Check backend logs for connection success
  docker logs gitgenie_backend_prod
  # or
  kubectl logs -f -n gitgenie -l app=backend
  ```

### API Port Configuration

- [ ] **API Port Open**
  - [ ] Firewall allows port 3001 (or configured port)
  - [ ] Load balancer configured for backend
  - [ ] CORS configured correctly

---

## Deployment Phase 3: Frontend

### Frontend Deployment

- [ ] **Environment Variables Configured**
  - [ ] NEXT_PUBLIC_API_URL set to backend URL
  - [ ] NODE_ENV set to "production"

- [ ] **Frontend Container Running**
  ```bash
  # For Docker Compose
  docker-compose -f docker-compose.prod.yml up -d frontend
  
  # For Kubernetes
  kubectl apply -f k8s/frontend-deployment.yaml
  kubectl wait --for=condition=available deployment/frontend -n gitgenie
  ```

- [ ] **Frontend Port Open**
  - [ ] Firewall allows port 3000 (or configured port)
  - [ ] Load balancer configured for frontend

- [ ] **Ingress/Reverse Proxy Configured**
  ```bash
  # For Kubernetes
  kubectl apply -f k8s/ingress.yaml
  ```

---

## Deployment Phase 4: SSL/TLS

### HTTPS Configuration

- [ ] **SSL Certificate Generated**
  - [ ] Let's Encrypt certificate obtained or self-signed generated
  - [ ] Certificate valid for all domains (yourdomain.com, www.yourdomain.com, api.yourdomain.com)
  - [ ] Certificate renewal automated

- [ ] **HTTPS Enforced**
  - [ ] All HTTP redirected to HTTPS
  - [ ] HSTS header configured
  - [ ] Security headers in place

- [ ] **Certificate Validation**
  ```bash
  # Check certificate
  openssl s_client -connect yourdomain.com:443
  
  # For k8s
  kubectl describe certificate gitgenie-cert -n gitgenie
  ```

---

## Post-Deployment Testing

### Connectivity Tests

- [ ] **Frontend Accessible**
  ```bash
  curl -I https://yourdomain.com
  # Expected: HTTP/2 200
  ```

- [ ] **Backend API Accessible**
  ```bash
  curl -I https://api.yourdomain.com/health
  # Expected: HTTP/2 200
  ```

- [ ] **Database Connected**
  - [ ] Backend logs show successful connection
  - [ ] No connection timeout errors
  - [ ] Queries executing successfully

- [ ] **Redis Connected**
  - [ ] Cache operations working
  - [ ] No Redis connection errors

### Application Tests

- [ ] **Landing Page Loads**
  - [ ] Visit https://yourdomain.com
  - [ ] Page renders without errors
  - [ ] Animations working
  - [ ] Images loading

- [ ] **Authentication Works**
  - [ ] GitHub OAuth login available
  - [ ] Login redirects to GitHub
  - [ ] Callback returns to application
  - [ ] User session created in database

- [ ] **API Endpoints Working**
  ```bash
  # Test health check
  curl https://api.yourdomain.com/health
  
  # Test auth endpoint
  curl https://api.yourdomain.com/auth/me
  ```

### Performance Tests

- [ ] **Page Load Speed**
  - [ ] Frontend: < 3 seconds (first load)
  - [ ] Frontend: < 1 second (cached)
  - [ ] Backend: < 500ms response time

- [ ] **Database Performance**
  - [ ] No slow queries (> 1s)
  - [ ] Indexes created properly
  - [ ] Connection pool working

- [ ] **Resource Usage**
  - [ ] CPU: < 70% average
  - [ ] Memory: < 80% average disk
  - [ ] Disk: > 20% free space

### Security Tests

- [ ] **HTTPS Working**
  ```bash
  curl -I https://yourdomain.com
  # No SSL warnings
  ```

- [ ] **Security Headers Present**
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-Frame-Options: DENY
  - [ ] X-XSS-Protection: 1; mode=block
  - [ ] Strict-Transport-Security

- [ ] **Secrets Not Exposed**
  - [ ] No secrets in logs
  - [ ] No secrets in environment variable errors
  - [ ] Database credentials not visible

- [ ] **Rate Limiting Working**
  ```bash
  # Make 150+ requests in 1 minute
  for i in {1..150}; do curl https://api.yourdomain.com/health; done
  # Should get 429 (Too Many Requests) after limit
  ```

---

## Monitoring & Alerting

### Monitoring Setup

- [ ] **Logging Configured**
  - [ ] Application logs stored (not lost on restart)
  - [ ] Log aggregation working (ELK, Datadog, CloudWatch)
  - [ ] Log levels appropriate
  - [ ] Error logs alerts configured

- [ ] **Metrics Collected**
  - [ ] CPU usage tracked
  - [ ] Memory usage tracked
  - [ ] Request latency monitored
  - [ ] Error rates monitored
  - [ ] Database connection pool monitored

- [ ] **Health Checks Configured**
  - [ ] Health check endpoint at `/health`
  - [ ] Load balancer uses health check
  - [ ] Automated restarts on health check failure

- [ ] **Uptime Monitoring**
  - [ ] External uptime monitoring (Pingdom, UptimeRobot)
  - [ ] Alerts configured for downtime
  - [ ] Status page available

### Alert Configuration

- [ ] **Critical Alerts Set Up**
  - [ ] Application crashed/not responding
  - [ ] Database connection lost
  - [ ] Redis connection lost
  - [ ] Disk space < 10%
  - [ ] Memory usage > 90%
  - [ ] Error rate > threshold

- [ ] **Alert Channels Configured**
  - [ ] Email alerts
  - [ ] Slack alerts
  - [ ] PagerDuty integration (if applicable)
  - [ ] SMS alerts for critical issues

- [ ] **On-call Schedule**
  - [ ] Team members assigned
  - [ ] Escalation policy defined
  - [ ] Contact information current

---

## Backup & Recovery

### Backup Procedures

- [ ] **Database Backups**
  - [ ] Full backup created
  - [ ] Backups scheduled daily
  - [ ] Backups stored off-site/encrypted
  - [ ] Restore tested successfully

- [ ] **Application Backups**
  - [ ] Configuration files backed up
  - [ ] Environment variables documented
  - [ ] Docker images tagged and stored

- [ ] **Backup Retention Policy**
  - [ ] Daily backups: 7 days
  - [ ] Weekly backups: 4 weeks
  - [ ] Monthly backups: 12 months

### Disaster Recovery

- [ ] **Recovery Plan Documented**
  - [ ] Step-by-step restoration process
  - [ ] Estimated recovery time (RTO)
  - [ ] Estimated data loss (RPO)
  - [ ] Contact information for team

- [ ] **Recovery Testing**
  - [ ] Full restore tested on non-production
  - [ ] Backup integrity verified
  - [ ] Documentation accurate

---

## Scaling Configuration

### Horizontal Scaling

- [ ] **Load Balancer Configured**
  - [ ] Multiple backend instances
  - [ ] Multiple frontend instances
  - [ ] Health checks configured
  - [ ] Session persistence (if needed)

- [ ] **Auto-scaling Enabled** (Kubernetes)
  - [ ] HPA (Horizontal Pod Autoscaler) set up
  - [ ] Min replicas: 2+
  - [ ] Max replicas: 10+
  - [ ] CPU target: 70%
  - [ ] Memory target: 80%

- [ ] **Database Prepared**
  - [ ] Connection pooling configured
  - [ ] Read replicas (if applicable)
  - [ ] Caching optimized

### Performance Optimization

- [ ] **Caching Optimized**
  - [ ] Redis key strategy documented
  - [ ] TTLs set appropriately
  - [ ] Cache hit rate monitored

- [ ] **CDN Configured**
  - [ ] Cloudflare or similar service
  - [ ] Static assets cached
  - [ ] HTTPS enforced

- [ ] **Database Optimized**
  - [ ] Indexes created
  - [ ] Slow queries analyzed
  - [ ] Query optimization done

---

## Maintenance

### Regular Maintenance Tasks

- [ ] **Daily**
  - [ ] Monitor error logs
  - [ ] Check uptime monitoring
  - [ ] Verify backups completed

- [ ] **Weekly**
  - [ ] Review performance metrics
  - [ ] Update security patches
  - [ ] Test backup restoration

- [ ] **Monthly**
  - [ ] Database optimization
  - [ ] Dependency updates review
  - [ ] Security audit

- [ ] **Quarterly**
  - [ ] Full system review
  - [ ] Disaster recovery test
  - [ ] Capacity planning

### Updates & Patches

- [ ] **Security Updates**
  - [ ] Regularly apply patches
  - [ ] Test in staging first
  - [ ] Have rollback plan ready

- [ ] **Dependency Updates**
  - [ ] Review weekly updates
  - [ ] Test major updates
  - [ ] Update lock files

- [ ] **Infrastructure Updates**
  - [ ] Node/Kubernetes version upgrades
  - [ ] Database version upgrades
  - [ ] OS security patches

---

## Post-Production Maintenance

### Week 1

- [ ] Monitor error logs closely
- [ ] Watch performance metrics
- [ ] Engage with first users
- [ ] Document issues found
- [ ] Prepare hotfix procedures

### Month 1

- [ ] Performance optimization based on data
- [ ] User feedback implementation
- [ ] Documentation updates
- [ ] Capacity planning
- [ ] Cost optimization review

### Ongoing

- [ ] Regular backups verified
- [ ] Security patches applied
- [ ] Performance maintained
- [ ] User support provided
- [ ] Roadmap progress tracked

---

## Rollback Procedures

### Rollback Docker Compose

```bash
# Stop and remove containers
docker-compose -f docker-compose.prod.yml down

# Use previous image version
docker-compose -f docker-compose.prod.yml up -d
```

### Rollback Kubernetes

```bash
# Rollback deployment
kubectl rollout undo deployment/backend -n gitgenie
kubectl rollout undo deployment/frontend -n gitgenie

# Watch progress
kubectl rollout status deployment/backend -n gitgenie
```

### Database Rollback

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back

# Or restore from backup
psql -h localhost -U gitgenie_user gitgenie < backup.sql
```

---

## Emergency Contacts

- **DevOps Lead:** 
- **Backend Lead:** 
- **Frontend Lead:** 
- **Database Admin:** 
- **On-call:** 
- **Emergency:** 

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| DevOps Lead | | | |
| Backend Lead | | | |
| QA Lead | | | |
| Product Manager | | | |
| CEO/CTO | | | |

---

**Generated:** $(date)
**Next Review:** One month after deployment
**Status:** Ready for Production ✅
