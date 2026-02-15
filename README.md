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

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

**Azure Credentials:**
- `AZURE_CREDENTIALS` - Azure service principal credentials (JSON format)

**Azure Container Registry (ACR):**
- `ACR_LOGIN_SERVER` - Container registry URL (e.g., `myregistry.azurecr.io`)
- `ACR_USERNAME` - Registry username
- `ACR_PASSWORD` - Registry password

**App Service:**
- `APPSERVICE_NAME` - App Service name (e.g., `bookstore-app-prod`)
- `AZURE_RESOURCE_GROUP` - Azure resource group name

**Create Azure service principal:**

```bash
az ad sp create-for-rbac --name bookstore-app-sp --role Contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group}
```

The output should be added as `AZURE_CREDENTIALS` secret in JSON format:

```json
{
  "clientId": "...",
  "clientSecret": "...",
  "subscriptionId": "...",
  "tenantId": "..."
}
```

**Get ACR credentials:**

```bash
# Get login server
az acr show --name <registry-name> --query loginServer -o tsv

# Get credentials
az acr credential show --name <registry-name>
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

1. **Build Docker Image**: Creates a Docker container with Node.js runtime
2. **Push to ACR**: Uploads image to Azure Container Registry
3. **Deploy Container**: Updates App Service to run the new container image
4. **Verify Deployment**: Waits and confirms successful startup
5. **Health Check**: Validates the application is accessible

#### Running the Workflow

Trigger workflow manually:

1. Go to GitHub repository → **Actions** tab
2. Select **Build and Deploy to Azure App Service**
3. Click **Run workflow** button
4. Monitor progress in the workflow run
5. Access your app at `https://{APPSERVICE_NAME}.azurewebsites.net`

The container runs a Node.js HTTP server that serves the React application with proper SPA routing support.

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
