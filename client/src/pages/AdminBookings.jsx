import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const STATUSES = ['pending', 'confirmed', 'cancelled'];

export default function AdminBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  function authHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    };
  }

  function loadBookings() {
    fetch('/api/bookings', { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBookings(data);
        else setError(data.message || 'Could not load bookings');
      })
      .catch(() => setError('Could not reach the server'));
  }

  useEffect(() => {
    if (user && user.role === 'admin') loadBookings();
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
      const res = await fetch('/api/bookings/' + id + '/status', {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Could not update status');
      }
      loadBookings();
    } catch {
      setError('Could not reach the server');
    }
  }

  return (
    <main className="container">
      <h2>All Bookings ({bookings.length})</h2>
      <p><Link to="/admin">← Back to products</Link></p>
      {error && <p className="error">{error}</p>}
      {bookings.map((b) => (
        <div className="orderBox" key={b._id}>
          <p>
            <strong>{b.serviceTitle}</strong> · Event date: <strong>{b.eventDate}</strong>
          </p>
          <p>
            Customer: {b.user ? b.user.name + ' (' + b.user.email + ')' : 'Deleted user'}
          </p>
          <p>Phone: {b.phone}</p>
          <p>Venue: {b.venue}</p>
          {b.guests > 0 && <p>Guests: {b.guests}</p>}
          {b.notes && <p className="small">Notes: {b.notes}</p>}
          <p>
            Status:{' '}
            <select value={b.status} onChange={(e) => changeStatus(b._id, e.target.value)}>
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