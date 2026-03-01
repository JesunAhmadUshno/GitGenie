# Kubernetes Deployment Guide

This guide covers deploying GitGenie to a Kubernetes cluster.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-deployment Setup](#pre-deployment-setup)
3. [Cluster Requirements](#cluster-requirements)
4. [Deployment Steps](#deployment-steps)
5. [Verification](#verification)
6. [Monitoring](#monitoring)
7. [Scaling](#scaling)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **kubectl:** [Install kubectl](https://kubernetes.io/docs/tasks/tools/)
- **Kubernetes Cluster:** 1.24+ (local or cloud)
- **Supported Platforms:**
  - EKS (Amazon Elastic Kubernetes Service)
  - GKE (Google Kubernetes Engine)
  - AKS (Azure Kubernetes Service)
  - DigitalOcean Kubernetes
  - Minikube (local testing)
  - self-hosted clusters

- **Docker Images:**
  - Push images to registry (Docker Hub or GitHub Container Registry)
  - Or use pre-built images from `ghcr.io/yourusername/`

Verify installation:
```bash
kubectl version --client
kubectl get nodes
```

---

## Pre-deployment Setup

### 1. Push Docker Images to Registry

**Docker Hub:**
```bash
# Login
docker login

# Tag images
docker tag gitgenie-frontend:latest yourusername/gitgenie-frontend:latest
docker tag gitgenie-backend:latest yourusername/gitgenie-backend:latest

# Push
docker push yourusername/gitgenie-frontend:latest
docker push yourusername/gitgenie-backend:latest
```

**GitHub Container Registry:**
```bash
# Login
echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin

# Tag images
docker tag gitgenie-frontend:latest ghcr.io/yourusername/gitgenie-frontend:latest
docker tag gitgenie-backend:latest ghcr.io/yourusername/gitgenie-backend:latest

# Push
docker push ghcr.io/yourusername/gitgenie-frontend:latest
docker push ghcr.io/yourusername/gitgenie-backend:latest
```

### 2. Set Up Cluster Context

```bash
# List available contexts
kubectl config get-contexts

# Switch context
kubectl config use-context your-cluster-name

# Test connection
kubectl get nodes
```

### 3. Install Required Add-ons

**Ingress Controller (NGINX):**
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.0/deploy/static/provider/cloud/deploy.yaml

# For specific cloud providers:
# AWS: https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.0/deploy/static/provider/aws/deploy.yaml
# GCP: https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.0/deploy/static/provider/cloud/deploy.yaml
```

**Cert Manager (for Let's Encrypt):**
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer for Let's Encrypt
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
EOF
```

---

## Cluster Requirements

### Minimum Resources

- **Nodes:** 2+ nodes recommended
- **CPU:** 4 cores total
- **Memory:** 8GB total
- **Storage:** 20GB total

### Recommended Resources

- **Nodes:** 3+ nodes (high availability)
- **CPU:** 8 cores total
- **Memory:** 16GB total
- **Storage:** 100GB total (with redundancy)

### Check Cluster Resources

```bash
# Node resources
kubectl top nodes

# Cluster info
kubectl cluster-info

# Available storage
kubectl get pv
kubectl get pvc
```

---

## Deployment Steps

### Step 1: Configure Secrets and ConfigMap

Edit `k8s/namespace-and-config.yaml` with your values:

```bash
# Update image references
sed -i 's/yourusername/your-actual-username/g' k8s/*.yaml

# Update domain names
sed -i 's/yourdomain.com/your-actual-domain.com/g' k8s/*.yaml

# Generate secure secrets
JWT_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)

# Update the secret file
kubectl create secret generic gitgenie-secrets \
  --from-literal=GITHUB_CLIENT_ID=your_id \
  --from-literal=GITHUB_CLIENT_SECRET=your_secret \
  --from-literal=JWT_SECRET=$JWT_SECRET \
  --from-literal=SESSION_SECRET=$SESSION_SECRET \
  --from-literal=DATABASE_URL=postgresql://... \
  --from-literal=REDIS_URL=redis://... \
  --namespace=gitgenie \
  --dry-run=client \
  -o yaml > k8s/secrets.yaml
```

### Step 2: Deploy Namespace and Config

```bash
kubectl apply -f k8s/namespace-and-config.yaml

# Verify
kubectl get namespace gitgenie
kubectl get configmap -n gitgenie
```

### Step 3: Deploy Database and Cache

```bash
# PostgreSQL
kubectl apply -f k8s/postgres-statefulset.yaml

# Wait for PostgreSQL to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n gitgenie --timeout=300s

# Redis
kubectl apply -f k8s/redis-statefulset.yaml

# Wait for Redis to be ready
kubectl wait --for=condition=ready pod -l app=redis -n gitgenie --timeout=300s

# Verify both are running
kubectl get pods -n gitgenie -l app=postgres
kubectl get pods -n gitgenie -l app=redis
```

### Step 4: Run Database Migrations

```bash
# Get backend pod name
BACKEND_POD=$(kubectl get pods -n gitgenie -l app=backend -o jsonpath='{.items[0].metadata.name}')

# Run migrations
kubectl exec -it $BACKEND_POD -n gitgenie -- npx prisma migrate deploy

# Seed database (optional)
kubectl exec -it $BACKEND_POD -n gitgenie -- npx prisma db seed
```

### Step 5: Deploy RBAC

```bash
kubectl apply -f k8s/rbac.yaml

# Verify
kubectl get serviceaccounts -n gitgenie
kubectl get roles -n gitgenie
```

### Step 6: Deploy Backend

```bash
kubectl apply -f k8s/backend-deployment.yaml

# Wait for backend to be ready
kubectl wait --for=condition=available --timeout=300s \
  deployment/backend -n gitgenie

# Verify
kubectl get deployment -n gitgenie
kubectl get pods -n gitgenie -l app=backend
```

### Step 7: Deploy Frontend

```bash
kubectl apply -f k8s/frontend-deployment.yaml

# Wait for frontend to be ready
kubectl wait --for=condition=available --timeout=300s \
  deployment/frontend -n gitgenie

# Verify
kubectl get deployment -n gitgenie
kubectl get pods -n gitgenie -l app=frontend
```

### Step 8: Deploy Ingress

```bash
# Update domain in k8s/ingress.yaml first
kubectl apply -f k8s/ingress.yaml

# Verify
kubectl get ingress -n gitgenie
kubectl get certificate -n gitgenie

# Wait for certificate (usually 1-2 minutes)
kubectl describe certificate gitgenie-cert -n gitgenie
```

### Complete Deployment Script

Or deploy everything at once:

```bash
#!/bin/bash
set -e

echo "Deploying GitGenie to Kubernetes..."

# Prerequisites
echo "1. Setting up namespace and config..."
kubectl apply -f k8s/namespace-and-config.yaml
sleep 5

# Database and Cache
echo "2. Deploying PostgreSQL..."
kubectl apply -f k8s/postgres-statefulset.yaml
kubectl wait --for=condition=ready pod -l app=postgres -n gitgenie --timeout=300s

echo "3. Deploying Redis..."
kubectl apply -f k8s/redis-statefulset.yaml
kubectl wait --for=condition=ready pod -l app=redis -n gitgenie --timeout=300s

# RBAC
echo "4. Setting up RBAC..."
kubectl apply -f k8s/rbac.yaml
sleep 5

# Backend
echo "5. Deploying backend..."
kubectl apply -f k8s/backend-deployment.yaml
kubectl wait --for=condition=available --timeout=300s deployment/backend -n gitgenie

# Frontend
echo "6. Deploying frontend..."
kubectl apply -f k8s/frontend-deployment.yaml
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n gitgenie

# Ingress
echo "7. Deploying ingress..."
kubectl apply -f k8s/ingress.yaml
sleep 10

echo "✅ GitGenie deployed successfully!"
echo ""
echo "Cluster Info:"
kubectl get all -n gitgenie
```

---

## Verification

### Check Deployment Status

```bash
# All resources
kubectl get all -n gitgenie

# Pods
kubectl get pods -n gitgenie
kubectl get pods -n gitgenie -o wide

# Services
kubectl get svc -n gitgenie

# Deployments
kubectl get deployment -n gitgenie

# StatefulSets
kubectl get statefulset -n gitgenie

# Ingress
kubectl get ingress -n gitgenie
```

### Verify Connectivity

```bash
# Check pod logs
kubectl logs -n gitgenie -l app=backend --tail=50
kubectl logs -n gitgenie -l app=frontend --tail=50

# Port forward for local testing
kubectl port-forward -n gitgenie svc/frontend-service 3000:3000 &
kubectl port-forward -n gitgenie svc/backend-service 3001:3001 &

# Test endpoints
curl http://localhost:3000
curl http://localhost:3001/health
```

### Check Database

```bash
# Port forward to PostgreSQL
kubectl port-forward -n gitgenie svc/postgres-service 5432:5432 &

# Connect with psql
psql -h localhost -U gitgenie_user -d gitgenie

# Query tables
\dt
```

### Get External IP

```bash
# For cloud providers
kubectl get ingress -n gitgenie -o wide

# Get LoadBalancer IP
kubectl get svc ingress-nginx-loadbalancer -n ingress-nginx

# DNS records needed
# yourdomin.com          -> Load Balancer IP
# www.yourdomain.com     -> Load Balancer IP
# api.yourdomain.com     -> Load Balancer IP
```

---

## Monitoring

### View Logs

```bash
# Real-time logs
kubectl logs -f -n gitgenie -l app=backend
kubectl logs -f -n gitgenie -l app=frontend

# All pods
kubectl logs -f -n gitgenie --all-containers

# Previous logs (crashed container)
kubectl logs -n gitgenie <pod-name> --previous
```

### Pod Events

```bash
# Describe deployment
kubectl describe deployment backend -n gitgenie
kubectl describe deployment frontend -n gitgenie

# Describe pod
kubectl describe pod <pod-name> -n gitgenie
```

### Resource Usage

```bash
# Current usage
kubectl top nodes
kubectl top pods -n gitgenie

# Watch usage
kubectl top pods -n gitgenie --watch
```

### Install Prometheus (Optional)

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

# Port forward to Prometheus
kubectl port-forward -n monitoring svc/prometheus-operated 9090:9090

# Port forward to Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
```

---

## Scaling

### Manual Scaling

```bash
# Scale backend
kubectl scale deployment backend --replicas=5 -n gitgenie

# Scale frontend
kubectl scale deployment frontend --replicas=8 -n gitgenie

# Check status
kubectl get deployment -n gitgenie
```

### Automatic Scaling (HPA)

Already configured in deployment files:

```bash
# Check HPA status
kubectl get hpa -n gitgenie

# Watch HPA
kubectl get hpa -n gitgenie --watch

# Describe HPA
kubectl describe hpa backend-hpa -n gitgenie
```

### Verify Scaling Metrics

```bash
# Metrics server must be installed
kubectl get deployment metrics-server -n kube-system

# If not installed:
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

---

## Tricks and Tips

### Rolling Updates

```bash
# Update image version
kubectl set image deployment/backend container=backend=ghcr.io/yourusername/gitgenie-backend:v1.1.0 -n gitgenie

# Track rollout
kubectl rollout status deployment/backend -n gitgenie

# Rollback if needed
kubectl rollout undo deployment/backend -n gitgenie
```

### Access Cluster Shell

```bash
# Exec into pod
kubectl exec -it <pod-name> -n gitgenie -- /bin/sh

# Run single command
kubectl exec -n gitgenie <pod-name> -- npx prisma studio
```

### Debugging

```bash
# Create debug pod
kubectl debug node/node-name --image=ubuntu -n gitgenie

# Get resource events
kubectl get events -n gitgenie --sort-by='.lastTimestamp'

# View resource yaml
kubectl get pod <pod-name> -n gitgenie -o yaml
```

### Backup and Restore

```bash
# Backup cluster resources
kubectl get all -n gitgenie -o yaml > backup.yaml

# Backup database
kubectl exec -it postgres-0 -n gitgenie -- \
  pg_dump -U gitgenie_user gitgenie > db-backup.sql

# Restore
kubectl apply -f backup.yaml
cat db-backup.sql | kubectl exec -i postgres-0 -n gitgenie -- \
  psql -U gitgenie_user gitgenie
```

---

## Troubleshooting

### Pod CrashLoopBackOff

```bash
# Check logs
kubectl logs <pod-name> -n gitgenie

# Check events
kubectl describe pod <pod-name> -n gitgenie

# Check resources
kubectl describe node

# Common causes:
# - Insufficient memory/CPU
# - Missing environment variables
# - Database connection failures
```

### Pending Pods

```bash
# Check pending pods
kubectl get pods -n gitgenie --field-selector=status.phase=Pending

# Describe to see why
kubectl describe pod <pod-name> -n gitgenie

# Check PVC status
kubectl get pvc -n gitgenie

# Common causes:
# - Storage not available
# - Node selector mismatch
# - Resource quota exceeded
```

### Service Not Accessible

```bash
# Check service
kubectl get svc -n gitgenie
kubectl describe svc backend-service -n gitgenie

# Check endpoints
kubectl get endpoints -n gitgenie

# Check network policy
kubectl get networkpolicy -n gitgenie

# Test connectivity
kubectl run -it debug --image=curlimages/curl --rm --restart=Never -n gitgenie -- \
  curl http://backend-service:3001/health
```

### Ingress Not Working

```bash
# Check ingress
kubectl get ingress -n gitgenie
kubectl describe ingress gitgenie-ingress -n gitgenie

# Check certificate
kubectl describe certificate gitgenie-cert -n gitgenie

# Check ingress controller
kubectl get pods -n ingress-nginx
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx

# For DNS issues
nslookup yourdomain.com
dig yourdomain.com
```

### Database Connection Issues

```bash
# Check database pod
kubectl logs postgres-0 -n gitgenie

# Test connection
kubectl run -it debug --image=postgres:15-alpine --rm --restart=Never \
  -n gitgenie -- psql -h postgres-service -U gitgenie_user -d gitgenie -c "SELECT 1"

# Check environment variables in pod
kubectl exec <pod-name> -n gitgenie -- env | grep DATABASE
```

### Storage Issues

```bash
# Check persistent volumes
kubectl get pv
kubectl get pvc -n gitgenie

# Check storage class
kubectl get storageclass

# Describe PVC
kubectl describe pvc postgres-data-postgres-0 -n gitgenie

# Common fixes:
# - Increase storage quota
# - Check node disk space
# - Verify storage provisioner
```

---

## Additional Resources

- [Kubernetes Official Docs](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
- [Production Checklist](https://kubernetes.io/docs/concepts/configuration/overview/)

