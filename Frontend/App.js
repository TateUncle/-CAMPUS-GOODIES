import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Orders from './components/Orders';
import TrackOrder from './components/TrackOrder';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
        <div className="container">
          <Routes>
            <Route path="/login" element={
              !isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />
            } />
            <Route path="/register" element={
              !isAuthenticated ? <Register onRegister={handleLogin} /> : <Navigate to="/" />
            } />
            <Route path="/" element={
              isAuthenticated ? <ProductList /> : <Navigate to="/login" />
            } />
            <Route path="/cart" element={
              isAuthenticated ? <Cart /> : <Navigate to="/login" />
            } />
            <Route path="/orders" element={
              isAuthenticated ? <Orders /> : <Navigate to="/login" />
            } />
            <Route path="/track/:orderNumber" element={
              isAuthenticated ? <TrackOrder /> : <Navigate to="/login" />
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;