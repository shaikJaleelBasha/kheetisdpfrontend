import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../pages/css/BuyPage.css';

const BuyPage = () => {
  const { productId } = useParams(); // Get productId from route parameters
  const [product, setProduct] = useState(null);
  const userId = localStorage.getItem('userId'); // Get logged-in user ID
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductDetails();
  }, []);

  // Fetch product details by ID
  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/product/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        alert('Failed to fetch product details.');
      }
    } catch (err) {
      alert('Error fetching product details.');
    }
  };

  // Handle Buy Now action with a specific payment method
  const handleBuyNow = async (paymentMethod) => {
    if (!userId) {
      alert('Please log in to proceed with the purchase.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/payments/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, paymentMethod }),
      });

      if (response.ok) {
        alert('Purchase successful!');
        navigate(`/orders/${userId}`); // Redirect to Orders page
      } else {
        const errorData = await response.json();
        alert(`Purchase failed: ${errorData.message}`);
      }
    } catch (err) {
      alert('Error processing payment.');
    }
  };

  return (
    <div>
      <Navbar />
      {product ? (
        <div className="buy-container">
          <img
            src={`http://localhost:8080/${product.imageUrl || 'default-image.jpg'}`}
            alt={product.name}
            className="buy-product-image"
          />
          <div className="buy-details">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Category: {product.category}</p>
            <p>Price: ₹{product.price}</p>
            <div className="buy-actions">
              <button onClick={() => handleBuyNow('Card')}>Pay with Card</button>
              <button onClick={() => handleBuyNow('UPI')}>Pay with UPI</button>
              <button onClick={() => handleBuyNow('NetBanking')}>Pay with Net Banking</button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
};

export default BuyPage;
