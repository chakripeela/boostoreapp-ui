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

- `AZURE_CREDENTIALS` - Azure service principal credentials (JSON format)
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

#### Workflow Behavior

- **Trigger**: Automatically runs on push to `main` branch
- **Steps**:
  1. Checks out code
  2. Sets up Node.js
  3. Installs dependencies
  4. Builds React app
  5. Logs into Azure
  6. Deploys `dist/` folder to App Service
  7. Displays deployment confirmation

The application will be accessible at:

```
https://{APPSERVICE_NAME}.azurewebsites.net
```

#### Setup App Service

```bash
# Create resource group
az group create --name myResourceGroup --location eastus

# Create App Service Plan (Linux)
az appservice plan create \
  --name bookstore-plan \
  --resource-group myResourceGroup \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group myResourceGroup \
  --plan bookstore-plan \
  --name bookstore-app-prod \
  --runtime "node|18-lts"
```

For detailed setup instructions, see [APP_SERVICE_SETUP.md](./APP_SERVICE_SETUP.md)

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
