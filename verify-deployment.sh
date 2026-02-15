#!/bin/bash
# Deployment Verification Script for BookStore App on Azure App Service

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get variables
APPSERVICE_NAME=${1:-"bookstore-app-prod"}
RESOURCE_GROUP=${2:-"myResourceGroup"}

echo -e "${YELLOW}===== BookStore App Service Verification =====${NC}"
echo ""

# 1. Check if App Service exists
echo -e "${YELLOW}1. Checking if App Service exists...${NC}"
if az webapp show --name $APPSERVICE_NAME --resource-group $RESOURCE_GROUP > /dev/null 2>&1; then
    echo -e "${GREEN}✅ App Service found${NC}"
else
    echo -e "${RED}❌ App Service not found${NC}"
    exit 1
fi

# 2. Check App Service state
echo ""
echo -e "${YELLOW}2. Checking App Service state...${NC}"
STATE=$(az webapp show --name $APPSERVICE_NAME --resource-group $RESOURCE_GROUP --query state -o tsv)
echo "State: $STATE"

# 3. Get default hostname
echo ""
echo -e "${YELLOW}3. App Service URL${NC}"
HOSTNAME=$(az webapp show --name $APPSERVICE_NAME --resource-group $RESOURCE_GROUP --query defaultHostName -o tsv)
echo -e "${GREEN}URL: https://$HOSTNAME${NC}"

# 4. Check runtime
echo ""
echo -e "${YELLOW}4. Checking runtime configuration...${NC}"
RUNTIME=$(az webapp config show --name $APPSERVICE_NAME --resource-group $RESOURCE_GROUP --query linuxFxVersion -o tsv)
echo "Runtime: $RUNTIME"

# 5. Get app settings
echo ""
echo -e "${YELLOW}5. Checking app settings...${NC}"
az webapp config appsettings list --name $APPSERVICE_NAME --resource-group $RESOURCE_GROUP -o table | head -20

# 6. Check recent deployments
echo ""
echo -e "${YELLOW}6. Recent deployments...${NC}"
az webapp deployment list --name $APPSERVICE_NAME --resource-group $RESOURCE_GROUP --max-items 5 -o table

# 7. Try to access the site
echo ""
echo -e "${YELLOW}7. Testing site accessibility...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://$HOSTNAME)
echo "HTTP Status: $HTTP_CODE"
if [ $HTTP_CODE -eq 200 ]; then
    echo -e "${GREEN}✅ Site is returning HTTP 200${NC}"
elif [ $HTTP_CODE -eq 503 ]; then
    echo -e "${YELLOW}⚠️  Site returning 503 (may still be starting up)${NC}"
else
    echo -e "${RED}❌ Site returning HTTP $HTTP_CODE${NC}"
fi

# 8. Check Kudu API
echo ""
echo -e "${YELLOW}8. Checking Kudu (deployment) endpoint...${NC}"
KUDU_URL="https://$APPSERVICE_NAME.scm.azurewebsites.net"
echo "Kudu URL: $KUDU_URL"

# 9. Show logs
echo ""
echo -e "${YELLOW}9. Streaming logs (press Ctrl+C to stop)...${NC}"
echo -e "${YELLOW}Run this to see live logs:${NC}"
echo "az webapp log tail --name $APPSERVICE_NAME --resource-group $RESOURCE_GROUP"

echo ""
echo -e "${YELLOW}===== Troubleshooting Steps =====${NC}"
echo "1. Check logs: az webapp log stream --name $APPSERVICE_NAME --resource-group $RESOURCE_GROUP"
echo "2. Did you add all required secrets to GitHub?"
echo "3. Did the GitHub Actions workflow complete successfully?"
echo "4. Check if files are deployed:"
echo "   - Visit: https://$APPSERVICE_NAME.scm.azurewebsites.net/api/zip/site/wwwroot"
echo "5. Restart app service:"
echo "   az webapp restart --name $APPSERVICE_NAME --resource-group $RESOURCE_GROUP"
echo "6. Check index.html was deployed:"
echo "   curl https://$HOSTNAME/index.html"
