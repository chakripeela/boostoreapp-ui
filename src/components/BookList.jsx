import BookCard from "./BookCard";
import "./BookList.css";

function BookList({ books, onAddToCart }) {
  return (
    <section className="book-list-section">
      <div className="book-list-header">
        <h2>Available Books</h2>
        <p className="book-count">{books.length} books available</p>
      </div>

      <div className="book-grid">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  );
}

export default BookList;
