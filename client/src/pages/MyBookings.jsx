import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    fetch('/api/bookings/my', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBookings(data);
        else setError(data.message || 'Could not load bookings');
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
        <h2>My Bookings</h2>
        <p>Please login to see your bookings.</p>
        <Link to="/login">Login</Link>
      </main>
    );
  }

  if (loading) return <main className="container"><p>Loading...</p></main>;

  return (
    <main className="container">
      <h2>My Bookings</h2>
      {error && <p className="error">{error}</p>}
      {!error && bookings.length === 0 && (
        <p>
          You have no bookings yet. <Link to="/book">Book an event</Link>
        </p>
      )}
      {bookings.map((b) => (
        <div className="orderBox" key={b._id}>
          <p>
            <strong>{b.serviceTitle}</strong> ·{' '}
            <span className="status">{b.status}</span>
          </p>
          <p>Event date: {b.eventDate}</p>
          <p>Venue: {b.venue}</p>
          {b.guests > 0 && <p>Guests: {b.guests}</p>}
          {b.notes && <p className="small">Notes: {b.notes}</p>}
        </div>
      ))}
    </main>
  );
}