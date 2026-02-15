# BookStore React Application - Copilot Instructions

## Project Overview

A modern React-based online bookstore application with Vite build tool, featuring product browsing, shopping cart functionality, and order management with hardcoded book data (ready for API integration).

## Current Status

✓ Project scaffolded with Vite and React 18
✓ 8 components created (Header, BookList, BookCard, Cart, CartItem, and variants)
✓ Responsive CSS styling implemented
✓ Hardcoded book catalog with 8 sample books
✓ Full shopping cart functionality
✓ Development server running on http://127.0.0.1:3000

## Completed Steps

- ✓ Clarified Project Requirements (React bookstore with hardcoded data)
- ✓ Scaffolded the Project (Vite + React)
- ✓ Customized the Project (components, styling, data structure)
- ✓ Installed Dependencies (React, Vite, plugins)
- ✓ Compiled and Verified (dev server running)
- ✓ Created readme documentation

## Key Features

- Browse 8 hardcoded books with details (title, author, price, category, description)
- Add/remove books from shopping cart
- Adjust quantities with increment/decrement buttons
- Real-time order summary with tax calculation
- Responsive design (mobile, tablet, desktop)
- Modern gradient UI with smooth animations
- Toggle between book listing and cart views

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx & Header.css
│   │   ├── BookList.jsx & BookList.css
│   │   ├── BookCard.jsx & BookCard.css
│   │   ├── Cart.jsx & Cart.css
│   │   └── CartItem.jsx & CartItem.css
│   ├── App.jsx & App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
├── README.md
└── .gitignore
```

## How to Use

### Development

```bash
npm run dev
```

Server starts at http://127.0.0.1:3000

### Build for Production

```bash
npm run build
```

Output in `dist/` folder

### Preview Production Build

```bash
npm run preview
```

## API Integration Guide

When ready to connect to your backend API:

1. Create `src/services/bookService.js`:

```javascript
export async function fetchBooks() {
  const response = await fetch("/api/books");
  return response.json();
}
```

2. Update `App.jsx`:

```javascript
import { useEffect } from "react";
import { fetchBooks } from "./services/bookService";

// Replace hardcodedBooks with:
const [books, setBooks] = useState([]);

useEffect(() => {
  fetchBooks().then(setBooks);
}, []);
```

3. Update the BookList JSX to use `books` instead of `hardcodedBooks`

## Book Data Structure

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

## Dependencies

- react@^18.2.0
- react-dom@^18.2.0
- vite@^4.4.0 (build tool)
- @vitejs/plugin-react@^3.1.0

## Next Steps for Enhanced Functionality

- Backend API integration for book data
- User authentication/login
- Checkout and payment processing
- Order history tracking
- Search and filtering capabilities
- Wishlist functionality
- User reviews and ratings
- Persistent cart (localStorage or session)

## Browser Support

Modern browsers with ES6+ support (Chrome, Firefox, Safari, Edge)

## Notes

- Application uses emoji for book images (placeholder - can be replaced with real images)
- All data is currently hardcoded in App.jsx
- Cart state is stored in React state (not persisted between sessions)
- Ready for gradual API integration without major refactoring needed
