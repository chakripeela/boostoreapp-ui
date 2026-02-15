# App Service Deployment Setup Guide

## Prerequisites

1. Azure subscription with an existing App Service Plan
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

### 3. App Service Info

Add these secrets:

- `AZURE_SUBSCRIPTION_ID` - Your Azure subscription ID
- `APPSERVICE_NAME` - Your App Service name (e.g., `bookstore-app-prod`)
- `AZURE_RESOURCE_GROUP` - The Azure resource group containing your App Service

**Get subscription ID:**

```bash
az account show --query id -o tsv
```

## Setting Up App Service

### Create App Service Plan and Web App

```bash
# Create resource group
az group create --name myResourceGroup --location eastus

# Create App Service Plan (Linux)
az appservice plan create \
  --name bookstore-plan \
  --resource-group myResourceGroup \
  --sku B1 \
  --is-linux

# Create Web App with Docker container
az webapp create \
  --resource-group myResourceGroup \
  --plan bookstore-plan \
  --name bookstore-app-prod \
  --deployment-container-image-name-user <acr-username> \
  --deployment-container-image-name-password <acr-password> \
  --deployment-container-image-name myregistry.azurecr.io/bookstore-app:latest

# Configure continuous deployment from ACR
az webapp deployment container config \
  --name bookstore-app-prod \
  --resource-group myResourceGroup \
  --enable-cd true
```

### Enable Continuous Deployment

```bash
# Get deployment webhook URL
az webapp deployment container show-cd-url \
  --name bookstore-app-prod \
  --resource-group myResourceGroup

# Add webhook to ACR (optional - for automatic deployments on image push)
az acr webhook create \
  --registry <registry-name> \
  --name appservicewebhook \
  --actions push \
  --uri <webhook-url-from-above>
```

## How the Workflow Works

1. **On push to main branch:**
   - Builds Docker image
   - Pushes to ACR with commit SHA and latest tags
   - Automatically deploys to App Service

2. **Deployment Steps:**
   - Logs into Azure
   - Deploys container from ACR to App Service
   - Verifies deployment
   - Displays access URL

## App Service Configuration

### Environment Variables

Set in App Service Configuration:

```bash
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name bookstore-app-prod \
  --settings WEBSITES_PORT=3000
```

### Custom Domain (Optional)

```bash
# Add custom domain
az webapp config hostname add \
  --resource-group myResourceGroup \
  --webapp-name bookstore-app-prod \
  --hostname myapp.example.com
```

## Verify Deployment

### Check App Service Status

```bash
# Get App Service details
az webapp show \
  --name bookstore-app-prod \
  --resource-group myResourceGroup \
  --query "[state, defaultHostName]" -o tsv

# View container logs
az webapp log tail \
  --name bookstore-app-prod \
  --resource-group myResourceGroup

# Stream logs in real-time
az webapp log stream \
  --name bookstore-app-prod \
  --resource-group myResourceGroup
```

### Access the Application

```
https://bookstore-app-prod.azurewebsites.net
```

## Restart App Service

```bash
az webapp restart \
  --name bookstore-app-prod \
  --resource-group myResourceGroup
```

## Troubleshooting

### Application not starting?

Check logs:

```bash
az webapp log tail --name bookstore-app-prod --resource-group myResourceGroup
```

### Container image not pulling?

Verify ACR credentials:

```bash
az webapp config container show \
  --name bookstore-app-prod \
  --resource-group myResourceGroup
```

Reconfigure ACR credentials:

```bash
az webapp config container set \
  --name bookstore-app-prod \
  --resource-group myResourceGroup \
  --docker-custom-image-name <registry>.azurecr.io/bookstore-app:latest \
  --docker-registry-server-url https://<registry>.azurecr.io \
  --docker-registry-server-user <username> \
  --docker-registry-server-password <password>
```

### Slow startup?

- Check App Service Plan tier (consider upgrading from B1 if needed)
- View startup logs in Application Insights (if enabled)

### Port issues?

Ensure Dockerfile exposes port 3000 and App Service is configured:

```bash
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name bookstore-app-prod \
  --settings WEBSITES_PORT=3000
```

## Scaling

### Scale Up (Change Plan)

```bash
az appservice plan update \
  --name bookstore-plan \
  --sku S1 \
  --resource-group myResourceGroup
```

### Scale Out (Auto-scaling)

```bash
# Enable auto-scale
az monitor autoscale create \
  --resource-group myResourceGroup \
  --resource-name bookstore-plan \
  --resource-type microsoft.web/serverfarms \
  --min-count 1 \
  --max-count 10 \
  --count 3
```

## Useful Commands

```bash
# List all web apps
az webapp list --resource-group myResourceGroup

# Delete App Service
az webapp delete \
  --name bookstore-app-prod \
  --resource-group myResourceGroup

# Configure application settings
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name bookstore-app-prod \
  --settings SETTING_NAME=value

# View current configuration
az webapp config show \
  --name bookstore-app-prod \
  --resource-group myResourceGroup
```

## App Service Plans

### SKU Comparison

| Tier              | vCPU   | Memory  | Features                                   |
| ----------------- | ------ | ------- | ------------------------------------------ |
| **Free**          | Shared | 1 GB    | Development only, no custom domains        |
| **Shared (D1)**   | Shared | 1 GB    | Custom domains, limited resources          |
| **Basic (B1)**    | 1      | 1.75 GB | Small production workloads                 |
| **Basic (B2)**    | 2      | 3.5 GB  | Medium production workloads                |
| **Standard (S1)** | 1      | 1.75 GB | Auto-scale, SSL certificates               |
| **Standard (S2)** | 2      | 3.5 GB  | Better performance and auto-scale          |
| **Premium (P1)**  | 4      | 7 GB    | High-traffic production, advanced features |

For development: Use **B1** (Basic)
For production: Use **S1** or higher (Standard or Premium)

## Cost Optimization

- Use **B1** for non-critical applications
- Enable **auto-scale** for variable traffic
- Use **slot deployments** for zero-downtime updates
- Monitor usage with **Azure Cost Management**

## Monitoring

```bash
# Enable Application Insights
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name bookstore-app-prod \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=<key>

# View metrics
az monitor metrics list --resource /subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.Web/sites/bookstore-app-prod
```

## Notes

- Container registry credentials are stored securely in App Service configuration
- Each push to main triggers automatic deployment
- Deployment takes 1-2 minutes depending on App Service Plan
- Health checks are performed automatically by App Service
- Logs can be streamed in real-time using Azure CLI or Azure Portal
