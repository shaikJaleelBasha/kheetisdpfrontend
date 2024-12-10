import './css/FarmerRegister.css';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation and useNavigate for redirection
import { useState } from 'react';

function FarmerRegister() {
  const [farmerData, setFarmerData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    isApproved: false, // Default to false for admin approval later
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFarmerData({ ...farmerData, [name]: value });
    setError(null); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/farmers/farmer-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(farmerData), // Send the farmer data including isApproved
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${errorText}`);
      }

      const result = await response.text(); // Expect a string response
      setSuccess(result); // Set the success message

      // Reset the form and error/success states after a short delay
      setTimeout(() => {
        setFarmerData({
          username: '',
          email: '',
          password: '',
          phoneNumber: '',
          isApproved: false, // Reset to default
        });
        setError(null); // Clear previous errors
        setSuccess(null); // Clear success after some time
      }, 2000);

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/farmer-login');
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <div className="register-box">
        <h2>Register as Farmer</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={farmerData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={farmerData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={farmerData.password}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={farmerData.phoneNumber}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
        
        <p>
          Already have an account? <Link to="/farmer-login" className="login-link">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default FarmerRegister;
