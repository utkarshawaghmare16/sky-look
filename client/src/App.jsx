import { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Cart from './pages/Cart.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import MyOrders from './pages/MyOrders.jsx';
import Admin from './pages/Admin.jsx';
import AdminOrders from './pages/AdminOrders.jsx';
import Services from './pages/Services.jsx';
import Book from './pages/Book.jsx';
import MyBookings from './pages/MyBookings.jsx';
import AdminBookings from './pages/AdminBookings.jsx';
import { useAuth } from './AuthContext.jsx';
import AdminGallery from './pages/AdminGallery.jsx';
import Gallery from './pages/Gallery.jsx';
import Footer from './components/Footer.jsx';
import './App.css';

export default function App() {
  const { user, logout } = useAuth();

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  function addToCart(product) {
    const found = cart.find((item) => item._id === product._id);
    if (found) {
      setCart(
        cart.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  }

  function changeQty(id, change) {
    setCart(
      cart
        .map((item) => (item._id === id ? { ...item, qty: item.qty + change } : item))
        .filter((item) => item.qty > 0)
    );
  }

  function removeItem(id) {
    setCart(cart.filter((item) => item._id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div>
      <header className="header">
        <Link to="/">Sky Look Decor</Link>
        <nav className="nav">
          {user ? (
            <>
              <span>Hi, {user.name}</span>
              <Link to="/my-orders">My Orders</Link>
              <Link to="/my-bookings">My Bookings</Link>
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
              <button className="logout" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          <Link to="/services">Events</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/cart">Cart ({totalItems})</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route
          path="/cart"
          element={<Cart cart={cart} changeQty={changeQty} removeItem={removeItem} />}
        />
        <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/services" element={<Services />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/book" element={<Book />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/gallery" element={<AdminGallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
            <Footer />
    </div>
  );
}