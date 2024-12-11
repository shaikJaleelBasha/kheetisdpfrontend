import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/HomePage.css';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId'); // Fetch logged-in user ID
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError('Failed to load products.');
      }
    } catch (err) {
      setError('An error occurred while fetching products.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    if (!userId) {
      alert('Please log in to add products to your cart.');
      return;
    }

    const cartItem = {
      userId,
      product: { id: productId },
      quantity: 1,
    };

    try {
      const response = await fetch('http://localhost:8080/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        alert('Product added to cart successfully.');
        navigate(`/cart/${userId}`); // Navigate to Cart page
      } else {
        const errorData = await response.json();
        alert(`Error adding to cart: ${errorData.message}`);
      }
    } catch (err) {
      alert('Error adding product to cart.');
    }
  };

  const redirectToBuyPage = (productId) => {
    if (!userId) {
      alert('Please log in to buy a product.');
      return;
    }
    navigate(`/buy/${productId}`); // Navigate to the Buy Product page
  };

  return (
    <div className="homepage-container">
      <Navbar />
      <section className="hero">
        <h1>Welcome to Kheeti!</h1>
        <p>Explore fresh and high-quality products from our farmers.</p>
      </section>
      <section className="products">
        <h2>Available Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="product-grid">
            {products.length === 0 ? (
              <p>No products available. Please check back later!</p>
            ) : (
              products.map((product) => (
                <div className="product-card" key={product.id}>
                  <img
                    src={product.imageUrl ? `http://localhost:8080/${product.imageUrl}` : 'https://via.placeholder.com/150'}
                    alt={product.name}
                    className="product-image"
                  />
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="product-price">₹{product.price}</p>
                  <p className="product-category">Category: {product.category}</p>
                  <button
                    className="add-to-cart-button"
                    onClick={() => addToCart(product.id)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="buy-button"
                    onClick={() => redirectToBuyPage(product.id)}
                  >
                    Buy Now
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
