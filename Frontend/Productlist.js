import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      let url = 'http://localhost:5000/api/products';
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const addToCart = async (productId) => {
    setAddingToCart({ ...addingToCart, [productId]: true });
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/cart', 
        { product_id: productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Item added to cart successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add item to cart');
    } finally {
      setAddingToCart({ ...addingToCart, [productId]: false });
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div>
      <div className="search-filter">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {products.length === 0 ? (
        <div className="loading">No products found</div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image" style={{
                background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem'
              }}>
                🎁
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>
                  {product.category_name}
                </p>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <p className="product-stock">
                  {product.stock_quantity > 0 ? `✓ In Stock (${product.stock_quantity})` : '✗ Out of Stock'}
                </p>
                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product.id)}
                  disabled={product.stock_quantity === 0 || addingToCart[product.id]}
                >
                  {addingToCart[product.id] ? 'Adding...' : 'Add to Cart 🛒'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;