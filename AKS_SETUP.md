# AKS Deployment Setup Guide

## Prerequisites

1. Azure subscription with an existing AKS cluster
2. Azure Container Registry (ACR) for storing Docker images
3. GitHub repository with Actions enabled

## Required GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

### 1. Azure Credentials

Create an Azure service principal:

```bash
az ad sp create-for-rbac --name bookstore-app-sp --role Contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group}
```

Then add as secret `AZURE_CREDENTIALS`:

```json
{
  "clientId": "...",
  "clientSecret": "...",
  "subscriptionId": "...",
  "tenantId": "..."
}
```

### 2. ACR Credentials

```bash
# Get ACR credentials
az acr credential show --name <registry-name>
```

Add these secrets:

- `ACR_LOGIN_SERVER` - e.g., `myregistry.azurecr.io`
- `ACR_USERNAME` - Registry username
- `ACR_PASSWORD` - Registry password

### 3. AKS Cluster Info

Add these secrets:

- `AKS_RESOURCE_GROUP` - Azure resource group name
- `AKS_CLUSTER_NAME` - AKS cluster name

## Kubernetes Manifests

Three manifest files are provided in `k8s/`:

### 1. deployment.yaml

- Deploys 3 replicas of the bookstore app
- Configures resource limits and requests
- Includes health checks (liveness and readiness probes)
- Pulls images from ACR

### 2. service.yaml

- Exposes the application using LoadBalancer
- Maps port 80 to pod port 3000

### 3. ingress.yaml (Optional)

- Uses NGINX Ingress Controller
- Configures HTTPS with Let's Encrypt certificate
- Update the hostname to your domain

## How the Workflow Works

1. **On push to main branch:**
   - Builds Docker image
   - Pushes to ACR with `latest` and commit SHA tags
   - Automatically deploys to AKS

2. **Deployment Steps:**
   - Logs into Azure
   - Gets AKS credentials
   - Creates Docker registry secret in AKS
   - Applies Kubernetes manifests
   - Waits for rollout to complete
   - Displays service information

## First-Time Setup

### 1. Enable NGINX Ingress (Optional)

If using ingress.yaml:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

### 2. Enable Cert-Manager (Optional)

For automatic HTTPS:

```bash
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace
```

### 3. Update Ingress Hostname

Edit `k8s/ingress.yaml` and replace `bookstore.example.com` with your domain.

## Verify Deployment

### Check Pod Status

```bash
kubectl get pods -n default -l app=bookstore-app
```

### Check Service

```bash
kubectl get svc bookstore-app-service
```

### View Logs

```bash
kubectl logs -l app=bookstore-app --all-containers=true
```

### Port Forward (for testing)

```bash
kubectl port-forward svc/bookstore-app-service 8080:80
# Access at http://localhost:8080
```

## Troubleshooting

### Pods not starting?

```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Image pull errors?

Verify ACR secret:

```bash
kubectl get secret acr-secret --output json
```

### Service not accessible?

```bash
kubectl get svc bookstore-app-service
# Wait for EXTERNAL-IP to be assigned
```

## Useful Commands

```bash
# Get cluster info
az aks show --resource-group <rg-name> --name <cluster-name>

# Connect to cluster
az aks get-credentials --resource-group <rg-name> --name <cluster-name>

# View deployment history
kubectl rollout history deployment/bookstore-app

# Rollback to previous version
kubectl rollout undo deployment/bookstore-app

# Scale replicas
kubectl scale deployment bookstore-app --replicas=5

# Update image (manual)
kubectl set image deployment/bookstore-app \
  bookstore-app=<registry>.azurecr.io/bookstore-app:latest
```

## Notes

- The workflow only deploys on push to main branch
- Each deployment uses the git commit SHA as image tag
- The latest tag is updated with each deployment
- ACR secret is recreated on each deployment to ensure it's current
- Ingress is optional - LoadBalancer service works immediately
