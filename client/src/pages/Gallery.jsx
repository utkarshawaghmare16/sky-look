import { useEffect, useState } from 'react';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [category, setCategory] = useState('All');
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        setPhotos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load photos');
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...new Set(photos.map((p) => p.category))];
  const shown = category === 'All' ? photos : photos.filter((p) => p.category === category);

  if (loading) return <main className="container"><p>Loading...</p></main>;

  return (
    <main className="container">
      <h2>Our Work</h2>
      <p className="galleryNote">A look at the events we have decorated.</p>
      {error && <p className="error">{error}</p>}

      <div className="chipsRow">
        {categories.map((c) => (
          <button
            key={c}
            className={c === category ? 'chipBtn on' : 'chipBtn'}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {!error && shown.length === 0 && <p>No photos yet.</p>}

      <div className="galleryGrid">
        {shown.map((p) => (
          <figure className="galleryItem" key={p._id} onClick={() => setOpen(p)}>
            <img src={p.imageUrl} alt={p.title} />
            <figcaption>{p.title || p.category}</figcaption>
          </figure>
        ))}
      </div>

      {open && (
        <div className="lightbox" onClick={() => setOpen(null)}>
          <img src={open.imageUrl} alt={open.title} />
          <p>{open.title}</p>
        </div>
      )}
    </main>
  );
}