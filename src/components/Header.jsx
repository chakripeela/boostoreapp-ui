import "./Header.css";

function Header({ cartCount, onCartClick }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>📚 BookStore</h1>
          <p className="tagline">Order Books Online</p>
        </div>
        <button className="cart-button" onClick={onCartClick}>
          🛒 Cart <span className="cart-count">{cartCount}</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
