import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  image: '',
  category: '',
  stock: '',
};

export default function Admin() {
  const { user } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function loadProducts() {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setError('Could not load products'));
  }

  useEffect(() => {
    loadProducts();
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
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Could not add product');
        return;
      }
      setMessage('Product added: ' + data.name);
      setForm(emptyForm);
      loadProducts();
    } catch {
      setError('Could not reach the server');
    }
  }

  async function handleDelete(id, name) {
    if (!confirm('Delete "' + name + '"?')) return;
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/products/' + id, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Could not delete product');
        return;
      }
      setMessage('Deleted: ' + name);
      loadProducts();
    } catch {
      setError('Could not reach the server');
    }
  }

  return (
    <main className="container">
      <form className="authForm" onSubmit={handleSubmit}>
              <p><Link to="/admin/orders">View all orders →</Link></p>
              <p><Link to="/admin/bookings">View all bookings →</Link></p>
              <p><Link to="/admin/gallery">Manage gallery →</Link></p>
        <h2>Admin: Add Product</h2>
        <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" min="0" placeholder="Price (₹)" value={form.price} onChange={handleChange} required />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <input name="category" placeholder="Category (e.g. Balloons)" value={form.category} onChange={handleChange} />
        <input name="stock" type="number" min="0" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <button>Add Product</button>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>

      <h2 style={{ marginTop: 30 }}>All Products ({products.length})</h2>
      {products.map((p) => (
        <div className="adminRow" key={p._id}>
          <img src={p.image} alt={p.name} />
          <div className="adminInfo">
            <strong>{p.name}</strong>
            <span>₹{p.price} · Stock: {p.stock} · {p.category}</span>
          </div>
          <button className="deleteBtn" onClick={() => handleDelete(p._id, p.name)}>
            Delete
          </button>
        </div>
      ))}
    </main>
  );
}