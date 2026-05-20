import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function TrackOrder() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderStatus();
  }, [orderNumber]);

  const fetchOrderStatus = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/${orderNumber}/track`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(response.data);
    } catch (error) {
      setError('Order not found');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    return steps.indexOf(status.toLowerCase());
  };

  if (loading) {
    return <div className="loading">Tracking order...</div>;
  }

  if (error) {
    return (
      <div className="cart-container" style={{ textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <p>{error}</p>
        <Link to="/orders" className="btn" style={{ marginTop: '20px', display: 'inline-block', width: 'auto' }}>
          View My Orders
        </Link>
      </div>
    );
  }

  const currentStep = getStatusStep(order.status);
  const steps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

  return (
    <div className="cart-container">
      <h2>Track Your Order</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <p><strong>Order Number:</strong> {order.order_number}</p>
        <p><strong>Tracking Number:</strong> {order.tracking_number}</p>
        <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginBottom: '30px',
        position: 'relative'
      }}>
        {steps.map((step, index) => (
          <div key={index} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: index <= currentStep ? '#27ae60' : '#e0e0e0',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px',
              fontWeight: 'bold'
            }}>
              {index + 1}
            </div>
            <div style={{ fontWeight: index <= currentStep ? 'bold' : 'normal' }}>
              {step}
            </div>
            {index === currentStep && (
              <div style={{ 
                color: '#27ae60', 
                fontSize: '0.85rem', 
                marginTop: '5px' 
              }}>
                ✓ Current Status
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        marginTop: '20px'
      }}>
        <h3>Delivery Information</h3>
        <p>Your order is <strong>{order.status}</strong></p>
        {order.status === 'delivered' && (
          <p style={{ color: '#27ae60' }}>✓ Order has been delivered successfully!</p>
        )}
        {order.status === 'shipped' && (
          <p>📦 Your package is on the way!</p>
        )}
        {order.status === 'processing' && (
          <p>⚙️ We're preparing your order for shipment.</p>
        )}
      </div>
      
      <Link to="/orders" className="btn btn-outline" style={{ marginTop: '20px', display: 'inline-block', width: 'auto' }}>
        ← Back to Orders
      </Link>
    </div>
  );
}

export default TrackOrder;