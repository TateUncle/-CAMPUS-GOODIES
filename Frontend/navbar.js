import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Navbar({ isAuthenticated, user, onLogout }) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount();
      
      // Set up interval to refresh cart count every 30 seconds
      const interval = setInterval(fetchCartCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchCartCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const count = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🎓 Campus <span>Goodies</span>
      </Link>
      {isAuthenticated && (
        <div className="navbar-nav">
          <Link to="/" className="nav-link">🏠 Products</Link>
          <Link to="/cart" className="nav-link cart-icon">
            🛒 Cart {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          <Link to="/orders" className="nav-link">📦 My Orders</Link>
          <span className="user-info">👋 Hi, {user?.full_name || user?.username}</span>
          <button onClick={onLogout} className="logout-btn">🚪 Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;