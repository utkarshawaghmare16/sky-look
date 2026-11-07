import { Link } from 'react-router-dom';

const COLORS = ['#f5a300', '#e8457c', '#ffffff', '#14a3a0', '#ff7a59'];

function Bunting() {
  const flags = [];
  for (let i = 0; i < 24; i++) {
    const x = 14 + i * 50;
    const y = 10 + 10 * Math.sin(i / 3.8 + 0.6);
    flags.push(
      <path
        key={i}
        d={`M${x} ${y} L${x + 34} ${y + 2} L${x + 17} ${y + 34} Z`}
        fill={COLORS[i % 5]}
      />
    );
  }
  return (
    <svg className="bunting" viewBox="0 0 1200 54" preserveAspectRatio="none">
      <path d="M0 6 Q300 30 600 8 T1200 6" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" fill="none" />
      {flags}
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="hero">
      <Bunting />
      <div className="heroInner">
        <div>
          <h1>
            Make every celebration <em>unforgettable</em>
          </h1>
          <p>
            Shop balloons, lights and flowers, or book us to decorate your
            wedding, birthday or baby shower.
          </p>
          <div className="heroBtns">
            <Link to="/services" className="heroBtn">Book an event</Link>
            <a href="#products" className="heroBtn ghost">Shop decoration items</a>
          </div>
          <div className="heroChips">
            <span>Cash on delivery</span>
            <span>Pune</span>
            <span>Event booking online</span>
          </div>
        </div>
        <svg className="heroArt" viewBox="0 0 300 260">
          <path d="M90 120 Q110 190 150 238 M150 100 Q150 180 150 238 M212 120 Q190 190 150 238" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" fill="none" />
          <ellipse cx="88" cy="84" rx="48" ry="60" fill="#ff7aa2" />
          <ellipse cx="212" cy="84" rx="48" ry="60" fill="#ffd166" />
          <ellipse cx="150" cy="64" rx="52" ry="66" fill="#fff" />
          <circle cx="40" cy="190" r="7" fill="#14a3a0" />
          <circle cx="262" cy="170" r="9" fill="#14a3a0" />
          <circle cx="64" cy="228" r="8" fill="#f5a300" />
        </svg>
      </div>
    </section>
  );
}