import  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/NavBar';
import './css/SoldProductsPage.css';

const SoldProductsPage = () => {
  const { farmerId } = useParams();
  const [soldProducts, setSoldProducts] = useState([]);
  const [newSoldProduct, setNewSoldProduct] = useState({
    productName: '',
    soldPrice: '',
    quantity: '',
    soldDate: '',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchSoldProducts();
  }, []);

  const fetchSoldProducts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/farmers/sold-products/${farmerId}`);
      if (response.ok) {
        const data = await response.json();
        setSoldProducts(data);
      } else {
        setError('Failed to fetch sold products');
      }
    } catch (error) {
      setError('An error occurred while fetching sold products');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSoldProduct({ ...newSoldProduct, [name]: value });
  };

  const handleAddSoldProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/api/farmers/sold-products/${farmerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSoldProduct),
      });

      if (response.ok) {
        const addedProduct = await response.json();
        setSoldProducts([...soldProducts, addedProduct]);
        setSuccessMessage('Sold product added successfully!');
        setNewSoldProduct({ productName: '', soldPrice: '', quantity: '', soldDate: '' });
      } else {
        setError('Failed to add sold product');
      }
    } catch (error) {
      setError('An error occurred while adding the sold product');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="sold-products-container">
        <h2>Sold Products</h2>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <form onSubmit={handleAddSoldProduct} className="sold-product-form">
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              value={newSoldProduct.productName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Sold Price</label>
            <input
              type="number"
              name="soldPrice"
              value={newSoldProduct.soldPrice}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={newSoldProduct.quantity}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Sold Date</label>
            <input
              type="date"
              name="soldDate"
              value={newSoldProduct.soldDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Add Sold Product</button>
        </form>

        <div className="sold-products-list">
          <h3>Your Sold Products</h3>
          {soldProducts.length === 0 ? (
            <p>No sold products found.</p>
          ) : (
            <ul>
              {soldProducts.map((product) => (
                <li key={product.id}>
                  <p>
                    <strong>{product.productName}</strong> - {product.quantity} units sold for ${product.soldPrice} on {product.soldDate}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoldProductsPage;
