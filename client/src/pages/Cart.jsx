import { Link } from 'react-router-dom';

export default function Cart({ cart, changeQty, removeItem }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    if (cart.length === 0) {
    return (
      <main className="container">
        <h2>Shopping Cart</h2>
        <p>Your cart is empty.</p>
        <Link to="/">Continue shopping</Link>
      </main>
    );
  }

  return (
    <main className="container">
      <h2>Shopping Cart</h2>
      {cart.map((item) => (
        <div className="cartRow" key={item._id}>
          <img src={item.image} alt={item.name} />
          <div className="cartInfo">
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
            <div className="qty">
              <button onClick={() => changeQty(item._id, -1)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => changeQty(item._id, 1)}>+</button>
              <button className="remove" onClick={() => removeItem(item._id)}>Remove</button>
            </div>
          </div>
          <p className="rowTotal">₹{item.price * item.qty}</p>
        </div>
      ))}
      <h3 className="total">Total: ₹{total}</h3>
            <Link to="/checkout" className="checkoutBtn">Proceed to Checkout</Link>
    </main>
  );
}