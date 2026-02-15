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

## Docker & Deployment

### Docker Setup

Build and run the application in Docker:

```bash
# Build the image
docker build -t bookstore-app .

# Run the container
docker run -p 3000:3000 bookstore-app

# Or use docker-compose
docker-compose up -d
```

The application will be accessible at `http://localhost:3000`

### GitHub Actions Deployment

The repository includes CI/CD workflows to automatically build and deploy to Azure:

#### Required GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

##### For ACR Deployment

- `ACR_LOGIN_SERVER` - Your Azure Container Registry URL (e.g., `myregistry.azurecr.io`)
- `ACR_USERNAME` - ACR username
- `ACR_PASSWORD` - ACR password

**Get ACR credentials:**

```bash
az acr credential show --name <your-registry-name>
az acr show --name <your-registry-name> --query loginServer -o tsv
```

##### For App Service Deployment

- `AZURE_CREDENTIALS` - Azure service principal credentials (JSON format)
- `AZURE_SUBSCRIPTION_ID` - Your Azure subscription ID
- `APPSERVICE_NAME` - Your App Service name (e.g., `bookstore-app-prod`)
- `AZURE_RESOURCE_GROUP` - Your Azure resource group name

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

**Get subscription ID:**

```bash
az account show --query id -o tsv
```

#### Workflow Behavior

- **Trigger**: Automatically runs on push to `main` branch
- **Steps**:
  1. Builds Docker image
  2. Pushes to Azure Container Registry
  3. Deploys container to App Service from ACR
  4. Verifies deployment completion
  5. Application accessible at `https://<appservice-name>.azurewebsites.net`

#### App Service Configuration

No additional Kubernetes manifests needed. App Service handles:

- Container orchestration
- Auto-restart on failure
- Scaling (vertical and horizontal)
- Built-in monitoring and logging
- Custom domain support
- SSL/TLS certificates

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

- React 18
- Vite 5
- CSS3
- Vanilla JavaScript (ES6+)
