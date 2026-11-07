import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Checkout({ cart, clearCart }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ address: '', phone: '' });
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (!user) {
    return (
      <main className="container">
        <h2>Checkout</h2>
        <p>Please login to place your order.</p>
        <Link to="/login">Login</Link>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="container">
        <h2>Checkout</h2>
        <p>Your cart is empty.</p>
        <Link to="/">Continue shopping</Link>
      </main>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          items: cart.map((item) => ({ productId: item._id, qty: item.qty })),
          address: form.address,
          phone: form.phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        setPlacing(false);
        return;
      }
      clearCart();
      navigate('/order-success');
    } catch {
      setError('Could not reach the server');
      setPlacing(false);
    }
  }

  return (
    <main className="container">
      <form className="authForm" onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>
          {cart.length} item type(s), total <strong>₹{total}</strong> (Cash on Delivery)
        </p>
        <textarea
          placeholder="Delivery address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <button disabled={placing}>{placing ? 'Placing order...' : 'Place Order'}</button>
        {error && <p className="error">{error}</p>}
      </form>
    </main>
  );
}