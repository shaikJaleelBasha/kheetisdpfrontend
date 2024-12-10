import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/EditProduct.css';
import Navbar from '../components/NavBar';

const EditProductPage = () => {
  const { farmerId, productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/farmers/${farmerId}/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        setError('Failed to fetch product details.');
      }
    } catch (err) {
      setError('An error occurred while fetching product details.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/farmers/${farmerId}/edit-product/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (response.ok) {
        alert('Product updated successfully!');
        navigate(`/farmers/products/${farmerId}`);
      } else {
        alert('Failed to update product.');
      }
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="edit-product-page">
    <Navbar/>
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={product.name} disabled />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
    </div>
  );
};

export default EditProductPage;
