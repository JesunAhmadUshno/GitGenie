# Quick Reference - Common Deployment Tasks

Fast lookup for common deployment and operations commands.

## Table of Contents

- [Local Development](#local-development)
- [Docker Compose](#docker-compose)
- [Kubernetes](#kubernetes)
- [Database Operations](#database-operations)
- [Monitoring & Logs](#monitoring--logs)
- [Troubleshooting](#troubleshooting)
- [Emergency Procedures](#emergency-procedures)

---

## Local Development

### Start Everything

```bash
# Start database and cache
docker-compose up -d

# Install dependencies
npm install

# Initialize database
npm run db:push

# Run frontend and backend
npm run dev              # Terminal 1: Frontend on :3000
npm run server:dev      # Terminal 2: Backend on :3001
```

### Database Tools

```bash
# Access database UI
open http://localhost:8080   # Adminer

# Studio (visual editor)
npm run db:studio

# Reset database
docker-compose down -v      # Delete volumes
docker-compose up -d
npm run db:push
```

### Clean Up

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (warning: deletes data)
docker-compose down -v

# Remove specific service
docker-compose down postgres
```

---

## Docker Compose

### Production Deployment

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down

# Scale service
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

### Update Image

```bash
# Pull latest image
docker pull ghcr.io/yourusername/gitgenie-backend:latest

# Update and restart
docker-compose -f docker-compose.prod.yml up -d --force-recreate backend
```

### Backup Database

```bash
# Backup
docker exec gitgenie_postgres_prod pg_dump -U gitgenie_user gitgenie > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i gitgenie_postgres_prod psql -U gitgenie_user gitgenie < backup.sql
```

---

## Kubernetes

### Deployment

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check status
kubectl get all -n gitgenie

# Watch deployment
kubectl get deployment -n gitgenie --watch
```

### Scale

```bash
# Scale backend
kubectl scale deployment backend --replicas=5 -n gitgenie

# Scale frontend
kubectl scale deployment frontend --replicas=8 -n gitgenie
```

### Update Image

```bash
# Update image
kubectl set image deployment/backend container=backend=ghcr.io/yourusername/gitgenie-backend:v1.1.0 -n gitgenie

# Watch rollout
kubectl rollout status deployment/backend -n gitgenie

# Undo if needed
kubectl rollout undo deployment/backend -n gitgenie
```

### Access

```bash
# Port forward frontend
kubectl port-forward -n gitgenie svc/frontend-service 3000:3000

# Port forward backend
kubectl port-forward -n gitgenie svc/backend-service 3001:3001

# Port forward database
kubectl port-forward -n gitgenie svc/postgres-service 5432:5432

# Exec into pod
kubectl exec -it <pod-name> -n gitgenie -- /bin/sh
```

### Logs

```bash
# View backend logs
kubectl logs -f -n gitgenie -l app=backend

# View frontend logs
kubectl logs -f -n gitgenie -l app=frontend

# View all logs with timestamps
kubectl logs -f -n gitgenie --all-containers --timestamps
```

---

## Database Operations

### Connection

```bash
# Docker Compose
psql -h localhost -U gitgenie_user -d gitgenie

# Kubernetes (with port forward)
kubectl port-forward -n gitgenie svc/postgres-service 5432:5432 &
psql -h localhost -U gitgenie_user -d gitgenie
```

### Migrations

```bash
# Create migration
npx prisma migrate dev --name describe_change

# Deploy migration
npx prisma migrate deploy

# List migrations
npx prisma migrate status

# Reset database (development only)
npx prisma migrate reset
```

### Queries

```bash
# Connect to database
psql -h localhost -U gitgenie_user -d gitgenie

# List tables
\dt

# Describe table
\d achievements

# Count records
SELECT COUNT(*) FROM users;

# View recent activity
SELECT * FROM "ActivityLog" ORDER BY id DESC LIMIT 10;
```

### Backup and Restore

```bash
# Full backup
pg_dump -h localhost -U gitgenie_user gitgenie > backup.sql

# Backup specific table
pg_dump -h localhost -U gitgenie_user -t users gitgenie > users_backup.sql

# Restore full
psql -h localhost -U gitgenie_user gitgenie < backup.sql

# Restore to different database
createdb gitgenie_restored
psql -h localhost -U gitgenie_user gitgenie_restored < backup.sql
```

---

## Monitoring & Logs

### Check Health

```bash
# Frontend
curl -I http://localhost:3000

# Backend
curl http://localhost:3001/health
curl http://localhost:3001/health/detailed

# Database (with port forward)
kubectl port-forward -n gitgenie svc/postgres-service 5432:5432 &
psql -h localhost -U gitgenie_user -d gitgenie -c "SELECT 1"
```

### View Metrics (Kubernetes)

```bash
# Pod resource usage
kubectl top pods -n gitgenie

# Node resource usage
kubectl top nodes

# Watch resource usage
kubectl top pods -n gitgenie --watch
```

### Application Logs

```bash
# Docker Compose
docker-compose -f docker-compose.prod.yml logs -f backend

# Kubernetes
kubectl logs -f -n gitgenie -l app=backend
kubectl logs -f -n gitgenie -l app=frontend

# Get logs from crashed pod
kubectl logs -n gitgenie <pod-name> --previous
```

### System Events

```bash
# Kubernetes events (all)
kubectl get events -n gitgenie

# Recent events
kubectl get events -n gitgenie --sort-by='.lastTimestamp'

# Watch events
kubectl get events -n gitgenie --watch
```

---

## Troubleshooting

### Pod Issues

```bash
# Pod in CrashLoopBackOff
kubectl logs -n gitgenie <pod-name>
kubectl describe pod -n gitgenie <pod-name>

# Delete and recreate pod
kubectl delete pod -n gitgenie <pod-name>

# Check events
kubectl describe pod -n gitgenie <pod-name> | grep -A 20 Events
```

### Database Issues

```bash
# Check postgres pod
kubectl logs -n gitgenie postgres-0

# Connect directly
kubectl exec -it postgres-0 -n gitgenie -- psql -U gitgenie_user -d gitgenie

# Check PVC
kubectl describe pvc postgres-data-postgres-0 -n gitgenie

# Check disk usage
kubectl exec -it postgres-0 -n gitgenie -- df -h
```

### Network Issues

```bash
# Test service connectivity
kubectl run -it debug --image=curlimages/curl --rm --restart=Never -n gitgenie -- \
  curl http://backend-service:3001/health

# Check DNS
kubectl run -it debug --image=busybox --rm --restart=Never -n gitgenie -- \
  nslookup backend-service

# Check network policies
kubectl get networkpolicy -n gitgenie
```

### Resource Issues

```bash
# Check available resources
kubectl describe nodes

# Check resource usage
kubectl top nodes
kubectl top pods -n gitgenie

# View resource requests/limits
kubectl get pod -n gitgenie -o json | jq '.items[] | {name: .metadata.name, requests: .spec.containers[].resources.requests}'
```

---

## Emergency Procedures

### Service Down - Quick Recovery

```bash
# 1. Check status
kubectl get all -n gitgenie

# 2. Check logs
kubectl logs -f -n gitgenie -l app=backend
kubectl logs -f -n gitgenie -l app=frontend

# 3. Restart service
kubectl rollout restart deployment/backend -n gitgenie
kubectl rollout restart deployment/frontend -n gitgenie

# 4. Monitor recovery
kubectl get deployment -n gitgenie --watch
```

### Database Down

```bash
# 1. Check database pod
kubectl logs -n gitgenie postgres-0

# 2. Check connectivity
kubectl port-forward -n gitgenie svc/postgres-service 5432:5432 &
psql -h localhost -U gitgenie_user -d gitgenie -c "SELECT 1"

# 3. If needed, restart database
kubectl rollout restart statefulset/postgres -n gitgenie

# 4. Verify migration status
docker exec <backend-container> npx prisma migrate status
```

### Rollback Deployment

```bash
# Kubernetes
kubectl rollout undo deployment/backend -n gitgenie
kubectl rollout undo deployment/frontend -n gitgenie

# Docker Compose (use previous image tag)
sed -i 's/:latest/:previous/g' docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d
```

### Clear Cache

```bash
# Docker Compose
docker exec gitgenie_redis_prod redis-cli FLUSHALL

# Kubernetes
kubectl exec -it redis-0 -n gitgenie -- redis-cli FLUSHALL
```

### Scale Down for Maintenance

```bash
# Kubernetes
kubectl scale deployment backend --replicas=0 -n gitgenie
kubectl scale deployment frontend --replicas=0 -n gitgenie

# Run migrations or maintenance
# ...

# Scale back up
kubectl scale deployment backend --replicas=2 -n gitgenie
kubectl scale deployment frontend --replicas=3 -n gitgenie
```

---

## Useful Aliases

Add to `.bashrc` or `.zshrc`:

```bash
# Kubernetes
alias k='kubectl'
alias kgs='kubectl get svc -n gitgenie'
alias kgd='kubectl get deployment -n gitgenie'
alias kl='kubectl logs -f -n gitgenie'
alias kx='kubectl exec -it -n gitgenie'
alias kd='kubectl describe -n gitgenie'

# Docker
alias dc='docker-compose'
alias dcf='docker-compose -f docker-compose.prod.yml'
alias dcl='docker-compose logs -f'

# Database
alias psql-gitgenie='psql -h localhost -U gitgenie_user -d gitgenie'
```

---

## Monitoring Dashboards

### Prometheus (if installed)

```bash
# Port forward
kubectl port-forward -n monitoring svc/prometheus-operated 9090:9090

# Access at http://localhost:9090
```

### Grafana (if installed)

```bash
# Port forward
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80

# Access at http://localhost:3000
# Default: admin/prom-operator
```

### Kubernetes Dashboard

```bash
# Install
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml

# Port forward
kubectl -n kubernetes-dashboard port-forward svc/kubernetes-dashboard 8443:443

# Access at https://localhost:8443
```

---

## Emergency Contact Quick Links

- **GitHub Issues:** https://github.com/yourusername/gitgenie/issues
- **Documentation:** [DOCKER_SETUP.md](DOCKER_SETUP.md), [KUBERNETES_DEPLOYMENT.md](KUBERNETES_DEPLOYMENT.md)
- **Status Page:** https://status.yourdomain.com
- **On-Call:** [Your on-call page]

---

**Last Updated:** 2024
**Version:** 1.0
