import "./BookCard.css";

function BookCard({ book, onAddToCart }) {
  return (
    <div className="book-card">
      <div className="book-image">{book.image}</div>

      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        <p className="book-category">{book.category}</p>
        <p className="book-description">{book.description}</p>
      </div>

      <div className="book-footer">
        <span className="book-price">${book.price.toFixed(2)}</span>
        <button className="add-to-cart-btn" onClick={() => onAddToCart(book)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default BookCard;
