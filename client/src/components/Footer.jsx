import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerInner">
        <div>
          <h3>Sky Look Event &amp; Decoration</h3>
          <p>Decoration items and event decoration, Pune.</p>
        </div>
        <div>
          <h3>Quick links</h3>
          <p><Link to="/">Shop</Link></p>
          <p><Link to="/services">Events</Link></p>
          <p><Link to="/book">Book an event</Link></p>
        </div>
        <div>
          <h3>Contact</h3>
          <p>Phone: +91 8625831039</p>
          <p>Email: waghmareutkarsha88@email.com</p>
          <p>Mon to Sat, 10 am to 8 pm</p>
        </div>
        <div className="footerCopy">
          © {new Date().getFullYear()} Sky Look Event &amp; Decoration. All rights reserved.
        </div>
      </div>
    </footer>
  );
}