# BookStore Application

A modern React-based online bookstore application for browsing and ordering books. Built with Vite for fast development and optimized builds.

## Features

- **Browse Books**: View a catalog of 8 hardcoded books with details
- **Shopping Cart**: Add/remove books and manage quantities
- **Order Summary**: View subtotal, tax, and total price calculations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Clean UI**: Modern gradient design with intuitive navigation

## Project Structure

```
src/
├── components/
│   ├── Header.jsx           # Top navigation with cart button
│   ├── BookList.jsx         # Grid display of books
│   ├── BookCard.jsx         # Individual book card component
│   ├── Cart.jsx             # Shopping cart view
│   ├── CartItem.jsx         # Individual cart item
│   └── *.css               # Component styling
├── App.jsx                  # Main application component
├── main.jsx                 # React entry point
└── index.css               # Global styling
```

## Books Data Structure

Currently using hardcoded books with the following structure:

```javascript
{
  id: number,
  title: string,
  author: string,
  price: number,
  category: string,
  description: string,
  image: string (emoji)
}
```

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Build

Create a production build:

```bash
npm run build
```

Output will be in the `dist/` folder, ready for deployment.

## Deployment to Azure App Service

### GitHub Actions CI/CD

The repository includes automatic deployment to Azure App Service on every push to the main branch.

#### Required GitHub Secrets

Add the following 4 secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `AZURE_CREDENTIALS` - Azure service principal credentials (JSON format)
- `ACR_LOGIN_SERVER` - Container registry URL (e.g., `myregistry.azurecr.io`)
- `APPSERVICE_NAME` - App Service name (e.g., `bookstore-app-prod`)
- `AZURE_RESOURCE_GROUP` - Azure resource group name

**Create Azure service principal with required roles:**

```bash
# Create service principal
az ad sp create-for-rbac --name bookstore-app-sp --role Contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group}

# Add AcrPush role for building images
az role assignment create \
  --assignee <client-id> \
  --role AcrPush \
  --scope /subscriptions/{subscription-id}/resourceGroups/{resource-group}

# Add AcrPull role for pulling images
az role assignment create \
  --assignee <client-id> \
  --role AcrPull \
  --scope /subscriptions/{subscription-id}/resourceGroups/{resource-group}
```

The service principal output should be added as `AZURE_CREDENTIALS` secret:

```json
{
  "clientId": "...",
  "clientSecret": "...",
  "subscriptionId": "...",
  "tenantId": "..."
}
```

**Get ACR login server:**

```bash
az acr show --name <registry-name> --query loginServer -o tsv
```

#### Required Azure Resources

**4. Create Docker-enabled App Service:**

```bash
# Create resource group
az group create --name myResourceGroup --location eastus

# Create App Service Plan (Linux for containers)
az appservice plan create \
  --name bookstore-plan \
  --resource-group myResourceGroup \
  --sku B1 \
  --is-linux

# Create Web App with Docker
az webapp create \
  --resource-group myResourceGroup \
  --plan bookstore-plan \
  --name bookstore-app-prod \
  --deployment-container-image-name myregistry.azurecr.io/bookstore-app:latest
```

#### Workflow Steps

The GitHub Actions workflow performs the following:

1. **Azure Login**: Authenticates using the service principal
2. **Build Docker Image**: Uses `az acr build` to build the container in ACR
3. **Push to ACR**: Image is stored with latest and commit SHA tags
4. **Deploy Container**: Configures App Service with the new container image
5. **Restart Service**: Restarts App Service to pull and run the image
6. **Verify Deployment**: Displays success message and troubleshooting tips

#### Running the Workflow

Trigger workflow manually:

1. Go to GitHub repository → **Actions** tab
2. Select **Build and Deploy to Azure App Service**
3. Click **Run workflow** button
4. Monitor progress (usually 5-10 minutes)
5. Visit your app at `https://{APPSERVICE_NAME}.azurewebsites.net`

The workflow uses Azure CLI commands (`az acr build`, `az webapp config container set`) which authenticate automatically with the service principal.

For detailed setup instructions, see [APP_SERVICE_SETUP.md](./APP_SERVICE_SETUP.md)

## API Integration (Future)

To connect to a real API:

1. Create a new file `src/services/bookService.js` for API calls
2. Replace the hardcoded `hardcodedBooks` array in `App.jsx` with API calls
3. Update the `App` component to fetch books on mount using `useEffect`
4. Handle loading and error states

Example:

```javascript
useEffect(() => {
  fetchBooks().then((books) => setBooks(books));
}, []);
```

## Dependencies

- **React 18**: UI framework
- **Vite**: Build tool and dev server

## Styling

The application uses:

- CSS Grid for responsive layouts
- CSS Gradients for modern visual appeal
- Flexbox for component layout
- Media queries for mobile responsiveness

## Features to Add

- Backend API integration
- User authentication
- Order history
- Search and filtering
- Wishlist functionality
- User reviews and ratings
- Payment integration

## Technologies

- React 18.2.0
- Vite 4.4.0 (build tool)
- Node.js 18 LTS (runtime)
- Docker (containerization)
- Azure App Service (hosting)
- GitHub Actions (CI/CD)
- Azure Container Registry (image storage)
- CSS3
- Vanilla JavaScript (ES6+)
