import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const CATEGORIES = ['Wedding', 'Birthday', 'Baby Shower', 'Engagement', 'Corporate', 'Other'];

export default function AdminGallery() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState({ imageUrl: '', title: '', category: 'Wedding' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function authHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    };
  }

  function loadPhotos() {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => setPhotos(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load photos'));
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <main className="container">
        <h2>Admin</h2>
        <p>Only admin can see this page.</p>
        <Link to="/">Go home</Link>
      </main>
    );
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Could not add photo');
        return;
      }
      setMessage('Photo added');
      setForm({ imageUrl: '', title: '', category: form.category });
      loadPhotos();
    } catch {
      setError('Could not reach the server');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this photo?')) return;
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/gallery/' + id, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Could not delete photo');
        return;
      }
      loadPhotos();
    } catch {
      setError('Could not reach the server');
    }
  }

  return (
    <main className="container">
      <form className="authForm" onSubmit={handleSubmit}>
        <h2>Admin: Add Gallery Photo</h2>
        <p><Link to="/admin">← Back to products</Link></p>
        <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} required />
        <input name="title" placeholder="Title (e.g. Ganesh theme baby shower)" value={form.title} onChange={handleChange} />
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button>Add Photo</button>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>

      <h2 style={{ marginTop: 30 }}>All Photos ({photos.length})</h2>
      {photos.map((p) => (
        <div className="adminRow" key={p._id}>
          <img src={p.imageUrl} alt={p.title} />
          <div className="adminInfo">
            <strong>{p.title || 'Untitled'}</strong>
            <span>{p.category}</span>
          </div>
          <button className="deleteBtn" onClick={() => handleDelete(p._id)}>Delete</button>
        </div>
      ))}
    </main>
  );
}