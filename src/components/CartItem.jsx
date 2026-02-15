import "./CartItem.css";

function CartItem({ item, onRemove, onUpdateQuantity }) {
  return (
    <div className="cart-item">
      <div className="cart-item-image">{item.image}</div>

      <div className="cart-item-info">
        <h4>{item.title}</h4>
        <p>{item.author}</p>
        <span className="item-price">${item.price.toFixed(2)}</span>
      </div>

      <div className="cart-item-quantity">
        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
          −
        </button>
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
        />
        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
          +
        </button>
      </div>

      <div className="cart-item-total">
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      <button
        className="remove-btn"
        onClick={() => onRemove(item.id)}
        title="Remove from cart"
      >
        ✕
      </button>
    </div>
  );
}

export default CartItem;
