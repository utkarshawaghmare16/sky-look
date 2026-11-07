import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Book() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [takenDates, setTakenDates] = useState([]);
  const [form, setForm] = useState({
    serviceId: searchParams.get('service') || '',
    eventDate: '',
    venue: '',
    guests: '',
    phone: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(() => setError('Could not load services'));
    fetch('/api/bookings/taken-dates')
      .then((res) => res.json())
      .then((data) => setTakenDates(data))
      .catch(() => {});
  }, []);

  if (!user) {
    return (
      <main className="container">
        <h2>Book Your Event</h2>
        <p>Please login to book an event.</p>
        <Link to="/login">Login</Link>
      </main>
    );
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const dateTaken = takenDates.includes(form.eventDate);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (dateTaken) {
      setError('This date is already booked. Please choose another date.');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Could not send booking');
        setSending(false);
        return;
      }
      navigate('/my-bookings');
    } catch {
      setError('Could not reach the server');
      setSending(false);
    }
  }

  return (
    <main className="container">
      <form className="authForm" onSubmit={handleSubmit}>
        <h2>Book Your Event</h2>

        <select name="serviceId" value={form.serviceId} onChange={handleChange} required>
          <option value="">Select event type</option>
          {services.map((s) => (
            <option key={s._id} value={s._id}>{s.title}</option>
          ))}
        </select>

        <input
          type="date"
          name="eventDate"
          min={today}
          value={form.eventDate}
          onChange={handleChange}
          required
        />
        {dateTaken && <p className="error">This date is already booked.</p>}

        <input name="venue" placeholder="Venue (e.g. Hotel Sunrise, Pune)" value={form.venue} onChange={handleChange} required />
        <input name="guests" type="number" min="0" placeholder="Number of guests" value={form.guests} onChange={handleChange} />
        <input name="phone" type="tel" placeholder="Phone number" value={form.phone} onChange={handleChange} required />
        <textarea name="notes" placeholder="Theme, colours, special requests" value={form.notes} onChange={handleChange} />

        <button disabled={sending}>{sending ? 'Sending...' : 'Send Booking Request'}</button>
        {error && <p className="error">{error}</p>}
      </form>
    </main>
  );
}