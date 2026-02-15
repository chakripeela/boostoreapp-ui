import CartItem from "./CartItem";
import "./Cart.css";

function Cart({ items, onRemove, onUpdateQuantity, onClear }) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <section className="cart-section">
        <div className="empty-cart">
          <h2>Your Cart is Empty</h2>
          <p>Add some books to get started!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-section">
      <h2>Shopping Cart ({itemCount} items)</h2>

      <div className="cart-container">
        <div className="cart-items">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={onRemove}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping:</span>
            <span>FREE</span>
          </div>

          <div className="summary-row">
            <span>Tax (10%):</span>
            <span>${(total * 0.1).toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total:</span>
            <span>${(total * 1.1).toFixed(2)}</span>
          </div>

          <button className="checkout-btn">Proceed to Checkout</button>
          <button className="clear-cart-btn" onClick={onClear}>
            Clear Cart
          </button>
        </div>
      </div>
    </section>
  );
}

export default Cart;
