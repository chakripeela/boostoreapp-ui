# App Service Deployment Setup Guide

## Prerequisites

1. Azure subscription with an existing App Service Plan
2. GitHub repository with Actions enabled

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

### 2. App Service Info

Add these secrets:

- `APPSERVICE_NAME` - Your App Service name (e.g., `bookstore-app-prod`)
- `AZURE_RESOURCE_GROUP` - Your Azure resource group name
- `APPSERVICE_NAME` - Your App Service name (e.g., `bookstore-app-prod`)
- `AZURE_RESOURCE_GROUP` - The Azure resource group containing your App Service

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

# Create Web App with Node.js runtime
az webapp create \
  --resource-group myResourceGroup \
  --plan bookstore-plan \
  --name bookstore-app-prod \
  --runtime "node|18-lts"
```

## How the Workflow Works

1. **On push to main branch:**
   - Checks out code
   - Sets up Node.js 18
   - Installs dependencies
   - Builds React app (`npm run build`)
   - Logs into Azure
   - Deploys `dist/` folder to App Service

2. **Deployment Steps:**
   - Uses Azure Login action with service principal
   - Deploys the built static files to App Service
   - Application is immediately available

## Verify Deployment

### Check App Service Status

```bash
# Get App Service details
az webapp show \
  --name bookstore-app-prod \
  --resource-group myResourceGroup \
  --query "[state, defaultHostName]" -o tsv

# View logs
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

### Application not loading?

Check logs:

```bash
az webapp log tail --name bookstore-app-prod --resource-group myResourceGroup
```

### Deployment failed?

Check recent deployments:

```bash
az webapp deployment list \
  --name bookstore-app-prod \
  --resource-group myResourceGroup \
  --query "[0:5]"
```

View deployment log:

```bash
az webapp deployment show \
  --name bookstore-app-prod \
  --resource-group myResourceGroup \
  --deployment-id <deployment-id>
```

### Slow startup?

- Check App Service Plan tier (consider upgrading from B1 if needed)
- View logs in Application Insights (if enabled)
- Verify Node.js version compatibility

## Scaling

### Scale Up (Change Plan)

```bash
az appservice plan update \
  --name bookstore-plan \
  --sku S1 \
  --resource-group myResourceGroup
```

Available SKUs:
- **F1** (Free) - Development only
- **D1** (Shared) - Minimal production  
- **B1** (Basic) - Small apps (~$10-15/month)
- **B2** (Basic) - Medium apps
- **S1** (Standard) - Standard production (~$50/month)
- **S2** (Standard) - High-traffic apps
- **P1** (Premium) - Enterprise apps

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

# Enable HTTPS only
az webapp update \
  --name bookstore-app-prod \
  --resource-group myResourceGroup \
  --set httpsOnly=true
```

## Custom Domain (Optional)

```bash
# Add custom domain
az webapp config hostname add \
  --resource-group myResourceGroup \
  --webapp-name bookstore-app-prod \
  --hostname myapp.example.com
```

## Environment Variables

Set environment variables for your app:

```bash
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name bookstore-app-prod \
  --settings \
    NODE_ENV=production \
    API_URL=https://api.example.com
```

## Monitoring

### Enable Application Insights
```bash
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name bookstore-app-prod \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=<key>
```

### View Metrics
```bash
az monitor metrics list-definitions \
  --resource /subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.Web/sites/bookstore-app-prod
```

## Cost Estimation

| Tier | Monthly Cost | Use Case |
|------|-------------|----------|
| **F1** (Free) | $0 | Development only |
| **B1** (Basic) | ~$10-15 | Small production app |
| **S1** (Standard) | ~$50 | Medium production app |
| **S2** (Standard) | ~$100 | High-traffic app |
| **P1** (Premium) | ~$280+ | Enterprise apps |

**Current setup cost:** B1 plan (~$10-15/month)

## Deployments

View all deployments:
```bash
az webapp deployment list \
  --name bookstore-app-prod \
  --resource-group myResourceGroup
```

## Notes

- No Docker or container registry needed
- Direct static file deployment to App Service
- Each push to main branch triggers automatic deployment
- Deployment takes 1-2 minutes
- App Service automatically restarts on failure
- Logs can be streamed in real-time using Azure CLI
