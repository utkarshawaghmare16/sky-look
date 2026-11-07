import { Link } from 'react-router-dom';

export default function OrderSuccess() {
  return (
    <main className="container">
      <h2>Order placed!</h2>
      <p>Thank you. We will contact you to confirm your order.</p>
      <Link to="/">Continue shopping</Link>
      <Link to="/my-orders">View my orders</Link>
    </main>
  );
}