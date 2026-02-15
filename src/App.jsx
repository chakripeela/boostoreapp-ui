import { useState } from "react";
import Header from "./components/Header";
import BookList from "./components/BookList";
import Cart from "./components/Cart";
import "./App.css";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const hardcodedBooks = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 12.99,
      category: "Classic",
      description:
        "A timeless American novel about wealth and the American Dream.",
      image: "📕",
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 14.99,
      category: "Classic",
      description:
        "A gripping tale of racial injustice and childhood innocence.",
      image: "📗",
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      price: 13.99,
      category: "Dystopian",
      description:
        "A chilling exploration of totalitarianism and surveillance.",
      image: "📘",
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      price: 11.99,
      category: "Romance",
      description: "A witty love story set in Georgian England.",
      image: "📕",
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      price: 10.99,
      category: "Contemporary",
      description: "A coming-of-age story about teenage angst and alienation.",
      image: "📙",
    },
    {
      id: 6,
      title: "Brave New World",
      author: "Aldous Huxley",
      price: 13.99,
      category: "Dystopian",
      description:
        "A futuristic society predicated on happiness through conformity.",
      image: "📘",
    },
    {
      id: 7,
      title: "Jane Eyre",
      author: "Charlotte Brontë",
      price: 12.99,
      category: "Romance",
      description: "A passionate love story with gothic elements.",
      image: "📕",
    },
    {
      id: 8,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      price: 14.99,
      category: "Fantasy",
      description: "An adventurous fantasy tale of hobbits and magic.",
      image: "📗",
    },
  ];

  const addToCart = (book) => {
    const existingItem = cartItems.find((item) => item.id === book.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );
    } else {
      setCartItems([...cartItems, { ...book, quantity: 1 }]);
    }
  };

  const removeFromCart = (bookId) => {
    setCartItems(cartItems.filter((item) => item.id !== bookId));
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === bookId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="app">
      <Header
        cartCount={cartItems.length}
        onCartClick={() => setShowCart(!showCart)}
      />

      <main className="main-content">
        {showCart ? (
          <Cart
            items={cartItems}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onClear={clearCart}
          />
        ) : (
          <BookList books={hardcodedBooks} onAddToCart={addToCart} />
        )}
      </main>
    </div>
  );
}

export default App;
