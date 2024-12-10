import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams for dynamic routing
import './css/AddProductScreen.css';
import Navbar from '../components/NavBar';

const AddProductScreen = () => {
  const { farmerId } = useParams(); // Get farmerId from the URL
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null); // For image preview
  const [products, setProducts] = useState([]); // To store the list of products
  const [isLoading, setIsLoading] = useState(false); // Loading indicator
  const [errorMessage, setErrorMessage] = useState(''); // For error messages
  const [successMessage, setSuccessMessage] = useState(''); // For success messages

  // Fetch the list of products for the logged-in farmer
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/api/farmers/${farmerId}/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setErrorMessage('Failed to fetch products. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching products.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!farmerId) {
      navigate('/farmer-login'); // Redirect to login if farmerId is missing
    } else {
      fetchProducts();
    }
  }, [farmerId, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle image file changes
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct({ ...product, image: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('category', product.category);
      formData.append('image', product.image);

      const response = await fetch(`http://localhost:8080/api/farmers/${farmerId}/add-product`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccessMessage('Product added successfully!');
        setProduct({
          name: '',
          description: '',
          price: '',
          category: '',
          image: null,
        });
        setImagePreview(null);
        fetchProducts();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to add product.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while adding the product.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <Navbar />
      <div className="add-product-content">
        <h2>Add New Product</h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <form className="add-product-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="form-group">
            <label>Product Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Enter product description"
              required
            />
          </div>

          <div className="form-group">
            <label>Product Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Enter product price"
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Product Category</label>
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              placeholder="Enter product category"
              required
            />
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <input type="file" onChange={handleImageChange} accept="image/*" required />
            {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>

        <div className="product-list">
          <h3>Your Products</h3>
          {isLoading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products added yet.</p>
          ) : (
            <ul>
              {products.map((prod) => (
                <li key={prod.id}>
                  <h4>{prod.name}</h4>
                  <p>{prod.description}</p>
                  <p>Price: ${prod.price}</p>
                  <p>Category: {prod.category}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProductScreen;
