import { useEffect, useState } from 'react';
import Hero from '../components/Hero.jsx';
import HowItWorks from '../components/HowItWorks.jsx';

export default function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load products'));
  }, []);

  return (
    <>
      <Hero />

      <main className="container">
        <h2 id="products">Decoration Items</h2>
        {error && <p className="error">{error}</p>}
        <div className="grid">
          {products.map((p) => (
            <div className="card" key={p._id}>
              <img src={p.image} alt={p.name} />
              <h3>{p.name}</h3>
              <p className="category">{p.category}</p>
              <p className="price">₹{p.price}</p>
              <button onClick={() => addToCart(p)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </main>

      <HowItWorks />
    </>
  );
}