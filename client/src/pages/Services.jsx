import { useEffect, useState } from 'react';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load services');
        setLoading(false);
      });
  }, []);

  if (loading) return <main className="container"><p>Loading...</p></main>;

  return (
    <main className="container">
      <h2>Our Event Services</h2>
      {error && <p className="error">{error}</p>}
      {!error && services.length === 0 && <p>No services added yet.</p>}
      <div className="serviceGrid">
        {services.map((s) => (
          <div className="serviceCard" key={s._id}>
            {s.image && <img src={s.image} alt={s.title} />}
            <div className="serviceBody">
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <p className="servicePrice">
                Starting from ₹{s.startingPrice.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}