# App Service Static File Serving Issue & Solution

## Problem

After deploying to App Service, you see a blank page or 404 errors because App Service doesn't know how to serve your React SPA (Single Page Application).

## Solution

A `web.config` file has been created in the `public` folder that:

1. **Configures MIME types** for all assets (fonts, JSON, SVG, etc.)
2. **Enables compression** for better performance
3. **Handles SPA routing** - rewrites all non-file requests to `index.html`

## How It Works

- **Static files** (.js, .css, .svg, .woff, etc.) are served directly
- **All other requests** (like `/about`, `/cart`, etc.) are rewritten to `index.html`
- This allows React Router to handle all routing on the client side

## Files Created/Modified

### 1. `public/web.config` (NEW)

- IIS configuration file (only used when deploying to Windows-based App Service)
- Automatically copied to `dist/` folder during build
- Configures URL rewriting and compression

### 2. Vite Configuration

- Already configured to copy `public/` folder to `dist/`
- No changes needed

## Steps to Deploy

### 1. Rebuild Locally (to test)

```bash
npm run build
```

You should see `web.config` in the `dist/` folder:

```bash
ls dist/
# Should show: index.html, assets/, web.config
```

### 2. Trigger Workflow Again

- Go to GitHub → Actions
- Run **Deploy to Azure App Service** workflow manually
- Wait for completion

### 3. Verify on Browser

Access your app: `https://{appservice-name}.azurewebsites.net`

You should now see:

- ✅ The bookstore homepage with books displayed
- ✅ Shopping cart functionality working
- ✅ No 404 errors

## Troubleshooting

### Still seeing blank page?

Check if App Service is serving the right content:

```bash
# Check what was deployed
az webapp deployment list \
  --name bookstore-app-prod \
  --resource-group myResourceGroup \
  --query "[0]"

# Stream logs to see errors
az webapp log stream \
  --name bookstore-app-prod \
  --resource-group myResourceGroup
```

### Check if web.config was deployed

```bash
# Using Kudu (App Service SSH)
# Open: https://{appservice-name}.scm.azurewebsites.net
# Navigate to Debug Console → CMD
# List files: dir
```

### Force restart App Service

```bash
az webapp restart \
  --name bookstore-app-prod \
  --resource-group myResourceGroup
```

## Testing the Build Locally

Before running the workflow, test locally:

```bash
# Build
npm run build

# Serve the dist folder (install serve if needed)
npm install -g serve
serve -s dist -l 3000

# Visit http://localhost:3000
```

You should see the full React app with working navigation.

## What Changed

| Step                  | Before                        | After                  |
| --------------------- | ----------------------------- | ---------------------- |
| **SPA Routing**       | ❌ 404 errors on page refresh | ✅ Works correctly     |
| **Static Assets**     | ⚠️ Some assets might fail     | ✅ All assets load     |
| **Compression**       | Manual                        | ✅ Automatic           |
| **Web Server Config** | Missing                       | ✅ web.config included |

## Notes

- The `web.config` file only affects **Windows-based App Service** (which is the default)
- If using **Linux-based App Service**, you'd need different configuration
- This is a standard setup for all SPA deployments on IIS/App Service
- The workflow now includes a verification step to show build output
