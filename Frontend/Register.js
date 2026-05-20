import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    student_id: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await axios.post('http://localhost:5000/api/register', registerData);
      onRegister(response.data.token, { 
        id: response.data.userId, 
        username: registerData.username,
        full_name: registerData.full_name 
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account 🎓</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
        Join Campus Goodies and enjoy student benefits!
      </p>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Choose a username"
          />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your.email@university.com"
          />
        </div>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>
        <div className="form-group">
          <label>Student ID</label>
          <input
            type="text"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            placeholder="Your student ID number"
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Contact number"
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Your delivery address"
            rows="2"
          />
        </div>
        <div className="form-group">
          <label>Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Minimum 6 characters"
          />
        </div>
        <div className="form-group">
          <label>Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Already have an account? <Link to="/login" style={{ color: '#667eea' }}>Login here</Link>
      </p>
    </div>
  );
}

export default Register;