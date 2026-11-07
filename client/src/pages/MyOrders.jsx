import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    fetch('/api/orders/my', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
        else setError(data.message || 'Could not load orders');
        setLoading(false);
      })
      .catch(() => {
        setError('Could not reach the server');
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <main className="container">
        <h2>My Orders</h2>
        <p>Please login to see your orders.</p>
        <Link to="/login">Login</Link>
      </main>
    );
  }

  if (loading) return <main className="container"><p>Loading...</p></main>;

  return (
    <main className="container">
      <h2>My Orders</h2>
      {error && <p className="error">{error}</p>}
      {!error && orders.length === 0 && <p>You have no orders yet.</p>}
      {orders.map((order) => (
        <div className="orderBox" key={order._id}>
          <p>
            <strong>Order #{order._id.slice(-6)}</strong> ·{' '}
            {new Date(order.createdAt).toLocaleDateString('en-IN')} ·{' '}
            <span className="status">{order.status}</span>
          </p>
          {order.items.map((item, i) => (
            <p key={i}>
              {item.name} × {item.qty} = ₹{item.price * item.qty}
            </p>
          ))}
          <p><strong>Total: ₹{order.total}</strong></p>
          <p className="small">Deliver to: {order.address}</p>
        </div>
      ))}
    </main>
  );
}