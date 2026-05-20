import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      default: return 'status-pending';
    }
  };

  if (loading) {
    return <div className="loading">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="cart-container" style={{ textAlign: 'center' }}>
        <h2>No Orders Yet 📦</h2>
        <p style={{ marginTop: '20px' }}>Start shopping to place your first order!</p>
        <Link to="/" className="btn" style={{ marginTop: '20px', display: 'inline-block', width: 'auto' }}>
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>My Orders</h2>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <span className="order-number">Order #{order.order_number}</span>
                {order.consolidated_group_id && (
                  <span className="consolidated-badge">
                    📦 Consolidated Shipment
                  </span>
                )}
              </div>
              <div>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <strong>Date:</strong> {new Date(order.order_date).toLocaleDateString()}
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <strong>Items:</strong> {order.product_names || `${order.item_count} item(s)`}
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <strong>Total:</strong> ${parseFloat(order.total_amount).toFixed(2)}
              {order.delivery_fee === 0 && (
                <span style={{ color: '#27ae60', marginLeft: '10px' }}>(Free Delivery)</span>
              )}
            </div>
            
            {order.tracking_number && (
              <Link to={`/track/${order.order_number}`} className="track-link">
                🔍 Track Order → 
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;