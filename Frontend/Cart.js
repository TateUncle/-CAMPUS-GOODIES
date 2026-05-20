import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FREE_DELIVERY_THRESHOLD = 100;

function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState({
    shipping_address: '',
    payment_method: 'card'
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/cart/${itemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (error) {
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (error) {
      alert('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    if (!checkoutData.shipping_address) {
      alert('Please enter your shipping address');
      return;
    }

    setProcessing(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:5000/api/orders',
        checkoutData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(`Order placed successfully!\nOrder Number: ${response.data.order.order_number}\nTracking: ${response.data.order.tracking_number}\n${response.data.order.free_delivery_applied ? '✓ Free delivery applied!' : ''}`);
      
      // Clear cart in UI
      setCart({ items: [], total: 0 });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  const deliveryFee = cart.total > FREE_DELIVERY_THRESHOLD ? 0 : 10;
  const finalTotal = cart.total + deliveryFee;

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="cart-container" style={{ textAlign: 'center' }}>
        <h2>Your Cart is Empty 🛒</h2>
        <p style={{ marginTop: '20px' }}>Start shopping to add items to your cart!</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      
      {cart.items.map(item => (
        <div key={item.id} className="cart-item">
          <div className="cart-item-info">
            <div className="cart-item-title">{item.name}</div>
            <div className="cart-item-price">${item.price.toFixed(2)}</div>
          </div>
          <div className="cart-item-quantity">
            <button 
              className="quantity-btn"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              -
            </button>
            <span style={{ minWidth: '40px', textAlign: 'center' }}>{item.quantity}</span>
            <button 
              className="quantity-btn"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
            <button 
              className="remove-btn"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      
      <div className="cart-summary">
        <h3>Order Summary</h3>
        <p>Subtotal: ${cart.total.toFixed(2)}</p>
        <div className="delivery-info">
          {cart.total > FREE_DELIVERY_THRESHOLD ? (
            <p className="free-delivery">✓ Free Delivery Applied!</p>
          ) : (
            <p>Delivery Fee: ${deliveryFee.toFixed(2)}</p>
          )}
          {cart.total < FREE_DELIVERY_THRESHOLD && (
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Add ${(FREE_DELIVERY_THRESHOLD - cart.total).toFixed(2)} more for free delivery!
            </p>
          )}
        </div>
        <h3>Total: ${finalTotal.toFixed(2)}</h3>
        
        <div className="checkout-form">
          <div className="form-group">
            <label>Shipping Address</label>
            <textarea
              value={checkoutData.shipping_address}
              onChange={(e) => setCheckoutData({...checkoutData, shipping_address: e.target.value})}
              placeholder="Enter your complete shipping address"
              required
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>Payment Method</label>
            <div className="payment-methods">
              <label className={`payment-method ${checkoutData.payment_method === 'card' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="card"
                  checked={checkoutData.payment_method === 'card'}
                  onChange={(e) => setCheckoutData({...checkoutData, payment_method: e.target.value})}
                />
                💳 Credit/Debit Card
              </label>
              <label className={`payment-method ${checkoutData.payment_method === 'mobile' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="mobile"
                  checked={checkoutData.payment_method === 'mobile'}
                  onChange={(e) => setCheckoutData({...checkoutData, payment_method: e.target.value})}
                />
                📱 Mobile Money
              </label>
            </div>
          </div>
          
          <button 
            className="btn btn-secondary" 
            onClick={handleCheckout}
            disabled={processing}
          >
            {processing ? 'Processing...' : `Place Order • $${finalTotal.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;