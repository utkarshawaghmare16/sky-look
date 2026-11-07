import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const STATUSES = ['placed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  function authHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    };
  }

  function loadOrders() {
    fetch('/api/orders', { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
        else setError(data.message || 'Could not load orders');
      })
      .catch(() => setError('Could not reach the server'));
  }

  useEffect(() => {
    if (user && user.role === 'admin') loadOrders();
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <main className="container">
        <h2>Admin</h2>
        <p>Only admin can see this page.</p>
        <Link to="/">Go home</Link>
      </main>
    );
  }

  async function changeStatus(id, status) {
    setError('');
    try {
      const res = await fetch('/api/orders/' + id + '/status', {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Could not update status');
        return;
      }
      loadOrders();
    } catch {
      setError('Could not reach the server');
    }
  }

  return (
    <main className="container">
      <h2>All Orders ({orders.length})</h2>
      <p><Link to="/admin">← Back to products</Link></p>
      {error && <p className="error">{error}</p>}
      {orders.map((order) => (
        <div className="orderBox" key={order._id}>
          <p>
            <strong>Order #{order._id.slice(-6)}</strong> ·{' '}
            {new Date(order.createdAt).toLocaleDateString('en-IN')}
          </p>
          <p>
            Customer: {order.user ? order.user.name + ' (' + order.user.email + ')' : 'Deleted user'}
          </p>
          <p>Phone: {order.phone}</p>
          <p className="small">Address: {order.address}</p>
          {order.items.map((item, i) => (
            <p key={i}>
              {item.name} × {item.qty} = ₹{item.price * item.qty}
            </p>
          ))}
          <p><strong>Total: ₹{order.total}</strong></p>
          <p>
            Status:{' '}
            <select value={order.status} onChange={(e) => changeStatus(order._id, e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </p>
        </div>
      ))}
    </main>
  );
}